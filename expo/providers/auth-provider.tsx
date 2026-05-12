import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

const AUTH_URL = process.env.EXPO_PUBLIC_RORK_AUTH_URL ?? "";
const APP_KEY = process.env.EXPO_PUBLIC_RORK_APP_KEY ?? "";
const PROJECT_ID = process.env.EXPO_PUBLIC_PROJECT_ID ?? "";

const SESSION_COUNT_KEY = "todi.auth.sessionCount.v1";
const PROMPT_DISMISSED_KEY = "todi.auth.softPromptDismissed.v1";
const ACCESS_TOKEN_KEY = "todi.auth.access_token";
const REFRESH_TOKEN_KEY = "todi.auth.refresh_token";

const SOFT_PROMPT_THRESHOLD = 3;

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  provider?: "google" | "apple";
};

export type AuthProvider_t = "google" | "apple";

type StoredTokens = {
  access_token: string;
  refresh_token: string;
  user: AuthUser;
};

function generateCodeVerifier(): string {
  const bytes = new Uint8Array(32);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  let str = "";
  for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i]);
  return btoa(str)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  try {
    const data = new TextEncoder().encode(verifier);
    const hash = await crypto.subtle.digest("SHA-256", data);
    let str = "";
    const arr = new Uint8Array(hash);
    for (let i = 0; i < arr.length; i++) str += String.fromCharCode(arr[i]);
    return btoa(str)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  } catch (e) {
    console.log("[Auth] code challenge fallback", e);
    return verifier;
  }
}

function userFromToken(token: string): AuthUser | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64)) as {
      sub?: string;
      email?: string;
      name?: string;
      picture?: string;
      exp?: number;
      provider?: "google" | "apple";
    };
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    return {
      id: payload.sub ?? "",
      email: payload.email ?? "",
      name: payload.name,
      picture: payload.picture,
      provider: payload.provider,
    };
  } catch {
    return null;
  }
}

async function setSecure(key: string, value: string): Promise<void> {
  if (Platform.OS === "web") {
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      console.log("[Auth] localStorage set failed", e);
    }
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function getSecure(key: string): Promise<string | null> {
  if (Platform.OS === "web") {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  return await SecureStore.getItemAsync(key);
}

async function deleteSecure(key: string): Promise<void> {
  if (Platform.OS === "web") {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // noop
    }
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [sessionCount, setSessionCount] = useState<number>(0);
  const [promptDismissed, setPromptDismissed] = useState<boolean>(false);

  const codeVerifierRef = useRef<string | null>(null);
  const initRef = useRef<boolean>(false);

  const exchangeCode = useCallback(async (code: string) => {
    const verifier = codeVerifierRef.current;
    if (!verifier) return;
    codeVerifierRef.current = null;

    try {
      const response = await fetch(`${AUTH_URL}/oauth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          app_key: APP_KEY,
          code,
          code_verifier: verifier,
        }),
      });

      if (!response.ok) {
        const body = (await response
          .json()
          .catch(() => ({}))) as { error?: string };
        const message =
          body.error ?? `Token exchange failed (${response.status})`;
        console.log("[Auth] token exchange failed", response.status, body);
        setError(message);
        return;
      }

      const data = (await response.json()) as StoredTokens;
      await setSecure(ACCESS_TOKEN_KEY, data.access_token);
      await setSecure(REFRESH_TOKEN_KEY, data.refresh_token);
      setUser(data.user);
      console.log("[Auth] signed in", data.user.email);
    } catch (e) {
      console.log("[Auth] exchange error", e);
      setError(e instanceof Error ? e.message : "Sign in failed");
    }
  }, []);

  const signOut = useCallback(async () => {
    console.log("[Auth] signOut");
    await deleteSecure(ACCESS_TOKEN_KEY);
    await deleteSecure(REFRESH_TOKEN_KEY);
    setUser(null);
  }, []);

  const refreshToken = useCallback(async () => {
    const stored = await getSecure(REFRESH_TOKEN_KEY);
    if (!stored) {
      setUser(null);
      return;
    }
    try {
      const response = await fetch(`${AUTH_URL}/oauth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ app_key: APP_KEY, refresh_token: stored }),
      });
      if (!response.ok) {
        await signOut();
        return;
      }
      const data = (await response.json()) as { access_token: string };
      await setSecure(ACCESS_TOKEN_KEY, data.access_token);
      const decoded = userFromToken(data.access_token);
      if (decoded) setUser(decoded);
    } catch (e) {
      console.log("[Auth] refresh failed", e);
      await signOut();
    }
  }, [signOut]);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    (async () => {
      try {
        const [tokensRaw, countRaw, dismissedRaw] = await Promise.all([
          getSecure(ACCESS_TOKEN_KEY),
          AsyncStorage.getItem(SESSION_COUNT_KEY),
          AsyncStorage.getItem(PROMPT_DISMISSED_KEY),
        ]);

        const parsedCount = countRaw ? parseInt(countRaw, 10) : 0;
        const safeCount = Number.isFinite(parsedCount) ? parsedCount : 0;
        const nextCount = safeCount + 1;
        setSessionCount(nextCount);
        AsyncStorage.setItem(SESSION_COUNT_KEY, String(nextCount)).catch(
          (e) => {
            console.log("[Auth] session persist failed", e);
          }
        );
        setPromptDismissed(dismissedRaw === "1");

        if (tokensRaw) {
          const decoded = userFromToken(tokensRaw);
          if (decoded) {
            setUser(decoded);
          } else {
            await refreshToken();
          }
        } else {
          const refreshStored = await getSecure(REFRESH_TOKEN_KEY);
          if (refreshStored) await refreshToken();
        }
      } catch (e) {
        console.log("[Auth] init failed", e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [refreshToken]);

  useEffect(() => {
    const sub = Linking.addEventListener("url", (event) => {
      try {
        const url = new URL(event.url);
        if (url.pathname === "/auth/callback") {
          const code = url.searchParams.get("code");
          if (code) {
            exchangeCode(code).catch((e) => {
              console.log("[Auth] deeplink exchange failed", e);
            });
          }
        }
      } catch (e) {
        console.log("[Auth] deeplink parse failed", e);
      }
    });
    return () => sub.remove();
  }, [exchangeCode]);

  const signIn = useCallback(
    async (provider: AuthProvider_t): Promise<boolean> => {
      if (!AUTH_URL || !APP_KEY) {
        setError("Auth is not configured.");
        return false;
      }
      setIsSigningIn(true);
      setError(null);
      try {
        const verifier = generateCodeVerifier();
        const challenge = await generateCodeChallenge(verifier);
        codeVerifierRef.current = verifier;

        const isWeb = Platform.OS === "web";
        const env = isWeb ? "preview" : "native";

        const response = await fetch(`${AUTH_URL}/oauth/initiate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            app_key: APP_KEY,
            provider,
            code_challenge: challenge,
            target: "rn",
            env,
          }),
        });

        if (!response.ok) {
          codeVerifierRef.current = null;
          const body = (await response
            .json()
            .catch(() => ({}))) as { error?: string };
          const message =
            body.error ?? `Sign in failed (${response.status})`;
          setError(message);
          return false;
        }

        const { auth_url } = (await response.json()) as { auth_url: string };

        if (isWeb && typeof window !== "undefined") {
          const popup = window.open(
            auth_url,
            "_blank",
            "width=500,height=650"
          );
          await new Promise<void>((resolve) => {
            const onMessage = (ev: MessageEvent) => {
              const data = ev.data as
                | { type?: string; code?: string }
                | undefined;
              if (data?.type !== "rork_auth_callback") return;
              window.removeEventListener("message", onMessage);
              clearInterval(pollTimer);
              if (data.code) {
                exchangeCode(data.code).then(resolve, () => resolve());
              } else {
                resolve();
              }
            };
            window.addEventListener("message", onMessage);
            const pollTimer = setInterval(() => {
              if (popup?.closed) {
                clearInterval(pollTimer);
                window.removeEventListener("message", onMessage);
                codeVerifierRef.current = null;
                resolve();
              }
            }, 500);
          });
        } else {
          const result = await WebBrowser.openAuthSessionAsync(
            auth_url,
            `rork-${PROJECT_ID}://auth/callback`
          );
          if (result.type === "success") {
            const url = new URL(result.url);
            const code = url.searchParams.get("code");
            if (code) await exchangeCode(code);
          }
        }

        return true;
      } catch (e) {
        console.log("[Auth] signIn failed", e);
        setError(e instanceof Error ? e.message : "Sign in failed");
        return false;
      } finally {
        setIsSigningIn(false);
      }
    },
    [exchangeCode]
  );

  const dismissSoftPrompt = useCallback(() => {
    console.log("[Auth] soft prompt dismissed");
    setPromptDismissed(true);
    AsyncStorage.setItem(PROMPT_DISMISSED_KEY, "1").catch((e) => {
      console.log("[Auth] dismiss persist failed", e);
    });
  }, []);

  const resetSoftPrompt = useCallback(() => {
    setPromptDismissed(false);
    AsyncStorage.removeItem(PROMPT_DISMISSED_KEY).catch(() => {});
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const isGuest = user === null;
  const showSoftPrompt =
    isGuest && !promptDismissed && sessionCount >= SOFT_PROMPT_THRESHOLD;

  return {
    user,
    isGuest,
    isLoading,
    isSigningIn,
    error,
    sessionCount,
    showSoftPrompt,
    signIn,
    signOut,
    dismissSoftPrompt,
    resetSoftPrompt,
    clearError,
  };
});

import { LinearGradient } from "expo-linear-gradient";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Apple, Check, ChevronLeft, Cloud, Crown, Shield, Zap } from "lucide-react-native";
import React, { useCallback, useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useAuth } from "@/providers/auth-provider";

const SOPHIE_URL =
  "https://r2-pub.rork.com/generated-images/eab16f78-a353-4d8f-90e5-8cf7be9db68b.png";

type Reason = "premium" | "soft" | "manual";

function GoogleGlyph() {
  return (
    <View style={styles.gGlyph} testID="g-glyph">
      <Text style={styles.gGlyphTxt}>G</Text>
    </View>
  );
}

export default function SignInScreen() {
  const { width } = useWindowDimensions();
  const sophieSize = Math.min(width * 0.3, 132);

  const params = useLocalSearchParams<{ reason?: string; redirect?: string }>();
  const rawReason = (params.reason ?? "manual") as Reason;
  const reason: Reason = useMemo(() => {
    if (rawReason === "premium" || rawReason === "soft") return rawReason;
    return "manual";
  }, [rawReason]);

  const { user, signIn, isSigningIn, error, clearError } = useAuth();

  const goBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/home");
  }, []);

  useEffect(() => {
    if (user) {
      const redirect = params.redirect;
      if (typeof redirect === "string" && redirect.length > 0) {
        router.replace(redirect as never);
        return;
      }
      goBack();
    }
  }, [user, params.redirect, goBack]);

  const onGoogle = useCallback(() => {
    console.log("[SignIn] google tapped");
    clearError();
    signIn("google").catch((e) => console.log("[SignIn] google fail", e));
  }, [signIn, clearError]);

  const onApple = useCallback(() => {
    console.log("[SignIn] apple tapped");
    clearError();
    signIn("apple").catch((e) => console.log("[SignIn] apple fail", e));
  }, [signIn, clearError]);

  const onSkip = useCallback(() => {
    console.log("[SignIn] skip");
    if (reason === "premium") {
      goBack();
      return;
    }
    goBack();
  }, [goBack, reason]);

  const headline = useMemo(() => {
    if (reason === "premium") return "Sign in to unlock\nPremium";
    if (reason === "soft") return "Save your progress\nin the cloud";
    return "Sign in to TODI";
  }, [reason]);

  const sub = useMemo(() => {
    if (reason === "premium")
      return "We'll link your Premium purchase to your account so it's safe across devices.";
    if (reason === "soft")
      return "Streaks, XP and revision priority — synced everywhere you learn.";
    return "Optional. Your progress is already saved on this device.";
  }, [reason]);

  const benefits = useMemo(
    () => [
      { icon: <Cloud color={Colors.black} size={16} strokeWidth={2.8} />, label: "Sync XP & streaks across devices" },
      { icon: <Shield color={Colors.black} size={16} strokeWidth={2.8} />, label: "Never lose your revision priority" },
      { icon: <Crown color={Colors.black} size={16} strokeWidth={2.8} fill={Colors.black} />, label: "Required only for Premium purchase" },
      { icon: <Zap color={Colors.black} size={16} strokeWidth={2.8} fill={Colors.black} />, label: "Takes 5 seconds, no password" },
    ],
    []
  );

  return (
    <View style={styles.root} testID="signin-root">
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.bgBlob1} pointerEvents="none" />
      <View style={styles.bgBlob2} pointerEvents="none" />

      <SafeAreaView edges={["top"]} style={styles.safe}>
        <View style={styles.topBar}>
          <Pressable
            onPress={goBack}
            style={({ pressed }) => [
              styles.backBtn,
              pressed && { transform: [{ scale: 0.96 }] },
            ]}
            hitSlop={10}
            testID="signin-back"
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <ChevronLeft color={Colors.black} size={22} strokeWidth={2.8} />
          </Pressable>
          <Text style={styles.topTitle}>SIGN IN</Text>
          <View style={styles.backBtnSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <View
              style={[
                styles.sophieWrap,
                { width: sophieSize, height: sophieSize },
              ]}
            >
              <View
                style={[
                  styles.sophieHalo,
                  {
                    width: sophieSize,
                    height: sophieSize,
                    borderRadius: sophieSize / 2,
                  },
                ]}
              />
              <Image
                source={{ uri: SOPHIE_URL }}
                style={{ width: sophieSize * 1.08, height: sophieSize * 1.08 }}
                resizeMode="contain"
                testID="sophie-signin"
              />
            </View>

            {reason === "premium" && (
              <View style={styles.kickerPill}>
                <Crown
                  color={Colors.black}
                  size={12}
                  strokeWidth={2.8}
                  fill={Colors.black}
                />
                <Text style={styles.kickerPillTxt}>PREMIUM CHECK-IN</Text>
              </View>
            )}
            {reason === "soft" && (
              <View style={[styles.kickerPill, { backgroundColor: Colors.cream }]}>
                <Cloud color={Colors.black} size={12} strokeWidth={2.8} />
                <Text style={styles.kickerPillTxt}>BACK UP YOUR PROGRESS</Text>
              </View>
            )}

            <Text style={styles.title}>{headline}</Text>
            <Text style={styles.subtitle}>{sub}</Text>
          </View>

          <View style={styles.benefitsCard}>
            {benefits.map((b, i) => (
              <View
                key={b.label}
                style={[
                  styles.benefitRow,
                  i !== benefits.length - 1 && styles.benefitDivider,
                ]}
              >
                <View style={styles.benefitIcon}>{b.icon}</View>
                <Text style={styles.benefitTxt}>{b.label}</Text>
                <Check color={Colors.muted} size={14} strokeWidth={2.6} />
              </View>
            ))}
          </View>

          {error && (
            <View style={styles.errorCard} testID="signin-error">
              <Text style={styles.errorTxt}>{error}</Text>
              <Pressable onPress={clearError} hitSlop={8}>
                <Text style={styles.errorDismiss}>Dismiss</Text>
              </Pressable>
            </View>
          )}

          <View style={styles.btnGroup}>
            <Pressable
              onPress={onGoogle}
              disabled={isSigningIn}
              style={({ pressed }) => [
                styles.btn,
                styles.btnGoogle,
                pressed && { transform: [{ scale: 0.985 }] },
                isSigningIn && { opacity: 0.7 },
              ]}
              testID="btn-google"
              accessibilityRole="button"
              accessibilityLabel="Sign in with Google"
            >
              <GoogleGlyph />
              <Text style={styles.btnGoogleTxt}>
                {isSigningIn ? "Opening Google…" : "Continue with Google"}
              </Text>
              {isSigningIn && (
                <ActivityIndicator size="small" color={Colors.black} />
              )}
            </Pressable>

            {Platform.OS !== "android" && (
              <Pressable
                onPress={onApple}
                disabled={isSigningIn}
                style={({ pressed }) => [
                  styles.btn,
                  styles.btnApple,
                  pressed && { transform: [{ scale: 0.985 }] },
                  isSigningIn && { opacity: 0.7 },
                ]}
                testID="btn-apple"
                accessibilityRole="button"
                accessibilityLabel="Sign in with Apple"
              >
                <LinearGradient
                  colors={[Colors.black, "#2A2A2A"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFillObject}
                />
                <Apple
                  color={Colors.warmWhite}
                  size={22}
                  strokeWidth={2.4}
                  fill={Colors.warmWhite}
                />
                <Text style={styles.btnAppleTxt}>Continue with Apple</Text>
              </Pressable>
            )}
          </View>

          {reason !== "premium" && (
            <Pressable
              onPress={onSkip}
              style={({ pressed }) => [
                styles.skip,
                pressed && { opacity: 0.6 },
              ]}
              testID="signin-skip"
              accessibilityRole="button"
              accessibilityLabel="Continue as guest"
            >
              <Text style={styles.skipTxt}>Continue as guest</Text>
            </Pressable>
          )}

          <Text style={styles.legal}>
            By continuing you agree to our Terms & Privacy. We{"\u2019"}ll only use your account to sync progress and verify Premium.
          </Text>

          <View style={{ height: 24 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.warmWhite, overflow: "hidden" },
  safe: { flex: 1 },
  bgBlob1: {
    position: "absolute",
    top: -160,
    right: -120,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: Colors.yellow,
    opacity: 0.28,
  },
  bgBlob2: {
    position: "absolute",
    bottom: -140,
    left: -120,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: Colors.cream,
    opacity: 0.55,
  },
  topBar: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.warmWhite,
    borderWidth: 2,
    borderColor: Colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnSpacer: { width: 44, height: 44 },
  topTitle: {
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 2,
    color: Colors.black,
  },
  scroll: { paddingHorizontal: 22, paddingTop: 4, paddingBottom: 24 },
  hero: { alignItems: "center", marginTop: 4 },
  sophieWrap: { alignItems: "center", justifyContent: "center" },
  sophieHalo: {
    position: "absolute",
    backgroundColor: Colors.yellow,
  },
  kickerPill: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: Colors.yellow,
    borderWidth: 2,
    borderColor: Colors.black,
  },
  kickerPillTxt: {
    fontSize: 11,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: 1.4,
  },
  title: {
    marginTop: 14,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: -1.1,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 10,
    paddingHorizontal: 8,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
    color: Colors.ink,
    textAlign: "center",
  },
  benefitsCard: {
    marginTop: 22,
    backgroundColor: Colors.warmWhite,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Colors.black,
    paddingHorizontal: 14,
  },
  benefitRow: {
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  benefitDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
  },
  benefitIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.black,
    backgroundColor: Colors.cream,
    alignItems: "center",
    justifyContent: "center",
  },
  benefitTxt: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: Colors.black,
    letterSpacing: -0.1,
  },
  errorCard: {
    marginTop: 16,
    backgroundColor: "#FEE2E2",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#DC2626",
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  errorTxt: {
    flex: 1,
    color: "#7F1D1D",
    fontSize: 13,
    fontWeight: "700",
  },
  errorDismiss: {
    color: "#7F1D1D",
    fontSize: 12,
    fontWeight: "900",
    textDecorationLine: "underline",
  },
  btnGroup: { marginTop: 22, gap: 12 },
  btn: {
    minHeight: 60,
    borderRadius: 18,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    borderWidth: 2,
    borderColor: Colors.black,
    overflow: "hidden",
  },
  btnGoogle: { backgroundColor: Colors.warmWhite },
  btnGoogleTxt: {
    fontSize: 16,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: -0.2,
  },
  btnApple: { backgroundColor: Colors.black },
  btnAppleTxt: {
    fontSize: 16,
    fontWeight: "900",
    color: Colors.warmWhite,
    letterSpacing: -0.2,
  },
  gGlyph: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.warmWhite,
    borderWidth: 1.5,
    borderColor: Colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  gGlyphTxt: {
    fontSize: 14,
    fontWeight: "900",
    color: "#4285F4",
    lineHeight: 16,
  },
  skip: {
    marginTop: 18,
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  skipTxt: {
    fontSize: 14,
    fontWeight: "900",
    color: Colors.black,
    textDecorationLine: "underline",
    letterSpacing: -0.2,
  },
  legal: {
    marginTop: 12,
    textAlign: "center",
    color: Colors.muted,
    fontSize: 11,
    fontWeight: "600",
    lineHeight: 16,
    paddingHorizontal: 12,
  },
});

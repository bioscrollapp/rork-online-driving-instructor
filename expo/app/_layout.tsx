import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/providers/auth-provider";
import { MockResultsProvider } from "@/providers/mock-results-provider";
import { PersonalisationProvider } from "@/providers/personalisation-provider";
import { RevisionProvider } from "@/providers/revision-provider";
import { SettingsProvider } from "@/providers/settings-provider";

SplashScreen.preventAutoHideAsync().catch(() => {
  console.log("[splash] preventAutoHide failed");
});

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerBackTitle: "Back",
        contentStyle: { backgroundColor: "#FAFAF5" },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding-quiz" options={{ headerShown: false, presentation: "card" }} />
      <Stack.Screen name="categories" options={{ headerShown: false, presentation: "card" }} />
      <Stack.Screen name="quiz" options={{ headerShown: false, presentation: "card" }} />
      <Stack.Screen name="revision" options={{ headerShown: false, presentation: "card" }} />
      <Stack.Screen name="mock" options={{ headerShown: false, presentation: "card" }} />
      <Stack.Screen name="video/[id]" options={{ headerShown: false, presentation: "card" }} />
      <Stack.Screen name="settings" options={{ headerShown: false, presentation: "card" }} />
      <Stack.Screen name="premium" options={{ headerShown: false, presentation: "modal" }} />
      <Stack.Screen name="sign-in" options={{ headerShown: false, presentation: "modal" }} />
      <Stack.Screen name="level-up" options={{ headerShown: false, presentation: "modal", animation: "fade" }} />
      <Stack.Screen name="streak-lost" options={{ headerShown: false, presentation: "modal", animation: "fade" }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {
      console.log("[splash] hide failed");
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar style="dark" />
          <AuthProvider>
            <SettingsProvider>
              <PersonalisationProvider>
                <RevisionProvider>
                  <MockResultsProvider>
                    <RootLayoutNav />
                  </MockResultsProvider>
                </RevisionProvider>
              </PersonalisationProvider>
            </SettingsProvider>
          </AuthProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

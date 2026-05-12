import { Stack, router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { Bell, ChevronLeft, Flame, RotateCcw } from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Easing,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/colors";

const ANNE_URL =
  "https://r2-pub.rork.com/generated-images/04c73e33-4ca1-40ad-9069-4e659ef00463.png";

export default function StreakLostScreen() {
  const params = useLocalSearchParams<{ streak?: string }>();
  const lostStreak = useMemo(() => {
    const n = parseInt(typeof params.streak === "string" ? params.streak : "", 10);
    return Number.isFinite(n) && n >= 0 ? n : 7;
  }, [params.streak]);

  const flameAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(
        () => {},
      );
    }
    Animated.sequence([
      Animated.timing(flameAnim, {
        toValue: 1,
        duration: 480,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: Platform.OS !== "web",
      }),
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: Platform.OS !== "web",
      }),
    ]).start();
  }, [flameAnim, cardAnim]);

  const onStartAgain = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }
    console.log("[StreakLost] start again");
    router.replace("/quiz");
  }, []);

  const onSetReminder = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    console.log("[StreakLost] go to reminder settings");
    router.replace("/settings");
  }, []);

  const onClose = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/home");
  }, []);

  const flameOpacity = flameAnim.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [1, 0.4, 0.15],
  });
  const flameScale = flameAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.65],
  });
  const flameTranslate = flameAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 14],
  });

  const cardTranslate = cardAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  return (
    <View style={styles.root} testID="streak-lost-root">
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.bgBlob1} pointerEvents="none" />
      <View style={styles.bgBlob2} pointerEvents="none" />

      <SafeAreaView edges={["top", "bottom"]} style={styles.safe}>
        <View style={styles.topBar}>
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [
              styles.backBtn,
              pressed && { transform: [{ scale: 0.94 }] },
            ]}
            hitSlop={12}
            testID="streak-lost-close"
            accessibilityRole="button"
            accessibilityLabel="Dismiss"
          >
            <ChevronLeft color={Colors.black} size={22} strokeWidth={2.8} />
          </Pressable>
          <View style={styles.brandRow}>
            <View style={styles.brandDot} />
            <Text style={styles.brandText}>STREAK LOST</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.stage}>
          <View style={styles.anneWrap}>
            <View style={styles.anneHaloOuter} />
            <View style={styles.anneHaloInner} />
            <Image
              source={{ uri: ANNE_URL }}
              style={styles.anneImg}
              resizeMode="contain"
              testID="anne-disappointed"
            />
            <View style={styles.bubble}>
              <Text style={styles.bubbleTxt}>Tut tut.</Text>
              <View style={styles.bubbleTail} />
            </View>
          </View>

          <View style={styles.flameRow}>
            <Animated.View
              style={[
                styles.flameWrap,
                {
                  opacity: flameOpacity,
                  transform: [
                    { scale: flameScale },
                    { translateY: flameTranslate },
                  ],
                },
              ]}
              testID="dying-flame"
            >
              <Flame
                color="#FF6A2C"
                size={56}
                strokeWidth={2.6}
                fill="#FFB199"
              />
            </Animated.View>
            <View style={styles.lostBadge}>
              <Text style={styles.lostBadgeNum}>{lostStreak}</Text>
              <Text style={styles.lostBadgeTxt}>DAY STREAK</Text>
              <View style={styles.lostStrike} pointerEvents="none" />
            </View>
          </View>

          <Text style={styles.headline} testID="streak-lost-headline">
            You broke your streak.
          </Text>
          <Text style={styles.body}>
            Examiner Anne is{" "}
            <Text style={styles.bodyAccent}>not impressed</Text>.
          </Text>
        </View>

        <Animated.View
          style={[
            styles.actionsCard,
            {
              opacity: cardAnim,
              transform: [{ translateY: cardTranslate }],
            },
          ]}
        >
          <View style={styles.tipRow}>
            <View style={styles.tipDot} />
            <Text style={styles.tipText}>
              Set a daily nudge — past-you will thank present-you.
            </Text>
          </View>

          <Pressable
            onPress={onStartAgain}
            style={({ pressed }) => [
              styles.primaryCta,
              pressed && { transform: [{ scale: 0.98 }] },
            ]}
            testID="streak-lost-start"
            accessibilityRole="button"
            accessibilityLabel="Start again"
          >
            <View style={styles.ctaIcon}>
              <RotateCcw color={Colors.black} size={18} strokeWidth={2.8} />
            </View>
            <Text style={styles.primaryCtaTxt}>Start Again</Text>
          </Pressable>

          <Pressable
            onPress={onSetReminder}
            style={({ pressed }) => [
              styles.secondaryCta,
              pressed && { transform: [{ scale: 0.98 }] },
            ]}
            testID="streak-lost-reminder"
            accessibilityRole="button"
            accessibilityLabel="Set a daily reminder"
          >
            <View style={[styles.ctaIcon, { backgroundColor: Colors.yellow }]}>
              <Bell color={Colors.black} size={18} strokeWidth={2.8} />
            </View>
            <Text style={styles.secondaryCtaTxt}>Set a Daily Reminder</Text>
          </Pressable>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.warmWhite, overflow: "hidden" },
  safe: { flex: 1, paddingHorizontal: 22 },
  bgBlob1: {
    position: "absolute",
    top: -160,
    right: -140,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "#FFE9DB",
    opacity: 0.7,
  },
  bgBlob2: {
    position: "absolute",
    bottom: -100,
    left: -120,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: Colors.cream,
    opacity: 0.7,
  },
  topBar: {
    paddingTop: 8,
    paddingBottom: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.warmWhite,
    borderWidth: 2,
    borderColor: Colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  brandDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.black,
  },
  brandText: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
    color: Colors.black,
  },
  stage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  anneWrap: {
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  anneHaloOuter: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 4,
    borderColor: Colors.black,
    backgroundColor: Colors.cream,
  },
  anneHaloInner: {
    position: "absolute",
    width: 156,
    height: 156,
    borderRadius: 78,
    backgroundColor: Colors.warmWhite,
  },
  anneImg: { width: 200, height: 200 },
  bubble: {
    position: "absolute",
    top: 14,
    left: -8,
    backgroundColor: Colors.warmWhite,
    borderWidth: 2,
    borderColor: Colors.black,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    transform: [{ rotate: "-6deg" }],
  },
  bubbleTxt: {
    fontSize: 14,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: -0.2,
  },
  bubbleTail: {
    position: "absolute",
    bottom: -7,
    left: 16,
    width: 10,
    height: 10,
    backgroundColor: Colors.warmWhite,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: Colors.black,
    transform: [{ rotate: "45deg" }],
  },
  flameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 4,
  },
  flameWrap: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
  },
  lostBadge: {
    position: "relative",
    backgroundColor: Colors.black,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: "center",
    overflow: "hidden",
  },
  lostBadgeNum: {
    color: Colors.warmWhite,
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.4,
    opacity: 0.5,
  },
  lostBadgeTxt: {
    color: "#C9C4AE",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.6,
  },
  lostStrike: {
    position: "absolute",
    top: "50%",
    left: -6,
    right: -6,
    height: 3,
    backgroundColor: "#FF6A2C",
    transform: [{ rotate: "-8deg" }],
  },
  headline: {
    marginTop: 14,
    fontSize: 28,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: -0.6,
    textAlign: "center",
  },
  body: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "600",
    color: Colors.ink,
    textAlign: "center",
    lineHeight: 22,
  },
  bodyAccent: {
    fontWeight: "900",
    color: Colors.black,
    textDecorationLine: "underline",
  },
  actionsCard: {
    marginBottom: 8,
    backgroundColor: Colors.warmWhite,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Colors.black,
    padding: 14,
    gap: 10,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  tipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.yellow,
    borderWidth: 1.5,
    borderColor: Colors.black,
  },
  tipText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.muted,
    letterSpacing: 0.2,
  },
  primaryCta: {
    backgroundColor: Colors.yellow,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 2,
    borderColor: Colors.black,
  },
  primaryCtaTxt: {
    flex: 1,
    color: Colors.black,
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: -0.2,
  },
  secondaryCta: {
    backgroundColor: Colors.black,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 2,
    borderColor: Colors.black,
  },
  secondaryCtaTxt: {
    flex: 1,
    color: Colors.warmWhite,
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: -0.2,
  },
  ctaIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: Colors.warmWhite,
    borderWidth: 1.5,
    borderColor: Colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
});

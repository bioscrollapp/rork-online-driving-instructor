import { Stack, router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { Award, Medal, Sparkles, Trophy, Zap } from "lucide-react-native";
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
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/colors";

const SOPHIE_URL =
  "https://r2-pub.rork.com/generated-images/eab16f78-a353-4d8f-90e5-8cf7be9db68b.png";

type ConfettiBit = {
  id: number;
  left: number;
  color: string;
  delay: number;
  rotate: number;
  size: number;
  shape: "square" | "circle";
};

function Confetti() {
  const { width, height } = useWindowDimensions();
  const bits = useMemo<ConfettiBit[]>(() => {
    const colors = [
      Colors.black,
      "#FFFFFF",
      Colors.yellowDeep,
      "#FF6A2C",
      "#4CE070",
    ];
    return Array.from({ length: 36 }).map((_, i) => ({
      id: i,
      left: Math.random() * width,
      color: colors[i % colors.length] ?? Colors.black,
      delay: Math.random() * 400,
      rotate: Math.random() * 360,
      size: 8 + Math.random() * 10,
      shape: Math.random() > 0.5 ? "square" : "circle",
    }));
  }, [width]);

  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 2200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: Platform.OS !== "web",
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: Platform.OS !== "web",
        }),
      ]),
    ).start();
  }, [anim]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {bits.map((b) => {
        const translateY = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [-60, height + 60],
        });
        const translateX = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, (b.id % 2 === 0 ? 1 : -1) * 30],
        });
        const rotate = anim.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", `${b.rotate + 720}deg`],
        });
        const opacity = anim.interpolate({
          inputRange: [0, 0.05, 0.85, 1],
          outputRange: [0, 1, 1, 0],
        });
        return (
          <Animated.View
            key={b.id}
            style={[
              {
                position: "absolute",
                left: b.left,
                top: 0,
                width: b.size,
                height: b.size,
                backgroundColor: b.color,
                borderRadius: b.shape === "circle" ? b.size / 2 : 3,
                transform: [{ translateY }, { translateX }, { rotate }],
                opacity,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

export default function LevelUpScreen() {
  const params = useLocalSearchParams<{
    level?: string;
    title?: string;
    unlocks?: string;
  }>();

  const level = useMemo(() => {
    const n = parseInt(typeof params.level === "string" ? params.level : "", 10);
    return Number.isFinite(n) && n > 0 ? n : 3;
  }, [params.level]);
  const title =
    typeof params.title === "string" && params.title.length > 0
      ? params.title
      : "Learner Driver";
  const unlocks = useMemo<string[]>(() => {
    const raw = typeof params.unlocks === "string" ? params.unlocks : "";
    if (!raw) {
      return ["Mock Pass badge unlocked", "Roundabout drill set", "+150 bonus XP"];
    }
    return raw
      .split("|")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }, [params.unlocks]);

  const badgeScale = useRef(new Animated.Value(0)).current;
  const badgeRotate = useRef(new Animated.Value(0)).current;
  const headlineY = useRef(new Animated.Value(20)).current;
  const headlineOpacity = useRef(new Animated.Value(0)).current;
  const sophieY = useRef(new Animated.Value(40)).current;
  const sophieOpacity = useRef(new Animated.Value(0)).current;
  const listAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
        () => {},
      );
    }
    Animated.sequence([
      Animated.parallel([
        Animated.timing(sophieOpacity, {
          toValue: 1,
          duration: 320,
          useNativeDriver: Platform.OS !== "web",
        }),
        Animated.spring(sophieY, {
          toValue: 0,
          friction: 6,
          tension: 90,
          useNativeDriver: Platform.OS !== "web",
        }),
      ]),
      Animated.parallel([
        Animated.spring(badgeScale, {
          toValue: 1,
          friction: 5,
          tension: 120,
          useNativeDriver: Platform.OS !== "web",
        }),
        Animated.timing(badgeRotate, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: Platform.OS !== "web",
        }),
      ]),
      Animated.parallel([
        Animated.timing(headlineOpacity, {
          toValue: 1,
          duration: 280,
          useNativeDriver: Platform.OS !== "web",
        }),
        Animated.spring(headlineY, {
          toValue: 0,
          friction: 7,
          useNativeDriver: Platform.OS !== "web",
        }),
      ]),
      Animated.timing(listAnim, {
        toValue: 1,
        duration: 360,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: Platform.OS !== "web",
      }),
    ]).start();
  }, [
    badgeScale,
    badgeRotate,
    headlineY,
    headlineOpacity,
    sophieY,
    sophieOpacity,
    listAnim,
  ]);

  const onContinue = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/home");
  }, []);

  const rotation = badgeRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["-12deg", "0deg"],
  });

  const listTranslate = listAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 0],
  });

  return (
    <View style={styles.root} testID="level-up-root">
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.bgRing1} pointerEvents="none" />
      <View style={styles.bgRing2} pointerEvents="none" />
      <Confetti />

      <SafeAreaView edges={["top", "bottom"]} style={styles.safe}>
        <View style={styles.kickerWrap}>
          <View style={styles.kickerPill}>
            <Sparkles color={Colors.black} size={14} strokeWidth={2.8} />
            <Text style={styles.kickerText}>NEW LEVEL UNLOCKED</Text>
          </View>
        </View>

        <View style={styles.middleStage}>
          <Animated.View
            style={[
              styles.sophieWrap,
              {
                opacity: sophieOpacity,
                transform: [{ translateY: sophieY }],
              },
            ]}
          >
            <Image
              source={{ uri: SOPHIE_URL }}
              style={styles.sophieImg}
              resizeMode="contain"
              testID="sophie-celebrate"
            />
            <View style={styles.starTopLeft}>
              <Text style={styles.starTxt}>★</Text>
            </View>
            <View style={styles.starTopRight}>
              <Text style={[styles.starTxt, { color: Colors.black }]}>✦</Text>
            </View>
            <View style={styles.starBottom}>
              <Text style={styles.starTxt}>★</Text>
            </View>
          </Animated.View>

          <Animated.Text
            style={[
              styles.headline,
              {
                opacity: headlineOpacity,
                transform: [{ translateY: headlineY }],
              },
            ]}
            testID="level-up-headline"
          >
            LEVEL UP! {"\u{1F389}"}
          </Animated.Text>
          <Animated.Text
            style={[
              styles.subhead,
              {
                opacity: headlineOpacity,
                transform: [{ translateY: headlineY }],
              },
            ]}
          >
            You{"\u2019"}re officially a {title.toLowerCase()}.
          </Animated.Text>

          <Animated.View
            style={[
              styles.badgeBlock,
              {
                transform: [{ scale: badgeScale }, { rotate: rotation }],
              },
            ]}
            testID="level-up-badge"
          >
            <View style={styles.badgeRibbon}>
              <Trophy color={Colors.yellow} size={14} strokeWidth={2.8} />
              <Text style={styles.badgeRibbonTxt}>LEVEL {level}</Text>
            </View>
            <View style={styles.badgeBig}>
              <Medal color={Colors.yellow} size={42} strokeWidth={2.8} />
              <Text style={styles.badgeNum}>L{level}</Text>
            </View>
            <Text style={styles.badgeTitle}>{title}</Text>
          </Animated.View>
        </View>

        <Animated.View
          style={[
            styles.unlocksCard,
            {
              opacity: listAnim,
              transform: [{ translateY: listTranslate }],
            },
          ]}
        >
          <View style={styles.unlocksHeader}>
            <View style={styles.unlocksIcon}>
              <Award color={Colors.black} size={16} strokeWidth={2.8} />
            </View>
            <Text style={styles.unlocksTitle}>JUST UNLOCKED</Text>
          </View>
          {unlocks.map((u, i) => (
            <View
              key={`${i}-${u}`}
              style={[
                styles.unlockRow,
                i !== unlocks.length - 1 && styles.unlockDivider,
              ]}
              testID={`unlock-${i}`}
            >
              <View style={styles.unlockDot}>
                <Zap
                  color={Colors.black}
                  size={12}
                  strokeWidth={2.8}
                  fill={Colors.black}
                />
              </View>
              <Text style={styles.unlockText}>{u}</Text>
            </View>
          ))}
        </Animated.View>

        <Pressable
          onPress={onContinue}
          style={({ pressed }) => [
            styles.continueBtn,
            pressed && { transform: [{ scale: 0.98 }] },
          ]}
          testID="level-up-continue"
          accessibilityRole="button"
          accessibilityLabel="Continue"
        >
          <Text style={styles.continueText}>Continue</Text>
          <View style={styles.continueArrow}>
            <Text style={styles.continueArrowTxt}>→</Text>
          </View>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.yellow, overflow: "hidden" },
  safe: {
    flex: 1,
    paddingHorizontal: 22,
    alignItems: "stretch",
    justifyContent: "space-between",
  },
  bgRing1: {
    position: "absolute",
    top: -180,
    left: -120,
    width: 420,
    height: 420,
    borderRadius: 210,
    borderWidth: 30,
    borderColor: Colors.yellowDeep,
    opacity: 0.6,
  },
  bgRing2: {
    position: "absolute",
    bottom: -160,
    right: -140,
    width: 380,
    height: 380,
    borderRadius: 190,
    borderWidth: 24,
    borderColor: Colors.yellowSoft,
    opacity: 0.7,
  },
  kickerWrap: {
    alignItems: "center",
    marginTop: 8,
  },
  kickerPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.warmWhite,
    borderWidth: 2,
    borderColor: Colors.black,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  kickerText: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.6,
    color: Colors.black,
  },
  middleStage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  sophieWrap: {
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  sophieImg: { width: 220, height: 220 },
  starTxt: {
    color: Colors.warmWhite,
    fontSize: 22,
    fontWeight: "900",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  starTopLeft: { position: "absolute", top: 4, left: -8 },
  starTopRight: { position: "absolute", top: 18, right: -4 },
  starBottom: { position: "absolute", bottom: 8, left: 12 },
  headline: {
    marginTop: 8,
    fontSize: 38,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: -1,
    textAlign: "center",
  },
  subhead: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: "700",
    color: Colors.ink,
    letterSpacing: 0.2,
    textAlign: "center",
  },
  badgeBlock: {
    marginTop: 18,
    alignItems: "center",
    gap: 8,
  },
  badgeRibbon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.black,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  badgeRibbonTxt: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.6,
    color: Colors.yellow,
  },
  badgeBig: {
    width: 110,
    height: 110,
    borderRadius: 32,
    backgroundColor: Colors.black,
    borderWidth: 4,
    borderColor: Colors.warmWhite,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  badgeNum: {
    fontSize: 14,
    fontWeight: "900",
    color: Colors.yellow,
    letterSpacing: 0.4,
  },
  badgeTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: -0.2,
  },
  unlocksCard: {
    marginTop: 14,
    backgroundColor: Colors.warmWhite,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Colors.black,
    padding: 14,
  },
  unlocksHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  unlocksIcon: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: Colors.yellow,
    borderWidth: 1.5,
    borderColor: Colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  unlocksTitle: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.6,
    color: Colors.black,
  },
  unlockRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 9,
  },
  unlockDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
  },
  unlockDot: {
    width: 24,
    height: 24,
    borderRadius: 7,
    backgroundColor: Colors.yellow,
    borderWidth: 1.5,
    borderColor: Colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  unlockText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: Colors.black,
    letterSpacing: -0.1,
  },
  continueBtn: {
    marginTop: 14,
    backgroundColor: Colors.black,
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 22,
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    borderColor: Colors.black,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 6,
  },
  continueText: {
    color: Colors.yellow,
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 0.2,
  },
  continueArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.yellow,
    alignItems: "center",
    justifyContent: "center",
  },
  continueArrowTxt: {
    fontSize: 18,
    fontWeight: "900",
    color: Colors.black,
  },
});

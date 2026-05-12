import { router } from "expo-router";
import { Flame, Coins, ArrowRight } from "lucide-react-native";
import React, { useCallback, useRef, useState } from "react";
import {
  Animated,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
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

const SOPHIE_URL =
  "https://r2-pub.rork.com/generated-images/eab16f78-a353-4d8f-90e5-8cf7be9db68b.png";
const ANNE_URL =
  "https://r2-pub.rork.com/generated-images/04c73e33-4ca1-40ad-9069-4e659ef00463.png";

type SlideId = "sophie" | "anne" | "rewards";

interface Slide {
  id: SlideId;
  eyebrow: string;
  headline: string;
  subline: string;
  cta: string;
}

const SLIDES: Slide[] = [
  {
    id: "sophie",
    eyebrow: "MEET SOPHIE",
    headline: "Your personal driving instructor, in your pocket.",
    subline: "Friendly lessons, honest feedback, and confidence that sticks.",
    cta: "Let\u2019s Go",
  },
  {
    id: "anne",
    eyebrow: "MEET EXAMINER ANNE",
    headline: "Think you\u2019re ready? Examiner Anne will put you to the test.",
    subline: "She doesn\u2019t do hints. She does standards.",
    cta: "Bring It On",
  },
  {
    id: "rewards",
    eyebrow: "EARN AS YOU LEARN",
    headline: "Learn daily, earn XP, beat your streak. Pass first time.",
    subline: "Tiny daily wins add up to a full UK licence.",
    cta: "Start Learning",
  },
];

export default function OnboardingScreen() {
  const { width, height } = useWindowDimensions();
  const scale = useRef(new Animated.Value(1)).current;
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState<number>(0);

  const goNext = useCallback(() => {
    if (index >= SLIDES.length - 1) {
      console.log("[Onboarding] Finished, going to onboarding quiz");
      router.replace("/onboarding-quiz");
      return;
    }
    const next = index + 1;
    console.log("[Onboarding] next slide", next);
    scrollRef.current?.scrollTo({ x: next * width, animated: true });
    setIndex(next);
  }, [index, width]);

  const skip = useCallback(() => {
    console.log("[Onboarding] skipped");
    router.replace("/onboarding-quiz");
  }, []);

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const i = Math.round(x / width);
      if (i !== index && i >= 0 && i < SLIDES.length) {
        setIndex(i);
      }
    },
    [index, width],
  );

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: Platform.OS !== "web",
      friction: 8,
      tension: 120,
    }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: Platform.OS !== "web",
      friction: 6,
      tension: 140,
    }).start();
  };

  const currentSlide = SLIDES[index];

  return (
    <View style={styles.root} testID="onboarding-root">
      <View style={styles.bgShape1} pointerEvents="none" />
      <View style={styles.bgShape2} pointerEvents="none" />

      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.brandDot} />
            <Text style={styles.brandText}>THE ONLINE DRIVING INSTRUCTOR</Text>
          </View>
          <Pressable
            onPress={skip}
            hitSlop={12}
            testID="skip-button"
            accessibilityRole="button"
            accessibilityLabel="Skip onboarding"
            style={styles.skipBtn}
          >
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>

        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          style={styles.pager}
          contentContainerStyle={{ alignItems: "stretch" }}
          testID="onboarding-pager"
        >
          {SLIDES.map((slide) => (
            <View
              key={slide.id}
              style={[styles.slide, { width }]}
              testID={`slide-${slide.id}`}
            >
              <View style={styles.heroWrap}>
                {slide.id === "sophie" && (
                  <SophieHero size={Math.min(width * 0.62, 260)} />
                )}
                {slide.id === "anne" && (
                  <AnneHero size={Math.min(width * 0.62, 260)} />
                )}
                {slide.id === "rewards" && (
                  <RewardsHero size={Math.min(width * 0.7, 280)} />
                )}
              </View>

              <View style={styles.copy}>
                <Text style={styles.eyebrow}>{slide.eyebrow}</Text>
                <Text style={styles.headline}>{slide.headline}</Text>
                <Text style={styles.subline}>{slide.subline}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.dots}>
          {SLIDES.map((s, i) => (
            <View
              key={s.id}
              style={[styles.dot, i === index ? styles.dotActive : null]}
            />
          ))}
        </View>

        <View style={styles.ctaWrap}>
          <Animated.View style={{ transform: [{ scale }], width: "100%" }}>
            <Pressable
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              onPress={goNext}
              style={styles.cta}
              testID="onboarding-cta"
              accessibilityRole="button"
              accessibilityLabel={currentSlide.cta}
            >
              <Text style={styles.ctaText}>{currentSlide.cta}</Text>
              <View style={styles.ctaArrow}>
                <ArrowRight color={Colors.black} size={20} strokeWidth={3} />
              </View>
            </Pressable>
          </Animated.View>
          <Text style={styles.footnote}>
            {index === SLIDES.length - 1
              ? "No card needed \u2022 Start in 30 sec"
              : `${index + 1} of ${SLIDES.length}`}
          </Text>
        </View>
        <View style={{ height: height > 720 ? 8 : 4 }} />
      </SafeAreaView>
    </View>
  );
}

function SophieHero({ size }: { size: number }) {
  return (
    <View style={[heroStyles.center, { width: size * 1.2, height: size * 1.2 }]}>
      <View
        style={[
          heroStyles.halo,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      >
        <View
          style={[
            heroStyles.haloInner,
            {
              width: size * 0.86,
              height: size * 0.86,
              borderRadius: (size * 0.86) / 2,
            },
          ]}
        />
      </View>
      <Image
        source={{ uri: SOPHIE_URL }}
        style={{ width: size * 1.1, height: size * 1.1 }}
        resizeMode="contain"
        testID="sophie-image"
      />
      <View style={heroStyles.badge}>
        <Text style={heroStyles.badgeDot}>●</Text>
        <Text style={heroStyles.badgeText}>ONLINE NOW</Text>
      </View>
    </View>
  );
}

function AnneHero({ size }: { size: number }) {
  return (
    <View style={[heroStyles.center, { width: size * 1.2, height: size * 1.2 }]}>
      <View
        style={[
          heroStyles.haloStern,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      />
      <Image
        source={{ uri: ANNE_URL }}
        style={{ width: size * 1.05, height: size * 1.05 }}
        resizeMode="contain"
        testID="anne-image"
      />
      <View style={heroStyles.speech}>
        <Text style={heroStyles.speechText}>Hmph.</Text>
      </View>
      <View style={heroStyles.anneTag}>
        <Text style={heroStyles.anneTagText}>EXAMINER ANNE</Text>
      </View>
    </View>
  );
}

function RewardsHero({ size }: { size: number }) {
  const flameSize = size * 0.42;
  const coinSize = size * 0.34;
  return (
    <View style={[heroStyles.center, { width: size, height: size }]}>
      <View
        style={[
          heroStyles.rewardsHalo,
          { width: size * 0.92, height: size * 0.92, borderRadius: (size * 0.92) / 2 },
        ]}
      />
      <View style={heroStyles.rewardsRow}>
        <View style={[heroStyles.coinTile, { width: coinSize, height: coinSize, borderRadius: coinSize / 2 }]}>
          <Coins color={Colors.black} size={coinSize * 0.5} strokeWidth={2.6} />
          <Text style={heroStyles.coinXp}>+10</Text>
        </View>
        <View style={[heroStyles.flameTile, { width: flameSize, height: flameSize, borderRadius: 28 }]}>
          <Flame color={Colors.yellow} size={flameSize * 0.5} strokeWidth={2.6} fill={Colors.yellow} />
          <Text style={heroStyles.flameDays}>7</Text>
        </View>
        <View style={[heroStyles.coinTileSmall, { width: coinSize * 0.78, height: coinSize * 0.78, borderRadius: (coinSize * 0.78) / 2 }]}>
          <Coins color={Colors.black} size={coinSize * 0.4} strokeWidth={2.6} />
        </View>
      </View>
      <View style={heroStyles.xpStrip}>
        <Text style={heroStyles.xpStripText}>DAY 7 STREAK \u00b7 +120 XP</Text>
      </View>
    </View>
  );
}

const heroStyles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  halo: {
    position: "absolute",
    backgroundColor: Colors.yellow,
    alignItems: "center",
    justifyContent: "center",
  },
  haloInner: {
    backgroundColor: Colors.yellowSoft,
    borderWidth: 6,
    borderColor: Colors.yellow,
  },
  haloStern: {
    position: "absolute",
    backgroundColor: Colors.cream,
    borderWidth: 4,
    borderColor: Colors.black,
  },
  badge: {
    position: "absolute",
    top: 14,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.black,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 6,
  },
  badgeDot: { color: "#4CE070", fontSize: 10 },
  badgeText: {
    color: Colors.warmWhite,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  speech: {
    position: "absolute",
    top: 18,
    left: 6,
    backgroundColor: Colors.warmWhite,
    borderWidth: 2,
    borderColor: Colors.black,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    transform: [{ rotate: "-6deg" }],
  },
  speechText: { fontSize: 16, fontWeight: "900", color: Colors.black },
  anneTag: {
    position: "absolute",
    bottom: 6,
    backgroundColor: Colors.yellow,
    borderWidth: 2,
    borderColor: Colors.black,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    transform: [{ rotate: "-3deg" }],
  },
  anneTagText: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.4,
    color: Colors.black,
  },
  rewardsHalo: {
    position: "absolute",
    backgroundColor: Colors.yellowSoft,
    borderWidth: 4,
    borderColor: Colors.yellow,
  },
  rewardsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  flameTile: {
    backgroundColor: Colors.black,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Colors.black,
    transform: [{ rotate: "-4deg" }],
  },
  flameDays: {
    color: Colors.yellow,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 2,
  },
  coinTile: {
    backgroundColor: Colors.yellow,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Colors.black,
    transform: [{ rotate: "6deg" }],
  },
  coinTileSmall: {
    backgroundColor: Colors.warmWhite,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Colors.black,
    transform: [{ rotate: "-8deg" }],
  },
  coinXp: {
    fontSize: 11,
    fontWeight: "900",
    color: Colors.black,
    marginTop: 2,
  },
  xpStrip: {
    position: "absolute",
    bottom: 8,
    backgroundColor: Colors.black,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  xpStripText: {
    color: Colors.yellow,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.2,
  },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.warmWhite, overflow: "hidden" },
  safe: { flex: 1 },
  bgShape1: {
    position: "absolute",
    top: -120,
    left: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: Colors.yellow,
    opacity: 0.35,
  },
  bgShape2: {
    position: "absolute",
    top: 160,
    right: -100,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: Colors.cream,
    opacity: 0.9,
  },
  header: {
    paddingTop: 8,
    paddingBottom: 4,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  brandDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.black,
  },
  brandText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.4,
    color: Colors.black,
  },
  skipBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(26,26,26,0.06)",
  },
  skipText: {
    fontSize: 13,
    fontWeight: "800",
    color: Colors.black,
    letterSpacing: 0.4,
  },
  pager: { flex: 1 },
  slide: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  heroWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    minHeight: 240,
  },
  copy: {
    width: "100%",
    alignItems: "flex-start",
    paddingBottom: 8,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.4,
    color: Colors.muted,
    marginBottom: 10,
  },
  headline: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: -0.4,
  },
  subline: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
    color: Colors.muted,
    maxWidth: 360,
  },
  dots: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(26,26,26,0.18)",
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.black,
  },
  ctaWrap: {
    paddingHorizontal: 24,
    alignItems: "center",
  },
  cta: {
    backgroundColor: Colors.black,
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 26,
    width: "100%",
    borderWidth: 3,
    borderColor: Colors.black,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 8,
  },
  ctaText: {
    color: Colors.yellow,
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 0.3,
  },
  ctaArrow: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.yellow,
    alignItems: "center",
    justifyContent: "center",
  },
  footnote: {
    marginTop: 12,
    fontSize: 12,
    color: Colors.muted,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
});

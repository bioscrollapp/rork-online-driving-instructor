import { Stack, router } from "expo-router";
import * as Haptics from "expo-haptics";
import {
  BookOpen,
  Brain,
  Calendar,
  CalendarDays,
  CalendarRange,
  Check,
  ChevronLeft,
  Compass,
  Eye,
  HelpCircle,
  Layers,
  PlayCircle,
  Sparkles,
  Type,
} from "lucide-react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import {
  type AccessibilityFlag,
  type LearningStyle,
  type TestWindow,
  usePersonalisation,
} from "@/providers/personalisation-provider";
import { useSettings } from "@/providers/settings-provider";

type Step = 0 | 1 | 2;

type Option<V extends string> = {
  value: V;
  label: string;
  hint?: string;
  icon: React.ReactNode;
};

const TEST_OPTIONS: Option<TestWindow>[] = [
  {
    value: "2w",
    label: "Within 2 weeks",
    hint: "Cramming sprint",
    icon: <Calendar color={Colors.black} size={22} strokeWidth={2.6} />,
  },
  {
    value: "1m",
    label: "1 month",
    hint: "Steady build",
    icon: <CalendarDays color={Colors.black} size={22} strokeWidth={2.6} />,
  },
  {
    value: "2-3m",
    label: "2 – 3 months",
    hint: "Plenty of runway",
    icon: <CalendarRange color={Colors.black} size={22} strokeWidth={2.6} />,
  },
  {
    value: "exploring",
    label: "Just exploring",
    hint: "No pressure",
    icon: <Compass color={Colors.black} size={22} strokeWidth={2.6} />,
  },
];

const STYLE_OPTIONS: Option<LearningStyle>[] = [
  {
    value: "reading",
    label: "Reading",
    hint: "Words & rules",
    icon: <BookOpen color={Colors.black} size={22} strokeWidth={2.6} />,
  },
  {
    value: "videos",
    label: "Watching videos",
    hint: "Show me how",
    icon: <PlayCircle color={Colors.black} size={22} strokeWidth={2.6} />,
  },
  {
    value: "practice",
    label: "Practice questions",
    hint: "Reps reps reps",
    icon: <Sparkles color={Colors.black} size={22} strokeWidth={2.6} />,
  },
  {
    value: "mix",
    label: "A mix",
    hint: "All of the above",
    icon: <Layers color={Colors.black} size={22} strokeWidth={2.6} />,
  },
];

const ACCESS_OPTIONS: Option<AccessibilityFlag>[] = [
  {
    value: "dyslexia",
    label: "Dyslexia",
    hint: "We'll switch on dyslexia-friendly font",
    icon: <Type color={Colors.black} size={22} strokeWidth={2.6} />,
  },
  {
    value: "adhd",
    label: "ADHD",
    hint: "Shorter sessions, big visuals",
    icon: <Brain color={Colors.black} size={22} strokeWidth={2.6} />,
  },
  {
    value: "neither",
    label: "Neither",
    hint: "Standard setup",
    icon: <Check color={Colors.black} size={22} strokeWidth={2.6} />,
  },
  {
    value: "private",
    label: "Prefer not to say",
    hint: "All good, you can change this later",
    icon: <Eye color={Colors.black} size={22} strokeWidth={2.6} />,
  },
];

const QUESTIONS: { kicker: string; title: string; sub: string }[] = [
  {
    kicker: "QUESTION 1 OF 3",
    title: "When is your theory test?",
    sub: "We'll match the pace of your plan to it.",
  },
  {
    kicker: "QUESTION 2 OF 3",
    title: "How do you learn best?",
    sub: "We'll lean into what works for you.",
  },
  {
    kicker: "QUESTION 3 OF 3",
    title: "Any of these apply to you?",
    sub: "We'll preset a few defaults — change anytime in Settings.",
  },
];

function hapticLight() {
  if (Platform.OS === "web") return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}
function hapticMedium() {
  if (Platform.OS === "web") return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
}
function hapticSuccess() {
  if (Platform.OS === "web") return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}

export default function OnboardingQuizScreen() {
  const [step, setStep] = useState<Step>(0);
  const [testWindow, setTestWindow] = useState<TestWindow | null>(null);
  const [learningStyle, setLearningStyle] = useState<LearningStyle | null>(null);
  const [accessibility, setAccessibility] = useState<AccessibilityFlag | null>(
    null,
  );

  const fade = useRef(new Animated.Value(1)).current;

  const { save } = usePersonalisation();
  const { update: updateSetting } = useSettings();

  const currentQuestion = QUESTIONS[step];
  const progressPct = useMemo(() => ((step + 1) / 3) * 100, [step]);

  const animateTo = useCallback(
    (next: Step) => {
      Animated.sequence([
        Animated.timing(fade, {
          toValue: 0,
          duration: 140,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: Platform.OS !== "web",
        }),
        Animated.timing(fade, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: Platform.OS !== "web",
        }),
      ]).start();
      setStep(next);
    },
    [fade],
  );

  const onPickTest = useCallback(
    (v: TestWindow) => {
      hapticLight();
      setTestWindow(v);
    },
    [],
  );
  const onPickStyle = useCallback(
    (v: LearningStyle) => {
      hapticLight();
      setLearningStyle(v);
    },
    [],
  );
  const onPickAccess = useCallback((v: AccessibilityFlag) => {
    hapticLight();
    setAccessibility(v);
  }, []);

  const finish = useCallback(() => {
    if (!testWindow || !learningStyle || !accessibility) return;
    hapticSuccess();
    if (accessibility === "dyslexia") {
      updateSetting("dyslexiaFont", true);
      updateSetting("largeText", true);
    } else if (accessibility === "adhd") {
      updateSetting("largeText", true);
      updateSetting("highContrast", true);
    }
    save({ testWindow, learningStyle, accessibility });
    console.log("[OnboardingQuiz] finished, going home");
    router.replace("/(tabs)/home");
  }, [
    testWindow,
    learningStyle,
    accessibility,
    save,
    updateSetting,
  ]);

  const onContinue = useCallback(() => {
    if (step === 0) {
      if (!testWindow) return;
      hapticMedium();
      animateTo(1);
      return;
    }
    if (step === 1) {
      if (!learningStyle) return;
      hapticMedium();
      animateTo(2);
      return;
    }
    finish();
  }, [step, testWindow, learningStyle, finish, animateTo]);

  const onBack = useCallback(() => {
    if (step === 0) {
      if (router.canGoBack()) router.back();
      else router.replace("/(tabs)/home");
      return;
    }
    hapticLight();
    animateTo((step - 1) as Step);
  }, [step, animateTo]);

  const onSkip = useCallback(() => {
    console.log("[OnboardingQuiz] skipped");
    router.replace("/(tabs)/home");
  }, []);

  const canContinue =
    (step === 0 && testWindow !== null) ||
    (step === 1 && learningStyle !== null) ||
    (step === 2 && accessibility !== null);

  return (
    <View style={styles.root} testID="onboarding-quiz-root">
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.bgBlob1} pointerEvents="none" />
      <View style={styles.bgBlob2} pointerEvents="none" />

      <SafeAreaView edges={["top", "bottom"]} style={styles.safe}>
        <View style={styles.topBar}>
          <Pressable
            onPress={onBack}
            style={({ pressed }) => [
              styles.backBtn,
              pressed && { transform: [{ scale: 0.94 }] },
            ]}
            hitSlop={12}
            testID="quiz-onboard-back"
            accessibilityRole="button"
            accessibilityLabel="Back"
          >
            <ChevronLeft color={Colors.black} size={22} strokeWidth={2.8} />
          </Pressable>
          <View style={styles.progressWrap}>
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, { width: `${progressPct}%` }]}
              />
            </View>
          </View>
          <Pressable
            onPress={onSkip}
            hitSlop={10}
            testID="quiz-onboard-skip"
            style={styles.skipBtn}
            accessibilityRole="button"
            accessibilityLabel="Skip"
          >
            <Text style={styles.skipTxt}>Skip</Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity: fade }}>
            <View style={styles.kickerRow}>
              <View style={styles.kickerPill}>
                <HelpCircle color={Colors.black} size={14} strokeWidth={2.8} />
                <Text style={styles.kickerTxt}>{currentQuestion.kicker}</Text>
              </View>
            </View>
            <Text style={styles.title}>{currentQuestion.title}</Text>
            <Text style={styles.subtitle}>{currentQuestion.sub}</Text>

            <View style={styles.options}>
              {step === 0 &&
                TEST_OPTIONS.map((o) => (
                  <OptionRow
                    key={o.value}
                    option={o}
                    selected={testWindow === o.value}
                    onPress={() => onPickTest(o.value)}
                    testID={`opt-test-${o.value}`}
                  />
                ))}
              {step === 1 &&
                STYLE_OPTIONS.map((o) => (
                  <OptionRow
                    key={o.value}
                    option={o}
                    selected={learningStyle === o.value}
                    onPress={() => onPickStyle(o.value)}
                    testID={`opt-style-${o.value}`}
                  />
                ))}
              {step === 2 &&
                ACCESS_OPTIONS.map((o) => (
                  <OptionRow
                    key={o.value}
                    option={o}
                    selected={accessibility === o.value}
                    onPress={() => onPickAccess(o.value)}
                    testID={`opt-access-${o.value}`}
                  />
                ))}
            </View>
          </Animated.View>
          <View style={{ height: 24 }} />
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            onPress={onContinue}
            disabled={!canContinue}
            style={({ pressed }) => [
              styles.cta,
              !canContinue && styles.ctaDisabled,
              pressed && canContinue ? { transform: [{ scale: 0.98 }] } : null,
            ]}
            testID="quiz-onboard-continue"
            accessibilityRole="button"
            accessibilityLabel={step === 2 ? "Finish" : "Continue"}
          >
            <Text style={styles.ctaText}>
              {step === 2 ? "Finish & start learning" : "Continue"}
            </Text>
            <View style={styles.ctaArrow}>
              <Text style={styles.ctaArrowTxt}>→</Text>
            </View>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

function OptionRow<V extends string>({
  option,
  selected,
  onPress,
  testID,
}: {
  option: Option<V>;
  selected: boolean;
  onPress: () => void;
  testID: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.optRow,
        selected && styles.optRowSelected,
        pressed && { transform: [{ scale: 0.99 }] },
      ]}
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={option.label}
    >
      <View
        style={[
          styles.optIcon,
          { backgroundColor: selected ? Colors.black : Colors.cream },
        ]}
      >
        {selected ? (
          <Check color={Colors.yellow} size={20} strokeWidth={3} />
        ) : (
          option.icon
        )}
      </View>
      <View style={styles.optBody}>
        <Text style={[styles.optLabel, selected && styles.optLabelSelected]}>
          {option.label}
        </Text>
        {option.hint && (
          <Text style={styles.optHint} numberOfLines={2}>
            {option.hint}
          </Text>
        )}
      </View>
      <View
        style={[
          styles.optRadio,
          selected && {
            backgroundColor: Colors.black,
            borderColor: Colors.black,
          },
        ]}
      >
        {selected && <View style={styles.optRadioDot} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.warmWhite, overflow: "hidden" },
  safe: { flex: 1, paddingHorizontal: 22 },
  bgBlob1: {
    position: "absolute",
    top: -120,
    left: -100,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: Colors.yellow,
    opacity: 0.22,
  },
  bgBlob2: {
    position: "absolute",
    bottom: -120,
    right: -110,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: Colors.cream,
    opacity: 0.55,
  },
  topBar: {
    paddingTop: 8,
    paddingBottom: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
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
  progressWrap: { flex: 1 },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: Colors.cream,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: Colors.black,
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.yellow,
  },
  skipBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(26,26,26,0.06)",
  },
  skipTxt: {
    fontSize: 13,
    fontWeight: "800",
    color: Colors.black,
    letterSpacing: 0.4,
  },
  scroll: { paddingTop: 18 },
  kickerRow: { flexDirection: "row" },
  kickerPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.yellow,
    borderWidth: 2,
    borderColor: Colors.black,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  kickerTxt: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.4,
    color: Colors.black,
  },
  title: {
    marginTop: 14,
    fontSize: 28,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: -0.7,
    lineHeight: 32,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: Colors.muted,
    fontWeight: "500",
  },
  options: { marginTop: 22, gap: 10 },
  optRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.warmWhite,
    borderWidth: 2,
    borderColor: Colors.line,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 12,
    minHeight: 72,
  },
  optRowSelected: {
    borderColor: Colors.black,
    backgroundColor: Colors.yellow,
  },
  optIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  optBody: { flex: 1 },
  optLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.black,
    letterSpacing: -0.2,
  },
  optLabelSelected: {
    fontWeight: "900",
  },
  optHint: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "600",
    color: Colors.muted,
  },
  optRadio: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: Colors.black,
    backgroundColor: Colors.warmWhite,
    alignItems: "center",
    justifyContent: "center",
  },
  optRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.yellow,
  },
  footer: {
    paddingTop: 8,
    paddingBottom: 4,
  },
  cta: {
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
  },
  ctaDisabled: {
    backgroundColor: "#3A3A3A",
    opacity: 0.7,
  },
  ctaText: {
    color: Colors.yellow,
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 0.2,
  },
  ctaArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.yellow,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaArrowTxt: { fontSize: 18, fontWeight: "900", color: Colors.black },
});

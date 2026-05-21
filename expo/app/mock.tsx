import { router, Stack } from "expo-router";
import * as Haptics from "expo-haptics";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  ListChecks,
  RotateCcw,
  Share2,
  Target,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import questions, { type QuizQuestion } from "@/constants/questions";
import { shareProgress } from "@/lib/share";
import { useRevision } from "@/providers/revision-provider";

const ANNE_URL =
  "https://r2-pub.rork.com/generated-images/04c73e33-4ca1-40ad-9069-4e659ef00463.png";
const SOPHIE_URL =
  "https://r2-pub.rork.com/generated-images/eab16f78-a353-4d8f-90e5-8cf7be9db68b.png";

const TARGET_LEN = 50;
const PASS_MARK = 43;
const TEST_SECONDS = 57 * 60;

type Phase = "intro" | "test" | "results";
type Mode = "full" | "weak";

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
function hapticError() {
  if (Platform.OS === "web") return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = out[i] as T;
    const b = out[j] as T;
    out[i] = b;
    out[j] = a;
  }
  return out;
}

function buildSet(mode: Mode, weakIds: string[]): QuizQuestion[] {
  const pool =
    mode === "weak"
      ? questions.filter((q) => weakIds.includes(q.id))
      : questions;
  if (pool.length === 0) return [];
  const target = mode === "weak" ? Math.min(pool.length * 3, TARGET_LEN) : TARGET_LEN;
  const out: QuizQuestion[] = [];
  let bag = shuffle(pool);
  while (out.length < target) {
    if (bag.length === 0) bag = shuffle(pool);
    const next = bag.pop();
    if (!next) break;
    out.push(next);
  }
  return out.slice(0, target);
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function MockScreen() {
  const { wrongIds } = useRevision();

  const [phase, setPhase] = useState<Phase>("intro");
  const [mode, setMode] = useState<Mode>("full");
  const [set, setSet] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [secondsLeft, setSecondsLeft] = useState<number>(TEST_SECONDS);
  const [timeUsed, setTimeUsed] = useState<number>(0);

  const fade = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const total = set.length;
  const current = set[index];

  const onBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/home");
  }, []);

  const startTest = useCallback(
    (m: Mode) => {
      const built = buildSet(m, wrongIds);
      if (built.length === 0) {
        console.log("[Mock] no questions for mode", m);
        return;
      }
      console.log("[Mock] start", m, "len", built.length);
      hapticMedium();
      setMode(m);
      setSet(built);
      setIndex(0);
      setAnswers({});
      setSecondsLeft(TEST_SECONDS);
      setTimeUsed(0);
      setPhase("test");
    },
    [wrongIds],
  );

  useEffect(() => {
    if (phase !== "test") return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase === "test" && secondsLeft === 0) {
      console.log("[Mock] time up");
      hapticError();
      setTimeUsed(TEST_SECONDS);
      setPhase("results");
    }
  }, [secondsLeft, phase]);

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }, [phase, fade]);

  useEffect(() => {
    if (total === 0) return;
    Animated.timing(progressAnim, {
      toValue: (index + 1) / total,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [index, total, progressAnim]);

  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, {
      toValue: 1,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }, [index, fade]);

  const onSelect = useCallback(
    (i: number) => {
      hapticLight();
      setAnswers((prev) => ({ ...prev, [index]: i }));
    },
    [index],
  );

  const onNext = useCallback(() => {
    if (index >= total - 1) {
      console.log("[Mock] submit");
      hapticMedium();
      setTimeUsed(TEST_SECONDS - secondsLeft);
      setPhase("results");
      return;
    }
    hapticLight();
    setIndex((i) => i + 1);
  }, [index, total, secondsLeft]);

  const onPrev = useCallback(() => {
    if (index === 0) return;
    hapticLight();
    setIndex((i) => i - 1);
  }, [index]);

  const onQuit = useCallback(() => {
    console.log("[Mock] quit to intro");
    setPhase("intro");
  }, []);

  const score = useMemo(() => {
    let n = 0;
    set.forEach((q, i) => {
      if (answers[i] === q.correctIndex) n += 1;
    });
    return n;
  }, [set, answers]);

  const wrongList = useMemo(
    () =>
      set
        .map((q, i) => ({ q, i, picked: answers[i] }))
        .filter((x) => x.picked !== x.q.correctIndex),
    [set, answers],
  );

  const breakdown = useMemo(() => {
    const map = new Map<string, { correct: number; total: number }>();
    set.forEach((q, i) => {
      const entry = map.get(q.category) ?? { correct: 0, total: 0 };
      entry.total += 1;
      if (answers[i] === q.correctIndex) entry.correct += 1;
      map.set(q.category, entry);
    });
    return Array.from(map.entries())
      .map(([category, v]) => ({
        category,
        correct: v.correct,
        total: v.total,
        pct: v.total ? v.correct / v.total : 0,
      }))
      .sort((a, b) => b.pct - a.pct);
  }, [set, answers]);

  const passed = score >= PASS_MARK;
  const weakCount = wrongIds.length;

  if (phase === "intro") {
    return (
      <View style={styles.root} testID="mock-intro">
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.bgBlobYellow} pointerEvents="none" />
        <View style={styles.bgBlobCream} pointerEvents="none" />
        <SafeAreaView edges={["top", "bottom"]} style={styles.safe}>
          <ScrollView
            contentContainerStyle={styles.introScroll}
            showsVerticalScrollIndicator={false}
          >
            <Pressable
              onPress={onBack}
              style={({ pressed }) => [
                styles.backBtn,
                pressed && { transform: [{ scale: 0.94 }] },
              ]}
              hitSlop={10}
              testID="mock-back"
            >
              <ArrowLeft color={Colors.black} size={20} strokeWidth={2.8} />
            </Pressable>

            <View style={styles.anneStage}>
              <View style={styles.anneHaloOuter} />
              <View style={styles.anneHaloInner} />
              <Image
                source={{ uri: ANNE_URL }}
                style={styles.anneImg}
                resizeMode="contain"
                testID="anne-avatar"
              />
              <View style={styles.bubble}>
                <Text style={styles.bubbleText}>Hmph. Let{"\u2019"}s see.</Text>
                <View style={styles.bubbleTail} />
              </View>
            </View>

            <View style={styles.chip}>
              <ClipboardCheck color={Colors.yellow} size={16} strokeWidth={2.8} />
              <Text style={styles.chipText}>MOCK THEORY TEST</Text>
            </View>

            <Text style={styles.title}>The real deal,{"\n"}rehearsed.</Text>
            <Text style={styles.subtitle}>
              Examiner Anne is timing you. Same format as the DVSA test — pick
              your weapon below.
            </Text>

            <View style={styles.statRow}>
              <View style={styles.statCard}>
                <ListChecks color={Colors.black} size={20} strokeWidth={2.6} />
                <Text style={styles.statNum}>50</Text>
                <Text style={styles.statLbl}>QUESTIONS</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: Colors.yellow }]}>
                <Clock3 color={Colors.black} size={20} strokeWidth={2.6} />
                <Text style={styles.statNum}>57</Text>
                <Text style={styles.statLbl}>MINUTES</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: Colors.black }]}>
                <Target color={Colors.yellow} size={20} strokeWidth={2.6} />
                <Text style={[styles.statNum, { color: Colors.yellow }]}>43</Text>
                <Text style={[styles.statLbl, { color: Colors.yellow, opacity: 0.85 }]}>
                  PASS / 50
                </Text>
              </View>
            </View>

            <Text style={styles.pickerKicker}>CHOOSE YOUR TEST</Text>

            <Pressable
              onPress={() => startTest("full")}
              style={({ pressed }) => [
                styles.optionBig,
                styles.optionBigDark,
                pressed && { transform: [{ scale: 0.98 }] },
              ]}
              testID="mock-start-full"
              accessibilityRole="button"
              accessibilityLabel="Start full mock test"
            >
              <View style={[styles.optionIcon, { backgroundColor: Colors.yellow }]}>
                <ClipboardCheck color={Colors.black} size={22} strokeWidth={2.8} />
              </View>
              <View style={styles.optionBody}>
                <Text style={[styles.optionTitle, { color: Colors.warmWhite }]}>
                  Full Mock Test
                </Text>
                <Text style={[styles.optionMeta, { color: "#D9D5C0" }]}>
                  All categories • 50 questions • 57 min
                </Text>
              </View>
              <View style={[styles.optionArrow, { backgroundColor: Colors.yellow }]}>
                <ChevronRight color={Colors.black} size={20} strokeWidth={2.8} />
              </View>
            </Pressable>

            <Pressable
              onPress={() => startTest("weak")}
              disabled={weakCount === 0}
              style={({ pressed }) => [
                styles.optionBig,
                styles.optionBigYellow,
                weakCount === 0 && styles.optionDisabled,
                pressed && { transform: [{ scale: 0.98 }] },
              ]}
              testID="mock-start-weak"
              accessibilityRole="button"
              accessibilityLabel="Practise my weak questions"
            >
              <View style={[styles.optionIcon, { backgroundColor: Colors.black }]}>
                <Target color={Colors.yellow} size={22} strokeWidth={2.8} />
              </View>
              <View style={styles.optionBody}>
                <Text style={[styles.optionTitle, { color: Colors.black }]}>
                  My Weak Questions
                </Text>
                <Text style={[styles.optionMeta, { color: Colors.ink }]}>
                  {weakCount > 0
                    ? `Revision Priority • ${weakCount} saved • timed`
                    : "No saved questions yet — answer some first"}
                </Text>
              </View>
              <View style={[styles.optionArrow, { backgroundColor: Colors.black }]}>
                <ChevronRight color={Colors.yellow} size={20} strokeWidth={2.8} />
              </View>
            </Pressable>

            <Text style={styles.tip}>
              Tip: no feedback during the test — you{"\u2019"}ll see your score and
              breakdown at the end.
            </Text>

            <View style={{ height: 24 }} />
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  if (phase === "test" && current) {
    const picked = answers[index];
    const answeredCount = Object.keys(answers).length;
    const lowTime = secondsLeft <= 60;
    return (
      <View style={styles.root} testID="mock-test">
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView edges={["top"]} style={styles.safe}>
          <View style={styles.testTopBar}>
            <Pressable
              onPress={onQuit}
              style={styles.quitBtn}
              hitSlop={12}
              testID="mock-quit"
            >
              <X color={Colors.black} size={20} strokeWidth={2.8} />
            </Pressable>
            <View style={styles.progressMid}>
              <Text style={styles.progressLabel}>
                Question {index + 1} of {total}
              </Text>
              <View style={styles.progressTrack}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0%", "100%"],
                      }),
                    },
                  ]}
                />
              </View>
            </View>
            <View
              style={[
                styles.timerPill,
                lowTime && styles.timerPillLow,
              ]}
              testID="mock-timer"
            >
              <Clock3
                color={lowTime ? Colors.warmWhite : Colors.black}
                size={14}
                strokeWidth={2.8}
              />
              <Text
                style={[
                  styles.timerText,
                  lowTime && { color: Colors.warmWhite },
                ]}
              >
                {formatTime(secondsLeft)}
              </Text>
            </View>
          </View>

          <ScrollView
            contentContainerStyle={styles.testScroll}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View style={{ opacity: fade }}>
              <View style={styles.catPill}>
                <Text style={styles.catText}>{current.category.toUpperCase()}</Text>
              </View>

              <Text style={styles.qText} testID="mock-question">
                {current.question}
              </Text>

              {current.imageUrl ? (
                <View style={styles.mockQImageWrap}>
                  <Image
                    source={{ uri: current.imageUrl }}
                    style={styles.mockQImage}
                    resizeMode="contain"
                    testID="mock-question-image"
                  />
                </View>
              ) : null}

              <View style={styles.qOptions}>
                {current.options.map((opt, i) => {
                  const isPicked = picked === i;
                  return (
                    <Pressable
                      key={`${current.id}-${index}-${i}`}
                      onPress={() => onSelect(i)}
                      style={({ pressed }) => [
                        styles.qOption,
                        isPicked && styles.qOptionPicked,
                        pressed && !isPicked && styles.qOptionPressed,
                      ]}
                      testID={`mock-option-${i}`}
                    >
                      <View
                        style={[
                          styles.qBadge,
                          isPicked && styles.qBadgePicked,
                        ]}
                      >
                        <Text
                          style={[
                            styles.qBadgeText,
                            isPicked && { color: Colors.black },
                          ]}
                        >
                          {String.fromCharCode(65 + i)}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.qOptionText,
                          isPicked && { color: Colors.black },
                        ]}
                      >
                        {opt}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </Animated.View>

            <Text style={styles.answeredHint}>
              {answeredCount} of {total} answered
            </Text>
          </ScrollView>

          <View style={styles.testFooter}>
            <Pressable
              onPress={onPrev}
              disabled={index === 0}
              style={({ pressed }) => [
                styles.prevBtn,
                index === 0 && { opacity: 0.4 },
                pressed && { transform: [{ scale: 0.98 }] },
              ]}
              testID="mock-prev"
            >
              <ChevronLeft color={Colors.black} size={20} strokeWidth={2.8} />
            </Pressable>
            <Pressable
              onPress={onNext}
              style={({ pressed }) => [
                styles.nextBtn,
                pressed && { transform: [{ scale: 0.98 }] },
              ]}
              testID="mock-next"
            >
              <Text style={styles.nextBtnText}>
                {index >= total - 1 ? "Submit test" : "Next"}
              </Text>
              <ChevronRight color={Colors.yellow} size={20} strokeWidth={2.8} />
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // Results
  const elapsed = formatTime(timeUsed);
  return (
    <View style={styles.root} testID="mock-results">
      <Stack.Screen options={{ headerShown: false }} />
      <View
        style={[
          styles.bgBlobYellow,
          !passed && { backgroundColor: "#FFD9D9", opacity: 0.5 },
        ]}
        pointerEvents="none"
      />
      <SafeAreaView edges={["top", "bottom"]} style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.resultScroll}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.banner,
              passed ? styles.bannerPass : styles.bannerFail,
            ]}
            testID={passed ? "mock-pass" : "mock-fail"}
          >
            <Text
              style={[
                styles.bannerKicker,
                { color: passed ? "#14612E" : "#7A1712" },
              ]}
            >
              {passed ? "TEST PASSED" : "NOT QUITE"}
            </Text>
            <Text
              style={[
                styles.bannerTitle,
                { color: passed ? "#0E4A22" : "#5A100B" },
              ]}
            >
              {passed
                ? "You smashed it."
                : "Close — but not yet."}
            </Text>
            <Text
              style={[
                styles.bannerBody,
                { color: passed ? "#14612E" : "#7A1712" },
              ]}
            >
              {passed
                ? "On a real DVSA day, you'd be walking out with a pass."
                : `You need ${PASS_MARK} out of ${total} to pass. Don't sweat — let's review.`}
            </Text>
            <Text
              style={[
                styles.bannerQuote,
                { color: passed ? "#0E4A22" : "#5A100B" },
              ]}
              testID="mock-character-line"
            >
              {characterLine}
            </Text>
          </View>

          <View style={styles.scoreCard}>
            <View style={styles.scoreLeft}>
              <Image
                source={{ uri: passed ? SOPHIE_URL : ANNE_URL }}
                style={styles.scoreAvatar}
                resizeMode="contain"
              />
            </View>
            <View style={styles.scoreRight}>
              <Text style={styles.scoreLbl}>YOUR SCORE</Text>
              <View style={styles.scoreNumRow}>
                <Text style={styles.scoreNumBig}>{score}</Text>
                <Text style={styles.scoreNumSmall}>/ {total}</Text>
              </View>
              <View style={styles.scoreMetaRow}>
                <View style={styles.scoreMetaPill}>
                  <Clock3 color={Colors.black} size={12} strokeWidth={2.8} />
                  <Text style={styles.scoreMetaText}>{elapsed}</Text>
                </View>
                <View style={styles.scoreMetaPill}>
                  <Text style={styles.scoreMetaText}>
                    {Math.round((score / Math.max(1, total)) * 100)}%
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <Text style={styles.sectionKicker}>BY CATEGORY</Text>

          <View style={styles.breakdownList}>
            {breakdown.map((row) => {
              const strong = row.pct >= 0.8;
              const weak = row.pct < 0.5;
              return (
                <View
                  key={row.category}
                  style={styles.breakdownRow}
                  testID={`mock-cat-${row.category}`}
                >
                  <View style={styles.breakdownTop}>
                    <Text style={styles.breakdownCat}>{row.category}</Text>
                    <View
                      style={[
                        styles.breakdownTag,
                        strong && styles.tagStrong,
                        weak && styles.tagWeak,
                      ]}
                    >
                      {strong ? (
                        <TrendingUp color="#14612E" size={12} strokeWidth={2.8} />
                      ) : weak ? (
                        <TrendingDown color="#7A1712" size={12} strokeWidth={2.8} />
                      ) : null}
                      <Text
                        style={[
                          styles.breakdownTagText,
                          strong && { color: "#14612E" },
                          weak && { color: "#7A1712" },
                        ]}
                      >
                        {strong ? "STRONG" : weak ? "WEAK" : "OK"}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.breakdownBarTrack}>
                    <View
                      style={[
                        styles.breakdownBarFill,
                        { width: `${Math.round(row.pct * 100)}%` },
                        strong && { backgroundColor: "#4CE070" },
                        weak && { backgroundColor: "#E25C5C" },
                      ]}
                    />
                  </View>
                  <Text style={styles.breakdownScore}>
                    {row.correct} / {row.total} correct
                  </Text>
                </View>
              );
            })}
          </View>

          {wrongList.length > 0 && (
            <View style={styles.reviewBox}>
              <Text style={styles.sectionKicker}>REVIEW WRONG ANSWERS</Text>
              {wrongList.slice(0, 5).map(({ q, picked }, idx) => (
                <View
                  key={`${q.id}-rev-${idx}`}
                  style={styles.reviewRow}
                  testID={`mock-review-${idx}`}
                >
                  <View style={styles.reviewBadge}>
                    <X color={Colors.warmWhite} size={14} strokeWidth={3} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reviewCat}>
                      {q.category.toUpperCase()}
                    </Text>
                    <Text style={styles.reviewQ} numberOfLines={2}>
                      {q.question}
                    </Text>
                    <Text style={styles.reviewAnswer}>
                      <Text style={styles.reviewAnswerLbl}>Correct: </Text>
                      {q.options[q.correctIndex]}
                    </Text>
                    {typeof picked === "number" && (
                      <Text style={styles.reviewPicked}>
                        You picked: {q.options[picked]}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
              {wrongList.length > 5 && (
                <Text style={styles.reviewMore}>
                  +{wrongList.length - 5} more in your Revision Priority
                </Text>
              )}
            </View>
          )}

          <Pressable
            onPress={() => {
              hapticLight();
              router.push("/revision");
            }}
            style={({ pressed }) => [
              styles.actionDark,
              pressed && { transform: [{ scale: 0.98 }] },
            ]}
            testID="mock-review-all"
            accessibilityRole="button"
          >
            <Target color={Colors.yellow} size={18} strokeWidth={2.8} />
            <Text style={styles.actionDarkText}>Review all wrong answers</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              hapticLight();
              startTest(mode);
            }}
            style={({ pressed }) => [
              styles.actionLight,
              pressed && { transform: [{ scale: 0.98 }] },
            ]}
            testID="mock-try-again"
            accessibilityRole="button"
          >
            <RotateCcw color={Colors.black} size={18} strokeWidth={2.8} />
            <Text style={styles.actionLightText}>Try again</Text>
          </Pressable>

          {passed && (
            <Pressable
              onPress={() => {
                hapticLight();
                shareProgress({
                  score,
                  total,
                  passed: true,
                }).catch((e) => console.log("[Mock] share failed", e));
              }}
              style={({ pressed }) => [
                styles.shareCta,
                pressed && { transform: [{ scale: 0.98 }] },
              ]}
              testID="mock-share"
              accessibilityRole="button"
              accessibilityLabel="Share your pass"
            >
              <Share2 color={Colors.black} size={18} strokeWidth={2.8} />
              <Text style={styles.shareCtaText}>Share my pass</Text>
            </Pressable>
          )}

          <Pressable
            onPress={onBack}
            style={styles.ghostBtn}
            testID="mock-done-back"
          >
            <Text style={styles.ghostBtnText}>Back to Home</Text>
          </Pressable>

          <View style={{ height: 24 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.warmWhite, overflow: "hidden" },
  safe: { flex: 1 },
  bgBlobYellow: {
    position: "absolute",
    top: -140,
    right: -100,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: Colors.yellow,
    opacity: 0.28,
  },
  bgBlobCream: {
    position: "absolute",
    bottom: -140,
    left: -120,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: Colors.cream,
    opacity: 0.7,
  },

  introScroll: { paddingHorizontal: 22, paddingTop: 8, paddingBottom: 24 },
  backBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.black,
    backgroundColor: Colors.warmWhite,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  anneStage: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    marginTop: 4,
    marginBottom: 8,
  },
  anneHaloOuter: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#FF4F4F",
    opacity: 0.18,
  },
  anneHaloInner: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: Colors.yellow,
    opacity: 0.6,
  },
  anneImg: { width: 200, height: 200 },
  bubble: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: Colors.black,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    transform: [{ rotate: "4deg" }],
  },
  bubbleText: {
    color: Colors.yellow,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.4,
  },
  bubbleTail: {
    position: "absolute",
    left: 16,
    bottom: -6,
    width: 10,
    height: 10,
    backgroundColor: Colors.black,
    transform: [{ rotate: "45deg" }],
  },

  chip: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.black,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    marginTop: 6,
  },
  chipText: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.6,
    color: Colors.yellow,
  },
  title: {
    marginTop: 14,
    fontSize: 32,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: -0.8,
    lineHeight: 36,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    color: Colors.muted,
    fontWeight: "500",
  },

  statRow: { marginTop: 22, flexDirection: "row", gap: 10 },
  statCard: {
    flex: 1,
    padding: 14,
    borderRadius: 20,
    backgroundColor: Colors.cream,
    borderWidth: 2,
    borderColor: Colors.black,
    gap: 6,
  },
  statNum: {
    fontSize: 26,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: -1,
  },
  statLbl: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.4,
    color: Colors.black,
    opacity: 0.7,
  },

  pickerKicker: {
    marginTop: 26,
    marginBottom: 10,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.8,
    color: Colors.muted,
  },
  optionBig: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Colors.black,
    minHeight: 92,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: { elevation: 2 },
      default: {},
    }),
  },
  optionBigDark: { backgroundColor: Colors.black },
  optionBigYellow: { backgroundColor: Colors.yellow },
  optionDisabled: { opacity: 0.55 },
  optionIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.black,
  },
  optionBody: { flex: 1 },
  optionTitle: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.2,
  },
  optionMeta: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  optionArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  tip: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "600",
    color: Colors.muted,
    lineHeight: 18,
  },

  testTopBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 12,
  },
  quitBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.warmWhite,
    borderWidth: 2,
    borderColor: Colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  progressMid: { flex: 1, gap: 6 },
  progressLabel: {
    fontSize: 12,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: 0.4,
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: Colors.line,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.black,
    borderRadius: 999,
  },
  timerPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.yellow,
    borderWidth: 2,
    borderColor: Colors.black,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    minWidth: 76,
    justifyContent: "center",
  },
  timerPillLow: {
    backgroundColor: "#C3281E",
    borderColor: "#7A1712",
  },
  timerText: {
    fontSize: 13,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: 0.4,
    fontVariant: ["tabular-nums"],
  },

  testScroll: {
    paddingHorizontal: 22,
    paddingTop: 4,
    paddingBottom: 16,
  },
  catPill: {
    alignSelf: "flex-start",
    backgroundColor: Colors.black,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 14,
  },
  catText: {
    color: Colors.yellow,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.4,
  },
  qText: {
    fontSize: 23,
    lineHeight: 30,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: -0.4,
    marginBottom: 22,
  },
  qOptions: { gap: 12 },
  qOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: Colors.black,
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    minHeight: 64,
  },
  qOptionPressed: {
    backgroundColor: "#2A2A2A",
  },
  qOptionPicked: {
    backgroundColor: Colors.yellow,
    borderColor: Colors.black,
  },
  qBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Colors.yellow,
    alignItems: "center",
    justifyContent: "center",
  },
  qBadgePicked: {
    backgroundColor: Colors.black,
  },
  qBadgeText: {
    fontSize: 14,
    fontWeight: "900",
    color: Colors.black,
  },
  qOptionText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "700",
    color: Colors.warmWhite,
  },
  answeredHint: {
    marginTop: 18,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "700",
    color: Colors.muted,
    letterSpacing: 0.4,
  },

  testFooter: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 16,
  },
  prevBtn: {
    width: 56,
    height: 56,
    borderRadius: 18,
    borderWidth: 2.5,
    borderColor: Colors.black,
    backgroundColor: Colors.warmWhite,
    alignItems: "center",
    justifyContent: "center",
  },
  nextBtn: {
    flex: 1,
    backgroundColor: Colors.black,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 22,
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  nextBtnText: {
    color: Colors.yellow,
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 0.2,
  },

  resultScroll: { paddingHorizontal: 22, paddingTop: 12, paddingBottom: 12 },
  banner: {
    borderRadius: 22,
    padding: 18,
    borderWidth: 2,
  },
  bannerPass: {
    backgroundColor: "#D6FBE1",
    borderColor: "#1E8A42",
  },
  bannerFail: {
    backgroundColor: "#FFE3E3",
    borderColor: "#C3281E",
  },
  bannerKicker: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.8,
  },
  bannerTitle: {
    marginTop: 6,
    fontSize: 26,
    lineHeight: 30,
    fontWeight: "900",
    letterSpacing: -0.6,
  },
  bannerBody: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },

  scoreCard: {
    marginTop: 16,
    backgroundColor: Colors.warmWhite,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Colors.black,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  scoreLeft: {
    width: 96,
    height: 96,
    borderRadius: 22,
    backgroundColor: Colors.yellow,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  scoreAvatar: { width: 110, height: 110 },
  scoreRight: { flex: 1 },
  scoreLbl: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.6,
    color: Colors.muted,
  },
  scoreNumRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
    marginTop: 2,
  },
  scoreNumBig: {
    fontSize: 44,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: -1.5,
    lineHeight: 46,
  },
  scoreNumSmall: {
    fontSize: 18,
    fontWeight: "900",
    color: Colors.muted,
    marginBottom: 6,
  },
  scoreMetaRow: { flexDirection: "row", gap: 6, marginTop: 6 },
  scoreMetaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.cream,
    borderWidth: 1.5,
    borderColor: Colors.black,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  scoreMetaText: {
    fontSize: 11,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: 0.3,
  },

  sectionKicker: {
    marginTop: 22,
    marginBottom: 10,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.8,
    color: Colors.muted,
  },
  breakdownList: { gap: 12 },
  breakdownRow: {
    backgroundColor: Colors.warmWhite,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.line,
    padding: 14,
    gap: 8,
  },
  breakdownTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  breakdownCat: {
    fontSize: 14,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: -0.2,
  },
  breakdownTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.cream,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tagStrong: { backgroundColor: "#D6FBE1" },
  tagWeak: { backgroundColor: "#FFE3E3" },
  breakdownTagText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
    color: Colors.black,
  },
  breakdownBarTrack: {
    height: 8,
    backgroundColor: Colors.line,
    borderRadius: 999,
    overflow: "hidden",
  },
  breakdownBarFill: {
    height: "100%",
    backgroundColor: Colors.black,
    borderRadius: 999,
  },
  breakdownScore: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.muted,
    letterSpacing: 0.3,
  },

  reviewBox: { marginTop: 4 },
  reviewRow: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: Colors.warmWhite,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.line,
    padding: 14,
    marginBottom: 10,
  },
  reviewBadge: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#C3281E",
    alignItems: "center",
    justifyContent: "center",
  },
  reviewCat: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.4,
    color: Colors.muted,
    marginBottom: 2,
  },
  reviewQ: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "800",
    color: Colors.black,
  },
  reviewAnswer: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    color: "#14612E",
    fontWeight: "700",
  },
  reviewAnswerLbl: { fontWeight: "900" },
  reviewPicked: {
    marginTop: 2,
    fontSize: 12,
    color: Colors.muted,
    fontWeight: "600",
  },
  reviewMore: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.muted,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 4,
  },

  actionDark: {
    marginTop: 16,
    backgroundColor: Colors.black,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 18,
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  actionDarkText: {
    color: Colors.yellow,
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.2,
  },
  actionLight: {
    marginTop: 10,
    backgroundColor: Colors.yellow,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 18,
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 2,
    borderColor: Colors.black,
  },
  actionLightText: {
    color: Colors.black,
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.2,
  },
  ghostBtn: {
    marginTop: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  ghostBtnText: {
    color: Colors.black,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  bannerQuote: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "800",
    fontStyle: "italic",
    letterSpacing: 0.2,
  },
});

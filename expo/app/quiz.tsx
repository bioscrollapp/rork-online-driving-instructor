import { Stack, router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { Bookmark, BookmarkCheck, Check, ChevronLeft, RotateCcw, Sparkles, X } from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  PanResponder,
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
import allQuestions from "@/constants/questions";
import { useRevision } from "@/providers/revision-provider";

const SOPHIE_URL =
  "https://r2-pub.rork.com/generated-images/eab16f78-a353-4d8f-90e5-8cf7be9db68b.png";
const ANNE_URL =
  "https://r2-pub.rork.com/generated-images/04c73e33-4ca1-40ad-9069-4e659ef00463.png";

const SWIPE_THRESHOLD = 110;

type AnswerState = "idle" | "correct" | "wrong";

function hapticLight() {
  if (Platform.OS === "web") return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}
function hapticSuccess() {
  if (Platform.OS === "web") return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
    () => {},
  );
}
function hapticError() {
  if (Platform.OS === "web") return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(
    () => {},
  );
}

type ConfettiBit = {
  id: number;
  left: number;
  color: string;
  delay: number;
  rotate: number;
};

function Confetti({ visible }: { visible: boolean }) {
  const { width } = useWindowDimensions();
  const bits = useMemo<ConfettiBit[]>(() => {
    const colors = [Colors.yellow, "#4CE070", "#FF8AC6", "#7AD1FF", Colors.black];
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: Math.random() * width,
      color: colors[i % colors.length] ?? Colors.yellow,
      delay: Math.random() * 120,
      rotate: Math.random() * 360,
    }));
  }, [width]);

  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      anim.setValue(0);
      Animated.timing(anim, {
        toValue: 1,
        duration: 1100,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: Platform.OS !== "web",
      }).start();
    }
  }, [visible, anim]);

  if (!visible) return null;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {bits.map((b) => {
        const translateY = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [-40, 520],
        });
        const translateX = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, (b.id % 2 === 0 ? 1 : -1) * 40],
        });
        const opacity = anim.interpolate({
          inputRange: [0, 0.1, 0.8, 1],
          outputRange: [0, 1, 1, 0],
        });
        return (
          <Animated.View
            key={b.id}
            style={[
              styles.confettiBit,
              {
                left: b.left,
                backgroundColor: b.color,
                transform: [
                  { translateY },
                  { translateX },
                  { rotate: `${b.rotate}deg` },
                ],
                opacity,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

function XpBurst({ visible }: { visible: boolean }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      anim.setValue(0);
      Animated.sequence([
        Animated.spring(anim, {
          toValue: 1,
          friction: 5,
          tension: 140,
          useNativeDriver: Platform.OS !== "web",
        }),
        Animated.delay(700),
        Animated.timing(anim, {
          toValue: 2,
          duration: 260,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: Platform.OS !== "web",
        }),
      ]).start();
    }
  }, [visible, anim]);

  if (!visible) return null;

  const scale = anim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0.4, 1, 1.1],
  });
  const translateY = anim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [20, 0, -30],
  });
  const opacity = anim.interpolate({
    inputRange: [0, 0.3, 1.5, 2],
    outputRange: [0, 1, 1, 0],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.xpBurst,
        { opacity, transform: [{ translateY }, { scale }] },
      ]}
      testID="xp-burst"
    >
      <Sparkles color={Colors.black} size={18} strokeWidth={2.8} />
      <Text style={styles.xpBurstText}>+10 XP</Text>
    </Animated.View>
  );
}

export default function QuizScreen() {
  const { width } = useWindowDimensions();
  const { wrongIds, markWrong, markMastered } = useRevision();
  const params = useLocalSearchParams<{ category?: string }>();
  const categoryFilter = typeof params.category === "string" ? params.category : undefined;
  const questions = useMemo(() => {
    if (!categoryFilter) return allQuestions;
    const filtered = allQuestions.filter(
      (q) => q.category.toLowerCase() === categoryFilter.toLowerCase(),
    );
    return filtered.length > 0 ? filtered : allQuestions;
  }, [categoryFilter]);
  const [index, setIndex] = useState<number>(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [xp, setXp] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);

  const pan = useRef(new Animated.ValueXY()).current;
  const cardScale = useRef(new Animated.Value(1)).current;
  const flashAnim = useRef(new Animated.Value(0)).current;

  const current = questions[index];
  const isLast = index >= questions.length - 1;
  const done = index >= questions.length;

  const resetCardPosition = useCallback(() => {
    Animated.spring(pan, {
      toValue: { x: 0, y: 0 },
      friction: 7,
      tension: 100,
      useNativeDriver: false,
    }).start();
  }, [pan]);

  const goNext = useCallback(
    (dir: 1 | -1) => {
      Animated.timing(pan, {
        toValue: { x: dir * (width + 80), y: 0 },
        duration: 240,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: false,
      }).start(({ finished }) => {
        setSelected(null);
        setAnswerState("idle");
        setIndex((i) => i + 1);
        pan.setValue({ x: 0, y: 0 });
        if (!finished) {
          pan.setValue({ x: 0, y: 0 });
        }
      });
    },
    [pan, width],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_evt, g) =>
          Math.abs(g.dx) > 12 && Math.abs(g.dx) > Math.abs(g.dy),
        onPanResponderMove: (_evt, g) => {
          pan.setValue({ x: g.dx, y: g.dy * 0.2 });
        },
        onPanResponderRelease: (_evt, g) => {
          if (answerState !== "idle" && g.dx < -SWIPE_THRESHOLD) {
            goNext(-1);
            return;
          }
          if (g.dx > SWIPE_THRESHOLD * 1.4) {
            Animated.timing(pan, {
              toValue: { x: width + 80, y: 0 },
              duration: 220,
              useNativeDriver: false,
            }).start(() => {
              pan.setValue({ x: 0, y: 0 });
            });
            return;
          }
          resetCardPosition();
        },
      }),
    [pan, answerState, goNext, resetCardPosition, width],
  );

  const onSelect = useCallback(
    (i: number) => {
      if (answerState !== "idle" || !current) return;
      setSelected(i);
      const correct = i === current.correctIndex;
      setAnswerState(correct ? "correct" : "wrong");
      if (correct) {
        hapticSuccess();
        setXp((v) => v + 10);
        setCorrectCount((v) => v + 1);
      } else {
        hapticError();
      }
      Animated.sequence([
        Animated.timing(cardScale, {
          toValue: 0.98,
          duration: 100,
          useNativeDriver: Platform.OS !== "web",
        }),
        Animated.spring(cardScale, {
          toValue: 1,
          friction: 5,
          useNativeDriver: Platform.OS !== "web",
        }),
      ]).start();
      Animated.sequence([
        Animated.timing(flashAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: Platform.OS !== "web",
        }),
        Animated.timing(flashAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: Platform.OS !== "web",
        }),
      ]).start();
    },
    [answerState, current, cardScale, flashAnim],
  );

  const onNext = useCallback(() => {
    hapticLight();
    if (isLast) {
      Animated.timing(pan, {
        toValue: { x: -(width + 80), y: 0 },
        duration: 240,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: false,
      }).start(() => {
        setIndex(questions.length);
        pan.setValue({ x: 0, y: 0 });
      });
      return;
    }
    goNext(-1);
  }, [isLast, goNext, pan, width, questions.length]);

  const onBack = useCallback(() => {
    console.log("[Quiz] back pressed");
    router.back();
  }, []);

  const onTryAgain = useCallback(() => {
    console.log("[Quiz] try again");
    hapticLight();
    setSelected(null);
    setAnswerState("idle");
  }, []);

  const onToggleSave = useCallback(() => {
    if (!current) return;
    const id = `q${current.id}`;
    if (wrongIds.includes(id)) {
      console.log("[Quiz] unsave", id);
      markMastered(id);
    } else {
      console.log("[Quiz] save to revision", id);
      markWrong(id);
      hapticLight();
    }
  }, [current, wrongIds, markMastered, markWrong]);

  const onRestart = useCallback(() => {
    pan.setValue({ x: 0, y: 0 });
    setIndex(0);
    setSelected(null);
    setAnswerState("idle");
    setXp(0);
    setCorrectCount(0);
  }, [pan]);

  const rotate = pan.x.interpolate({
    inputRange: [-width, 0, width],
    outputRange: ["-8deg", "0deg", "8deg"],
  });

  const flashBg = flashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      "rgba(255,255,255,0)",
      answerState === "correct"
        ? "rgba(76,224,112,0.22)"
        : answerState === "wrong"
          ? "rgba(255,79,79,0.18)"
          : "rgba(255,255,255,0)",
    ],
  });

  if (done) {
    const pct = Math.round((correctCount / questions.length) * 100);
    return (
      <View style={styles.root}>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
          <View style={styles.doneWrap} testID="quiz-done">
            <View style={styles.doneHaloBig} />
            <Image
              source={{ uri: SOPHIE_URL }}
              style={styles.doneSophie}
              resizeMode="contain"
            />
            <Text style={styles.doneKicker}>SESSION COMPLETE</Text>
            <Text style={styles.doneTitle}>
              {correctCount} out of {questions.length} right
            </Text>
            <Text style={styles.doneSub}>
              {pct >= 80
                ? "Smashing it. You are test-ready on these."
                : pct >= 50
                  ? "Solid effort — a quick review and you'll be flying."
                  : "No drama, that's what practice is for. Let's run it again."}
            </Text>
            <View style={styles.doneXpPill}>
              <Sparkles color={Colors.black} size={16} strokeWidth={2.8} />
              <Text style={styles.doneXpText}>+{xp} XP earned</Text>
            </View>
            <Pressable
              onPress={onRestart}
              style={({ pressed }) => [
                styles.doneBtn,
                pressed && { transform: [{ scale: 0.98 }] },
              ]}
              testID="quiz-restart"
            >
              <Text style={styles.doneBtnText}>Try again</Text>
            </Pressable>
            <Pressable
              onPress={onBack}
              style={styles.doneBtnGhost}
              testID="quiz-back-home"
            >
              <Text style={styles.doneBtnGhostText}>Back to Learn</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (!current) return null;

  const showAnne = answerState === "wrong";
  const avatarUri = showAnne ? ANNE_URL : SOPHIE_URL;

  return (
    <View style={styles.root} testID="quiz-root">
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.bgBlob1} pointerEvents="none" />
      <View style={styles.bgBlob2} pointerEvents="none" />

      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.topBar}>
          <Pressable
            onPress={onBack}
            style={styles.backBtn}
            testID="quiz-back"
            hitSlop={12}
          >
            <ChevronLeft color={Colors.black} size={22} strokeWidth={2.8} />
          </Pressable>
          <View style={styles.progressWrap}>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${((index + (answerState !== "idle" ? 1 : 0.2)) / questions.length) * 100}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {index + 1} / {questions.length}
            </Text>
          </View>
          <View style={styles.xpChip}>
            <Sparkles color={Colors.black} size={14} strokeWidth={2.8} />
            <Text style={styles.xpChipText}>{xp} XP</Text>
          </View>
        </View>

        <View style={styles.stage}>
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.card,
              {
                transform: [
                  { translateX: pan.x },
                  { translateY: pan.y },
                  { rotate },
                  { scale: cardScale },
                ],
              },
            ]}
            testID={`quiz-card-${current.id}`}
          >
            <Animated.View
              pointerEvents="none"
              style={[StyleSheet.absoluteFillObject, { backgroundColor: flashBg }]}
            />

            <View style={styles.cardTopRow}>
              <View style={styles.categoryPill}>
                <Text style={styles.categoryText}>
                  {current.category.toUpperCase()}
                </Text>
              </View>
              <View style={styles.swipeHint}>
                <Text style={styles.swipeHintText}>
                  {answerState === "idle" ? "Tap an answer" : "Swipe ← to continue"}
                </Text>
              </View>
            </View>

            <ScrollView
              style={styles.cardScroll}
              contentContainerStyle={styles.cardScrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.question} testID="quiz-question">
                {current.question}
              </Text>

              {current.imageUrl ? (
                <View style={styles.qImageWrap}>
                  <Image
                    source={{ uri: current.imageUrl }}
                    style={styles.qImage}
                    resizeMode="contain"
                    testID="quiz-question-image"
                  />
                </View>
              ) : null}

              <View style={styles.options}>
              {current.options.map((opt, i) => {
                const isSelected = selected === i;
                const isCorrect = i === current.correctIndex;
                const reveal = answerState !== "idle";
                const showAsCorrect = reveal && isCorrect;
                const showAsWrong = reveal && isSelected && !isCorrect;

                return (
                  <Pressable
                    key={`${current.id}-${i}`}
                    onPress={() => onSelect(i)}
                    disabled={answerState !== "idle"}
                    style={({ pressed }) => [
                      styles.option,
                      showAsCorrect && styles.optionCorrect,
                      showAsWrong && styles.optionWrong,
                      !reveal && pressed && styles.optionPressed,
                    ]}
                    testID={`quiz-option-${i}`}
                  >
                    <View
                      style={[
                        styles.optionBadge,
                        showAsCorrect && styles.optionBadgeCorrect,
                        showAsWrong && styles.optionBadgeWrong,
                      ]}
                    >
                      {showAsCorrect ? (
                        <Check color={Colors.black} size={16} strokeWidth={3} />
                      ) : showAsWrong ? (
                        <X color={Colors.warmWhite} size={16} strokeWidth={3} />
                      ) : (
                        <Text style={styles.optionBadgeText}>
                          {String.fromCharCode(65 + i)}
                        </Text>
                      )}
                    </View>
                    <Text
                      style={[
                        styles.optionText,
                        showAsWrong && styles.optionTextWrong,
                      ]}
                    >
                      {opt}
                    </Text>
                  </Pressable>
                );
              })}
              </View>

              {answerState === "wrong" && (
                <View style={styles.feedbackWrong} testID="quiz-feedback-wrong">
                  <Text style={styles.feedbackTitle}>
                    Not quite — let{"\u2019"}s learn why
                  </Text>
                  <Text style={styles.feedbackBody}>{current.explanation}</Text>
                </View>
              )}
              {answerState === "correct" && (
                <View style={styles.feedbackCorrect} testID="quiz-feedback-correct">
                  <Text style={styles.feedbackTitleCorrect}>Nailed it!</Text>
                  <Text style={styles.feedbackBodyCorrect}>
                    {current.explanation}
                  </Text>
                </View>
              )}
            </ScrollView>
          </Animated.View>

          <View
            pointerEvents="none"
            style={[
              styles.avatarWrap,
              showAnne ? styles.avatarWrapAnne : styles.avatarWrapSophie,
            ]}
          >
            <View
              style={[
                styles.avatarHalo,
                showAnne && styles.avatarHaloAnne,
              ]}
            />
            <Image
              source={{ uri: avatarUri }}
              style={styles.avatarImg}
              resizeMode="contain"
              testID={showAnne ? "anne-avatar" : "sophie-avatar"}
            />
            <View
              style={[
                styles.avatarLabel,
                showAnne && styles.avatarLabelAnne,
              ]}
            >
              <Text
                style={[
                  styles.avatarLabelText,
                  showAnne && styles.avatarLabelTextAnne,
                ]}
              >
                {showAnne ? "EXAMINER ANNE" : "SOPHIE"}
              </Text>
            </View>
          </View>

          <Confetti visible={answerState === "correct"} />
          <XpBurst visible={answerState === "correct"} />
        </View>

        <View style={styles.footer}>
          <Pressable
            onPress={onToggleSave}
            style={({ pressed }) => [
              styles.saveBtn,
              (current ? wrongIds.includes(`q${current.id}`) : false) &&
                styles.saveBtnActive,
              pressed && { transform: [{ scale: 0.98 }] },
            ]}
            testID="quiz-save"
          >
            {current && wrongIds.includes(`q${current.id}`) ? (
              <BookmarkCheck color={Colors.black} size={18} strokeWidth={2.6} />
            ) : (
              <Bookmark color={Colors.black} size={18} strokeWidth={2.6} />
            )}
            <Text style={styles.saveBtnText}>
              {current && wrongIds.includes(`q${current.id}`)
                ? "Saved to Revision Priority"
                : "Save to Revision Priority"}
            </Text>
          </Pressable>

          {answerState === "idle" ? (
            <Text style={styles.footerHint}>
              Pick the answer you think is right
            </Text>
          ) : answerState === "wrong" ? (
            <View style={styles.actionRow}>
              <Pressable
                onPress={onTryAgain}
                style={({ pressed }) => [
                  styles.tryAgainBtn,
                  pressed && { transform: [{ scale: 0.98 }] },
                ]}
                testID="quiz-try-again"
              >
                <RotateCcw color={Colors.black} size={18} strokeWidth={2.8} />
                <Text style={styles.tryAgainBtnText}>Try again</Text>
              </Pressable>
              <Pressable
                onPress={onNext}
                style={({ pressed }) => [
                  styles.nextBtn,
                  styles.nextBtnFlex,
                  pressed && { transform: [{ scale: 0.98 }] },
                ]}
                testID="quiz-next"
              >
                <Text style={styles.nextBtnText}>
                  {isLast ? "Finish" : "Next"}
                </Text>
                <Text style={styles.nextBtnArrow}>→</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={onNext}
              style={({ pressed }) => [
                styles.nextBtn,
                pressed && { transform: [{ scale: 0.98 }] },
              ]}
              testID="quiz-next"
            >
              <Text style={styles.nextBtnText}>
                {isLast ? "Finish session" : "Next question"}
              </Text>
              <Text style={styles.nextBtnArrow}>→</Text>
            </Pressable>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.warmWhite, overflow: "hidden" },
  safe: { flex: 1 },
  bgBlob1: {
    position: "absolute",
    top: -120,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: Colors.yellow,
    opacity: 0.3,
  },
  bgBlob2: {
    position: "absolute",
    bottom: -120,
    left: -100,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: Colors.cream,
    opacity: 0.9,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 10,
  },
  backBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: Colors.warmWhite,
    borderWidth: 2,
    borderColor: Colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  progressWrap: { flex: 1, gap: 4 },
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
  progressText: {
    fontSize: 11,
    fontWeight: "800",
    color: Colors.muted,
    letterSpacing: 0.8,
  },
  xpChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.yellow,
    borderWidth: 2,
    borderColor: Colors.black,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  xpChipText: {
    fontSize: 12,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: 0.4,
  },
  stage: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 6,
    justifyContent: "flex-start",
  },
  card: {
    flex: 1,
    backgroundColor: Colors.warmWhite,
    borderRadius: 26,
    borderWidth: 2.5,
    borderColor: Colors.black,
    padding: 20,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.14,
        shadowRadius: 22,
      },
      android: { elevation: 6 },
      default: {},
    }),
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  categoryPill: {
    backgroundColor: Colors.black,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  categoryText: {
    color: Colors.yellow,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.4,
  },
  swipeHint: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  swipeHintText: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.muted,
    letterSpacing: 0.4,
  },
  cardScroll: {
    flex: 1,
  },
  cardScrollContent: {
    paddingBottom: 12,
  },
  question: {
    fontSize: 22,
    lineHeight: 30,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: -0.4,
    marginBottom: 22,
    paddingRight: 80,
  },
  qImageWrap: {
    alignSelf: "center",
    width: "70%",
    aspectRatio: 1,
    marginBottom: 18,
    borderRadius: 18,
    backgroundColor: Colors.warmWhite,
    borderWidth: 2,
    borderColor: Colors.black,
    padding: 10,
  },
  qImage: { width: "100%", height: "100%" },
  options: { gap: 12 },
  option: {
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
  optionPressed: {
    backgroundColor: "#2A2A2A",
    transform: [{ scale: 0.99 }],
  },
  optionCorrect: {
    backgroundColor: "#D6FBE1",
    borderColor: "#1E8A42",
  },
  optionWrong: {
    backgroundColor: "#FFD9D9",
    borderColor: "#C3281E",
  },
  optionBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Colors.yellow,
    borderWidth: 2,
    borderColor: Colors.yellow,
    alignItems: "center",
    justifyContent: "center",
  },
  optionBadgeCorrect: {
    backgroundColor: "#4CE070",
    borderColor: "#1E8A42",
  },
  optionBadgeWrong: {
    backgroundColor: "#C3281E",
    borderColor: "#7A1712",
  },
  optionBadgeText: {
    fontSize: 13,
    fontWeight: "900",
    color: Colors.black,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "700",
    color: Colors.warmWhite,
  },
  optionTextWrong: {
    color: "#7A1712",
  },
  feedbackWrong: {
    marginTop: 16,
    padding: 14,
    borderRadius: 16,
    backgroundColor: "#FFE3E3",
    borderWidth: 2,
    borderColor: "#C3281E",
  },
  feedbackTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#7A1712",
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  feedbackBody: {
    fontSize: 14,
    lineHeight: 20,
    color: "#7A1712",
    fontWeight: "600",
  },
  feedbackCorrect: {
    marginTop: 16,
    padding: 14,
    borderRadius: 16,
    backgroundColor: "#E2FBEC",
    borderWidth: 2,
    borderColor: "#1E8A42",
  },
  feedbackTitleCorrect: {
    fontSize: 14,
    fontWeight: "900",
    color: "#14612E",
    marginBottom: 4,
  },
  feedbackBodyCorrect: {
    fontSize: 14,
    lineHeight: 20,
    color: "#14612E",
    fontWeight: "600",
  },
  avatarWrap: {
    position: "absolute",
    width: 110,
    height: 130,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  avatarWrapSophie: {
    top: -6,
    right: 4,
  },
  avatarWrapAnne: {
    top: -6,
    right: 4,
  },
  avatarHalo: {
    position: "absolute",
    top: 10,
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: Colors.yellow,
  },
  avatarHaloAnne: {
    backgroundColor: "#FF4F4F",
    opacity: 0.35,
  },
  avatarImg: {
    width: 110,
    height: 110,
  },
  avatarLabel: {
    position: "absolute",
    bottom: -4,
    backgroundColor: Colors.yellow,
    borderWidth: 1.5,
    borderColor: Colors.black,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    transform: [{ rotate: "-4deg" }],
  },
  avatarLabelAnne: {
    backgroundColor: Colors.black,
  },
  avatarLabelText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
    color: Colors.black,
  },
  avatarLabelTextAnne: {
    color: Colors.yellow,
  },
  confettiBit: {
    position: "absolute",
    top: 0,
    width: 8,
    height: 14,
    borderRadius: 2,
  },
  xpBurst: {
    position: "absolute",
    alignSelf: "center",
    top: "40%",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.yellow,
    borderWidth: 2.5,
    borderColor: Colors.black,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: { elevation: 8 },
      default: {},
    }),
  },
  xpBurstText: {
    fontSize: 18,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: 0.3,
  },
  footer: {
    paddingHorizontal: 18,
    paddingBottom: 18,
    paddingTop: 8,
  },
  footerHint: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "700",
    color: Colors.muted,
    letterSpacing: 0.4,
  },
  nextBtn: {
    backgroundColor: Colors.black,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 22,
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nextBtnFlex: {
    flex: 1,
    paddingHorizontal: 18,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "stretch",
  },
  tryAgainBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.warmWhite,
    borderWidth: 2.5,
    borderColor: Colors.black,
    borderRadius: 18,
    paddingHorizontal: 18,
    minHeight: 56,
  },
  tryAgainBtnText: {
    color: Colors.black,
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0.2,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    alignSelf: "center",
    backgroundColor: Colors.warmWhite,
    borderWidth: 2,
    borderColor: Colors.black,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    marginBottom: 12,
  },
  saveBtnActive: {
    backgroundColor: Colors.yellow,
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: 0.2,
  },
  nextBtnText: {
    color: Colors.yellow,
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 0.2,
  },
  nextBtnArrow: {
    color: Colors.yellow,
    fontSize: 20,
    fontWeight: "900",
  },
  doneWrap: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  doneHaloBig: {
    position: "absolute",
    top: "18%",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: Colors.yellow,
    opacity: 0.9,
  },
  doneSophie: {
    width: 220,
    height: 220,
    marginBottom: 8,
  },
  doneKicker: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.6,
    color: Colors.muted,
    marginTop: 4,
  },
  doneTitle: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: -0.6,
    marginTop: 6,
    textAlign: "center",
  },
  doneSub: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.muted,
    fontWeight: "600",
    textAlign: "center",
    maxWidth: 320,
  },
  doneXpPill: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.yellow,
    borderWidth: 2,
    borderColor: Colors.black,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  doneXpText: {
    fontSize: 14,
    fontWeight: "900",
    color: Colors.black,
  },
  doneBtn: {
    marginTop: 28,
    alignSelf: "stretch",
    backgroundColor: Colors.black,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
  },
  doneBtnText: {
    color: Colors.yellow,
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.3,
  },
  doneBtnGhost: {
    marginTop: 10,
    alignSelf: "stretch",
    paddingVertical: 14,
    alignItems: "center",
  },
  doneBtnGhostText: {
    color: Colors.black,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});

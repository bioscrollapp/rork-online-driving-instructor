import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  Award,
  Check,
  ChevronRight,
  Clock,
  Flame,
  Lock,
  Medal,
  Share2,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react-native";
import React, { useCallback, useMemo } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { shareProgress } from "@/lib/share";
import { useRevision } from "@/providers/revision-provider";

const SOPHIE_URL =
  "https://r2-pub.rork.com/generated-images/eab16f78-a353-4d8f-90e5-8cf7be9db68b.png";

type CategoryStat = { name: string; correct: number; total: number };

const CATEGORY_STATS: CategoryStat[] = [
  { name: "Road Signs", correct: 39, total: 50 },
  { name: "Junctions", correct: 26, total: 40 },
  { name: "Roundabouts", correct: 18, total: 28 },
  { name: "Speed Limits", correct: 22, total: 26 },
  { name: "Motorways", correct: 11, total: 22 },
  { name: "Vehicle Safety", correct: 9, total: 18 },
  { name: "Vulnerable Road Users", correct: 7, total: 16 },
];

type BadgeDef = {
  id: string;
  label: string;
  hint: string;
  icon: React.ReactNode;
  unlocked: boolean;
};

const BADGES: BadgeDef[] = [
  {
    id: "first-test",
    label: "First Test",
    hint: "Complete your first quiz",
    icon: <Sparkles color={Colors.black} size={22} strokeWidth={2.6} />,
    unlocked: true,
  },
  {
    id: "streak-7",
    label: "7 Day Streak",
    hint: "Practise 7 days in a row",
    icon: <Flame color="#FF6A2C" size={22} strokeWidth={2.6} />,
    unlocked: true,
  },
  {
    id: "100-q",
    label: "100 Questions",
    hint: "Answer 100 questions",
    icon: <Target color={Colors.black} size={22} strokeWidth={2.6} />,
    unlocked: true,
  },
  {
    id: "mock-pass",
    label: "Mock Pass",
    hint: "Pass a full mock test",
    icon: <Trophy color={Colors.black} size={22} strokeWidth={2.6} />,
    unlocked: false,
  },
];

const TODAY = new Date();
const DAYS_30: { date: Date; completed: boolean; isToday: boolean }[] =
  Array.from({ length: 30 }, (_, i) => {
    const d = new Date(TODAY);
    d.setDate(TODAY.getDate() - (29 - i));
    const idx = 29 - i;
    const completedSet = new Set([
      0, 1, 2, 4, 5, 7, 8, 9, 11, 12, 14, 16, 18, 20, 21, 23, 25, 26, 27, 28, 29,
    ]);
    return {
      date: d,
      completed: completedSet.has(i),
      isToday: idx === 0,
    };
  });

const DAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];

function calcLevel(xp: number): { level: number; title: string; into: number; span: number } {
  const tiers = [
    { at: 0, title: "Rookie" },
    { at: 250, title: "Cadet" },
    { at: 750, title: "Learner Driver" },
    { at: 1500, title: "Confident Driver" },
    { at: 2500, title: "Theory Pro" },
    { at: 4000, title: "Test Ready" },
  ];
  let level = 1;
  let lower = 0;
  let upper = tiers[1].at;
  let title = tiers[0].title;
  for (let i = 0; i < tiers.length; i++) {
    if (xp >= tiers[i].at) {
      level = i + 1;
      lower = tiers[i].at;
      upper = tiers[i + 1]?.at ?? tiers[i].at + 1500;
      title = tiers[i].title;
    }
  }
  return { level, title, into: xp - lower, span: upper - lower };
}

export default function ProgressScreen() {
  const { wrongIds } = useRevision();

  const xp = 1240;
  const streak = 7;
  const totalAnswered = 186;
  const totalCorrect = 132;
  const minutesLearning = 314;

  const lvl = useMemo(() => calcLevel(xp), [xp]);
  const lvlPct = Math.min(1, lvl.into / lvl.span);
  const accuracy = Math.round((totalCorrect / totalAnswered) * 100);

  const message = useMemo(() => {
    if (streak >= 7) return "A whole week on the trot — pure momentum!";
    if (accuracy >= 80) return "Sharp answers. Keep that focus going.";
    if (wrongIds.length > 5) return "Let's chip away at those weak spots together.";
    return "Tiny daily wins add up. Proud of you.";
  }, [streak, accuracy, wrongIds.length]);

  const goRevision = useCallback(() => {
    console.log("[Progress] open revision");
    router.push("/revision");
  }, []);

  const onShare = useCallback(async () => {
    console.log("[Progress] share");
    await shareProgress({
      level: lvl.level,
      levelTitle: lvl.title,
      streak,
    });
  }, [lvl.level, lvl.title, streak]);

  const hours = Math.floor(minutesLearning / 60);
  const mins = minutesLearning % 60;

  return (
    <View style={styles.root} testID="progress-root">
      <View style={styles.bgBlob1} pointerEvents="none" />
      <View style={styles.bgBlob2} pointerEvents="none" />

      <SafeAreaView edges={["top"]} style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topRow}>
            <View style={styles.brandRow}>
              <View style={styles.brandDot} />
              <Text style={styles.brandText}>PROGRESS</Text>
            </View>
            <View style={styles.topRightRow}>
              <View style={styles.streakPill} testID="streak-pill">
                <Flame color="#FF6A2C" size={16} strokeWidth={2.6} />
                <Text style={styles.streakNum}>{streak}</Text>
                <Text style={styles.streakLbl}>day streak</Text>
              </View>
              <Pressable
                onPress={onShare}
                style={({ pressed }) => [
                  styles.shareBtn,
                  pressed && { transform: [{ scale: 0.94 }] },
                ]}
                hitSlop={10}
                testID="progress-share"
                accessibilityRole="button"
                accessibilityLabel="Share my progress"
              >
                <Share2 color={Colors.black} size={18} strokeWidth={2.6} />
              </Pressable>
            </View>
          </View>

          <View style={styles.hero}>
            <View style={styles.heroTextWrap}>
              <Text style={styles.kicker}>SOPHIE SAYS</Text>
              <Text style={styles.headline} testID="motivation">
                {message}
              </Text>
              <View style={styles.quoteRow}>
                <View style={styles.quoteDot} />
                <Text style={styles.quoteText}>
                  Look how far you{"\u2019"}ve come — {totalAnswered} questions
                  in.
                </Text>
              </View>
            </View>
            <View style={styles.sophieWrap}>
              <View style={styles.sophieHalo} />
              <Image
                source={{ uri: SOPHIE_URL }}
                style={styles.sophieImg}
                resizeMode="contain"
                testID="sophie-avatar"
              />
            </View>
          </View>

          <View style={styles.levelCard} testID="level-card">
            <LinearGradient
              colors={[Colors.black, "#2A2A2A"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.levelHeader}>
              <View style={styles.levelBadge}>
                <Medal color={Colors.black} size={20} strokeWidth={2.8} />
                <Text style={styles.levelBadgeNum}>L{lvl.level}</Text>
              </View>
              <View style={styles.levelInfo}>
                <Text style={styles.levelKicker}>LEVEL {lvl.level}</Text>
                <Text style={styles.levelTitle}>{lvl.title}</Text>
              </View>
              <View style={styles.xpChip}>
                <Zap
                  color={Colors.black}
                  size={14}
                  strokeWidth={2.8}
                  fill={Colors.black}
                />
                <Text style={styles.xpChipNum}>{xp.toLocaleString()}</Text>
              </View>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, { width: `${lvlPct * 100}%` }]}
              />
            </View>
            <View style={styles.levelFooter}>
              <Text style={styles.levelFooterText}>
                {lvl.into} / {lvl.span} XP this level
              </Text>
              <Text style={styles.levelFooterText}>
                {lvl.span - lvl.into} to next
              </Text>
            </View>
          </View>

          <Text style={styles.section}>STREAK · LAST 30 DAYS</Text>
          <View style={styles.calCard}>
            <View style={styles.calHeader}>
              {DAY_LETTERS.map((d, i) => (
                <Text key={`${d}-${i}`} style={styles.calHeaderTxt}>
                  {d}
                </Text>
              ))}
            </View>
            <View style={styles.calGrid}>
              {DAYS_30.map((d, i) => (
                <View
                  key={i}
                  style={[
                    styles.calDay,
                    d.completed && styles.calDayDone,
                    d.isToday && styles.calDayToday,
                  ]}
                  testID={`cal-day-${i}`}
                >
                  {d.completed ? (
                    <Check
                      color={Colors.black}
                      size={12}
                      strokeWidth={3}
                    />
                  ) : (
                    <Text style={styles.calDayNum}>{d.date.getDate()}</Text>
                  )}
                </View>
              ))}
            </View>
            <View style={styles.calLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: Colors.yellow }]} />
                <Text style={styles.legendTxt}>Completed</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: Colors.warmWhite, borderWidth: 1.5, borderColor: Colors.black },
                  ]}
                />
                <Text style={styles.legendTxt}>Missed</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: Colors.black }]}
                />
                <Text style={styles.legendTxt}>Today</Text>
              </View>
            </View>
          </View>

          <Text style={styles.section}>CATEGORY PERFORMANCE</Text>
          <View style={styles.catCard}>
            {CATEGORY_STATS.map((c, i) => {
              const pct = Math.round((c.correct / c.total) * 100);
              const isStrong = pct >= 75;
              const isWeak = pct < 60;
              const barColor = isStrong
                ? Colors.yellow
                : isWeak
                ? "#FFB199"
                : "#F7E27C";
              return (
                <View
                  key={c.name}
                  style={[
                    styles.catRow,
                    i !== CATEGORY_STATS.length - 1 && styles.catRowDivider,
                  ]}
                  testID={`cat-${c.name}`}
                >
                  <View style={styles.catTopRow}>
                    <Text style={styles.catName} numberOfLines={1}>
                      {c.name}
                    </Text>
                    <Text style={styles.catPct}>{pct}%</Text>
                  </View>
                  <View style={styles.catTrack}>
                    <View
                      style={[
                        styles.catFill,
                        { width: `${pct}%`, backgroundColor: barColor },
                      ]}
                    />
                  </View>
                  <Text style={styles.catMeta}>
                    {c.correct} of {c.total} correct
                  </Text>
                </View>
              );
            })}
          </View>

          <Text style={styles.section}>OVERALL</Text>
          <View style={styles.totalsRow}>
            <View style={[styles.totalCard, { backgroundColor: Colors.yellow }]}>
              <Target color={Colors.black} size={18} strokeWidth={2.8} />
              <Text style={styles.totalNum}>{totalAnswered}</Text>
              <Text style={styles.totalLbl}>ANSWERED</Text>
            </View>
            <View style={[styles.totalCard, { backgroundColor: Colors.cream }]}>
              <Sparkles color={Colors.black} size={18} strokeWidth={2.8} />
              <Text style={styles.totalNum}>{accuracy}%</Text>
              <Text style={styles.totalLbl}>ACCURACY</Text>
            </View>
            <View style={[styles.totalCard, { backgroundColor: Colors.black }]}>
              <Clock color={Colors.yellow} size={18} strokeWidth={2.8} />
              <Text style={[styles.totalNum, { color: Colors.yellow }]}>
                {hours}h {mins}m
              </Text>
              <Text style={[styles.totalLbl, { color: "#C9C4AE" }]}>
                LEARNING
              </Text>
            </View>
          </View>

          <Text style={styles.section}>BADGES</Text>
          <View style={styles.badgesGrid}>
            {BADGES.map((b) => (
              <View
                key={b.id}
                style={[
                  styles.badgeCard,
                  !b.unlocked && styles.badgeLocked,
                ]}
                testID={`badge-${b.id}`}
              >
                <View
                  style={[
                    styles.badgeIcon,
                    {
                      backgroundColor: b.unlocked
                        ? Colors.yellow
                        : Colors.cream,
                      opacity: b.unlocked ? 1 : 0.6,
                    },
                  ]}
                >
                  {b.unlocked ? (
                    b.icon
                  ) : (
                    <Lock color={Colors.muted} size={20} strokeWidth={2.6} />
                  )}
                </View>
                <Text
                  style={[
                    styles.badgeLabel,
                    !b.unlocked && { color: Colors.muted },
                  ]}
                >
                  {b.label}
                </Text>
                <Text style={styles.badgeHint} numberOfLines={2}>
                  {b.hint}
                </Text>
                {b.unlocked && (
                  <View style={styles.badgeRibbon}>
                    <Award
                      color={Colors.black}
                      size={11}
                      strokeWidth={2.8}
                    />
                    <Text style={styles.badgeRibbonTxt}>EARNED</Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          <Pressable
            onPress={goRevision}
            style={({ pressed }) => [
              styles.revBanner,
              pressed && { transform: [{ scale: 0.99 }] },
            ]}
            testID="progress-open-revision"
          >
            <View style={styles.revIcon}>
              <Target color={Colors.warmWhite} size={18} strokeWidth={2.8} />
            </View>
            <View style={styles.revTextWrap}>
              <Text style={styles.revKicker}>REVISION PRIORITY</Text>
              <Text style={styles.revTitle} numberOfLines={1}>
                {wrongIds.length > 0
                  ? `${wrongIds.length} question${wrongIds.length === 1 ? "" : "s"} to revisit`
                  : "Nothing here yet — keep practising!"}
              </Text>
            </View>
            <View style={styles.revArrow}>
              <ChevronRight color={Colors.warmWhite} size={18} strokeWidth={2.8} />
            </View>
          </Pressable>

          <View style={{ height: 120 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const DAY_BOX = 38;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.warmWhite, overflow: "hidden" },
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 22, paddingTop: 4, paddingBottom: 24 },
  bgBlob1: {
    position: "absolute",
    top: -140,
    right: -120,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: Colors.yellow,
    opacity: 0.22,
  },
  bgBlob2: {
    position: "absolute",
    bottom: -120,
    left: -110,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: Colors.cream,
    opacity: 0.55,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  topRightRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  shareBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.warmWhite,
    borderWidth: 2,
    borderColor: Colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
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
  streakPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFE9DB",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "#FFBE96",
    minHeight: 40,
  },
  streakNum: { fontSize: 14, fontWeight: "900", color: Colors.black },
  streakLbl: {
    fontSize: 11,
    fontWeight: "700",
    color: "#8A4B2A",
    letterSpacing: 0.4,
  },
  hero: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  heroTextWrap: { flex: 1 },
  kicker: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.6,
    color: Colors.muted,
    marginBottom: 6,
  },
  headline: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: -0.6,
  },
  quoteRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    paddingRight: 8,
  },
  quoteDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.yellow,
    marginTop: 7,
    borderWidth: 1.5,
    borderColor: Colors.black,
  },
  quoteText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: Colors.ink,
    fontWeight: "600",
  },
  sophieWrap: {
    width: 110,
    height: 110,
    alignItems: "center",
    justifyContent: "center",
  },
  sophieHalo: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: Colors.yellow,
  },
  sophieImg: { width: 120, height: 120 },
  levelCard: {
    marginTop: 22,
    borderRadius: 24,
    padding: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 6,
  },
  levelHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  levelBadge: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: Colors.yellow,
    borderWidth: 2,
    borderColor: Colors.warmWhite,
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
  },
  levelBadgeNum: {
    fontSize: 11,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: 0.5,
  },
  levelInfo: { flex: 1 },
  levelKicker: {
    color: "#C9C4AE",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.6,
  },
  levelTitle: {
    color: Colors.warmWhite,
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.4,
    marginTop: 2,
  },
  xpChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.yellow,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  xpChipNum: {
    fontSize: 13,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: -0.2,
  },
  progressTrack: {
    marginTop: 16,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#3A3A3A",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.yellow,
    borderRadius: 999,
  },
  levelFooter: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  levelFooterText: {
    color: "#C9C4AE",
    fontSize: 12,
    fontWeight: "700",
  },
  section: {
    marginTop: 26,
    marginBottom: 12,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.8,
    color: Colors.muted,
  },
  calCard: {
    padding: 16,
    borderRadius: 22,
    backgroundColor: Colors.cream,
    borderWidth: 2,
    borderColor: Colors.black,
  },
  calHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  calHeaderTxt: {
    width: DAY_BOX,
    textAlign: "center",
    fontSize: 10,
    fontWeight: "900",
    color: Colors.muted,
    letterSpacing: 1,
  },
  calGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  calDay: {
    width: DAY_BOX,
    height: DAY_BOX,
    borderRadius: 10,
    backgroundColor: Colors.warmWhite,
    borderWidth: 1.5,
    borderColor: Colors.line,
    alignItems: "center",
    justifyContent: "center",
  },
  calDayDone: {
    backgroundColor: Colors.yellow,
    borderColor: Colors.black,
    borderWidth: 2,
  },
  calDayToday: {
    backgroundColor: Colors.black,
    borderColor: Colors.black,
    borderWidth: 2,
  },
  calDayNum: {
    fontSize: 11,
    fontWeight: "800",
    color: Colors.muted,
  },
  calLegend: {
    marginTop: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 12, height: 12, borderRadius: 4 },
  legendTxt: { fontSize: 11, fontWeight: "700", color: Colors.ink },
  catCard: {
    padding: 16,
    borderRadius: 22,
    backgroundColor: Colors.warmWhite,
    borderWidth: 2,
    borderColor: Colors.black,
  },
  catRow: { paddingVertical: 10 },
  catRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
  },
  catTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  catName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "800",
    color: Colors.black,
    letterSpacing: -0.2,
  },
  catPct: {
    fontSize: 14,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: -0.2,
  },
  catTrack: {
    height: 10,
    backgroundColor: Colors.cream,
    borderRadius: 999,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: Colors.black,
  },
  catFill: {
    height: "100%",
    borderRadius: 999,
  },
  catMeta: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: "700",
    color: Colors.muted,
    letterSpacing: 0.3,
  },
  totalsRow: { flexDirection: "row", gap: 10 },
  totalCard: {
    flex: 1,
    padding: 14,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: Colors.black,
    gap: 6,
    minHeight: 96,
  },
  totalNum: {
    fontSize: 20,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: -0.4,
  },
  totalLbl: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.4,
    color: Colors.black,
    opacity: 0.85,
  },
  badgesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  badgeCard: {
    width: "47.5%",
    padding: 14,
    borderRadius: 18,
    backgroundColor: Colors.warmWhite,
    borderWidth: 2,
    borderColor: Colors.black,
    minHeight: 140,
  },
  badgeLocked: {
    backgroundColor: Colors.cream,
    borderStyle: "dashed",
  },
  badgeIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.black,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  badgeLabel: {
    fontSize: 14,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: -0.2,
  },
  badgeHint: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: "600",
    color: Colors.muted,
    lineHeight: 15,
  },
  badgeRibbon: {
    marginTop: 10,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.yellow,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: Colors.black,
  },
  badgeRibbonTxt: {
    fontSize: 9,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: 1.2,
  },
  revBanner: {
    marginTop: 22,
    backgroundColor: Colors.black,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 2,
    borderColor: Colors.black,
  },
  revIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#2E2E2E",
    borderWidth: 1.5,
    borderColor: Colors.yellow,
    alignItems: "center",
    justifyContent: "center",
  },
  revTextWrap: { flex: 1 },
  revKicker: {
    color: Colors.yellow,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.6,
    marginBottom: 2,
  },
  revTitle: {
    color: Colors.warmWhite,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: -0.1,
  },
  revArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2E2E2E",
    alignItems: "center",
    justifyContent: "center",
  },
});

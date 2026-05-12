import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  BookOpen,
  ChevronRight,
  ClipboardCheck,
  Cloud,
  Flame,
  PlayCircle,
  Crown,
  Settings as SettingsIcon,
  Sparkles,
  Target,
  X,
  Zap,
} from "lucide-react-native";
import React, { useCallback, useMemo } from "react";
import {
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
import { usePersonalisation } from "@/providers/personalisation-provider";
import { useRevision } from "@/providers/revision-provider";

const SOPHIE_URL =
  "https://r2-pub.rork.com/generated-images/eab16f78-a353-4d8f-90e5-8cf7be9db68b.png";

type CardVariant = "yellow" | "black";

type CardProps = {
  title: string;
  subtitle: string;
  meta: string;
  variant: CardVariant;
  icon: React.ReactNode;
  onPress: () => void;
  testID: string;
};

function LessonCard({ title, subtitle, meta, variant, icon, onPress, testID }: CardProps) {
  const isBlack = variant === "black";
  const bg = isBlack ? Colors.black : Colors.yellow;
  const titleColor = isBlack ? Colors.warmWhite : Colors.black;
  const subColor = isBlack ? "#E8E5D6" : Colors.ink;
  const metaColor = isBlack ? Colors.yellow : Colors.black;
  const arrowBg = isBlack ? Colors.yellow : Colors.warmWhite;
  const iconBg = isBlack ? "#2A2A2A" : Colors.warmWhite;
  const iconBorder = isBlack ? Colors.yellow : Colors.black;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: bg },
        pressed && { transform: [{ scale: 0.98 }] },
      ]}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View style={[styles.cardIconWrap, { backgroundColor: iconBg, borderColor: iconBorder }]}>
        {icon}
      </View>
      <View style={styles.cardBody}>
        <Text style={[styles.cardTitle, { color: titleColor }]}>{title}</Text>
        <Text style={[styles.cardSubtitle, { color: subColor }]} numberOfLines={2}>
          {subtitle}
        </Text>
        <Text style={[styles.cardMeta, { color: metaColor }]}>{meta}</Text>
      </View>
      <View style={[styles.cardArrow, { backgroundColor: arrowBg, borderColor: isBlack ? Colors.yellow : Colors.black }]}>
        <ChevronRight color={Colors.black} size={20} strokeWidth={2.8} />
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const sophieSize = Math.min(width * 0.32, 140);
  const { wrongIds } = useRevision();
  const revisionCount = wrongIds.length;
  const { showSoftPrompt, dismissSoftPrompt } = useAuth();
  const { homeMessage, completed: personalisedReady } = usePersonalisation();

  const streak = 7;
  const xp = 1240;
  const xpGoal = 1500;
  const progressPct = useMemo(() => Math.min(1, xp / xpGoal), [xp, xpGoal]);

  const goPractice = useCallback(() => {
    console.log("[Home] Practice pressed");
    router.push("/quiz");
  }, []);
  const goMock = useCallback(() => {
    console.log("[Home] Mock test pressed");
    router.push("/mock");
  }, []);
  const goVideos = useCallback(() => {
    console.log("[Home] Videos pressed");
    router.push("/(tabs)/videos");
  }, []);
  const goRevision = useCallback(() => {
    console.log("[Home] Revision pressed");
    router.push("/revision");
  }, []);
  const goSettings = useCallback(() => {
    console.log("[Home] Settings pressed");
    router.push("/settings");
  }, []);
  const goPremium = useCallback(() => {
    console.log("[Home] Premium pressed");
    router.push("/premium");
  }, []);
  const goSignIn = useCallback(() => {
    console.log("[Home] Sign in from soft prompt");
    router.push({ pathname: "/sign-in", params: { reason: "soft" } });
  }, []);
  const onDismissPrompt = useCallback(() => {
    dismissSoftPrompt();
  }, [dismissSoftPrompt]);

  return (
    <View style={styles.root} testID="home-root">
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
              <Text style={styles.brandText}>TODI</Text>
            </View>
            <View style={styles.topRight}>
              <View style={styles.streakPill} testID="streak-pill">
                <Flame color="#FF6A2C" size={16} strokeWidth={2.6} />
                <Text style={styles.streakNum}>{streak}</Text>
                <Text style={styles.streakLbl}>day streak</Text>
              </View>
              <Pressable
                onPress={goSettings}
                style={({ pressed }) => [
                  styles.settingsBtn,
                  pressed && { transform: [{ scale: 0.96 }] },
                ]}
                hitSlop={10}
                testID="home-settings"
                accessibilityRole="button"
                accessibilityLabel="Open settings"
              >
                <SettingsIcon color={Colors.black} size={20} strokeWidth={2.6} />
              </Pressable>
            </View>
          </View>

          <View style={styles.hero}>
            <View style={styles.heroTextWrap}>
              <Text style={styles.hello}>HELLO LEARNER</Text>
              <Text style={styles.headline} testID="sophie-message">
                Ready to smash{"\n"}it today? {"\u{1F697}"}
              </Text>
              <View style={styles.sophieQuoteRow}>
                <View style={styles.quoteDot} />
                <Text style={styles.sophieQuote} testID="sophie-personal-msg">
                  Sophie: {personalisedReady ? homeMessage : "Let\u2019s bag some XP before lunch."}
                </Text>
              </View>
            </View>
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
                testID="sophie-avatar"
              />
            </View>
          </View>

          <View style={styles.xpCard} testID="xp-card">
            <LinearGradient
              colors={[Colors.black, "#2A2A2A"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.xpHeader}>
              <View style={styles.xpLeft}>
                <View style={styles.xpIconChip}>
                  <Zap color={Colors.black} size={18} strokeWidth={2.8} fill={Colors.black} />
                </View>
                <View>
                  <Text style={styles.xpLabel}>TOTAL XP</Text>
                  <Text style={styles.xpValue}>{xp.toLocaleString()}</Text>
                </View>
              </View>
              <View style={styles.xpRight}>
                <Text style={styles.xpGoalLbl}>NEXT LEVEL</Text>
                <Text style={styles.xpGoalVal}>{xpGoal.toLocaleString()}</Text>
              </View>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progressPct * 100}%` },
                ]}
              />
            </View>
            <View style={styles.xpFooter}>
              <Sparkles color={Colors.yellow} size={14} strokeWidth={2.6} />
              <Text style={styles.xpFooterText}>
                {xpGoal - xp} XP to your next badge
              </Text>
            </View>
          </View>

          {showSoftPrompt && (
            <View style={styles.softPrompt} testID="soft-prompt">
              <View style={styles.softIcon}>
                <Cloud color={Colors.black} size={20} strokeWidth={2.6} />
              </View>
              <View style={styles.softTextWrap}>
                <Text style={styles.softKicker}>BACK UP YOUR PROGRESS</Text>
                <Text style={styles.softTitle} numberOfLines={2}>
                  Sign in to save your XP and streak across devices.
                </Text>
                <View style={styles.softActions}>
                  <Pressable
                    onPress={goSignIn}
                    style={({ pressed }) => [
                      styles.softCta,
                      pressed && { transform: [{ scale: 0.97 }] },
                    ]}
                    testID="soft-prompt-cta"
                    accessibilityRole="button"
                    accessibilityLabel="Sign in to back up progress"
                  >
                    <Text style={styles.softCtaTxt}>Sign in</Text>
                  </Pressable>
                  <Pressable
                    onPress={onDismissPrompt}
                    style={({ pressed }) => [
                      styles.softLater,
                      pressed && { opacity: 0.6 },
                    ]}
                    testID="soft-prompt-later"
                    accessibilityRole="button"
                    accessibilityLabel="Maybe later"
                  >
                    <Text style={styles.softLaterTxt}>Not now</Text>
                  </Pressable>
                </View>
              </View>
              <Pressable
                onPress={onDismissPrompt}
                style={styles.softClose}
                hitSlop={10}
                testID="soft-prompt-close"
                accessibilityRole="button"
                accessibilityLabel="Dismiss"
              >
                <X color={Colors.black} size={16} strokeWidth={2.8} />
              </Pressable>
            </View>
          )}

          <Text style={styles.sectionTitle}>TODAY{"\u2019"}S PLAN</Text>

          <View style={styles.cardsList}>
            <LessonCard
              title="Practice Questions"
              subtitle="Sharpen your signs, hazards & rules with quick drills."
              meta="10 questions • 5 min"
              variant="yellow"
              icon={<BookOpen color={Colors.black} size={26} strokeWidth={2.6} />}
              onPress={goPractice}
              testID="card-practice"
            />
            <LessonCard
              title="Video Lessons"
              subtitle="Watch Sophie break down tricky junctions and roundabouts."
              meta="3 NEW LESSONS"
              variant="black"
              icon={<PlayCircle color={Colors.yellow} size={26} strokeWidth={2.4} />}
              onPress={goVideos}
              testID="card-videos"
            />
            <LessonCard
              title="Mock Test"
              subtitle="Full 50-question exam under timed conditions."
              meta="50 questions • 57 min"
              variant="yellow"
              icon={<ClipboardCheck color={Colors.black} size={26} strokeWidth={2.6} />}
              onPress={goMock}
              testID="card-mock"
            />
          </View>

          <Pressable
            onPress={goPremium}
            style={({ pressed }) => [
              styles.upgradeBanner,
              pressed && { transform: [{ scale: 0.99 }] },
            ]}
            testID="upgrade-banner"
            accessibilityRole="button"
            accessibilityLabel="Unlock premium for 3.99 pounds"
          >
            <View style={styles.upgradeIcon}>
              <Crown
                color={Colors.black}
                size={18}
                strokeWidth={2.8}
                fill={Colors.black}
              />
            </View>
            <View style={styles.upgradeTextWrap}>
              <Text style={styles.upgradeKicker}>UNLOCK EVERYTHING</Text>
              <Text style={styles.upgradeTitle} numberOfLines={1}>
                Lifetime access for £3.99
              </Text>
            </View>
            <View style={styles.upgradeArrow}>
              <ChevronRight color={Colors.black} size={18} strokeWidth={2.8} />
            </View>
          </Pressable>

          <Pressable
            onPress={goRevision}
            style={({ pressed }) => [
              styles.revBanner,
              pressed && { transform: [{ scale: 0.99 }] },
            ]}
            testID="revision-banner"
            accessibilityRole="button"
            accessibilityLabel={`Revision Priority, ${revisionCount} questions saved`}
          >
            <View style={styles.revIcon}>
              <Target color={Colors.warmWhite} size={18} strokeWidth={2.8} />
            </View>
            <View style={styles.revTextWrap}>
              <Text style={styles.revKicker}>REVISION PRIORITY</Text>
              <Text style={styles.revTitle} numberOfLines={1}>
                {revisionCount > 0
                  ? `${revisionCount} question${revisionCount === 1 ? "" : "s"} to revise`
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

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.warmWhite, overflow: "hidden" },
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 22, paddingTop: 4, paddingBottom: 24, position: "relative", zIndex: 1 },
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
  topRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  settingsBtn: {
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
    justifyContent: "space-between",
    gap: 12,
  },
  heroTextWrap: { flex: 1 },
  hello: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.6,
    color: Colors.muted,
    marginBottom: 6,
  },
  headline: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: -0.8,
  },
  sophieQuoteRow: {
    marginTop: 12,
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
  sophieQuote: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.ink,
    fontWeight: "600",
  },
  sophieWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  sophieHalo: {
    position: "absolute",
    backgroundColor: Colors.yellow,
  },
  xpCard: {
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
  xpHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  xpLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  xpIconChip: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.yellow,
    alignItems: "center",
    justifyContent: "center",
  },
  xpLabel: {
    color: "#C9C4AE",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.6,
  },
  xpValue: {
    color: Colors.warmWhite,
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  xpRight: { alignItems: "flex-end" },
  xpGoalLbl: {
    color: "#C9C4AE",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.6,
  },
  xpGoalVal: {
    color: Colors.warmWhite,
    fontSize: 16,
    fontWeight: "800",
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
  xpFooter: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  xpFooterText: {
    color: Colors.warmWhite,
    fontSize: 12,
    fontWeight: "700",
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 12,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.8,
    color: Colors.muted,
  },
  cardsList: { gap: 14 },
  card: {
    borderRadius: 22,
    padding: 18,
    minHeight: 96,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 2,
    borderColor: Colors.black,
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
  cardIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: { flex: 1 },
  cardTitle: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.2,
  },
  cardSubtitle: {
    marginTop: 5,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
  },
  cardMeta: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.6,
    opacity: 0.85,
  },
  cardArrow: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  revBanner: {
    marginTop: 18,
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
  upgradeBanner: {
    marginTop: 14,
    backgroundColor: Colors.yellow,
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
  upgradeIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.warmWhite,
    borderWidth: 2,
    borderColor: Colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  upgradeTextWrap: { flex: 1 },
  upgradeKicker: {
    color: Colors.black,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.6,
    marginBottom: 2,
  },
  upgradeTitle: {
    color: Colors.black,
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: -0.1,
  },
  upgradeArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.warmWhite,
    borderWidth: 1.5,
    borderColor: Colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  softPrompt: {
    marginTop: 18,
    backgroundColor: Colors.cream,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Colors.black,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  softIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.yellow,
    borderWidth: 2,
    borderColor: Colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  softTextWrap: { flex: 1 },
  softKicker: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.6,
    color: Colors.muted,
  },
  softTitle: {
    marginTop: 4,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800",
    color: Colors.black,
    letterSpacing: -0.2,
  },
  softActions: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  softCta: {
    backgroundColor: Colors.black,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: Colors.black,
  },
  softCtaTxt: {
    fontSize: 13,
    fontWeight: "900",
    color: Colors.warmWhite,
    letterSpacing: -0.1,
  },
  softLater: {
    paddingHorizontal: 8,
    paddingVertical: 9,
  },
  softLaterTxt: {
    fontSize: 13,
    fontWeight: "800",
    color: Colors.muted,
    textDecorationLine: "underline",
  },
  softClose: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.black,
    backgroundColor: Colors.warmWhite,
    alignItems: "center",
    justifyContent: "center",
  },
});

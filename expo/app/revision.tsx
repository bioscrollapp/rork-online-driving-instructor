import { Stack, router } from "expo-router";
import * as Haptics from "expo-haptics";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Flame,
  Target,
} from "lucide-react-native";
import React, { useCallback, useMemo } from "react";
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import questions, { type QuizQuestion } from "@/constants/questions";
import { useRevision } from "@/providers/revision-provider";

const SOPHIE_URL =
  "https://r2-pub.rork.com/generated-images/eab16f78-a353-4d8f-90e5-8cf7be9db68b.png";
const ANNE_URL =
  "https://r2-pub.rork.com/generated-images/04c73e33-4ca1-40ad-9069-4e659ef00463.png";

const CATEGORY_ACCENTS: Record<string, { bg: string; fg: string }> = {
  "Road signs": { bg: "#FFE9DB", fg: "#8A4B2A" },
  "Speed limits": { bg: "#E6F4FF", fg: "#1E5A8A" },
  "Stopping distances": { bg: "#FFF4B8", fg: "#6B5A00" },
  Motorways: { bg: "#E2FBEC", fg: "#14612E" },
  "Vulnerable road users": { bg: "#FFD9D9", fg: "#7A1712" },
  Safety: { bg: "#FFD9D9", fg: "#7A1712" },
};

function accentFor(category: string) {
  return (
    CATEGORY_ACCENTS[category] ?? { bg: Colors.cream, fg: Colors.black }
  );
}

function hapticLight() {
  if (Platform.OS === "web") return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

type Row = QuizQuestion & { attempts: number };

export default function RevisionScreen() {
  const { wrongIds } = useRevision();

  const rows = useMemo<Row[]>(() => {
    return wrongIds
      .map((id, idx) => {
        const q = questions.find((x) => x.id === id);
        if (!q) return null;
        return { ...q, attempts: ((idx * 3) % 4) + 1 };
      })
      .filter((x): x is Row => Boolean(x));
  }, [wrongIds]);

  const onBack = useCallback(() => {
    hapticLight();
    router.back();
  }, []);

  const onPractise = useCallback((id: string) => {
    hapticLight();
    console.log("[Revision] practise now", id);
    router.push("/quiz");
  }, []);

  const onPractiseAll = useCallback(() => {
    hapticLight();
    console.log("[Revision] practise all");
    router.push("/quiz");
  }, []);

  const empty = rows.length === 0;

  return (
    <View style={styles.root} testID="revision-root">
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.bgBlob1} pointerEvents="none" />
      <View style={styles.bgBlob2} pointerEvents="none" />

      <SafeAreaView edges={["top"]} style={styles.safe}>
        <View style={styles.topBar}>
          <Pressable
            onPress={onBack}
            style={styles.backBtn}
            hitSlop={12}
            testID="revision-back"
          >
            <ChevronLeft color={Colors.black} size={22} strokeWidth={2.8} />
          </Pressable>
          <View style={styles.topCenter}>
            <View style={styles.kickerRow}>
              <Target color={Colors.black} size={12} strokeWidth={3} />
              <Text style={styles.kicker}>REVISION PRIORITY</Text>
            </View>
          </View>
          <View style={styles.topSpacer} />
        </View>

        {empty ? (
          <EmptyState />
        ) : (
          <FlatList
            data={rows}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              <ListHeader
                count={rows.length}
                onPractiseAll={onPractiseAll}
              />
            }
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            renderItem={({ item, index }) => (
              <RevisionRow
                item={item}
                rank={index + 1}
                onPress={() => onPractise(item.id)}
              />
            )}
          />
        )}
      </SafeAreaView>

      {!empty && (
        <View style={styles.anneCorner} pointerEvents="none" testID="revision-anne">
          <View style={styles.anneBubble}>
            <Text style={styles.anneBubbleText}>
              I{"\u2019"}ll be watching.
            </Text>
            <View style={styles.anneBubbleTail} />
          </View>
          <Image
            source={{ uri: ANNE_URL }}
            style={styles.anneImg}
            resizeMode="contain"
          />
          <View style={styles.anneBadge}>
            <Text style={styles.anneBadgeText}>EXAMINER ANNE</Text>
          </View>
        </View>
      )}
    </View>
  );
}

function ListHeader({
  count,
  onPractiseAll,
}: {
  count: number;
  onPractiseAll: () => void;
}) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>
        {count} question{count === 1 ? "" : "s"}{"\n"}
        <Text style={styles.titleAccent}>need your attention</Text>
      </Text>
      <Text style={styles.subtitle}>
        These are the ones you{"\u2019"}ve slipped on before. Nail them and
        you{"\u2019"}re good for test day.
      </Text>

      <Pressable
        onPress={onPractiseAll}
        style={({ pressed }) => [
          styles.practiseAll,
          pressed && { transform: [{ scale: 0.98 }] },
        ]}
        testID="revision-practise-all"
      >
        <View style={styles.practiseAllLeft}>
          <Flame color={Colors.yellow} size={18} strokeWidth={2.8} />
          <Text style={styles.practiseAllText}>Practise all {count}</Text>
        </View>
        <ChevronRight color={Colors.yellow} size={20} strokeWidth={2.8} />
      </Pressable>

      <Text style={styles.section}>YOUR WEAK SPOTS</Text>
    </View>
  );
}

function RevisionRow({
  item,
  rank,
  onPress,
}: {
  item: Row;
  rank: number;
  onPress: () => void;
}) {
  const accent = accentFor(item.category);
  return (
    <View style={styles.row} testID={`revision-row-${item.id}`}>
      <View style={styles.rowTop}>
        <View style={styles.rankChip}>
          <Text style={styles.rankChipText}>#{rank}</Text>
        </View>
        <View style={[styles.catPill, { backgroundColor: accent.bg }]}>
          <Text style={[styles.catPillText, { color: accent.fg }]}>
            {item.category.toUpperCase()}
          </Text>
        </View>
        <View style={styles.attemptsWrap}>
          <AlertTriangle color="#C3281E" size={13} strokeWidth={2.6} />
          <Text style={styles.attemptsText}>
            {item.attempts}x wrong
          </Text>
        </View>
      </View>

      <Text style={styles.question} numberOfLines={3}>
        {item.question}
      </Text>

      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.practiseBtn,
          pressed && { transform: [{ scale: 0.98 }] },
        ]}
        testID={`revision-practise-${item.id}`}
      >
        <Text style={styles.practiseBtnText}>Practise Now</Text>
        <ChevronRight color={Colors.black} size={18} strokeWidth={2.8} />
      </Pressable>
    </View>
  );
}

function EmptyState() {
  return (
    <View style={styles.emptyWrap} testID="revision-empty">
      <View style={styles.emptyHalo} />
      <Image
        source={{ uri: SOPHIE_URL }}
        style={styles.emptySophie}
        resizeMode="contain"
      />
      <View style={styles.emptyBadge}>
        <Text style={styles.emptyBadgeText}>SOPHIE SAYS</Text>
      </View>
      <Text style={styles.emptyTitle}>
        Nothing here yet —{"\n"}keep practising!
      </Text>
      <Text style={styles.emptySub}>
        Questions you get wrong show up here, so you can drill your weak
        spots before test day.
      </Text>
      <Pressable
        onPress={() => {
          hapticLight();
          router.push("/quiz");
        }}
        style={({ pressed }) => [
          styles.emptyBtn,
          pressed && { transform: [{ scale: 0.98 }] },
        ]}
        testID="revision-empty-cta"
      >
        <Text style={styles.emptyBtnText}>Start practising</Text>
      </Pressable>
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
    bottom: -140,
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
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 6,
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
  topCenter: { flex: 1, alignItems: "center" },
  topSpacer: { width: 48 },
  kickerRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  kicker: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.8,
    color: Colors.black,
  },
  listContent: {
    paddingHorizontal: 18,
    paddingTop: 4,
    paddingBottom: 180,
  },
  header: { marginBottom: 8 },
  title: {
    marginTop: 14,
    fontSize: 32,
    lineHeight: 36,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: -0.8,
  },
  titleAccent: {
    color: Colors.black,
    backgroundColor: Colors.yellow,
  },
  subtitle: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.muted,
    fontWeight: "600",
  },
  practiseAll: {
    marginTop: 20,
    backgroundColor: Colors.black,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 20,
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  practiseAllLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  practiseAllText: {
    color: Colors.yellow,
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0.2,
  },
  section: {
    marginTop: 24,
    marginBottom: 10,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.8,
    color: Colors.muted,
  },
  row: {
    backgroundColor: Colors.warmWhite,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.black,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: { elevation: 2 },
      default: {},
    }),
  },
  rowTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  rankChip: {
    width: 30,
    height: 24,
    borderRadius: 8,
    backgroundColor: Colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  rankChipText: {
    color: Colors.yellow,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.4,
  },
  catPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: Colors.black,
  },
  catPillText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
  },
  attemptsWrap: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  attemptsText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#7A1712",
    letterSpacing: 0.3,
  },
  question: {
    marginTop: 14,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "800",
    color: Colors.black,
    letterSpacing: -0.2,
  },
  practiseBtn: {
    marginTop: 16,
    alignSelf: "flex-start",
    backgroundColor: Colors.yellow,
    borderWidth: 2,
    borderColor: Colors.black,
    paddingVertical: 14,
    paddingLeft: 20,
    paddingRight: 14,
    minHeight: 48,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  practiseBtnText: {
    fontSize: 14,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: 0.2,
  },
  emptyWrap: {
    flex: 1,
    paddingHorizontal: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyHalo: {
    position: "absolute",
    top: "22%",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: Colors.yellow,
    opacity: 0.85,
  },
  emptySophie: {
    width: 200,
    height: 200,
    marginBottom: 8,
  },
  emptyBadge: {
    backgroundColor: Colors.black,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    marginTop: 4,
  },
  emptyBadgeText: {
    color: Colors.yellow,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.4,
  },
  emptyTitle: {
    marginTop: 14,
    fontSize: 26,
    lineHeight: 30,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: -0.6,
    textAlign: "center",
  },
  emptySub: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.muted,
    fontWeight: "600",
    textAlign: "center",
    maxWidth: 320,
  },
  emptyBtn: {
    marginTop: 22,
    backgroundColor: Colors.black,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 18,
  },
  emptyBtnText: {
    color: Colors.yellow,
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0.3,
  },
  anneCorner: {
    position: "absolute",
    right: -14,
    bottom: -10,
    alignItems: "center",
    width: 170,
  },
  anneImg: {
    width: 150,
    height: 150,
  },
  anneBubble: {
    alignSelf: "flex-start",
    marginLeft: 4,
    marginBottom: -4,
    backgroundColor: Colors.black,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },
  anneBubbleText: {
    color: Colors.warmWhite,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  anneBubbleTail: {
    position: "absolute",
    bottom: -5,
    left: 18,
    width: 10,
    height: 10,
    backgroundColor: Colors.black,
    transform: [{ rotate: "45deg" }],
  },
  anneBadge: {
    marginTop: -8,
    backgroundColor: Colors.yellow,
    borderWidth: 2,
    borderColor: Colors.black,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  anneBadgeText: {
    fontSize: 9,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: 1.2,
  },
});

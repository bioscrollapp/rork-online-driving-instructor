import { router } from "expo-router";
import { ChevronRight, Dumbbell, LayoutGrid, Sparkles } from "lucide-react-native";
import React, { useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/colors";

export default function PracticeScreen() {
  const startQuiz = useCallback(() => {
    console.log("[Practice] start quiz");
    router.push("/quiz");
  }, []);

  const goCategories = useCallback(() => {
    console.log("[Practice] open categories");
    router.push("/categories");
  }, []);

  return (
    <View style={styles.root} testID="practice-root">
      <SafeAreaView edges={["top"]} style={styles.safe}>
        <View style={styles.hero}>
          <View style={styles.chip}>
            <Dumbbell color={Colors.black} size={18} strokeWidth={2.6} />
            <Text style={styles.chipText}>PRACTICE</Text>
          </View>
          <Text style={styles.title}>Drill the tricky bits</Text>
          <Text style={styles.subtitle}>
            Bite-sized practice sets tailored to what you keep slipping up on.
            Sophie has a few ready for you.
          </Text>
        </View>

        <View style={styles.startCard}>
          <View style={styles.startTopRow}>
            <View style={styles.startLeft}>
              <Text style={styles.startKicker}>QUICK SESSION</Text>
              <Text style={styles.startTitle}>15 theory questions</Text>
              <Text style={styles.startSub}>
                DVSA-style signs, speed limits & rules. Swipe at your pace.
              </Text>
            </View>
            <View style={styles.startBadge}>
              <Sparkles color={Colors.black} size={16} strokeWidth={2.8} />
              <Text style={styles.startBadgeText}>+50 XP</Text>
            </View>
          </View>

          <Pressable
            onPress={startQuiz}
            style={({ pressed }) => [
              styles.startCta,
              pressed && { transform: [{ scale: 0.98 }] },
            ]}
            testID="practice-start-quiz"
            accessibilityRole="button"
            accessibilityLabel="Start practice session"
          >
            <Text style={styles.startCtaText}>Start practising</Text>
            <Text style={styles.startCtaArrow}>→</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={goCategories}
          style={({ pressed }) => [
            styles.catCard,
            pressed && { transform: [{ scale: 0.99 }] },
          ]}
          testID="practice-open-categories"
          accessibilityRole="button"
          accessibilityLabel="Practise by topic"
        >
          <View style={styles.catIcon}>
            <LayoutGrid color={Colors.yellow} size={22} strokeWidth={2.6} />
          </View>
          <View style={styles.catBody}>
            <Text style={styles.catKicker}>BY TOPIC</Text>
            <Text style={styles.catTitle}>Practise a single category</Text>
            <Text style={styles.catSub} numberOfLines={1}>
              14 topics • Road signs, motorways, weather and more
            </Text>
          </View>
          <View style={styles.catArrow}>
            <ChevronRight color={Colors.yellow} size={18} strokeWidth={2.8} />
          </View>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.warmWhite },
  safe: { flex: 1, paddingHorizontal: 22, paddingTop: 8 },
  hero: { marginTop: 12 },
  chip: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.yellow,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: Colors.black,
  },
  chipText: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.6,
    color: Colors.black,
  },
  title: {
    marginTop: 16,
    fontSize: 30,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: -0.8,
    lineHeight: 34,
  },
  subtitle: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
    color: Colors.muted,
    fontWeight: "500",
  },
  startCard: {
    marginTop: 28,
    padding: 20,
    borderRadius: 22,
    backgroundColor: Colors.yellow,
    borderWidth: 2,
    borderColor: Colors.black,
    gap: 18,
  },
  startTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  startLeft: { flex: 1 },
  startCta: {
    backgroundColor: Colors.black,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 22,
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  startCtaText: {
    color: Colors.yellow,
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 0.2,
  },
  startCtaArrow: {
    color: Colors.yellow,
    fontSize: 22,
    fontWeight: "900",
  },
  startKicker: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.6,
    color: Colors.black,
    opacity: 0.7,
  },
  startTitle: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: -0.3,
  },
  startSub: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    color: Colors.ink,
  },
  startBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.warmWhite,
    borderWidth: 2,
    borderColor: Colors.black,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  startBadgeText: {
    fontSize: 12,
    fontWeight: "900",
    color: Colors.black,
  },
  catCard: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.black,
    borderRadius: 22,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.black,
    minHeight: 88,
  },
  catIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#2A2A2A",
    borderWidth: 1.5,
    borderColor: Colors.yellow,
    alignItems: "center",
    justifyContent: "center",
  },
  catBody: { flex: 1 },
  catKicker: {
    color: Colors.yellow,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.6,
  },
  catTitle: {
    marginTop: 3,
    color: Colors.warmWhite,
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: -0.2,
  },
  catSub: {
    marginTop: 3,
    color: "#C9C4AE",
    fontSize: 12,
    fontWeight: "600",
  },
  catArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2A2A2A",
    alignItems: "center",
    justifyContent: "center",
  },
});

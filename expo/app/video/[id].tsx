import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, ArrowRight, ChevronRight, Clock, Play, Tag } from "lucide-react-native";
import React, { useMemo } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { findVideoLesson } from "@/constants/videos";
import questions, { QuizQuestion } from "@/constants/questions";

const TOPIC_TO_CATEGORY: Record<string, string[]> = {
  "Road Signs": ["Road Signs"],
  Junctions: ["Junctions"],
  Roundabouts: ["Roundabouts"],
  "Traffic Lights": ["Junctions"],
  Motorways: ["Motorways"],
  "Speed Limits": ["Speed Limits"],
  "Vehicle Safety": ["Vehicle Safety", "Safety"],
  "Vulnerable Road Users": ["Vulnerable Road Users"],
  "Alcohol and Drugs": ["Alcohol and Drugs"],
  "Turning Left": ["Junctions"],
  "Turning Right": ["Junctions"],
  Crossroads: ["Junctions"],
  "Parallel Parking": ["Safety", "Vehicle Safety"],
  "Bay Parking Forward": ["Safety", "Vehicle Safety"],
  "Bay Parking Reverse": ["Safety", "Vehicle Safety"],
  "Stopping on the Right": ["Safety", "Vehicle Safety"],
};

const TOPIC_DESCRIPTIONS: Record<string, string> = {
  "Road Signs":
    "Learn the four shapes of UK road signs and what each one is telling you to do — from triangular warnings to circular orders. Sophie breaks down the patterns so you'll never confuse a give way with a no entry again.",
  Junctions:
    "Approaching junctions safely is one of the most tested skills on the theory exam. Sophie covers priority rules, mirror checks, and the timing of your observations.",
  Roundabouts:
    "From mini-roundabouts to multi-lane spirals, Sophie walks you through lane discipline, signalling, and how to choose the correct exit every time.",
  "Traffic Lights":
    "What each light means, what to do on amber, and how filter arrows change the rules. A short, clear refresher you'll actually remember on test day.",
  Motorways:
    "Joining, lane discipline, smart motorway signs, and what to do in a breakdown. Everything you need for confident motorway driving.",
  "Speed Limits":
    "National speed limits, how lampposts tell you the limit, and how speed limits change for different vehicle types.",
  "Vehicle Safety":
    "Daily checks, tyre pressures, lights, and the basics of keeping your vehicle roadworthy and legal.",
  "Vulnerable Road Users":
    "How to safely pass cyclists, horses, and pedestrians — including the 1.5m rule and the new Highway Code hierarchy.",
  "Alcohol and Drugs":
    "The legal limits in England, Wales and Scotland, and how alcohol and tiredness affect your reaction time behind the wheel.",
  "Turning Left":
    "Mirror, signal, position, speed, look. Sophie demos a clean left turn from approach to recovery.",
  "Turning Right":
    "Position, gap selection and timing — the three things examiners are watching for on every right turn.",
  Crossroads:
    "Marked, unmarked, and traffic-light crossroads. Who has priority and how to handle the tricky ones.",
  "Parallel Parking":
    "Step by step reference points to nail the parallel park first time, every time.",
  "Bay Parking Forward":
    "Picking your bay, your reference points, and how to straighten up without grinding the kerb.",
  "Bay Parking Reverse":
    "The classic test manoeuvre — Sophie's six-point method makes it almost foolproof.",
  "Stopping on the Right":
    "Pulling up on the right, reversing two car lengths, and rejoining traffic safely.",
};

export default function VideoPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = findVideoLesson(typeof id === "string" ? id : "");

  const related: QuizQuestion[] = useMemo(() => {
    if (!lesson) return [];
    const cats = TOPIC_TO_CATEGORY[lesson.topic] ?? [lesson.topic];
    const matches = questions.filter((q) => cats.includes(q.category));
    if (matches.length >= 3) return matches.slice(0, 3);
    const filler = questions.filter((q) => !cats.includes(q.category));
    return [...matches, ...filler].slice(0, 3);
  }, [lesson]);

  const onBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/videos");
  };

  if (!lesson) {
    return (
      <View style={styles.root}>
        <SafeAreaView edges={["top"]} style={styles.safe}>
          <View style={styles.header}>
            <Pressable
              onPress={onBack}
              style={styles.backBtn}
              hitSlop={10}
              testID="video-back"
            >
              <ArrowLeft color={Colors.black} size={20} strokeWidth={2.8} />
            </Pressable>
          </View>
          <View style={styles.notFound}>
            <Text style={styles.notFoundTitle}>Lesson not found</Text>
            <Text style={styles.notFoundText}>
              This video lesson is no longer available.
            </Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const description =
    TOPIC_DESCRIPTIONS[lesson.topic] ??
    `Sophie walks you through ${lesson.topic.toLowerCase()} step by step, with everything you need to know for the test and real driving.`;

  const onMiniTest = () => {
    console.log("[VideoPlayer] start mini test for", lesson.topic);
    router.push("/quiz");
  };

  const onRelatedPress = (q: QuizQuestion) => {
    console.log("[VideoPlayer] open related question", q.id);
    router.push("/quiz");
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={["top"]} style={styles.safe}>
        <View style={styles.header}>
          <Pressable
            onPress={onBack}
            style={({ pressed }) => [
              styles.backBtn,
              pressed && { transform: [{ scale: 0.94 }] },
            ]}
            hitSlop={10}
            testID="video-back"
          >
            <ArrowLeft color={Colors.black} size={20} strokeWidth={2.8} />
          </Pressable>
          <Text style={styles.headerTitle}>Video lesson</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            style={({ pressed }) => [
              styles.player,
              pressed && { transform: [{ scale: 0.995 }] },
            ]}
            testID="video-player"
            accessibilityLabel="Play video"
          >
            <View style={styles.playerGrid} pointerEvents="none">
              <View style={styles.gridLineH} />
              <View style={[styles.gridLineH, { top: "66.66%" }]} />
              <View style={styles.gridLineV} />
              <View style={[styles.gridLineV, { left: "66.66%" }]} />
            </View>
            <View style={styles.bigPlay}>
              <Play color={Colors.black} size={40} strokeWidth={3} fill={Colors.black} />
            </View>
            <View style={styles.playerDur}>
              <Clock color={Colors.warmWhite} size={12} strokeWidth={2.8} />
              <Text style={styles.playerDurText}>{lesson.duration}</Text>
            </View>
          </Pressable>

          <View style={styles.metaRow}>
            <View style={styles.chip}>
              <Tag color={Colors.black} size={12} strokeWidth={2.8} />
              <Text style={styles.chipText}>{lesson.section.toUpperCase()}</Text>
            </View>
          </View>

          <Text style={styles.title}>{lesson.topic}</Text>
          <Text style={styles.body}>{description}</Text>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Related questions</Text>
            <Text style={styles.sectionSub}>{related.length} from this topic</Text>
          </View>

          <View style={{ gap: 12 }}>
            {related.map((q, index) => (
              <Pressable
                key={q.id}
                onPress={() => onRelatedPress(q)}
                style={({ pressed }) => [
                  styles.qCard,
                  pressed && { transform: [{ scale: 0.99 }] },
                ]}
                testID={`related-q-${q.id}`}
              >
                <View style={styles.qIndex}>
                  <Text style={styles.qIndexText}>{index + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.qCat}>{q.category.toUpperCase()}</Text>
                  <Text style={styles.qText} numberOfLines={3}>
                    {q.question}
                  </Text>
                </View>
                <ChevronRight color={Colors.black} size={20} strokeWidth={2.6} />
              </Pressable>
            ))}
          </View>

          <Pressable
            onPress={onMiniTest}
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && { transform: [{ scale: 0.98 }] },
            ]}
            testID="video-mini-test"
            accessibilityLabel="Take a mini test on this topic"
          >
            <Text style={styles.primaryBtnText}>Take a Mini Test on This Topic</Text>
            <ArrowRight color={Colors.black} size={18} strokeWidth={3} />
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.warmWhite },
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 8,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Colors.black,
    backgroundColor: Colors.warmWhite,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: 0.4,
  },
  scroll: {
    paddingHorizontal: 22,
    paddingBottom: 60,
  },
  player: {
    aspectRatio: 16 / 9,
    width: "100%",
    borderRadius: 22,
    backgroundColor: Colors.black,
    borderWidth: 2.5,
    borderColor: Colors.black,
    overflow: "hidden",
    position: "relative",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.18,
        shadowRadius: 20,
      },
      android: { elevation: 5 },
      default: {},
    }),
  },
  playerInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  playerScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  webview: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  openYt: {
    marginTop: 14,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: Colors.black,
    backgroundColor: Colors.warmWhite,
  },
  openYtText: {
    fontSize: 12,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: 0.3,
  },
  bigPlay: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.yellow,
    borderWidth: 3,
    borderColor: Colors.black,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 6,
  },
  playerDur: {
    position: "absolute",
    bottom: 14,
    right: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(250,250,245,0.18)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  playerDurText: {
    color: Colors.warmWhite,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  metaRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 22,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.yellow,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: Colors.black,
  },
  chipText: {
    fontSize: 11,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: -0.7,
    marginTop: 12,
    lineHeight: 34,
  },
  body: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.muted,
    lineHeight: 23,
    marginTop: 10,
  },
  sectionHeader: {
    marginTop: 32,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: -0.4,
  },
  sectionSub: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.muted,
    letterSpacing: 0.2,
  },
  qCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 18,
    backgroundColor: Colors.warmWhite,
    borderWidth: 2,
    borderColor: Colors.black,
    minHeight: 72,
  },
  qIndex: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.yellow,
    borderWidth: 2,
    borderColor: Colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  qIndexText: {
    fontSize: 14,
    fontWeight: "900",
    color: Colors.black,
  },
  qCat: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
    color: Colors.muted,
    marginBottom: 4,
  },
  qText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.black,
    lineHeight: 19,
  },
  primaryBtn: {
    marginTop: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: Colors.yellow,
    paddingVertical: 18,
    minHeight: 60,
    borderRadius: 999,
    borderWidth: 2.5,
    borderColor: Colors.black,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 14,
      },
      android: { elevation: 3 },
      default: {},
    }),
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: 0.3,
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  notFoundTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: Colors.black,
  },
  notFoundText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.muted,
    textAlign: "center",
  },
});

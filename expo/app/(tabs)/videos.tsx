import { router } from "expo-router";
import { Clock, Play } from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import {
  MANOEUVRE_TOPICS,
  THEORY_TOPICS,
  VideoLesson,
  VideoSection,
} from "@/constants/videos";

const SECTIONS: VideoSection[] = ["Theory", "Manoeuvres"];

function TopicCard({
  item,
  onPress,
}: {
  item: VideoLesson;
  onPress: (v: VideoLesson) => void;
}) {
  return (
    <Pressable
      onPress={() => onPress(item)}
      style={({ pressed }) => [
        styles.card,
        pressed && { transform: [{ scale: 0.985 }] },
      ]}
      testID={`video-card-${item.id}`}
    >
      <View style={styles.thumb}>
        <View style={styles.thumbPattern} />
        <View style={styles.playCircle}>
          <Play color={Colors.black} size={22} strokeWidth={3} fill={Colors.black} />
        </View>
        <View style={styles.durChip}>
          <Clock color={Colors.warmWhite} size={11} strokeWidth={2.8} />
          <Text style={styles.durText}>{item.duration}</Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.topic}
        </Text>
        <Text style={styles.cardMeta}>VIDEO LESSON</Text>
      </View>
    </Pressable>
  );
}

export default function VideoLessonsTab() {
  const [section, setSection] = useState<VideoSection>("Theory");

  const lessons = useMemo(
    () => (section === "Theory" ? THEORY_TOPICS : MANOEUVRE_TOPICS),
    [section]
  );

  const onPlay = useCallback((v: VideoLesson) => {
    console.log("[Videos] open player", v.id);
    router.push(`/video/${v.id}`);
  }, []);

  return (
    <View style={styles.root}>
      <SafeAreaView edges={["top"]} style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.headerKicker}>WATCH & LEARN</Text>
          <Text style={styles.headerTitle}>Video Lessons</Text>
        </View>

        <View style={styles.tabsWrap}>
          <View style={styles.tabs}>
            {SECTIONS.map((s) => {
              const active = section === s;
              return (
                <Pressable
                  key={s}
                  onPress={() => setSection(s)}
                  style={[styles.tab, active && styles.tabActive]}
                  testID={`videos-tab-${s}`}
                >
                  <Text
                    style={[styles.tabText, active && styles.tabTextActive]}
                  >
                    {s}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <FlatList
          data={lessons}
          keyExtractor={(it) => it.id}
          renderItem={({ item }) => <TopicCard item={item} onPress={onPlay} />}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {section === "Theory" ? "Theory topics" : "Manoeuvre topics"}
              </Text>
              <Text style={styles.sectionCount}>{lessons.length} videos</Text>
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.warmWhite },
  safe: { flex: 1 },
  header: {
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerKicker: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.6,
    color: Colors.muted,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: -0.6,
    marginTop: 2,
  },
  tabsWrap: {
    paddingHorizontal: 22,
    paddingBottom: 16,
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: Colors.cream,
    borderRadius: 999,
    padding: 5,
    borderWidth: 2,
    borderColor: Colors.black,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    minHeight: 48,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  tabActive: {
    backgroundColor: Colors.black,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: 0.3,
  },
  tabTextActive: {
    color: Colors.yellow,
  },
  list: {
    paddingHorizontal: 22,
    paddingBottom: 140,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: -0.3,
  },
  sectionCount: {
    fontSize: 11,
    fontWeight: "800",
    color: Colors.muted,
    letterSpacing: 0.6,
  },
  card: {
    flexDirection: "row",
    borderRadius: 22,
    backgroundColor: Colors.warmWhite,
    borderWidth: 2.5,
    borderColor: Colors.black,
    overflow: "hidden",
    minHeight: 110,
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
  thumb: {
    width: 110,
    backgroundColor: Colors.yellow,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 2.5,
    borderRightColor: Colors.black,
    position: "relative",
    overflow: "hidden",
  },
  thumbPattern: {
    position: "absolute",
    top: -20,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.yellowDeep,
    opacity: 0.55,
  },
  playCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.warmWhite,
    borderWidth: 2.5,
    borderColor: Colors.black,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 3,
  },
  durChip: {
    position: "absolute",
    bottom: 8,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(26,26,26,0.85)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  durText: {
    color: Colors.warmWhite,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  cardBody: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    gap: 6,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: -0.2,
    lineHeight: 22,
  },
  cardMeta: {
    fontSize: 10.5,
    fontWeight: "800",
    color: Colors.muted,
    letterSpacing: 1.2,
  },
});

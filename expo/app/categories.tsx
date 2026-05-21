import { Stack, router, useNavigation } from "expo-router";
import * as Haptics from "expo-haptics";
import {
  Beer,
  ChevronLeft,
  CloudRain,
  Compass,
  FileText,
  Footprints,
  Gauge,
  Leaf,
  Octagon,
  RotateCw,
  Route,
  ShieldCheck,
  Siren,
  TrafficCone,
  Truck,
  Sparkles,
} from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
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
import CATEGORIES, { type Category, type CategoryId } from "@/constants/categories";
import questions from "@/constants/questions";

function IconFor({ name, color }: { name: Category["iconName"]; color: string }) {
  const props = { color, size: 26, strokeWidth: 2.6 } as const;
  switch (name) {
    case "Octagon":
      return <Octagon {...props} />;
    case "Compass":
      return <Compass {...props} />;
    case "RotateCw":
      return <RotateCw {...props} />;
    case "TrafficCone":
      return <TrafficCone {...props} />;
    case "Route":
      return <Route {...props} />;
    case "Gauge":
      return <Gauge {...props} />;
    case "ShieldCheck":
      return <ShieldCheck {...props} />;
    case "Footprints":
      return <Footprints {...props} />;
    case "Beer":
      return <Beer {...props} />;
    case "Truck":
      return <Truck {...props} />;
    case "CloudRain":
      return <CloudRain {...props} />;
    case "FileText":
      return <FileText {...props} />;
    case "Leaf":
      return <Leaf {...props} />;
    case "Siren":
      return <Siren {...props} />;
    default:
      return <Sparkles {...props} />;
  }
}

function hapticLight() {
  if (Platform.OS === "web") return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

function hapticMedium() {
  if (Platform.OS === "web") return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
}

export default function CategoriesScreen() {
  const { width } = useWindowDimensions();
  const gap = 12;
  const cols = 2;
  const sidePad = 22;
  const cardW = Math.floor((width - sidePad * 2 - gap * (cols - 1)) / cols);

  const [selectedId, setSelectedId] = useState<CategoryId | null>(null);
  const navigation = useNavigation();

  const onBack = useCallback(() => {
    if (navigation.canGoBack()) router.back();
    else router.replace("/(tabs)/practice");
  }, [navigation]);

  const onTap = useCallback((cat: Category) => {
    hapticLight();
    setSelectedId(cat.id);
  }, []);

  const onStart = useCallback(() => {
    if (!selectedId) return;
    const cat = CATEGORIES.find((c) => c.id === selectedId);
    if (!cat) return;
    hapticMedium();
    console.log("[Categories] start practice", cat.name);
    router.push({ pathname: "/quiz", params: { category: cat.name } });
  }, [selectedId]);

  const totalQ = questions.length;

  return (
    <View style={styles.root} testID="categories-root">
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.bgBlob1} pointerEvents="none" />
      <View style={styles.bgBlob2} pointerEvents="none" />

      <SafeAreaView edges={["top"]} style={styles.safe}>
        <View style={styles.topBar}>
          <Pressable
            onPress={onBack}
            style={({ pressed }) => [
              styles.backBtn,
              pressed && { transform: [{ scale: 0.94 }] },
            ]}
            hitSlop={12}
            testID="categories-back"
          >
            <ChevronLeft color={Colors.black} size={22} strokeWidth={2.8} />
          </Pressable>
          <View style={styles.brandRow}>
            <View style={styles.brandDot} />
            <Text style={styles.brandText}>BY TOPIC</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Pick your topic.</Text>
          <Text style={styles.subtitle}>
            Tap a category, then start a focused practice round. {totalQ}{" "}
            questions across the bank.
          </Text>

          <View style={styles.grid}>
            {CATEGORIES.map((c) => {
              const isSelected = selectedId === c.id;
              const bg = isSelected ? Colors.yellow : Colors.black;
              const fg = isSelected ? Colors.black : Colors.warmWhite;
              const iconBg = isSelected ? Colors.black : Colors.yellow;
              const iconFg = isSelected ? Colors.yellow : Colors.black;
              const count = questions.filter((q) => q.category === c.name).length;
              return (
                <Pressable
                  key={c.id}
                  onPress={() => onTap(c)}
                  style={({ pressed }) => [
                    styles.card,
                    {
                      width: cardW,
                      backgroundColor: bg,
                      transform: [{ scale: pressed ? 0.97 : 1 }],
                    },
                    isSelected && styles.cardSelected,
                  ]}
                  testID={`cat-${c.id}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={`${c.name}, ${count} questions${isSelected ? ", selected" : ""}`}
                >
                  <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
                    <IconFor name={c.iconName} color={iconFg} />
                  </View>
                  <Text style={[styles.cardTitle, { color: fg }]} numberOfLines={2}>
                    {c.name}
                  </Text>
                  <Text
                    style={[
                      styles.cardSub,
                      { color: isSelected ? Colors.ink : "#D9D5C0" },
                    ]}
                    numberOfLines={1}
                  >
                    {c.blurb}
                  </Text>
                  <View
                    style={[
                      styles.countPill,
                      {
                        backgroundColor: isSelected ? Colors.black : Colors.yellow,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.countTxt,
                        {
                          color: isSelected ? Colors.yellow : Colors.black,
                        },
                      ]}
                    >
                      {count > 0 ? `${count} Qs` : "Coming soon"}
                    </Text>
                  </View>
                  {isSelected && (
                    <View style={styles.selDot} testID={`cat-${c.id}-selected`} />
                  )}
                </Pressable>
              );
            })}
          </View>

          <View style={{ height: 140 }} />
        </ScrollView>

        <View style={styles.footer} pointerEvents="box-none">
          <View style={styles.footerInner}>
            <Pressable
              onPress={onStart}
              disabled={!selectedId}
              style={({ pressed }) => [
                styles.cta,
                !selectedId && styles.ctaDisabled,
                pressed && selectedId ? { transform: [{ scale: 0.98 }] } : null,
              ]}
              testID="categories-start"
              accessibilityRole="button"
              accessibilityLabel="Start practice for selected topic"
            >
              <Text style={styles.ctaText}>
                {selectedId
                  ? `Start ${CATEGORIES.find((c) => c.id === selectedId)?.short}`
                  : "Pick a topic to start"}
              </Text>
              <View style={styles.ctaArrow}>
                <Text style={styles.ctaArrowTxt}>→</Text>
              </View>
            </Pressable>
          </View>
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
  topBar: {
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  brandRow: { flexDirection: "row", alignItems: "center", gap: 8 },
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
  scroll: { paddingHorizontal: 22, paddingTop: 8 },
  title: {
    marginTop: 4,
    fontSize: 30,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: -0.8,
    lineHeight: 34,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    color: Colors.muted,
    fontWeight: "500",
  },
  grid: {
    marginTop: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  card: {
    minHeight: 158,
    borderRadius: 22,
    padding: 14,
    borderWidth: 2,
    borderColor: Colors.black,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: { elevation: 2 },
      default: {},
    }),
  },
  cardSelected: {
    transform: [{ translateY: -2 }],
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.18,
        shadowRadius: 14,
      },
      android: { elevation: 6 },
      default: {},
    }),
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: -0.2,
    lineHeight: 19,
  },
  cardSub: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  countPill: {
    alignSelf: "flex-start",
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: Colors.black,
  },
  countTxt: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },
  selDot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.black,
    borderWidth: 2,
    borderColor: Colors.yellow,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  footerInner: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 22,
    backgroundColor: "rgba(250,250,245,0.92)",
    borderTopWidth: 1,
    borderTopColor: Colors.line,
  },
  cta: {
    backgroundColor: Colors.black,
    borderRadius: 20,
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
  ctaArrowTxt: {
    fontSize: 18,
    fontWeight: "900",
    color: Colors.black,
  },
});

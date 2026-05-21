import { LinearGradient } from "expo-linear-gradient";
import { router, Stack, useNavigation } from "expo-router";
import {
  Check,
  ChevronLeft,
  Coffee,
  Crown,
  Lock,
  Sparkles,
  Target,
  X,
  Zap,
} from "lucide-react-native";
import { useMutation } from "@tanstack/react-query";
import React, { useCallback } from "react";
import {
  Alert,
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
import {
  purchasePremium,
  restorePremium,
  type PurchaseOutcome,
} from "@/lib/purchases";

const SOPHIE_URL =
  "https://r2-pub.rork.com/generated-images/eab16f78-a353-4d8f-90e5-8cf7be9db68b.png";

type PlanFeature = {
  label: string;
  free: boolean;
  premium: boolean;
};

const FEATURES: PlanFeature[] = [
  { label: "50 practice questions", free: true, premium: true },
  { label: "Full DVSA question bank", free: false, premium: true },
  { label: "2 sample video lessons", free: true, premium: true },
  { label: "All video lessons", free: false, premium: true },
  { label: "Basic progress tracking", free: true, premium: true },
  { label: "Full mock theory tests", free: false, premium: true },
  { label: "Revision priority queue", free: false, premium: true },
  { label: "AI-powered explanations", free: false, premium: true },
];

export default function PremiumScreen() {
  const { width } = useWindowDimensions();
  const sophieSize = Math.min(width * 0.34, 150);
  const { user, isGuest } = useAuth();
  const navigation = useNavigation();

  const goBack = useCallback(() => {
    if (navigation.canGoBack()) router.back();
    else router.replace("/(tabs)/home");
  }, [navigation]);

  const handleOutcome = useCallback(
    (outcome: PurchaseOutcome, mode: "purchase" | "restore") => {
      console.log("[Premium] outcome", mode, outcome);
      if (outcome.kind === "success") {
        if (outcome.isPremium) {
          Alert.alert(
            "You're in! 🎉",
            "Welcome to TODI Premium. Everything is unlocked — go smash it.",
            [{ text: "Let's go", onPress: goBack }]
          );
        } else {
          Alert.alert(
            "Nothing to restore",
            "We couldn't find a previous Premium purchase on this account."
          );
        }
        return;
      }
      if (outcome.kind === "cancelled") {
        return;
      }
      if (outcome.kind === "pending") {
        Alert.alert(
          "Payment pending",
          "Your payment is processing. We'll unlock Premium as soon as it's confirmed."
        );
        return;
      }
      if (outcome.kind === "placeholder") {
        Alert.alert(
          "Demo mode",
          "RevenueCat is using placeholder API keys. Set EXPO_PUBLIC_REVENUECAT_* keys to enable real purchases."
        );
        return;
      }
      Alert.alert(
        mode === "purchase" ? "Purchase failed" : "Restore failed",
        outcome.message
      );
    },
    [goBack]
  );

  const purchaseMutation = useMutation({
    mutationFn: () => purchasePremium(),
    onSuccess: (outcome) => handleOutcome(outcome, "purchase"),
    onError: (e: unknown) => {
      const msg = e instanceof Error ? e.message : "Something went wrong.";
      Alert.alert("Purchase failed", msg);
    },
  });

  const restoreMutation = useMutation({
    mutationFn: () => restorePremium(),
    onSuccess: (outcome) => handleOutcome(outcome, "restore"),
    onError: (e: unknown) => {
      const msg = e instanceof Error ? e.message : "Could not restore.";
      Alert.alert("Restore failed", msg);
    },
  });

  const purchasing = purchaseMutation.isPending;
  const restoring = restoreMutation.isPending;

  const onPurchase = useCallback(() => {
    console.log("[Premium] purchase tapped", { isGuest });
    if (isGuest) {
      router.push({
        pathname: "/sign-in",
        params: { reason: "premium", redirect: "/premium" },
      });
      return;
    }
    purchaseMutation.mutate();
  }, [purchaseMutation, isGuest]);

  const onRestore = useCallback(() => {
    console.log("[Premium] restore tapped");
    restoreMutation.mutate();
  }, [restoreMutation]);

  return (
    <View style={styles.root} testID="premium-root">
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.bgBlob1} pointerEvents="none" />
      <View style={styles.bgBlob2} pointerEvents="none" />

      <SafeAreaView edges={["top"]} style={styles.safe}>
        <View style={styles.topBar}>
          <Pressable
            onPress={goBack}
            style={({ pressed }) => [
              styles.backBtn,
              pressed && { transform: [{ scale: 0.96 }] },
            ]}
            hitSlop={10}
            testID="premium-back"
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <ChevronLeft color={Colors.black} size={22} strokeWidth={2.8} />
          </Pressable>
          <Text style={styles.topTitle}>UPGRADE</Text>
          <View style={styles.backBtnSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
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
                style={{
                  width: sophieSize * 1.08,
                  height: sophieSize * 1.08,
                }}
                resizeMode="contain"
                testID="sophie-avatar"
              />
              <View style={styles.crownChip}>
                <Crown
                  color={Colors.black}
                  size={14}
                  strokeWidth={2.8}
                  fill={Colors.black}
                />
                <Text style={styles.crownChipTxt}>PREMIUM</Text>
              </View>
            </View>

            <Text style={styles.kicker}>FOR LEARNERS WHO MEAN IT</Text>
            <Text style={styles.title}>
              Unlock{"\n"}Everything
            </Text>
            <Text style={styles.subtitle}>
              One small payment. Every question, every video, every tool to
              pass first time.
            </Text>
          </View>

          <View style={styles.compareCard} testID="compare-card">
            <View style={styles.compareHeader}>
              <Text style={[styles.compareCol, styles.compareLeftCol]}>
                FEATURE
              </Text>
              <View style={styles.compareRightHeader}>
                <View style={styles.colPillFree}>
                  <Text style={styles.colPillFreeTxt}>FREE</Text>
                </View>
                <View style={styles.colPillPro}>
                  <Crown
                    color={Colors.black}
                    size={11}
                    strokeWidth={2.8}
                    fill={Colors.black}
                  />
                  <Text style={styles.colPillProTxt}>PRO</Text>
                </View>
              </View>
            </View>

            {FEATURES.map((f, i) => (
              <View
                key={f.label}
                style={[
                  styles.compareRow,
                  i !== FEATURES.length - 1 && styles.compareRowDivider,
                ]}
                testID={`feature-${i}`}
              >
                <Text style={styles.featureLabel} numberOfLines={2}>
                  {f.label}
                </Text>
                <View style={styles.compareCells}>
                  <View
                    style={[
                      styles.cell,
                      f.free ? styles.cellOn : styles.cellOff,
                    ]}
                  >
                    {f.free ? (
                      <Check
                        color={Colors.black}
                        size={16}
                        strokeWidth={3.2}
                      />
                    ) : (
                      <X color={Colors.muted} size={16} strokeWidth={3} />
                    )}
                  </View>
                  <View
                    style={[
                      styles.cell,
                      f.premium ? styles.cellPro : styles.cellOff,
                    ]}
                  >
                    {f.premium ? (
                      <Check
                        color={Colors.black}
                        size={16}
                        strokeWidth={3.2}
                      />
                    ) : (
                      <X color={Colors.muted} size={16} strokeWidth={3} />
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.perksRow}>
            <View style={styles.perkChip}>
              <Zap
                color={Colors.black}
                size={14}
                strokeWidth={2.8}
                fill={Colors.black}
              />
              <Text style={styles.perkTxt}>Unlimited XP</Text>
            </View>
            <View style={styles.perkChip}>
              <Target color={Colors.black} size={14} strokeWidth={2.8} />
              <Text style={styles.perkTxt}>Smart revision</Text>
            </View>
            <View style={styles.perkChip}>
              <Sparkles color={Colors.black} size={14} strokeWidth={2.8} />
              <Text style={styles.perkTxt}>AI hints</Text>
            </View>
          </View>

          <View style={styles.priceCard} testID="price-card">
            <LinearGradient
              colors={[Colors.black, "#2A2A2A"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.priceTopRow}>
              <View style={styles.lifetimePill}>
                <Lock color={Colors.black} size={11} strokeWidth={2.8} />
                <Text style={styles.lifetimeTxt}>LIFETIME ACCESS</Text>
              </View>
              <View style={styles.bestPill}>
                <Text style={styles.bestPillTxt}>BEST VALUE</Text>
              </View>
            </View>

            <View style={styles.priceRow}>
              <Text style={styles.priceCurrency}>£</Text>
              <Text style={styles.priceAmount}>3.99</Text>
              <Text style={styles.priceOnce}>once</Text>
            </View>

            <View style={styles.coffeeRow}>
              <Coffee color={Colors.yellow} size={14} strokeWidth={2.6} />
              <Text style={styles.coffeeTxt}>
                Cheaper than a coffee. Cheaper than a resit.
              </Text>
            </View>

            <Pressable
              onPress={onPurchase}
              disabled={purchasing}
              style={({ pressed }) => [
                styles.cta,
                pressed && { transform: [{ scale: 0.985 }] },
                purchasing && { opacity: 0.75 },
              ]}
              testID="cta-purchase"
              accessibilityRole="button"
              accessibilityLabel="Unlock Now for 3.99 pounds"
            >
              <Crown
                color={Colors.black}
                size={20}
                strokeWidth={2.8}
                fill={Colors.black}
              />
              <Text style={styles.ctaTxt}>
                {purchasing
                  ? "Unlocking…"
                  : isGuest
                  ? "Sign in to Unlock — £3.99"
                  : "Unlock Now — £3.99"}
              </Text>
            </Pressable>

            <Text style={styles.fineprint}>
              {isGuest
                ? "You'll sign in once so we can save your Premium across devices."
                : user?.email
                ? `Signed in as ${user.email}. One-time payment, no subscription ever.`
                : "One-time payment, no subscription ever."}
            </Text>
          </View>

          <Pressable
            onPress={onRestore}
            disabled={restoring}
            style={({ pressed }) => [
              styles.restore,
              pressed && { opacity: 0.6 },
            ]}
            testID="restore-btn"
            accessibilityRole="button"
            accessibilityLabel="Restore purchases"
          >
            <Text style={styles.restoreTxt}>
              {restoring ? "Checking…" : "Restore purchases"}
            </Text>
          </Pressable>

          <Text style={styles.legal}>
            Payment will be charged to your account at confirmation. No
            recurring fees. Terms & Privacy apply.
          </Text>

          <View style={{ height: 32 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.warmWhite, overflow: "hidden" },
  safe: { flex: 1 },
  bgBlob1: {
    position: "absolute",
    top: -160,
    right: -120,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: Colors.yellow,
    opacity: 0.28,
  },
  bgBlob2: {
    position: "absolute",
    bottom: -140,
    left: -120,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: Colors.cream,
    opacity: 0.55,
  },
  topBar: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.warmWhite,
    borderWidth: 2,
    borderColor: Colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnSpacer: { width: 44, height: 44 },
  topTitle: {
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 2,
    color: Colors.black,
  },
  scroll: { paddingHorizontal: 22, paddingTop: 4, paddingBottom: 24 },

  hero: {
    alignItems: "center",
    marginTop: 4,
  },
  sophieWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  sophieHalo: {
    position: "absolute",
    backgroundColor: Colors.yellow,
  },
  crownChip: {
    position: "absolute",
    bottom: -6,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.yellow,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: Colors.black,
  },
  crownChipTxt: {
    fontSize: 11,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: 1.4,
  },
  kicker: {
    marginTop: 22,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.8,
    color: Colors.muted,
  },
  title: {
    marginTop: 6,
    fontSize: 38,
    lineHeight: 40,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: -1.2,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 10,
    paddingHorizontal: 8,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
    color: Colors.ink,
    textAlign: "center",
  },

  compareCard: {
    marginTop: 26,
    backgroundColor: Colors.warmWhite,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Colors.black,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 4,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 14,
      },
      android: { elevation: 3 },
      default: {},
    }),
  },
  compareHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.line,
  },
  compareCol: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.6,
    color: Colors.muted,
  },
  compareLeftCol: { flex: 1 },
  compareRightHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  colPillFree: {
    width: 56,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: Colors.black,
    alignItems: "center",
    backgroundColor: Colors.warmWhite,
  },
  colPillFreeTxt: {
    fontSize: 10,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: 1.2,
  },
  colPillPro: {
    width: 56,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: Colors.black,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    backgroundColor: Colors.yellow,
  },
  colPillProTxt: {
    fontSize: 10,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: 1.2,
  },
  compareRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    minHeight: 52,
  },
  compareRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
  },
  featureLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: Colors.black,
    letterSpacing: -0.1,
    paddingRight: 10,
  },
  compareCells: {
    flexDirection: "row",
    gap: 8,
  },
  cell: {
    width: 56,
    height: 32,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  cellOn: { backgroundColor: Colors.cream },
  cellPro: { backgroundColor: Colors.yellow },
  cellOff: {
    backgroundColor: Colors.warmWhite,
    borderColor: "#D7D2BD",
  },

  perksRow: {
    marginTop: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  perkChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: Colors.black,
    backgroundColor: Colors.warmWhite,
  },
  perkTxt: {
    fontSize: 12,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: -0.1,
  },

  priceCard: {
    marginTop: 22,
    borderRadius: 26,
    padding: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: Colors.black,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.22,
    shadowRadius: 22,
    elevation: 8,
  },
  priceTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  lifetimePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.yellow,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  lifetimeTxt: {
    fontSize: 10,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: 1.4,
  },
  bestPill: {
    backgroundColor: "#2E2E2E",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.yellow,
  },
  bestPillTxt: {
    fontSize: 10,
    fontWeight: "900",
    color: Colors.yellow,
    letterSpacing: 1.4,
  },
  priceRow: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 4,
  },
  priceCurrency: {
    color: Colors.warmWhite,
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 14,
  },
  priceAmount: {
    color: Colors.warmWhite,
    fontSize: 72,
    lineHeight: 76,
    fontWeight: "900",
    letterSpacing: -3,
  },
  priceOnce: {
    color: "#C9C4AE",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 18,
    marginLeft: 6,
    letterSpacing: 0.4,
  },
  coffeeRow: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  coffeeTxt: {
    color: Colors.warmWhite,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: -0.1,
  },
  cta: {
    marginTop: 18,
    minHeight: 60,
    borderRadius: 18,
    backgroundColor: Colors.yellow,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 2,
    borderColor: Colors.yellow,
  },
  ctaTxt: {
    fontSize: 17,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: -0.3,
  },
  fineprint: {
    marginTop: 12,
    textAlign: "center",
    color: "#C9C4AE",
    fontSize: 12,
    fontWeight: "700",
  },

  restore: {
    marginTop: 22,
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  restoreTxt: {
    fontSize: 14,
    fontWeight: "900",
    color: Colors.black,
    textDecorationLine: "underline",
    letterSpacing: -0.2,
  },
  legal: {
    marginTop: 6,
    textAlign: "center",
    color: Colors.muted,
    fontSize: 11,
    fontWeight: "600",
    lineHeight: 16,
    paddingHorizontal: 12,
  },
});

import { router, Stack, useNavigation } from "expo-router";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Clock,
  Cloud,
  Eye,
  Info,
  LogOut,
  Star,
  Type,
  Volume2,
  VolumeX,
  Headphones,
  Sparkles,
} from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useAuth } from "@/providers/auth-provider";
import { useSettings, AppSettings } from "@/providers/settings-provider";

const APP_VERSION = "1.0.0";

type Row = {
  key: keyof Pick<
    AppSettings,
    "dyslexiaFont" | "largeText" | "highContrast" | "readAloud" | "soundEffects"
  >;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  tint: string;
};

function formatTime(h: number, m: number): string {
  const hh = h.toString().padStart(2, "0");
  const mm = m.toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

function TimePickerModal({
  visible,
  hour,
  minute,
  onClose,
  onSave,
}: {
  visible: boolean;
  hour: number;
  minute: number;
  onClose: () => void;
  onSave: (h: number, m: number) => void;
}) {
  const [h, setH] = useState<number>(hour);
  const [m, setM] = useState<number>(minute);

  const minuteOptions = useMemo(() => [0, 15, 30, 45], []);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable style={styles.modalCard} onPress={() => {}}>
          <Text style={styles.modalKicker}>REMINDER TIME</Text>
          <Text style={styles.modalTitle}>When should we nudge you?</Text>

          <Text style={styles.modalGroupLbl}>HOUR</Text>
          <View style={styles.modalGrid}>
            {Array.from({ length: 24 }, (_, i) => i).map((opt) => {
              const sel = opt === h;
              return (
                <Pressable
                  key={`h-${opt}`}
                  onPress={() => setH(opt)}
                  style={[styles.modalChip, sel && styles.modalChipSel]}
                  testID={`time-h-${opt}`}
                >
                  <Text
                    style={[
                      styles.modalChipTxt,
                      sel && styles.modalChipTxtSel,
                    ]}
                  >
                    {opt.toString().padStart(2, "0")}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.modalGroupLbl}>MINUTE</Text>
          <View style={styles.modalGrid}>
            {minuteOptions.map((opt) => {
              const sel = opt === m;
              return (
                <Pressable
                  key={`m-${opt}`}
                  onPress={() => setM(opt)}
                  style={[
                    styles.modalChip,
                    styles.modalChipWide,
                    sel && styles.modalChipSel,
                  ]}
                  testID={`time-m-${opt}`}
                >
                  <Text
                    style={[
                      styles.modalChipTxt,
                      sel && styles.modalChipTxtSel,
                    ]}
                  >
                    :{opt.toString().padStart(2, "0")}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.modalActions}>
            <Pressable
              onPress={onClose}
              style={[styles.modalBtn, styles.modalBtnGhost]}
              testID="time-cancel"
            >
              <Text style={styles.modalBtnGhostTxt}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={() => onSave(h, m)}
              style={[styles.modalBtn, styles.modalBtnPrimary]}
              testID="time-save"
            >
              <Text style={styles.modalBtnPrimaryTxt}>Save</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function SettingsScreen() {
  const { settings, update } = useSettings();
  const { user, isGuest, signOut } = useAuth();
  const [pickerOpen, setPickerOpen] = useState<boolean>(false);
  const navigation = useNavigation();

  const goBack = useCallback(() => {
    if (navigation.canGoBack()) router.back();
    else router.replace("/(tabs)/home");
  }, [navigation]);

  const onRate = useCallback(async () => {
    console.log("[Settings] rate");
    const url =
      Platform.OS === "ios"
        ? "itms-apps://itunes.apple.com/app/id000000000?action=write-review"
        : "market://details?id=app.todi";
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Thanks!", "We'll open the store on a real device.");
      }
    } catch {
      Alert.alert("Thanks!", "Couldn't open the store right now.");
    }
  }, []);

  const rows: Row[] = [
    {
      key: "dyslexiaFont",
      title: "Dyslexia-friendly font",
      subtitle: "Switch to OpenDyslexic across the app.",
      icon: <Type color={Colors.black} size={20} strokeWidth={2.6} />,
      tint: Colors.yellow,
    },
    {
      key: "largeText",
      title: "Large text",
      subtitle: "Bigger letters everywhere for easier reading.",
      icon: <Sparkles color={Colors.black} size={20} strokeWidth={2.6} />,
      tint: "#FFE7A8",
    },
    {
      key: "highContrast",
      title: "High contrast",
      subtitle: "Boost contrast for clearer visuals.",
      icon: <Eye color={Colors.black} size={20} strokeWidth={2.6} />,
      tint: "#D8F3C2",
    },
    {
      key: "readAloud",
      title: "Read questions aloud",
      subtitle: "Sophie reads each question out for you.",
      icon: <Headphones color={Colors.black} size={20} strokeWidth={2.6} />,
      tint: "#FFD6CB",
    },
    {
      key: "soundEffects",
      title: "Sound effects",
      subtitle: "Little chimes and dings during practice.",
      icon: settings.soundEffects ? (
        <Volume2 color={Colors.black} size={20} strokeWidth={2.6} />
      ) : (
        <VolumeX color={Colors.black} size={20} strokeWidth={2.6} />
      ),
      tint: "#CDE7FF",
    },
  ];

  const goSignIn = useCallback(() => {
    console.log("[Settings] sign in tapped");
    router.push({ pathname: "/sign-in", params: { reason: "manual" } });
  }, []);

  const onSignOut = useCallback(() => {
    Alert.alert(
      "Sign out?",
      "Your progress on this device will stay saved.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign out",
          style: "destructive",
          onPress: () => {
            signOut().catch((e) => console.log("[Settings] signOut failed", e));
          },
        },
      ]
    );
  }, [signOut]);

  const userLevel = 3;
  const userTitle = "Learner Driver";
  const userName = user?.name ?? user?.email ?? "Guest Learner";
  const initials = (user?.name ?? user?.email ?? "GL")
    .split(/[\s@]/)
    .filter(Boolean)
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <View style={styles.root} testID="settings-root">
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
            testID="settings-back"
            accessibilityRole="button"
            accessibilityLabel="Back"
          >
            <ChevronLeft color={Colors.black} size={22} strokeWidth={2.8} />
          </Pressable>
          <Text style={styles.topTitle}>SETTINGS</Text>
          <View style={styles.backBtnSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.profileCard} testID="profile-card">
            <View style={styles.avatarWrap}>
              <View style={styles.avatarHalo} />
              <View style={styles.avatar}>
                <Text style={styles.avatarTxt}>{initials}</Text>
              </View>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileHello}>
                {isGuest ? "GUEST MODE" : "SIGNED IN"}
              </Text>
              <Text style={styles.profileName} numberOfLines={1}>
                {userName}
              </Text>
              <View style={styles.levelChip}>
                <Star
                  color={Colors.black}
                  size={12}
                  strokeWidth={2.8}
                  fill={Colors.black}
                />
                <Text style={styles.levelChipTxt}>
                  LEVEL {userLevel} · {userTitle.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>

          <Text style={styles.section}>ACCOUNT</Text>
          <View style={styles.card}>
            {isGuest ? (
              <Pressable
                onPress={goSignIn}
                style={({ pressed }) => [
                  styles.row,
                  pressed && { opacity: 0.85 },
                ]}
                testID="row-signin"
                accessibilityRole="button"
                accessibilityLabel="Sign in to back up progress"
              >
                <View style={[styles.rowIcon, { backgroundColor: Colors.yellow }]}>
                  <Cloud color={Colors.black} size={20} strokeWidth={2.6} />
                </View>
                <View style={styles.rowText}>
                  <Text style={styles.rowTitle}>Sign in to save progress</Text>
                  <Text style={styles.rowSub} numberOfLines={2}>
                    Optional. Sync XP, streaks and revision across devices.
                  </Text>
                </View>
                <ChevronRight color={Colors.black} size={20} strokeWidth={2.8} />
              </Pressable>
            ) : (
              <>
                <View style={[styles.row, styles.rowDivider]} testID="row-account">
                  <View style={[styles.rowIcon, { backgroundColor: "#D8F3C2" }]}>
                    <Cloud color={Colors.black} size={20} strokeWidth={2.6} />
                  </View>
                  <View style={styles.rowText}>
                    <Text style={styles.rowTitle} numberOfLines={1}>
                      {user?.email ?? "Signed in"}
                    </Text>
                    <Text style={styles.rowSub} numberOfLines={1}>
                      Progress is syncing across your devices.
                    </Text>
                  </View>
                  <View style={styles.versionPill}>
                    <Text style={styles.versionTxt}>
                      {(user?.provider ?? "linked").toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Pressable
                  onPress={onSignOut}
                  style={({ pressed }) => [
                    styles.row,
                    pressed && { opacity: 0.85 },
                  ]}
                  testID="row-signout"
                  accessibilityRole="button"
                  accessibilityLabel="Sign out"
                >
                  <View style={[styles.rowIcon, { backgroundColor: "#FFD6CB" }]}>
                    <LogOut color={Colors.black} size={20} strokeWidth={2.6} />
                  </View>
                  <View style={styles.rowText}>
                    <Text style={styles.rowTitle}>Sign out</Text>
                    <Text style={styles.rowSub} numberOfLines={2}>
                      Your local progress will stay on this device.
                    </Text>
                  </View>
                  <ChevronRight color={Colors.black} size={20} strokeWidth={2.8} />
                </Pressable>
              </>
            )}
          </View>

          <Text style={styles.section}>ACCESSIBILITY</Text>
          <View style={styles.card}>
            {rows.map((r, i) => {
              const value = settings[r.key];
              return (
                <View
                  key={r.key}
                  style={[
                    styles.row,
                    i !== rows.length - 1 && styles.rowDivider,
                  ]}
                  testID={`row-${r.key}`}
                >
                  <View style={[styles.rowIcon, { backgroundColor: r.tint }]}>
                    {r.icon}
                  </View>
                  <View style={styles.rowText}>
                    <Text style={styles.rowTitle}>{r.title}</Text>
                    <Text style={styles.rowSub} numberOfLines={2}>
                      {r.subtitle}
                    </Text>
                  </View>
                  <Switch
                    value={value}
                    onValueChange={(v) => update(r.key, v)}
                    trackColor={{ false: "#D7D2BD", true: Colors.yellow }}
                    thumbColor={Colors.black}
                    ios_backgroundColor="#D7D2BD"
                    style={styles.switch}
                    testID={`switch-${r.key}`}
                  />
                </View>
              );
            })}
          </View>

          <Text style={styles.section}>NOTIFICATIONS</Text>
          <View style={styles.card}>
            <View
              style={[styles.row, styles.rowDivider]}
              testID="row-dailyReminder"
            >
              <View style={[styles.rowIcon, { backgroundColor: "#FFE0F0" }]}>
                <Bell color={Colors.black} size={20} strokeWidth={2.6} />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>Daily reminder</Text>
                <Text style={styles.rowSub} numberOfLines={2}>
                  A gentle nudge to keep your streak alive.
                </Text>
              </View>
              <Switch
                value={settings.dailyReminder}
                onValueChange={(v) => update("dailyReminder", v)}
                trackColor={{ false: "#D7D2BD", true: Colors.yellow }}
                thumbColor={Colors.black}
                ios_backgroundColor="#D7D2BD"
                style={styles.switch}
                testID="switch-dailyReminder"
              />
            </View>

            <Pressable
              onPress={() => {
                if (!settings.dailyReminder) return;
                setPickerOpen(true);
              }}
              style={({ pressed }) => [
                styles.row,
                !settings.dailyReminder && { opacity: 0.45 },
                pressed && settings.dailyReminder && { opacity: 0.85 },
              ]}
              testID="row-reminderTime"
              accessibilityRole="button"
              accessibilityLabel="Change reminder time"
              disabled={!settings.dailyReminder}
            >
              <View style={[styles.rowIcon, { backgroundColor: "#E8DBFF" }]}>
                <Clock color={Colors.black} size={20} strokeWidth={2.6} />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>Reminder time</Text>
                <Text style={styles.rowSub} numberOfLines={1}>
                  {formatTime(settings.reminderHour, settings.reminderMinute)}{" "}
                  every day
                </Text>
              </View>
              <View style={styles.timeChip}>
                <Text style={styles.timeChipTxt}>
                  {formatTime(settings.reminderHour, settings.reminderMinute)}
                </Text>
                <ChevronRight
                  color={Colors.black}
                  size={16}
                  strokeWidth={2.8}
                />
              </View>
            </Pressable>
          </View>

          <Text style={styles.section}>ABOUT</Text>
          <View style={styles.card}>
            <View style={[styles.row, styles.rowDivider]} testID="row-version">
              <View style={[styles.rowIcon, { backgroundColor: Colors.cream }]}>
                <Info color={Colors.black} size={20} strokeWidth={2.6} />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>App version</Text>
                <Text style={styles.rowSub}>The Online Driving Instructor</Text>
              </View>
              <View style={styles.versionPill}>
                <Text style={styles.versionTxt}>v{APP_VERSION}</Text>
              </View>
            </View>

            <Pressable
              onPress={onRate}
              style={({ pressed }) => [
                styles.row,
                pressed && { opacity: 0.85 },
              ]}
              testID="row-rate"
              accessibilityRole="button"
              accessibilityLabel="Rate the app"
            >
              <View style={[styles.rowIcon, { backgroundColor: Colors.yellow }]}>
                <Star
                  color={Colors.black}
                  size={20}
                  strokeWidth={2.6}
                  fill={Colors.black}
                />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>Rate the app</Text>
                <Text style={styles.rowSub} numberOfLines={2}>
                  Loving it? Leave us a quick five stars.
                </Text>
              </View>
              <ChevronRight color={Colors.black} size={20} strokeWidth={2.8} />
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerTxt}>Made with care · UK Theory 2026</Text>
          </View>

          <View style={{ height: 32 }} />
        </ScrollView>
      </SafeAreaView>

      <TimePickerModal
        visible={pickerOpen}
        hour={settings.reminderHour}
        minute={settings.reminderMinute}
        onClose={() => setPickerOpen(false)}
        onSave={(h, m) => {
          update("reminderHour", h);
          update("reminderMinute", m);
          setPickerOpen(false);
        }}
      />
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
  scroll: { paddingHorizontal: 22, paddingTop: 8, paddingBottom: 24 },

  profileCard: {
    marginTop: 6,
    padding: 18,
    borderRadius: 24,
    backgroundColor: Colors.black,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 2,
    borderColor: Colors.black,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 6,
  },
  avatarWrap: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarHalo: {
    position: "absolute",
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.yellow,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.warmWhite,
    borderWidth: 3,
    borderColor: Colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarTxt: {
    fontSize: 22,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: -0.5,
  },
  profileInfo: { flex: 1 },
  profileHello: {
    color: "#C9C4AE",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.6,
  },
  profileName: {
    color: Colors.warmWhite,
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.5,
    marginTop: 2,
  },
  levelChip: {
    marginTop: 8,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.yellow,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  levelChipTxt: {
    fontSize: 10,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: 1.2,
  },

  section: {
    marginTop: 26,
    marginBottom: 12,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.8,
    color: Colors.muted,
  },
  card: {
    backgroundColor: Colors.warmWhite,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Colors.black,
    paddingHorizontal: 14,
  },
  row: {
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 64,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
  },
  rowIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  rowText: { flex: 1 },
  rowTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: -0.2,
  },
  rowSub: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "600",
    color: Colors.muted,
    lineHeight: 16,
  },
  switch: {
    transform: Platform.select({
      ios: [{ scaleX: 1.05 }, { scaleY: 1.05 }],
      android: [{ scaleX: 1.15 }, { scaleY: 1.15 }],
      default: [{ scaleX: 1 }, { scaleY: 1 }],
    }),
  },
  timeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.yellow,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: Colors.black,
  },
  timeChipTxt: {
    fontSize: 13,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: -0.2,
  },
  versionPill: {
    backgroundColor: Colors.cream,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: Colors.black,
  },
  versionTxt: {
    fontSize: 12,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: 0.4,
  },
  footer: {
    marginTop: 24,
    alignItems: "center",
  },
  footerTxt: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.muted,
    letterSpacing: 0.5,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(26,26,26,0.55)",
    alignItems: "center",
    justifyContent: "center",
    padding: 22,
  },
  modalCard: {
    width: "100%",
    maxWidth: 440,
    backgroundColor: Colors.warmWhite,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.black,
    padding: 20,
  },
  modalKicker: {
    fontSize: 11,
    fontWeight: "900",
    color: Colors.muted,
    letterSpacing: 1.6,
  },
  modalTitle: {
    marginTop: 4,
    fontSize: 22,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: -0.5,
  },
  modalGroupLbl: {
    marginTop: 18,
    marginBottom: 8,
    fontSize: 11,
    fontWeight: "900",
    color: Colors.muted,
    letterSpacing: 1.6,
  },
  modalGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  modalChip: {
    minWidth: 50,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.black,
    backgroundColor: Colors.warmWhite,
    alignItems: "center",
    justifyContent: "center",
  },
  modalChipWide: {
    minWidth: 70,
  },
  modalChipSel: {
    backgroundColor: Colors.yellow,
  },
  modalChipTxt: {
    fontSize: 14,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: -0.2,
  },
  modalChipTxtSel: {
    color: Colors.black,
  },
  modalActions: {
    marginTop: 22,
    flexDirection: "row",
    gap: 10,
  },
  modalBtn: {
    flex: 1,
    minHeight: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.black,
  },
  modalBtnGhost: {
    backgroundColor: Colors.warmWhite,
  },
  modalBtnGhostTxt: {
    fontSize: 15,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: -0.2,
  },
  modalBtnPrimary: {
    backgroundColor: Colors.yellow,
  },
  modalBtnPrimaryTxt: {
    fontSize: 15,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: -0.2,
  },
});

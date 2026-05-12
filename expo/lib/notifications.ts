import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

export const REMINDER_MESSAGES: { title: string; body: string }[] = [
  { title: "Examiner Anne is waiting…", body: "Are you ready? 🚗" },
  { title: "Hmph. Where have you been?", body: "Anne's tapping her clipboard. Two minutes? 📋" },
  { title: "Anne raised an eyebrow.", body: "She thinks you've forgotten. Prove her wrong. 👀" },
  { title: "Anne checked her watch.", body: "Pop in for a quick question round. ⏱️" },
  { title: "Mock test, Anne style.", body: "One question. Just one. Go on. 🚦" },
  { title: "Anne says: practise makes pass.", body: "5 questions, that's all. ✍️" },

  { title: "Your streak is at risk!", body: "Practise now to keep the flame alive ⚡" },
  { title: "Don't break the chain 🔥", body: "One quick session locks in another day." },
  { title: "Streak alert!", body: "Your fire is about to flicker. Save it ⚡" },
  { title: "So close to a milestone 🔥", body: "Tap in for 2 minutes and keep going." },
  { title: "Streak guardian on duty 🛡️", body: "Protect tonight's flame with a quick drill." },
  { title: "Today counts.", body: "Don't let your streak reset to zero ⚡" },

  { title: "Sophie says hi! 👋", body: "10 minutes today keeps the resit away 🎯" },
  { title: "Sophie's tip of the day 💡", body: "Tiny daily wins beat last-minute panic." },
  { title: "Sophie believes in you ❤️", body: "5 questions now = 5 fewer nerves on test day." },
  { title: "Sophie's daily nudge 🚗", body: "Every tap moves you closer to that pink licence." },
  { title: "Sophie waving 🌟", body: "Quick session? Future-you will high-five present-you." },
  { title: "Pass-day is coming 🎯", body: "Sophie says: stack the small wins, smash the test." },
];

export const NOTIFICATION_CHANNEL_ID = "daily-reminders";
const SCHEDULE_DAYS = 30;

let handlerSet = false;

export function ensureHandler(): void {
  if (handlerSet) return;
  handlerSet = true;
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  } catch (e) {
    console.log("[notifications] setNotificationHandler failed", e);
  }
}

export async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== "android") return;
  try {
    await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
      name: "Daily reminders",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FBEE23",
      sound: "default",
    });
  } catch (e) {
    console.log("[notifications] android channel failed", e);
  }
}

export async function requestPermissionsAsync(): Promise<boolean> {
  if (Platform.OS === "web") {
    console.log("[notifications] web not supported");
    return false;
  }
  if (!Device.isDevice) {
    console.log("[notifications] not a physical device, skipping");
    return false;
  }
  try {
    const existing = await Notifications.getPermissionsAsync();
    let status = existing.status;
    if (status !== "granted") {
      const req = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: false,
          allowSound: true,
        },
      });
      status = req.status;
    }
    return status === "granted";
  } catch (e) {
    console.log("[notifications] permission request failed", e);
    return false;
  }
}

export async function cancelAllReminders(): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    const all = await Notifications.getAllScheduledNotificationsAsync();
    await Promise.all(
      all
        .filter((n) => n.content?.data && (n.content.data as { kind?: string }).kind === "daily-reminder")
        .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier)),
    );
    console.log("[notifications] cleared scheduled reminders");
  } catch (e) {
    console.log("[notifications] cancelAll failed", e);
  }
}

function pickMessage(index: number): { title: string; body: string } {
  const len = REMINDER_MESSAGES.length;
  const safe = ((index % len) + len) % len;
  return REMINDER_MESSAGES[safe];
}

export async function scheduleDailyReminder(params: {
  enabled: boolean;
  hour: number;
  minute: number;
}): Promise<{ scheduled: number; granted: boolean }> {
  console.log("[notifications] scheduleDailyReminder", params);

  if (Platform.OS === "web") {
    return { scheduled: 0, granted: false };
  }

  await cancelAllReminders();

  if (!params.enabled) {
    return { scheduled: 0, granted: true };
  }

  const granted = await requestPermissionsAsync();
  if (!granted) {
    console.log("[notifications] permission not granted, skipping schedule");
    return { scheduled: 0, granted: false };
  }

  ensureHandler();
  await ensureAndroidChannel();

  const now = new Date();
  const dayMs = 24 * 60 * 60 * 1000;
  let scheduled = 0;

  const baseSeed = Math.floor(now.getTime() / dayMs);

  for (let i = 0; i < SCHEDULE_DAYS; i++) {
    const fire = new Date(now);
    fire.setHours(params.hour, params.minute, 0, 0);
    fire.setTime(fire.getTime() + i * dayMs);
    if (fire.getTime() <= now.getTime() + 30_000) {
      continue;
    }

    const msg = pickMessage(baseSeed + i);

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: msg.title,
          body: msg.body,
          sound: "default",
          data: { kind: "daily-reminder", index: baseSeed + i },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: fire,
          channelId: Platform.OS === "android" ? NOTIFICATION_CHANNEL_ID : undefined,
        },
      });
      scheduled += 1;
    } catch (e) {
      console.log("[notifications] schedule failed for", fire.toISOString(), e);
    }
  }

  console.log(`[notifications] scheduled ${scheduled} reminders`);
  return { scheduled, granted: true };
}

import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ensureAndroidChannel,
  ensureHandler,
  scheduleDailyReminder,
} from "@/lib/notifications";

export type AppSettings = {
  dyslexiaFont: boolean;
  largeText: boolean;
  highContrast: boolean;
  readAloud: boolean;
  soundEffects: boolean;
  dailyReminder: boolean;
  reminderHour: number;
  reminderMinute: number;
};

const STORAGE_KEY = "todi.settings.v1";

const DEFAULTS: AppSettings = {
  dyslexiaFont: false,
  largeText: false,
  highContrast: false,
  readAloud: false,
  soundEffects: true,
  dailyReminder: true,
  reminderHour: 18,
  reminderMinute: 30,
};

export const [SettingsProvider, useSettings] = createContextHook(() => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULTS);

  const loadQuery = useQuery({
    queryKey: ["settings"],
    queryFn: async (): Promise<AppSettings> => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) return DEFAULTS;
        const parsed = JSON.parse(raw) as Partial<AppSettings>;
        return { ...DEFAULTS, ...parsed };
      } catch (e) {
        console.log("[Settings] load failed", e);
        return DEFAULTS;
      }
    },
  });

  useEffect(() => {
    if (loadQuery.data) {
      setSettings(loadQuery.data);
    }
  }, [loadQuery.data]);

  const persistMutation = useMutation({
    mutationFn: async (next: AppSettings) => {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    },
  });

  const update = useCallback(
    <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
      console.log("[Settings] update", key, value);
      setSettings((prev) => {
        const next = { ...prev, [key]: value };
        persistMutation.mutate(next);
        return next;
      });
    },
    [persistMutation],
  );

  const lastScheduleKey = useRef<string>("");
  useEffect(() => {
    if (loadQuery.isLoading) return;
    ensureHandler();
    ensureAndroidChannel().catch((e) =>
      console.log("[Settings] android channel failed", e),
    );
    const key = `${settings.dailyReminder ? 1 : 0}-${settings.reminderHour}-${settings.reminderMinute}`;
    if (lastScheduleKey.current === key) return;
    lastScheduleKey.current = key;
    scheduleDailyReminder({
      enabled: settings.dailyReminder,
      hour: settings.reminderHour,
      minute: settings.reminderMinute,
    }).catch((e) => console.log("[Settings] schedule failed", e));
  }, [
    loadQuery.isLoading,
    settings.dailyReminder,
    settings.reminderHour,
    settings.reminderMinute,
  ]);

  return { settings, update, isLoading: loadQuery.isLoading };
});

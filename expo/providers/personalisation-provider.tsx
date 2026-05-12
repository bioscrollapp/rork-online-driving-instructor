import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

export type TestWindow = "2w" | "1m" | "2-3m" | "exploring";
export type LearningStyle = "reading" | "videos" | "practice" | "mix";
export type AccessibilityFlag = "dyslexia" | "adhd" | "neither" | "private";

export type Personalisation = {
  completed: boolean;
  testWindow: TestWindow | null;
  learningStyle: LearningStyle | null;
  accessibility: AccessibilityFlag | null;
  completedAt: number | null;
};

const STORAGE_KEY = "todi.personalisation.v1";

const DEFAULTS: Personalisation = {
  completed: false,
  testWindow: null,
  learningStyle: null,
  accessibility: null,
  completedAt: null,
};

export const [PersonalisationProvider, usePersonalisation] = createContextHook(
  () => {
    const [data, setData] = useState<Personalisation>(DEFAULTS);

    const loadQuery = useQuery({
      queryKey: ["personalisation"],
      queryFn: async (): Promise<Personalisation> => {
        try {
          const raw = await AsyncStorage.getItem(STORAGE_KEY);
          if (!raw) return DEFAULTS;
          const parsed = JSON.parse(raw) as Partial<Personalisation>;
          return { ...DEFAULTS, ...parsed };
        } catch (e) {
          console.log("[Personalisation] load failed", e);
          return DEFAULTS;
        }
      },
    });

    useEffect(() => {
      if (loadQuery.data) setData(loadQuery.data);
    }, [loadQuery.data]);

    const persistMutation = useMutation({
      mutationFn: async (next: Personalisation) => {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      },
    });

    const save = useCallback(
      (input: {
        testWindow: TestWindow;
        learningStyle: LearningStyle;
        accessibility: AccessibilityFlag;
      }) => {
        const next: Personalisation = {
          completed: true,
          completedAt: Date.now(),
          testWindow: input.testWindow,
          learningStyle: input.learningStyle,
          accessibility: input.accessibility,
        };
        console.log("[Personalisation] save", next);
        setData(next);
        persistMutation.mutate(next);
      },
      [persistMutation],
    );

    const reset = useCallback(() => {
      console.log("[Personalisation] reset");
      setData(DEFAULTS);
      persistMutation.mutate(DEFAULTS);
    }, [persistMutation]);

    const homeMessage = (() => {
      if (!data.completed) return "Ready when you are.";
      switch (data.testWindow) {
        case "2w":
          return "Two weeks to go — let's lock it in.";
        case "1m":
          return "A month out. Plenty of room to nail this.";
        case "2-3m":
          return "Loads of time. We'll build this up properly.";
        case "exploring":
          return "Just having a poke around? I love that.";
        default:
          return "Ready when you are.";
      }
    })();

    return {
      ...data,
      isLoading: loadQuery.isLoading,
      save,
      reset,
      homeMessage,
    };
  },
);

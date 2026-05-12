import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDb,
  setDoc,
} from "@/lib/firebase";
import { useAuth } from "@/providers/auth-provider";

export type MockCategoryBreakdown = {
  category: string;
  correct: number;
  total: number;
};

export type MockResult = {
  id: string;
  mode: "full" | "weak";
  score: number;
  total: number;
  passed: boolean;
  timeUsedSeconds: number;
  wrongIds: string[];
  breakdown: MockCategoryBreakdown[];
  createdAt: number;
};

const STORAGE_KEY = "todi.mock.results.v1";
const MAX_RESULTS = 50;

export const [MockResultsProvider, useMockResults] = createContextHook(() => {
  const [results, setResults] = useState<MockResult[]>([]);

  const loadQuery = useQuery({
    queryKey: ["mock-results"],
    queryFn: async (): Promise<MockResult[]> => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw) as MockResult[];
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        console.log("[MockResults] load failed", e);
        return [];
      }
    },
  });

  useEffect(() => {
    if (loadQuery.data) setResults(loadQuery.data);
  }, [loadQuery.data]);

  const persistMutation = useMutation({
    mutationFn: async (next: MockResult[]) => {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    },
  });

  const { user } = useAuth();
  const userId = user?.id ?? null;

  const syncToCloud = useCallback(
    async (result: MockResult) => {
      if (!userId) return;
      try {
        const db = getDb();
        const ref = doc(
          collection(db, "users", userId, "mockResults"),
          result.id,
        );
        await setDoc(ref, result);
        console.log("[MockResults] synced to firestore", result.id);
      } catch (e) {
        console.log("[MockResults] firestore sync failed", e);
      }
    },
    [userId],
  );

  const saveResult = useCallback(
    (result: Omit<MockResult, "id" | "createdAt">): MockResult => {
      const full: MockResult = {
        ...result,
        id: `mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        createdAt: Date.now(),
      };
      console.log("[MockResults] save", full.id, full.score, "/", full.total);
      setResults((prev) => {
        const next = [full, ...prev].slice(0, MAX_RESULTS);
        persistMutation.mutate(next);
        return next;
      });
      syncToCloud(full).catch(() => {});
      return full;
    },
    [persistMutation, syncToCloud],
  );

  const clearAll = useCallback(() => {
    console.log("[MockResults] clearAll");
    const prev = results;
    setResults([]);
    persistMutation.mutate([]);
    if (userId) {
      (async () => {
        try {
          const db = getDb();
          for (const r of prev) {
            await deleteDoc(
              doc(collection(db, "users", userId, "mockResults"), r.id),
            );
          }
        } catch (e) {
          console.log("[MockResults] firestore clear failed", e);
        }
      })();
    }
  }, [persistMutation, userId, results]);

  const lastResult = results[0] ?? null;
  const bestScore = results.reduce(
    (m, r) => (r.score > m ? r.score : m),
    0,
  );
  const passCount = results.filter((r) => r.passed).length;

  return {
    results,
    lastResult,
    bestScore,
    passCount,
    saveResult,
    clearAll,
    isLoading: loadQuery.isLoading,
  };
});

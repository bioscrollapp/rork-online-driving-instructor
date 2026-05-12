import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "todi.revision.wrongIds.v1";

const DEFAULT_WRONG: string[] = ["q1", "q3", "q4"];

export const [RevisionProvider, useRevision] = createContextHook(() => {
  const [wrongIds, setWrongIds] = useState<string[]>(DEFAULT_WRONG);

  const loadQuery = useQuery({
    queryKey: ["revision-wrong-ids"],
    queryFn: async (): Promise<string[]> => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) return DEFAULT_WRONG;
        const parsed = JSON.parse(raw) as string[];
        return Array.isArray(parsed) ? parsed : DEFAULT_WRONG;
      } catch (e) {
        console.log("[Revision] load failed", e);
        return DEFAULT_WRONG;
      }
    },
  });

  useEffect(() => {
    if (loadQuery.data) setWrongIds(loadQuery.data);
  }, [loadQuery.data]);

  const persistMutation = useMutation({
    mutationFn: async (next: string[]) => {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    },
  });

  const persist = useCallback(
    (next: string[]) => {
      persistMutation.mutate(next);
    },
    [persistMutation],
  );

  const markWrong = useCallback(
    (id: string) => {
      console.log("[Revision] markWrong", id);
      setWrongIds((prev) => {
        if (prev.includes(id)) return prev;
        const next = [...prev, id];
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const markManyWrong = useCallback(
    (ids: string[]) => {
      if (ids.length === 0) return;
      console.log("[Revision] markManyWrong", ids.length);
      setWrongIds((prev) => {
        const set = new Set(prev);
        ids.forEach((id) => set.add(id));
        const next = Array.from(set);
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const markMastered = useCallback(
    (id: string) => {
      console.log("[Revision] markMastered", id);
      setWrongIds((prev) => {
        const next = prev.filter((x) => x !== id);
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const clearAll = useCallback(() => {
    console.log("[Revision] clearAll");
    setWrongIds([]);
    persist([]);
  }, [persist]);

  return { wrongIds, markWrong, markManyWrong, markMastered, clearAll };
});

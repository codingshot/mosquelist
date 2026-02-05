import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { mosques } from "@/data/mosques";
import { getBucketList, setBucketList, type BucketListItem } from "@/lib/storage";

const DEFAULT_LIST: BucketListItem[] = mosques
  .slice(0, 5)
  .map((m) => ({ mosqueId: m.id, visited: false }));

const SAVE_DEBOUNCE_MS = 400;

export function useBucketList() {
  const [bucketList, setBucketListState] = useState<BucketListItem[]>(() => {
    const stored = getBucketList();
    const valid = stored.filter((item) =>
      mosques.some((m) => m.id === item.mosqueId)
    );
    if (valid.length > 0) return valid;
    return DEFAULT_LIST;
  });

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      setBucketList(bucketList);
      saveTimeoutRef.current = null;
    }, SAVE_DEBOUNCE_MS);
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [bucketList]);

  const toggleVisited = useCallback((mosqueId: string) => {
    setBucketListState((prev) =>
      prev.map((item) =>
        item.mosqueId === mosqueId
          ? { ...item, visited: !item.visited }
          : item
      )
    );
  }, []);

  const addToBucketList = useCallback((mosqueId: string) => {
    if (!mosques.some((m) => m.id === mosqueId)) return;
    setBucketListState((prev) => {
      if (prev.some((item) => item.mosqueId === mosqueId)) return prev;
      return [...prev, { mosqueId, visited: false }];
    });
  }, []);

  const removeFromBucketList = useCallback((mosqueId: string) => {
    setBucketListState((prev) => prev.filter((item) => item.mosqueId !== mosqueId));
  }, []);

  const visitedCount = bucketList.filter((item) => item.visited).length;
  const bucketListIds = useMemo(() => new Set(bucketList.map((i) => i.mosqueId)), [bucketList]);
  const mosquesNotInList = useMemo(
    () => mosques.filter((m) => !bucketListIds.has(m.id)),
    [bucketListIds]
  );

  return {
    bucketList,
    toggleVisited,
    addToBucketList,
    removeFromBucketList,
    visitedCount,
    mosquesNotInList,
  };
}

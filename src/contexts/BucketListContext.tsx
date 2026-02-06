import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { mosques } from "@/data/mosques";
import {
  getBucketList,
  setBucketList,
  getFavorites,
  type BucketListItem,
} from "@/lib/storage";

const BUCKET_KEY = "mosquelist_bucket";

const DEFAULT_LIST: BucketListItem[] = mosques
  .slice(0, 5)
  .map((m) => ({ mosqueId: m.id, visited: false }));

const SAVE_DEBOUNCE_MS = 400;

const VALID_MOSQUE_IDS = new Set(mosques.map((m) => m.id));

/** Merge stored bucket list with any legacy favorites so "favorite" = "in bucket list". */
function getInitialBucketList(): BucketListItem[] {
  const stored = getBucketList();
  const valid = stored.filter((item) => VALID_MOSQUE_IDS.has(item.mosqueId));
  const bucketIds = new Set(valid.map((i) => i.mosqueId));
  const legacyFavorites = getFavorites().filter((id) => VALID_MOSQUE_IDS.has(id));
  const merged = [...valid];
  for (const id of legacyFavorites) {
    if (!bucketIds.has(id)) {
      merged.push({ mosqueId: id, visited: false });
      bucketIds.add(id);
    }
  }
  if (merged.length > 0) return merged;
  return DEFAULT_LIST;
}

type BucketListContextValue = {
  bucketList: BucketListItem[];
  toggleVisited: (mosqueId: string) => void;
  addToBucketList: (mosqueId: string) => void;
  removeFromBucketList: (mosqueId: string) => void;
  reorderBucketList: (fromIndex: number, toIndex: number) => void;
  visitedCount: number;
  mosquesNotInList: typeof mosques;
};

const BucketListContext = createContext<BucketListContextValue | null>(null);

export function BucketListProvider({ children }: { children: React.ReactNode }) {
  const [bucketList, setBucketListState] = useState<BucketListItem[]>(getInitialBucketList);

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

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === BUCKET_KEY && e.newValue != null) {
        try {
          const parsed = JSON.parse(e.newValue) as unknown;
          if (!Array.isArray(parsed)) return;
          const valid = parsed.filter(
            (item: unknown): item is BucketListItem =>
              typeof item === "object" &&
              item != null &&
              typeof (item as BucketListItem).mosqueId === "string" &&
              typeof (item as BucketListItem).visited === "boolean" &&
              mosques.some((m) => m.id === (item as BucketListItem).mosqueId)
          );
          setBucketListState(valid.length > 0 ? valid : DEFAULT_LIST);
        } catch {
          // ignore parse errors
        }
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

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
    setBucketListState((prev) =>
      prev.filter((item) => item.mosqueId !== mosqueId)
    );
  }, []);

  const reorderBucketList = useCallback((fromIndex: number, toIndex: number) => {
    setBucketListState((prev) => {
      const next = [...prev];
      const [removed] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, removed);
      return next;
    });
  }, []);

  const visitedCount = bucketList.filter((item) => item.visited).length;
  const bucketListIds = useMemo(
    () => new Set(bucketList.map((i) => i.mosqueId)),
    [bucketList]
  );
  const mosquesNotInList = useMemo(
    () => mosques.filter((m) => !bucketListIds.has(m.id)),
    [bucketListIds]
  );

  const value = useMemo<BucketListContextValue>(
    () => ({
      bucketList,
      toggleVisited,
      addToBucketList,
      removeFromBucketList,
      reorderBucketList,
      visitedCount,
      mosquesNotInList,
    }),
    [
      bucketList,
      toggleVisited,
      addToBucketList,
      removeFromBucketList,
      reorderBucketList,
      visitedCount,
      mosquesNotInList,
    ]
  );

  return (
    <BucketListContext.Provider value={value}>
      {children}
    </BucketListContext.Provider>
  );
}

export function useBucketList(): BucketListContextValue {
  const ctx = useContext(BucketListContext);
  if (!ctx)
    throw new Error("useBucketList must be used within BucketListProvider");
  return ctx;
}

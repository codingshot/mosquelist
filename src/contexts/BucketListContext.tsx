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
  type BucketListItem,
} from "@/lib/storage";

const DEFAULT_LIST: BucketListItem[] = mosques
  .slice(0, 5)
  .map((m) => ({ mosqueId: m.id, visited: false }));

const SAVE_DEBOUNCE_MS = 400;

type BucketListContextValue = {
  bucketList: BucketListItem[];
  toggleVisited: (mosqueId: string) => void;
  addToBucketList: (mosqueId: string) => void;
  removeFromBucketList: (mosqueId: string) => void;
  visitedCount: number;
  mosquesNotInList: typeof mosques;
};

const BucketListContext = createContext<BucketListContextValue | null>(null);

export function BucketListProvider({ children }: { children: React.ReactNode }) {
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
    setBucketListState((prev) =>
      prev.filter((item) => item.mosqueId !== mosqueId)
    );
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
      visitedCount,
      mosquesNotInList,
    }),
    [
      bucketList,
      toggleVisited,
      addToBucketList,
      removeFromBucketList,
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

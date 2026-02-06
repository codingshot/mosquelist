import { createContext, useCallback, useContext, useMemo } from "react";
import { useBucketList } from "@/contexts/BucketListContext";

type FavoritesContextValue = {
  favoriteIds: Set<string>;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  favoriteCount: number;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

/** Favorites are the same as bucket list: a mosque is "favorited" iff it is in the bucket list. */
export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { bucketList, addToBucketList, removeFromBucketList } = useBucketList();

  const favoriteIds = useMemo(
    () => new Set(bucketList.map((i) => i.mosqueId)),
    [bucketList]
  );

  const isFavorite = useCallback(
    (id: string) => favoriteIds.has(id),
    [favoriteIds]
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      if (favoriteIds.has(id)) removeFromBucketList(id);
      else addToBucketList(id);
    },
    [favoriteIds, addToBucketList, removeFromBucketList]
  );

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favoriteIds,
      isFavorite,
      toggleFavorite,
      favoriteCount: favoriteIds.size,
    }),
    [favoriteIds, isFavorite, toggleFavorite]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}

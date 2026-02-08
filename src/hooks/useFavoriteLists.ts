import { useState, useCallback, useMemo, useEffect } from "react";
import { getFavoriteLists, setFavoriteLists } from "@/lib/storage";

export function useFavoriteLists() {
  const [favoriteLists, setFavoriteListsState] = useState<string[]>(() => getFavoriteLists());

  // Sync to localStorage on change
  useEffect(() => {
    setFavoriteLists(favoriteLists);
  }, [favoriteLists]);

  const isFavoriteList = useCallback(
    (slug: string) => favoriteLists.includes(slug),
    [favoriteLists]
  );

  const toggleFavoriteList = useCallback((slug: string) => {
    setFavoriteListsState((prev) => {
      if (prev.includes(slug)) {
        return prev.filter((s) => s !== slug);
      }
      return [...prev, slug];
    });
  }, []);

  const addFavoriteList = useCallback((slug: string) => {
    setFavoriteListsState((prev) => {
      if (prev.includes(slug)) return prev;
      return [...prev, slug];
    });
  }, []);

  const removeFavoriteList = useCallback((slug: string) => {
    setFavoriteListsState((prev) => prev.filter((s) => s !== slug));
  }, []);

  const favoriteListsSet = useMemo(() => new Set(favoriteLists), [favoriteLists]);

  return {
    favoriteLists,
    favoriteListsSet,
    isFavoriteList,
    toggleFavoriteList,
    addFavoriteList,
    removeFavoriteList,
    favoriteListCount: favoriteLists.length,
  };
}

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { mosques } from "@/data/mosques";
import { getFavorites, setFavorites } from "@/lib/storage";

const VALID_MOSQUE_IDS = new Set(mosques.map((m) => m.id));

function getValidFavorites(): string[] {
  return getFavorites().filter((id) => VALID_MOSQUE_IDS.has(id));
}

type FavoritesContextValue = {
  favoriteIds: Set<string>;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  favoriteCount: number;
};

const FAVORITES_KEY = "mosquelist_favorites";
const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => new Set(getValidFavorites()));

  useEffect(() => {
    setFavorites(Array.from(favoriteIds));
  }, [favoriteIds]);

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === FAVORITES_KEY && e.newValue != null) {
        try {
          const parsed = JSON.parse(e.newValue) as unknown;
          const ids = Array.isArray(parsed)
            ? (parsed as string[]).filter((id) => VALID_MOSQUE_IDS.has(id))
            : [];
          setFavoriteIds(new Set(ids));
        } catch {
          // ignore parse errors
        }
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const isFavorite = useCallback(
    (id: string) => favoriteIds.has(id),
    [favoriteIds]
  );

  const toggleFavorite = useCallback((id: string) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

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

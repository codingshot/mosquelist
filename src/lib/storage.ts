const FAVORITES_KEY = "mosquelist_favorites";
const BUCKET_KEY = "mosquelist_bucket";
const FAVORITE_LISTS_KEY = "mosquelist_favorite_lists";

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(key) : null;
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown): void {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch {
    // quota exceeded or private mode
  }
}

export function getFavorites(): string[] {
  const data = safeGet<string[]>(FAVORITES_KEY, []);
  return Array.isArray(data) ? data : [];
}

export function setFavorites(ids: string[]): void {
  safeSet(FAVORITES_KEY, ids);
}

export interface BucketListItem {
  mosqueId: string;
  visited: boolean;
}

export function getBucketList(): BucketListItem[] {
  const data = safeGet<BucketListItem[]>(BUCKET_KEY, []);
  if (!Array.isArray(data)) return [];
  return data.filter(
    (item): item is BucketListItem =>
      typeof item?.mosqueId === "string" && typeof item?.visited === "boolean"
  );
}

export function setBucketList(items: BucketListItem[]): void {
  safeSet(BUCKET_KEY, items);
}

/** Favorite lists (curated list slugs) */
export function getFavoriteLists(): string[] {
  const data = safeGet<string[]>(FAVORITE_LISTS_KEY, []);
  return Array.isArray(data) ? data : [];
}

export function setFavoriteLists(slugs: string[]): void {
  safeSet(FAVORITE_LISTS_KEY, slugs);
}

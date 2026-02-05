import type { Mosque } from "@/types/mosque";

/**
 * Build a single searchable string from mosque fields (normalized to lowercase).
 * Used for matching so we only lowercase once per mosque.
 */
function getSearchText(m: Mosque): string {
  const parts = [
    m.name,
    m.arabicName ?? "",
    m.location,
    m.country,
    m.significance,
    m.description,
    m.architecturalStyle ?? "",
    ...(m.facilities ?? []),
  ];
  return parts.join(" ").toLowerCase();
}

/** Normalize query: trim, collapse spaces, toLowerCase */
function normalizeQuery(q: string): string {
  return q.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Multi-term search: each non-empty term must appear in the search text.
 * Enables "blue istanbul" -> Blue Mosque, Istanbul.
 */
export function mosqueMatchesQuery(mosque: Mosque, query: string): boolean {
  const q = normalizeQuery(query);
  if (!q) return true;
  const terms = q.split(" ").filter(Boolean);
  if (terms.length === 0) return true;
  const haystack = getSearchText(mosque);
  return terms.every((term) => haystack.includes(term));
}

/**
 * Precompute search texts for all mosques (one pass) so filtering only does string checks.
 */
export function filterMosquesByQuery(mosques: Mosque[], query: string): Mosque[] {
  const q = normalizeQuery(query);
  if (!q) return mosques;
  return mosques.filter((m) => mosqueMatchesQuery(m, query));
}

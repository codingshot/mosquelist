import type { Mosque, TimelineEvent, MosquesData } from "@/types/mosque";
import { parseEstablishmentYear, validateMosqueDate } from "@/lib/timeline-utils";

import data from "./mosques.json";

const { mosques: mosquesList, timelineEvents: timelineRaw } = data as MosquesData;

export type { Mosque, TimelineEvent };
export const mosques: Mosque[] = mosquesList;

// Re-export for backwards compatibility
export { parseEstablishmentYear };

/** 
 * Timeline expanded from JSON events plus any current mosque with an established date not already in the list.
 * Properly handles century notation (e.g., "15th century" -> ~1450).
 */
const timelineEvents: TimelineEvent[] = (() => {
  const byId = new Map<string, TimelineEvent>(timelineRaw.map((e) => [e.mosqueId, e]));
  for (const m of mosquesList) {
    if (byId.has(m.id)) continue;
    const year = parseEstablishmentYear(m.established);
    if (year <= 0) continue;
    
    // Validate historical accuracy (log warnings in dev)
    if (process.env.NODE_ENV === "development") {
      const validation = validateMosqueDate(m.established, m.id);
      if (!validation.valid || validation.warning) {
        console.warn(`[Timeline] ${m.name}: ${validation.warning}`);
      }
    }
    
    byId.set(m.id, {
      year: m.established, // Keep original string for display
      mosque: m.name,
      mosqueId: m.id,
      event: `Completed in ${m.location}`,
    });
  }
  return [...byId.values()].sort(
    (a, b) => parseEstablishmentYear(a.year) - parseEstablishmentYear(b.year)
  );
})();

export { timelineEvents };

export function getMosqueById(id: string): Mosque | undefined {
  return mosques.find((m) => m.id === id);
}

export function getMosqueBySlug(slug: string): Mosque | undefined {
  return mosques.find((m) => m.id === slug);
}

export function getUniqueCountries(): string[] {
  return [...new Set(mosques.map((m) => m.country))].sort();
}

/** Number of holy sites in the list (Mecca, Medina, Al-Aqsa, etc.). */
export function getHolySiteCount(): number {
  return mosques.filter((m) => m.isHolySite).length;
}

/** Unique architectural styles for filter (sorted). */
export function getUniqueArchitecturalStyles(): string[] {
  const set = new Set<string>();
  mosques.forEach((m) => {
    if (m.architecturalStyle) set.add(m.architecturalStyle);
  });
  return [...set].sort();
}

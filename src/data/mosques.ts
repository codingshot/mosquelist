import type { Mosque, TimelineEvent, MosquesData } from "@/types/mosque";
import { parseEstablishmentYear, validateMosqueDate } from "@/lib/timeline-utils";

import data from "./mosques.json";

const { mosques: mosquesList, timelineEvents: timelineRaw } = data as MosquesData;

// Deduplicate mosques by id (keep the last occurrence which typically has more complete data)
const mosquesById = new Map<string, Mosque>();
for (const mosque of mosquesList) {
  mosquesById.set(mosque.id, mosque);
}

export type { Mosque, TimelineEvent };
export const mosques: Mosque[] = [...mosquesById.values()];

// Re-export for backwards compatibility
export { parseEstablishmentYear };

/**
 * Mosque timeline events from JSON (keeps multiple entries per mosque when present).
 * Context events (isContextEvent / empty mosqueId) are exported separately.
 */
const { timelineEvents, timelineContextEvents } = (() => {
  const mosqueEvents: TimelineEvent[] = [];
  const contextEvents: TimelineEvent[] = [];
  const mosqueIdsWithExplicitEvent = new Set<string>();

  for (const e of timelineRaw) {
    if (e.isContextEvent || !e.mosqueId?.trim()) {
      if (e.isContextEvent) contextEvents.push(e);
      continue;
    }
    mosqueEvents.push(e);
    mosqueIdsWithExplicitEvent.add(e.mosqueId);
  }

  for (const m of mosquesList) {
    if (mosqueIdsWithExplicitEvent.has(m.id)) continue;
    const year = parseEstablishmentYear(m.established);
    if (year <= 0) continue;

    if (process.env.NODE_ENV === "development") {
      const validation = validateMosqueDate(m.established, m.id);
      if (!validation.valid || validation.warning) {
        console.warn(`[Timeline] ${m.name}: ${validation.warning}`);
      }
    }

    mosqueEvents.push({
      year: m.established,
      mosque: m.name,
      mosqueId: m.id,
      event: `Completed in ${m.location}`,
    });
  }

  mosqueEvents.sort(
    (a, b) => parseEstablishmentYear(a.year) - parseEstablishmentYear(b.year),
  );

  return { timelineEvents: mosqueEvents, timelineContextEvents: contextEvents };
})();

export { timelineEvents, timelineContextEvents };

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

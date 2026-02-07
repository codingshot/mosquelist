import type { Mosque, TimelineEvent, MosquesData } from "@/types/mosque";

import data from "./mosques.json";

const { mosques: mosquesList, timelineEvents: timelineRaw } = data as MosquesData;

export type { Mosque, TimelineEvent };
export const mosques: Mosque[] = mosquesList;

/** Parse numeric year from established string (e.g. "638 CE" -> 638, "2007" -> 2007, "705–715 CE" -> 705). */
function parseEstablishmentYear(established: string): number {
  const match = String(established).match(/\d{1,4}/);
  return match ? parseInt(match[0], 10) : 0;
}

/** Timeline expanded from JSON events plus any current mosque with an established date not already in the list. */
const timelineEvents: TimelineEvent[] = (() => {
  const byId = new Map<string, TimelineEvent>(timelineRaw.map((e) => [e.mosqueId, e]));
  for (const m of mosquesList) {
    if (byId.has(m.id)) continue;
    const year = parseEstablishmentYear(m.established);
    if (year <= 0) continue;
    byId.set(m.id, {
      year: String(year),
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

/** Unique architectural styles for filter (sorted). */
export function getUniqueArchitecturalStyles(): string[] {
  const set = new Set<string>();
  mosques.forEach((m) => {
    if (m.architecturalStyle) set.add(m.architecturalStyle);
  });
  return [...set].sort();
}

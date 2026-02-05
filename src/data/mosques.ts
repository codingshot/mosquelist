import type { Mosque, TimelineEvent, MosquesData } from "@/types/mosque";

import data from "./mosques.json";

const { mosques: mosquesList, timelineEvents: timeline } = data as MosquesData;

export type { Mosque, TimelineEvent };
export const mosques: Mosque[] = mosquesList;
export const timelineEvents: TimelineEvent[] = timeline;

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

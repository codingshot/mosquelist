import type { Mosque } from "@/types/mosque";
import { mosques } from "@/data/mosques";
import { getRegionForCountry } from "@/data/regions";

/** Capacity band for similarity (same order of magnitude). */
function capacityBand(capacity: number): number {
  if (capacity <= 0) return 0;
  return Math.floor(Math.log10(capacity));
}

/**
 * Score how related another mosque is to the given mosque (higher = more related).
 * Uses only local data: country, region, architectural style, capacity band, holy/tourist.
 */
function relatednessScore(mosque: Mosque, other: Mosque): number {
  if (mosque.id === other.id) return -1;
  let score = 0;
  if (mosque.country === other.country) score += 3;
  const regionA = getRegionForCountry(mosque.country);
  const regionB = getRegionForCountry(other.country);
  if (regionA && regionA === regionB) score += 2;
  if (
    mosque.architecturalStyle &&
    other.architecturalStyle &&
    mosque.architecturalStyle === other.architecturalStyle
  ) {
    score += 2;
  }
  if (capacityBand(mosque.capacity) === capacityBand(other.capacity)) score += 1;
  if (mosque.isHolySite === other.isHolySite) score += 0.5;
  if (mosque.touristFriendly === other.touristFriendly) score += 0.25;
  return score;
}

/**
 * Return mosques most related to the given mosque, excluding itself.
 * Uses a local matching algorithm (country, region, style, capacity band).
 */
export function getRelatedMosques(mosque: Mosque, limit = 6): Mosque[] {
  const scored = mosques
    .filter((m) => m.id !== mosque.id)
    .map((m) => ({ mosque: m, score: relatednessScore(mosque, m) }))
    .filter((x) => x.score >= 0);
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((x) => x.mosque);
}

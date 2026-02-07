import type { Mosque } from "@/types/mosque";
import { getRegionForCountry } from "@/data/regions";
import { filterMosquesByQuery } from "./search";

/** Parse year from established string (e.g. "622 CE" -> 622, "2007" -> 2007). Returns 0 for empty/invalid. */
export function establishedYear(established: string | undefined | null): number {
  if (established == null || typeof established !== "string") return 0;
  const match = established.trim().match(/\d{1,4}/);
  return match ? parseInt(match[0], 10) : 0;
}

export type MosqueFilterParams = {
  query: string;
  filter: "all" | "holy" | "tourist" | "biggest";
  country: string;
  region: string;
  denomination: string;
  womenOnly: boolean;
  touristOnly: boolean;
  architecturalStyle: string;
  capMin: string;
  capMax: string;
  areaMin: string;
  areaMax: string;
  estMin: string;
  estMax: string;
};

/**
 * Apply the same filters as Explore (MosqueGrid). Returns filtered list unsorted.
 * Use for map or for explore (explore then sorts).
 */
export function applyMosqueFilters(mosques: Mosque[], params: MosqueFilterParams): Mosque[] {
  let list = mosques;

  if (params.filter === "holy") list = list.filter((m) => m.isHolySite);
  if (params.filter === "tourist") list = list.filter((m) => m.touristFriendly);
  if (params.filter === "biggest") list = list.filter((m) => m.capacity >= 100_000);
  if (params.country) list = list.filter((m) => m.country === params.country);
  if (params.region) list = list.filter((m) => getRegionForCountry(m.country) === params.region);
  if (params.denomination) list = list.filter((m) => m.denomination === params.denomination);
  if (params.womenOnly) list = list.filter((m) => m.womenPrayerArea);
  if (params.touristOnly) list = list.filter((m) => m.touristFriendly);
  if (params.architecturalStyle)
    list = list.filter((m) => m.architecturalStyle === params.architecturalStyle);

  const minCap = params.capMin ? parseInt(params.capMin, 10) : NaN;
  const maxCap = params.capMax ? parseInt(params.capMax, 10) : NaN;
  if (!Number.isNaN(minCap)) list = list.filter((m) => m.capacity >= minCap);
  if (!Number.isNaN(maxCap)) list = list.filter((m) => m.capacity <= maxCap);

  const minArea = params.areaMin ? parseInt(params.areaMin, 10) : NaN;
  const maxArea = params.areaMax ? parseInt(params.areaMax, 10) : NaN;
  if (!Number.isNaN(minArea)) list = list.filter((m) => m.area >= minArea);
  if (!Number.isNaN(maxArea)) list = list.filter((m) => m.area <= maxArea);

  const minEst = params.estMin ? parseInt(params.estMin, 10) : NaN;
  const maxEst = params.estMax ? parseInt(params.estMax, 10) : NaN;
  if (!Number.isNaN(minEst)) list = list.filter((m) => establishedYear(m.established) >= minEst);
  if (!Number.isNaN(maxEst)) list = list.filter((m) => establishedYear(m.established) <= maxEst);

  list = filterMosquesByQuery(list, params.query);

  return list;
}

/**
 * Build explore page URL with filter/search params for sharing.
 * Params match MosqueGrid useMosqueSearchParams (q, filter, country, women, tourist, style).
 */
export type ExploreParams = {
  q?: string;
  filter?: "all" | "holy" | "tourist" | "biggest";
  country?: string;
  style?: string;
  women?: boolean;
  tourist?: boolean;
};

export function getExploreUrl(params: ExploreParams): string {
  const search = new URLSearchParams();
  if (params.q?.trim()) search.set("q", params.q.trim());
  if (params.filter && params.filter !== "all") search.set("filter", params.filter);
  if (params.country?.trim()) search.set("country", params.country.trim());
  if (params.style?.trim()) search.set("style", params.style.trim());
  if (params.women) search.set("women", "1");
  if (params.tourist) search.set("tourist", "1");
  const qs = search.toString();
  return qs ? `/explore?${qs}` : "/explore";
}

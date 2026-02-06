/**
 * Build explore page URL with filter/search params for sharing.
 * Params match MosqueGrid useMosqueSearchParams (q, filter, country, region, women, tourist, style).
 */
export type ExploreParams = {
  q?: string;
  filter?: "all" | "holy" | "tourist" | "biggest";
  country?: string;
  region?: string;
  style?: string;
  denomination?: "sunni" | "shia";
  women?: boolean;
  tourist?: boolean;
};

export function getExploreUrl(params: ExploreParams): string {
  const search = new URLSearchParams();
  if (params.q?.trim()) search.set("q", params.q.trim());
  if (params.filter && params.filter !== "all") search.set("filter", params.filter);
  if (params.country?.trim()) search.set("country", params.country.trim());
  if (params.region?.trim()) search.set("region", params.region.trim());
  if (params.style?.trim()) search.set("style", params.style.trim());
  if (params.denomination) search.set("denomination", params.denomination);
  if (params.women) search.set("women", "1");
  if (params.tourist) search.set("tourist", "1");
  const qs = search.toString();
  return qs ? `/explore?${qs}` : "/explore";
}

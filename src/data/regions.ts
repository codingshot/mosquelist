/**
 * Geographic regions for filtering mosques.
 * Countries are grouped into regions for easier browsing.
 */
export const COUNTRY_TO_REGION: Record<string, string> = {
  "Saudi Arabia": "Middle East",
  Palestine: "Middle East",
  Iran: "Middle East",
  UAE: "Middle East",
  Kuwait: "Middle East",
  Oman: "Middle East",
  Yemen: "Middle East",
  Iraq: "Middle East",
  Syria: "Middle East",
  Jordan: "Middle East",
  Qatar: "Middle East",
  Bahrain: "Middle East",
  Lebanon: "Middle East",
  Turkey: "Middle East",
  Morocco: "North Africa",
  Egypt: "North Africa",
  Algeria: "North Africa",
  Tunisia: "North Africa",
  Sudan: "North Africa",
  Mali: "West Africa",
  Senegal: "West Africa",
  Nigeria: "West Africa",
  Guinea: "West Africa",
  Pakistan: "South Asia",
  India: "South Asia",
  Bangladesh: "South Asia",
  Afghanistan: "South Asia",
  Indonesia: "Southeast Asia",
  Malaysia: "Southeast Asia",
  Brunei: "Southeast Asia",
  Philippines: "Southeast Asia",
  Kazakhstan: "Central Asia",
  Azerbaijan: "Central Asia",
  "United Kingdom": "Europe",
  "Bosnia and Herzegovina": "Europe",
  Russia: "Europe",
  China: "East Asia",
  USA: "Americas",
};

export const REGIONS = [
  "Middle East",
  "North Africa",
  "West Africa",
  "South Asia",
  "Southeast Asia",
  "Central Asia",
  "Europe",
  "East Asia",
  "Americas",
] as const;

export type Region = (typeof REGIONS)[number];

/** Get the region for a country, or undefined if unknown. */
export function getRegionForCountry(country: string): string | undefined {
  return COUNTRY_TO_REGION[country];
}

/** Get unique regions that have mosques in the dataset. */
export function getUniqueRegions(countries: string[]): Region[] {
  const regionSet = new Set<Region>();
  for (const c of countries) {
    const r = COUNTRY_TO_REGION[c];
    if (r && REGIONS.includes(r as Region)) regionSet.add(r as Region);
  }
  return REGIONS.filter((r) => regionSet.has(r));
}

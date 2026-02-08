/**
 * Geographic regions for filtering mosques.
 * Countries are grouped into regions for easier browsing.
 */
export const COUNTRY_TO_REGION: Record<string, string> = {
  // Middle East
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
  
  // North Africa
  Morocco: "North Africa",
  Egypt: "North Africa",
  Algeria: "North Africa",
  Tunisia: "North Africa",
  Sudan: "North Africa",
  Libya: "North Africa",
  
  // East Africa
  Uganda: "East Africa",
  Kenya: "East Africa",
  Tanzania: "East Africa",
  Ethiopia: "East Africa",
  Eritrea: "East Africa",
  Djibouti: "East Africa",
  Somalia: "East Africa",
  Comoros: "East Africa",
  Mozambique: "East Africa",
  Rwanda: "East Africa",
  Burundi: "East Africa",
  
  // West Africa
  Mali: "West Africa",
  Senegal: "West Africa",
  Nigeria: "West Africa",
  Guinea: "West Africa",
  "Ivory Coast": "West Africa",
  Ghana: "West Africa",
  Cameroon: "West Africa",
  Niger: "West Africa",
  "Burkina Faso": "West Africa",
  Mauritania: "West Africa",
  Gambia: "West Africa",
  
  // Southern Africa
  "South Africa": "Southern Africa",
  Zimbabwe: "Southern Africa",
  Zambia: "Southern Africa",
  Malawi: "Southern Africa",
  
  // South Asia
  Pakistan: "South Asia",
  India: "South Asia",
  Bangladesh: "South Asia",
  Afghanistan: "South Asia",
  "Sri Lanka": "South Asia",
  Nepal: "South Asia",
  Maldives: "South Asia",
  
  // Southeast Asia
  Indonesia: "Southeast Asia",
  Malaysia: "Southeast Asia",
  Brunei: "Southeast Asia",
  Philippines: "Southeast Asia",
  Singapore: "Southeast Asia",
  Thailand: "Southeast Asia",
  Myanmar: "Southeast Asia",
  Cambodia: "Southeast Asia",
  Vietnam: "Southeast Asia",
  
  // Central Asia
  Kazakhstan: "Central Asia",
  Azerbaijan: "Central Asia",
  Uzbekistan: "Central Asia",
  Turkmenistan: "Central Asia",
  Tajikistan: "Central Asia",
  Kyrgyzstan: "Central Asia",
  
  // Europe
  "United Kingdom": "Europe",
  "Bosnia and Herzegovina": "Europe",
  Albania: "Europe",
  Kosovo: "Europe",
  Russia: "Europe",
  Germany: "Europe",
  France: "Europe",
  Netherlands: "Europe",
  Belgium: "Europe",
  Spain: "Europe",
  Italy: "Europe",
  Austria: "Europe",
  Switzerland: "Europe",
  Sweden: "Europe",
  Norway: "Europe",
  Denmark: "Europe",
  Poland: "Europe",
  Greece: "Europe",
  Bulgaria: "Europe",
  Romania: "Europe",
  Serbia: "Europe",
  Montenegro: "Europe",
  "North Macedonia": "Europe",
  Croatia: "Europe",
  Slovenia: "Europe",
  
  // East Asia
  China: "East Asia",
  Japan: "East Asia",
  "South Korea": "East Asia",
  Taiwan: "East Asia",
  Mongolia: "East Asia",
  
  // Americas
  USA: "Americas",
  Canada: "Americas",
  Brazil: "Americas",
  Argentina: "Americas",
  Mexico: "Americas",
  Colombia: "Americas",
  Chile: "Americas",
  Peru: "Americas",
  Venezuela: "Americas",
  Trinidad: "Americas",
  Suriname: "Americas",
  Guyana: "Americas",
  
  // Oceania
  Australia: "Oceania",
  "New Zealand": "Oceania",
  Fiji: "Oceania",
};

export const REGIONS = [
  "Middle East",
  "North Africa",
  "East Africa",
  "West Africa",
  "Southern Africa",
  "South Asia",
  "Southeast Asia",
  "Central Asia",
  "Europe",
  "East Asia",
  "Americas",
  "Oceania",
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

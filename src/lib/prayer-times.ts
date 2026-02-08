/**
 * Prayer times link generator for mosques.
 * Uses IslamicFinder which provides prayer times based on coordinates.
 */

interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Generate a prayer times URL for a location.
 * Returns null if coordinates are not available.
 */
export function getPrayerTimesUrl(
  coordinates: Coordinates | undefined,
  location: string,
  country: string
): string | null {
  if (!coordinates) return null;

  // Use IslamicFinder which accepts coordinates
  const { lat, lng } = coordinates;
  return `https://www.islamicfinder.org/world/${encodeURIComponent(country.toLowerCase())}/${encodeURIComponent(location.toLowerCase().replace(/\s+/g, "-"))}/?latitude=${lat}&longitude=${lng}`;
}

/**
 * Alternative: Get a general prayer times URL for a city/country
 * Useful when coordinates aren't available
 */
export function getPrayerTimesCityUrl(location: string, country: string): string {
  const citySlug = location.toLowerCase().replace(/\s+/g, "-");
  const countrySlug = country.toLowerCase().replace(/\s+/g, "-");
  return `https://www.islamicfinder.org/world/${countrySlug}/${citySlug}/`;
}

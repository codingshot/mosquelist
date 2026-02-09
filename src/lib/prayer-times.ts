/**
 * Prayer times link generator for mosques.
 * Uses IslamicFinder prayer-times page; accepts latitude/longitude query params (no 404).
 */

interface Coordinates {
  lat: number;
  lng: number;
}

const ISLAMICFINDER_PRAYER_TIMES = "https://www.islamicfinder.org/prayer-times/";

/**
 * Generate a prayer times URL for a location.
 * Uses IslamicFinder's main prayer-times page with latitude/longitude so the page loads correctly (avoids /world/country/city/ 404s).
 * Returns null if coordinates are not available.
 */
export function getPrayerTimesUrl(
  coordinates: Coordinates | undefined,
  _location: string,
  _country: string
): string | null {
  if (!coordinates) return null;
  const { lat, lng } = coordinates;
  const params = new URLSearchParams({ latitude: String(lat), longitude: String(lng) });
  return `${ISLAMICFINDER_PRAYER_TIMES}?${params.toString()}`;
}

/**
 * Fallback when coordinates aren't available: link to main prayer times page so user can search or use location.
 */
export function getPrayerTimesCityUrl(_location: string, _country: string): string {
  return ISLAMICFINDER_PRAYER_TIMES;
}

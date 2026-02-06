import type { Mosque } from "@/types/mosque";

/**
 * Display string for mosque location: address preferred over coordinates over "location, country".
 */
export function getLocationDisplay(mosque: Mosque): string {
  if (mosque.address) {
    return `${mosque.address}, ${mosque.location}, ${mosque.country}`;
  }
  if (mosque.coordinates) {
    return `${mosque.coordinates.lat}, ${mosque.coordinates.lng}`;
  }
  return `${mosque.location}, ${mosque.country}`;
}

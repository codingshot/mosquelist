/** Build Google Maps URL for a location (coordinates or address) */
export function getGoogleMapsUrl(
  coords: { lat: number; lng: number } | null,
  address?: string
): string {
  if (coords) {
    return `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
  }
  const q = encodeURIComponent(address || "");
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

/** Build Apple Maps URL for a location (coordinates or address) */
export function getAppleMapsUrl(
  coords: { lat: number; lng: number } | null,
  address?: string
): string {
  if (coords) {
    return `https://maps.apple.com/?q=${coords.lat},${coords.lng}`;
  }
  const q = encodeURIComponent(address || "");
  return `https://maps.apple.com/?q=${q}`;
}

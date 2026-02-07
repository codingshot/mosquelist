import type { Mosque } from "@/types/mosque";

const PLACEHOLDER = "/placeholder.svg";

/**
 * Returns the preferred image source for a mosque: use local image if available,
 * otherwise the remote imageUrl. Also returns the fallback URL for onError (remote URL
 * when using local, so the img can switch to remote if the local file fails to load).
 * Safe to call with null/undefined mosque (returns placeholder, no fallback).
 */
export function getMosqueImageSrc(mosque: Mosque | null | undefined): {
  src: string;
  fallbackUrl: string | null;
} {
  if (!mosque) {
    return { src: PLACEHOLDER, fallbackUrl: null };
  }
  const url = mosque.imageUrl?.trim() || "";
  const local = mosque.imageLocal?.trim() || "";

  if (local) {
    return { src: local, fallbackUrl: url || null };
  }
  return { src: url || PLACEHOLDER, fallbackUrl: null };
}

/**
 * Use in img onError to avoid infinite loop: try fallback once, then placeholder.
 */
export function setMosqueImageFallback(
  el: { src: string; onerror: unknown },
  fallbackUrl: string | null
): void {
  if (fallbackUrl && el.src !== fallbackUrl) {
    el.src = fallbackUrl;
  } else {
    el.src = PLACEHOLDER;
  }
  (el as { onerror: null }).onerror = null;
}


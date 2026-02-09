/**
 * Build share URLs for social platforms. Message and url are combined for platforms that support pre-filled text.
 */
export function getTwitterShareUrl(message: string, url: string): string {
  const text = message.length > 200 ? message.slice(0, 197) + "…" : message;
  const params = new URLSearchParams({
    text: `${text} ${url}`,
  });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

export function getFacebookShareUrl(url: string): string {
  const params = new URLSearchParams({ u: url });
  return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
}

export function getWhatsAppShareUrl(message: string, url: string): string {
  const text = `${message} ${url}`;
  const params = new URLSearchParams({ text });
  return `https://wa.me/?${params.toString()}`;
}

export function getLinkedInShareUrl(url: string): string {
  const params = new URLSearchParams({ url });
  return `https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`;
}

export function getEmailShareUrl(subject: string, body: string): string {
  const params = new URLSearchParams({
    subject,
    body,
  });
  return `mailto:?${params.toString()}`;
}

/** Tweet intent to suggest adding a mosque. Ask users to search MosqueList first, then tweet with mosque name. */
export function getSuggestMosqueTweetUrl(): string {
  const text =
    "Add _____ mosque details to MosqueList.com (search first at mosquelist.com) @ummahbuild";
  const params = new URLSearchParams({ text });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

/** Max characters for pre-filled message (leave room for URL in tweet). */
export const TWITTER_MAX_MESSAGE = 250;
export const LINKEDIN_MAX_MESSAGE = 1200;
export const FACEBOOK_MAX_MESSAGE = 500;

/**
 * Build a default share message for a bucket list (top mosques + summary).
 * Used for social posts; user can edit before sharing.
 */
export function getBucketListShareMessage(
  mosqueNames: string[],
  visitedCount: number,
  total: number
): string {
  const top = mosqueNames.slice(0, 4);
  const topStr = top.join(", ");
  const rest = total - top.length;
  const visitedStr =
    visitedCount === total
      ? "All visited!"
      : `${visitedCount}/${total} visited`;
  if (rest > 0) {
    return `My mosque bucket list on MosqueList: ${topStr} + ${rest} more. ${visitedStr} Plan your spiritual journey —`;
  }
  return `My mosque bucket list on MosqueList: ${topStr}. ${visitedStr} Plan your spiritual journey —`;
}

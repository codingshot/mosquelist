import type { Mosque } from "@/types/mosque";
import { getRegionForCountry } from "@/data/regions";

/**
 * Common stop words that should be ignored in multi-term search
 * These appear in almost every mosque entry and don't help filter results
 */
const STOP_WORDS = new Set([
  "mosque", "masjid", "the", "of", "in", "and", "a", "an", "is", "it", "to", "for",
  "with", "on", "at", "by", "from", "as", "or", "was", "are", "be", "has", "have",
  "prayer", "hall", "courtyards", "facilities", "visitors", "open", "located"
]);

/**
 * Build primary searchable string (name, Arabic name, location, country) for high-priority matching.
 */
function getPrimarySearchText(m: Mosque): string {
  const parts = [
    m.name,
    m.arabicName ?? "",
    m.location,
    m.country,
  ];
  return parts.join(" ").toLowerCase();
}

/**
 * Build secondary searchable string from all other fields for broader matching.
 */
function getSecondarySearchText(m: Mosque): string {
  const region = getRegionForCountry(m.country) ?? "";
  const parts = [
    region,
    m.significance,
    m.description,
    m.architecturalStyle ?? "",
    m.history ?? "",
    m.tourismNotes ?? "",
    m.architectureNotes ?? "",
    ...(m.facilities ?? []),
  ];
  return parts.join(" ").toLowerCase();
}

/**
 * Get full searchable string (for backwards compatibility)
 */
function getSearchText(m: Mosque): string {
  return getPrimarySearchText(m) + " " + getSecondarySearchText(m);
}

/** Normalize query: trim, collapse spaces, toLowerCase */
function normalizeQuery(q: string): string {
  return q.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Extract quoted phrases and remaining terms from query.
 * "blue mosque" istanbul -> { phrases: ["blue mosque"], terms: ["istanbul"] }
 */
function parseQueryTerms(query: string): { phrases: string[]; terms: string[] } {
  const phrases: string[] = [];
  let remaining = query;
  
  // Extract quoted phrases
  const quoteRegex = /"([^"]+)"/g;
  let match;
  while ((match = quoteRegex.exec(query)) !== null) {
    phrases.push(match[1].toLowerCase().trim());
    remaining = remaining.replace(match[0], " ");
  }
  
  // Get remaining individual terms, filtering stop words
  const terms = remaining
    .split(" ")
    .map(t => t.trim().toLowerCase())
    .filter(t => t.length > 0 && !STOP_WORDS.has(t));
  
  return { phrases, terms };
}

/**
 * Calculate match score for a mosque against a query.
 * Higher score = better match. 0 = no match.
 * 
 * Scoring:
 * - Primary field match (name, location, country): +10 per term
 * - Secondary field match (description, history, etc.): +1 per term
 * - Phrase match: +20 (ensures exact phrases rank highest)
 */
function calculateMatchScore(mosque: Mosque, query: string): number {
  const q = normalizeQuery(query);
  if (!q) return 1; // Empty query matches all with base score
  
  const { phrases, terms } = parseQueryTerms(q);
  const primary = getPrimarySearchText(mosque);
  const secondary = getSecondarySearchText(mosque);
  const full = primary + " " + secondary;
  
  let score = 0;
  
  // Check phrases - all must match for any score
  for (const phrase of phrases) {
    if (!full.includes(phrase)) return 0; // Phrase not found, no match
    score += primary.includes(phrase) ? 30 : 15;
  }
  
  // Check individual terms - all must match for any score
  for (const term of terms) {
    if (!full.includes(term)) return 0; // Term not found, no match
    score += primary.includes(term) ? 10 : 1;
  }
  
  // If no terms after filtering stop words, but original query had content,
  // do a basic full-text match
  if (phrases.length === 0 && terms.length === 0) {
    const originalTerms = q.split(" ").filter(Boolean);
    for (const term of originalTerms) {
      if (!full.includes(term)) return 0;
      score += primary.includes(term) ? 10 : 1;
    }
  }
  
  return score;
}

/**
 * Multi-term search: each non-empty term must appear in the search text.
 * Enables "blue istanbul" -> Blue Mosque, Istanbul.
 */
export function mosqueMatchesQuery(mosque: Mosque, query: string): boolean {
  return calculateMatchScore(mosque, query) > 0;
}

/**
 * Filter and sort mosques by query relevance.
 * Primary matches (name, location) rank higher than secondary matches (description).
 */
export function filterMosquesByQuery(mosques: Mosque[], query: string): Mosque[] {
  const q = normalizeQuery(query);
  if (!q) return mosques;
  
  // Calculate scores and filter
  const scored = mosques
    .map(m => ({ mosque: m, score: calculateMatchScore(m, q) }))
    .filter(item => item.score > 0);
  
  // Sort by score descending (best matches first)
  scored.sort((a, b) => b.score - a.score);
  
  return scored.map(item => item.mosque);
}

/**
 * Get search suggestions based on partial query.
 * Returns mosque names that start with or contain the query.
 */
export function getSearchSuggestions(mosques: Mosque[], query: string, limit = 5): string[] {
  const q = normalizeQuery(query);
  if (!q || q.length < 2) return [];
  
  const suggestions: { name: string; priority: number }[] = [];
  
  for (const m of mosques) {
    const nameLower = m.name.toLowerCase();
    const locationLower = m.location.toLowerCase();
    const countryLower = m.country.toLowerCase();
    
    if (nameLower.startsWith(q)) {
      suggestions.push({ name: m.name, priority: 3 });
    } else if (nameLower.includes(q)) {
      suggestions.push({ name: m.name, priority: 2 });
    } else if (locationLower.includes(q) || countryLower.includes(q)) {
      suggestions.push({ name: `${m.name} (${m.location})`, priority: 1 });
    }
  }
  
  return suggestions
    .sort((a, b) => b.priority - a.priority)
    .slice(0, limit)
    .map(s => s.name);
}

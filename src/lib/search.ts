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
 * Common spelling variations and aliases for mosque names/locations
 */
const ALIASES: Record<string, string[]> = {
  "blue mosque": ["sultan ahmed", "sultanahmet"],
  "sultanahmet": ["blue mosque", "sultan ahmed"],
  "sultan ahmed": ["blue mosque", "sultanahmet"],
  "nabawi": ["prophet's mosque", "masjid an-nabawi", "medina"],
  "haram": ["grand mosque", "mecca", "kaaba"],
  "aqsa": ["al-aqsa", "jerusalem", "dome of rock"],
  "dome": ["dome of the rock", "al-aqsa", "jerusalem"],
  "sheikh zayed": ["abu dhabi", "grand mosque"],
  "hagia sophia": ["ayasofya", "istanbul"],
  "ayasofya": ["hagia sophia", "istanbul"],
};

/**
 * Normalize text for consistent matching
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[''`]/g, "'") // Normalize apostrophes
    .replace(/[-–—]/g, " ") // Normalize dashes to spaces
    .replace(/\s+/g, " ")
    .trim();
}

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
  return normalizeText(parts.join(" "));
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
  return normalizeText(parts.join(" "));
}

/** Normalize query: trim, collapse spaces, toLowerCase */
function normalizeQuery(q: string): string {
  return normalizeText(q);
}

/**
 * Check if a term matches with fuzzy tolerance
 * Allows for minor typos (1-2 character difference for longer words)
 */
function fuzzyMatch(text: string, term: string): boolean {
  // Exact substring match
  if (text.includes(term)) return true;
  
  // For short terms (<=3 chars), require exact match
  if (term.length <= 3) return false;
  
  // Check word-by-word for starts-with matching (helps with typos)
  const words = text.split(/\s+/);
  for (const word of words) {
    // Word starts with term (good for partial typing)
    if (word.startsWith(term)) return true;
    // Term starts with word (reverse partial)
    if (term.startsWith(word) && word.length >= 3) return true;
  }
  
  return false;
}

/**
 * Get alias expansions for a query term
 */
function getAliasExpansions(term: string): string[] {
  const expansions: string[] = [];
  for (const [key, values] of Object.entries(ALIASES)) {
    if (term.includes(key) || key.includes(term)) {
      expansions.push(...values);
    }
  }
  return expansions;
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
    phrases.push(normalizeText(match[1]));
    remaining = remaining.replace(match[0], " ");
  }
  
  // Get remaining individual terms, filtering stop words
  const terms = remaining
    .split(" ")
    .map(t => normalizeText(t))
    .filter(t => t.length > 0 && !STOP_WORDS.has(t));
  
  return { phrases, terms };
}

/**
 * Calculate match score for a mosque against a query.
 * Higher score = better match. 0 = no match.
 * 
 * Scoring:
 * - Exact phrase in primary fields: +50
 * - Exact phrase in secondary fields: +25
 * - Term in primary (name, location, country): +15 per term
 * - Term in secondary (description, history, etc.): +3 per term
 * - Fuzzy/alias match: +5 per term
 * - Name starts with query: +20 bonus
 */
function calculateMatchScore(mosque: Mosque, query: string): number {
  const q = normalizeQuery(query);
  if (!q) return 1; // Empty query matches all with base score
  
  const { phrases, terms } = parseQueryTerms(q);
  const primary = getPrimarySearchText(mosque);
  const secondary = getSecondarySearchText(mosque);
  const full = primary + " " + secondary;
  const nameLower = normalizeText(mosque.name);
  
  let score = 0;
  let allMatch = true;
  
  // Check phrases - all must match for any score
  for (const phrase of phrases) {
    if (primary.includes(phrase)) {
      score += 50;
    } else if (secondary.includes(phrase)) {
      score += 25;
    } else {
      allMatch = false;
    }
  }
  
  if (!allMatch) return 0;
  
  // Check individual terms
  for (const term of terms) {
    let termMatched = false;
    
    // Primary field exact match (highest value)
    if (primary.includes(term)) {
      score += 15;
      termMatched = true;
    }
    // Secondary field exact match
    else if (secondary.includes(term)) {
      score += 3;
      termMatched = true;
    }
    // Fuzzy match on full text
    else if (fuzzyMatch(full, term)) {
      score += 5;
      termMatched = true;
    }
    // Check aliases
    else {
      const aliases = getAliasExpansions(term);
      for (const alias of aliases) {
        if (full.includes(alias)) {
          score += 5;
          termMatched = true;
          break;
        }
      }
    }
    
    if (!termMatched) return 0; // All terms must match
  }
  
  // If no terms after filtering stop words, but original query had content,
  // do a basic full-text match
  if (phrases.length === 0 && terms.length === 0) {
    const originalTerms = q.split(" ").filter(Boolean);
    for (const term of originalTerms) {
      if (primary.includes(term)) {
        score += 10;
      } else if (secondary.includes(term)) {
        score += 1;
      } else if (fuzzyMatch(full, term)) {
        score += 2;
      } else {
        return 0;
      }
    }
  }
  
  // Bonus: name starts with the query (or first term)
  const firstTerm = terms[0] || phrases[0] || q.split(" ")[0];
  if (firstTerm && nameLower.startsWith(firstTerm)) {
    score += 20;
  }
  
  // Bonus: exact name match
  if (nameLower === q || nameLower.includes(q)) {
    score += 30;
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
    const nameLower = normalizeText(m.name);
    const locationLower = normalizeText(m.location);
    const countryLower = normalizeText(m.country);
    
    if (nameLower.startsWith(q)) {
      suggestions.push({ name: m.name, priority: 4 });
    } else if (nameLower.includes(q)) {
      suggestions.push({ name: m.name, priority: 3 });
    } else if (locationLower.startsWith(q)) {
      suggestions.push({ name: `${m.name} (${m.location})`, priority: 2 });
    } else if (locationLower.includes(q) || countryLower.includes(q)) {
      suggestions.push({ name: `${m.name} (${m.location})`, priority: 1 });
    }
  }
  
  return suggestions
    .sort((a, b) => b.priority - a.priority)
    .slice(0, limit)
    .map(s => s.name);
}

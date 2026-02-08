/**
 * Timeline utilities for parsing dates and validating historical accuracy.
 * 
 * Islam began in 610 CE with the first revelation to Prophet Muhammad ﷺ.
 * The first mosques were built after the Hijrah (622 CE).
 * Hagia Sophia (537 CE) is the only pre-Islamic structure in our list (converted 1453).
 */

/** 
 * Parse numeric year from established string.
 * Handles: "638 CE", "2007", "705–715 CE", "15th century", "16th century", etc.
 * 
 * Century notation is converted to approximate midpoint:
 * - "15th century" -> 1450 (covers 1401-1500)
 * - "16th century" -> 1550 (covers 1501-1600)
 * - "19th century" -> 1850 (covers 1801-1900)
 */
export function parseEstablishmentYear(established: string): number {
  const str = String(established).toLowerCase();
  
  // Handle century notation first: "15th century" -> midpoint
  const centuryMatch = str.match(/(\d{1,2})(?:st|nd|rd|th)\s*century/i);
  if (centuryMatch) {
    const century = parseInt(centuryMatch[1], 10);
    // 15th century = 1401-1500, midpoint ~1450
    return (century - 1) * 100 + 50;
  }
  
  // Handle BCE/BC dates (rare, mainly for pre-Islamic sites)
  if (str.includes("bce") || str.includes("bc")) {
    const match = str.match(/\d{1,4}/);
    return match ? -parseInt(match[0], 10) : 0;
  }
  
  // Standard year extraction: "638 CE", "2007", "705–715 CE" -> first number
  const match = str.match(/\d{1,4}/);
  return match ? parseInt(match[0], 10) : 0;
}

/**
 * Format year for display, appending CE suffix for numeric-only years.
 */
export function formatYearDisplay(yearStr: string): string {
  // If it's a plain number, add CE
  if (/^\d+$/.test(yearStr.trim())) {
    return `${yearStr} CE`;
  }
  // If it contains "century", return as-is (already descriptive)
  if (yearStr.toLowerCase().includes("century")) {
    return yearStr;
  }
  return yearStr;
}

/**
 * Validate that a mosque's established date is historically reasonable.
 * 
 * Rules:
 * - Mosques cannot predate Islam (610 CE), except pre-Islamic structures converted later
 * - Hagia Sophia (537 CE) is the only exception (converted to mosque in 1453)
 * - Dates cannot be in the future
 * - Very early dates (before 622 CE) should be flagged for review
 * 
 * Returns { valid: boolean, warning?: string }
 */
export function validateMosqueDate(
  established: string,
  mosqueId: string
): { valid: boolean; warning?: string } {
  const year = parseEstablishmentYear(established);
  const currentYear = new Date().getFullYear();
  
  // Skip validation for unparseable dates
  if (year === 0) {
    return { valid: true, warning: "Could not parse date" };
  }
  
  // Future dates are invalid
  if (year > currentYear) {
    return { valid: false, warning: `Date ${year} is in the future` };
  }
  
  // Hagia Sophia is the only pre-Islamic structure (built 537, converted 1453)
  const PRE_ISLAMIC_EXCEPTIONS = ["hagia-sophia-istanbul"];
  if (PRE_ISLAMIC_EXCEPTIONS.includes(mosqueId)) {
    return { valid: true };
  }
  
  // Islam began 610 CE; first mosques built after Hijrah (622 CE)
  // Quba Mosque (622 CE) is the first purpose-built mosque
  const ISLAM_START = 610;
  const FIRST_MOSQUE = 622;
  
  if (year < ISLAM_START) {
    return { 
      valid: false, 
      warning: `Date ${year} predates Islam (610 CE). Only pre-Islamic structures converted later are valid.` 
    };
  }
  
  if (year < FIRST_MOSQUE) {
    return { 
      valid: true, 
      warning: `Date ${year} is before the Hijrah (622 CE). Verify this is accurate.` 
    };
  }
  
  return { valid: true };
}

/**
 * Key periods in Islamic history for timeline context.
 * These are non-mosque events that provide historical context.
 */
export const ISLAMIC_HISTORY_PERIODS = [
  { year: 610, label: "First Revelation", description: "Prophet Muhammad ﷺ receives first revelation at Cave Hira", source: "https://en.wikipedia.org/wiki/Muhammad%27s_first_revelation", category: "era" as const },
  { year: 622, label: "The Hijrah", description: "Migration from Mecca to Medina; start of Islamic calendar (1 AH)", source: "https://en.wikipedia.org/wiki/Hegira", category: "migration" as const },
  { year: 624, label: "Quba Mosque Founded", description: "First mosque built in Islam, constructed by Prophet Muhammad ﷺ upon arrival in Medina", source: "https://en.wikipedia.org/wiki/Quba_Mosque", category: "architecture" as const },
  { year: 632, label: "Rashidun Caliphate Begins", description: "Prophet Muhammad ﷺ passes away; Abu Bakr becomes first Caliph", source: "https://en.wikipedia.org/wiki/Rashidun_Caliphate", category: "caliphate" as const },
  { year: 637, label: "Conquest of Jerusalem", description: "Caliph Umar ibn al-Khattab enters Jerusalem; orders construction of Al-Aqsa prayer site", source: "https://en.wikipedia.org/wiki/Siege_of_Jerusalem_(636%E2%80%93637)", category: "expansion" as const },
  { year: 642, label: "Conquest of Egypt", description: "Amr ibn al-As conquers Egypt; builds first mosque in Africa at Fustat (Cairo)", source: "https://en.wikipedia.org/wiki/Muslim_conquest_of_Egypt", category: "expansion" as const },
  { year: 661, label: "Umayyad Caliphate Begins", description: "Capital moves to Damascus; Islamic empire expands across three continents", source: "https://en.wikipedia.org/wiki/Umayyad_Caliphate", category: "caliphate" as const },
  { year: 711, label: "Conquest of Iberia", description: "Tariq ibn Ziyad crosses into Spain; beginning of Al-Andalus (Islamic Iberia)", source: "https://en.wikipedia.org/wiki/Umayyad_conquest_of_Hispania", category: "expansion" as const },
  { year: 750, label: "Abbasid Caliphate Begins", description: "Islamic Golden Age; capital moves to Baghdad; flourishing of science, arts, and scholarship", source: "https://en.wikipedia.org/wiki/Abbasid_Caliphate", category: "caliphate" as const },
  { year: 762, label: "Baghdad Founded", description: "Abbasid Caliph al-Mansur founds the Round City of Baghdad as new capital", source: "https://en.wikipedia.org/wiki/Baghdad", category: "expansion" as const },
  { year: 836, label: "Samarra Capital", description: "Abbasid capital moves to Samarra; Great Mosque with spiral Malwiya minaret built", source: "https://en.wikipedia.org/wiki/Samarra", category: "architecture" as const },
  { year: 970, label: "Al-Azhar Founded", description: "Fatimid Caliphate establishes Al-Azhar in Cairo; world's oldest degree-granting university", source: "https://en.wikipedia.org/wiki/Al-Azhar_University", category: "education" as const },
  { year: 1099, label: "Crusader Capture of Jerusalem", description: "First Crusade captures Jerusalem; Al-Aqsa converted to palace", source: "https://en.wikipedia.org/wiki/Siege_of_Jerusalem_(1099)", category: "era" as const },
  { year: 1187, label: "Saladin Recaptures Jerusalem", description: "Salah ad-Din liberates Jerusalem; restores Al-Aqsa to Muslim worship", source: "https://en.wikipedia.org/wiki/Siege_of_Jerusalem_(1187)", category: "era" as const },
  { year: 1258, label: "Fall of Baghdad", description: "Mongol invasion ends Abbasid Caliphate; destruction of House of Wisdom", source: "https://en.wikipedia.org/wiki/Siege_of_Baghdad_(1258)", category: "era" as const },
  { year: 1299, label: "Ottoman Empire Founded", description: "Osman I establishes the Ottoman dynasty in Anatolia", source: "https://en.wikipedia.org/wiki/Ottoman_Empire", category: "caliphate" as const },
  { year: 1453, label: "Fall of Constantinople", description: "Ottoman conquest; Hagia Sophia becomes a mosque after 916 years as cathedral", source: "https://en.wikipedia.org/wiki/Fall_of_Constantinople", category: "expansion" as const },
  { year: 1517, label: "Ottoman Caliphate", description: "Ottomans assume Caliphate after conquering Egypt; golden age of Ottoman mosque architecture begins", source: "https://en.wikipedia.org/wiki/Ottoman_Caliphate", category: "caliphate" as const },
  { year: 1526, label: "Mughal Empire Founded", description: "Babur defeats Ibrahim Lodi; Mughal architecture flourishes in India", source: "https://en.wikipedia.org/wiki/Mughal_Empire", category: "caliphate" as const },
  { year: 1683, label: "Battle of Vienna", description: "Ottoman expansion in Europe halted; turning point in Ottoman-Habsburg relations", source: "https://en.wikipedia.org/wiki/Battle_of_Vienna", category: "era" as const },
  { year: 1857, label: "End of Mughal Empire", description: "Last Mughal emperor Bahadur Shah Zafar exiled after Indian Rebellion", source: "https://en.wikipedia.org/wiki/Indian_Rebellion_of_1857", category: "era" as const },
  { year: 1924, label: "End of Caliphate", description: "Turkish Republic abolishes Ottoman Caliphate after 1,292 years of succession", source: "https://en.wikipedia.org/wiki/Abolition_of_the_Ottoman_Caliphate", category: "era" as const },
  { year: 1932, label: "Saudi Arabia Founded", description: "Ibn Saud unifies kingdoms; modern Saudi Arabia established as custodian of the Two Holy Mosques", source: "https://en.wikipedia.org/wiki/Unification_of_Saudi_Arabia", category: "era" as const },
  { year: 1947, label: "Pakistan Founded", description: "World's first nation founded on Islamic principles; later builds Faisal Mosque as national mosque", source: "https://en.wikipedia.org/wiki/Pakistan#Independence", category: "era" as const },
  { year: 1957, label: "Malaysia Independence", description: "Federation of Malaya gains independence; Islamic architecture flourishes in new nation", source: "https://en.wikipedia.org/wiki/Hari_Merdeka", category: "era" as const },
  { year: 1971, label: "Bangladesh Founded", description: "East Pakistan becomes Bangladesh; Baitul Mukarram designated as national mosque", source: "https://en.wikipedia.org/wiki/Bangladesh_Liberation_War", category: "era" as const },
  { year: 1979, label: "Iranian Revolution", description: "Islamic Republic of Iran established; major investment in shrine architecture begins", source: "https://en.wikipedia.org/wiki/Iranian_Revolution", category: "era" as const },
] as const;

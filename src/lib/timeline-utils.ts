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
  { year: 610, label: "First Revelation", description: "Prophet Muhammad ﷺ receives first revelation at Cave Hira", source: "Sahih al-Bukhari" },
  { year: 622, label: "The Hijrah", description: "Migration from Mecca to Medina; start of Islamic calendar", source: "Islamic Calendar Origin" },
  { year: 624, label: "Quba Mosque Founded", description: "First mosque built in Islam, constructed by Prophet Muhammad ﷺ upon arrival in Medina", source: "Sahih Muslim" },
  { year: 632, label: "Rashidun Caliphate Begins", description: "Prophet Muhammad ﷺ passes away; Abu Bakr becomes first Caliph", source: "Islamic History" },
  { year: 637, label: "Conquest of Jerusalem", description: "Caliph Umar ibn al-Khattab enters Jerusalem; orders construction of Al-Aqsa prayer site", source: "Tarikh at-Tabari" },
  { year: 642, label: "Amr ibn al-As Mosque", description: "First mosque in Africa built in Fustat (Cairo); oldest mosque in Egypt", source: "Egyptian Ministry of Antiquities" },
  { year: 661, label: "Umayyad Caliphate Begins", description: "Capital moves to Damascus; Islamic empire expands across three continents", source: "Islamic History" },
  { year: 705, label: "Great Umayyad Mosque", description: "Caliph al-Walid I begins construction of the Umayyad Mosque in Damascus", source: "UNESCO World Heritage" },
  { year: 715, label: "Great Mosque of Córdoba", description: "Abd al-Rahman I begins the Mezquita; pinnacle of Moorish architecture in Al-Andalus", source: "UNESCO World Heritage" },
  { year: 750, label: "Abbasid Caliphate Begins", description: "Islamic Golden Age; capital moves to Baghdad; flourishing of science and arts", source: "Islamic History" },
  { year: 762, label: "Baghdad Founded", description: "Abbasid Caliph al-Mansur founds the Round City of Baghdad as new capital", source: "Tarikh at-Tabari" },
  { year: 836, label: "Great Mosque of Samarra", description: "Construction of iconic spiral minaret mosque during Abbasid era", source: "UNESCO World Heritage" },
  { year: 970, label: "Al-Azhar Mosque Founded", description: "Fatimid Caliphate establishes Al-Azhar in Cairo; world's oldest university", source: "Al-Azhar University" },
  { year: 1099, label: "Crusader Capture of Jerusalem", description: "First Crusade captures Jerusalem; Al-Aqsa converted to palace", source: "Historical Records" },
  { year: 1187, label: "Saladin Recaptures Jerusalem", description: "Salah ad-Din liberates Jerusalem; restores Al-Aqsa to Muslim worship", source: "Islamic History" },
  { year: 1258, label: "Fall of Baghdad", description: "Mongol invasion ends Abbasid Caliphate; destruction of House of Wisdom", source: "Historical Records" },
  { year: 1453, label: "Fall of Constantinople", description: "Ottoman conquest; Hagia Sophia becomes a mosque after 916 years as cathedral", source: "Historical Records" },
  { year: 1517, label: "Ottoman Caliphate", description: "Ottomans assume Caliphate; golden age of Ottoman mosque architecture begins", source: "Ottoman History" },
  { year: 1557, label: "Süleymaniye Mosque", description: "Architect Sinan completes masterwork for Suleiman the Magnificent in Istanbul", source: "UNESCO World Heritage" },
  { year: 1616, label: "Sultan Ahmed Mosque", description: "Blue Mosque completed in Istanbul; only mosque with six minarets", source: "Turkish Ministry of Culture" },
  { year: 1924, label: "End of Caliphate", description: "Turkish Republic abolishes Ottoman Caliphate after 1,292 years of succession", source: "Historical Records" },
  { year: 1986, label: "King Fahd Mosque Complex", description: "Largest expansion of Masjid al-Haram begins; capacity increased to millions", source: "Saudi Ministry of Islamic Affairs" },
] as const;

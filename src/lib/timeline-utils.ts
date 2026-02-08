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
  // 7th Century - Early Islam & Expansion
  { year: 610, label: "First Revelation", description: "Prophet Muhammad ﷺ receives first revelation at Cave Hira", source: "https://en.wikipedia.org/wiki/Muhammad%27s_first_revelation", category: "era" as const },
  { year: 622, label: "The Hijrah", description: "Migration from Mecca to Medina; start of Islamic calendar (1 AH)", source: "https://en.wikipedia.org/wiki/Hegira", category: "migration" as const },
  { year: 622, label: "Quba Mosque Founded", description: "First mosque built in Islam, constructed by Prophet Muhammad ﷺ upon arrival in Medina", source: "https://en.wikipedia.org/wiki/Quba_Mosque", category: "architecture" as const },
  { year: 622, label: "Al-Masjid an-Nabawi Founded", description: "Prophet's Mosque built in Medina; second holiest site in Islam", source: "https://en.wikipedia.org/wiki/Al-Masjid_an-Nabawi", category: "architecture" as const },
  { year: 630, label: "Conquest of Mecca", description: "Prophet Muhammad ﷺ peacefully conquers Mecca; Ka'bah cleansed of idols", source: "https://en.wikipedia.org/wiki/Conquest_of_Mecca", category: "expansion" as const },
  { year: 632, label: "Rashidun Caliphate Begins", description: "Prophet Muhammad ﷺ passes away; Abu Bakr becomes first Caliph", source: "https://en.wikipedia.org/wiki/Rashidun_Caliphate", category: "caliphate" as const },
  { year: 635, label: "Conquest of Damascus", description: "Muslim armies capture Damascus, first major city of the Byzantine Empire to fall", source: "https://en.wikipedia.org/wiki/Siege_of_Damascus_(634)", category: "expansion" as const },
  { year: 636, label: "Masjid al-Qiblatayn Built", description: "Mosque in Medina where Qibla direction changed from Jerusalem to Mecca", source: "https://en.wikipedia.org/wiki/Masjid_al-Qiblatayn", category: "architecture" as const },
  { year: 637, label: "Conquest of Jerusalem", description: "Caliph Umar ibn al-Khattab enters Jerusalem; orders construction of Al-Aqsa prayer site", source: "https://en.wikipedia.org/wiki/Siege_of_Jerusalem_(636%E2%80%93637)", category: "expansion" as const },
  { year: 637, label: "Conquest of Ctesiphon", description: "Persian capital falls to Arab forces; end of Sassanid Empire begins", source: "https://en.wikipedia.org/wiki/Muslim_conquest_of_Persia", category: "expansion" as const },
  { year: 638, label: "Mosque of Amr ibn al-As", description: "First mosque in Africa built in Fustat (old Cairo), Egypt", source: "https://en.wikipedia.org/wiki/Mosque_of_Amr_ibn_al-As", category: "architecture" as const },
  { year: 641, label: "Islam Reaches Alexandria", description: "Amr ibn al-As conquers Alexandria, gateway to North Africa", source: "https://en.wikipedia.org/wiki/Muslim_conquest_of_Egypt", category: "expansion" as const },
  { year: 642, label: "Conquest of Egypt", description: "Amr ibn al-As completes conquest of Egypt; first mosque in Africa at Fustat (Cairo)", source: "https://en.wikipedia.org/wiki/Muslim_conquest_of_Egypt", category: "expansion" as const },
  { year: 647, label: "First Raid into Ifriqiya", description: "Arabs launch first expedition into modern Tunisia; Islam begins reaching the Maghreb", source: "https://en.wikipedia.org/wiki/Muslim_conquest_of_the_Maghreb", category: "expansion" as const },
  { year: 651, label: "End of Sassanid Persia", description: "Last Sassanid emperor Yazdegerd III killed; Persia becomes Muslim", source: "https://en.wikipedia.org/wiki/Muslim_conquest_of_Persia", category: "expansion" as const },
  { year: 661, label: "Umayyad Caliphate Begins", description: "Capital moves to Damascus; Islamic empire expands across three continents", source: "https://en.wikipedia.org/wiki/Umayyad_Caliphate", category: "caliphate" as const },
  { year: 670, label: "Islam Reaches Kairouan", description: "Uqba ibn Nafi founds Kairouan (Tunisia); first major Islamic city in the Maghreb", source: "https://en.wikipedia.org/wiki/Great_Mosque_of_Kairouan", category: "expansion" as const },
  { year: 670, label: "Great Mosque of Kairouan", description: "Oldest mosque in the Maghreb; model for North African mosque architecture", source: "https://en.wikipedia.org/wiki/Great_Mosque_of_Kairouan", category: "architecture" as const },
  { year: 682, label: "Islam Reaches Morocco", description: "Uqba ibn Nafi reaches the Atlantic Ocean; Islam spreads to Morocco", source: "https://en.wikipedia.org/wiki/Uqba_ibn_Nafi", category: "expansion" as const },
  { year: 691, label: "Dome of the Rock Completed", description: "First great work of Islamic architecture built in Jerusalem by Caliph Abd al-Malik", source: "https://en.wikipedia.org/wiki/Dome_of_the_Rock", category: "architecture" as const },
  { year: 700, label: "Islam Reaches East African Coast", description: "Arab and Persian traders establish settlements along Swahili coast; peaceful spread through trade", source: "https://en.wikipedia.org/wiki/Islam_in_East_Africa", category: "expansion" as const },
  { year: 705, label: "Great Mosque of Damascus", description: "Umayyad Mosque built on site of Christian church; masterpiece of early Islamic architecture", source: "https://en.wikipedia.org/wiki/Umayyad_Mosque", category: "architecture" as const },
  { year: 711, label: "Conquest of Iberia", description: "Tariq ibn Ziyad crosses into Spain; beginning of Al-Andalus (Islamic Iberia)", source: "https://en.wikipedia.org/wiki/Umayyad_conquest_of_Hispania", category: "expansion" as const },
  { year: 711, label: "Islam Reaches Sindh (Pakistan)", description: "Muhammad bin Qasim conquers Sindh; first permanent Muslim presence in South Asia", source: "https://en.wikipedia.org/wiki/Arab_conquest_of_Sindh", category: "expansion" as const },
  
  // 8th-9th Century - Abbasid Era & African Expansion
  { year: 750, label: "Abbasid Caliphate Begins", description: "Islamic Golden Age; capital moves to Baghdad; flourishing of science, arts, and scholarship", source: "https://en.wikipedia.org/wiki/Abbasid_Caliphate", category: "caliphate" as const },
  { year: 750, label: "Lamu Founded", description: "Muslim settlement established on Lamu island (Kenya); one of oldest in East Africa", source: "https://en.wikipedia.org/wiki/Lamu", category: "expansion" as const },
  { year: 750, label: "Islam Reaches West Africa", description: "Trans-Saharan trade routes bring Islam to Ghana Empire and the Sahel", source: "https://en.wikipedia.org/wiki/Spread_of_Islam_in_West_Africa", category: "expansion" as const },
  { year: 762, label: "Baghdad Founded", description: "Abbasid Caliph al-Mansur founds the Round City of Baghdad as new capital", source: "https://en.wikipedia.org/wiki/Baghdad", category: "expansion" as const },
  { year: 785, label: "Great Mosque of Córdoba", description: "Construction begins on the Mezquita; masterpiece of Moorish architecture in Spain", source: "https://en.wikipedia.org/wiki/Mosque%E2%80%93Cathedral_of_C%C3%B3rdoba", category: "architecture" as const },
  { year: 800, label: "Kilwa Sultanate Established", description: "Muslim sultanate founded on Kilwa Kisiwani (Tanzania); becomes major trade hub", source: "https://en.wikipedia.org/wiki/Kilwa_Sultanate", category: "expansion" as const },
  { year: 800, label: "Islam in Ghana Empire", description: "Muslim traders establish communities in Koumbi Saleh; king allows Muslim quarter", source: "https://en.wikipedia.org/wiki/Ghana_Empire", category: "expansion" as const },
  { year: 830, label: "Mogadishu Founded", description: "Arab and Persian traders establish Mogadishu; becomes prominent Islamic city-state", source: "https://en.wikipedia.org/wiki/Mogadishu", category: "expansion" as const },
  { year: 836, label: "Samarra Capital", description: "Abbasid capital moves to Samarra; Great Mosque with spiral Malwiya minaret built", source: "https://en.wikipedia.org/wiki/Samarra", category: "architecture" as const },
  { year: 900, label: "Zanzibar Islamized", description: "Persian Shirazi traders establish Muslim communities on Zanzibar; later becomes sultanate", source: "https://en.wikipedia.org/wiki/Zanzibar", category: "expansion" as const },
  { year: 970, label: "Al-Azhar Founded", description: "Fatimid Caliphate establishes Al-Azhar in Cairo; world's oldest degree-granting university", source: "https://en.wikipedia.org/wiki/Al-Azhar_University", category: "education" as const },
  
  // 10th-11th Century
  { year: 1000, label: "Swahili City-States Flourish", description: "Islamic Swahili culture thrives along East African coast from Somalia to Mozambique", source: "https://en.wikipedia.org/wiki/Swahili_coast", category: "expansion" as const },
  { year: 1000, label: "Islam Reaches Indonesia", description: "Muslim traders establish communities in Sumatra; peaceful spread through maritime trade", source: "https://en.unesco.org/silkroad/content/did-you-know-spread-islam-southeast-asia-through-trade-routes", category: "expansion" as const },
  { year: 1009, label: "Gao Becomes Muslim", description: "King of Gao (Mali) converts to Islam; city becomes major Sahelian Islamic center", source: "https://en.wikipedia.org/wiki/Gao", category: "expansion" as const },
  { year: 1050, label: "Almoravid Movement", description: "Berber reformist movement spreads Islam across Senegal and Mauritania", source: "https://en.wikipedia.org/wiki/Almoravid_dynasty", category: "expansion" as const },
  { year: 1076, label: "Almoravids Conquer Ghana", description: "Almoravid forces capture Koumbi Saleh; accelerates Islamization of West Africa", source: "https://en.wikipedia.org/wiki/Ghana_Empire#Decline", category: "expansion" as const },
  { year: 1099, label: "Crusader Capture of Jerusalem", description: "First Crusade captures Jerusalem; Al-Aqsa converted to palace", source: "https://en.wikipedia.org/wiki/Siege_of_Jerusalem_(1099)", category: "era" as const },
  { year: 1100, label: "Hausa States Islamized", description: "Islam spreads to Hausa city-states (Northern Nigeria) via trans-Saharan trade", source: "https://en.wikipedia.org/wiki/Hausa_Kingdoms", category: "expansion" as const },
  { year: 1187, label: "Saladin Recaptures Jerusalem", description: "Salah ad-Din liberates Jerusalem; restores Al-Aqsa to Muslim worship", source: "https://en.wikipedia.org/wiki/Siege_of_Jerusalem_(1187)", category: "era" as const },
  { year: 1200, label: "Kano Becomes Muslim City", description: "Kano (Nigeria) emerges as major Islamic learning center in Hausaland", source: "https://en.wikipedia.org/wiki/History_of_Kano", category: "expansion" as const },
  { year: 1206, label: "Delhi Sultanate Founded", description: "Qutb al-Din Aibak establishes Muslim rule in India; Qutb Minar and Quwwat-ul-Islam Mosque built", source: "https://en.wikipedia.org/wiki/Delhi_Sultanate", category: "expansion" as const },
  { year: 1235, label: "Mali Empire Founded", description: "Sundiata Keita establishes Mali Empire; Islam becomes court religion", source: "https://en.wikipedia.org/wiki/Mali_Empire", category: "caliphate" as const },
  { year: 1258, label: "Fall of Baghdad", description: "Mongol invasion ends Abbasid Caliphate; destruction of House of Wisdom", source: "https://en.wikipedia.org/wiki/Siege_of_Baghdad_(1258)", category: "era" as const },
  { year: 1290, label: "Islam Established in Sumatra", description: "Muslim merchants establish permanent foothold in northern Sumatra", source: "https://en.wikipedia.org/wiki/Spread_of_Islam_in_Indonesia", category: "expansion" as const },
  { year: 1299, label: "Ottoman Empire Founded", description: "Osman I establishes the Ottoman dynasty in Anatolia", source: "https://en.wikipedia.org/wiki/Ottoman_Empire", category: "caliphate" as const },
  { year: 1324, label: "Mansa Musa's Pilgrimage", description: "Mali Emperor Mansa Musa's famous Hajj; displays West African wealth, spreads Mali's fame", source: "https://en.wikipedia.org/wiki/Mansa_Musa", category: "expansion" as const },
  { year: 1325, label: "Timbuktu Flourishes", description: "Timbuktu becomes major center of Islamic learning; Sankore Mosque expands", source: "https://spice.fsi.stanford.edu/docs/the_spread_of_islam_in_west_africa_containment_mixing_and_reform_from_the_eighth_to_the_twentieth_century", category: "education" as const },
  { year: 1327, label: "Djinguereber Mosque", description: "Mansa Musa builds Djinguereber Mosque in Timbuktu; masterpiece of Sudano-Sahelian architecture", source: "https://en.wikipedia.org/wiki/Djinguereber_Mosque", category: "architecture" as const },
  { year: 1340, label: "Great Mosque of Djenné", description: "Original mosque built in Djenné (Mali); largest mud-brick building in the world", source: "https://en.wikipedia.org/wiki/Great_Mosque_of_Djenn%C3%A9", category: "architecture" as const },
  { year: 1400, label: "Islam Reaches Malacca", description: "Parameswara converts to Islam; Malacca becomes regional center for Islamic propagation", source: "https://www.britannica.com/place/Malaysia/The-advent-of-Islam", category: "expansion" as const },
  { year: 1453, label: "Fall of Constantinople", description: "Ottoman conquest; Hagia Sophia becomes a mosque after 916 years as cathedral", source: "https://en.wikipedia.org/wiki/Fall_of_Constantinople", category: "expansion" as const },
  { year: 1464, label: "Songhai Empire Rises", description: "Sunni Ali captures Timbuktu; Songhai becomes dominant West African Islamic empire", source: "https://en.wikipedia.org/wiki/Songhai_Empire", category: "caliphate" as const },
  { year: 1493, label: "Askia Muhammad's Reforms", description: "Askia the Great makes Islam state religion of Songhai; promotes Islamic education", source: "https://en.wikipedia.org/wiki/Askia_Mohammad_I", category: "expansion" as const },
  { year: 1517, label: "Ottoman Caliphate", description: "Ottomans assume Caliphate after conquering Egypt; golden age of Ottoman mosque architecture begins", source: "https://en.wikipedia.org/wiki/Ottoman_Caliphate", category: "caliphate" as const },
  { year: 1526, label: "Mughal Empire Founded", description: "Babur defeats Ibrahim Lodi; Mughal architecture flourishes in India", source: "https://en.wikipedia.org/wiki/Mughal_Empire", category: "caliphate" as const },
  { year: 1575, label: "Islam Dominant in Java", description: "Hindu Majapahit kingdom falls; Islam spreads throughout Indonesian archipelago", source: "https://en.wikipedia.org/wiki/Spread_of_Islam_in_Indonesia", category: "expansion" as const },
  { year: 1591, label: "Fall of Songhai", description: "Moroccan forces defeat Songhai; end of major West African Islamic empires", source: "https://en.wikipedia.org/wiki/Battle_of_Tondibi", category: "era" as const },
  { year: 1683, label: "Battle of Vienna", description: "Ottoman expansion in Europe halted; turning point in Ottoman-Habsburg relations", source: "https://en.wikipedia.org/wiki/Battle_of_Vienna", category: "era" as const },
  
  // Colonial Era
  { year: 1757, label: "British Colonize Bengal", description: "Battle of Plassey; British East India Company gains control of Bengal, beginning of British India", source: "https://en.wikipedia.org/wiki/Battle_of_Plassey", category: "colonization" as const },
  { year: 1798, label: "Napoleon Invades Egypt", description: "French forces occupy Egypt; beginning of European colonial interest in Muslim lands", source: "https://en.wikipedia.org/wiki/French_campaign_in_Egypt_and_Syria", category: "colonization" as const },
  { year: 1804, label: "Sokoto Caliphate Founded", description: "Usman dan Fodio's jihad establishes Sokoto Caliphate; largest state in 19th century Africa", source: "https://en.wikipedia.org/wiki/Sokoto_Caliphate", category: "caliphate" as const },
  { year: 1830, label: "France Colonizes Algeria", description: "French invasion begins 132 years of colonial rule; waqf properties seized", source: "https://en.wikipedia.org/wiki/French_Algeria", category: "colonization" as const },
  { year: 1857, label: "End of Mughal Empire", description: "Last Mughal emperor Bahadur Shah Zafar exiled after Indian Rebellion", source: "https://en.wikipedia.org/wiki/Indian_Rebellion_of_1857", category: "era" as const },
  { year: 1858, label: "British Raj Begins", description: "British Crown takes direct control of India after 1857 uprising", source: "https://en.wikipedia.org/wiki/British_Raj", category: "colonization" as const },
  { year: 1869, label: "Britain Controls Suez", description: "Suez Canal opens; strategic importance leads to deeper British involvement in Egypt", source: "https://en.wikipedia.org/wiki/Suez_Canal", category: "colonization" as const },
  { year: 1881, label: "France Colonizes Tunisia", description: "French establish protectorate; later extended to Morocco (1912)", source: "https://en.wikipedia.org/wiki/French_protectorate_of_Tunisia", category: "colonization" as const },
  { year: 1882, label: "Britain Occupies Egypt", description: "British forces occupy Egypt; control lasts until 1952", source: "https://en.wikipedia.org/wiki/History_of_Egypt_under_the_British", category: "colonization" as const },
  { year: 1885, label: "European Scramble for Africa", description: "Berlin Conference divides Africa; Muslim regions of West and East Africa colonized", source: "https://en.wikipedia.org/wiki/Scramble_for_Africa", category: "colonization" as const },
  { year: 1888, label: "Britain Controls East Africa", description: "British East Africa Company takes control of Kenya and Uganda; Zanzibar becomes protectorate", source: "https://en.wikipedia.org/wiki/Imperial_British_East_Africa_Company", category: "colonization" as const },
  { year: 1890, label: "Zanzibar Sultanate Under Britain", description: "Anglo-German agreement places Zanzibar under British influence; 45-minute war in 1896", source: "https://en.wikipedia.org/wiki/History_of_Zanzibar", category: "colonization" as const },
  { year: 1898, label: "Britain Defeats Sokoto", description: "British conquer Sokoto Caliphate; end of major Islamic state in West Africa", source: "https://en.wikipedia.org/wiki/Sokoto_Caliphate", category: "colonization" as const },
  { year: 1899, label: "France Conquers Sahel", description: "France defeats Rabih az-Zubayr; completes conquest of Chad and Sahel region", source: "https://en.wikipedia.org/wiki/Rabih_az-Zubayr", category: "colonization" as const },
  { year: 1905, label: "Germany Controls Tanganyika", description: "German East Africa formally established; includes Muslim coastal regions", source: "https://en.wikipedia.org/wiki/German_East_Africa", category: "colonization" as const },
  { year: 1912, label: "France Colonizes Morocco", description: "Treaty of Fez establishes French protectorate in Morocco", source: "https://en.wikipedia.org/wiki/French_protectorate_in_Morocco", category: "colonization" as const },
  { year: 1912, label: "Italy Conquers Libya", description: "Ottoman Libya ceded to Italy; resistance continues under Omar Mukhtar until 1931", source: "https://en.wikipedia.org/wiki/Italian_Libya", category: "colonization" as const },
  { year: 1918, label: "Ottoman Partition Begins", description: "Sykes-Picot Agreement divides Ottoman Arab lands between Britain and France", source: "https://en.wikipedia.org/wiki/Sykes%E2%80%93Picot_Agreement", category: "colonization" as const },
  { year: 1924, label: "End of Caliphate", description: "Turkish Republic abolishes Ottoman Caliphate after 1,292 years of succession", source: "https://en.wikipedia.org/wiki/Abolition_of_the_Ottoman_Caliphate", category: "era" as const },
  
  // Independence Era
  { year: 1932, label: "Saudi Arabia Founded", description: "Ibn Saud unifies kingdoms; modern Saudi Arabia established as custodian of the Two Holy Mosques", source: "https://en.wikipedia.org/wiki/Unification_of_Saudi_Arabia", category: "independence" as const },
  { year: 1947, label: "India & Pakistan Independence", description: "British India partitioned; Pakistan founded as Muslim-majority nation; world's largest Muslim migration", source: "https://en.wikipedia.org/wiki/Partition_of_India", category: "independence" as const },
  { year: 1951, label: "Libya Independence", description: "Libya gains independence from Italy/UN trusteeship; King Idris establishes monarchy", source: "https://en.wikipedia.org/wiki/History_of_Libya_under_Idris", category: "independence" as const },
  { year: 1956, label: "Sudan, Tunisia, Morocco Independent", description: "Wave of North African independence from European colonial powers", source: "https://www.sas.upenn.edu/~mercerb/chdecol.html", category: "independence" as const },
  { year: 1957, label: "Malaysia Independence", description: "Federation of Malaya gains independence from Britain; National Mosque later built (1965)", source: "https://en.wikipedia.org/wiki/Hari_Merdeka", category: "independence" as const },
  { year: 1960, label: "African Independence Year", description: "17 African nations gain independence including Senegal, Mali, Nigeria, Chad, and Somalia", source: "https://en.wikipedia.org/wiki/Year_of_Africa", category: "independence" as const },
  { year: 1961, label: "Tanzania Independence", description: "Tanganyika gains independence; unites with Zanzibar (1964) to form Tanzania", source: "https://en.wikipedia.org/wiki/History_of_Tanzania", category: "independence" as const },
  { year: 1962, label: "Algeria Independence", description: "Algeria gains independence after 8-year war; 132 years of French rule end", source: "https://en.wikipedia.org/wiki/Algerian_War", category: "independence" as const },
  { year: 1963, label: "Kenya Independence", description: "Kenya gains independence from Britain; significant Muslim minority along coast", source: "https://en.wikipedia.org/wiki/History_of_Kenya", category: "independence" as const },
  { year: 1971, label: "Bangladesh Founded", description: "East Pakistan becomes Bangladesh; Baitul Mukarram designated as national mosque", source: "https://en.wikipedia.org/wiki/Bangladesh_Liberation_War", category: "independence" as const },
  { year: 1979, label: "Iranian Revolution", description: "Islamic Republic of Iran established; major investment in shrine architecture begins", source: "https://en.wikipedia.org/wiki/Iranian_Revolution", category: "era" as const },
] as const;

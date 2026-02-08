/**
 * Islamic Architectural and Religious Terms Glossary
 * Used for tooltips, the glossary page, and visitor tips references.
 */

export interface GlossaryTerm {
  term: string;
  arabic?: string;
  pronunciation: string;
  definition: string;
  category: "architecture" | "prayer" | "ritual" | "general" | "decoration";
}

export const glossaryTerms: GlossaryTerm[] = [
  // Architecture
  {
    term: "Mihrab",
    arabic: "محراب",
    pronunciation: "mih-RAHB",
    definition: "A semicircular niche in the wall of a mosque that indicates the qibla (direction of Mecca) for prayer.",
    category: "architecture",
  },
  {
    term: "Minbar",
    arabic: "منبر",
    pronunciation: "MIN-bar",
    definition: "The pulpit in a mosque from which the imam delivers the Friday sermon (khutbah).",
    category: "architecture",
  },
  {
    term: "Minaret",
    arabic: "مئذنة",
    pronunciation: "min-uh-RET",
    definition: "A tall tower attached to a mosque from which the muezzin calls Muslims to prayer (adhan).",
    category: "architecture",
  },
  {
    term: "Qibla",
    arabic: "قبلة",
    pronunciation: "KIB-lah",
    definition: "The direction of the Kaaba in Mecca, which Muslims face during prayer.",
    category: "architecture",
  },
  {
    term: "Dome",
    arabic: "قبة",
    pronunciation: "dohm",
    definition: "A hemispherical roof structure common in Islamic architecture, symbolizing the vault of heaven.",
    category: "architecture",
  },
  {
    term: "Iwan",
    arabic: "إيوان",
    pronunciation: "ee-WAHN",
    definition: "A rectangular hall or space with one side entirely open, common in Persian mosque architecture.",
    category: "architecture",
  },
  {
    term: "Sahn",
    arabic: "صحن",
    pronunciation: "sahn",
    definition: "The central courtyard of a mosque, often featuring a fountain for ablution.",
    category: "architecture",
  },
  {
    term: "Hypostyle Hall",
    pronunciation: "HY-poh-style",
    definition: "A large interior space with a roof supported by many columns, typical of early Islamic mosques.",
    category: "architecture",
  },
  {
    term: "Riwaq",
    arabic: "رواق",
    pronunciation: "ree-WAHK",
    definition: "A covered colonnade or arcade surrounding the courtyard of a mosque.",
    category: "architecture",
  },
  {
    term: "Musalla",
    arabic: "مصلى",
    pronunciation: "moo-SAL-lah",
    definition: "An open-air prayer area or a simple prayer room without the full features of a mosque.",
    category: "architecture",
  },

  // Decoration
  {
    term: "Arabesque",
    pronunciation: "ar-uh-BESK",
    definition: "Intricate geometric and vegetal patterns used in Islamic art and architecture.",
    category: "decoration",
  },
  {
    term: "Calligraphy",
    arabic: "خط",
    pronunciation: "kuh-LIG-ruh-fee",
    definition: "Artistic handwriting, especially Quranic verses, used as decoration in mosques.",
    category: "decoration",
  },
  {
    term: "Muqarnas",
    arabic: "مقرنص",
    pronunciation: "moo-KAR-nas",
    definition: "Honeycomb-like decorative vaulting used in Islamic architecture, often in domes and arches.",
    category: "decoration",
  },
  {
    term: "Zellige",
    pronunciation: "zel-LEEZH",
    definition: "Moroccan mosaic tilework made of individually chiseled geometric tiles set in plaster.",
    category: "decoration",
  },
  {
    term: "Ablaq",
    pronunciation: "AB-lak",
    definition: "A decorative technique using alternating light and dark stone bands, common in Mamluk architecture.",
    category: "decoration",
  },

  // Prayer
  {
    term: "Salah",
    arabic: "صلاة",
    pronunciation: "sah-LAH",
    definition: "The Islamic ritual prayer performed five times daily, one of the Five Pillars of Islam.",
    category: "prayer",
  },
  {
    term: "Fajr",
    arabic: "فجر",
    pronunciation: "FAJ-er",
    definition: "The pre-dawn prayer, performed before sunrise.",
    category: "prayer",
  },
  {
    term: "Dhuhr",
    arabic: "ظهر",
    pronunciation: "DHOO-her",
    definition: "The midday prayer, performed after the sun passes its zenith.",
    category: "prayer",
  },
  {
    term: "Asr",
    arabic: "عصر",
    pronunciation: "AH-ser",
    definition: "The afternoon prayer, performed in the late afternoon.",
    category: "prayer",
  },
  {
    term: "Maghrib",
    arabic: "مغرب",
    pronunciation: "MAGH-rib",
    definition: "The sunset prayer, performed just after the sun sets.",
    category: "prayer",
  },
  {
    term: "Isha",
    arabic: "عشاء",
    pronunciation: "ee-SHAH",
    definition: "The night prayer, performed after twilight has disappeared.",
    category: "prayer",
  },
  {
    term: "Jumu'ah",
    arabic: "جمعة",
    pronunciation: "joo-MOO-ah",
    definition: "The Friday congregational prayer, obligatory for Muslim men and highly recommended for women.",
    category: "prayer",
  },
  {
    term: "Adhan",
    arabic: "أذان",
    pronunciation: "ah-THAHN",
    definition: "The Islamic call to prayer announced by the muezzin from the minaret.",
    category: "prayer",
  },
  {
    term: "Iqamah",
    arabic: "إقامة",
    pronunciation: "ee-KAH-mah",
    definition: "The second call to prayer recited immediately before the congregational prayer begins.",
    category: "prayer",
  },
  {
    term: "Imam",
    arabic: "إمام",
    pronunciation: "ee-MAHM",
    definition: "The person who leads the congregational prayer, standing in front of the worshippers.",
    category: "prayer",
  },
  {
    term: "Khutbah",
    arabic: "خطبة",
    pronunciation: "KHUT-bah",
    definition: "The sermon delivered by the imam during the Friday congregational prayer.",
    category: "prayer",
  },

  // Ritual
  {
    term: "Wudu",
    arabic: "وضوء",
    pronunciation: "woo-DOO",
    definition: "The ritual washing of hands, face, arms, head, and feet before prayer (ablution).",
    category: "ritual",
  },
  {
    term: "Ghusl",
    arabic: "غسل",
    pronunciation: "GHOO-sel",
    definition: "The full-body ritual purification required after certain states of impurity.",
    category: "ritual",
  },
  {
    term: "Tayammum",
    arabic: "تيمم",
    pronunciation: "tay-YAM-moom",
    definition: "Dry ablution using clean earth or sand when water is unavailable.",
    category: "ritual",
  },
  {
    term: "Wudu Khana",
    pronunciation: "woo-DOO KHAH-nah",
    definition: "The ablution area in a mosque where worshippers perform wudu before prayer.",
    category: "ritual",
  },
  {
    term: "Sujud",
    arabic: "سجود",
    pronunciation: "soo-JOOD",
    definition: "The prostration position in prayer where the forehead touches the ground.",
    category: "ritual",
  },
  {
    term: "Ruku",
    arabic: "ركوع",
    pronunciation: "roo-KOO",
    definition: "The bowing position in prayer with hands on knees.",
    category: "ritual",
  },

  // General
  {
    term: "Masjid",
    arabic: "مسجد",
    pronunciation: "MAS-jid",
    definition: "Arabic word for mosque, literally meaning 'place of prostration.'",
    category: "general",
  },
  {
    term: "Jami",
    arabic: "جامع",
    pronunciation: "JAH-mee",
    definition: "A congregational mosque where Friday prayers are held (also spelled Jama Masjid).",
    category: "general",
  },
  {
    term: "Haram",
    arabic: "حرم",
    pronunciation: "hah-RAHM",
    definition: "A sacred sanctuary; refers to the holy mosques in Mecca and Medina.",
    category: "general",
  },
  {
    term: "Kaaba",
    arabic: "كعبة",
    pronunciation: "KAH-bah",
    definition: "The cube-shaped building in Mecca that is the most sacred site in Islam.",
    category: "general",
  },
  {
    term: "Qur'an",
    arabic: "قرآن",
    pronunciation: "koor-AHN",
    definition: "The holy book of Islam, believed to be the word of God revealed to Prophet Muhammad.",
    category: "general",
  },
  {
    term: "Hadith",
    arabic: "حديث",
    pronunciation: "hah-DEETH",
    definition: "Recorded sayings and actions of Prophet Muhammad, used as guidance alongside the Qur'an.",
    category: "general",
  },
  {
    term: "Ummah",
    arabic: "أمة",
    pronunciation: "OOM-mah",
    definition: "The global community of Muslims united by faith.",
    category: "general",
  },
  {
    term: "Hajj",
    arabic: "حج",
    pronunciation: "hahj",
    definition: "The annual Islamic pilgrimage to Mecca, one of the Five Pillars of Islam.",
    category: "general",
  },
  {
    term: "Umrah",
    arabic: "عمرة",
    pronunciation: "OOM-rah",
    definition: "The lesser pilgrimage to Mecca that can be performed at any time of year.",
    category: "general",
  },
  {
    term: "Zakat",
    arabic: "زكاة",
    pronunciation: "zah-KAHT",
    definition: "Obligatory almsgiving, one of the Five Pillars of Islam.",
    category: "general",
  },
  {
    term: "Sawm",
    arabic: "صوم",
    pronunciation: "sowm",
    definition: "Fasting, especially during the month of Ramadan.",
    category: "general",
  },
  {
    term: "Shahada",
    arabic: "شهادة",
    pronunciation: "shah-HAH-dah",
    definition: "The Islamic declaration of faith: 'There is no god but God, and Muhammad is the Messenger of God.'",
    category: "general",
  },
];

/**
 * Get a glossary term by its name (case-insensitive)
 */
export function getGlossaryTerm(termName: string): GlossaryTerm | undefined {
  const normalized = termName.toLowerCase().trim();
  return glossaryTerms.find((t) => t.term.toLowerCase() === normalized);
}

/**
 * Get all terms in a category
 */
export function getTermsByCategory(category: GlossaryTerm["category"]): GlossaryTerm[] {
  return glossaryTerms.filter((t) => t.category === category);
}

/**
 * Get all unique categories
 */
export function getGlossaryCategories(): GlossaryTerm["category"][] {
  return [...new Set(glossaryTerms.map((t) => t.category))];
}

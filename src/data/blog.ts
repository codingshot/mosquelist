/**
 * Blog articles: fact-checked, SEO-optimized content from marketing materials.
 * Images use mosque imagery (local or licensed). No internal data or names exposed.
 */

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  /** Hero image URL (e.g. from mosque imagery) */
  imageUrl: string;
  imageAlt: string;
  /** Slug of related posts to show at bottom */
  relatedSlugs: string[];
  /** Paragraphs of body content (fact-checked, no raw data) */
  paragraphs: string[];
  /** Featured mosque IDs to embed in the article */
  featuredMosqueIds?: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "three-holiest-sites-islam",
    title: "Plan Your Spiritual Journey: The Three Holiest Sites in Islam",
    description: "A fact-checked guide to the three holiest sites in Islam—Mecca, Medina, and Jerusalem—and how to plan a meaningful visit with respect and preparation.",
    imageUrl: "/images/mosques/masjid-al-haram.jpg",
    imageAlt: "The Grand Mosque in Mecca surrounding the Kaaba",
    relatedSlugs: ["best-times-visit-mosques", "mosque-visitor-etiquette", "how-to-plan-mosque-bucket-list"],
    featuredMosqueIds: ["masjid-al-haram", "masjid-an-nabawi", "al-aqsa"],
    paragraphs: [
      "The three holiest sites in Islam are Masjid al-Haram in Mecca, Al-Masjid an-Nabawi in Medina, and Al-Aqsa Mosque in Jerusalem. Each holds profound spiritual and historical significance for Muslims worldwide.",
      "Mecca is the birthplace of Islam and the direction (qibla) toward which Muslims pray five times a day. The Kaaba, housed within Masjid al-Haram, is believed to have been built by Prophet Ibrahim (Abraham) and his son Ismail. Hajj, the pilgrimage to Mecca, is one of the Five Pillars of Islam and is required at least once in a lifetime for those who are able.",
      "Medina is where the Prophet Muhammad migrated in 622 CE (the Hijrah) and where he is buried. Al-Masjid an-Nabawi, the Prophet's Mosque, is the second holiest site. Many pilgrims combine a visit to Mecca with Medina (often visiting Medina first). Non-Muslims are not permitted to enter the haram boundaries of Mecca and Medina.",
      "Jerusalem's Al-Aqsa Mosque compound (Haram al-Sharif) is the third holiest site and is associated with the Prophet's Night Journey (Isra and Mi'raj). The compound includes the Dome of the Rock and the silver-domed Al-Aqsa mosque. Access and visiting hours can vary; check current guidelines before planning.",
      "When planning a spiritual journey to these sites, research visa requirements, dress codes, and local customs. Book travel and accommodation well in advance for Hajj and Ramadan. Approach the experience with humility and preparation so the visit can be both meaningful and respectful.",
    ],
  },
  {
    slug: "best-times-visit-mosques",
    title: "Best Times to Visit Mosques: Ramadan, Hajj Season and Beyond",
    description: "When to visit mosques around the world for spiritual atmosphere, milder weather, and fewer crowds. Fact-checked travel timing advice.",
    imageUrl: "/images/mosques/blue-mosque.jpg",
    imageAlt: "Historic mosque with domes and minarets at dusk",
    relatedSlugs: ["three-holiest-sites-islam", "what-to-pack-mosque-visits", "popular-islamic-heritage-routes"],
    paragraphs: [
      "The best time to visit mosques depends on your goals: spiritual intensity, weather, or quieter crowds. Ramadan and the Hajj season draw millions to the Arabian Peninsula; other times of year suit different regions.",
      "Ramadan is the ninth month of the Islamic calendar, when Muslims fast from dawn to sunset. Mosques worldwide host special night prayers (Tarawih) and iftar meals. Visiting during Ramadan offers a unique atmosphere but expect larger crowds and different opening hours. Non-Muslims should avoid eating or drinking in public in fasting hours in Muslim-majority countries.",
      "Hajj takes place during Dhu al-Hijjah; exact dates shift each year. Umrah (the lesser pilgrimage) can be performed year-round. If you are not performing Hajj or Umrah, avoid traveling to Mecca and Medina during Hajj season due to congestion and restricted access.",
      "For general mosque visits elsewhere, spring (March–May) and autumn (September–November) often offer milder weather in the Middle East, Turkey, and North Africa. Summer can be very hot. Friday midday prayer (Jumu'ah) is the busiest time; visit outside the five daily prayer times for a calmer experience. Many mosques close to tourists shortly before and during prayers.",
      "Research each mosque's visitor hours and any seasonal closures. Some iconic mosques have specific tourist slots. Planning ahead ensures you can enjoy the architecture and spiritual ambiance respectfully.",
    ],
  },
  {
    slug: "mosque-visitor-etiquette",
    title: "Mosque Visitor Etiquette: Dress Code, Photography and Respect",
    description: "Fact-checked guide to mosque visitor etiquette: modest dress, when photography is allowed, and how to behave respectfully in sacred spaces.",
    imageUrl: "/images/mosques/putra-mosque.jpg",
    imageAlt: "Grand mosque with domes and reflective water",
    relatedSlugs: ["three-holiest-sites-islam", "what-to-pack-mosque-visits", "best-times-visit-mosques"],
    paragraphs: [
      "Visiting mosques as a Muslim or a respectful tourist requires following local dress codes and behavioral norms. Etiquette varies by country and by mosque; when in doubt, err on the side of modesty and discretion.",
      "Dress code is non-negotiable: long sleeves, trousers or long skirts (ankle-length), and covered shoulders. Women are typically expected to cover their hair with a headscarf in prayer areas. Many mosques provide abayas, robes, or scarves at the entrance. Remove shoes before entering the prayer hall—use provided shelves or carry a bag for them.",
      "Be quiet and respectful. Do not walk in front of someone who is praying. Avoid touching the Qur'an or religious texts without ablution. Turn off phone ringers. Some mosques restrict non-Muslim visitors to certain areas or hours; Mecca, Medina, and parts of Al-Aqsa are not open to non-Muslims.",
      "Photography rules vary. Many mosques allow photos of the architecture but prohibit photographing worshippers without permission. Flash is usually discouraged. Some areas (e.g. women's sections, certain shrines) prohibit photography entirely. Tourism-friendly mosques often permit photos in designated areas—always ask if unsure.",
      "By dressing modestly, moving quietly, and following posted rules, you help preserve the sanctity of these spaces and ensure they remain welcoming for worship and reflection.",
    ],
  },
  {
    slug: "islamic-architecture-ages",
    title: "Islamic Architecture Through the Ages: From Umayyad to Modern",
    description: "A concise overview of Islamic mosque architecture: Umayyad, Ottoman, Mughal, and contemporary styles. Fact-checked and illustrated with iconic examples.",
    imageUrl: "/images/mosques/badshahi-mosque.jpg",
    imageAlt: "Historic red sandstone mosque with domes and minarets",
    relatedSlugs: ["popular-islamic-heritage-routes", "three-holiest-sites-islam", "ottoman-masterpieces"],
    featuredMosqueIds: ["umayyad-mosque", "blue-mosque", "badshahi-mosque", "sheikh-zayed"],
    paragraphs: [
      "Islamic mosque architecture has evolved over more than a millennium, blending local building traditions with shared elements: domes, minarets, courtyards, and geometric or calligraphic decoration.",
      "Early Islamic architecture drew on Byzantine and Persian traditions. The Umayyad period (7th–8th century) produced the Dome of the Rock in Jerusalem and the Great Mosque of Damascus, with mosaics, arches, and central domes. The hypostyle hall—a large prayer space with many columns—became a common layout.",
      "Ottoman architecture, especially under Mimar Sinan in the 16th century, refined the central-dome mosque. The Blue Mosque and Süleymaniye in Istanbul exemplify this: massive central domes, semi-domes, and tall minarets. Later Ottoman and Turkish buildings continued this vocabulary into the modern era.",
      "Mughal architecture in South Asia combined Persian, Indian, and Islamic elements. Red sandstone and white marble, iwan entrances, and chattris appear in masterpieces such as the Badshahi Mosque and the Taj Mahal complex. Indo-Islamic style spread across the subcontinent.",
      "Today, new mosques range from traditional revival to contemporary designs. Many use modern materials and engineering while retaining domes, minarets, and calligraphy. Whether historic or new, mosque architecture continues to serve worship and community while reflecting local and global Islamic identity.",
    ],
  },
  {
    slug: "how-to-plan-mosque-bucket-list",
    title: "How to Plan a Mosque Bucket List and Track Your Visits",
    description: "Practical steps to create a mosque bucket list: choosing sites, prioritizing holy places and landmarks, and tracking your spiritual journey.",
    imageUrl: "/images/mosques/grand-jamia.jpg",
    imageAlt: "Grand mosque with Ottoman-style domes",
    relatedSlugs: ["three-holiest-sites-islam", "popular-islamic-heritage-routes", "what-to-pack-mosque-visits"],
    paragraphs: [
      "A mosque bucket list helps you set intentions for which sacred and historic sites you want to visit in your lifetime. Planning ahead makes the journey more meaningful and logistically smoother.",
      "Start by listing the places that matter most to you spiritually or culturally. The three holiest sites—Mecca, Medina, and Jerusalem—are on many Muslims' lists. Beyond these, consider iconic mosques by region: Turkey, Morocco, Egypt, the Gulf, South Asia, and Southeast Asia each have world-famous landmarks. Balance holy sites with architectural and historical sites that inspire you.",
      "Prioritize by feasibility: visa requirements, cost, and time. Hajj and Umrah require specific preparation and often advance booking. Other mosques may be easier to include on general travel. Group nearby destinations to save time and money—for example, combining Turkey with a Gulf or Egypt trip.",
      "Track your list in a way that works for you: a simple list, a map, or an app where you can mark visited and unvisited places. Recording the date and a short note for each visit builds a personal record of your spiritual journey.",
      "Revisit your list as your circumstances and interests change. New mosques open; others become easier to reach. The goal is intention and progress, not perfection. Taking the first step—whether to a local mosque or a distant landmark—matters more than checking every box.",
    ],
  },
  {
    slug: "what-to-pack-mosque-visits",
    title: "What to Pack for Mosque Visits: A Practical Guide",
    description: "Essential items to pack when visiting mosques: modest clothing, slip-on shoes, and practical tips for comfort and respect.",
    imageUrl: "/images/mosques/great-mosque-of-djenne.jpg",
    imageAlt: "Historic earthen mosque with distinctive pillars",
    relatedSlugs: ["mosque-visitor-etiquette", "best-times-visit-mosques", "how-to-plan-mosque-bucket-list"],
    paragraphs: [
      "Packing for mosque visits is mostly about modesty, comfort, and convenience. A few key items will help you dress appropriately and move easily in and out of prayer spaces.",
      "Modest clothing is essential: long sleeves, trousers or long skirts (ankle-length), and a headscarf for women. Choose lightweight, breathable fabrics in hot climates. Neutral or dark colors are often preferred. Avoid tight or transparent clothing. Many mosques provide abayas or robes at the entrance, but having your own ensures you are always prepared.",
      "Slip-on shoes are ideal because you will remove them before entering the prayer area. Easy to take off and put back on, they save time at busy entrances. A small bag for carrying your shoes inside (where allowed) can be useful.",
      "Bring a lightweight bag for belongings during prayer if you will be leaving shoes and bags at the entrance. Sunscreen, a reusable water bottle, and a copy of prayer times (or a prayer-time app) are practical. Check visa requirements and any health advisories for your destination.",
      "Finally, bring an open and respectful attitude. Preparation shows respect for the space and the worshippers who use it daily. With the right gear and mindset, your visit can be both comfortable and meaningful.",
    ],
  },
  {
    slug: "popular-islamic-heritage-routes",
    title: "Popular Islamic Heritage Routes: Where to Travel Next",
    description: "Classic travel routes for mosque and Islamic heritage: Turkey, Morocco, the Gulf, South Asia, and Southeast Asia. Fact-checked overview.",
    imageUrl: "/images/mosques/hagia-sophia-istanbul.jpg",
    imageAlt: "Historic building with dome and minarets",
    relatedSlugs: ["islamic-architecture-ages", "best-times-visit-mosques", "how-to-plan-mosque-bucket-list"],
    featuredMosqueIds: ["blue-mosque", "hagia-sophia-istanbul", "hassan-ii", "sheikh-zayed", "faisal-mosque", "istiqlal-mosque"],
    paragraphs: [
      "Travelers interested in Islamic heritage often follow well-established routes that combine several iconic mosques and historic cities. These corridors offer rich architecture, history, and spiritual sites in a single trip.",
      "Turkey is a top destination: Istanbul's Blue Mosque, Süleymaniye, and Hagia Sophia (now a mosque again) sit alongside bazaars and Ottoman palaces. Further east, Konya and other cities offer Seljuk and Sufi heritage. Visa-free or e-visa access for many nationalities makes Turkey accessible.",
      "Morocco and Egypt anchor North Africa. Casablanca's Hassan II Mosque and the historic medinas of Fes and Marrakesh draw millions. In Egypt, Al-Azhar in Cairo and the Islamic Cultural Center in the new capital represent centuries of scholarship and modern scale. Both countries have strong tourism infrastructure.",
      "The Gulf offers some of the world's largest and most visitor-friendly mosques: Sheikh Zayed in Abu Dhabi, the Grand Mosque in Kuwait, and others in Qatar, Bahrain, and Oman. Air links make multi-country Gulf trips feasible. Dress codes and visitor hours are generally clear and well signposted.",
      "South and Southeast Asia round out the map. Pakistan's Faisal and Badshahi mosques, Indonesia's Istiqlal, Malaysia's Putra Mosque, and Singapore's Sultan Mosque are among many highlights. Combine with cultural and natural sights for a full journey. Research visa and safety information before booking.",
    ],
  },
  {
    slug: "ottoman-masterpieces",
    title: "Ottoman Masterpieces: Turkey's Most Beautiful Mosques",
    description: "Explore the architectural wonders of the Ottoman Empire—from the Blue Mosque to Süleymaniye—and plan your visit to Turkey's iconic mosques.",
    imageUrl: "/images/mosques/blue-mosque.jpg",
    imageAlt: "Blue Mosque in Istanbul at sunset",
    relatedSlugs: ["islamic-architecture-ages", "popular-islamic-heritage-routes", "biggest-mosques-world"],
    featuredMosqueIds: ["blue-mosque", "suleymaniye-mosque", "selimiye-mosque", "hagia-sophia-istanbul"],
    paragraphs: [
      "The Ottoman Empire produced some of the world's most stunning mosque architecture, with Istanbul as the crown jewel. These masterpieces combine massive domes, slender minarets, and intricate Iznik tilework.",
      "The Blue Mosque (Sultan Ahmed Mosque), built between 1609-1616, is famous for its six minarets and over 20,000 hand-painted blue tiles. It remains an active place of worship while welcoming millions of visitors annually.",
      "Süleymaniye Mosque, designed by the legendary architect Mimar Sinan for Sultan Suleiman the Magnificent, represents the golden age of Ottoman architecture. Its harmonious proportions and panoramic views over the Golden Horn make it unforgettable.",
      "The Selimiye Mosque in Edirne was Sinan's self-proclaimed masterpiece. Its dome, measuring 31.3 meters in diameter, surpasses even that of the Hagia Sophia. The four minarets, each with three balconies, frame the monument perfectly.",
      "Hagia Sophia, originally a Byzantine cathedral, was converted to a mosque after 1453 and remains one of Istanbul's most visited sites. Its massive dome, ancient mosaics, and Islamic calligraphy create a unique blend of civilizations.",
    ],
  },
  {
    slug: "biggest-mosques-world",
    title: "The World's Biggest Mosques: A Journey Through Giants",
    description: "Discover the largest mosques on Earth by capacity—from Masjid al-Haram's millions to modern megastructures in Algeria and Indonesia.",
    imageUrl: "/images/mosques/masjid-al-haram.jpg",
    imageAlt: "Aerial view of Masjid al-Haram in Mecca",
    relatedSlugs: ["three-holiest-sites-islam", "ottoman-masterpieces", "modern-mosque-architecture"],
    featuredMosqueIds: ["masjid-al-haram", "masjid-an-nabawi", "djamaa-el-djazair", "istiqlal-mosque", "hassan-ii", "faisal-mosque"],
    paragraphs: [
      "The world's largest mosques are engineering marvels that accommodate millions of worshippers. From ancient holy sites to modern architectural achievements, these structures showcase Islamic civilization's scale and ambition.",
      "Masjid al-Haram in Mecca holds the record, with capacity exceeding 4 million worshippers during Hajj after continuous expansions. Al-Masjid an-Nabawi in Medina can accommodate 1.5 million, with its distinctive green dome and retractable umbrella canopies.",
      "Djamaa el Djazaïr in Algeria, completed in 2019, is the largest mosque in Africa. Its 265-meter minaret is the world's tallest, and the main prayer hall holds 120,000 worshippers. The mosque includes a Quranic school, library, and museum.",
      "Istiqlal Mosque in Jakarta is Southeast Asia's largest, holding 200,000 worshippers. Its name means 'Independence' in Arabic, commemorating Indonesian independence. The mosque faces Jakarta Cathedral, symbolizing religious harmony.",
      "Other notable giants include Hassan II Mosque in Casablanca with its retractable roof and ocean-side location, and Faisal Mosque in Islamabad with its distinctive tent-shaped design by Turkish architect Vedat Dalokay.",
    ],
  },
  {
    slug: "modern-mosque-architecture",
    title: "Modern Mosque Architecture: 21st Century Masterpieces",
    description: "From the Sheikh Zayed Grand Mosque to the Great Mosque of Central Java—explore how contemporary architects are reimagining Islamic sacred spaces.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Sheikh_Zayed_Grand_Mosque_Picture.jpg",
    imageAlt: "Sheikh Zayed Grand Mosque with white domes and reflection pool",
    relatedSlugs: ["islamic-architecture-ages", "biggest-mosques-world", "tourist-friendly-mosques"],
    featuredMosqueIds: ["sheikh-zayed", "djamaa-el-djazair", "camlica-mosque", "al-jabbar-grand-mosque"],
    paragraphs: [
      "The 21st century has witnessed a renaissance in mosque architecture, with countries investing billions in landmark religious buildings that blend tradition with cutting-edge design.",
      "The Sheikh Zayed Grand Mosque in Abu Dhabi, completed in 2007, exemplifies this trend. Its 82 domes, 1,000+ columns, world's largest hand-knotted carpet, and 24-carat gold chandeliers create an unforgettable experience. The mosque welcomes visitors of all faiths.",
      "Turkey's Çamlıca Mosque, opened in 2019, is the country's largest and visible from across Istanbul. Its design pays homage to classical Ottoman architecture while incorporating modern engineering and sustainability features.",
      "Indonesia's Al Jabbar Grand Mosque in Bandung showcases a unique floating-dome design inspired by lotus flowers and local Sundanese culture. It represents the country's approach to distinctive regional mosque architecture.",
      "These modern mosques often include visitor centers, libraries, and cultural spaces, serving as community hubs beyond prayer. They demonstrate that Islamic architecture continues to evolve while honoring centuries of tradition.",
    ],
  },
  {
    slug: "tourist-friendly-mosques",
    title: "Tourist-Friendly Mosques: Where Non-Muslims Are Welcome",
    description: "A guide to mosques around the world that welcome visitors of all faiths—with tips on visiting hours, dress codes, and what to expect.",
    imageUrl: "/images/mosques/putra-mosque.jpg",
    imageAlt: "Putra Mosque with pink dome and lakeside setting",
    relatedSlugs: ["mosque-visitor-etiquette", "what-to-pack-mosque-visits", "popular-islamic-heritage-routes"],
    featuredMosqueIds: ["sheikh-zayed", "hassan-ii", "blue-mosque", "putra-mosque", "sultan-qaboos-grand-mosque", "national-mosque-malaysia"],
    paragraphs: [
      "Many of the world's most beautiful mosques actively welcome visitors of all faiths, offering guided tours, visitor centers, and designated tourist hours. These mosques serve as bridges of understanding between cultures.",
      "The Sheikh Zayed Grand Mosque in Abu Dhabi is perhaps the most visitor-friendly, with free tours available in multiple languages. Abayas and headscarves are provided for women. Photography is encouraged in designated areas.",
      "Hassan II Mosque in Casablanca is one of the few mosques in Morocco open to non-Muslims. Guided tours run several times daily, revealing the retractable roof, intricate zellige tilework, and the world's tallest religious minaret.",
      "In Malaysia, both the National Mosque (Masjid Negara) in Kuala Lumpur and Putra Mosque in Putrajaya welcome tourists outside prayer times. Robes are provided at the entrance. The pink-domed Putra Mosque offers stunning lakeside photography opportunities.",
      "Sultan Qaboos Grand Mosque in Muscat is known for its welcoming atmosphere, with one of the world's largest hand-woven carpets and Swarovski crystal chandelier. Morning tours are available Saturday through Thursday.",
    ],
  },
  {
    slug: "mughal-mosque-architecture",
    title: "Mughal Mosque Architecture: South Asia's Islamic Heritage",
    description: "Explore the magnificent Mughal mosques of Pakistan and India—from the Badshahi Mosque to the Wazir Khan Mosque and beyond.",
    imageUrl: "/images/mosques/badshahi-mosque.jpg",
    imageAlt: "Badshahi Mosque with red sandstone and white marble domes",
    relatedSlugs: ["islamic-architecture-ages", "biggest-mosques-world", "ottoman-masterpieces"],
    featuredMosqueIds: ["badshahi-mosque", "jama-masjid-delhi", "wazir-khan-mosque", "faisal-mosque"],
    paragraphs: [
      "The Mughal Empire (1526-1857) created some of the world's most magnificent mosque architecture, blending Persian, Indian, and Islamic elements into a distinctive style that still defines South Asia's Islamic heritage.",
      "Badshahi Mosque in Lahore, built by Emperor Aurangzeb in 1673, exemplifies Mughal grandeur. Its red sandstone facade, white marble domes, and massive courtyard (capable of holding 100,000 worshippers) make it one of the world's most impressive mosques.",
      "Jama Masjid in Delhi, commissioned by Shah Jahan, is India's largest mosque. Completed in 1656, it features three great gates, four towers, and two 40-meter minarets. The courtyard can accommodate 25,000 worshippers.",
      "The Wazir Khan Mosque in Lahore (1634) is celebrated for its exceptional faience tile work and frescoes. Often called the 'Sistine Chapel of Islamic art,' its intricate calligraphy and floral motifs represent the pinnacle of Mughal decorative arts.",
      "Modern Pakistan continues this tradition with Faisal Mosque in Islamabad. Though contemporary in design, its tent-shaped roof and minarets echo traditional forms while creating something entirely new.",
    ],
  },
  {
    slug: "unesco-mosque-sites",
    title: "UNESCO World Heritage Mosques: Sites of Global Significance",
    description: "Discover mosques recognized by UNESCO for their outstanding universal value—from ancient Kairouan to the historic medinas of Fes and Marrakesh.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Kairouan_Mosque_Courtyard.jpg",
    imageAlt: "Great Mosque of Kairouan courtyard",
    relatedSlugs: ["islamic-architecture-ages", "popular-islamic-heritage-routes", "three-holiest-sites-islam"],
    featuredMosqueIds: ["great-mosque-of-kairouan", "al-qarawiyyin", "great-mosque-of-kilwa", "selimiye-mosque"],
    paragraphs: [
      "UNESCO has recognized numerous mosques and Islamic sites for their outstanding universal value. These designations help protect irreplaceable heritage while drawing attention to Islam's contributions to world civilization.",
      "The Great Mosque of Kairouan in Tunisia, founded in 670 CE, is one of the oldest continuously functioning mosques in the world. Its massive minaret and vast prayer hall influenced mosque architecture across the Maghreb and Andalusia.",
      "Al-Qarawiyyin Mosque in Fes, Morocco, houses what many consider the world's oldest continuously operating university, founded in 859 CE. The complex includes a library with priceless manuscripts and expanded over centuries into a vast religious and educational center.",
      "The Great Mosque of Kilwa Kisiwani in Tanzania represents the zenith of Swahili coast architecture. Built in the 11th-15th centuries, its coral stone construction and domed chambers influenced coastal East African mosque design.",
      "The Selimiye Mosque in Edirne, Turkey, was inscribed for its architectural perfection—master architect Mimar Sinan's self-proclaimed masterwork. These UNESCO sites remind us that Islamic architecture belongs to all humanity.",
    ],
  },
];

const slugToPost = new Map(blogPosts.map((p) => [p.slug, p]));

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return slugToPost.get(slug);
}

export function getRelatedPosts(post: BlogPost): BlogPost[] {
  return post.relatedSlugs
    .map((s) => slugToPost.get(s))
    .filter((p): p is BlogPost => p != null);
}

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
    relatedSlugs: ["popular-islamic-heritage-routes", "three-holiest-sites-islam", "ottoman-mosque-architecture", "evolution-mosque-architecture"],
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
    relatedSlugs: ["ottoman-mosque-architecture", "islamic-architecture-ages", "popular-islamic-heritage-routes", "biggest-mosques-world"],
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
    relatedSlugs: ["three-holiest-sites-islam", "ottoman-mosque-architecture", "modern-mosque-architecture", "evolution-mosque-architecture"],
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
    relatedSlugs: ["islamic-architecture-ages", "biggest-mosques-world", "ottoman-mosque-architecture", "persian-mosque-architecture"],
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
  // === ARCHITECTURAL STYLE DEEP DIVES ===
  {
    slug: "ottoman-mosque-architecture",
    title: "Ottoman Mosque Architecture: The Legacy of Mimar Sinan",
    description: "Explore the golden age of Ottoman architecture—from Sinan's innovations to the iconic Blue Mosque. A comprehensive guide to central domes, pencil minarets, and Iznik tilework.",
    imageUrl: "/images/mosques/blue-mosque.jpg",
    imageAlt: "The Blue Mosque in Istanbul with its six minarets and cascading domes",
    relatedSlugs: ["persian-mosque-architecture", "islamic-architecture-ages", "mughal-mosque-architecture"],
    featuredMosqueIds: ["blue-mosque", "suleymaniye-mosque", "selimiye-mosque", "rustem-pasha-mosque", "yeni-cami"],
    paragraphs: [
      "Ottoman mosque architecture represents one of the most refined and recognizable traditions in Islamic building. Developed over six centuries (1299–1922), this style evolved from early Seljuk influences into a distinctive vocabulary of central domes, pencil-shaped minarets, and cascading semi-domes that defined the skylines of Istanbul, the Balkans, and the Levant.",
      "**The Master Architect: Mimar Sinan (1489–1588)**\n\nNo figure looms larger in Ottoman architecture than Koca Mimar Sinan, chief royal architect for 50 years under three sultans. Born to a Christian family in Anatolia, Sinan was recruited through the devşirme system and trained as a military engineer. His background in engineering proved crucial—he developed innovative structural solutions that allowed ever-larger domes to span vast prayer halls flooded with light.",
      "Sinan categorized his own works in three phases: the Şehzade Mosque (1548) as his 'apprentice work' (*çıraklık*), the Süleymaniye Mosque (1557) as his 'journeyman work' (*kalfalık*), and the Selimiye Mosque in Edirne (1575) as his 'masterwork' (*ustalık*). The Selimiye's dome—31.3 meters in diameter—surpassed even the Hagia Sophia, achieving his lifelong ambition at age 85.",
      "**Key Architectural Elements**\n\n• **Central Dome**: The defining feature, supported by semi-domes and buttresses that create a pyramidal silhouette. Ottoman engineers perfected the pendentive transition from square base to circular dome.\n• **Pencil Minarets**: Slender, fluted minarets with conical caps became the Ottoman signature, often in pairs or groups of four or six.\n• **Iznik Tilework**: Polychrome ceramic tiles featuring tulips, carnations, and arabesque patterns in cobalt blue, turquoise, and tomato red.\n• **Şadırvan**: Ornate ablution fountains in courtyards, often domed structures themselves.\n• **Külliye Complex**: Grand mosques were built as integrated complexes with madrasas, hospitals, kitchens, and baths.",
      "**Funding and Patronage**\n\nOttoman imperial mosques were funded through the *waqf* (charitable endowment) system. Sultans, viziers, and royal women commissioned mosques as acts of piety and political legitimacy. The Süleymaniye complex cost an estimated 59 million akçe and employed 3,523 workers. Revenue from attached bazaars, baths, and shops funded ongoing maintenance—a self-sustaining model that kept mosques active for centuries.",
      "**Evolution and Legacy**\n\nEarly Ottoman mosques (14th–15th century) in Bursa and Edirne experimented with the 'reverse-T' plan before the central-dome type emerged. After 1453, the Hagia Sophia became the reference point—Ottoman architects both competed with and learned from its Byzantine engineering. The Blue Mosque (1616), with its six minarets and 20,000 tiles, represents the mature Ottoman style's decorative peak.",
      "Today, Ottoman architecture influences mosque design globally. Turkey's 2019 Çamlıca Mosque—the country's largest—consciously references classical Ottoman forms while using modern materials. The style's emphasis on light, proportion, and community space continues to inspire contemporary architects.",
    ],
  },
  {
    slug: "persian-mosque-architecture",
    title: "Persian Mosque Architecture: Iwans, Tilework, and Safavid Splendor",
    description: "Discover the four-iwan plan, haft-rangi tilework, and muqarnas domes that define Persian mosque architecture from Isfahan to Samarkand.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Isfahan_Royal_Mosque.JPG",
    imageAlt: "The Shah Mosque in Isfahan with blue tile dome and twin minarets",
    relatedSlugs: ["ottoman-mosque-architecture", "mughal-mosque-architecture", "islamic-architecture-ages"],
    featuredMosqueIds: ["imam-reza-shrine", "bibi-khanum-mosque", "shah-i-zinda", "poi-kalyan-mosque", "kalyan-mosque"],
    paragraphs: [
      "Persian mosque architecture, spanning from the 7th century to the present, developed distinctive features that influenced building traditions from Central Asia to India. Characterized by the four-iwan plan, elaborate tilework, and muqarnas (stalactite) vaulting, Persian mosques are among the most visually stunning in the Islamic world.",
      "**The Four-Iwan Plan**\n\nThe *iwan*—a vaulted hall open on one side—became the signature element of Persian mosques. Typically, four iwans face a central courtyard, with the largest *iwan* oriented toward Mecca. This plan, adapted from pre-Islamic Sassanid palace architecture, creates dramatic portals that frame the sky and channel views toward the prayer hall. The Jameh Mosque of Isfahan preserves iwans from the 11th–12th centuries that demonstrate this evolution.",
      "**Tilework: From Mosaic to Haft-Rangi**\n\nPersian tilework underwent continuous refinement. Early mosques used carved brick and stucco. By the Ilkhanid period (13th–14th century), *mosaic faience* appeared—intricate patterns assembled from individually cut tile pieces. The Safavid era (16th–17th century) introduced *haft-rangi* ('seven-color') tiles, where multiple colors were painted on a single tile before firing. This technique was faster and cheaper, allowing the vast surfaces of the Shah Mosque (18 million bricks, 475,000 tiles) to be completed in under two decades.",
      "**Key Architects and Innovators**\n\n• **Ali Akbar Isfahani**: Principal architect of the Shah Mosque (1611–1630), who solved the 45-degree angle between Naqsh-e Jahan Square and the qibla direction with a bent-axis design.\n• **Badi al-Zaman-i Tuni**: Oversaw early phases of the Shah Mosque's construction.\n• **Ustad Ahmad Lahori**: The Persian architect later credited with the Taj Mahal, bridging Persian and Mughal traditions.",
      "**Muqarnas and Domes**\n\nMuqarnas—honeycomb-like vaulting—reached its apex in Persian architecture. These three-dimensional geometric forms, built from small interlocking pieces, create the illusion of infinite complexity. The double-shell dome, another Persian innovation, features an inner dome for interior proportion and an outer dome for exterior visibility, with the space between allowing for dramatic height. The Shah Mosque's outer dome rises 52 meters.",
      "**Regional Variations: Timurid Central Asia**\n\nThe Persian-Timurid style flourished in Samarkand, Bukhara, and Herat under Timur and his successors (14th–16th century). Monumental scale, soaring portals, and distinctive turquoise domes characterize this variant. The Bibi-Khanum Mosque (1399–1404), though now partially ruined, was once the largest mosque in Central Asia. Shah-i-Zinda's necropolis showcases concentrated Timurid tilework innovation.",
      "**Funding and Construction**\n\nThe Shah Mosque cost 20,000 toman (approximately 100,000 gold coins) and was funded directly by Shah Abbas I as part of his ambitious redesign of Isfahan as the Safavid capital. Persian mosques were typically royal or *waqf*-funded, with attached bazaars and caravanserais generating revenue. The Imam Reza Shrine in Mashhad, continuously expanded over a millennium, demonstrates how pilgrimage-generated income enabled ongoing construction.",
    ],
  },
  {
    slug: "moorish-mosque-architecture",
    title: "Moorish Architecture: Horseshoe Arches and the Splendor of Al-Andalus",
    description: "From the Great Mosque of Córdoba to Morocco's medinas—explore the horseshoe arches, zellige tilework, and geometric patterns of Moorish Islamic architecture.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0a/Mosque_of_Cordoba.jpg",
    imageAlt: "The hypostyle hall of the Great Mosque of Córdoba with red and white arches",
    relatedSlugs: ["islamic-architecture-ages", "ottoman-mosque-architecture", "unesco-mosque-sites"],
    featuredMosqueIds: ["hassan-ii", "al-qarawiyyin", "koutoubia-mosque", "great-mosque-of-kairouan"],
    paragraphs: [
      "Moorish architecture—developed in Al-Andalus (Islamic Iberia) and the Maghreb from the 8th to 15th centuries—created some of the most distinctive and influential buildings in Islamic history. The Great Mosque of Córdoba, with its forest of 856 columns and double-tiered arches, established motifs that spread across North Africa and later inspired global revivalism.",
      "**Origins: From Kairouan to Córdoba**\n\nWhen 'Abd al-Rahman I founded the Emirate of Córdoba in 756, he commissioned a mosque that would rival Damascus. Built on the site of a Visigothic church, the Great Mosque of Córdoba (begun 785) pioneered the Moorish style. Roman columns were reused and extended with double-tiered arches—alternating red brick and white stone—to gain height. This innovative solution became an iconic visual signature.",
      "**Key Architectural Elements**\n\n• **Horseshoe Arches**: The defining Moorish form, extending beyond a semicircle to create a keyhole shape. Borrowed from Visigothic architecture and refined by Muslim builders.\n• **Hypostyle Halls**: Vast prayer spaces with forests of columns, creating mysterious, contemplative interiors. Córdoba has 19 aisles perpendicular to the qibla wall.\n• **Zellige Tilework**: Geometric mosaic tilework using hand-cut pieces, typically in blue, green, white, and gold. Developed in Fes and Marrakesh from the 10th century.\n• **Muqarnas Domes**: Three-dimensional stalactite vaulting, reaching its Andalusian peak in the Alhambra's Hall of the Abencerrajes.\n• **Riad Gardens**: Interior courtyard gardens with fountains, reflecting Paradise imagery.",
      "**Master Builders and Innovation**\n\nMoorish architecture was often the work of anonymous craftsmen organized into guilds. The *mu'allim* (master builder) directed projects, with specialized guilds for tilework, woodcarving, and stucco. Cross-cultural exchange was constant—Christian craftsmen (*Mudéjar* artisans) worked in Islamic courts, and after the Reconquista, they brought Moorish techniques to Christian buildings throughout Spain.",
      "**The Maghreb Tradition**\n\nAs the Córdoba caliphate fragmented and Christians reconquered Iberia, the architectural tradition flourished in Morocco, Algeria, and Tunisia. The Koutoubia Mosque in Marrakesh (1147–1199), the Great Mosque of Kairouan (670 CE foundation, current form 9th century), and the Al-Qarawiyyin in Fes (859 CE) continued and refined Moorish forms. Hassan II Mosque in Casablanca (1993) represents the modern continuation—its 210-meter minaret is the world's tallest, and its retractable roof references historic courtyard mosques.",
      "**Funding Patterns**\n\nMoorish mosques were funded through the caliphate's taxation system and *waqf* endowments. The Córdoba mosque was expanded by successive rulers—each *caliph* added sections to demonstrate piety and power. After 1236, the mosque became a cathedral, but its Islamic architecture was largely preserved, creating a unique hybrid. UNESCO protection now ensures its preservation as a World Heritage Site.",
      "**Legacy and Revival**\n\nMoorish architecture inspired the 19th-century Orientalist movement—synagogues, theaters, and train stations from Budapest to New York adopted horseshoe arches and arabesque ornament. Today, the style remains central to Moroccan identity, with traditional techniques taught in Fes and applied in new construction.",
    ],
  },
  {
    slug: "sudano-sahelian-mosque-architecture",
    title: "Sudano-Sahelian Architecture: The Mud Mosques of West Africa",
    description: "Discover the Great Mosque of Djenné and the distinctive adobe, toron, and community-maintained mosques of Mali, Niger, and the Sahel.",
    imageUrl: "/images/mosques/great-mosque-of-djenne.jpg",
    imageAlt: "The Great Mosque of Djenné with its adobe walls and wooden toron beams",
    relatedSlugs: ["islamic-architecture-ages", "unesco-mosque-sites", "modern-mosque-architecture"],
    featuredMosqueIds: ["great-mosque-of-djenne", "larabanga-mosque", "great-mosque-of-bobo-dioulasso"],
    paragraphs: [
      "Sudano-Sahelian architecture represents one of the world's most distinctive building traditions—adobe mosques with organic, sculptural forms that seem to grow from the earth itself. Centered in Mali, Niger, Burkina Faso, and Ghana, this style combines Islamic religious requirements with African materials, climate adaptation, and community-centered construction practices.",
      "**The Great Mosque of Djenné**\n\nThe world's largest adobe structure, the Great Mosque of Djenné (current form: 1907), stands as the masterpiece of Sudano-Sahelian architecture. Its three massive minarets, crenellated walls, and organic curves are built from *ferey* (sun-baked mud bricks) and *banco* (mud plaster). The mosque's plan is approximately 75 × 75 meters, with the qibla wall featuring three towers rising to 16 meters.",
      "**Key Architectural Elements**\n\n• **Adobe/Banco Construction**: Sun-dried mud bricks plastered with mud, creating thick walls that insulate against Sahel temperature extremes.\n• **Toron**: Bundles of *rodier palm* sticks projecting from walls (about 60 cm). These serve as permanent scaffolding for annual repairs and as decorative elements casting rhythmic shadows.\n• **Ceramic Drainage**: Half-pipe ceramics extend from rooflines, directing rainwater away from mud walls.\n• **Minimal Openings**: Small windows reduce heat and light, creating cool, dim prayer spaces suited to the climate.\n• **Ostrich Egg Finials**: Atop minarets and pinnacles, symbolizing purity and fertility.",
      "**The Crépissage: Community Maintenance**\n\nAdobe buildings require annual maintenance—a fact transformed into celebration in Djenné. Each spring, the *crépissage* (replastering festival) brings the entire community together. Men climb the toron scaffolding while women carry mud mixed with rice husks. The event, combining religious duty, civic identity, and festival, ensures both the mosque's preservation and social cohesion. UNESCO recognized this intangible heritage alongside the physical site.",
      "**Origins and Spread**\n\nThe style emerged with the spread of Islam along trans-Saharan trade routes (8th–11th centuries). Indigenous building techniques—already adapted to the region's mud and limited timber—were adapted for mosques. Timbuktu, Gao, and Djenné became centers of Islamic learning and architecture. The Sankore Mosque in Timbuktu (14th–15th century) and the Larabanga Mosque in Ghana (1421) represent other important examples.",
      "**Innovators and Knowledge Transmission**\n\nMaster builders (*barey-ton* in Djenné) passed techniques through apprenticeship. Ismaila Traoré, the chief mason of the 1907 Great Mosque reconstruction, led a team of Djenné masons who maintained the building until the 1930s. Today, the Aga Khan Trust for Culture has partnered with local masons to document and preserve traditional techniques.",
      "**Challenges and Preservation**\n\nClimate change, population pressure, and modern construction materials threaten Sudano-Sahelian architecture. Concrete and corrugated iron are cheaper and require less maintenance. The Great Mosque of Djenné's UNESCO status provides protection, but smaller mosques across the Sahel deteriorate. Conservation efforts balance authenticity with adaptation—some projects introduce stabilized earth blocks that maintain aesthetics while reducing maintenance.",
    ],
  },
  {
    slug: "malay-mosque-architecture",
    title: "Malay Mosque Architecture: Tiered Roofs and Southeast Asian Traditions",
    description: "From Java's meru roofs to Malaysia's kampung mosques—explore how Southeast Asian Islamic architecture blends Hindu-Buddhist heritage with Islamic principles.",
    imageUrl: "/images/mosques/putra-mosque.jpg",
    imageAlt: "Putra Mosque in Putrajaya with its pink dome and lakeside setting",
    relatedSlugs: ["islamic-architecture-ages", "modern-mosque-architecture", "tourist-friendly-mosques"],
    featuredMosqueIds: ["istiqlal-mosque", "national-mosque-malaysia", "putra-mosque", "sultan-salahuddin-abdul-aziz", "omar-ali-saifuddien-mosque"],
    paragraphs: [
      "Mosque architecture in Malaysia, Indonesia, and Brunei developed a distinctive regional vocabulary that blends Islamic religious requirements with indigenous Southeast Asian building traditions. Tiered roofs, wooden construction, and elevated floors—features shared with Hindu-Buddhist temples—created a unique vernacular that persisted until 20th-century modernization introduced Middle Eastern dome styles.",
      "**The Meru Roof Tradition**\n\nThe most distinctive feature of traditional Malay mosques is the *meru* roof—a multi-tiered pyramidal structure derived from Hindu-Javanese temple architecture. Typically three tiers (representing the Islamic trinity of faith, prayer, and charity), these roofs sit on four central pillars (*saka guru*) reaching up to an apex. The Demak Great Mosque (1474), among Java's oldest, preserves this form with five tiers symbolizing the Five Pillars of Islam.",
      "**Key Architectural Elements**\n\n• **Elevated Floors**: Mosques raised on stilts protect against flooding and promote airflow in tropical climates.\n• **Verandah (Serambi)**: A covered porch for gatherings, announcements, and overflow prayer space.\n• **Four Central Pillars**: Supporting the roof and symbolically anchoring the mosque to the community.\n• **Minimal Minarets**: Traditional Malay mosques often lacked minarets entirely—the call to prayer was made from the roof or a small tower (*menara*) added later.\n• **Wood and Thatch**: Original construction used local timber and palm-leaf roofing, though many have been rebuilt in permanent materials.",
      "**Historical Mosques**\n\nThe Kampung Laut Mosque in Kelantan (est. 16th century) is Malaysia's oldest surviving mosque, rebuilt after flooding in 1968. Its tiered roof and wooden construction represent the pre-colonial tradition. The Demak Mosque in Java, Sunan Ampel Mosque in Surabaya, and Menara Kudus Mosque (which incorporates a Hindu temple tower as its minaret) demonstrate Javanese interpretations.",
      "**Colonial and Modern Transformations**\n\nDutch, British, and later Middle Eastern influences transformed Malay mosque architecture. The Ubudiah Mosque in Perak (1917), designed by a British architect, introduced Mughal domes and minarets. Post-independence nationalism encouraged monumental mosques: Malaysia's National Mosque (1965) features a modernist folded-plate roof and 73-meter minaret. Indonesia's Istiqlal Mosque (1978), designed by Christian architect Frederich Silaban, is Southeast Asia's largest.",
      "**Contemporary Trends**\n\nToday, Malay mosque architecture spans traditional revival and international modernism. The Putra Mosque (1999), with its pink granite dome and Persian-inspired design, represents Malaysia's effort to project a distinctive Islamic identity. Brunei's Omar Ali Saifuddien Mosque (1958) and Sultan Omar Ali Saifuddien Grand Mosque blend Mughal and Italian materials with local tradition. Indonesia's Al Jabbar Grand Mosque in Bandung (2022) reimagines the tiered roof as a series of floating lotus-inspired domes.",
      "**Patronage and Funding**\n\nHistorically, Malay sultans and local chiefs funded mosques as expressions of Islamic legitimacy and community service. The *wakaf* (waqf) system supported maintenance. Modern state mosques are funded by national petroleum revenues (Malaysia's Petronas) or government budgets, while community mosques (*surau*) rely on donations. This mix of royal, state, and community funding continues today.",
    ],
  },
  {
    slug: "fatimid-mamluk-mosque-architecture",
    title: "Fatimid and Mamluk Architecture: Cairo's Medieval Mosques",
    description: "From Al-Azhar to Sultan Hassan—explore the keel arches, stone ablaq, and minarets that made medieval Cairo the greatest city in the Islamic world.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Kairouan_Mosque_Courtyard.jpg",
    imageAlt: "Courtyard of Al-Azhar Mosque in Cairo with its historic minarets",
    relatedSlugs: ["moorish-mosque-architecture", "islamic-architecture-ages", "unesco-mosque-sites"],
    featuredMosqueIds: ["al-azhar-mosque", "great-mosque-of-kairouan", "ibn-tulun-mosque"],
    paragraphs: [
      "Medieval Cairo produced one of the richest concentrations of Islamic architecture in the world. Two dynasties—the Fatimids (969–1171) and the Mamluks (1250–1517)—built mosques, madrasas, and mausolea that established Cairo as the premier city of Islamic learning and architecture. Many of these buildings still stand in the historic Islamic core, now a UNESCO World Heritage Site.",
      "**Fatimid Architecture (969–1171)**\n\nThe Fatimid caliphate, ruling from Cairo (which they founded), introduced a refined architectural vocabulary. Al-Azhar Mosque (970–972), commissioned by Caliph al-Mu'izz, became the intellectual center of the Ismaili Shia state and later the most important Sunni university.\n\n**Fatimid characteristics:**\n• **Keel-shaped arches**: A pointed arch that extends beyond the semicircle, seen in Al-Azhar's courtyard arcades.\n• **Carved stucco decoration**: Intricate arabesque and vegetal patterns covering mihrab walls.\n• **Projected portals**: Ceremonial entrances marking the mosque's presence in the street.\n• **Domed mihrabs**: Early use of domes to emphasize the qibla.",
      "**The Transition: Ayyubid Period (1171–1250)**\n\nSaladin ended Fatimid rule and restored Sunni orthodoxy, building the Cairo Citadel and his own madrasa. Ayyubid buildings introduced Syrian influences—larger stones, less carved stucco. The period was transitional, setting the stage for Mamluk grandeur.",
      "**Mamluk Architecture (1250–1517)**\n\nThe Mamluks—a military caste of slave soldiers who seized power—proved exceptional patrons. Their three-century rule produced hundreds of buildings in Cairo alone.\n\n**Mamluk characteristics:**\n• **Ablaq masonry**: Alternating courses of light and dark stone (cream limestone and red granite) creating bold geometric patterns.\n• **Elaborate minarets**: Three-section minarets with distinct forms for each level (square, octagonal, cylindrical) topped by finials.\n• **Cruciform madrasas**: Buildings combining mosque, school, and mausoleum functions around a central courtyard.\n• **Sabil-kuttab**: Street-corner foundations combining a public fountain with a Quranic school above.\n• **Muqarnas portals**: Stalactite vaulting framing monumental entrances.",
      "**Masterpieces and Patrons**\n\nThe Sultan Hassan Mosque-Madrasa (1356–1363) represents the peak of Mamluk architecture. Its 36-meter portal is among the largest in the Islamic world. The complex housed students of all four Sunni legal schools, with the sultan's mausoleum behind the qibla wall. The Qalawun Complex (1284–1285) pioneered the combination of madrasa, hospital, and mausoleum. The Ibn Tulun Mosque (879), though predating the Fatimids, influenced both dynasties with its spiral minaret (inspired by Samarra) and vast hypostyle hall.",
      "**Funding: Waqf and Royal Patronage**\n\nMamluk amirs and sultans funded buildings through *waqf* endowments. Commercial properties—shops, baths, apartment buildings—generated income that paid for maintenance, salaries, and charitable functions. The waqf deed (*waqfiyya*) specified everything from who would be employed to how many candles would burn. This system ensured buildings remained active religious and educational centers. When waqf income declined under Ottoman rule, many complexes deteriorated.",
      "**Legacy and Preservation**\n\nCairo's historic core contains some 600 classified monuments, the densest concentration of medieval architecture anywhere. The Aga Khan Trust for Culture's Al-Azhar Park project (2005) restored adjacent Ayyubid walls. The Historic Cairo project documents and conserves buildings. For travelers, walking from Bab Zuwayla to Al-Azhar remains one of the world's great architectural experiences.",
    ],
  },
  {
    slug: "evolution-mosque-architecture",
    title: "The Evolution of Mosque Architecture: From Prophet's House to Modern Icons",
    description: "A comprehensive journey through 1,400 years of mosque design—from the simple courtyard of Medina to today's billion-dollar landmarks. Tracing innovations, patterns, and cultural exchange.",
    imageUrl: "/images/mosques/masjid-al-haram.jpg",
    imageAlt: "Aerial view of Masjid al-Haram showing the evolution of expansions around the Kaaba",
    relatedSlugs: ["islamic-architecture-ages", "ottoman-mosque-architecture", "modern-mosque-architecture", "mosque-funding-patronage"],
    featuredMosqueIds: ["masjid-al-haram", "umayyad-mosque", "blue-mosque", "hassan-ii", "djamaa-el-djazair"],
    paragraphs: [
      "The mosque has evolved from the Prophet Muhammad's simple courtyard in Medina to colossal modern structures that hold millions. Yet across 14 centuries, certain principles persist: orientation toward Mecca, provision for communal prayer, and adaptation to local materials and traditions. This evolution reflects the creativity of Muslim communities worldwide.",
      "**The Prophetic Prototype (622–632 CE)**\n\nThe first mosque was Prophet Muhammad's house in Medina—a simple rectangular enclosure with palm-trunk columns and a palm-leaf roof. Its courtyard hosted prayer, teaching, political gatherings, and even housing for travelers. This multifunctional model, combining sacred and civic space, influenced mosque design permanently. The qibla (prayer direction) initially faced Jerusalem, then shifted to Mecca—establishing the orientation that defines all mosques.",
      "**Early Islamic Expansion: Hypostyle Halls (7th–10th century)**\n\nAs Islam spread, conquered territories offered building materials and traditions. Early mosques in Iraq, Syria, and Egypt adopted the hypostyle plan—a vast roof supported by many columns, creating a flexible prayer space. The Great Mosque of Damascus (706–715), built on a Roman temple site using Byzantine craftsmen, introduced mosaics, stone construction, and the monumental courtyard. The Great Mosque of Kairouan (670, rebuilt 9th century) standardized the North African type with its distinctive square minaret.",
      "**Regional Divergence (10th–15th century)**\n\nAs the unified caliphate fragmented, regional styles emerged:\n• **Al-Andalus and Maghreb**: Horseshoe arches, zellige tilework, elaborate mihrabs (Córdoba, Fes)\n• **Persia and Central Asia**: Four-iwan courtyards, turquoise domes, tile mosaic (Isfahan, Samarkand)\n• **Egypt and Syria**: Carved stone, ablaq masonry, cruciform madrasas (Cairo, Damascus)\n• **Anatolia**: Seljuk experimentation leading toward the Ottoman central dome\n• **South Asia**: Hindu and Buddhist elements absorbed into Indo-Islamic style (Delhi, Ahmedabad)\n• **West Africa**: Adobe construction, toron beams (Djenné, Timbuktu)\n• **Southeast Asia**: Tiered roofs from Hindu-Javanese temple tradition (Demak, Malacca)",
      "**The Ottoman Synthesis (15th–17th century)**\n\nOttoman architects, especially Mimar Sinan, synthesized earlier traditions into a powerful new form. The central dome—learned from the Hagia Sophia but refined through engineering innovation—became the defining feature. Semi-domes, buttresses, and pencil minarets created the iconic silhouette visible from Istanbul to the Balkans. This period represents the classical apogee of mosque architecture, with buildings of unprecedented scale and harmony.",
      "**Colonial Disruption and Modern Revival (19th–20th century)**\n\nEuropean colonialism disrupted traditional patronage and introduced new materials and building methods. Some mosques adopted Western neo-Islamic or Orientalist styles; others continued vernacular traditions. Independence movements often prompted nationalist mosque-building—Indonesia's Istiqlal (1978), Pakistan's Faisal (1986), and Malaysia's National Mosque (1965) asserted post-colonial Islamic identity through modernist forms.",
      "**Contemporary Directions (21st century)**\n\nToday's mosque architecture spans every approach:\n• **Traditional Revival**: Çamlıca Mosque (Istanbul), Al Jabbar (Bandung) reference historic forms with modern materials.\n• **Modernist Expression**: Djamaa el Djazaïr (Algeria) combines the world's tallest minaret with contemporary engineering.\n• **Contextual Adaptation**: Cambridge Central Mosque uses sustainable timber and no dome, fitting its English context.\n• **Gulf Monumentalism**: Sheikh Zayed Grand Mosque prioritizes visitor experience and photogenic grandeur.\n\nWhat unites these diverse projects is continued innovation within Islamic principles—adapting the eternal requirements of community prayer to new materials, climates, and cultural contexts.",
      "**Funding Through History**\n\nMosque funding has evolved alongside architecture. The Prophet's mosque was built by community labor. Caliphs and sultans funded imperial mosques through taxation and conquest. The *waqf* (charitable endowment) system, developed by the 9th century, provided sustainable income through attached commercial properties. Modern mosques are funded by states (often oil revenue), royal families, diaspora communities, and increasingly crowdfunding. The $1 billion+ costs of major new mosques reflect both architectural ambition and the ongoing centrality of the mosque in Muslim community life.",
    ],
  },
  {
    slug: "mosque-funding-patronage",
    title: "How Mosques Are Funded: Waqf, Royal Patronage, and Modern Finance",
    description: "From the medieval waqf system to modern crowdfunding—discover the economic patterns behind mosque construction and how funding shapes architecture.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Sheikh_Zayed_Grand_Mosque_Picture.jpg",
    imageAlt: "Sheikh Zayed Grand Mosque representing modern state-funded mosque construction",
    relatedSlugs: ["evolution-mosque-architecture", "islamic-architecture-ages", "biggest-mosques-world"],
    featuredMosqueIds: ["sheikh-zayed", "hassan-ii", "djamaa-el-djazair", "faisal-mosque", "masjid-al-haram"],
    paragraphs: [
      "Behind every great mosque stands a system of funding—whether caliphal treasury, charitable endowment, or modern state budget. Understanding these economic patterns illuminates why mosques were built, how they were maintained, and what architectural choices became possible. From the earliest community-built structures to billion-dollar modern landmarks, funding has shaped mosque architecture.",
      "**The Prophetic Model: Community Labor**\n\nThe first mosques were built through collective effort. Prophet Muhammad himself carried bricks when constructing the Masjid al-Nabawi in Medina. This communal model persists in village mosques worldwide, where community members contribute labor, materials, and funds according to their means. The simplest mosques—mud-brick structures across the Sahel, wooden buildings in Southeast Asia—continue this tradition.",
      "**The Waqf System: Sustainable Endowment**\n\nBy the 9th century, the *waqf* (Islamic endowment) system became the primary mechanism for mosque funding. A patron would dedicate income-generating properties—bazaars, baths, apartments, agricultural land—whose revenue would permanently support the mosque's operation. The waqf deed (*waqfiyya*) specified everything: imam salaries, lamp oil quantities, maintenance schedules, and charitable distributions. At its peak in the 18th-century Ottoman Empire, over half of real estate was waqf property. This system enabled mosques to function as self-sustaining institutions for centuries.",
      "**Royal and Imperial Patronage**\n\nSultans, caliphs, and amirs built mosques to demonstrate piety, legitimize power, and immortalize their names. The Süleymaniye Mosque cost an estimated 59 million akçe and employed 3,523 workers. Shah Abbas I's Shah Mosque consumed 20,000 toman. These imperial mosques were often külliye complexes—integrated institutions combining prayer hall, madrasa, hospital, soup kitchen, and commercial properties. Architecture became political statement: size, decoration, and location announced the patron's status. Viziers and commanders built smaller mosques, creating urban networks of sacred architecture.",
      "**Diaspora and Community Funding**\n\nMuslim communities outside traditional heartlands have always funded mosques through collective contribution. From medieval trading communities in China and East Africa to contemporary immigrants in Europe and America, diaspora mosques represent pooled resources. The East London Mosque (1985), funded by Bangladeshi community donations, and the Islamic Center of Washington (1957), financed by ambassadors from Muslim-majority countries, exemplify this pattern. Crowdfunding platforms now enable global participation—the Cambridge Central Mosque (2019) raised £23 million through a combination of major donors and small contributions.",
      "**State Funding in the Modern Era**\n\nPost-colonial nations often built national mosques as symbols of independence and Islamic identity. Pakistan's Faisal Mosque (1986), funded by King Faisal of Saudi Arabia, and Malaysia's National Mosque (1965), financed by the Malaysian government, represent state investment in religious infrastructure. Gulf states, with petroleum wealth, have sponsored monumental mosques: the Sheikh Zayed Grand Mosque cost over $545 million; Djamaa el Djazaïr (Algeria) reportedly exceeded $1 billion. These projects employ international architects, import materials globally, and aim for world records in scale.",
      "**How Funding Shapes Architecture**\n\nFunding sources influence architectural choices. Community-built mosques use local materials and modest scales. Waqf-funded mosques include commercial spaces generating income. Imperial mosques feature expensive materials (marble, gold, imported tiles) and master architects. Modern state-funded mosques prioritize visibility and visitor facilities. The Cambridge Mosque's sustainable timber design reflected donor values; the Hassan II Mosque's sea-facing location and retractable roof demonstrated Moroccan royal ambition. Understanding patronage explains not just what was built, but why.",
      "**Challenges and Continuity**\n\nThe waqf system declined under colonialism—French seizure of Algerian waqf, British administration of Indian endowments—and post-colonial nationalization. Many historic mosques lost their income sources and deteriorated. Revival efforts, including new waqf legislation and conservation trusts (Aga Khan Trust for Culture, Saudi-funded restoration projects), aim to restore sustainable funding. Meanwhile, the fundamental pattern continues: Muslims contribute resources, according to their means, to build and maintain spaces for community prayer.",
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

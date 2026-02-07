# Countries and Mosques — MosqueList Reference

This document lists every country represented in MosqueList’s mosque data, the **biggest mosque per country** (by capacity in our dataset), and classifies countries as **Muslim-majority** or **other**. It also outlines **Muslim-majority countries** and **countries with large mosques that are not Muslim-majority**, with fact-check notes and prompts for finding and maintaining this data.

**Data source:** `src/data/mosques.json` (81 mosques). “Biggest” = mosque with highest `capacity` in that country in our data.

---

## Summary

| Metric | Count |
|--------|--------|
| **Countries in app** | 39 |
| **Muslim-majority countries in app** (outlined below) | 33 |
| **Countries with large mosques, not Muslim-majority** (outlined below) | 6 |
| **Muslim-majority countries not yet in app** (priority gaps) | Many (see list) |

---

## Every country in the app — biggest mosque per country

| Country | Biggest mosque (in app) | ID | Capacity | Location |
|---------|-------------------------|-----|----------|----------|
| Afghanistan | Abdul Rahman Mosque | `abdul-rahman-mosque` | 10,000 | Kabul |
| Albania | Et'hem Bey Mosque | `ethem-bey-mosque` | 2,000 | Tirana |
| Algeria | Djamaa el Djazaïr | `djamaa-el-djazair` | 120,000 | Algiers |
| Azerbaijan | Heydar Mosque | `heydar-mosque` | 75,000 | Baku |
| Bahrain | Al-Fateh Grand Mosque | `al-fateh-grand-mosque` | 7,000 | Manama |
| Bangladesh | Baitul Mukarram | `baitul-mukarram` | 40,000 | Dhaka |
| Bosnia and Herzegovina | Gazi Husrev-beg Mosque | `gazi-husrev-beg-mosque` | 1,500 | Sarajevo |
| Brunei | Sultan Omar Ali Saifuddin Mosque | `sultan-omar-ali-saifuddin` | 3,000 | Bandar Seri Begawan |
| China | Id Kah Mosque | `id-kah-mosque` | 20,000 | Kashgar |
| Egypt | Egypt's Islamic Cultural Center (Masjid Misr Al Kabeer) | `egypts-islamic-cultural-center-masjid-misr-al-kabeer` | 130,000 | New Administrative Capital |
| Guinea | Grand Mosque of Conakry | `grand-mosque-of-conakry` | 20,000 | Conakry |
| India | Taj-ul-Masajid | `taj-ul-masajid` | 175,000 | Bhopal |
| Indonesia | Istiqlal Mosque | `istiqlal-mosque` | 200,000 | Jakarta |
| Iran | Imam Reza Shrine | `imam-reza-shrine` | 1,200,000 | Mashhad |
| Iraq | Imam Ali Shrine | `imam-ali-shrine` | 800,000 | Najaf |
| Jordan | King Abdullah I Mosque | `king-abdullah-i-mosque` | 7,000 | Amman |
| Kazakhstan | Astana Grand Mosque | `astana-grand-mosque` | 230,000 | Astana |
| Kosovo | Imperial Mosque | `imperial-mosque-pristina` | 5,000 | Pristina |
| Kuwait | Grand Mosque of Kuwait | `grand-mosque-kuwait` | 11,000 | Kuwait City |
| Lebanon | Mohammad Al-Amin Mosque | `mohammad-al-amin-mosque` | 6,400 | Beirut |
| Malaysia | Sultan Salahuddin Abdul Aziz Mosque | `sultan-salahuddin-abdul-aziz-mosque` | 24,000 | Shah Alam |
| Mali | Great Mosque of Djenné | `great-mosque-of-djenne` | 1,000 | Djenné |
| Morocco | Hassan II Mosque | `hassan-ii` | 105,000 | Casablanca |
| Nigeria | National Mosque | `national-mosque-abuja` | 7,000 | Abuja |
| Oman | Sultan Qaboos Grand Mosque | `sultan-qaboos-grand-mosque` | 20,000 | Muscat |
| Pakistan | Grand Jamia Mosque | `grand-jamia` | 800,000 | Karachi |
| Palestine | Al-Aqsa Mosque | `al-aqsa` | 400,000 | Jerusalem |
| Philippines | Sultan Haji Hassanal Bolkiah Mosque | `sultan-haji-hassanal-bolkiah-mosque` | 15,000 | Cotabato City |
| Qatar | Imam Muhammad ibn Abd al-Wahhab Mosque | `imam-abdul-wahhab-mosque` | 30,000 | Doha |
| Russia | Pride of Muslims Mosque | `pride-of-muslims-mosque-shali` | 30,000 | Shali |
| Saudi Arabia | Masjid al-Haram | `masjid-al-haram` | 4,000,000 | Mecca |
| Senegal | Massalikoul Djinane Mosque | `massalikoul-djinane-mosque` | 30,000 | Dakar |
| Sudan | Great Mosque of Khartoum | `great-mosque-khartoum` | 10,000 | Khartoum |
| Syria | Umayyad Mosque | `umayyad-mosque` | 100,000 | Damascus |
| Tunisia | Al-Zaytuna Mosque | `al-zaytuna-mosque` | 3,000 | Tunis |
| Turkey | Çamlıca Mosque | `camlica-mosque` | 63,000 | Istanbul |
| UAE | Sheikh Zayed Grand Mosque | `sheikh-zayed` | 41,000 | Abu Dhabi |
| United Kingdom | Birmingham Central Mosque | `birmingham-central-mosque` | 5,000 | Birmingham |
| USA | Islamic Center of Washington | `islamic-center-washington` | 6,000 | Washington, D.C. |
| Uzbekistan | Kalon Mosque | `kalon-mosque-bukhara` | 12,000 | Bukhara |
| Yemen | Al Saleh Mosque | `al-saleh-mosque` | 45,000 | Sana'a |

---

## Muslim-majority countries (outlined)

These are countries where Islam is the majority religion (by population). Those **in the app** are marked.

### In the app (33)

Afghanistan, Albania, Algeria, Azerbaijan, Bahrain, Bangladesh, Bosnia and Herzegovina, Brunei, Egypt, Guinea, Indonesia, Iran, Iraq, Jordan, Kazakhstan, Kosovo, Kuwait, Lebanon, Malaysia, Mali, Morocco, Nigeria, Oman, Pakistan, Palestine, Qatar, Saudi Arabia, Senegal, Sudan, Syria, Tunisia, Turkey, UAE, Uzbekistan, Yemen.

(Philippines is in the app with a large mosque but is **not** Muslim-majority; see “Countries with large mosques that are NOT Muslim-majority” below.)

### Not in the app (priority gaps)

Muslim-majority countries with no mosque in our data yet (candidates for adding):

- **Central Asia:** Turkmenistan, Kyrgyzstan, Tajikistan  
- **Africa:** Libya, Somalia, Chad, Niger, Mauritania, Gambia, Sierra Leone, Burkina Faso, Djibouti  
- **Asia:** Maldives, Comoros  
- **Others:** Gabon, Cameroon (some OIC members are not Muslim-majority; verify per country)

---

## Countries with large mosques that are NOT Muslim-majority (outlined)

These countries are in the app and have at least one mosque with substantial capacity (e.g. ≥ 5,000), but the country is not Muslim-majority.

| Country | Biggest mosque in app | Capacity | Note |
|---------|------------------------|----------|------|
| **China** | Id Kah Mosque, Kashgar | 20,000 | Xinjiang; large Muslim minority |
| **India** | Taj-ul-Masajid, Bhopal | 175,000 | One of world’s largest Muslim populations, not majority |
| **Russia** | Pride of Muslims Mosque, Shali | 30,000 | Large Muslim populations in regions |
| **United Kingdom** | Birmingham Central Mosque | 5,000 | Significant Muslim minority |
| **USA** | Islamic Center of Washington | 6,000 | Significant Muslim minority |
| **Philippines** | Sultan Haji Hassanal Bolkiah Mosque, Cotabato City | 15,000 | Large Muslim population in Mindanao |

---

## Fact-check notes

- **Pakistan:** Grand Jamia Mosque (Karachi), 800,000 capacity — confirmed as Pakistan’s largest (e.g. Wikipedia, Bahria Town); Faisal Mosque (Islamabad) is often cited in older lists as largest (~300,000) but Grand Jamia is larger.  
- **India:** Taj-ul-Masajid (Bhopal), 175,000 — widely cited as India’s largest mosque by capacity.  
- **Indonesia:** Istiqlal (Jakarta), 200,000 — widely cited as Indonesia’s largest.  
- **Albania:** In our data the only Albanian mosque is Et'hem Bey (2,000). The **Namazgah Mosque (Great Mosque of Tirana)** is larger (reportedly ~10,000) and opened in 2024; consider adding it and updating “biggest” for Albania.  
- **Saudi Arabia, Iran, Iraq, Palestine, Egypt, Morocco, UAE, Turkey, etc.:** Biggest-mosque choices align with commonly cited national/regional landmarks; capacity figures should be rechecked against official or cited sources when editing.  
- **Russia:** “Pride of Muslims” (Shali) — confirm whether this is the largest in Russia by capacity; Moscow and other cities have very large mosques.  

When adding or editing entries, prefer: official mosque/government sources, Encyclopaedia of Islam, Britannica, and Wikipedia with inline citations.

---

## Prompts for finding and maintaining data

Use these prompts to (1) find or update the country list and biggest mosque per country, and (2) find all fields that belong in mosque data for a given country or mosque.

---

### Prompt 1: Finding the country list and biggest mosque per country

**Purpose:** Build or update the list of every country in the app, the biggest mosque per country (by capacity), and whether each country is Muslim-majority or “other,” and outline Muslim-majority countries and countries with large mosques that are not Muslim-majority.

**Instructions:**

1. **List every country** that appears in the mosque dataset (e.g. from `mosques[].country` in `src/data/mosques.json`).  
2. **For each country, determine the biggest mosque** in that dataset by `capacity` (if tied or missing, use `area`). Record: country, mosque name, mosque id, capacity, location.  
3. **Classify each country:**  
   - **Muslim-majority:** Use a standard reference (e.g. OIC member states with Muslim-majority population, or “List of Muslim-majority countries” on Wikipedia / Pew Research).  
   - **Other:** All remaining countries.  
4. **Outline two groups in the output:**  
   - **Muslim-majority countries** (list which are in the app and which are not).  
   - **Countries with large mosques that are not Muslim-majority** (from the in-app list; “large” can be e.g. capacity ≥ 5,000 or a defined threshold).  
5. **Fact-check:** For at least the top 10–15 countries by capacity, verify “largest mosque in country” and capacity from an authoritative source (official site, Encyclopaedia of Islam, Britannica, or cited Wikipedia). Note any corrections.  
6. **Output:** Markdown table(s) and sections matching the structure of this document (countries, biggest mosque per country, Muslim-majority outlined, non-majority-with-big-mosques outlined, fact-check notes).

**Data source:** `src/data/mosques.json`. Schema for “mosque” is in `docs/mosque-data-prompt.md`.

---

### Prompt 2: Finding all mosque data for a country or mosque

**Purpose:** Find and fill **every field** that exists in the mosque data schema for a given country (all its mosques) or for a single mosque, so the data can be added or updated in MosqueList.

**Instructions:**

1. **Scope:** Either (a) one country — find all mosques already in the app for that country and all fields for each, or (b) one mosque — find all fields for that mosque.  
2. **Schema:** Use the full schema from `docs/mosque-data-prompt.md`. Fields include:  
   - **id**, **name**, **arabicName**, **location**, **country**, **address**, **coordinates**  
   - **capacity**, **established**, **area**, **annualVisitors**  
   - **facilities**, **significance**, **description**, **imageUrl**, **galleryUrls** (optional)  
   - **isHolySite**, **architecturalStyle**, **architectureNotes**, **history**, **tourismNotes**  
   - **officialWebsite**, **womenPrayerArea**, **touristFriendly**  
   - **denomination** (optional)  
3. **Research:** For each mosque (or the single mosque), look up authoritative sources (official mosque/government tourism, Britannica, Encyclopaedia of Islam, Wikipedia with citations) and fill every field. Note when a value is approximate or disputed.  
4. **Output:** For each mosque, produce a JSON object that matches the schema and is ready to be merged into `src/data/mosques.json`, plus one-line notes for any missing or uncertain fields.  
5. **Checklist (from mosque-data-prompt.md):** Capacity/area sourced; dates in CE; significance aligned with mainstream scholarship; no unverified sectarian/political claims; image CC-licensed (e.g. Wikimedia Commons).

**Data sources:** `src/data/mosques.json` (current data), `docs/mosque-data-prompt.md` (schema and workflow). Country-by-country priority list is in the same doc.

---

## Quick reference: mosque data fields (from schema)

All data that can appear in mosque records in MosqueList:

| Field | Type | Required | Notes |
|-------|------|----------|--------|
| id | string | Yes | URL-safe slug |
| name | string | Yes | Official or common English name |
| arabicName | string | No | Arabic script |
| location | string | Yes | City/town |
| country | string | Yes | Consistent spelling |
| address | string | No | Full address |
| coordinates | { lat, lng } | No | For maps |
| capacity | number | Yes | Prayer capacity |
| established | string | Yes | e.g. "YYYY CE" |
| area | number | No | m² |
| annualVisitors | string | No | e.g. "5–6 million" |
| facilities | string[] | No | List of facilities |
| significance | string | Yes | One sentence |
| description | string | Yes | 2–3 sentences |
| imageUrl | string | Yes | CC/Wikimedia preferred |
| galleryUrls | string[] | No | Additional images |
| isHolySite | boolean | No | Mecca, Medina, Al-Aqsa only |
| architecturalStyle | string | No | |
| architectureNotes | string | No | |
| history | string | No | |
| tourismNotes | string | No | |
| officialWebsite | string | No | |
| womenPrayerArea | boolean | No | |
| touristFriendly | boolean | No | |
| denomination | string | No | e.g. sunni |

For full descriptions and examples, see `docs/mosque-data-prompt.md`.

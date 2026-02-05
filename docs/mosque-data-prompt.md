# Mosque Data Collection Prompt

Use this prompt to find and populate in-depth mosque data for MosqueList. The output should match the schema below and follow the source hierarchy in `docs/skills.md`.

---

## Country-by-country research workflow

To systematically build coverage across Muslim-majority countries:

1. **List Muslim-majority countries** – OIC members, Pew Research data, or Wikipedia "List of Muslim majority countries."
2. **Identify largest city** – Use population data (e.g. city proper or metro) for each country.
3. **Find main mosque** – In the largest city, identify the national mosque, grand mosque, or most significant congregational mosque (by capacity, area, or historical importance).
4. **Research dimensions** – Capacity (prayer hall + courtyard if applicable), floor area (m²), established date, architectural style.
5. **Apply prompt** – Use the prompt below with **[MOSQUE NAME]**, **[CITY]**, **[COUNTRY]** and fill all schema fields.

### Priority countries (by population / significance)

| Region | Countries |
|--------|-----------|
| Middle East | Saudi Arabia, Iran, Iraq, Egypt, Turkey, UAE, Yemen, Syria, Jordan, Lebanon, Palestine, Kuwait, Bahrain, Qatar, Oman |
| South Asia | Pakistan, Bangladesh, India (with significant Muslim population), Afghanistan |
| Southeast Asia | Indonesia, Malaysia, Brunei |
| Central Asia | Uzbekistan, Kazakhstan, Turkmenistan, Kyrgyzstan, Tajikistan, Azerbaijan |
| Africa | Algeria, Morocco, Sudan, Senegal, Mali, Niger, Nigeria, Chad, Somalia, Tunisia, Libya |
| Europe | Bosnia and Herzegovina, Albania, Kosovo |

---

## Prompt

Find detailed, accurate information about **[MOSQUE NAME]** in **[CITY]**, **[COUNTRY]** for inclusion in a mosque discovery app. Research from authoritative sources (official mosque/government sites, Britannica, Encyclopaedia of Islam, Wikipedia with cited references) and produce a JSON object matching the schema below.

### Fields to research

| Field | Description | Notes |
|-------|-------------|-------|
| **id** | URL-safe slug (lowercase, hyphens) | e.g. `sheikh-zayed-grand-mosque` |
| **name** | Official or common English name | |
| **arabicName** | Arabic name (optional) | Use correct script |
| **location** | City or town | |
| **country** | Country name | Use consistent spelling |
| **coordinates** | Lat/lng for maps (optional) | Approximate is fine |
| **capacity** | Prayer capacity (number) | Note if approximate or disputed; prefer official figures |
| **established** | Year or date | Use "YYYY CE" or "YYYY" format |
| **area** | Floor area in m² (number) | Note if total site vs building |
| **annualVisitors** | Visitor estimate (string) | e.g. "5-6 million", "~1 million" |
| **facilities** | Array of facility names | Hotels, guided tours, library, etc. |
| **significance** | One-sentence religious/historical importance | |
| **description** | 2–3 sentence overview | For card and page display |
| **imageUrl** | Wikimedia Commons or CC image URL | Prefer high-quality, properly licensed |
| **isHolySite** | boolean | True only for Mecca, Medina, Al-Aqsa |
| **architecturalStyle** | Style label | Mughal, Ottoman, Modern, etc. |
| **architectureNotes** | Extended architecture (optional) | Materials, domes, minarets, notable features |
| **history** | Brief historical context (optional) | Key dates, patrons, expansions |
| **tourismNotes** | Visitor info (optional) | Dress code, best times, non-Muslim access |
| **officialWebsite** | Official URL (optional) | Mosque or government tourism site |
| **womenPrayerArea** | boolean | True if dedicated women's area |
| **touristFriendly** | boolean | True if non-Muslims may visit |

---

## Schema example

```json
{
  "id": "sheikh-zayed-grand-mosque",
  "name": "Sheikh Zayed Grand Mosque",
  "arabicName": "جامع الشيخ زايد الكبير",
  "location": "Abu Dhabi",
  "country": "UAE",
  "coordinates": { "lat": 24.4126, "lng": 54.4747 },
  "capacity": 41000,
  "established": "2007",
  "area": 120000,
  "annualVisitors": "5-6 million",
  "facilities": [
    "Guided tours (multiple languages)",
    "Visitor center",
    "Gift shops",
    "Photography permitted",
    "Dining facilities",
    "Library",
    "Reflection pools"
  ],
  "significance": "One of the largest mosques in the world, architectural masterpiece",
  "description": "The Sheikh Zayed Grand Mosque is one of the most beautiful mosques in the world, featuring 82 domes, over 1,000 columns, and the world's largest hand-knotted carpet. It's open to visitors of all faiths.",
  "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/5/5c/Sheikh_Zayed_Grand_Mosque_Picture.jpg",
  "isHolySite": false,
  "architecturalStyle": "Moorish, Mughal, Ottoman fusion",
  "architectureNotes": "82 domes, 1,000+ columns, 24-carat gold chandeliers, and the world's largest hand-knotted carpet. White marble and semi-precious stone inlays.",
  "history": "Commissioned by Sheikh Zayed bin Sultan Al Nahyan, founder of the UAE. Completed in 2007, it honors Islamic and global cultures.",
  "tourismNotes": "Free guided tours for non-Muslims. Modest dress required; abayas provided for women. Best time: morning. Photography allowed. Closed Friday morning.",
  "officialWebsite": "https://www.szgmc.gov.ae",
  "womenPrayerArea": true,
  "touristFriendly": true
}
```

---

## Source hierarchy

1. **Official mosque / waqf / government tourism** – Primary where available  
2. **Britannica, Encyclopaedia of Islam** – Authoritative for facts  
3. **Wikipedia + cited references** – Verify against inline sources  
4. **Regional sources** (Graana, tourism boards, etc.) – Cross-check figures  

---

## Checklist before adding

- [ ] Capacity/area sourced; note if approximate  
- [ ] Dates use CE and note if approximate  
- [ ] Significance aligns with mainstream Islamic scholarship  
- [ ] No unverified sectarian or political claims  
- [ ] Image is CC-licensed (e.g. Wikimedia Commons)

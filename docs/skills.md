# Skills & Tools for Accuracy: Mosques, Quran & Hadith

This document outlines skills, processes, and tools to verify and maintain accuracy of mosque data, Islamic scripture references (Quran), and hadith citations used across MosqueList and any future content.

**Before changing data or content**, use the guiding questions in [socratic-prompts.md](./socratic-prompts.md) (e.g. source, citation, neutrality) so updates stay appropriate and verifiable.

---

## 1. Mosque information accuracy

### What to verify
- **Names** – Official / common names in English and Arabic; correct transliteration (e.g. Al-Masjid an-Nabawi vs Al-Masjid Al-Nabawi).
- **Location & country** – City, region, and country; sensitivity to disputed territories (e.g. Al-Aqsa / Jerusalem).
- **Capacity & area** – Often cited in square meters; capacity figures vary by source (prayer capacity vs total area). Prefer official or widely cited academic/government sources.
- **Dates** – Establishment, major expansions; use CE and note when approximate (e.g. “c. 638 CE”).
- **Significance** – Theological rank (e.g. “third holiest”), historical events; avoid sectarian or polemical framing; cite when possible.
- **Facilities** – Women’s prayer area, tourist access, wheelchair access; verify against current visitor info where possible.

### Skills
- **Source hierarchy** – Prefer: official mosque/government sites → academic/encyclopedia (e.g. Encyclopaedia of Islam, Britannica) → reputable news/travel → general web. Note when only one source is available.
- **Cross-checking** – Compare at least 2–3 independent sources for contested or surprising claims (capacity, area, dates).
- **Transliteration** – Use a consistent system (e.g. ISO 233 or common romanization) and note variants in display name vs. “also known as.”
- **Sensitivity** – Neutral, factual language for holy sites and political contexts; avoid sectarian or political bias.

### Recommended tools & sources
| Purpose | Tool / Source | Notes |
|--------|----------------|--------|
| Mosque stats (area, capacity) | Official mosque / waqf / government tourism sites | Primary where available |
| General facts | Encyclopaedia of Islam (Brill), Britannica | Paywalled but authoritative |
| Geography & names | Wikipedia + cited refs, Wikidata | Good starting point; verify refs |
| Visitor / facilities | Official visitor info, recent travel guides | Check “last updated” |
| Cross-check numbers | Multiple news or academic articles | Especially for “largest” claims |

### Checklist before publishing mosque data
- [ ] Name(s) match at least one authoritative source.
- [ ] Country and city are correct and consistently named.
- [ ] Capacity/area sourced and noted if approximate or disputed.
- [ ] Dates use CE and note if approximate.
- [ ] Significance (e.g. “holiest”) aligns with mainstream Islamic scholarship.
- [ ] No unverified sectarian or political claims.

### Data sources for `src/data/mosques.json` (fact-check round)
Capacity and area figures have been cross-checked where possible against:
- **Wikipedia** – “List of largest mosques” (capacity/area table).
- **Britannica** – Great Mosque of Mecca, Al-Masjid an-Nabawi, Blue Mosque, etc.
- **Official / government** – Saudi statistics, Sultan Qaboos Grand Mosque (sultanqaboosgrandmosque.com), Hassan II (Wikipedia + Structurae).
- **Regional sources** – Graana, Bahria Town (Grand Jamia), Pakistan tourism.

Corrections applied: Al-Masjid an-Nabawi 1.5M capacity / 384,000 m²; Imam Reza Shrine 1.2M capacity (complex area 598,657 m²); Sheikh Zayed 120,000 m²; Blue Mosque 4,608 m² (64×72 m); Faisal 130,000 m²; Istiqlal 93,200 m²; Grand Jamia 800,000 capacity / 200,000 m² / completed 2023. Re-verify periodically and add new mosques with at least one cited source.

### Latest audit (capacity/area/dates)
- **Sultan Qaboos Grand Mosque**: Area 416,000 m² = total site (building ~40,000+ m² per official source); capacity 20,000 confirmed.
- **Taj-ul-Masajid**: 175,000 capacity, ~43,000 m² (430k sq ft); 1985 completion confirmed.
- **Grand Mosque of Kuwait**: Site 45,000 m²; main hall 10,000 + women 950; courtyard can bring total to ~70,000; stored capacity 11,000 (main + women).
- **Baitul Mukarram**: 30,000 base, up to 40,000 with extensions; 1968; area ~21,000 m².
- **Putra Mosque**: 15,000 capacity, 1999 — confirmed.
- **Sultan Omar Ali Saifuddin**: Capacity corrected to **3,000** (prayer hall; sources: Wikipedia, SEAsia). Previously 5,000.
- **Great Mosque of Djenné**: Capacity corrected to **1,000** (interior; sources: Google Arts & Culture, Wikipedia). Previously 3,000. Area 75×75 m = 5,625 m² unchanged.
- **Badshahi Mosque**: 100,000 total (10k hall + 90k courtyard); 1673; courtyard ~25,900 m² — confirmed.

### Fact-check schedule & log

**Keep fact-checking:** run `npm run fact-check` to print a checklist of all mosques (capacity, area, established). Re-verify using the source hierarchy above; document corrections here and in "Latest audit," then update `src/data/mosques.json` as needed.

| Date       | Scope                    | Notes |
|------------|--------------------------|--------|
| 2025-02    | Process added            | Checklist script + this log. Next: quarterly top 10–15 re-audit. |
| 2025-02    | Country expansion        | Added 11 mosques: Afghanistan (Kabul), Jordan (Amman), Qatar (Doha), Bahrain (Manama), Senegal (Dakar), Azerbaijan (Baku), Lebanon (Beirut), Sudan (Khartoum), Bosnia (Sarajevo), Kazakhstan (Astana), Tunisia (Tunis). |
| 2025-02    | Address & fact-check     | Added optional `address` field to Mosque type. 10 mosques now have street addresses (Masjid al-Haram, Al-Masjid an-Nabawi, Al-Aqsa, Sheikh Zayed, Hassan II, Blue Mosque, Faisal, Badshahi, Sultan Qaboos, Istiqlal). Fact-check script enhanced with address column and summary. |

---

## 2. Quran references

### What to verify
- **Verse text** – Exact wording; use a single published translation (e.g. Sahih International, Yusuf Ali, Pickthall) and state which one.
- **Surah and verse number** – Correct chapter (surah) and verse (ayah) (e.g. 2:144, 3:96).
- **Context** – Verse not quoted out of context; brief context or theme stated where relevant.

### Skills
- **Citation format** – Use standard form: “Surah Name (chapter:verse)” e.g. “Surah Al-Baqarah (2:144).”
- **Translation consistency** – Pick one translation per language for the product and stick to it; note translator in UI or footnote.
- **Avoid interpretation claims** – Present verse and context; avoid stating sect-specific legal or theological conclusions unless clearly attributed.

### Recommended tools & sources
| Purpose | Tool / Source | Notes |
|--------|----------------|--------|
| Quran text & translation | quran.com, Tanzil.net, corpus.quran.com | Multiple translations, searchable |
| Verification | Print editions (e.g. King Fahd Complex print) | Authoritative for Arabic text |
| Cross-check verse numbers | Multiple digital editions | Catch copy-paste errors |
| Tafsir (optional) | Tafsir Ibn Kathir, Tafsir al-Tabari (academic editions) | For context, not for changing wording |

### Checklist before publishing Quran content
- [ ] Surah and verse numbers correct.
- [ ] Arabic and/or translation match a named, published edition.
- [ ] Translation source named (e.g. “Translation: Sahih International”).
- [ ] Quote is not misleading when read in full verse/surrounding context.

---

## 3. Hadith references

### What to verify
- **Wording** – Matches a published collection (e.g. Sahih al-Bukhari, Sahih Muslim); prefer established translations (e.g. Darussalam, USC-MSA).
- **Attribution** – Correct collector (e.g. Bukhari, Muslim) and book/hadith number where applicable.
- **Grade** – If mentioned (sahih, hasan, da’if), cite who graded it (e.g. Al-Albani, traditional scholars).
- **Context** – Avoid using a hadith to support a claim it does not clearly support; note context or scholarly interpretation when relevant.

### Skills
- **Standard citation** – e.g. “Sahih al-Bukhari 1:1” or “Sahih Muslim, Book of Prayer, Hadith 123.” Include book name when possible.
- **Translation consistency** – Use one translator per collection where possible; name the translator/source.
- **Sensitivity** – Hadith vary in authenticity and interpretation; avoid presenting weak or contested hadith as definitive without note.

### Recommended tools & sources
| Purpose | Tool / Source | Notes |
|--------|----------------|--------|
| Hadith search & text | sunnah.com (with book/numbers) | Multiple collections, translations |
| Verification | Print editions (e.g. Darussalam) | For final check of wording |
| Grading | dorar.net (Arabic), scholars’ works | For authenticity grades |
| Cross-check | Multiple digital + one print ref | Catch misattribution |

### Checklist before publishing hadith content
- [ ] Collection and hadith number (or book/chapter) correct.
- [ ] Wording matches a named translation/source.
- [ ] If grade (sahih/hasan/da’if) is stated, source of grading is clear.
- [ ] Hadith is not used to support a claim it doesn’t clearly support.

---

## 4. Process for MosqueList content

1. **Data entry** – Add mosque or content in draft form; tag “needs verification” if single source.
2. **Verification** – Run through the relevant checklist (mosque / Quran / hadith); fill in “Source” or “Last verified” in data/CMS.
3. **Review** – Optional second pair of eyes for holy sites and any scripture.
4. **Publish** – Publish only after checklist is satisfied; keep “Last updated” or “Source” visible where appropriate.
5. **Updates** – Re-verify capacity, facilities, and visitor info periodically (e.g. yearly); correct errors promptly.

---

## 5. Quick reference: citation formats

- **Quran**: `Surah Al-Baqarah (2:144)` – Translation: Sahih International.
- **Hadith**: `Sahih al-Bukhari, Book 1, Hadith 1` – Translation: Darussalam.
- **Mosque stats**: “Capacity: 4,000,000 (official estimate). Source: [Name], [Year].”

Use these consistently in product copy, blogs, and markdown so all content can be checked and updated systematically.

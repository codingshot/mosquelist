# Wikipedia API Guide: Pulling Mosque Data for MosqueList

This guide explains how to pull mosque-related data from Wikipedia’s APIs and how to map it to MosqueList’s `Mosque` data model.

---

## 1. Wikipedia / MediaWiki API Basics

### Base URL and common parameters

- **Base URL:** `https://en.wikipedia.org/w/api.php`
- **Format:** Use `format=json` and `formatversion=2` for consistent JSON.
- **Rate limiting:** Use a descriptive `User-Agent` and avoid heavy burst traffic. See [Wikipedia API etiquette](https://www.mediawiki.org/wiki/API:Etiquette).

### Getting page content (wikitext)

To get the raw wikitext of a page (so you can parse tables yourself):

```
GET https://en.wikipedia.org/w/api.php?action=query&titles=List_of_the_oldest_mosques&prop=revisions&rvprop=content&rvslots=main&formatversion=2&format=json
```

- **`action=query`** – query module  
- **`titles=...`** – page title (use underscores for spaces).  
- **`prop=revisions`** – request revision content.  
- **`rvprop=content`** – return the wikitext.  
- **`rvslots=main`** – main slot (standard for most pages).

Response path: `query.pages[0].revisions[0].slots.main.content` contains the full wikitext.

### Getting parsed HTML (optional)

If you prefer to parse HTML instead of wikitext:

```
GET https://en.wikipedia.org/w/api.php?action=parse&page=List_of_the_oldest_mosques&prop=text&formatversion=2&format=json
```

- **`action=parse`** – parse the page.  
- **`prop=text`** – return parsed HTML in `parse.text["*"]`.

Tables will be in `<table class="wikitable">` with `<tr>`/`<th>`/`<td>`. You can parse them with an HTML parser (e.g. BeautifulSoup, jsdom).

### Discovering sub-pages from “Lists of mosques”

The page [Lists of mosques](https://en.wikipedia.org/wiki/Lists_of_mosques) is an index of list pages by region/country. It has no data tables—only links like `[[List of mosques in India]]`, `[[List of mosques in Kerala]]`, etc.

To get its links programmatically:

1. **Option A:** Fetch wikitext with `action=query` and parse `[[List of mosques in X]]` patterns.  
2. **Option B:** Use `action=parse` with `prop=links` to get `parse.links[].title` and filter for titles starting with `"List of mosques"`.

Use these titles as input to further `action=query` or `action=parse` calls to pull each list’s content.

---

## 2. Source Pages and Data Shapes

### 2.1 List of the oldest mosques

- **URL:** https://en.wikipedia.org/wiki/List_of_the_oldest_mosques  
- **Content:** Multiple tables by region (e.g. “Mentioned in the Quran”, “Northeast Africa”, “Northwest Africa”).

**Typical table columns:**

| Column       | Description        | Example / format                          |
|-------------|--------------------|-------------------------------------------|
| Building    | Mosque name         | `[[Masjid al-Haram\|Al-Haram Mosque]]`   |
| Image       | File link           | `[[File:...]]`                            |
| Location    | City/place          | `[[Mecca]]`, `[[Cairo]]`                  |
| Country     | Country             | `[[Saudi Arabia]]`, `[[Egypt]]`          |
| First built | Date or range       | `{{sort|0622|622}}`, `7th century`, `620s–630s` |
| Tradition   | (some tables)       | Sunni, Shia, or empty                     |
| Notes       | Free text           | History, significance, citations          |

**Parsing notes:**

- **Name:** From `Building`. Strip wiki markup: `[[Page\|Label]]` → use `Label` or `Page`; `[[Page]]` → use `Page`.  
- **Location / Country:** From `Location` and `Country`. Resolve `[[X]]` to `X`.  
- **First built:** Mix of `{{sort|YYYY|...}}`, “Nth century”, “YYYY”, “620s–630s”. Extract year or range for `established`.  
- **Denomination:** From `Tradition` if present (map “Sunni” → `sunni`, “Shia” → `shia`).  
- **Image:** From `[[File:...]]`; convert to Commons URL or use MediaWiki image API for a thumbnail.

---

### 2.2 List of largest mosques

- **URL:** https://en.wikipedia.org/wiki/List_of_largest_mosques  
- **Content:** Single sortable table.

**Table columns:**

| Column               | Description         | Example / format                    |
|----------------------|---------------------|-------------------------------------|
| Name                 | Mosque name         | `[[Masjid al-Haram]]`               |
| Image                | File link           | `[[File:...]]`                      |
| Capacity             | Worshippers         | `{{nts|4000000}}`, `130,000`        |
| Area (m²)            | Floor area          | `{{nts|400800}}`, `23,000`          |
| City                 | City                | `[[Mecca]]`, `[[Islamabad]]`        |
| Country              | Country (with flag) | `{{flag|Saudi Arabia}}`             |
| Year of first building | Year              | `{{sort|01|Pre-622}}`, `1986`, `2023` |
| Denomination         | Sunni/Shia/etc.     | `[[Sunni]]`, `[[Shia]]`             |

**Parsing notes:**

- **Name:** From `Name`; resolve `[[X]]` / `[[X|Y]]` as above.  
- **Capacity:** From `Capacity`. Strip `{{nts|...}}` and commas; parse integer. Maps to MosqueList `capacity`.  
- **Area:** From `Area (m²)`. Same stripping; maps to MosqueList `area`.  
- **Location:** From `City` (display location).  
- **Country:** From `Country`; `{{flag|X}}` → `X`.  
- **Established:** From “Year of first building”. Handle “Pre-622”, “623”, “1986”, etc.  
- **Denomination:** Map “Sunni” → `sunni`, “Shia” → `shia`; others (e.g. Ibadi, Ahmadi) can be noted or omitted per your policy.

---

### 2.3 List of mosques in India (and other “by country” lists)

- **URL:** https://en.wikipedia.org/wiki/List_of_mosques_in_India  
- **Content:** Sections by state/union territory; each section often has a table.

**Typical columns:**

| Column          | Description      | Example / format              |
|-----------------|------------------|------------------------------|
| Name            | Mosque name      | `[[Jama Masjid, Delhi\|Jama Masjid]]` |
| Location        | City/region      | `[[Central Delhi]]`, `[[Bhopal]]`     |
| Image           | File link        | `[[File:...]]`               |
| Year            | Built / founded  | `1656`, `629 CE`, `1871 CE`  |
| Religious branch| Denomination     | `[[Sunni Islam\|Sunni]]`, `[[Shia]]`  |
| Remarks         | Notes            | History, capacity, significance       |

**Parsing notes:**

- **Country:** Fixed: “India” for this list. For “List of mosques in X”, country = X (with normalisation, e.g. “United Kingdom” for “List of mosques in the United Kingdom”).  
- **Location:** From `Location` (city/region).  
- **Name, Year, Denomination:** Same idea as above; “Year” → `established`.  
- **Remarks:** Can feed `significance`, `history`, or `architectureNotes` after cleaning.

Other “List of mosques in [Country]” pages (linked from [Lists of mosques](https://en.wikipedia.org/wiki/Lists_of_mosques)) have similar structure; column names may vary slightly (e.g. “Year” vs “First built”), so normalize column headers when you design your parser.

---

### 2.4 Lists of mosques (index)

- **URL:** https://en.wikipedia.org/wiki/Lists_of_mosques  
- **Content:** No data tables; lists of links to:

  - **By region/country:** e.g. List of mosques in India, List of mosques in Indonesia.  
  - **Thematic:** List of largest mosques, List of tallest mosques, List of the oldest mosques.

Use this page to **discover** which list pages to pull (by country/region and theme), then use the same API and parsing approach as above for each linked list.

---

### 2.5 Islamic architecture

- **URL:** https://en.wikipedia.org/wiki/Islamic_architecture  
- **Content:** Long narrative + infobox; **no standard mosque table**. It mentions many mosques (e.g. Dome of the Rock, Great Mosque of Damascus, Al-Aqsa, Great Mosque of Kairouan, Ibn Tulun, Al-Azhar) and styles (Umayyad, Abbasid, Fatimid, etc.).

**Use for MosqueList:**

- **Architectural style:** When you already have a mosque (from another list), you can try to match its name to mentions here and assign or suggest `architecturalStyle` / `architectureNotes` (e.g. “Umayyad”, “Fatimid”).  
- **Cross-check:** Names and dates mentioned in the text can validate or enrich `established` and `history`.  
- **No bulk extraction:** Not suitable as a primary table source; use “oldest”, “largest”, and “by country” lists for that.

---

## 3. MosqueList `Mosque` Type (reference)

Relevant fields from `src/types/mosque.ts` for mapping:

| Field               | Type                    | Required | Notes |
|---------------------|-------------------------|----------|--------|
| `id`                | string                  | Yes      | Slug; generate from name + location/country. |
| `name`             | string                  | Yes      | Display name. |
| `arabicName`       | string?                 | No       | Not in Wikipedia tables; leave empty or add from elsewhere. |
| `location`         | string                  | Yes      | City/region. |
| `country`          | string                  | Yes      | Normalise to one form (e.g. “Saudi Arabia”). |
| `address`          | string?                 | No       | Rare in list pages. |
| `coordinates`       | `{ lat, lng }?`         | No       | Not in tables; use geocoding or separate API. |
| `capacity`         | number                  | Yes      | From “largest” list; default 0 if unknown. |
| `established`       | string                  | Yes      | Year or range (e.g. “622 CE”, “14th century”, “1300–1399”). |
| `area`             | number                  | Yes      | m²; from “largest” list; default 0 if unknown. |
| `annualVisitors`   | string                  | Yes      | Not in these lists; use “—” or “Unknown”. |
| `facilities`        | string[]                | Yes      | Not in lists; use `[]`. |
| `significance`      | string                  | Yes      | Can come from “Notes” / “Remarks”. |
| `description`       | string                  | Yes      | Short summary; can derive from notes. |
| `imageUrl`          | string                  | Yes      | From `[[File:...]]` via Commons/API. |
| `imageLocal`        | string?                 | No       | Your own assets. |
| `galleryUrls`       | string[]?               | No       | Optional. |
| `isHolySite`        | boolean                 | Yes      | Set true for Haram, Nabawi, Al-Aqsa, etc. |
| `architecturalStyle`| string?                 | No       | From “Islamic architecture” or notes. |
| `architectureNotes`| string?                 | No       | From notes. |
| `history`           | string?                 | No       | From “Notes” / “Remarks”. |
| `tourismNotes`      | string?                 | No       | Rare in lists. |
| `officialWebsite`   | string?                 | No       | Rare in lists. |
| `womenPrayerArea`   | boolean                 | Yes      | Default true if unknown. |
| `touristFriendly`   | boolean                 | Yes      | Default or infer from significance. |
| `denomination`      | "sunni" \| "shia"?      | No       | From Tradition / Religious branch / Denomination. |
| `sources`           | string[]?               | No       | Add Wikipedia page URL and list URL. |
| Other optional     | …                       | No       | constructionCost, status, youtubeVideoId, etc. |

---

## 4. Matching Wikipedia Data to MosqueList

### 4.1 Field mapping summary

| MosqueList field   | Oldest list           | Largest list          | By-country list (e.g. India) |
|--------------------|------------------------|------------------------|--------------------------------|
| `name`             | Building               | Name                  | Name                          |
| `location`         | Location               | City                  | Location                      |
| `country`         | Country                | Country               | Fixed per list                |
| `established`      | First built            | Year of first building| Year                          |
| `capacity`         | —                      | Capacity              | Sometimes in Remarks          |
| `area`             | —                      | Area (m²)             | Sometimes in Remarks          |
| `denomination`     | Tradition              | Denomination          | Religious branch              |
| `significance` / `history` | Notes         | —                     | Remarks                       |
| `imageUrl`         | Image                  | Image                 | Image                         |
| `sources`          | —                      | —                     | Add list URL + article link  |

### 4.2 Parsing wikitext

- **Links:** `[[Page]]` → `Page`; `[[Page|Label]]` → use `Label` for display, `Page` for canonical name/ID.  
- **Templates:**  
  - `{{sort|YYYY|Display}}` → use `Display` for display, `YYYY` for sorting/normalisation.  
  - `{{nts|N}}` → number `N`.  
  - `{{flag|Country}}` → `Country`.  
- **Files:** `[[File:Name.jpg|...]]` → use [Commons](https://commons.wikimedia.org/wiki/Commons:API) or [MediaWiki image API](https://www.mediawiki.org/wiki/API:Imageinfo) to get a URL (e.g. `https://upload.wikimedia.org/wikipedia/commons/...`).  
- **Dates:** Support “YYYY”, “Nth century”, “Pre-622”, “620s–630s”, “YYYY–YYYY”. Reuse or mirror logic in `src/lib/timeline-utils.ts` (e.g. `parseEstablishmentYear`, `formatEstablishmentRange`) so `established` is consistent with the rest of the app.

### 4.3 Normalisation and deduplication

- **Names:** Trim whitespace; optionally normalise “Masjid”/“Mosque” variants when matching.  
- **Countries:** One canonical form per country (e.g. “Saudi Arabia”, “India”, “State of Palestine”). Map Wikipedia country names and `{{flag|X}}` to that.  
- **IDs:** Generate stable `id` (e.g. slug from normalised name + country, or name + city).  
- **Deduplication:** Same mosque can appear in “oldest”, “largest”, and “List of mosques in X”. Match by normalised name + country (and optionally city). Merge fields: e.g. capacity/area from “largest”, first-built from “oldest”, remarks from any. Prefer one record per physical mosque.

### 4.4 Required defaults when Wikipedia has no value

- **capacity / area:** Use `0` if not in “largest” (or not parsed).  
- **annualVisitors:** e.g. `"Unknown"` or `"—"`.  
- **facilities:** `[]`.  
- **description:** Short line from Notes/Remarks or “Historic mosque in [Location].”  
- **imageUrl:** Use a placeholder image or fetch from first `[[File:...]]` in the row; if none, use a default or leave to manual enrichment.  
- **isHolySite:** Only true for known holy sites (e.g. Haram, Nabawi, Al-Aqsa).  
- **womenPrayerArea / touristFriendly:** Defaults (e.g. `true` and `false`) unless you have a policy to infer from text.

### 4.5 Source attribution

- Set `sources` to include at least:  
  - The Wikipedia list URL (e.g. `https://en.wikipedia.org/wiki/List_of_the_oldest_mosques`).  
  - The individual article URL when the name is a link (e.g. `https://en.wikipedia.org/wiki/Masjid_al-Haram`).  
This supports fact-checking and aligns with existing `sources` usage in the codebase.

---

## 5. Suggested workflow

1. **Discover lists:** From “Lists of mosques”, get all “List of mosques in X” and thematic list titles.  
2. **Fetch:** For each list, `action=query` with `prop=revisions&rvprop=content` (or `action=parse&prop=text` for HTML).  
3. **Parse tables:** Identify wikitable blocks (by section or by `{| class="wikitable"` in wikitext); parse rows and cells; strip/wiki-resolve links and templates.  
4. **Map to Mosque:** For each row, map columns to `Mosque` using the table above; apply defaults; normalise country and dates.  
5. **Merge:** Match rows from different lists (name + country, and optionally location); merge into one record per mosque.  
6. **IDs and images:** Generate `id`; resolve first image in row to `imageUrl` via Commons/API.  
7. **Validate:** Run date logic (e.g. `validateMosqueDate`), check required fields, then export or feed into your JSON/data pipeline.

---

## 6. Example API calls (curl)

```bash
# Wikitext of "List of the oldest mosques"
curl -s "https://en.wikipedia.org/w/api.php?action=query&titles=List_of_the_oldest_mosques&prop=revisions&rvprop=content&rvslots=main&formatversion=2&format=json" | jq '.query.pages[0].revisions[0].slots.main.content' -r

# Wikitext of "List of largest mosques"
curl -s "https://en.wikipedia.org/w/api.php?action=query&titles=List_of_largest_mosques&prop=revisions&rvprop=content&rvslots=main&formatversion=2&format=json" | jq '.query.pages[0].revisions[0].slots.main.content' -r

# Wikitext of "List of mosques in India"
curl -s "https://en.wikipedia.org/w/api.php?action=query&titles=List_of_mosques_in_India&prop=revisions&rvprop=content&rvslots=main&formatversion=2&format=json" | jq '.query.pages[0].revisions[0].slots.main.content' -r

# Links from "Lists of mosques" (parse page, get links)
curl -s "https://en.wikipedia.org/w/api.php?action=parse&page=Lists_of_mosques&prop=links&formatversion=2&format=json" | jq '.parse.links[].title' | grep -i "list of mosque"
```

---

## 7. References

- [MediaWiki API: Main page](https://www.mediawiki.org/wiki/API:Main_page)  
- [API:Query](https://www.mediawiki.org/wiki/API:Query)  
- [API:Parse](https://www.mediawiki.org/wiki/API:Parsing_wikitext)  
- [API:Imageinfo](https://www.mediawiki.org/wiki/API:Imageinfo) (for image URLs)  
- MosqueList: `src/types/mosque.ts`, `src/lib/timeline-utils.ts`, `docs/mosque-data-gaps.md`

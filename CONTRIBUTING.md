# Contributing to MosqueList

Thank you for helping improve MosqueList. You can add new mosques, fix existing data, or suggest features.

## How to contribute

1. **Report issues or suggest mosques**  
   Open an issue on GitHub: [github.com/codingshot/mosquelist/issues](https://github.com/codingshot/mosquelist/issues)  
   When you click **New issue**, choose a template:
   - **Bug report** — something isn’t working (include device, browser, steps)
   - **Feature request** — an idea or improvement
   - **Mosque suggestion / data correction** — new mosque or fix to existing data (include sources)
   - **General feedback** — anything else (usability, content, questions)

2. **Use the in-app Contributing guide**  
   The app has a **Contribute** page with:
   - JSON schema and examples (including multiple images, capacity, architecture style)
   - A form that generates mosque JSON
   - Where to add data in the repo (`src/data/mosques.json`)
   - Gaps: countries and cities that don’t have mosques yet, and cities where more mosques are needed  

   Open **Contribute** from the footer (or go to `/contributing`).

3. **Submit changes**
   - Fork the repo: [github.com/codingshot/mosquelist](https://github.com/codingshot/mosquelist)
   - Add or edit entries in `src/data/mosques.json` (one object per mosque inside the `mosques` array)
   - Use the schema and examples on the Contribute page; keep `id` URL-safe (lowercase, hyphens)
   - Add at least one **source** (e.g. Wikipedia or official site) in the `sources` array
   - For new mosques, prefer images from Wikimedia Commons (CC) and set `imageUrl`; optional `galleryUrls` for extra photos
   - Open a Pull Request with a short description of what you added or changed

## Data quality

- **Capacity** and **area**: Prefer official or cited figures; note in the description if approximate.
- **Established**: Use "YYYY CE" or "YYYY" (e.g. `"2007"`, `"638 CE"`).
- **id**: Unique, lowercase, hyphenated slug (e.g. `sheikh-zayed-grand-mosque`). No spaces or special characters.
- **touristFriendly**: `true` only if non-Muslims are clearly allowed to visit (tours, open hours).
- **isHolySite**: `true` only for the three holiest sites (Mecca, Medina, Al-Aqsa).

## File structure

- **Mosque data:** `src/data/mosques.json` — add new mosque objects to the `mosques` array.
- **Curated lists:** `src/data/lists.json` — list slugs and `mosqueIds`; after adding a mosque, run `npm run update-lists` to refresh lists.
- **Docs:** `docs/mosque-data-prompt.md` (schema and research workflow), `docs/missing-countries-and-mosques.md` (gaps and priorities).

## Questions?

Open an issue or discussion at [github.com/codingshot/mosquelist](https://github.com/codingshot/mosquelist).

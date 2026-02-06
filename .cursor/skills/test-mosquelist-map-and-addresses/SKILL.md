---
name: test-mosquelist-map-and-addresses
description: Test MosqueList map view (OpenStreetMap), country/region filters, and address-vs-coordinates display. Use when testing the map page, location display, or when the user asks to test map or address behavior.
---

# Testing MosqueList Map and Addresses

## When to Use

- After changing map page, region/country filters, or Leaflet/OSM integration.
- After changing mosque location display (address vs coordinates).
- When verifying map or address behavior before release.

## Automated Tests (Vitest)

Run:

```bash
npm run test
```

Relevant test files:

- **Map and filters**: `src/test/map-and-addresses.test.ts` — map data filtering (mosques with coords, region/country filter), route and nav presence, location display priority (address over coordinates).
- **Integration**: Optional component tests for MapPage (with Leaflet mocked) or ExplorePage containing Map link.

What is tested:

- Mosques with coordinates are countable; filtering by country/region reduces the list correctly.
- App has route `/map` and Navigation has a "Map" link.
- Location display: when a mosque has `address`, it is preferred over `coordinates`; when only `coordinates`, they are used; fallback is `location, country`.

## Manual Testing (Browser)

1. **Start dev server**: `npm run dev`. Open the app (e.g. http://localhost:5173).

2. **Map page**
   - Go to **Map** via nav or **Explore** → map icon (MapPin) → should land on `/map`.
   - Map loads with OpenStreetMap tiles; markers for mosques with coordinates are visible.
   - **Region** dropdown: choose a region → map zooms to fit markers in that region; only those markers show.
   - **Country** dropdown: choose a country → map zooms to that country; only that country’s markers show.
   - Combined: set region then country (or vice versa) → map and markers match both filters.
   - "All regions" / "All countries" → world view, all markers shown.
   - Click a marker → popup with mosque name, location, and "View mosque" link → link goes to mosque detail page.

3. **Address vs coordinates**
   - On **Explore** or a **mosque detail** page, for a mosque that has `address` in data: displayed location should show the address (not lat/lng).
   - For a mosque with only `coordinates`: display should show coordinates (or "location, country" if no coords).
   - Check at least one of each type in `src/data/mosques.json`.

4. **Explore → Map**
   - On Explore page, use the map icon (MapPin) in the toolbar → should navigate to `/map`.

## Quick Checklist

- [ ] `npm run test` passes.
- [ ] Nav has "Map"; `/map` loads Map page.
- [ ] Map shows OSM tiles and markers; region/country dropdowns filter and zoom.
- [ ] Mosque popup "View mosque" opens correct mosque page.
- [ ] Mosque cards/detail show address when present, else coordinates/location.

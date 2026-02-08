# Filters Improvement — MosqueList

Outline of **current filters**, **recent improvements** (visitor access and facilities), and **where better filters can be added** across the app. Use with [socratic-prompts.md](./socratic-prompts.md) when adding or changing filters.

**Last updated:** 2026-02-07

---

## 1. Current filters

### Explore page (`/explore`)

| Location | What | URL params | Notes |
|----------|------|------------|--------|
| **Quick filters** (bar) | All, Holy Sites, **Visitors** (non-Muslims can visit), Biggest | `filter=all|holy|tourist|biggest` | One at a time. "Visitors" = `touristFriendly`. |
| **Advanced filters** (sheet) | Region, Country, Denomination, Architectural style | `region`, `country`, `denomination`, `style` | Select one each. |
| **Visitor access** (sheet) | Non-Muslims can visit only, Women's prayer area only | `tourist=1`, `women=1` | Checkboxes. |
| **Facilities** (sheet) | Has guided tours, Wheelchair accessible | `facilityGuided=1`, `facilityWheelchair=1` | Matches mosque `facilities` text (e.g. "Guided tours", "Wheelchair access"). |
| **Numeric** (sheet) | Capacity min/max, Area min/max, Established year range | `capMin`, `capMax`, `areaMin`, `areaMax`, `estMin`, `estMax` | Number inputs. |
| **Search** | Full-text (name, location, description, etc.) | `q` | Debounced. |
| **Sort** | Holy first, Name, Capacity, Area, Date, Country | `sort` | Single select. |

All explore params are in the URL so results are shareable and back/forward work.

### Map page (`/map`)

| Location | What | Notes |
|----------|------|--------|
| **Region** | Dropdown | Filters markers and zoom. |
| **Country** | Dropdown | Filters markers and zoom. |

Map does **not** currently use visitor/facility filters; it shows all mosques with coordinates that match region/country only. Applying explore-style filters (tourist, facilities) on the map is a possible improvement.

### Timeline (`/timeline`)

| Location | What | Notes |
|----------|------|--------|
| **Region** | Dropdown | Filters events by mosque country’s region. |
| **Country** | Dropdown | Filters events by mosque country. |

No visitor/facility filters. Adding "Non-Muslims can visit" or "Has guided tours" would help visitors plan.

### List detail (`/lists/:slug`)

| Location | What | Notes |
|----------|------|--------|
| **Tabs** | All, In My List, Not in My List | Filters the list’s mosques by bucket list membership. |

No country/region or visitor/facility filters. For long lists, extra filters could reduce clutter.

### Bucket list (My List)

| Location | What | Notes |
|----------|------|--------|
| **Filter** | All, Unvisited, Visited | Filters by visited status. |
| **Sort** | List order, Name, Country, Visited first | In-memory only. |

No facility or visitor filters; could add "Show only visitor-friendly" for planning trips.

---

## 2. Data behind filters

- **Non-Muslims can visit:** `mosque.touristFriendly` (boolean). Shown as "Non-Muslims welcome" on cards and "Visitor access & facilities" on mosque page.
- **Women's prayer area:** `mosque.womenPrayerArea` (boolean).
- **Facilities:** `mosque.facilities` (string[]). Advanced filters use substring match:
  - **Guided tours:** `facilities` contains text matching `/guided|tour/i`.
  - **Wheelchair accessible:** `facilities` contains text matching `/wheelchair|accessible/i`.

Adding more facility-based filters (e.g. "Library", "Parking") would require consistent wording in `mosques.json` or a small set of canonical facility tags.

---

## 3. Where better filters can be added

| Place | Current | Possible improvement |
|-------|---------|----------------------|
| **Explore** | Quick: All, Holy, Visitors, Biggest. Advanced: region, country, denomination, style, visitor/facility checkboxes, numeric. | Add more facility checkboxes (e.g. Library, Women's area as facility tag). Sort by "Visitor-friendly first". |
| **Map** | Region, country only. | Add "Non-Muslims can visit" and/or "Has guided tours" so map shows only visitor-friendly or tour-friendly mosques. |
| **Timeline** | Region, country. | Add "Non-Muslims can visit" so timeline shows only mosques open to visitors. |
| **List detail** | In list / not in list. | Add country or region filter for long lists; optional "Visitor-friendly only" for trip planning. |
| **Bucket list** | All / unvisited / visited. | Add "Visitor-friendly only" toggle to focus on mosques that allow non-Muslim visitors. |
| **Mosque page** | — | "Related mosques" could be filterable (e.g. same country, same style, or visitor-friendly). |
| **Home preview** | No filters (fixed sort/limit). | Optional: "Show only visitor-friendly" for the explore preview block. |

---

## 4. Consistency and copy

- **Label:** Use "Non-Muslims can visit" in advanced filters and chips; use "Non-Muslims welcome" on cards and mosque page. Quick filter button: "Visitors" with title "Non-Muslims can visit".
- **URL params:** Keep `tourist=1` for backward compatibility; document in this file.
- **Facilities:** Document which facility strings are used for filtering (guided/tour, wheelchair/accessible) so data entry stays consistent. See [mosque-data-gaps.md](./mosque-data-gaps.md) and [skills.md](./skills.md) for data quality.

---

## 5. Cross-reference

- **Explore URL builder:** `src/lib/explore-url.ts` (params for sharing).
- **Explore filters state:** `src/components/MosqueGrid.tsx` (`useMosqueSearchParams`, `filteredMosques`).
- **Mosque type:** `src/types/mosque.ts` (`touristFriendly`, `womenPrayerArea`, `facilities`).
- **Data quality:** [skills.md](./skills.md), [mosque-data-gaps.md](./mosque-data-gaps.md).

Use this doc when adding a new filter (where it lives, param name, and how it fits with existing filters).

# Fact-checking mosque data

Guidance for verifying mosque information, especially **capacity**, **links**, and **dates**, with focus on less well-known mosques where sources are scarcer.

## Why fact-check

- **Capacity** is often misreported (round numbers, confusion between indoor vs total, outdated figures).
- **Establishment/completion dates** vary by source (foundation vs completion vs renovation).
- **Sources** give users and maintainers a trail to verify and update data.

## Methodology

1. **Capacity**
   - Prefer official mosque or government/tourism sources.
   - Wikipedia is useful but check the cited references; capacity may be "up to X" or "X inside + Y in courtyard."
   - For historic mosques, capacity is rarely documented; use area-based estimates only when clearly noted (e.g. "577 m² total" → small capacity, not 5,000).

2. **Establishment / completion**
   - Distinguish "founded," "construction started," "completed," "rebuilt."
   - Use the date that best matches the current structure (e.g. "1824 (current building 1932)" for Sultan Mosque Singapore).

3. **Area**
   - Use building footprint or total complex area when available (m²). Avoid 0 when a reliable figure exists.

4. **Sources**
   - Add a `sources` array (URL strings) to every mosque. Prefer:
     - Wikipedia (en) article for the mosque
     - Official mosque or government/tourism site
     - UNESCO or other authoritative heritage listing when relevant
   - Mosque page in the app renders these as clickable links.

5. **Testing links**
   - Manually spot-check: open key Wikipedia and official URLs.
   - Optional: run a link-checker or `scripts/fact-check-validate.js` to list mosques still missing sources.

6. **Coordinates, address, and official website**
   - **Coordinates:** When present, `lat` must be in [-90, 90] and `lng` in [-180, 180]. The fact-check script and `src/data/mosques.test.ts` enforce this.
   - **Address:** Optional; when present must be a non-empty string (trimmed). Empty or whitespace-only triggers a warning.
   - **officialWebsite:** Optional; when present must be a valid `http://` or `https://` URL. Do not set `officialWebsite: null`—omit the key if unknown. The validator flags null or invalid URLs.

## Corrections applied (recent)

| Mosque | Change | Source |
|--------|--------|--------|
| **Imperial Mosque, Pristina** | Capacity 5,000 → 800; area 2,500 → 577 (Wikipedia: total area 577 m²; no published capacity; 800 is estimate for small historic prayer hall). Added sources. | [Wikipedia](https://en.wikipedia.org/wiki/Imperial_Mosque_(Pristina)) |
| **Grand Mosque of Sabilal Muhtadin, Banjarmasin** | Established 1974 → 1984; added capacity note in description (15,000: 7,500 inside + 7,500 courtyard). Added sources. | [Wikipedia](https://en.wikipedia.org/wiki/Grand_Mosque_of_Sabilal_Muhtadin) |
| **Sultan Haji Hassanal Bolkiah, Cotabato** | No data change; capacity 15,000 confirmed. Added sources. | [Wikipedia](https://en.wikipedia.org/wiki/Sultan_Haji_Hassanal_Bolkiah_Mosque) |
| **Kalon Mosque, Bukhara** | Capacity 12,000 confirmed. Added sources. | [Wikipedia Kalan Mosque](https://en.wikipedia.org/wiki/Kalan_Mosque), [Po-i-Kalyan](https://en.wikipedia.org/wiki/Po-i-Kalyan) |
| **Et'hem Bey Mosque, Tirana** | No capacity change (2,000); no official figure found. Added sources. | [Wikipedia](https://en.wikipedia.org/wiki/Et'hem_Bey_Mosque) |
| **Türkmenbaşy Ruhy Mosque, Gypjak** | Area 0 → 18,000 m²; capacity 10,000 confirmed. Added sources. | [Wikipedia](https://en.wikipedia.org/wiki/Türkmenbaşy_Ruhy_Mosque) |
| **Sultan Mosque, Singapore** | Capacity 5,000 confirmed. Added sources. | [Wikipedia](https://en.wikipedia.org/wiki/Sultan_Mosque,_Singapore), [sultanmosque.sg](https://www.sultanmosque.sg) |

## Ongoing

- Run `node scripts/fact-check-validate.js` after data changes to refresh `docs/fact-check-report.md`.
- Prioritize adding **sources** to mosques that still have no `sources` array (see report).
- For less well-known mosques, prefer at least one Wikipedia or official link before publishing capacity or date changes.

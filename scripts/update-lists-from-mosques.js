/**
 * Update curated lists from current mosque data:
 * 1. AUDIT: Remove any list mosqueIds that don't exist in mosques (validate all lists).
 * 2. COUNTRY LISTS: Ensure every country with ≥1 mosque has a list; set each country list to ALL mosque IDs from that country.
 * 3. Biggest-mosques: add top by capacity up to cap, keeping order.
 * 4. Century lists: add mosques whose established year falls in that century.
 *
 * Run: node scripts/update-lists-from-mosques.js
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const dataDir = join(root, "src/data");

const mosquesData = JSON.parse(readFileSync(join(dataDir, "mosques.json"), "utf-8"));
const listsData = JSON.parse(readFileSync(join(dataDir, "lists.json"), "utf-8"));

const mosques = mosquesData.mosques || [];
const validIdSet = new Set(mosques.map((m) => m.id));
const mosquesById = new Map(mosques.map((m) => [m.id, m]));

/** Convert country name to list slug (e.g. "Saudi Arabia" -> "saudi-arabia", "UAE" -> "uae"). */
function countryNameToSlug(countryName) {
  if (!countryName || typeof countryName !== "string") return "";
  return countryName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/** Build map: country slug -> { name, mosqueIds } from mosque data. */
function buildCountryMap(mosques) {
  const map = new Map();
  for (const m of mosques) {
    const country = m.country?.trim();
    if (!country) continue;
    const slug = countryNameToSlug(country);
    if (!slug) continue;
    if (!map.has(slug)) map.set(slug, { name: country, mosqueIds: [] });
    map.get(slug).mosqueIds.push(m.id);
  }
  for (const entry of map.values()) {
    entry.mosqueIds.sort();
  }
  return map;
}

/** Parse first numeric year from established string. */
function parseYear(established) {
  if (!established || typeof established !== "string") return 0;
  const str = established.toLowerCase();
  const centuryMatch = str.match(/(\d{1,2})(?:st|nd|rd|th)\s*century/i);
  if (centuryMatch) {
    const c = parseInt(centuryMatch[1], 10);
    return (c - 1) * 100 + 50;
  }
  const match = str.match(/\d{1,4}/);
  return match ? parseInt(match[0], 10) : 0;
}

const centuryRanges = {
  "7th-century": [600, 699],
  "8th-century": [700, 799],
  "9th-century": [800, 899],
  "10th-century": [900, 999],
  "12th-century": [1100, 1199],
  "16th-century": [1500, 1599],
  "17th-century": [1600, 1699],
  "20th-century": [1900, 1999],
  "21st-century": [2000, 2099],
};

const countryMap = buildCountryMap(mosques);
const existingSlugs = new Set((listsData.lists || []).map((l) => l.slug));

const lists = listsData.lists || [];
const updated = [];
let removedInvalid = 0;
let countryListsUpdated = 0;
let countryListsAdded = 0;
let addedByBiggest = 0;
let addedByCentury = 0;

for (const list of lists) {
  const slug = list.slug;
  const isCountryList = countryMap.has(slug);

  if (isCountryList) {
    const { name, mosqueIds: ids } = countryMap.get(slug);
    updated.push({
      slug,
      name: list.name || name,
      description: list.description || `Mosques in ${name}.`,
      mosqueIds: ids,
    });
    countryListsUpdated++;
    continue;
  }

  let mosqueIds = [...(list.mosqueIds || [])];
  const before = mosqueIds.length;
  mosqueIds = mosqueIds.filter((id) => validIdSet.has(id));
  removedInvalid += before - mosqueIds.length;
  const existingSet = new Set(mosqueIds);

  if (slug === "biggest-mosques") {
    const byCapacity = [...mosques]
      .filter((m) => !existingSet.has(m.id) && (m.capacity || 0) > 0)
      .sort((a, b) => (b.capacity || 0) - (a.capacity || 0));
    const cap = 60;
    for (const m of byCapacity) {
      if (mosqueIds.length >= cap) break;
      mosqueIds.push(m.id);
      existingSet.add(m.id);
      addedByBiggest++;
    }
  }

  const range = centuryRanges[slug];
  if (range) {
    const [minY, maxY] = range;
    const inCentury = mosques.filter((m) => {
      const y = parseYear(m.established);
      return y >= minY && y <= maxY && !existingSet.has(m.id);
    });
    for (const m of inCentury) {
      mosqueIds.push(m.id);
      existingSet.add(m.id);
      addedByCentury++;
    }
  }

  updated.push({
    slug: list.slug,
    name: list.name,
    description: list.description,
    mosqueIds,
  });
}

// Add a list for every country that has mosques but no list yet
const countrySlugsSorted = [...countryMap.keys()].sort((a, b) => {
  const nameA = countryMap.get(a).name;
  const nameB = countryMap.get(b).name;
  return nameA.localeCompare(nameB);
});
for (const slug of countrySlugsSorted) {
  if (existingSlugs.has(slug)) continue;
  const { name, mosqueIds } = countryMap.get(slug);
  updated.push({
    slug,
    name,
    description: `Mosques in ${name}.`,
    mosqueIds,
  });
  countryListsAdded++;
}

const output = { lists: updated };
writeFileSync(join(dataDir, "lists.json"), JSON.stringify(output, null, 2), "utf-8");

console.log("[update-lists-from-mosques] Done.");
console.log("  Removed invalid refs (audit):", removedInvalid);
console.log("  Country lists updated (full mosque set):", countryListsUpdated);
console.log("  Country lists added (new countries):", countryListsAdded);
console.log("  Added by biggest-mosques:", addedByBiggest);
console.log("  Added by century:", addedByCentury);
console.log("  Total lists now:", updated.length);

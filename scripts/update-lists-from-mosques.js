/**
 * Update curated lists from current mosque data:
 * 1. Remove any list mosqueIds that don't exist in mosques (validate).
 * 2. For country lists: add all mosques from that country not already in the list.
 * 3. For biggest-mosques: add top mosques by capacity up to a cap, keeping existing order.
 * 4. For century lists (7th–21st): add mosques whose established year falls in that century.
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

/** Parse first numeric year from established string (e.g. "638 CE" -> 638, "15th century" -> 1450). */
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

/** Century list slug -> [minYear, maxYear] (inclusive). */
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

/** List slug -> country name in mosque data. */
const slugToCountry = {
  "saudi-arabia": "Saudi Arabia",
  turkey: "Turkey",
  pakistan: "Pakistan",
  indonesia: "Indonesia",
  egypt: "Egypt",
  uae: "UAE",
  india: "India",
  malaysia: "Malaysia",
  morocco: "Morocco",
  iraq: "Iraq",
  iran: "Iran",
  kazakhstan: "Kazakhstan",
  syria: "Syria",
  yemen: "Yemen",
  lebanon: "Lebanon",
  bahrain: "Bahrain",
  kuwait: "Kuwait",
  algeria: "Algeria",
  china: "China",
  philippines: "Philippines",
  uzbekistan: "Uzbekistan",
  kosovo: "Kosovo",
  albania: "Albania",
  tunisia: "Tunisia",
  usa: "USA",
};

const lists = listsData.lists || [];
const updated = [];
let removedCount = 0;
let addedByCountry = 0;
let addedByBiggest = 0;
let addedByCentury = 0;

for (const list of lists) {
  const slug = list.slug;
  let mosqueIds = [...(list.mosqueIds || [])];

  // 1. Validate: keep only IDs that exist
  const before = mosqueIds.length;
  mosqueIds = mosqueIds.filter((id) => validIdSet.has(id));
  removedCount += before - mosqueIds.length;

  const existingSet = new Set(mosqueIds);

  // 2. Country lists: add all mosques from that country
  const country = slugToCountry[slug];
  if (country) {
    const fromCountry = mosques
      .filter((m) => m.country === country && !existingSet.has(m.id))
      .map((m) => m.id);
    for (const id of fromCountry) {
      mosqueIds.push(id);
      existingSet.add(id);
      addedByCountry++;
    }
  }

  // 3. Biggest mosques: add top by capacity not already in list (cap total at 60)
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

  // 4. Century lists: add mosques in that century
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

const output = { lists: updated };
writeFileSync(
  join(dataDir, "lists.json"),
  JSON.stringify(output, null, 2),
  "utf-8"
);

console.log("[update-lists-from-mosques] Done.");
console.log("  Removed invalid refs:", removedCount);
console.log("  Added by country:", addedByCountry);
console.log("  Added by biggest:", addedByBiggest);
console.log("  Added by century:", addedByCentury);

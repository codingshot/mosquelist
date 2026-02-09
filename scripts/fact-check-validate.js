/**
 * Fact-check validation: dates, coordinates, capacity/area sanity, and known reference figures.
 * Run: node scripts/fact-check-validate.js
 * Writes report to docs/fact-check-report.md (and prints summary to stdout).
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dataPath = path.join(root, "src", "data", "mosques.json");
const reportPath = path.join(root, "docs", "fact-check-report.md");

const data = JSON.parse(readFileSync(dataPath, "utf-8"));
const mosques = data.mosques || [];

// --- Date parsing (aligned with timeline-utils logic) ---
function parseEstablishmentYear(established) {
  if (!established || typeof established !== "string") return 0;
  const str = established.toLowerCase();
  const centuryMatch = str.match(/(\d{1,2})(?:st|nd|rd|th)\s*century/i);
  if (centuryMatch) {
    const century = parseInt(centuryMatch[1], 10);
    return (century - 1) * 100 + 50;
  }
  if (str.includes("bce") || str.includes("bc")) {
    const match = str.match(/\d{1,4}/);
    return match ? -parseInt(match[0], 10) : 0;
  }
  const match = str.match(/\d{1,4}/);
  return match ? parseInt(match[0], 10) : 0;
}

const PRE_ISLAMIC_EXCEPTIONS = ["hagia-sophia-istanbul"];
const ISLAM_START = 610;
const FIRST_MOSQUE = 622;
const currentYear = new Date().getFullYear();

function validateDate(established, mosqueId) {
  const year = parseEstablishmentYear(established);
  if (year === 0) return { valid: true, warning: "Could not parse date" };
  if (year > currentYear) return { valid: false, warning: `Date ${year} is in the future` };
  if (PRE_ISLAMIC_EXCEPTIONS.includes(mosqueId)) return { valid: true };
  if (year < ISLAM_START)
    return {
      valid: false,
      warning: `Date ${year} predates Islam (610 CE). Only pre-Islamic structures converted later are valid.`,
    };
  if (year < FIRST_MOSQUE)
    return { valid: true, warning: `Date ${year} is before the Hijrah (622 CE). Verify.` };
  return { valid: true };
}

// --- Known reference figures (from docs/skills.md and Wikipedia list of largest mosques) ---
const REFERENCE_FIGURES = {
  "masjid-al-haram": { capacity: [3_500_000, 4_500_000], area: [350_000, 450_000] },
  "masjid-an-nabawi": { capacity: [1_000_000, 1_500_000], area: [350_000, 400_000] },
  "al-aqsa": { capacity: [5_000, 500_000], area: [100_000, 150_000] },
  "imam-reza-shrine": { capacity: [1_000_000, 1_500_000], area: [500_000, 650_000] },
  "sheikh-zayed-grand-mosque": { area: [110_000, 130_000] },
  "hassan-ii-mosque": { capacity: [80_000, 105_000], area: [80_000, 100_000] },
  "sultan-ahmed-mosque": { area: [4_000, 5_500] },
  "faisal-mosque": { capacity: [74_000, 350_000], area: [120_000, 140_000] },
  "badshahi-mosque": { capacity: [50_000, 100_000], area: [25_000, 30_000] },
  "sultan-qaboos-grand-mosque": { capacity: [18_000, 22_000], area: [400_000, 450_000] },
  "istiqlal-mosque": { area: [90_000, 100_000] },
  "grand-jamia-mosque-lahore": { capacity: [700_000, 900_000], area: [180_000, 220_000] },
  "taj-ul-masajid": { capacity: [165_000, 185_000], area: [40_000, 46_000] },
  "grand-mosque-kuwait": { capacity: [10_000, 70_000], area: [20_000, 50_000] },
  "baitul-mukarram": { capacity: [28_000, 42_000], area: [18_000, 24_000] },
  "putra-mosque": { capacity: [14_000, 16_000] },
  "sultan-omar-ali-saifuddin-mosque": { capacity: [2_500, 3_500] },
  "great-mosque-of-djenne": { capacity: [800, 1_200], area: [5_000, 6_500] },
};

function inRange(value, [low, high]) {
  return value >= low && value <= high;
}

// --- Validation ---
const errors = [];
const warnings = [];
const ids = new Set();

for (const m of mosques) {
  const id = m.id;
  const name = m.name || id;

  if (ids.has(id)) errors.push({ id, name, type: "duplicate_id", message: "Duplicate mosque id" });
  ids.add(id);

  const established = m.established;
  const dateResult = validateDate(established, id);
  if (!dateResult.valid)
    errors.push({ id, name, type: "date", message: dateResult.warning, value: established });
  else if (dateResult.warning)
    warnings.push({ id, name, type: "date", message: dateResult.warning, value: established });

  if (m.coordinates) {
    const { lat, lng } = m.coordinates;
    if (typeof lat !== "number" || lat < -90 || lat > 90)
      errors.push({ id, name, type: "coordinates", message: `Invalid lat: ${lat}` });
    if (typeof lng !== "number" || lng < -180 || lng > 180)
      errors.push({ id, name, type: "coordinates", message: `Invalid lng: ${lng}` });
  }

  const cap = m.capacity;
  if (typeof cap !== "number" || cap < 0)
    errors.push({ id, name, type: "capacity", message: `Capacity must be non-negative number`, value: cap });
  else if (cap > 20_000_000)
    warnings.push({ id, name, type: "capacity", message: `Capacity ${cap.toLocaleString()} is very high; verify source`, value: cap });
  else if (cap === 0)
    warnings.push({ id, name, type: "capacity", message: "Capacity is 0", value: cap });

  const area = m.area;
  if (typeof area !== "number" || area < 0)
    errors.push({ id, name, type: "area", message: "Area must be non-negative number", value: area });
  else if (area > 1_000_000)
    warnings.push({ id, name, type: "area", message: `Area ${area.toLocaleString()} m² is very large; verify source`, value: area });

  const ref = REFERENCE_FIGURES[id];
  if (ref) {
    if (ref.capacity && typeof cap === "number" && cap > 0 && !inRange(cap, ref.capacity))
      warnings.push({
        id,
        name,
        type: "reference_capacity",
        message: `Capacity ${cap.toLocaleString()} outside expected range [${ref.capacity[0].toLocaleString()}, ${ref.capacity[1].toLocaleString()}]`,
        value: cap,
      });
    if (ref.area && typeof area === "number" && area > 0 && !inRange(area, ref.area))
      warnings.push({
        id,
        name,
        type: "reference_area",
        message: `Area ${area.toLocaleString()} m² outside expected range [${ref.area[0].toLocaleString()}, ${ref.area[1].toLocaleString()}]`,
        value: area,
      });
  }

  if (!m.name || String(m.name).trim() === "")
    errors.push({ id, name: id, type: "missing", field: "name" });
  if (!m.location || String(m.location).trim() === "")
    errors.push({ id, name, type: "missing", field: "location" });
  if (!m.country || String(m.country).trim() === "")
    errors.push({ id, name, type: "missing", field: "country" });
  if (!m.sources || !Array.isArray(m.sources) || m.sources.length === 0)
    warnings.push({ id, name, type: "sources", message: "No sources array; add for fact-check trail" });
}

// --- Report ---
const lines = [
  "# Mosque fact-check validation report",
  "",
  "Generated: " + new Date().toISOString().slice(0, 19).replace("T", " ") + " UTC",
  "",
  "**Total mosques:** " + mosques.length,
  "**Errors:** " + errors.length,
  "**Warnings:** " + warnings.length,
  "",
  "---",
  "",
];

if (errors.length > 0) {
  lines.push("## Errors (fix these)\n");
  const byType = {};
  errors.forEach((e) => {
    const t = e.type;
    if (!byType[t]) byType[t] = [];
    byType[t].push(e);
  });
  Object.entries(byType).forEach(([type, list]) => {
    lines.push(`### ${type}`);
    list.forEach((e) => {
      lines.push(`- **${e.name}** (` + (e.id !== e.name ? `\`${e.id}\`` : e.id) + `): ${e.message}`);
      if (e.value !== undefined) lines.push(`  - Value: \`${e.value}\``);
    });
    lines.push("");
  });
}

if (warnings.length > 0) {
  lines.push("## Warnings (review)\n");
  const byType = {};
  warnings.forEach((w) => {
    const t = w.type;
    if (!byType[t]) byType[t] = [];
    byType[t].push(w);
  });
  Object.entries(byType).forEach(([type, list]) => {
    lines.push(`### ${type}`);
    list.forEach((w) => {
      lines.push(`- **${w.name}** (` + (w.id !== w.name ? `\`${w.id}\`` : w.id) + `): ${w.message}`);
      if (w.value !== undefined) lines.push(`  - Value: \`${w.value}\``);
    });
    lines.push("");
  });
}

lines.push("---");
lines.push("");
lines.push("Reference figures from `docs/skills.md` and Wikipedia list of largest mosques. Re-run after data changes: `node scripts/fact-check-validate.js`.");

writeFileSync(reportPath, lines.join("\n"), "utf-8");

console.log("Fact-check validation");
console.log("====================");
console.log("Mosques:", mosques.length);
console.log("Errors:", errors.length);
console.log("Warnings:", warnings.length);
if (errors.length) {
  console.log("\nErrors:");
  errors.slice(0, 15).forEach((e) => console.log("  -", e.id, e.message));
  if (errors.length > 15) console.log("  ... and", errors.length - 15, "more");
}
if (warnings.length && warnings.length <= 20) {
  console.log("\nWarnings:");
  warnings.forEach((w) => console.log("  -", w.id, w.type, w.message));
} else if (warnings.length > 20) {
  console.log("\nWarnings (first 20):");
  warnings.slice(0, 20).forEach((w) => console.log("  -", w.id, w.type, w.message));
  console.log("  ... and", warnings.length - 20, "more. See docs/fact-check-report.md");
}
console.log("\nReport written to docs/fact-check-report.md");

process.exit(errors.length > 0 ? 1 : 0);

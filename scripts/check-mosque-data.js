/**
 * Check mosque data for completeness and issues.
 * Run: node scripts/check-mosque-data.js
 */
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const raw = readFileSync(join(root, "src/data/mosques.json"), "utf-8");
const data = JSON.parse(raw);
const mosques = data.mosques;

const required = ["id", "name", "location", "country", "capacity", "established", "area", "annualVisitors", "facilities", "significance", "description", "imageUrl", "isHolySite", "womenPrayerArea", "touristFriendly"];
const issues = [];
const ids = new Set();

for (const m of mosques) {
  if (ids.has(m.id)) issues.push({ id: m.id, type: "duplicate_id" });
  ids.add(m.id);

  for (const field of required) {
    const v = m[field];
    if (v === undefined || v === null) issues.push({ id: m.id, type: "missing", field });
    else if (field === "imageUrl" && (typeof v !== "string" || v.trim() === "")) issues.push({ id: m.id, type: "empty_image" });
    else if (field === "facilities" && !Array.isArray(v)) issues.push({ id: m.id, type: "invalid", field: "facilities" });
    else if (field === "capacity" && (typeof v !== "number" || v < 0)) issues.push({ id: m.id, type: "invalid", field: "capacity" });
    else if (field === "area" && (typeof v !== "number" || v < 0)) issues.push({ id: m.id, type: "invalid", field: "area" });
  }
}

const missingImage = mosques.filter((m) => !m.imageUrl || (typeof m.imageUrl === "string" && m.imageUrl.trim() === ""));
const missingCoords = mosques.filter((m) => !m.coordinates);
const missingAddress = mosques.filter((m) => !m.address);

console.log("Mosque data check");
console.log("=================");
console.log("Total mosques:", mosques.length);
console.log("With coordinates:", mosques.length - missingCoords.length);
console.log("With address:", mosques.length - missingAddress.length);
console.log("Missing or empty imageUrl:", missingImage.length);
if (missingImage.length) missingImage.forEach((m) => console.log("  -", m.id, m.name));

console.log("\nIssues:");
if (issues.length === 0) console.log("  None.");
else issues.forEach((i) => console.log("  ", i));

process.exit(issues.length > 0 ? 1 : 0);

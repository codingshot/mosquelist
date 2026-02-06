/**
 * Prints a fact-check checklist from mosque data for use when re-verifying
 * capacity, area, established date, address, and facilities. See docs/skills.md.
 *
 * Usage: npm run fact-check
 */
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dataPath = path.join(root, "src", "data", "mosques.json");

const data = JSON.parse(readFileSync(dataPath, "utf-8"));
const mosques = data.mosques || [];

function formatNum(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

const withAddress = mosques.filter((m) => m.address && m.address.trim()).length;
const withHistory = mosques.filter((m) => m.history && m.history.trim()).length;
const withTourismNotes = mosques.filter((m) => m.tourismNotes && m.tourismNotes.trim()).length;
const withArchNotes = mosques.filter((m) => m.architectureNotes && m.architectureNotes.trim()).length;
const withImage = mosques.filter((m) => m.imageUrl && m.imageUrl.trim()).length;
const withStyle = mosques.filter((m) => m.architecturalStyle && m.architecturalStyle.trim()).length;

console.log("# Mosque fact-check checklist\n");
console.log("Use this list when re-verifying. Architecture reference: docs/architecture-patterns.md.\n");
console.log(`Summary: ${mosques.length} mosques | ${withAddress} address | ${withHistory} history | ${withTourismNotes} tourismNotes | ${withArchNotes} architectureNotes | ${withImage} imageUrl | ${withStyle} architecturalStyle\n`);
console.log("| # | Name | id | Capacity | Area (m²) | Established | Address | Image | Style |");
console.log("|---|------|-----|----------|-----------|-------------|--------|-------|-------|");

mosques.forEach((m, i) => {
  const name = (m.name || "").replace(/\|/g, " ").slice(0, 30);
  const cap = formatNum(m.capacity ?? 0);
  const area = (m.area ?? 0).toLocaleString();
  const est = (m.established || "").replace(/\|/g, " ");
  const addr = m.address ? "✓" : "—";
  const img = m.imageUrl && m.imageUrl.trim() ? "✓" : "—";
  const style = (m.architecturalStyle || "").replace(/\|/g, " ").slice(0, 12);
  console.log(`| ${i + 1} | ${name} | ${m.id} | ${cap} | ${area} | ${est} | ${addr} | ${img} | ${style} |`);
});

console.log(`\nTotal: ${mosques.length} mosques. Source hierarchy: docs/mosque-data-prompt.md.`);

// Gaps: mosques missing key fields (prioritize for fact-check)
const missingAddress = mosques.filter((m) => !m.address || !m.address.trim()).map((m) => m.id);
const missingHistory = mosques.filter((m) => !m.history || !m.history.trim()).map((m) => m.id);
const missingTourism = mosques.filter((m) => !m.tourismNotes || !m.tourismNotes.trim()).map((m) => m.id);
const missingArchNotes = mosques.filter((m) => !m.architectureNotes || !m.architectureNotes.trim()).map((m) => m.id);

console.log("\n## Gaps (missing fields)\n");
console.log(`- **Address** (${missingAddress.length}): ${missingAddress.slice(0, 15).join(", ")}${missingAddress.length > 15 ? "…" : ""}`);
console.log(`- **History** (${missingHistory.length}): ${missingHistory.slice(0, 15).join(", ")}${missingHistory.length > 15 ? "…" : ""}`);
console.log(`- **Tourism notes** (${missingTourism.length}): ${missingTourism.slice(0, 15).join(", ")}${missingTourism.length > 15 ? "…" : ""}`);
console.log(`- **Architecture notes** (${missingArchNotes.length}): ${missingArchNotes.slice(0, 15).join(", ")}${missingArchNotes.length > 15 ? "…" : ""}`);

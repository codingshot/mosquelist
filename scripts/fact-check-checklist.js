/**
 * Prints a fact-check checklist from mosque data for use when re-verifying
 * capacity, area, established date, and facilities. See docs/skills.md.
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

console.log("# Mosque fact-check checklist\n");
console.log("Use this list when re-verifying. Update docs/skills.md with corrections and date.\n");
console.log("| # | Name | id | Capacity | Area (m²) | Established |");
console.log("|---|------|-----|----------|-----------|-------------|");

mosques.forEach((m, i) => {
  const name = (m.name || "").replace(/\|/g, " ");
  const cap = formatNum(m.capacity ?? 0);
  const area = (m.area ?? 0).toLocaleString();
  const est = (m.established || "").replace(/\|/g, " ");
  console.log(`| ${i + 1} | ${name} | ${m.id} | ${cap} | ${area} | ${est} |`);
});

console.log(`\nTotal: ${mosques.length} mosques. Source hierarchy: docs/skills.md.`);

/**
 * Remove duplicate mosque entries by id (keeps last occurrence to match src/data/mosques.ts).
 * Run once: node scripts/dedupe-mosques.js
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, "..", "src", "data", "mosques.json");
const data = JSON.parse(readFileSync(dataPath, "utf-8"));
const mosques = data.mosques || [];

const byId = new Map();
for (const m of mosques) byId.set(m.id, m);
const deduped = [...byId.values()];
const removed = mosques.length - deduped.length;

if (removed === 0) {
  console.log("No duplicate mosque ids found.");
  process.exit(0);
}

data.mosques = deduped;
writeFileSync(dataPath, JSON.stringify(data, null, 2) + "\n", "utf-8");
console.log("Removed", removed, "duplicate mosque entries. Total mosques:", deduped.length);

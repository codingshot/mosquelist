/**
 * Syncs imageLocal in mosques.json from existing files in public/images/mosques/.
 * Run after download-mosque-images.js (e.g. if it was interrupted) to persist local paths.
 * Usage: node scripts/sync-mosque-images-from-disk.js
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dataPath = path.join(root, "src", "data", "mosques.json");
const outDir = path.join(root, "public", "images", "mosques");

const data = JSON.parse(readFileSync(dataPath, "utf-8"));
const mosques = data.mosques || [];

if (!existsSync(outDir)) {
  console.log("No public/images/mosques directory. Run download-mosque-images.js first.");
  process.exit(0);
}

const files = readdirSync(outDir);
const byId = new Map();
for (const f of files) {
  const base = path.basename(f, path.extname(f));
  const ext = path.extname(f);
  if (!byId.has(base)) byId.set(base, f);
}

let updated = 0;
for (const m of mosques) {
  const filename = byId.get(m.id);
  if (filename) {
    m.imageLocal = `/images/mosques/${filename}`;
    updated++;
  }
}

writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");
console.log("Synced imageLocal for", updated, "mosques to", dataPath);

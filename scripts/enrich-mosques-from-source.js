/**
 * Enrich src/data/mosques.json from mosquedata1.json: fill in missing
 * address, history, tourismNotes, architectureNotes (only when app field is empty).
 * Run: node scripts/enrich-mosques-from-source.js
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const rawApp = readFileSync(join(root, "src/data/mosques.json"), "utf-8");
const rawSource = readFileSync(join(root, "mosquedata1.json"), "utf-8");

const appData = JSON.parse(rawApp);
const sourceList = JSON.parse(rawSource);

// mosquedata1 id -> app id (same mosque)
const idMap = {
  "masjid-al-haram": "masjid-al-haram",
  "prophets-mosque": "masjid-an-nabawi",
  "al-aqsa-mosque-compound": "al-aqsa",
  "grand-jamia-mosque-karachi": "grand-jamia",
  "baitul-mukarram-mosque": "baitul-mukarram",
  "national-mosque-abuja": "national-mosque-abuja",
  "abuja-national-mosque": "national-mosque-abuja",
  "imam-muhammad-ibn-abd-al-wahhab-mosque": "imam-abdul-wahhab-mosque",
};

const sourceById = new Map(sourceList.map((m) => [m.id, m]));

function getSourceForAppMosque(appMosque) {
  const byId = sourceById.get(appMosque.id);
  if (byId) return byId;
  for (const [sourceId, appId] of Object.entries(idMap)) {
    if (appId === appMosque.id) return sourceById.get(sourceId);
  }
  return null;
}

function hasValue(v) {
  return typeof v === "string" && v.trim().length > 0;
}

let enriched = 0;
const mosques = appData.mosques.map((m) => {
  const src = getSourceForAppMosque(m);
  if (!src) return m;

  const next = { ...m };
  if (!hasValue(next.address) && hasValue(src.address)) {
    next.address = src.address.trim();
    enriched++;
  }
  if (!hasValue(next.history) && hasValue(src.history)) {
    next.history = src.history.trim();
    enriched++;
  }
  if (!hasValue(next.tourismNotes) && hasValue(src.tourismNotes)) {
    next.tourismNotes = src.tourismNotes.trim();
    enriched++;
  }
  if (!hasValue(next.architectureNotes) && hasValue(src.architectureNotes)) {
    next.architectureNotes = src.architectureNotes.trim();
    enriched++;
  }
  if (!hasValue(next.officialWebsite) && hasValue(src.officialWebsite)) {
    next.officialWebsite = src.officialWebsite.trim();
    enriched++;
  }
  return next;
});

const output = {
  mosques,
  timelineEvents: appData.timelineEvents,
};

writeFileSync(join(root, "src/data/mosques.json"), JSON.stringify(output, null, 2), "utf-8");
console.log(`Enriched ${enriched} fields. Total mosques: ${mosques.length}.`);
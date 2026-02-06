/**
 * Merge new mosques from mosquedata1.json into src/data/mosques.json.
 * Skips mosques that already exist (by id or idMap). Adds timeline events for notable mosques.
 * Run: node scripts/merge-mosques.js
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const raw1 = readFileSync(join(root, "mosquedata1.json"), "utf-8");
const raw2 = readFileSync(join(root, "src/data/mosques.json"), "utf-8");

const mosquedata1 = JSON.parse(raw1);
const appData = JSON.parse(raw2);
const existingIds = new Set(appData.mosques.map((m) => m.id));

// mosquedata1 id -> app id (same mosque, skip adding)
const idMap = {
  "masjid-al-haram": "masjid-al-haram",
  "prophets-mosque": "masjid-an-nabawi",
  "imam-reza-shrine": "imam-reza-shrine",
  "grand-jamia-mosque-karachi": "grand-jamia",
  "al-aqsa-mosque-compound": "al-aqsa",
  "faisal-mosque": "faisal-mosque",
  "istiqlal-mosque": "istiqlal-mosque",
  "taj-ul-masajid": "taj-ul-masajid",
  "hassan-ii-mosque": "hassan-ii",
  "badshahi-mosque": "badshahi-mosque",
  "sheikh-zayed-grand-mosque": "sheikh-zayed",
  "djamaa-el-djazair": "djamaa-el-djazair",
  "baitul-mukarram-mosque": "baitul-mukarram",
  "sultan-qaboos-grand-mosque": "sultan-qaboos-grand-mosque",
  "jama-masjid-delhi": "jama-masjid-delhi",
  "al-azhar-mosque-cairo": "al-azhar-mosque",
  "national-mosque-of-malaysia": "national-mosque-malaysia",
  "national-mosque-abuja": "national-mosque-abuja",
  "abuja-national-mosque": "national-mosque-abuja",
  "putra-mosque": "putra-mosque",
  "massalikoul-djinane-mosque": "massalikoul-djinane-mosque",
  "imam-muhammad-ibn-abd-al-wahhab-mosque": "imam-abdul-wahhab-mosque",
};

// Timeline events for new mosques (id -> { year, event })
const newTimelineEvents = {
  "astana-grand-mosque": { year: "2022", mosque: "Astana Grand Mosque", event: "Kazakhstan's largest mosque completed in Nur-Sultan" },
  "umayyad-mosque": { year: "715", mosque: "Umayyad Mosque", event: "Great Mosque of Damascus completed" },
  "jamkaran-mosque": { year: "984", mosque: "Jamkaran Mosque", event: "Shia pilgrimage mosque established near Qom" },
  "camlica-mosque": { year: "2019", mosque: "Çamlıca Mosque", event: "Largest mosque in Turkey completed in Istanbul" },
  "hagia-sophia-istanbul": { year: "537", mosque: "Hagia Sophia", event: "Byzantine basilica completed; later mosque, museum, mosque" },
  "shah-jahan-mosque-thatta": { year: "1659", mosque: "Shah Jahan Mosque", event: "Mughal mosque completed in Thatta" },
  "kocatepe-mosque": { year: "1987", mosque: "Kocatepe Mosque", event: "Ankara's largest mosque completed" },
  "federal-territory-mosque": { year: "2000", mosque: "Federal Territory Mosque", event: "Major mosque completed in Kuala Lumpur" },
  "grand-mosque-of-conakry": { year: "1982", mosque: "Grand Mosque of Conakry", event: "Guinea's main mosque completed" },
  "id-kah-mosque": { year: "1442", mosque: "Id Kah Mosque", event: "Historic mosque in Kashgar" },
};

function toAppMosque(m) {
  const area = typeof m.area === "number" ? m.area : (m.area ? parseInt(String(m.area), 10) : 0) || 0;
  const annualVisitors = typeof m.annualVisitors === "string" ? m.annualVisitors : (m.annualVisitors ? String(m.annualVisitors) : "—");
  const facilities = Array.isArray(m.facilities) ? m.facilities : [];
  const country = m.country === "State of Palestine" ? "Palestine" : m.country;
  return {
    id: m.id,
    name: m.name,
    arabicName: m.arabicName || undefined,
    location: m.location,
    country,
    coordinates: m.coordinates || undefined,
    capacity: m.capacity,
    established: m.established,
    area: area || 1000,
    annualVisitors: annualVisitors || "—",
    facilities: facilities.length ? facilities : ["Prayer halls", "Courtyards", "Ablution facilities"],
    significance: m.significance,
    description: m.description,
    imageUrl: m.imageUrl || "",
    isHolySite: !!m.isHolySite,
    architecturalStyle: m.architecturalStyle || undefined,
    architectureNotes: m.architectureNotes || undefined,
    history: m.history || undefined,
    tourismNotes: m.tourismNotes || undefined,
    officialWebsite: m.officialWebsite || undefined,
    womenPrayerArea: !!m.womenPrayerArea,
    touristFriendly: !!m.touristFriendly,
  };
}

const newMosques = [];
for (const m of mosquedata1) {
  const appId = idMap[m.id];
  if (appId && existingIds.has(appId)) continue; // already in app
  if (existingIds.has(m.id)) continue; // duplicate id
  if (!m.imageUrl) continue; // skip without image
  if (!m.name || !m.location || !m.country) continue;

  const mosque = toAppMosque(m);
  if (mosque.area <= 0 && m.capacity) mosque.area = Math.max(1000, Math.floor(m.capacity / 2));
  newMosques.push(mosque);
  existingIds.add(m.id);
}

const mergedMosques = [...appData.mosques, ...newMosques];
const newTimelineEntries = newMosques
  .filter((m) => newTimelineEvents[m.id])
  .map((m) => ({
    year: newTimelineEvents[m.id].year,
    mosque: newTimelineEvents[m.id].mosque,
    mosqueId: m.id,
    event: newTimelineEvents[m.id].event,
  }));
const mergedTimeline = [...appData.timelineEvents, ...newTimelineEntries].sort(
  (a, b) => parseInt(a.year, 10) - parseInt(b.year, 10)
);

const output = {
  mosques: mergedMosques,
  timelineEvents: mergedTimeline,
};

writeFileSync(join(root, "src/data/mosques.json"), JSON.stringify(output, null, 2), "utf-8");
console.log(`Added ${newMosques.length} new mosques. Total: ${mergedMosques.length}`);
console.log(`Added ${newTimelineEntries.length} timeline events. Total: ${mergedTimeline.length}`);

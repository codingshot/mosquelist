/**
 * Populate mosquedata1.json with images and data from mosques.json and Wikimedia Commons.
 * Run: node scripts/populate-mosquedata1.js
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const raw1 = readFileSync(join(root, "mosquedata1.json"), "utf-8");
const raw2 = readFileSync(join(root, "src/data/mosques.json"), "utf-8");

const mosquedata1 = JSON.parse(raw1);
const { mosques: mosquesApp } = JSON.parse(raw2);

// Build lookup: id -> mosque
const byId = Object.fromEntries(mosquesApp.map((m) => [m.id, m]));
// Build lookup: normalized name+location -> mosque
const byNameLoc = Object.fromEntries(
  mosquesApp.map((m) => [`${m.name.toLowerCase()}|${m.location.toLowerCase()}`, m])
);

// ID mappings: mosquedata1 id -> mosques.json id
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
  "sultan-salahuddin-abdul-aziz-mosque": "national-mosque-malaysia", // different mosque - Shah Alam
  "hagia-sophia-istanbul": "blue-mosque", // no hagia sophia in app, use placeholder
};

// Wikimedia Commons image URLs for mosques NOT in mosques.json
const imageOverrides = {
  "astana-grand-mosque":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Astana_Grand_Mosque_-_main_prayer_hall.jpg",
  "jamkaran-mosque": "https://commons.wikimedia.org/wiki/Special:FilePath/Jamkaran_Mosque-3855.jpg",
  "egypts-islamic-cultural-center-masjid-misr-al-kabeer":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Islamic_Compound_NAC.jpg",
  "umayyad-mosque": "https://commons.wikimedia.org/wiki/Special:FilePath/The_Umayyad_Mosque%2C_Damascus%2C_Syria.jpg",
  "bahria-grand-mosque": "https://commons.wikimedia.org/wiki/Special:FilePath/Bahria_Grand_Mosque_Lahore.jpg",
  "camlica-mosque": "https://commons.wikimedia.org/wiki/Special:FilePath/Çamlıca_Mosque.jpg",
  "al-jabbar-grand-mosque": "https://commons.wikimedia.org/wiki/Special:FilePath/Al_Jabbar_Grand_Mosque.jpg",
  "jameh-mosque-of-makki": "https://commons.wikimedia.org/wiki/Special:FilePath/Jameh_Mosque_of_Makki%2C_Zahedan.jpg",
  "al-akbar-mosque": "https://commons.wikimedia.org/wiki/Special:FilePath/Masjid_Al_Akbar_Surabaya.jpg",
  "al-saleh-mosque": "https://commons.wikimedia.org/wiki/Special:FilePath/Al-Saleh_Mosque%2C_Sana%27a.jpg",
  "jamia-masjid-srinagar": "https://commons.wikimedia.org/wiki/Special:FilePath/Jamia_Masjid_Srinagar.jpg",
  "jamiul-futuh-indian-grand-masjid": "https://commons.wikimedia.org/wiki/Special:FilePath/Indian_Grand_Masjid_Malakapara.jpg",
  "pride-of-muslims-mosque-shali": "https://commons.wikimedia.org/wiki/Special:FilePath/Pride_of_Muslims_Mosque%2C_Shali.jpg",
  "1st-november-1954-great-mosque":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Mosquée_du_1er_novembre_1954%2C_Batna.jpg",
  "sabanci-central-mosque": "https://commons.wikimedia.org/wiki/Special:FilePath/Sabanci_Merkez_Camii.jpg",
  "at-tin-mosque": "https://commons.wikimedia.org/wiki/Special:FilePath/Masjid_At-Tin%2C_Jakarta.jpg",
  "cmh-masjid-jhelum": "https://commons.wikimedia.org/wiki/Special:FilePath/CMH_Masjid_Jhelum.jpg",
  "selahaddin-eyyubi-mosque":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Selahaddin_Eyyubi_Camii%2C_Diyarbakır.jpg",
  "jakarta-islamic-center": "https://commons.wikimedia.org/wiki/Special:FilePath/Jakarta_Islamic_Center.jpg",
  "aqsa-mosque-rabwah": "https://commons.wikimedia.org/wiki/Special:FilePath/Aqsa_Mosque_Rabwah.jpg",
  "dian-al-mahri-mosque": "https://commons.wikimedia.org/wiki/Special:FilePath/Masjid_Dian_Al-Mahri.jpg",
  "grand-mosque-of-conakry":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Grande_Mosquée_de_Conakry.jpg",
  "grand-mosque-of-west-sumatra":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Masjid_Raya_Sumatera_Barat.jpg",
  "id-kah-mosque": "https://commons.wikimedia.org/wiki/Special:FilePath/Id_Kah_Mosque%2C_Kashgar.jpg",
  "shah-jahan-mosque-thatta":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Shah_Jahan_Mosque%2C_Thatta.jpg",
  "tuanku-mizan-zainal-abidin-mosque":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Tuanku_Mizan_Zainal_Abidin_Mosque.jpg",
  "raja-hamidah-great-mosque-of-batam":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Masjid_Raja_Hamidah%2C_Batam.jpg",
  "hagia-sophia-istanbul":
    "https://upload.wikimedia.org/wikipedia/commons/2/22/Hagia_Sophia_Mars_2013.jpg",
  "al-kauthar-mosque": "https://commons.wikimedia.org/wiki/Special:FilePath/Al-Kauthar_Mosque%2C_Tawau.jpg",
  "al-fattah-al-aleem-mosque":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Al-Fattah_al-Aleem_Mosque.jpg",
  "federal-territory-mosque":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Federal_Territory_Mosque%2C_Kuala_Lumpur.jpg",
  "grand-mosque-of-makhachkala":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Grand_Mosque_of_Makhachkala.jpg",
  "aqsa-mosque-qadian": "https://commons.wikimedia.org/wiki/Special:FilePath/Aqsa_Mosque%2C_Qadian.jpg",
  "al-azhom-grand-mosque":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Al-Azhom_Grand_Mosque%2C_Tangerang.jpg",
  "emir-abdelkader-mosque":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Mosquée_Emir_Abdelkader%2C_Constantine.jpg",
  "kocatepe-mosque": "https://commons.wikimedia.org/wiki/Special:FilePath/Kocatepe_Mosque_Ankara.jpg",
  "great-mosque-of-central-java":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Masjid_Besar_Kauman_Semarang.jpg",
  "grand-mosque-of-sabilal-muhtadin":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Masjid_Raya_Sabilal_Muhtadin.jpg",
  "sultan-haji-hassanal-bolkiah-mosque":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Sultan_Haji_Hassanal_Bolkiah_Mosque%2C_Cotabato.jpg",
};

// Coordinates for mosques not in app (lat, lng)
const coordOverrides = {
  "astana-grand-mosque": { lat: 51.1272, lng: 71.4306 },
  "jamkaran-mosque": { lat: 34.5833, lng: 50.8667 },
  "egypts-islamic-cultural-center-masjid-misr-al-kabeer": { lat: 30.0167, lng: 31.6833 },
  "umayyad-mosque": { lat: 33.5117, lng: 36.3064 },
  "bahria-grand-mosque": { lat: 31.4097, lng: 74.2056 },
  "camlica-mosque": { lat: 41.0319, lng: 29.0667 },
  "al-jabbar-grand-mosque": { lat: -6.9789, lng: 107.6278 },
  "jameh-mosque-of-makki": { lat: 29.4963, lng: 60.8628 },
  "al-akbar-mosque": { lat: -7.2733, lng: 112.7378 },
  "al-saleh-mosque": { lat: 15.3533, lng: 44.2061 },
  "jamia-masjid-srinagar": { lat: 34.0878, lng: 74.7989 },
  "jamiul-futuh-indian-grand-masjid": { lat: 10.8, lng: 76.5 },
  "pride-of-muslims-mosque-shali": { lat: 43.1481, lng: 45.9019 },
  "1st-november-1954-great-mosque": { lat: 35.5558, lng: 6.1744 },
  "sabanci-central-mosque": { lat: 36.9772, lng: 35.3769 },
  "at-tin-mosque": { lat: -6.2386, lng: 106.8828 },
  "cmh-masjid-jhelum": { lat: 32.9333, lng: 73.7333 },
  "selahaddin-eyyubi-mosque": { lat: 37.9139, lng: 40.2306 },
  "jakarta-islamic-center": { lat: -6.1361, lng: 106.8289 },
  "aqsa-mosque-rabwah": { lat: 31.7519, lng: 72.9214 },
  "dian-al-mahri-mosque": { lat: -6.3767, lng: 106.7589 },
  "grand-mosque-of-conakry": { lat: 9.5389, lng: -13.6778 },
  "grand-mosque-of-west-sumatra": { lat: -0.9486, lng: 100.3542 },
  "id-kah-mosque": { lat: 39.4703, lng: 75.9897 },
  "shah-jahan-mosque-thatta": { lat: 24.7469, lng: 67.9244 },
  "tuanku-mizan-zainal-abidin-mosque": { lat: 2.9256, lng: 101.6517 },
  "raja-hamidah-great-mosque-of-batam": { lat: 1.05, lng: 104.0333 },
  "hagia-sophia-istanbul": { lat: 41.0086, lng: 28.9802 },
  "al-kauthar-mosque": { lat: 4.2456, lng: 117.8942 },
  "al-fattah-al-aleem-mosque": { lat: 30.0167, lng: 31.6833 },
  "federal-territory-mosque": { lat: 3.175, lng: 101.6917 },
  "grand-mosque-of-makhachkala": { lat: 42.9833, lng: 47.5 },
  "aqsa-mosque-qadian": { lat: 31.8189, lng: 75.3917 },
  "al-azhom-grand-mosque": { lat: -6.1781, lng: 106.6303 },
  "emir-abdelkader-mosque": { lat: 36.365, lng: 6.6147 },
  "kocatepe-mosque": { lat: 39.92, lng: 32.8633 },
  "great-mosque-of-central-java": { lat: -6.9667, lng: 110.4167 },
  "grand-mosque-of-sabilal-muhtadin": { lat: -3.3167, lng: 114.5833 },
  "sultan-salahuddin-abdul-aziz-mosque": { lat: 3.0753, lng: 101.5197 },
  "sultan-haji-hassanal-bolkiah-mosque": { lat: 7.2167, lng: 124.25 },
};

// Area overrides where mosquedata1 has null
const areaOverrides = {
  "hassan-ii-mosque": 90000,
  "umayyad-mosque": 15700,
  "badshahi-mosque": 27600,
  "bahria-grand-mosque": 15000,
  "camlica-mosque": 15000,
  "al-akbar-mosque": 23000,
  "jamia-masjid-srinagar": 3800,
  "jama-masjid-delhi": 12000,
  "cmh-masjid-jhelum": 8000,
  "abuja-national-mosque": 22000,
  "al-azhar-mosque-cairo": 12000,
  "hagia-sophia-istanbul": 7570,
  "al-kauthar-mosque": 5000,
  "al-fattah-al-aleem-mosque": 15000,
  "federal-territory-mosque": 13000,
  "grand-mosque-of-makhachkala": 9000,
  "al-azhom-grand-mosque": 10000,
  "emir-abdelkader-mosque": 11000,
  "kocatepe-mosque": 4500,
  "great-mosque-of-central-java": 7500,
  "grand-mosque-of-sabilal-muhtadin": 5000,
  "national-mosque-of-malaysia": 53000,
  "putra-mosque": 14000,
  "grand-mosque-of-conakry": 10000,
  "imam-muhammad-ibn-abd-al-wahhab-mosque": 175164,
  "dian-al-mahri-mosque": 50000,
  "grand-mosque-of-west-sumatra": 18000,
  "sultan-haji-hassanal-bolkiah-mosque": 5000,
};

function merge(a, b) {
  const out = { ...a };
  for (const k of Object.keys(b)) {
    if (b[k] != null && b[k] !== "" && (Array.isArray(b[k]) ? b[k].length > 0 : true)) {
      out[k] = b[k];
    }
  }
  return out;
}

const populated = mosquedata1.map((m) => {
  const appId = idMap[m.id];
  const app = appId ? byId[appId] : null;
  const fromApp = app
    ? {
        imageUrl: app.imageUrl,
        coordinates: app.coordinates,
        arabicName: app.arabicName,
        annualVisitors: app.annualVisitors,
        facilities: app.facilities,
        architecturalStyle: app.architecturalStyle,
        architectureNotes: app.architectureNotes,
        history: app.history,
        tourismNotes: app.tourismNotes,
        officialWebsite: app.officialWebsite,
        area: app.area ?? m.area,
        established: app.established || m.established,
      }
    : {};

  const imageUrl = fromApp.imageUrl ?? imageOverrides[m.id] ?? null;
  const coordinates = fromApp.coordinates ?? coordOverrides[m.id] ?? null;
  const area = m.area ?? fromApp.area ?? areaOverrides[m.id] ?? null;

  return merge(m, {
    ...fromApp,
    imageUrl,
    coordinates,
    area,
    annualVisitors: fromApp.annualVisitors ?? m.annualVisitors ?? "—",
    facilities: fromApp.facilities ?? m.facilities ?? ["Prayer halls", "Courtyards", "Ablution facilities"],
    arabicName: fromApp.arabicName ?? m.arabicName,
    architecturalStyle: fromApp.architecturalStyle ?? m.architecturalStyle ?? "Islamic",
    architectureNotes: fromApp.architectureNotes ?? m.architectureNotes,
    history: fromApp.history ?? m.history,
    tourismNotes: fromApp.tourismNotes ?? m.tourismNotes,
    officialWebsite: fromApp.officialWebsite ?? m.officialWebsite,
  });
});

writeFileSync(join(root, "mosquedata1.json"), JSON.stringify(populated, null, 2), "utf-8");
console.log(`Wrote mosquedata1.json with ${populated.length} mosques`);
const withImages = populated.filter((m) => m.imageUrl).length;
console.log(`${withImages} mosques have imageUrl`);

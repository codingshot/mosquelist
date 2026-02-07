/**
 * Downloads mosque images from imageUrl to public/images/mosques/{id}.{ext}
 * and adds imageLocal to each mosque in src/data/mosques.json when successful.
 * Run: node scripts/download-mosque-images.js
 * Requires network. Use for initial seed; re-run to fetch new/missing images.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dataPath = path.join(root, "src", "data", "mosques.json");
const outDir = path.join(root, "public", "images", "mosques");

const CONTENT_TYPE_TO_EXT = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

function getExtFromUrl(url) {
  try {
    const u = new URL(url);
    const p = u.pathname.toLowerCase();
    if (p.endsWith(".png")) return ".png";
    if (p.endsWith(".webp")) return ".webp";
    if (p.endsWith(".gif")) return ".gif";
    if (p.endsWith(".jpg") || p.endsWith(".jpeg")) return ".jpg";
  } catch (_) {}
  return ".jpg";
}

function getExtFromContentType(ct) {
  if (!ct) return ".jpg";
  const normalized = ct.split(";")[0].trim().toLowerCase();
  return CONTENT_TYPE_TO_EXT[normalized] || ".jpg";
}

async function downloadOne(mosque, delayMs = 600) {
  const url = mosque.imageUrl?.trim();
  if (!url || (!url.startsWith("http://") && !url.startsWith("https://"))) {
    return { ok: false, reason: "skip (not http(s))" };
  }
  await new Promise((r) => setTimeout(r, delayMs));
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: { "User-Agent": "MosqueList/1.0 (local image backup)" },
    });
    if (!res.ok) {
      return { ok: false, reason: `HTTP ${res.status}` };
    }
    const ct = res.headers.get("content-type");
    const ext = getExtFromContentType(ct) || getExtFromUrl(url);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 500) {
      return { ok: false, reason: "body too small (likely not an image)" };
    }
    const safeId = mosque.id.replace(/[^a-z0-9-]/gi, "-");
    const filename = `${safeId}${ext}`;
    const filepath = path.join(outDir, filename);
    writeFileSync(filepath, buf);
    const localPath = `/images/mosques/${filename}`;
    return { ok: true, localPath };
  } catch (err) {
    return { ok: false, reason: err.message || String(err) };
  }
}

async function main() {
  const raw = readFileSync(dataPath, "utf-8");
  const data = JSON.parse(raw);
  const mosques = data.mosques || [];
  if (!mosques.length) {
    console.log("No mosques in data.");
    process.exit(0);
  }

  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
    console.log("Created", outDir);
  }

  let ok = 0;
  let fail = 0;
  const updates = new Map();

  for (let i = 0; i < mosques.length; i++) {
    const m = mosques[i];
    const result = await downloadOne(m);
    if (result.ok) {
      ok++;
      updates.set(m.id, result.localPath);
      console.log(`[${i + 1}/${mosques.length}] ${m.id} -> ${result.localPath}`);
    } else {
      fail++;
      console.log(`[${i + 1}/${mosques.length}] ${m.id} skip: ${result.reason}`);
    }
  }

  // Apply imageLocal to mosques that were downloaded
  let updated = 0;
  for (const m of mosques) {
    const localPath = updates.get(m.id);
    if (localPath) {
      m.imageLocal = localPath;
      updated++;
    }
  }

  if (updated > 0) {
    writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");
    console.log("\nWrote imageLocal for", updated, "mosques to", dataPath);
  }

  console.log("\nDone. Downloaded:", ok, "Failed/skipped:", fail);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

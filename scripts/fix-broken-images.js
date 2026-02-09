/**
 * Check and fix broken mosque images using multiple sources
 * Run: node scripts/fix-broken-images.js
 *
 * Sources: Wikipedia, Wikimedia Commons, Flickr, Pixabay, Pexels, DuckDuckGo, Firecrawl
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import FirecrawlApp from "@mendable/firecrawl-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dataPath = path.join(root, "src", "data", "mosques.json");

// Load env
const envPath = path.join(root, ".env");
let FIRECRAWL_API_KEY = "";
let PIXABAY_API_KEY = "";
let PEXELS_API_KEY = "";
let UNSPLASH_ACCESS_KEY = "";

try {
  const envContent = readFileSync(envPath, "utf-8");
  const fcMatch = envContent.match(/FIRECRAWL_API_KEY=(.+)/);
  if (fcMatch) FIRECRAWL_API_KEY = fcMatch[1].trim();
  const pxMatch = envContent.match(/PIXABAY_API_KEY=(.+)/);
  if (pxMatch) PIXABAY_API_KEY = pxMatch[1].trim();
  const pelMatch = envContent.match(/PEXELS_API_KEY=(.+)/);
  if (pelMatch) PEXELS_API_KEY = pelMatch[1].trim();
  const unsMatch = envContent.match(/UNSPLASH_ACCESS_KEY=(.+)/);
  if (unsMatch) UNSPLASH_ACCESS_KEY = unsMatch[1].trim();
} catch (_) {}

let firecrawl = null;
if (FIRECRAWL_API_KEY) {
  firecrawl = new FirecrawlApp({ apiKey: FIRECRAWL_API_KEY });
}

// Check if image URL is accessible
async function checkImageUrl(url) {
  if (!url || (!url.startsWith("http://") && !url.startsWith("https://"))) {
    return { ok: false, reason: "invalid url" };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      },
      redirect: "follow"
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const getRes = await fetch(url, {
        method: "GET",
        signal: AbortSignal.timeout(8000),
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        },
        redirect: "follow"
      });

      if (!getRes.ok) {
        return { ok: false, reason: `HTTP ${getRes.status}` };
      }
      return { ok: true };
    }

    return { ok: true };
  } catch (err) {
    return { ok: false, reason: err.message || String(err) };
  }
}

// 1. Wikipedia Page Images
async function searchWikipediaPage(mosqueName) {
  const searchTerm = encodeURIComponent(mosqueName);

  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${searchTerm}&format=json&srlimit=3`;
    const searchRes = await fetch(searchUrl, { headers: { "User-Agent": "MosqueList/1.0" } });
    if (!searchRes.ok) return null;

    const searchData = await searchRes.json();
    if (!searchData.query?.search?.length) return null;

    for (const result of searchData.query.search) {
      const pageTitle = result.title;

      // Get page thumbnail directly
      const thumbUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=pageimages&pithumbsize=1200&format=json`;
      const thumbRes = await fetch(thumbUrl, { headers: { "User-Agent": "MosqueList/1.0" } });

      if (thumbRes.ok) {
        const thumbData = await thumbRes.json();
        const pages = thumbData.query?.pages;
        if (pages) {
          for (const pageId of Object.keys(pages)) {
            const thumb = pages[pageId]?.thumbnail?.source;
            if (thumb) {
              const check = await checkImageUrl(thumb);
              if (check.ok) return thumb;
            }
          }
        }
      }

      // Fallback to page images list
      const imagesUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=images&format=json`;
      const imagesRes = await fetch(imagesUrl, { headers: { "User-Agent": "MosqueList/1.0" } });
      if (!imagesRes.ok) continue;

      const imagesData = await imagesRes.json();
      const pages = imagesData.query?.pages;
      if (!pages) continue;

      for (const pageId of Object.keys(pages)) {
        const images = pages[pageId]?.images || [];
        for (const img of images) {
          const imgTitle = img.title;
          if (!imgTitle.match(/\.(jpg|jpeg|png)$/i)) continue;
          if (imgTitle.includes("Icon") || imgTitle.includes("Logo") || imgTitle.includes("Flag") || imgTitle.includes("Commons-logo") || imgTitle.includes("Symbol")) continue;

          const fileUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(imgTitle)}&prop=imageinfo&iiprop=url&format=json`;
          const fileRes = await fetch(fileUrl, { headers: { "User-Agent": "MosqueList/1.0" } });

          if (fileRes.ok) {
            const fileData = await fileRes.json();
            const filePages = fileData.query?.pages;
            if (filePages) {
              for (const fPageId of Object.keys(filePages)) {
                const imageInfo = filePages[fPageId]?.imageinfo?.[0];
                if (imageInfo?.url) {
                  const check = await checkImageUrl(imageInfo.url);
                  if (check.ok) return imageInfo.url;
                }
              }
            }
          }
        }
      }
    }
  } catch (err) {
    // Silent fail
  }
  return null;
}

// 2. Wikimedia Commons
async function searchWikimediaCommons(mosqueName) {
  const searchTerm = encodeURIComponent(mosqueName);

  try {
    const wikiUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${searchTerm}&srnamespace=6&format=json&srlimit=15`;
    const res = await fetch(wikiUrl, { headers: { "User-Agent": "MosqueList/1.0" } });
    if (!res.ok) return null;

    const data = await res.json();
    if (data.query?.search?.length > 0) {
      for (const result of data.query.search) {
        const title = result.title;
        if (!title.match(/\.(jpg|jpeg|png|webp)$/i)) continue;

        const fileUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&format=json`;
        const fileRes = await fetch(fileUrl, { headers: { "User-Agent": "MosqueList/1.0" } });

        if (fileRes.ok) {
          const fileData = await fileRes.json();
          const pages = fileData.query?.pages;
          if (pages) {
            for (const pageId of Object.keys(pages)) {
              const imageInfo = pages[pageId]?.imageinfo?.[0];
              if (imageInfo?.url) {
                const check = await checkImageUrl(imageInfo.url);
                if (check.ok) return imageInfo.url;
              }
            }
          }
        }
      }
    }
  } catch (err) {
    // Silent fail
  }
  return null;
}

// 3. Flickr (free API)
async function searchFlickr(mosqueName, country) {
  try {
    // Use Flickr public feed (no API key needed)
    const query = encodeURIComponent(`${mosqueName} mosque`);
    const flickrUrl = `https://www.flickr.com/services/feeds/photos_public.gne?tags=${query}&format=json&nojsoncallback=1`;

    const res = await fetch(flickrUrl, {
      headers: { "User-Agent": "MosqueList/1.0" }
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (data.items && data.items.length > 0) {
      for (const item of data.items) {
        // Get larger image by modifying URL
        let imgUrl = item.media?.m;
        if (imgUrl) {
          // Change _m to _b for larger image
          imgUrl = imgUrl.replace("_m.jpg", "_b.jpg");
          const check = await checkImageUrl(imgUrl);
          if (check.ok) return imgUrl;
        }
      }
    }
  } catch (err) {
    // Silent fail
  }
  return null;
}

// 4. Pixabay (needs API key, but has free tier)
async function searchPixabay(mosqueName) {
  if (!PIXABAY_API_KEY) return null;

  try {
    const query = encodeURIComponent(`${mosqueName} mosque`);
    const url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${query}&image_type=photo&min_width=800&per_page=5`;

    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    if (data.hits && data.hits.length > 0) {
      for (const hit of data.hits) {
        const imgUrl = hit.largeImageURL || hit.webformatURL;
        if (imgUrl) {
          const check = await checkImageUrl(imgUrl);
          if (check.ok) return imgUrl;
        }
      }
    }
  } catch (err) {
    // Silent fail
  }
  return null;
}

// 5. Pexels (needs API key)
async function searchPexels(mosqueName) {
  if (!PEXELS_API_KEY) return null;

  try {
    const query = encodeURIComponent(`${mosqueName} mosque`);
    const url = `https://api.pexels.com/v1/search?query=${query}&per_page=5`;

    const res = await fetch(url, {
      headers: { "Authorization": PEXELS_API_KEY }
    });
    if (!res.ok) return null;

    const data = await res.json();
    if (data.photos && data.photos.length > 0) {
      for (const photo of data.photos) {
        const imgUrl = photo.src?.large || photo.src?.medium;
        if (imgUrl) {
          const check = await checkImageUrl(imgUrl);
          if (check.ok) return imgUrl;
        }
      }
    }
  } catch (err) {
    // Silent fail
  }
  return null;
}

// 6. Unsplash (needs access key)
async function searchUnsplash(mosqueName) {
  if (!UNSPLASH_ACCESS_KEY) return null;

  try {
    const query = encodeURIComponent(`${mosqueName} mosque`);
    const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=5`;

    const res = await fetch(url, {
      headers: { "Authorization": `Client-ID ${UNSPLASH_ACCESS_KEY}` }
    });
    if (!res.ok) return null;

    const data = await res.json();
    if (data.results && data.results.length > 0) {
      for (const photo of data.results) {
        const imgUrl = photo.urls?.regular || photo.urls?.small;
        if (imgUrl) {
          const check = await checkImageUrl(imgUrl);
          if (check.ok) return imgUrl;
        }
      }
    }
  } catch (err) {
    // Silent fail
  }
  return null;
}

// 7. DuckDuckGo Images (no API key needed)
async function searchDuckDuckGo(mosqueName, country) {
  try {
    const query = encodeURIComponent(`${mosqueName} ${country} mosque`);

    // Get vqd token first
    const tokenRes = await fetch(`https://duckduckgo.com/?q=${query}`, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
    });

    if (!tokenRes.ok) return null;

    const html = await tokenRes.text();
    const vqdMatch = html.match(/vqd=["']?([^"'&]+)/);
    if (!vqdMatch) return null;

    const vqd = vqdMatch[1];

    // Search images
    const imgUrl = `https://duckduckgo.com/i.js?q=${query}&vqd=${vqd}&p=1`;
    const imgRes = await fetch(imgUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Referer": "https://duckduckgo.com/"
      }
    });

    if (!imgRes.ok) return null;

    const data = await imgRes.json();
    if (data.results && data.results.length > 0) {
      for (const result of data.results) {
        const url = result.image;
        if (url && url.startsWith("http")) {
          // Skip small images
          if (result.width < 400 || result.height < 300) continue;

          const check = await checkImageUrl(url);
          if (check.ok) return url;
        }
      }
    }
  } catch (err) {
    // Silent fail
  }
  return null;
}

// 8. Wikidata Images
async function searchWikidata(mosqueName) {
  try {
    const query = encodeURIComponent(mosqueName);
    const searchUrl = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${query}&language=en&format=json&limit=3`;

    const searchRes = await fetch(searchUrl, { headers: { "User-Agent": "MosqueList/1.0" } });
    if (!searchRes.ok) return null;

    const searchData = await searchRes.json();
    if (!searchData.search?.length) return null;

    for (const entity of searchData.search) {
      const entityId = entity.id;
      const entityUrl = `https://www.wikidata.org/w/api.php?action=wbgetclaims&entity=${entityId}&property=P18&format=json`;

      const entityRes = await fetch(entityUrl, { headers: { "User-Agent": "MosqueList/1.0" } });
      if (!entityRes.ok) continue;

      const entityData = await entityRes.json();
      const claims = entityData.claims?.P18;

      if (claims && claims.length > 0) {
        const fileName = claims[0]?.mainsnak?.datavalue?.value;
        if (fileName) {
          // Convert filename to Commons URL
          const encodedName = encodeURIComponent(fileName.replace(/ /g, "_"));
          const md5 = await getMD5Hash(fileName.replace(/ /g, "_"));
          const imgUrl = `https://upload.wikimedia.org/wikipedia/commons/${md5[0]}/${md5.slice(0,2)}/${encodedName}`;

          const check = await checkImageUrl(imgUrl);
          if (check.ok) return imgUrl;
        }
      }
    }
  } catch (err) {
    // Silent fail
  }
  return null;
}

// Simple MD5-like hash for Wikimedia URLs (first 2 chars)
async function getMD5Hash(filename) {
  const encoder = new TextEncoder();
  const data = encoder.encode(filename);
  const hashBuffer = await crypto.subtle.digest('MD5', data).catch(() => null);

  if (!hashBuffer) {
    // Fallback: simple hash
    let hash = 0;
    for (let i = 0; i < filename.length; i++) {
      hash = ((hash << 5) - hash) + filename.charCodeAt(i);
      hash = hash & hash;
    }
    const hex = Math.abs(hash).toString(16).padStart(32, '0');
    return hex;
  }

  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// 9. Firecrawl (last resort, uses tokens)
async function searchFirecrawl(mosqueName, country) {
  if (!firecrawl) return null;

  try {
    const result = await firecrawl.search(`${mosqueName} ${country} mosque`, {
      sources: ["images"],
      limit: 5,
      timeout: 10000
    });

    if (!result.success) return null;

    if (result.images && result.images.length > 0) {
      for (const img of result.images) {
        const imgUrl = img.url || img.image || img;
        if (typeof imgUrl === 'string' && imgUrl.startsWith('http')) {
          if (imgUrl.includes("logo") || imgUrl.includes("icon") || imgUrl.includes("thumb") || imgUrl.includes("favicon")) continue;
          const check = await checkImageUrl(imgUrl);
          if (check.ok) return imgUrl;
        }
      }
    }

    if (result.data && result.data.length > 0) {
      for (const item of result.data) {
        if (item.metadata?.ogImage) {
          const check = await checkImageUrl(item.metadata.ogImage);
          if (check.ok) return item.metadata.ogImage;
        }
      }
    }
  } catch (err) {
    console.log(`  [!] Firecrawl error: ${err.message}`);
  }
  return null;
}

// Main search function - tries all sources
async function findImage(name, country, isGallery = false) {
  const searchName = isGallery ? `${name} interior` : name;

  // 1. Wikipedia (best quality, free)
  let url = await searchWikipediaPage(searchName);
  if (url) return { url, source: "Wikipedia" };

  // 2. Wikimedia Commons
  url = await searchWikimediaCommons(searchName);
  if (url) return { url, source: "Wikimedia Commons" };

  // 3. Wikidata
  url = await searchWikidata(searchName);
  if (url) return { url, source: "Wikidata" };

  // 4. Flickr (free)
  url = await searchFlickr(searchName, country);
  if (url) return { url, source: "Flickr" };

  // 5. DuckDuckGo (free, no API)
  url = await searchDuckDuckGo(searchName, country);
  if (url) return { url, source: "DuckDuckGo" };

  // 6. Pixabay (if API key provided)
  url = await searchPixabay(searchName);
  if (url) return { url, source: "Pixabay" };

  // 7. Pexels (if API key provided)
  url = await searchPexels(searchName);
  if (url) return { url, source: "Pexels" };

  // 8. Unsplash (if API key provided)
  url = await searchUnsplash(searchName);
  if (url) return { url, source: "Unsplash" };

  // 9. Firecrawl (last resort, costs tokens)
  if (firecrawl) {
    url = await searchFirecrawl(searchName, country);
    if (url) return { url, source: "Firecrawl" };
  }

  return null;
}

// Save data immediately
function saveData(data) {
  writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");
}

async function main() {
  console.log("Loading mosques data...");
  const raw = readFileSync(dataPath, "utf-8");
  const data = JSON.parse(raw);
  const mosques = data.mosques || [];

  console.log(`Found ${mosques.length} mosques\n`);
  console.log("Available sources:");
  console.log("  - Wikipedia (free)");
  console.log("  - Wikimedia Commons (free)");
  console.log("  - Wikidata (free)");
  console.log("  - Flickr (free)");
  console.log("  - DuckDuckGo (free)");
  console.log(`  - Pixabay (${PIXABAY_API_KEY ? "enabled" : "no API key"})`);
  console.log(`  - Pexels (${PEXELS_API_KEY ? "enabled" : "no API key"})`);
  console.log(`  - Unsplash (${UNSPLASH_ACCESS_KEY ? "enabled" : "no API key"})`);
  console.log(`  - Firecrawl (${FIRECRAWL_API_KEY ? "enabled - last resort" : "no API key"})\n`);

  const brokenImages = [];
  const brokenGallery = [];
  let checkedCount = 0;

  // Phase 1: Check all images
  console.log("=== Phase 1: Checking all image URLs ===\n");

  for (let i = 0; i < mosques.length; i++) {
    const mosque = mosques[i];
    checkedCount++;

    process.stdout.write(`\r[${checkedCount}/${mosques.length}] Checking: ${mosque.name.substring(0, 40).padEnd(40)}`);

    if (mosque.imageUrl) {
      const result = await checkImageUrl(mosque.imageUrl);
      if (!result.ok) {
        brokenImages.push({
          index: i,
          id: mosque.id,
          name: mosque.name,
          country: mosque.country,
          url: mosque.imageUrl,
          reason: result.reason
        });
      }
    } else {
      brokenImages.push({
        index: i,
        id: mosque.id,
        name: mosque.name,
        country: mosque.country,
        url: null,
        reason: "no imageUrl"
      });
    }

    if (mosque.galleryUrls && Array.isArray(mosque.galleryUrls)) {
      for (let j = 0; j < mosque.galleryUrls.length; j++) {
        const galleryUrl = mosque.galleryUrls[j];
        const result = await checkImageUrl(galleryUrl);
        if (!result.ok) {
          brokenGallery.push({
            mosqueIndex: i,
            galleryIndex: j,
            id: mosque.id,
            name: mosque.name,
            country: mosque.country,
            url: galleryUrl,
            reason: result.reason
          });
        }
      }
    }

    if (i % 5 === 0) {
      await new Promise(r => setTimeout(r, 30));
    }
  }

  console.log("\n\n=== Check Results ===");
  console.log(`Broken main images: ${brokenImages.length}`);
  console.log(`Broken gallery images: ${brokenGallery.length}`);

  if (brokenImages.length > 0) {
    console.log("\nBroken main images:");
    for (const b of brokenImages.slice(0, 15)) {
      console.log(`  - ${b.name} (${b.country}): ${b.reason}`);
    }
    if (brokenImages.length > 15) {
      console.log(`  ... and ${brokenImages.length - 15} more`);
    }
  }

  if (brokenImages.length === 0 && brokenGallery.length === 0) {
    console.log("\nAll images are working!");
    return;
  }

  // Phase 2: Fix broken main images
  console.log("\n=== Phase 2: Finding replacement images ===\n");

  let fixed = 0;
  let failedToFix = 0;
  const sourceStats = {};

  for (const broken of brokenImages) {
    console.log(`\n[${fixed + failedToFix + 1}/${brokenImages.length}] ${broken.name} (${broken.country})`);

    const result = await findImage(broken.name, broken.country);

    if (result) {
      console.log(`  Found via ${result.source}: ${result.url.substring(0, 70)}...`);
      mosques[broken.index].imageUrl = result.url;
      saveData(data); // Save immediately
      console.log(`  Saved to mosques.json`);
      fixed++;
      sourceStats[result.source] = (sourceStats[result.source] || 0) + 1;
    } else {
      console.log("  No replacement found");
      failedToFix++;
    }

    await new Promise(r => setTimeout(r, 200));
  }

  // Phase 3: Fix broken gallery images
  console.log("\n=== Phase 3: Fixing gallery images ===\n");

  let galleryFixed = 0;
  let galleryRemoved = 0;

  const galleryByMosque = new Map();
  for (const broken of brokenGallery) {
    if (!galleryByMosque.has(broken.mosqueIndex)) {
      galleryByMosque.set(broken.mosqueIndex, []);
    }
    galleryByMosque.get(broken.mosqueIndex).push(broken);
  }

  for (const [mosqueIndex, brokenList] of galleryByMosque) {
    const mosque = mosques[mosqueIndex];
    console.log(`\nFixing gallery for: ${mosque.name}`);

    for (const broken of brokenList) {
      const result = await findImage(broken.name, broken.country, true);

      if (result && mosque.galleryUrls) {
        const idx = mosque.galleryUrls.indexOf(broken.url);
        if (idx !== -1) {
          mosque.galleryUrls[idx] = result.url;
          saveData(data); // Save immediately
          galleryFixed++;
          console.log(`  Replaced via ${result.source} - Saved`);
          sourceStats[result.source] = (sourceStats[result.source] || 0) + 1;
        }
      } else {
        if (mosque.galleryUrls) {
          mosque.galleryUrls = mosque.galleryUrls.filter(u => u !== broken.url);
          saveData(data); // Save immediately
          galleryRemoved++;
          console.log(`  Removed broken URL - Saved`);
        }
      }

      await new Promise(r => setTimeout(r, 150));
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Main images fixed: ${fixed}/${brokenImages.length}`);
  console.log(`Gallery images fixed: ${galleryFixed}`);
  console.log(`Gallery images removed: ${galleryRemoved}`);
  console.log(`Failed to fix: ${failedToFix}`);

  if (Object.keys(sourceStats).length > 0) {
    console.log(`\nImages by source:`);
    for (const [source, count] of Object.entries(sourceStats).sort((a, b) => b[1] - a[1])) {
      console.log(`  - ${source}: ${count}`);
    }
  }
}

main().catch(err => {
  console.error("\nError:", err);
  process.exit(1);
});

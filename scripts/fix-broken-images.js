/**
 * Search and replace ALL mosque images using multiple sources
 * Run: node scripts/fix-broken-images.js
 *
 * Sources: Wikipedia, Wikimedia Commons, Flickr, Pixabay, Pexels, DuckDuckGo, Firecrawl
 */
import { readFileSync, writeFileSync, copyFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import FirecrawlApp from "@mendable/firecrawl-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dataPath = path.join(root, "src", "data", "mosques.json");
const backupPath = path.join(root, "src", "data", "mosques-backup.json");

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

// Keywords to exclude from image search (flags, maps, diagrams, etc.)
const EXCLUDE_KEYWORDS = [
  'flag', 'flags', 'flag_of', 'flagof', 'emblem', 'coat_of_arms', 'coa', 'seal', 'logo', 'symbol', 'icon',
  'map', 'maps', 'location', 'diagram', 'chart', 'graph', 'illustration',
  'vector', 'svg', 'drawing', 'clipart', 'cartoon', 'silhouette',
  'sketch', 'plan', 'blueprint', 'schematic', 'infographic',
  'stamp', 'postage', 'coin', 'currency', 'money', 'banknote',
  'passport', 'document', 'certificate', 'banner', 'poster',
  'sword', 'weapon', 'shield', 'crest', 'saudi_arabia_flag', 'saudi_flag',
  'shahada', 'kalima', 'calligraphy', 'arabic_text', 'arabic_script'
];

// Check if URL contains excluded keywords
function isValidImageUrl(url) {
  if (!url) return false;
  const lowerUrl = url.toLowerCase();
  return !EXCLUDE_KEYWORDS.some(keyword => lowerUrl.includes(keyword));
}

// Build optimized search query using mosque data
function buildSearchQuery(mosque, isGallery = false) {
  const { id, name, location, country, address } = mosque;
  
  // Extract meaningful parts from ID (e.g., "masjid-al-haram" -> "masjid al haram")
  const idWords = id ? id.replace(/-/g, ' ').replace(/_/g, ' ').toLowerCase() : '';
  
  // Clean name - remove common suffixes that might confuse search
  const cleanName = name ? name.replace(/\s+mosque$/i, '').replace(/\s+masjid$/i, '').trim() : '';
  
  // Build location context
  const locationParts = [];
  if (location && location !== country) locationParts.push(location);
  if (country) locationParts.push(country);
  const locationStr = locationParts.join(', ');
  
  // Try different query strategies in order of specificity
  const queries = [];
  
  // Strategy 1: Name + Location + Country + specific building terms (avoid flags)
  if (cleanName && locationStr) {
    queries.push(`${cleanName} ${locationStr} mosque building architecture`);
    queries.push(`${cleanName} ${locationStr} mosque exterior photo`);
    queries.push(`${cleanName} ${locationStr} mosque facade`);
  }
  
  // Strategy 2: ID-based query (good for unique identification)
  if (idWords && idWords !== cleanName.toLowerCase()) {
    const idQuery = locationStr ? `${idWords} ${locationStr} mosque building` : `${idWords} mosque building`;
    queries.push(idQuery);
  }
  
  // Strategy 3: Name + Country + building/photo keywords
  if (cleanName && country) {
    queries.push(`${cleanName} ${country} mosque building architecture`);
    queries.push(`${cleanName} ${country} mosque exterior`);
    queries.push(`${cleanName} ${country} mosque dome minaret`);
  }
  
  // Strategy 4: Include address keywords if available (extract city/district)
  if (address) {
    // Extract city/district from address (usually the part before last comma)
    const addrParts = address.split(',').map(p => p.trim()).filter(p => p);
    if (addrParts.length >= 2) {
      const cityOrDistrict = addrParts[addrParts.length - 2]; // Usually city
      if (cleanName && cityOrDistrict && cityOrDistrict !== location) {
        queries.push(`${cleanName} ${cityOrDistrict} mosque building`);
      }
    }
  }
  
  // Strategy 5: Just name + specific terms (fallback)
  if (cleanName) {
    queries.push(`${cleanName} mosque building architecture`);
    queries.push(`${cleanName} mosque dome`);
    queries.push(`${cleanName} mosque exterior`);
  }
  
  // For gallery/interior images
  if (isGallery) {
    return queries.map(q => q.replace(/\s+mosque\s+(building|photo)$/, '') + ' mosque interior');
  }
  
  // Remove duplicates while preserving order
  return [...new Set(queries)];
}

// 1. Wikipedia Page Images
async function searchWikipediaPage(searchQueries) {
  // Try each query in order
  for (const query of searchQueries) {
    const searchTerm = encodeURIComponent(query);

    try {
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${searchTerm}&format=json&srlimit=3`;
      const searchRes = await fetch(searchUrl, { headers: { "User-Agent": "MosqueList/1.0" } });
      if (!searchRes.ok) continue;

      const searchData = await searchRes.json();
      if (!searchData.query?.search?.length) continue;

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
              if (thumb && isValidImageUrl(thumb)) return thumb;
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
            // Skip flags, logos, maps, diagrams
            const lowerTitle = imgTitle.toLowerCase();
            if (EXCLUDE_KEYWORDS.some(kw => lowerTitle.includes(kw))) continue;
            if (imgTitle.includes("Icon") || imgTitle.includes("Logo") || imgTitle.includes("Flag") || imgTitle.includes("Commons-logo") || imgTitle.includes("Symbol")) continue;

            const fileUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(imgTitle)}&prop=imageinfo&iiprop=url&format=json`;
            const fileRes = await fetch(fileUrl, { headers: { "User-Agent": "MosqueList/1.0" } });

            if (fileRes.ok) {
              const fileData = await fileRes.json();
              const filePages = fileData.query?.pages;
              if (filePages) {
                for (const fPageId of Object.keys(filePages)) {
                  const imageInfo = filePages[fPageId]?.imageinfo?.[0];
                  if (imageInfo?.url && isValidImageUrl(imageInfo.url)) return imageInfo.url;
                }
              }
            }
          }
        }
      }
    } catch (err) {
      // Silent fail, try next query
    }
  }
  return null;
}

// 2. Wikimedia Commons
async function searchWikimediaCommons(searchQueries) {
  for (const query of searchQueries) {
    const searchTerm = encodeURIComponent(query);

    try {
      const wikiUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${searchTerm}&srnamespace=6&format=json&srlimit=15`;
      const res = await fetch(wikiUrl, { headers: { "User-Agent": "MosqueList/1.0" } });
      if (!res.ok) continue;

      const data = await res.json();
      if (data.query?.search?.length > 0) {
        for (const result of data.query.search) {
          const title = result.title;
          if (!title.match(/\.(jpg|jpeg|png|webp)$/i)) continue;
          // Skip flags, logos, maps, diagrams based on title
          const lowerTitle = title.toLowerCase();
          if (EXCLUDE_KEYWORDS.some(kw => lowerTitle.includes(kw))) continue;

          const fileUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&format=json`;
          const fileRes = await fetch(fileUrl, { headers: { "User-Agent": "MosqueList/1.0" } });

          if (fileRes.ok) {
            const fileData = await fileRes.json();
            const pages = fileData.query?.pages;
            if (pages) {
              for (const pageId of Object.keys(pages)) {
                const imageInfo = pages[pageId]?.imageinfo?.[0];
                if (imageInfo?.url && isValidImageUrl(imageInfo.url)) return imageInfo.url;
              }
            }
          }
        }
      }
    } catch (err) {
      // Silent fail, try next query
    }
  }
  return null;
}

// 3. Flickr (free API)
async function searchFlickr(searchQueries, country) {
  for (const query of searchQueries) {
    try {
      // Use Flickr public feed (no API key needed)
      const encodedQuery = encodeURIComponent(query);
      const flickrUrl = `https://www.flickr.com/services/feeds/photos_public.gne?tags=${encodedQuery}&format=json&nojsoncallback=1`;

      const res = await fetch(flickrUrl, {
        headers: { "User-Agent": "MosqueList/1.0" }
      });

      if (!res.ok) continue;

      const data = await res.json();
      if (data.items && data.items.length > 0) {
        for (const item of data.items) {
          // Get larger image by modifying URL
          let imgUrl = item.media?.m;
          if (imgUrl) {
            // Change _m to _b for larger image
            imgUrl = imgUrl.replace("_m.jpg", "_b.jpg");
            if (isValidImageUrl(imgUrl)) return imgUrl;
          }
        }
      }
    } catch (err) {
      // Silent fail, try next query
    }
  }
  return null;
}

// 4. Pixabay (needs API key, but has free tier)
async function searchPixabay(searchQueries) {
  if (!PIXABAY_API_KEY) return null;

  for (const query of searchQueries) {
    try {
      const encodedQuery = encodeURIComponent(query);
      const url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodedQuery}&image_type=photo&min_width=800&per_page=5`;

      const res = await fetch(url);
      if (!res.ok) continue;

      const data = await res.json();
      if (data.hits && data.hits.length > 0) {
        for (const hit of data.hits) {
          const imgUrl = hit.largeImageURL || hit.webformatURL;
          if (imgUrl && isValidImageUrl(imgUrl)) return imgUrl;
        }
      }
    } catch (err) {
      // Silent fail, try next query
    }
  }
  return null;
}

// 5. Pexels (needs API key)
async function searchPexels(searchQueries) {
  if (!PEXELS_API_KEY) return null;

  for (const query of searchQueries) {
    try {
      const encodedQuery = encodeURIComponent(query);
      const url = `https://api.pexels.com/v1/search?query=${encodedQuery}&per_page=5`;

      const res = await fetch(url, {
        headers: { "Authorization": PEXELS_API_KEY }
      });
      if (!res.ok) continue;

      const data = await res.json();
      if (data.photos && data.photos.length > 0) {
        for (const photo of data.photos) {
          const imgUrl = photo.src?.large || photo.src?.medium;
          if (imgUrl && isValidImageUrl(imgUrl)) return imgUrl;
        }
      }
    } catch (err) {
      // Silent fail, try next query
    }
  }
  return null;
}

// 6. Unsplash (needs access key)
async function searchUnsplash(searchQueries) {
  if (!UNSPLASH_ACCESS_KEY) return null;

  for (const query of searchQueries) {
    try {
      const encodedQuery = encodeURIComponent(query);
      const url = `https://api.unsplash.com/search/photos?query=${encodedQuery}&per_page=5`;

      const res = await fetch(url, {
        headers: { "Authorization": `Client-ID ${UNSPLASH_ACCESS_KEY}` }
      });
      if (!res.ok) continue;

      const data = await res.json();
      if (data.results && data.results.length > 0) {
        for (const photo of data.results) {
          const imgUrl = photo.urls?.regular || photo.urls?.small;
          if (imgUrl && isValidImageUrl(imgUrl)) return imgUrl;
        }
      }
    } catch (err) {
      // Silent fail, try next query
    }
  }
  return null;
}

// 7. DuckDuckGo Images (no API key needed)
async function searchDuckDuckGo(searchQueries) {
  for (const query of searchQueries) {
    try {
      const encodedQuery = encodeURIComponent(query);

      // Get vqd token first
      const tokenRes = await fetch(`https://duckduckgo.com/?q=${encodedQuery}`, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
      });

      if (!tokenRes.ok) continue;

      const html = await tokenRes.text();
      const vqdMatch = html.match(/vqd=["']?([^"'&]+)/);
      if (!vqdMatch) continue;

      const vqd = vqdMatch[1];

      // Search images
      const imgUrl = `https://duckduckgo.com/i.js?q=${encodedQuery}&vqd=${vqd}&p=1`;
      const imgRes = await fetch(imgUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Referer": "https://duckduckgo.com/"
        }
      });

      if (!imgRes.ok) continue;

      const data = await imgRes.json();
      if (data.results && data.results.length > 0) {
        for (const result of data.results) {
          const url = result.image;
          if (url && url.startsWith("http")) {
            // Skip small images
            if (result.width < 400 || result.height < 300) continue;
            if (isValidImageUrl(url)) return url;
          }
        }
      }
    } catch (err) {
      // Silent fail, try next query
    }
  }
  return null;
}

// 8. Wikidata Images
async function searchWikidata(searchQueries) {
  for (const query of searchQueries) {
    try {
      const encodedQuery = encodeURIComponent(query);
      const searchUrl = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodedQuery}&language=en&format=json&limit=3`;

      const searchRes = await fetch(searchUrl, { headers: { "User-Agent": "MosqueList/1.0" } });
      if (!searchRes.ok) continue;

      const searchData = await searchRes.json();
      if (!searchData.search?.length) continue;

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
            if (isValidImageUrl(imgUrl)) return imgUrl;
          }
        }
      }
    } catch (err) {
      // Silent fail, try next query
    }
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
async function searchFirecrawl(searchQueries) {
  if (!firecrawl) return null;

  for (const query of searchQueries) {
    try {
      const result = await firecrawl.search(query, {
        sources: ["images"],
        limit: 5,
        timeout: 10000
      });

      if (!result.success) continue;

      if (result.images && result.images.length > 0) {
        for (const img of result.images) {
          const imgUrl = img.url || img.image || img;
          if (typeof imgUrl === 'string' && imgUrl.startsWith('http')) {
            if (imgUrl.includes("logo") || imgUrl.includes("icon") || imgUrl.includes("thumb") || imgUrl.includes("favicon")) continue;
            if (isValidImageUrl(imgUrl)) return imgUrl;
          }
        }
      }

      if (result.data && result.data.length > 0) {
        for (const item of result.data) {
          if (item.metadata?.ogImage && isValidImageUrl(item.metadata.ogImage)) {
            return item.metadata.ogImage;
          }
        }
      }
    } catch (err) {
      console.log(`  [!] Firecrawl error: ${err.message}`);
    }
  }
  return null;
}

// Main search function - tries all sources
async function findImage(mosque, isGallery = false) {
  // Build multiple search queries with different strategies
  const searchQueries = buildSearchQuery(mosque, isGallery);
  
  console.log(`  Search queries: ${searchQueries.slice(0, 3).join(' | ')}${searchQueries.length > 3 ? '...' : ''}`);

  // 1. Wikipedia (best quality, free)
  let url = await searchWikipediaPage(searchQueries);
  if (url) return { url, source: "Wikipedia" };

  // 2. Wikimedia Commons
  url = await searchWikimediaCommons(searchQueries);
  if (url) return { url, source: "Wikimedia Commons" };

  // 3. Wikidata
  url = await searchWikidata(searchQueries);
  if (url) return { url, source: "Wikidata" };

  // 4. Flickr (free)
  url = await searchFlickr(searchQueries, mosque.country);
  if (url) return { url, source: "Flickr" };

  // 5. DuckDuckGo (free, no API)
  url = await searchDuckDuckGo(searchQueries);
  if (url) return { url, source: "DuckDuckGo" };

  // 6. Pixabay (if API key provided)
  url = await searchPixabay(searchQueries);
  if (url) return { url, source: "Pixabay" };

  // 7. Pexels (if API key provided)
  url = await searchPexels(searchQueries);
  if (url) return { url, source: "Pexels" };

  // 8. Unsplash (if API key provided)
  url = await searchUnsplash(searchQueries);
  if (url) return { url, source: "Unsplash" };

  // 9. Firecrawl (last resort, costs tokens)
  if (firecrawl) {
    url = await searchFirecrawl(searchQueries);
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

  // Create backup
  console.log("Creating backup...");
  copyFileSync(dataPath, backupPath);
  console.log(`Backup saved to: ${backupPath}\n`);

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

  // Confirm before proceeding
  console.log("⚠️  WARNING: This will replace ALL mosque images with newly searched ones.");
  console.log(`   Total mosques to process: ${mosques.length}\n`);
  
  // Phase 1: Replace ALL main images
  console.log("=== Phase 1: Replacing ALL main images ===\n");

  let fixed = 0;
  let failedToFix = 0;
  const sourceStats = {};

  for (let i = 0; i < mosques.length; i++) {
    const mosque = mosques[i];
    const oldImageUrl = mosque.imageUrl;
    
    console.log(`\n[${i + 1}/${mosques.length}] ${mosque.name} (${mosque.country})`);
    console.log(`  ID: ${mosque.id}`);
    if (oldImageUrl) {
      console.log(`  Old: ${oldImageUrl.substring(0, 60)}...`);
    }
    
    // Pass full mosque info to findImage
    const mosqueInfo = {
      id: mosque.id,
      name: mosque.name,
      country: mosque.country,
      location: mosque.location,
      address: mosque.address
    };
    
    const result = await findImage(mosqueInfo);

    if (result) {
      console.log(`  ✓ New: ${result.url.substring(0, 60)}...`);
      console.log(`  ✓ Source: ${result.source}`);
      mosques[i].imageUrl = result.url;
      saveData(data); // Save immediately
      console.log(`  ✓ Saved`);
      fixed++;
      sourceStats[result.source] = (sourceStats[result.source] || 0) + 1;
    } else {
      console.log("  ✗ No image found");
      failedToFix++;
    }

    // Delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 300));
  }

  // Phase 2: Replace ALL gallery images
  console.log("\n=== Phase 2: Replacing ALL gallery images ===\n");

  let galleryFixed = 0;
  let galleryFailed = 0;

  for (let i = 0; i < mosques.length; i++) {
    const mosque = mosques[i];
    
    if (!mosque.galleryUrls || !Array.isArray(mosque.galleryUrls) || mosque.galleryUrls.length === 0) {
      continue;
    }

    console.log(`\n[${i + 1}/${mosques.length}] ${mosque.name} - ${mosque.galleryUrls.length} gallery images`);

    const newGalleryUrls = [];
    
    for (let j = 0; j < mosque.galleryUrls.length; j++) {
      const oldUrl = mosque.galleryUrls[j];
      console.log(`  Gallery ${j + 1}: Searching...`);
      
      const mosqueInfo = {
        id: mosque.id,
        name: mosque.name,
        country: mosque.country,
        location: mosque.location,
        address: mosque.address
      };
      
      const result = await findImage(mosqueInfo, true);

      if (result) {
        console.log(`    ✓ Found: ${result.source}`);
        newGalleryUrls.push(result.url);
        galleryFixed++;
        sourceStats[result.source] = (sourceStats[result.source] || 0) + 1;
      } else {
        console.log("    ✗ Not found, keeping old URL");
        newGalleryUrls.push(oldUrl);
        galleryFailed++;
      }

      await new Promise(r => setTimeout(r, 200));
    }

    mosques[i].galleryUrls = newGalleryUrls;
    saveData(data);
    console.log(`  ✓ Gallery saved`);
  }

  console.log(`\n=== Summary ===`);
  console.log(`Main images: ${fixed} replaced, ${failedToFix} failed`);
  console.log(`Gallery images: ${galleryFixed} replaced, ${galleryFailed} kept`);
  console.log(`Total mosques: ${mosques.length}`);

  if (Object.keys(sourceStats).length > 0) {
    console.log(`\nImages by source:`);
    for (const [source, count] of Object.entries(sourceStats).sort((a, b) => b[1] - a[1])) {
      console.log(`  - ${source}: ${count}`);
    }
  }

  console.log(`\nBackup saved at: ${backupPath}`);
}

main().catch(err => {
  console.error("\nError:", err);
  process.exit(1);
});

/**
 * Generates public/sitemap.xml from mosque data.
 * Run before build so dist gets the sitemap (e.g. npm run build).
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const baseUrl = process.env.SITE_URL || "https://mosquelist.com";

const mosquesPath = path.join(root, "src", "data", "mosques.json");
const listsPath = path.join(root, "src", "data", "lists.json");
const outPath = path.join(root, "public", "sitemap.xml");

const mosquesData = JSON.parse(readFileSync(mosquesPath, "utf-8"));
const mosques = mosquesData.mosques || [];
const listsData = JSON.parse(readFileSync(listsPath, "utf-8"));
const lists = listsData.lists || [];

const lastmod = new Date().toISOString().slice(0, 10);

const urls = [
  { loc: baseUrl, changefreq: "weekly", priority: "1.0" },
  { loc: `${baseUrl}/explore`, changefreq: "weekly", priority: "0.9" },
  { loc: `${baseUrl}/map`, changefreq: "weekly", priority: "0.8" },
  { loc: `${baseUrl}/lists`, changefreq: "weekly", priority: "0.8" },
  { loc: `${baseUrl}/timeline`, changefreq: "monthly", priority: "0.8" },
  { loc: `${baseUrl}/bucket-list`, changefreq: "monthly", priority: "0.8" },
  { loc: `${baseUrl}/about`, changefreq: "monthly", priority: "0.7" },
  { loc: `${baseUrl}/guides/travel`, changefreq: "monthly", priority: "0.8" },
  { loc: `${baseUrl}/guides/visitor-tips`, changefreq: "monthly", priority: "0.8" },
  ...lists.map((l) => ({
    loc: `${baseUrl}/lists/${l.slug}`,
    changefreq: "monthly",
    priority: "0.7",
  })),
  ...mosques.map((m) => ({
    loc: `${baseUrl}/mosque/${m.id}`,
    changefreq: "monthly",
    priority: "0.8",
  })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

function escapeXml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

writeFileSync(outPath, xml, "utf-8");
console.log("Wrote public/sitemap.xml with", urls.length, "URLs");

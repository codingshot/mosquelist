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

const dataPath = path.join(root, "src", "data", "mosques.json");
const outPath = path.join(root, "public", "sitemap.xml");

const data = JSON.parse(readFileSync(dataPath, "utf-8"));
const mosques = data.mosques || [];

const lastmod = new Date().toISOString().slice(0, 10);

const urls = [
  { loc: baseUrl, changefreq: "weekly", priority: "1.0" },
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

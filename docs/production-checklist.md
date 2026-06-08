# Production-Ready Checklist — MosqueList

Use this checklist before deploying to production or declaring an "app launch." Tick each item when done. **Internal use.**

---

## 1. Build & Deploy

- [x] **Build passes** — `npm run build` completes without errors (sitemap script runs first).
- [x] **Sitemap generated** — `scripts/generate-sitemap.js` runs in build; `public/sitemap.xml` includes homepage, explore, map, lists, timeline, islamic-history, bucket-list, about, glossary, contributing, guides, blog, blog posts, list pages, mosque pages.
- [x] **Deploy config** — `vercel.json` has SPA rewrite: all routes → `index.html`.
- [x] **Env** — No production secrets in client bundle; optional keys in `.env.example` only; `SITE_URL` used for sitemap base URL when set.

---

## 2. SEO & Discoverability

- [x] **Meta title & description** — `index.html` has correct title and description (199+ mosques, 50+ countries); keywords and author set.
- [x] **Open Graph** — `og:title`, `og:description`, `og:image` (1200×630), `og:url`, `og:type`, `og:image:alt`; `og:image` URL is absolute (`https://mosquelist.com/mosquelistmeta.jpeg`).
- [x] **Twitter Card** — `twitter:card` (summary_large_image), `twitter:title`, `twitter:description`, `twitter:image`, `twitter:image:alt`.
- [x] **Canonical** — `<link rel="canonical" href="https://mosquelist.com" />` on homepage; dynamic pages set canonical via `PageSEO` where applicable.
- [x] **robots.txt** — Allows crawlers; `Sitemap: https://mosquelist.com/sitemap.xml`; no accidental disallow of key paths.
- [x] **ai.txt** — `public/ai.txt` exists and describes the site for AI crawlers; linked from `<head>`.
- [x] **JSON-LD** — Homepage has WebSite schema (SearchAction for /explore?q=); mosque pages have Place; list pages ItemList; blog posts BlogPosting (in page components).

---

## 3. Performance

- [x] **Code splitting** — Heavy routes (Map, Blog, Islamic History, etc.) lazy-loaded; `manualChunks` for map, blog, query, dnd in vite.config.
- [x] **Chunk size** — Build chunk size warning limit set (600 KB); no single huge bundle blocking first paint.
- [x] **Images** — Mosque images use lazy loading or optimized component; external images (Wikimedia) cached via PWA/workbox.
- [x] **PWA** — Service worker registers; navigateFallback to index.html; no critical API calls that must work offline.

---

## 4. Security & Headers

- [x] **Security headers** — `vercel.json` sets `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`. HTTPS enforced by host in production.
- [x] **No secrets in client** — No API keys or secrets in frontend code; optional keys in `.env.example` only.

---

## 5. Errors & Resilience

- [x] **Error boundary** — Root ErrorBoundary in App.tsx catches render errors; shows "Something went wrong" with links to Home, Explore, etc., and Reload.
- [x] **Chunk load errors** — `lazyWithChunkErrorLogging` wraps lazy pages; console suggests hard refresh / cache clear when chunk fails.
- [x] **404** — `Route path="*"` renders NotFound page with link home.

---

## 6. Content & Copy

- [x] **Homepage meta** — Description and og/twitter text match current product (199+ mosques, 50+ countries, map, bucket list, fact-checked guides).
- [x] **Share image** — `public/mosquelistmeta.jpeg` exists at 1200×630 for og/twitter.
- [x] **Favicon & icons** — Favicon, apple-touch-icon, web app manifest icons present and linked.

---

## 7. Accessibility & UX

- [x] **Skip link** — "Skip to main content" in App.tsx; focus visible (Tailwind focus ring).
- [x] **Semantic HTML** — Landmarks (header, main, footer), headings hierarchy, alt text on images.
- [x] **Focus & keyboard** — Interactive elements focusable; no keyboard traps.

---

## 8. Optional (Post-Launch or When Ready)

- [ ] **Analytics** — If used: privacy-respecting; no PII in URLs; documented in privacy/README.
- [ ] **Monitoring** — Error reporting or uptime check optional; not blocking launch.

---

## Quick Commands

```bash
# Lint
npm run lint

# Tests
npm run test

# Production build (generates sitemap then builds)
npm run build

# Preview production build locally
npm run preview
```

---

## After Deployment

- [ ] Visit production URL; confirm homepage, /explore, /map, /blog, /mosque/:id load.
- [ ] Confirm sitemap: `https://mosquelist.com/sitemap.xml` returns valid XML.
- [ ] Confirm robots: `https://mosquelist.com/robots.txt` and Sitemap line.
- [ ] Share link test: paste URL in Twitter/Facebook/LinkedIn preview; confirm og image and title.
- [ ] Run Lighthouse (performance, accessibility, SEO) and fix critical issues if any.

---

---

## When you add new features

- **New route/page:** Add in `App.tsx`, in `scripts/generate-sitemap.js`, and in `public/ai.txt` (Key pages). See **[sitemap-seo-and-features.md](./sitemap-seo-and-features.md)** for the full list.
- **New blog post:** Add in `src/data/blog.ts` (sitemap auto).
- **New list:** Add in `src/data/lists.json` (sitemap auto); optionally update ai.txt “Curated lists.”
- **Copy/scale change:** Update index.html, guides (e.g. Travel), README, and marketing docs as needed.

*Update this checklist when adding new routes, env vars, or deploy targets.*

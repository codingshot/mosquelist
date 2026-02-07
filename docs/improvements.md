# MosqueList: Improvement Skills & Roadmap

Actionable skills and improvements to make the app more useful, accurate, and maintainable. Use this with [skills.md](./skills.md) (data accuracy) and [content-strategy.md](./content-strategy.md) (SEO).

**When deciding what to build or prioritize**, use the Socratic prompts in [socratic-prompts.md](./socratic-prompts.md) to scope and choose the right doc or skill.

---

## 1. Data & content

| Skill | Description | Priority |
|-------|-------------|----------|
| **Mosque data audit** | Periodically re-verify capacity, area, established date, and facilities for every mosque in `mosques.json` using [skills.md](./skills.md) source hierarchy. Document sources in data or in `docs/skills.md`. | High |
| **Add more mosques** | Expand toward 50+ then 100+ mosques: add major mosques by country (e.g. India, Egypt, Iraq, Algeria, Nigeria, UK, USA). Use consistent fields and one cited source minimum. | High |
| **Real images** | Inline photos from Wikimedia Commons (CC) for all mosques; fallback to placeholder on load error. | Done |
| **Arabic names** | Ensure all entries have correct `arabicName` and consistent transliteration; add variants in description if needed. | Medium |
| **Visitor / facilities** | Keep `annualVisitors`, `facilities`, and `touristFriendly` up to date from official or recent travel sources. | Medium |

---

## 2. UX & functionality

| Skill | Description | Priority |
|-------|-------------|----------|
| **Sort & default order** | Let users sort explore grid by name, capacity, area, established date, or country; persist in URL. | Done |
| **Share & deep links** | Share button per mosque (copy link). `/mosque/:id` and `/explore?q=...` work when shared. | Done |
| **Section routes** | Explore, Timeline, Bucket List, About as dedicated routes with SEO. | Done |
| **Add to bucket list from detail** | Mosque detail page has “Add to bucket list” / “In your bucket list” button. | Done |
| **Map view** | Optional map (e.g. Leaflet/Mapbox) showing mosque locations; link from mosque card/detail. | Medium |
| **Map links** | Google Maps and Apple Maps links on mosque pages and cards. | Done |
| **History, tourism, architecture** | Extended history, tourism notes, architecture notes, official websites. | Done |
| **Prayer times** | Link to trusted prayer times service (e.g. IslamicFinder). | Done |
| **Offline / PWA** | Service worker, cache static + mosque JSON for basic offline use. | Low |
| **i18n** | Arabic (and optionally Urdu, Indonesian) for UI and key content; RTL layout. | Low |

---

## 3. Accessibility & visibility

| Skill | Description | Priority |
|-------|-------------|----------|
| **Contrast** | Keep `--muted-foreground` and footer text (e.g. `text-background/70`) at or above WCAG AA (4.5:1 for normal text). Re-check after theme changes. | High |
| **Focus & keyboard** | All interactive elements focusable with visible focus ring; skip link, modal trap, and logical tab order. | High |
| **Screen reader** | Landmarks, headings, aria-labels on icon buttons, live regions for dynamic content (e.g. search result count). | High |
| **Touch targets** | Buttons and links at least 44×44px on mobile. | High |
| **Reduced motion** | Respect `prefers-reduced-motion` for animations (index.css) and Back to top scroll. | Done |

---

## 4. Performance & SEO

| Skill | Description | Priority |
|-------|-------------|----------|
| **Lazy load** | Images below fold use `loading="lazy"`; hero or first few cards `eager`; avoid layout shift with dimensions. | Done |
| **Code split** | Lazy-load route chunks (e.g. MosquePage, NotFound); already in place. | Done |
| **Sitemap** | Build-time sitemap from mosque data; referenced in `robots.txt`. | Done |
| **JSON-LD** | Per-mosque Place schema on detail page; WebSite/SearchAction on home. | Done |
| **Core Web Vitals** | Monitor LCP, FID, CLS; optimize hero image (WebP, srcset) and critical CSS. | Medium |
| **OG image** | Dedicated 1200×630 image for social sharing; use for og:image and Twitter. | Medium |

---

## 5. Testing & quality

| Skill | Description | Priority |
|-------|-------------|----------|
| **Unit tests** | Search, filters, data helpers (getMosqueById, getUniqueCountries); keep coverage for new features. | Done |
| **Component tests** | Key pages (Index, MosquePage) with providers; check headings, search, landmarks, buttons. | Done |
| **E2E** | Critical paths: nav, search, filter, add to bucket list, open mosque page (e.g. Playwright). | Medium |
| **Lint** | Fix existing ESLint errors (empty interfaces, conditional hooks, require in tailwind). | Done |

---

## 6. Product & growth

| Skill | Description | Priority |
|-------|-------------|----------|
| **Blog / content** | Use [content-strategy.md](./content-strategy.md): sacred mosques, largest by capacity/area, history, architecture, visitor guides. | Medium |
| **Analytics** | Privacy-respecting analytics (e.g. plausible, simple log) for usage; no PII. | Low |
| **Feedback** | Mailto + “Suggest a mosque” link in footer. | Done |

---

## 7. Process skills

- **Before adding a mosque**: Check [skills.md](./skills.md) checklist; add at least one source; note if figure is approximate.
- **Before release**: Run `npm run lint`, `npm run test`, `npm run build`; spot-check contrast and keyboard nav.
- **Quarterly**: Run `npm run fact-check`; re-audit top 10–15 mosques (capacity, area, dates); update `docs/skills.md` Latest audit and Fact-check schedule & log.

Use this doc to pick the next improvement batch and to onboard contributors.

# MosqueList

**Discover, explore, and plan your spiritual journey to the world's most magnificent mosques.**

MosqueList is a free web app for Muslims and travelers who want to discover significant mosques worldwide, learn their history, and build a personal mosque bucket list. Explore **199+ mosques in 50+ countries**—from the three holiest sites (Masjid al-Haram, Al-Masjid an-Nabawi, Al-Aqsa) to architectural landmarks—with an **interactive map**, **fact-checked Blog**, **Islamic History** timeline, **Glossary**, and visitor guides. Plan visits and track your journey in one place.

---

## Features

### Explore Mosques
- **Curated catalog** — 199+ significant mosques with names (English and Arabic), locations, capacity, establishment dates, and descriptions; sources and coordinates where available.
- **Curated lists** — Holy Sites, Biggest Mosques, by country, by era, by architectural style, UNESCO sites, and more.
- **Filters** — All Mosques, Holy Sites only, Tourist Friendly; filter by country and region.
- **Grid and list views** — Switch between card grid and list layout.
- **Mosque cards** — Image, name, location, capacity, establishment date, significance, facilities (women’s prayer area, tourist-friendly), “Holy Site“ badge; link to detail page.

### Map
- **Interactive map** — OpenStreetMap-based map showing mosque locations; click markers for name and link to mosque page.
- **Country/region filters** — Same filters as Explore; map updates to show matching mosques.

### Islamic History
- **Timeline** — Key dates from 622 CE to present: when major mosques were built or expanded (1,400+ years of context).
- **Alternating layout** — Events alternate left/right on desktop for easy reading.

### Blog & Guides
- **Blog** — 35+ fact-checked articles: holiest sites, visitor etiquette, Islamic architecture (Ottoman, Mughal, Persian, etc.), funding, wudu and prayer guides, fun facts, oldest mosques, and more.
- **Travel guide** — Plan your mosque journey; popular heritage routes.
- **Visitor tips** — Dress code, photography, best times to visit, what to pack.
- **Glossary** — Terms (e.g. minaret, iwan, qibla) for readers and students.

### My Mosque Bucket List
- **Track visits** — Mark mosques as visited; progress bar and “Places to Pray“ checklist (persisted in localStorage).
- **Favorites** — Save mosques to your list from Explore or mosque detail pages.

### Contributing
- **Contribute** — Page explaining how to suggest new mosques, correct data, or contribute to the project.

### Navigation & Layout
- **Sticky header** — Explore, Map, Timeline, Blog, Islamic History, Glossary, Contributing, My List, About.
- **Mobile menu** — Full nav and “Start Your Journey“ CTA.
- **Footer** — Quick links (Browse, Map, Timeline, Blog, Prayer Times), resources, credit to ummah.build.

### Design & UX
- **Islamic-inspired theme** — Warm paper/cream backgrounds, gold accents, serif and handwriting fonts (e.g. Playfair Display, Caveat).
- **Responsive layout** — Tailwind breakpoints (sm, md, lg, xl) for mobile-first responsiveness.
- **Accessibility** — Semantic HTML, aria-labels on icon buttons, keyboard-friendly navigation.

---

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** — Build and dev server
- **React Router** — Client-side routing (Index + NotFound)
- **Tailwind CSS** — Styling and responsive design
- **shadcn/ui** (Radix) — Buttons, badges, cards, accordions, etc.
- **TanStack Query** — Data fetching (ready for API integration)
- **Lucide React** — Icons

---

## Documentation

- **[docs/skills.md](docs/skills.md)** — Skills and tools for checking accuracy of mosque data, Quran, and hadith references.
- **[docs/improvements.md](docs/improvements.md)** — Improvement skills and roadmap: data, UX, accessibility, performance, testing, and process.
- **[docs/content-strategy.md](docs/content-strategy.md)** — Strategy for blogs and pages (sacred mosques, biggest by area/capacity, history, architecture, cost, etc.) and SEO.
- **[docs/personas.md](docs/personas.md)** — Audience personas (Muslims, tourists, non-Muslims, students, architecture enthusiasts) and how to appeal to each.
- **[docs/wikipedia-api-mosque-data-guide.md](docs/wikipedia-api-mosque-data-guide.md)** — How to pull mosque data from Wikipedia APIs (oldest, largest, by-country lists, Islamic architecture) and map it to MosqueList’s `Mosque` type.

- **Brand guide (in-app):** [/brand](https://mosquelist.com/brand) — Colors (HEX/RGB), fonts, voice, personas, logo & favicon, component showcase, downloadable brand ZIP. SEO-optimized; in sitemap.

---

## Project Structure

| Path | Purpose |
|------|--------|
| `src/App.tsx` | Root app: QueryClient, Router, TooltipProvider, Toaster, routes |
| `src/main.tsx` | React entry point, mounts `App` into `#root` |
| `src/pages/Index.tsx` | Home: Hero, Explore, Timeline, Bucket List, Footer |
| `src/pages/Explore.tsx` | Explore mosques (grid/list, filters, curated lists) |
| `src/pages/Map.tsx` | Interactive map of mosque locations (OpenStreetMap) |
| `src/pages/IslamicHistory.tsx` | Islamic History timeline page |
| `src/pages/Blog.tsx` | Blog index and post pages |
| `src/pages/Glossary.tsx` | Glossary of terms |
| `src/pages/Contributing.tsx` | How to contribute |
| `src/pages/MosqueDetail.tsx` | Single mosque detail page (SEO, facilities, map) |
| `src/pages/BrandPage.tsx` | Brand guide: colors, fonts, voice, personas, logo, components, download ZIP |
| `src/pages/NotFound.tsx` | 404 page |
| `src/components/Navigation.tsx` | Header with logo, nav links, mobile menu |
| `src/components/HeroSection.tsx` | Hero with headline, CTAs, stats |
| `src/components/MosqueCard.tsx` | Mosque card (image, badges, like, details) |
| `src/components/BucketList.tsx` | Bucket list checklist and progress (persisted) |
| `src/components/Footer.tsx` | Footer with links and credit |
| `src/data/mosques.ts` | Mosque data (single source of truth) |
| `src/data/blog.ts` | Blog posts (fact-checked articles) |
| `src/components/ui/*` | shadcn/ui components |
| `public/` | Favicons, manifest, robots.txt, sitemap, ai.txt, static assets |

---

## To-Do List

- [x] **Persistence** — Save bucket list and “liked” mosques (`localStorage`).
- [x] **Detail pages** — Dedicated page per mosque at `/mosque/:id` (description, facilities, SEO).
- [x] **Search** — Search mosques by name, country, city, description; URL-synced; advanced filters.
- [x] **Real images** — Inline mosque photos from Wikimedia Commons (CC-licensed).
- [x] **Prayer times** — Footer link to IslamicFinder prayer times.
- [x] **Map view** — Interactive map (OpenStreetMap/Leaflet) for mosque locations.
- [x] **More mosques** — 199+ mosques in 50+ countries in `src/data/mosques.ts`.
- [ ] **i18n** — Optional Arabic (or other language) for UI and content.
- [ ] **Analytics** — Privacy-respecting analytics for understanding usage (optional).

---

## Future ideas

Ideas for future versions of MosqueList—data, visitor info, reconstruction, and tooling.

### Visitor info & tourism
- **Links to official tourist pages** — Per-mosque links to official visitor/tourism pages (e.g. government heritage sites, mosque-run visitor info) so users can check hours, tours, and rules.
- **Ticket / entry info** — Where relevant: free entry vs paid, non-tourist (worshipper) vs tourist ticket pricing, and booking links for timed slots where required (e.g. Sheikh Zayed, some historic sites).
- **Guided tours & experiences** — Surface whether guided tours exist, languages offered, and links to book (official or trusted partners).
- **Seasonal & event info** — Ramadan hours, Eid access, special open days or closures, so visitors can plan.

### Facilities & detail
- **Richer facilities data** — Expand beyond basic flags: wudu facilities (count, accessibility), parking, wheelchair access, women’s prayer area details, library, café, bookshop, ablution notes, and kid-friendly areas.
- **Accessibility** — Structured accessibility info (step-free access, ramps, accessible toilets, quiet room) for worshippers and tourists with mobility or sensory needs.
- **Prayer times integration** — Optional link or embed to live prayer times for the mosque (e.g. API or partner) so users see local times on the mosque page.

### Reconstruction & blueprints
- **“Build / rebuild” and blueprints** — Support for mosques that are under reconstruction, destroyed, or planned: add **blueprints**, plans, or reference images where available (e.g. Al-Nuri Mosul, historic rebuilds). Allow listing “mosques to rebuild” or “under reconstruction” with status and links to campaigns or official rebuild efforts.
- **Historic plans & archives** — Link or attach historic floor plans, sections, or archival docs (with rights cleared) for education and reconstruction reference.

### Data & scraping
- **Updated scraping pipeline** — Scripts or jobs to refresh mosque data from trusted sources (Wikipedia, official sites, UNESCO, tourism boards) for capacity, opening hours, and descriptions; keep a clear audit trail and human review for fact-checking.
- **Source freshness** — Track “last verified” or “last scraped” per field or per mosque so editors know what needs a refresh.
- **Structured opening hours** — Store and display opening hours (including “closed to tourists during prayer”) where available from scraping or manual entry.

### More product ideas
- **Offline / PWA** — Improve offline support (e.g. cache key mosque pages and map tiles) so the bucket list and explore work in low-connectivity travel.
- **User-submitted photos & tips** — Optional, moderated: visitors can submit photos or short tips (best time to visit, what to expect) tied to a mosque.
- **Routes & itineraries** — Pre-built or user-created “day in Istanbul” or “Gulf highlights” routes that link several mosques with order and transport hints.
- **Nearby mosques** — “Mosques near me” or “near this mosque” using coordinates for local discovery and travel planning.

---

## Recommended Improvements

### Product
- Add mosque detail view (full description, facilities, visiting info, map).
- Implement “Add to bucket list” from mosque cards and sync with Bucket List section.
- Add search and filters by country/region.
- Consider user accounts (optional) for syncing bucket list across devices.

### Performance
- Lazy-load images and consider `loading="lazy"` for below-the-fold cards.
- Code-split routes if more pages are added (e.g. `/mosque/:id`).
- Ensure hero image is optimized (e.g. WebP, responsive `srcset`).

### SEO & AI
- JSON-LD is implemented (WebSite, Place with geo, ItemList, BlogPosting) for mosque and blog pages.
- Sitemap includes homepage, mosque pages, blog posts, guides, glossary, and contributing; ai.txt is available for AI crawlers.
- Keep meta description and title unique per page; og-image and og:image:alt are set where applicable.

### File / Code
- **`src/data/mosques.ts`** — Consider splitting into `mosques.ts` and `timeline.ts`, or loading from JSON/CMS later.
- **Types** — Move shared types (e.g. `Mosque`) to `src/types/` if reused across features.
- **Env** — Use `import.meta.env` for public URL and any API base URLs (e.g. for future API).
- **Tests** — Add tests for filters, bucket list toggle, and key user flows (e.g. Vitest + React Testing Library).
- **E2E** — Optional Playwright/Cypress for critical paths (navigation, filter, bucket list).

---

## Contribution Guidelines

### How to Contribute
1. **Fork** the repository and clone your fork.
2. **Create a branch** — e.g. `git checkout -b feature/your-feature` or `fix/your-fix`.
3. **Install and run locally** — `npm install` then `npm run dev`.
4. **Make changes** — Follow existing code style (TypeScript, Tailwind, functional components).
5. **Test** — Run `npm run lint` and `npm run test`; manually test on mobile and desktop.
6. **Commit** — Use clear messages (e.g. “Add search to mosque grid”, “Fix mobile menu close”).
7. **Push** to your fork and open a **Pull Request** against the main branch.
8. **Describe your PR** — What changed, why, and how to test.

### Code Style
- Use **TypeScript** for all new code; avoid `any` where possible.
- Prefer **functional components** and hooks (no class components).
- Use **Tailwind** for layout and styling; keep custom CSS in `index.css` or component-level only when needed.
- Use **semantic HTML** and **aria-** attributes for interactive elements (e.g. icon-only buttons).
- Keep components focused; extract reusable pieces into shared components or hooks.

### Adding a New Mosque
- Edit `src/data/mosques.ts`.
- Use the existing `Mosque` interface: `id`, `name`, `arabicName?`, `location`, `country`, `capacity`, `established`, `area`, `annualVisitors`, `facilities`, `significance`, `description`, `imageUrl`, `isHolySite`, `architecturalStyle?`, `womenPrayerArea`, `touristFriendly`.
- Use a kebab-case `id` (e.g. `blue-mosque`). Add a placeholder or real image URL for `imageUrl`.

### Reporting Issues
- Open an issue with a clear title and description.
- Include steps to reproduce, expected vs actual behavior, and (if relevant) device/browser.

### License
- Contributions are welcome under the same terms as the project license (see repository license file if present).

---

## Getting Started

### Prerequisites
- **Node.js** 18+ and **npm** (or Bun; the project uses `package.json` scripts).

### Install and run
```bash
git clone <YOUR_GIT_URL>
cd mosquelist
npm install
npm run dev
```
Then open [http://localhost:8080](http://localhost:8080) (or the port shown in the terminal).

### Scripts
| Command | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build (output in `dist/`) |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest tests |

### Deploy
- Build with `npm run build` and deploy the `dist/` folder to any static host (e.g. Vercel, Netlify, GitHub Pages).
- The project includes a `vercel.json` for Vercel (SPA redirects).

### Testing the app (mobile responsiveness & functionality)
- **Local**: Run `npm run dev`, open http://localhost:8080 in Chrome or Safari.
- **Automated mobile viewport tests**: `npm run test -- src/test/mobile-responsive.test.tsx` (375px; see [docs/mobile-testing-guide.md](docs/mobile-testing-guide.md)).
- **Mobile responsiveness (manual)**: Use DevTools (F12 → Toggle device toolbar or Cmd+Shift+M), select a device (e.g. iPhone 12, Pixel 5) and check:
  - Header: logo and hamburger menu visible; tapping menu opens nav links and “Start Your Journey”.
  - Hero: headline and CTAs readable; “Explore Mosques” / “Start My List” stack on small screens; stats row (199+, 50M+, 50+) readable.
  - Explore/Map: filters and curated lists work; map shows mosque markers; grid/list toggle works.
  - Timeline: events stack vertically; cards readable.
  - Bucket list: progress bar and checklist readable; toggling visited state works.
  - Footer: links and credit readable and tappable.
- **Functionality**: Test anchor links (Explore → #mosques, Timeline → #timeline, My List → #bucket-list), filter buttons, grid/list toggle, heart “like” on a mosque card, and bucket list checkboxes.

---

## SEO & AI Optimization

This project is structured for search and AI discoverability:

- **Semantic HTML** — Sections, headings, and landmarks for crawlers and assistive tech.
- **Meta tags** — Title, description, and keywords in `index.html`; Open Graph and Twitter Card tags use project-owned URLs (no third-party branding in meta).
- **Canonical URL** — Set to the production origin to avoid duplicate content.
- **Web manifest** — `public/site.webmanifest` with app name and icons for PWA and rich results.
- **robots.txt** — Allows crawlers; extend with `Sitemap:` when you add a sitemap.

**Sitemap** — Generated at build time: homepage, all `/mosque/:id` URLs, blog posts, guides, glossary, and contributing. Referenced in `robots.txt`. Run `npm run build` to regenerate.

**ai.txt** — `public/ai.txt` provides a short summary of the project for AI crawlers. JSON-LD (WebSite, Place, ItemList, BlogPosting) is used on relevant pages for rich results.

---

*Made with care for the Ummah. A project by [ummah.build](https://ummah.build).*

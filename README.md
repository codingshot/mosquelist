# MosqueList

**Discover, explore, and plan your spiritual journey to the world's most magnificent mosques.**

MosqueList is a single-page web app for Muslims and travelers who want to explore significant mosques worldwide, learn their history, and build a personal prayer bucket list. From the three holiest sites (Masjid al-Haram, Al-Masjid an-Nabawi, Al-Aqsa) to architectural landmarks across 40+ countries, the app helps you plan visits and track your journey.

---

## Features

### Explore Mosques
- **Curated mosque catalog** — Browse a growing list of significant mosques with names (English and Arabic), locations, capacity, establishment dates, and brief descriptions.
- **Filter by category** — View All Mosques, Holy Sites only (the three holiest sites in Islam), or Tourist Friendly mosques.
- **Grid and list views** — Switch between card grid and list layout for comfortable browsing.
- **Mosque cards** — Each card shows image, name, location, capacity, establishment date, significance, facilities (e.g. women’s prayer area, tourist-friendly), and a “Holy Site” badge where applicable.

### Timeline
- **Historical timeline** — Scroll through key dates (622 CE to present) for when major mosques were built or expanded.
- **Alternating layout** — Timeline events alternate left/right on desktop for easy reading.

### My Mosque Bucket List
- **Track visits** — Mark mosques as visited and see progress (e.g. 2/5 visited).
- **Progress bar** — Visual progress for your bucket list.
- **“Places to Pray” checklist** — Check off sites with an “Alhamdulillah” style completion state.
- **Add more (UI)** — Button to extend the list (backend/persistence can be added later).

### Navigation & Layout
- **Sticky header** — Navigation with logo, Explore / Timeline / My List / About, and CTAs.
- **Mobile menu** — Hamburger menu with full nav and “Start Your Journey” CTA.
- **Smooth anchor links** — In-page links to #mosques, #timeline, #bucket-list, #about.
- **Footer** — Brand, quick links (Browse, Timeline, Bucket List, Prayer Times), resources, and credit to ummah.build.

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

---

## Project Structure

| Path | Purpose |
|------|--------|
| `src/App.tsx` | Root app: QueryClient, Router, TooltipProvider, Toaster, routes |
| `src/main.tsx` | React entry point, mounts `App` into `#root` |
| `src/pages/Index.tsx` | Main page: Navigation, Hero, MosqueGrid, Timeline, BucketList, Footer |
| `src/pages/NotFound.tsx` | 404 page |
| `src/components/Navigation.tsx` | Header with logo, nav links, mobile menu |
| `src/components/HeroSection.tsx` | Hero with headline, CTAs, stats |
| `src/components/MosqueGrid.tsx` | Mosque grid/list, filters (all/holy/tourist), view toggle |
| `src/components/MosqueCard.tsx` | Single mosque card (image, badges, like, details) |
| `src/components/Timeline.tsx` | Historical timeline of major mosques |
| `src/components/BucketList.tsx` | Bucket list checklist and progress |
| `src/components/Footer.tsx` | Footer with links and credit |
| `src/data/mosques.ts` | Mosque data and timeline events (single source of truth) |
| `src/components/ui/*` | shadcn/ui components |
| `public/` | Favicons, manifest, robots.txt, static assets |

---

## To-Do List

- [x] **Persistence** — Save bucket list and “liked” mosques (`localStorage`).
- [x] **Detail pages** — Dedicated page per mosque at `/mosque/:id` (description, facilities, SEO).
- [x] **Search** — Search mosques by name, country, city, description; URL-synced; advanced filters.
- [x] **Real images** — Inline mosque photos from Wikimedia Commons (CC-licensed).
- [x] **Prayer times** — Footer link to IslamicFinder prayer times.
- [ ] **Map view** — Optional map (e.g. Mapbox/Leaflet) for mosque locations.
- [ ] **More mosques** — Expand `src/data/mosques.ts` toward the “100+” suggested in the hero.
- [ ] **i18n** — Optional Arabic (or other language) for UI and content.
- [ ] **Analytics** — Privacy-respecting analytics for understanding usage (optional).

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
- Add JSON-LD (e.g. `WebSite`, `Organization`, or `ItemList` for mosques) in `index.html` or via React.
- Add an `og-image` (e.g. 1200×630) and reference it in Open Graph and Twitter meta tags.
- Consider a sitemap (e.g. `/sitemap.xml`) when you have multiple URLs.
- Keep meta description and title unique and descriptive (already improved in `index.html`).

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
- **Mobile responsiveness**: Use DevTools (F12 → Toggle device toolbar or Cmd+Shift+M), select a device (e.g. iPhone 12, Pixel 5) and check:
  - Header: logo and hamburger menu visible; tapping menu opens nav links and “Start Your Journey”.
  - Hero: headline and CTAs readable; “Explore Mosques” / “Start My List” stack on small screens; stats row (100+, 50M+, 40+) readable.
  - Mosque grid: filters (All / Holy Sites / Tourist Friendly) wrap or scroll; grid becomes single column; grid/list toggle works.
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

**Sitemap** — `public/sitemap.xml` is generated at build time from mosque data (homepage + all `/mosque/:id` URLs) and referenced in `robots.txt`. Run `npm run build` to regenerate.

You can add a dedicated **og-image** (e.g. 1200×630) for better rich results; see “Recommended Improvements” above.

---

*Made with care for the Ummah. A project by [ummah.build](https://ummah.build).*

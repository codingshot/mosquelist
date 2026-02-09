# Mobile Responsive Testing Guide

How to test MosqueList on mobile viewports. Automated tests run at 375px; use this guide for manual checks and real devices.

---

## Automated tests (375px viewport)

Run the mobile viewport test suite:

```bash
npm run test -- src/test/mobile-responsive.test.tsx
```

These tests mock `window.innerWidth` (375), `innerHeight` (667), and `matchMedia` so that mobile breakpoints apply. They assert that key pages render and that main landmarks and headings are present. They do **not** check for horizontal overflow or touch targets—use manual testing for that.

---

## Manual testing (Chrome DevTools)

1. **Start the app:** `npm run dev` → open http://localhost:8080 (or the port shown).

2. **Open DevTools:** F12 or Cmd+Option+I (Mac) / Ctrl+Shift+I (Windows).

3. **Toggle device toolbar:** Cmd+Shift+M (Mac) / Ctrl+Shift+M (Windows), or click the device icon in DevTools.

4. **Pick a device:** e.g. iPhone SE (375×667), iPhone 12 Pro (390×844), Pixel 5 (393×851), or set a custom size (e.g. 375×667).

5. **Check these pages and flows:**

   | Page / flow | What to check |
   |-------------|----------------|
   | **Home (/)** | Hero text readable; CTAs stack; stats row wraps; list cards single column; no horizontal scroll. |
   | **Explore (/explore)** | Filters wrap; grid/list toggle usable; mosque cards readable; sort dropdown works; no overflow. |
   | **Map** (via /map or Explore → Map view) | Map fills viewport; markers tappable; filters work; no overlapping UI. |
   | **Lists (/lists)** | List cards stack; star and tap to open work; "View My List" visible. |
   | **List detail (/lists/holy-sites)** | Mosque list readable; add-to-list and navigation work. |
   | **Bucket list (/bucket-list)** | List and reorder usable; empty state and CTAs visible. |
   | **Blog (/blog)** | Card grid stacks; post cards readable. |
   | **Blog post (/blog/…)** | Article readable; related posts and links tappable. |
   | **Mosque detail (/mosque/blue-mosque)** | Image, details, map; actions (heart, share, add to list) ≥44px. |
   | **Guides** (/guides/travel, /guides/visitor-tips) | Prose readable; no long lines; buttons tappable. |
   | **Navigation** | Hamburger opens; links and "Start Your Journey" work; My List (heart) tappable. |
   | **Footer** | Links wrap; no overflow. |

6. **Rotate:** Test portrait and landscape if relevant.

7. **Touch targets:** Buttons and links should be at least ~44×44px where possible (nav, CTAs, list actions).

---

## What to fix if you see issues

- **Horizontal scroll:** Narrow the offending section (e.g. `max-w-full`, `overflow-x-auto` on tables), or allow wrapping (`flex-wrap`, shorter text).
- **Text too small or cramped:** Increase font size or padding at small breakpoints (`text-base sm:text-lg`, `p-4 sm:p-6`).
- **Overlapping elements:** Adjust z-index or layout at `md:` or `sm:` so mobile has a different stacking or order.
- **Tiny tap targets:** Use `min-h-[44px] min-w-[44px]` or `py-3 px-4` for primary actions.

---

## Related

- **Production checklist:** [production-checklist.md](./production-checklist.md) (includes post-deploy checks).
- **Test file:** `src/test/mobile-responsive.test.tsx` (viewport mock and page assertions).

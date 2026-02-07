---
name: mosquelist-performance
description: Performance patterns and page-by-page guide for MosqueList. Use when optimizing the app, adding or changing pages, or when the user asks about performance, page structure, or "every page."
---

# MosqueList Performance & Pages

## Before using this skill (Socratic prompts)

- **What is actually slow?** (First load, route change, scroll, filter?) Use this skill when the request is about performance or page structure—not for data accuracy, copy, or map behavior.
- **Which page or route is affected?** Check the "Every Page" table below so changes match existing patterns (lazy load, chunks, images).
- **Is the change above or below the fold?** That determines eager vs lazy images and whether a new chunk is needed.

See `docs/socratic-prompts.md` for more guiding questions.

## Performance Rules

### Build (Vite)

- **Manual chunks** (`vite.config.ts`): `map` (leaflet/react-leaflet), `dnd` (@dnd-kit), `query` (@tanstack/react-query). Keeps Map and BucketList drag-drop in separate chunks; map loads only on `/map`.
- **Chunk size**: `chunkSizeWarningLimit: 600`. Prefer splitting heavy deps into manual chunks over growing the main bundle.

### Route loading

- **Lazy routes**: All routes except Index use `lazy(() => import("./pages/..."))`. Index is eager so the homepage renders without waiting for a chunk.
- **Suspense**: Single `<Suspense fallback={<LoadingScreen />}>` wraps `<Routes>`. No per-route fallbacks.

### Images

- **Above-the-fold**: `loading="eager"` (or omit), `decoding="async"`. Hero and first mosque card can use `fetchpriority="high"` where applicable.
- **Below-the-fold / lists**: `loading="lazy"`, `decoding="async"`. Used in MosqueCard (index >= 6), MosquePage related mosques, ListDetailPage, BucketList add-mosque sheet.
- **Fallback**: Every mosque/placeholder `img` has `onError` → `src = "/placeholder.svg"`. Use `mosque.imageUrl?.trim() || "/placeholder.svg"` when `imageUrl` can be missing.

### Components

- **MosqueCard**: Wrapped in `memo()` to avoid re-renders when parent (grid) updates unrelated state.
- **Heavy lists**: MosqueGrid filters/sorts with `useMemo`; MapPage filters with `useMemo`. Keep derived data memoized.

### PWA / Caching

- **Runtime caching**: Wikimedia/Commons image URLs cached (CacheFirst, 30 days). See `vite.config.ts` → VitePWA → workbox → runtimeCaching.

---

## Every Page

| Route | Page component | Purpose | Performance notes |
|-------|----------------|---------|--------------------|
| `/` | `Index` | Home: hero, explore preview, timeline, bucket list, curated lists | Eager load. Hero image: fetchpriority="high". MosqueGrid preview limits items. |
| `/explore` | `ExplorePage` | Full mosque grid with search, filters, sort, view modes | Lazy. MosqueGrid is the main cost; cards use memo + lazy images. |
| `/mosque/:id` | `MosquePage` | Mosque detail: image, meta, related, bucket list CTA | Lazy. Hero img eager; related section imgs lazy. |
| `/map` | `MapPage` | Leaflet map, region/country filters, mosque markers | Lazy. In "map" chunk (leaflet). Memoized filtered lists. |
| `/timeline` | `TimelinePage` | Timeline of mosque events | Lazy. Renders Timeline component. |
| `/bucket-list` | `BucketListPage` | User bucket list + "other lists" links | Lazy. Uses "dnd" chunk for drag-drop. |
| `/lists` | `ListsPage` | Curated list cards (Holy Sites, Biggest, etc.) | Lazy. Light; only links and counts. |
| `/lists/:slug` | `ListDetailPage` | Single list: mosque cards, Add all / Add | Lazy. List images lazy. |
| `/about` | `AboutPage` | About + links | Lazy. Static content. |
| `/guides/travel` | `TravelGuidePage` | Travel guide copy | Lazy. Static. |
| `/guides/visitor-tips` | `VisitorTipsPage` | Visitor tips copy | Lazy. Static. |
| `*` | `NotFound` | 404 | Lazy. Minimal. |

---

## Adding or Changing a Page

1. **New route**: Add `const NewPage = lazy(() => import("./pages/NewPage"));` and `<Route path="..." element={<NewPage />} />`. No need for a separate Suspense.
2. **Images**: Use `loading="lazy"` and `decoding="async"` for any image below the fold or in a list; add `onError` fallback to `/placeholder.svg`.
3. **Heavy lib**: If the page pulls in a large dependency (e.g. a chart lib), add a `manualChunks` entry in `vite.config.ts` so it gets its own chunk.
4. **List items**: If rendering many items (e.g. cards), wrap the item component in `memo()` and use `useMemo` for the filtered/sorted list.

---

## Quick checklist (new page)

- [ ] Route is lazy-loaded (except Index).
- [ ] Images: lazy + decoding + onError fallback (or eager only for single above-fold hero).
- [ ] No heavy sync imports of leaflet/dnd/query in the page unless needed; manual chunks will split them.
- [ ] PageSEO present for public pages (title, description, path).
- [ ] Main landmark: `<main id="main-content">` for skip link target.

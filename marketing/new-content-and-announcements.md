# New Content & Announcements — MosqueList

**Use this doc to:** (1) Keep copy aligned with the latest product, (2) Generate new marketing content, (3) Plan announcement blogs. Update stats and features here when the product ships changes. **Internal only.**

---

## 1. Latest stats & features (update regularly)

**Check the codebase when planning campaigns:** run `node -e "const d=require('./src/data/mosques.json'); console.log('mosques:', d.mosques.length); console.log('countries:', new Set(d.mosques.map(m=>m.country)).size);"` from repo root, or inspect `src/data/mosques.json` and the app UI.

| As of | Mosques | Countries | Notes |
|-------|---------|-----------|--------|
| Current | **199** | **85** | Update README, pitch, and persona copy when you lock numbers (e.g. "199 mosques in 85 countries"). |

### Recent product features to highlight in marketing

- **Explore: table view** — Switch to table view; sort by name, country, capacity, area, established, visitors, location; inline mosque image next to name.
- **Download mosque data** — From Explore (current view or curated list) and from **Advanced filters**: download as **JSON, CSV, Markdown, or ZIP** (all three).
- **My List (bucket list): download & share** — Download your bucket list as JSON, CSV, Markdown, or ZIP. **Share** tab: editable message, character count, and share buttons (Copy, X/Twitter, LinkedIn, Facebook) with platform-appropriate limits.
- **My List: advanced filters** — Filter bucket list (e.g. visitor-friendly only) via Filters sheet.
- **Timeline** — Year range filter with **All years / Custom** radio; slider for custom range; Reset to show all.
- **Explore subtitle** — Dynamic counts: “Discover X mosques in Y countries” from actual data.
- **Footer** — PRAYSAP link (prayer times) opens in new tab.
- **Blog** — 35+ fact-checked articles; e.g. fork/contribute (MIT), Shia mosques, mosques by region, visitor guides.

Use the bullets above in “What’s new” announcements, founder posts, and press one-liners.

---

## 2. New marketing content ideas

**Hooks and angles** — Turn these into tweets, captions, or email subject lines.

- **Milestone:** “199 mosques in 85 countries—and you can download the list.” / “We just passed 199 mosques in 85 countries. Explore, filter, and take the data with you.”
- **Download angle:** “Your mosque bucket list, in your pocket—or in a CSV.” / “Download your mosque list: JSON, CSV, or Markdown. Plan offline, share with friends, keep your own archive.”
- **Share angle:** “Built a mosque bucket list? Share it. We added one-tap share to X, LinkedIn, and Facebook—with a message you can edit.”
- **Table + sort:** “Sort by capacity, date, or country. See the world’s mosques in a table and find your next stop.”
- **Founder + feature:** “One of my favorite things is praying in the biggest mosque in the city. Now you can sort by capacity, download the list, and share your own.” (Tie to [Founder / personal angle](./announcements-by-persona.md).)
- **Seasonal:** Ramadan / Eid / Hajj season — “Plan your spiritual journey: 199 mosques, 85 countries, and a bucket list you can download and share.”
- **Open source:** “MosqueList is MIT open source. Fork it, add a mosque, or download the data. Your journey, your list.”

---

## 3. New announcement blog ideas

**Titles and one-line descriptions** — Use for future Blog posts. When you publish, add slug to `src/data/blog.ts` and link from here.

| # | Title idea | One-line description |
|---|------------|------------------------|
| 1 | **What’s New on MosqueList: More Mosques, New Ways to Explore and Share** | Product update: 199 mosques in 85 countries, table view and sorting, download (JSON/CSV/Markdown/ZIP), bucket list download and social share, advanced filters, timeline year filter. |
| 2 | **199 Mosques in 85 Countries: A Milestone for MosqueList** | Short milestone post: how the catalog grew, which regions were added, and thank-you to contributors and users. |
| 3 | **Download Your Mosque List: JSON, CSV, Markdown, or All Three** | How to use the new download options from Explore and My List; use cases (offline planning, research, sharing with a travel buddy). |
| 4 | **Share Your Mosque Bucket List: Tips for Social and Email** | How the Share feature works; how to edit the message for X, LinkedIn, and Facebook; ideas for “smart posts” (top mosques, one sentence). |
| 5 | **Explore Mosques in Table View: Sort by Capacity, Date, or Country** | Why we added table view; how to sort and filter; combining with download for trip planning. |
| 6 | **Ramadan 20XX: Plan Your Spiritual Journey with MosqueList** | Seasonal: use filters, map, and bucket list to plan mosque visits; link to visitor etiquette and best-times articles. (Update year.) |
| 7 | **New Year, New List: 5 Mosques to Add to Your Bucket List** | Light, inspirational: pick 5 standout mosques (e.g. by region or style) and encourage readers to explore and save. |
| 8 | **We Added [Country/Region]: [N] New Mosques on the Map** | Template for “new mosques added” announcements; repeat when you add a batch (e.g. “We added 12 mosques in West Africa”). |

**Already published (for reference):**

- *Introducing MosqueList: Discover, Plan, and Track Your Mosque Journey*
- *How to Fork and Contribute to MosqueList: MIT Open Source*
- *What's New on MosqueList: More Mosques, New Ways to Explore and Share* (slug: `whats-new-mosquelist-more-mosques-explore-share`)

---

## 4. Where to update when numbers or features change

| Place | What to update |
|-------|------------------|
| **README.md** | “199+ mosques in 50+ countries” → use actual counts (e.g. “199 mosques in 85 countries”). |
| **pitch-and-messaging.md** | Elevator pitch, one-sentence pitch, value props (mosque/country counts). |
| **announcements-by-persona.md** | All persona blocks and founder angles (replace “199+”, “50+”). |
| **social-announcements.md** | Twitter, Instagram, Facebook, LinkedIn, email subject lines. |
| **Blog** | “Introducing” and any “What’s new” post in `src/data/blog.ts`. |
| **This doc** | Table in §1; add/remove feature bullets; add new blog ideas in §3. |

---

## 5. Quick reference

- **Personas & founder angle:** [announcements-by-persona.md](./announcements-by-persona.md)
- **Pitch & messaging:** [pitch-and-messaging.md](./pitch-and-messaging.md)
- **Social templates:** [social-announcements.md](./social-announcements.md)
- **Seasonal timing:** [seasonal-calendar.md](./seasonal-calendar.md)
- **Content strategy & SEO:** [../docs/content-strategy.md](../docs/content-strategy.md)

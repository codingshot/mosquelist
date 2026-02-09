# Content & Blog Strategy for SEO

Strategy for creating blogs and pages that rank for search terms around sacred mosques, “biggest” mosques, history, architecture, and related topics. Use with [personas.md](./personas.md) to tailor tone and depth.

---

## 1. Target topic clusters

### A. Sacred & holy mosques in Islam
- **Target queries**: “sacred mosques in Islam,” “three holiest mosques,” “holiest sites in Islam,” “Masjid al-Haram,” “Al-Aqsa significance.”
- **Content ideas**:
  - Pillar page: “The Three Holiest Mosques in Islam” (Mecca, Medina, Jerusalem) – history, significance, Quran/hadith context.
  - “Why is Masjid al-Haram the holiest mosque?”
  - “Al-Aqsa Mosque: history and significance in Islam.”
- **SEO**: Focus on clear H1/H2s, FAQ schema where it fits, internal links to mosque detail pages.

### B. Biggest mosques (by area, capacity, country)
- **Target queries**: “biggest mosque in the world,” “largest mosque by area,” “largest mosque by capacity,” “biggest mosque in [country],” “largest mosque in Africa/Asia.”
- **Content ideas**:
  - “Largest Mosques in the World by Capacity” (list + table, update yearly).
  - “Largest Mosques in the World by Area.”
  - “Biggest Mosque in [Country]” – one page or section per country (Pakistan, Indonesia, Saudi Arabia, UAE, Turkey, etc.).
  - “Top 10 Largest Mosques in Asia / Africa / the Middle East.”
- **SEO**: Use exact phrases in titles and first paragraph; add structured data (Table, ItemList) where relevant.

### C. History of grand mosques
- **Target queries**: “history of Masjid al-Haram,” “when was the Blue Mosque built,” “history of grand mosques,” “oldest mosques in the world.”
- **Content ideas**:
  - Timeline article: “History of the World’s Grand Mosques (622 CE – Present).”
  - Per-mosque: “History of [Mosque Name]” – expansions, key dates, rulers.
  - “Oldest Mosques Still in Use.”
- **SEO**: Dates and events in clear list or timeline; internal links to timeline and mosque pages.

### D. Masjid architecture
- **Target queries**: “Islamic mosque architecture,” “masjid architecture explained,” “mosque dome and minaret,” “types of Islamic architecture.”
- **Content ideas**:
  - “Masjid Architecture Explained: Domes, Minarets & Mihrab.”
  - “Ottoman vs. Mughal vs. Moorish Mosque Architecture.”
  - “Famous Mosques and Their Architectural Styles” (with examples from the app).
- **SEO**: Define terms in H2s; use images with alt text; link to specific mosques in the app.

### E. Cost, construction & scale
- **Target queries**: “cost of building biggest mosques,” “most expensive mosque,” “Sheikh Zayed mosque cost,” “Hassan II mosque cost.”
- **Content ideas**:
  - “Cost of Building the World’s Largest Mosques” (with caveats: estimates, currency, date).
  - “How Much Did [Mosque] Cost to Build?”
  - “Most Expensive Mosques Ever Built.”
- **SEO**: Use “cost,” “budget,” “construction” in titles; add “estimated” and source/date where needed for trust.

### F. Visitor & travel
- **Target queries**: “can non-Muslims visit Blue Mosque,” “tourist-friendly mosques,” “best mosques to visit,” “how to visit Masjid al-Haram.”
- **Content ideas**:
  - “Tourist-Friendly Mosques Around the World.”
  - “Visitor Guide: [Mosque Name] – Hours, Dress Code, Tips.”
  - “Hajj and Umrah: A Brief Guide to the Holy Mosques.”
- **SEO**: Practical headings (hours, dress code, tips); local business or Place schema where relevant.

---

## 2. Page types and URL structure

| Type | Example URL | Purpose |
|------|-------------|--------|
| Pillar / category | `/blog/sacred-mosques-islam` | Cluster hub; links to subtopics and app pages |
| List / ranking | `/blog/largest-mosques-by-capacity` | Targets “biggest/largest” queries |
| Country / region | `/blog/largest-mosques-pakistan` | Targets “biggest in [country]” |
| Single mosque deep-dive | `/blog/history-masjid-al-haram` | Supports mosque detail page; internal links |
| Explainers | `/blog/masjid-architecture-explained` | Targets “explained” and definition queries |
| Cost / construction | `/blog/cost-of-worlds-largest-mosques` | Targets “cost” and “expensive” |

Use clear, keyword-rich slugs; keep hierarchy flat (e.g. `/blog/...`) for simplicity.

---

## 3. SEO best practices for every piece

- **Title & meta description**: Include primary keyword; keep title under ~60 chars, description under ~155.
- **Headings**: One H1 (main topic); H2/H3 for sections; use target phrases naturally in headings.
- **Internal links**: Link to mosque detail pages (`/mosque/:id`), explore page, timeline, and related blog posts.
- **Schema**: Article for posts; FAQPage for Q&A; Table or ItemList for rankings/lists; BreadcrumbList.
- **Media**: Optimized images (WebP, alt text with mosque name and topic); avoid generic stock-only.
- **Freshness**: Add “Last updated” and refresh stats/dates periodically for “biggest” and “cost” content.
- **Accuracy**: Follow [skills.md](./skills.md) for mosque, Quran, and hadith; cite sources where needed.

---

## 4. Content calendar (example)

| Month | Theme | Example pieces |
|-------|--------|----------------|
| 1 | Sacred mosques | Three holiest mosques; Al-Aqsa significance |
| 2 | Biggest by numbers | Largest by capacity; largest by area |
| 3 | By region | Biggest mosque in Pakistan; in Indonesia |
| 4 | Architecture | Masjid architecture explained; Ottoman vs Mughal |
| 5 | History | Timeline of grand mosques; history of Blue Mosque |
| 6 | Cost & construction | Cost of biggest mosques; most expensive |
| 7 | Travel | Tourist-friendly mosques; visitor guides |
| 8+ | Refresh & expand | Update lists; new country pages; new mosque deep-dives |

Adjust by search volume and business priority; repurpose for social and email.

---

## 5. Metrics to track

- Organic impressions and clicks (GSC) for target keywords.
- Rankings for “biggest mosque,” “sacred mosques,” “masjid architecture,” “cost of [mosque],” etc.
- CTR and engagement (time on page, scroll) for pillar and list pages.
- Internal link clicks to mosque pages and explore/timeline (in-app or analytics).

Use this doc as the master outline; add new clusters and pages here as the strategy evolves.

---

## 6. When you add new features (sitemap & SEO)

When you add a **new route**, **new list**, **new blog post**, or **new guide**, keep sitemap and SEO in sync:

- **New static page (e.g. new guide):** Add route in `App.tsx`, add URL in `scripts/generate-sitemap.js`, and add to **Key pages** (and if relevant, “What this site offers”) in `public/ai.txt`. See **[sitemap-seo-and-features.md](./sitemap-seo-and-features.md)** for the full checklist.
- **New blog post:** Add in `src/data/blog.ts`; sitemap picks up new slugs automatically.
- **New list:** Add in `src/data/lists.json`; sitemap picks up new list slugs automatically. Optionally mention in ai.txt “Curated lists” if it’s a major list (e.g. Shia Mosques).
- **Copy or scale change (e.g. mosque/country counts):** Update `index.html` meta/og/twitter, any guide or landing copy (e.g. Travel guide, README), and [pitch-and-messaging.md](../marketing/pitch-and-messaging.md).

**Single source of truth for “what to update”:** [docs/sitemap-seo-and-features.md](./sitemap-seo-and-features.md).

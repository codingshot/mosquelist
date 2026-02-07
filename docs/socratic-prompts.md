# Socratic Prompts for MosqueList

Use these questions to improve the app and to choose the right skills and scope. They are meant to guide reflection before acting, not to replace documentation.

---

## 1. Before adding or changing a feature

- **What user need does this serve?** If we didn’t build it, what would the user do instead?
- **Who is affected?** (First-time visitor, someone building a bucket list, someone on a slow connection, screen-reader user?)
- **What is the smallest change that would satisfy that need?** Can we ship less and learn?
- **Where does it live?** (New page, existing page, footer, nav?) Does that match how people already look for it?

---

## 2. Before changing data or content

- **What is the source of this fact?** Would a second independent source agree? (See [skills.md](./skills.md) source hierarchy.)
- **If we state a number (capacity, area, date), can we cite it?** Should we say “approximately” or “per [source]”?
- **Does this wording respect holy sites and diverse users?** Is it neutral and factual, not sectarian or political?
- **Would a fact-checker approve this as-is?** If not, what would we change before publishing?

---

## 3. Before changing UI or layout

- **Can someone complete the main task with keyboard only?** With a screen reader? With large touch targets?
- **Does this work on a narrow viewport and on a wide one?** Did we check one real device or just resize the browser?
- **If we add a new link or button, where does it go?** (Nav, footer, in-context?) Is that consistent with the rest of the app?
- **What happens when data is empty or loading?** Do we show a clear state or leave a blank?

---

## 4. Before optimizing performance

- **What is actually slow?** (First load, route change, scroll, filter?) Did we measure or assume?
- **Who pays the cost?** (Bundle size, main thread, network?) Does the fix help the right metric?
- **Is this page above or below the fold?** Should images/scripts be eager or lazy? (See performance skill.)
- **If we add a heavy dependency, does it block the first paint?** Should it be in a separate chunk or route?

---

## 5. Choosing and using skills appropriately

- **Which skill fits this request?** (Performance, map/addresses, data accuracy, content strategy?) If none fit, do we need a new skill or just the existing docs?
- **What is in scope for this skill?** Am I using it for its stated purpose (e.g. “when optimizing the app” or “when testing the map”) or stretching it?
- **What would “done” look like?** Does the skill describe a checklist or outcome I can verify?
- **Am I changing the right layer?** (Data vs. component vs. route vs. copy?) Skills often assume a layer; check the skill description.

---

## 6. Before writing or editing copy (blog, meta, UI)

- **What does the user search for or care about here?** (Sacred sites, biggest mosques, visitor tips?) Does the first line speak to that?
- **Is this fact-checkable?** If we cite Quran or hadith, do we use the formats in [skills.md](./skills.md)?
- **Does the tone match [content-strategy.md](./content-strategy.md) and [personas.md](./personas.md)?** Respectful, clear, and useful for someone planning a visit or learning.

---

## 7. Before shipping or merging

- **Did we run the relevant tests?** (`npm run test`, manual map/address check if we touched those.)
- **Did we run the fact-check script (if we changed mosque data)?** (`npm run fact-check`.)
- **Are there new routes or links?** Should sitemap, nav, or footer be updated?
- **If something breaks in production, what would we roll back or fix first?** Is that acceptable?

---

## Quick reference: which doc or skill?

| If you are… | Use first | Then |
|-------------|-----------|------|
| Adding or changing a page, optimizing load | Performance skill (page table, lazy load, chunks) | [architecture-patterns.md](./architecture-patterns.md) if touching data |
| Testing or changing map, filters, address display | Map/addresses skill (test + manual checklist) | [skills.md](./skills.md) if editing mosque data |
| Adding or editing mosque data, Quran/hadith | [skills.md](./skills.md) (source hierarchy, checklists) | [architecture-patterns.md](./architecture-patterns.md) for style fields |
| Writing blog or SEO content | [content-strategy.md](./content-strategy.md), [personas.md](./personas.md) | [skills.md](./skills.md) for citations |
| Deciding what to build or prioritize | This doc (Socratic prompts) | [improvements.md](./improvements.md) for roadmap |

Use these prompts in markdown, in AI instructions, or in review so the app and skills stay focused and appropriate.

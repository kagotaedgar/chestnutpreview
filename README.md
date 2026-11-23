# Chestnut Insurance Agency website

Static site, zero dependencies, built for Cloudflare Pages. Content lives in `src/`, the design system in `public/styles.css`.

## Run and deploy

```
node build.mjs     # writes ./dist and MIGRATION.md
node check.mjs     # QA: links, titles, descriptions, headings, JSON-LD, sitemap, redirects
```

Cloudflare Pages settings: **Build command** `node build.mjs`, **Build output directory** `dist`, Node 18 or newer.

## Before launch (everything is centralised in `src/config.mjs`)

1. Phone, WhatsApp, email and office hours. Empty values hide the matching buttons rather than showing invented ones.
2. `formEndpoint` (any HTTPS endpoint that accepts a JSON POST) or `email`. Until one is set, forms validate and then tell the visitor plainly that nothing was sent.
3. IRA licence number and wording, exact Lavington Mall address, and the canonical host (`www` or not).
4. GA4 id (optional). Events fire for phone, WhatsApp, email clicks and form submissions.
5. Search the built pages for yellow `[...]` markers. Each is a fact that needs confirming (founder profiles, financial product provider arrangements, privacy notice legal review).
6. Photography. The site is deliberately typographic. Add authentic Kenyan photography as real files with descriptive alt text, not stock.

## Structure

- `src/products-business.mjs`, `products-personal.mjs`, `guides.mjs`: page content as data
- `src/redirects.mjs`: the 49 legacy URLs. `MIGRATION.md` is generated and shows OK, INTERIM or UNRESOLVED per URL
- `src/render.mjs`: layout, header, footer, forms, schema
- `build.mjs`: page templates, hubs, home, forms, sitemap, robots, `_redirects`, `_headers`

## Known gaps (from the Phase 2 plan)

- Pages in the sitemap and migration map that are not built yet: Airbnb, hotels, schools, clinics and other industry pages; SME package; machinery breakdown; political violence; employment practices; event liability; key person; project bonds; medical product-review guides; marine certificate guide; employee benefits hub; most of the 12-month content calendar.
- Redirect rows marked INTERIM point to the closest existing page until the preferred page ships.
- Redirects are provisional. Check them against Search Console and backlink data first.
- No premium figures, search volumes, insurer names, testimonials or statistics are used anywhere, by design.

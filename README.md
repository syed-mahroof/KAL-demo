# KAL website 2.0 — frontend demonstration

A restrained redesign of Kerala Automobiles Limited’s public website. The demo retains KAL’s identity and original photographs while improving navigation, vehicle discovery, readability and mobile usability.

## Run locally

Requires Node.js 22.12+ or 24 and npm.

```sh
npm ci
npm run dev
```

Preview: http://127.0.0.1:5173/

```sh
npm run build
npm run check
npm run preview
```

The build generates 18 standalone HTML pages. Each route contains its actual content before JavaScript runs. There is no server, database, paid API or runtime dependency.

## Deploy to Vercel

1. Push this folder to a Git repository and import it into Vercel.
2. Select **Vite** as the framework preset.
3. Use **npm run build** as the build command and **dist** as the output directory.
4. Deploy. No environment variables are required for the demonstration.
5. Optionally set **SITE_URL** to the final HTTPS preview URL and redeploy to generate canonical URLs, organization metadata and a sitemap.

`vercel.json` already sets the output directory, trailing slashes, security headers and demo indexing protection. Direct links such as `/products/kerala-neem-g/` work without an SPA rewrite.

The preview deliberately uses `noindex, nofollow` in HTML and response headers, and disallows crawling through robots.txt. This prevents the proposal demo from competing with the official KAL website.

## What works

- Homepage, about/history, manufacturing, public resources, news, gallery and contact.
- Nine vehicle detail pages, with original images and published specifications.
- Vehicle category filters, site search with empty states, keyboard-friendly menus and FAQs.
- Gallery enlargement with next/previous photos and keyboard navigation, text enlargement, visible focus indicators and reduced-motion support.
- Immersive desktop hero, automatic scene rotation, keyboard-accessible motion controls hidden during normal browsing, and three rotating heritage/benefit slots.
- Single-row scrolling vehicle filters, icon specifications with an accessible legend, and government/board leadership previews.
- Validated enquiry form with a local preview, downloadable text draft and optional email-app draft.
- Mobile navigation and responsive layouts, with local images and fonts.

The enquiry form sends nothing and stores nothing. “Open email draft” opens the visitor’s email app; sending remains their choice. Official tenders, RTI, disclosures, dealer information and statutory documents link to their original portals.

## Source structure

| Location                     | Purpose                                                    |
| ---------------------------- | ---------------------------------------------------------- |
| `src/templates.mjs`          | Shared header, footer, home page and reusable presentation |
| `src/pages.mjs`              | Supporting page content                                    |
| `src/data.mjs`               | Vehicle data and search records                            |
| `src/style.css`              | Design tokens and responsive styling                       |
| `src/main.js`                | Small progressive-enhancement interactions                 |
| `scripts/generate-pages.mjs` | Static page and metadata generation                        |
| `scripts/check-build.mjs`    | Built-page metadata, link and asset checks                 |
| `public/images/`             | Optimized KAL source images                                |
| `public/fonts/`              | Self-hosted Manrope and Public Sans                        |
| `audit/AUDIT.md`             | Findings and suggested production project scope            |
| `audit/asset-sources.json`   | Original asset URLs                                        |

Generated HTML files are build inputs. Edit `src/` rather than the generated pages, then run `npm run generate` to refresh the local preview. Vite updates client JavaScript and CSS automatically; template changes require regeneration.

The refinement research is recorded in [audit/REFINEMENT.md](audit/REFINEMENT.md). The latest visual and interaction decisions are in [audit/POLISH.md](audit/POLISH.md), with verification in [audit/QA.md](audit/QA.md). Current screenshots are in `audit/screenshots/polish/`; earlier research captures remain in `audit/screenshots/refinement/`.

For optional browser regression checks, run `npm run preview` after building, then `node scripts/check-browser.mjs`. This uses an existing Playwright installation rather than adding it to the project's dependencies. If it is installed elsewhere, set `PLAYWRIGHT_MODULE` to its absolute `index.mjs` path; set `BROWSER_EXECUTABLE` when an existing Chromium executable must be selected. `PREVIEW_URL` defaults to `http://127.0.0.1:4173`. Results are written to `audit/browser-results.json`.

## Production SEO handover

This is a proposal demo, not a migration of KAL’s live site. For a commissioned production release:

1. Set `SITE_URL` to the approved official HTTPS domain.
2. Set `PRODUCTION_SITE=true` to generate indexable HTML, robots.txt and sitemap.xml.
3. Remove the `X-Robots-Tag: noindex, nofollow` header from `vercel.json` or the production host.
4. Replace demonstration labels and connect approved enquiry/content systems.
5. Map and preserve the existing URLs; configure permanent redirects for changed URLs.
6. Validate current specifications, appointments, notices, certifications and approved copy with KAL.
7. Verify Search Console ownership, submit the sitemap, inspect indexing and measure real search visibility.

Changing frontend metadata alone cannot establish the cause of current rankings or guarantee a position for the ambiguous keyword “KAL”. See the audit for the evidence and remaining checks.

## Assets and attribution

Brand marks, vehicle photographs and gallery images originate from [KAL’s official website](https://kal.kerala.gov.in/) and remain the property of their respective owners. The manifest records the source of each downloaded asset. Manrope and Public Sans are distributed under the SIL Open Font License; font licenses are included with the font files.

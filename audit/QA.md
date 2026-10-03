# Verification record

Verified against the local refinement on 3 October 2026.

## Build and static checks

`npm run build` regenerates and builds all 18 HTML pages. `npm run check` passes metadata, one H1 per page, language attributes, skip links, image alternatives, and 768 internal asset/link references. The production bundle is approximately 3.52 MB including local photography and fonts. No runtime dependency was added.

## Browser checks

The optional `scripts/check-browser.mjs` passes all 15 checks with no recorded console errors or page errors. It runs against the production preview using headless Chromium and the existing Playwright installation.

- All 18 routes pass horizontal overflow and landmark checks at 320, 375, 390, 768, 1024 and 1440 px: 108 viewport/route combinations.
- All 17 content routes pass 200% text enlargement at 320 and 1440 px: 34 combinations. The A+ control is available on mobile.
- Each of the three hero scenes passes image loading, stable stage height, inactive-slide isolation, control geometry and action/control separation at the six widths and a short 844 × 390 landscape viewport. Desktop and mobile framing were also inspected visually.
- Hero autoplay uses a seven-second interval. Hover holds rotation; focus, manual navigation and swipe persistently pause it. Explicit Resume restarts rotation. Offscreen placement and simulated hidden-tab events hold rotation. Manual slide changes are announced; automatic changes are not.
- The trust strip preserves three unique visible items and stable slot geometry. Rotation, user pause/resume, offscreen pause and simulated hidden-tab pause pass. Shared timestamps keep hero and trust transitions apart.
- Reduced-motion mode disables autoplay for both systems. A JavaScript-disabled browser retains useful first-slide content and static trust facts.
- Both catalogue and home filters remain one horizontal row with 44 px minimum height. Category queries, selected-button visibility, announcements and the keyboard-accessible icon legend pass.
- Mobile navigation grouping, expanded state, Escape dismissal and focus restoration pass. Search results, empty state, Escape dismissal and focus restoration pass. Gallery enlargement and dismissal pass.
- All nine vehicle detail pages retain their specification data. The recruitment notice is closed and links to its official PDF. Enquiry preselection and email validation pass; submission creates a local reviewable draft without a POST request.

Results: [browser-results.json](browser-results.json).

A final focused browser check also passes selected-slide hover contrast and the trust control's pause/resume icon states. Utility, cargo and full-home screenshots were refreshed after those visual fixes. `git diff --check` passes.

## Accessibility and visual review

Lighthouse accessibility audits of home, catalogue, About, news and contact recorded no failing automated audits. These checks were run locally with mobile emulation; they do not establish formal WCAG certification. Keyboard interactions, focus visibility, enlarged text and reduced motion were also checked through the browser regressions.

Results: [accessibility-results.json](accessibility-results.json).

Representative screenshots are in `screenshots/refinement/`:

- `home-desktop.png`, `home-mobile.png`, `home-320.png`, `home-tablet.png`, `home-1024.png`, `home-full.png`.
- `hero-1-1440.png`, `hero-1-390.png`, `hero-2-1440.png`, `hero-2-390.png` for utility and cargo scenes.
- `catalog-desktop.png`, `catalog-mobile.png`, `about-desktop.png`, `news-desktop.png`, `news-mobile.png`.
- `landscape.png`, `text-200-desktop.png`, `text-200-mobile.png`, `no-js-mobile.png`.
- `before-desktop.png` and `source-1.png` through `source-7.png` preserve initial and research evidence.

## Limits

Testing uses headless Chromium, not physical devices. Touch gestures use synthetic pointer events. Hidden-tab behavior uses simulated document visibility. Geometry checks and visual review cover the specified scenes and viewports, not every possible device or assistive technology. No production performance score is claimed.

Official-source fetch limits and unresolved certificate validity are recorded in [REFINEMENT.md](REFINEMENT.md). No deployment or enquiry transmission was performed.

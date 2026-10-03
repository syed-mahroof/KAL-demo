# Verification record

Verified against the local refinement and subsequent visual polish on 3 October 2026. [POLISH.md](POLISH.md) records the latest design decisions.

## Build and static checks

`npm run build` regenerates and builds all 18 HTML pages. `npm run check` passes metadata, one H1 per page, language attributes, skip links, image alternatives, and 765 internal asset/link references. The production bundle is approximately 3.54 MB including local photography and fonts. No runtime dependency was added.

## Browser checks

The optional `scripts/check-slide.mjs` also passes at 390 and 1440 px. It measures incoming and outgoing scenes moving in opposite horizontal directions, verifies unchanged stage height, reverses an in-flight transition, checks backward wraparound, and confirms changing to reduced motion cancels animation immediately.

The follow-up mobile pass removes viewport-driven hero height on stacked layouts. Regression checks now assert that support sits within 80 px of each scene's actions, changing a phone's height to 1200 px does not stretch the hero, and utility links share a vertical center. Mobile top-bar text and enlarged text wrap without overflow. Small section text and footer links have increased size and spacing.

The optional `scripts/check-browser.mjs` passes all 16 checks against the production preview using headless Chromium and the existing Playwright installation. No console errors or page errors were recorded. `browser-results.json` records the final results. The carousel follow-up checks normal autoplay with the pointer over imagery, pause over an action, and stable scene geometry after horizontal transitions.

- All 18 routes pass horizontal overflow and landmark checks at 320, 375, 390, 768, 1024 and 1440 px: 108 viewport/route combinations.
- All 17 content routes pass 200% text enlargement at 320 and 1440 px: 34 combinations. The A+ control is available on mobile.
- Each of the three hero scenes passes image loading, stable stage height, inactive-slide isolation, hidden controls and action/support separation at the six widths and a short 844 × 390 landscape viewport. Desktop and mobile framing were also inspected visually.
- The desktop hero begins beneath the utility bar and ends at the first viewport boundary. Header identity does not overlap its search/menu actions at any tested width. Portrait tops and frame heights align within one CSS pixel, allowing browser subpixel rounding; actual asset dimensions and top crop positions are checked.
- Hero autoplay uses a seven-second interval. Hover holds rotation; focus and keyboard navigation persistently pause it. The pause/resume button is hidden during normal browsing and revealed by keyboard focus. Touch swipes without keyboard focus reset the automatic rotation interval. Offscreen placement and simulated hidden-tab events hold rotation. Manual slide changes are announced; automatic changes are not.
- The trust strip preserves three unique visible items and stable slot geometry. Rotation, user pause/resume, offscreen pause and simulated hidden-tab pause pass. Shared timestamps keep hero and trust transitions apart.
- Reduced-motion mode disables autoplay for both systems. A JavaScript-disabled browser retains useful first-slide content and static trust facts.
- Both catalogue and home filters remain one horizontal row with 44 px minimum height. Category queries, selected-button visibility, announcements and the keyboard-accessible icon legend pass.
- Mobile navigation grouping, expanded state, Escape dismissal and focus restoration pass. Search results, empty state, Escape dismissal and focus restoration pass. Gallery enlargement, next/previous navigation, arrow keys, wrapping, Escape and focus restoration pass on the gallery route and home previews.
- All nine vehicle detail pages retain their specification data. The recruitment notice is closed and links to its official PDF. Enquiry preselection and email validation pass; submission creates a local reviewable draft without a POST request.

Results: [browser-results.json](browser-results.json).

The earlier focused hover/control check belongs to the previous visible-control treatment. The current regressions verify removal of the numbered/arrow row and keyboard access to the hidden pause buttons. `git diff --check` passes.

## Accessibility and visual review

Current Lighthouse accessibility audits of home, catalogue, About, gallery and contact recorded no failing automated audits. These checks were run against the production preview with mobile emulation; they do not establish formal WCAG certification. Keyboard interactions, focus visibility, enlarged text and reduced motion were also checked through the browser regressions.

Current results: [polish-accessibility-results.json](polish-accessibility-results.json). The previous refinement audits remain in [accessibility-results.json](accessibility-results.json).

Current representative screenshots are in `screenshots/polish/`:

- `home-desktop.png`, `home-mobile.png`, `home-320.png`, `home-tablet.png`, `home-1024.png`, `home-full.png`.
- `hero-1-1440.png`, `hero-1-390.png`, `hero-2-1440.png`, `hero-2-390.png` for utility and cargo scenes.
- `catalog-desktop.png`, `catalog-mobile.png`, `about-desktop.png`, `news-desktop.png`, `news-mobile.png`.
- `landscape.png`, `text-200-desktop.png`, `text-200-mobile.png`, `no-js-mobile.png`.

Initial and research evidence remains in `screenshots/refinement/before-desktop.png` and `screenshots/refinement/source-1.png` through `source-7.png`. The current `leadership.png` directly shows the portrait framing correction. The optional test deliberately reveals animated sections for full-page still captures; viewport behavior is tested separately.

Final focused checks pass tablet heading spacing, enlarged mobile text, gallery navigation and the solid sticky navigation state after the final template adjustment. Captures include `leadership-reviewed.png`, `leadership-tablet-reviewed.png`, `gallery-viewer.png`, `sticky-navigation.png` and `text-200-mobile-reviewed.png`.

The final heading uses block/inline phrase spans to retain visible spacing at tablet widths. A focused browser check confirms visible phrase gaps, stable height, support/action separation and no horizontal overflow for all three scenes at the seven viewport sizes. Latest hero captures are `home-1440-final.png`, `home-1024-final.png`, `home-768-final.png` and `home-390-final.png`.

## Limits

Testing uses headless Chromium, not physical devices. Touch gestures use synthetic pointer events. Hidden-tab behavior uses simulated document visibility. Geometry checks and visual review cover the specified scenes and viewports, not every possible device or assistive technology. No production performance score is claimed.

Official-source fetch limits and unresolved certificate validity are recorded in [REFINEMENT.md](REFINEMENT.md). No deployment or enquiry transmission was performed.

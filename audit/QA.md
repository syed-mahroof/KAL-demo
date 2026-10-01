# Verification record

Verified during implementation on 1 October 2026.

- Production build: 18 static HTML pages. JavaScript is approximately 10.7 KB before compression; styles are approximately 40.8 KB before compression.
- Static checks: unique page titles, descriptions, exactly one H1 per page, language attributes, skip links, image alt attributes and 707 internal asset/link references.
- Hero layout: no horizontal overflow at 320, 360, 390, 430, 768, 1024 and 1440 px viewport widths.
- Narrow mobile route checks: home, catalog, company, manufacturing, public information, news, gallery, contact and representative vehicle detail pages. Manufacturing statistics were changed to a single column after a 320 px overflow was found.
- Search: a product query returns the correct vehicle; an unmatched query displays the empty state.
- Catalog: passenger and goods filters show the appropriate vehicles.
- Mobile navigation: open and close states verified.
- Gallery: photo enlargement and dismissal verified.
- Enquiry: product selection carries through from the vehicle page; invalid email is rejected; a completed form creates the reviewable local draft and explicitly states that nothing was sent.
- Carousel: all three original vehicle scenes rotate every six seconds with a crossfade, including while the pointer rests over the hero. Mobile swipes change slides and restart rotation. Keyboard focus pauses rotation; leaving the hero resumes it. Explicit pause, background tabs, offscreen placement and reduced-motion preferences also stop rotation. Inactive slides are inert and excluded from accessibility navigation. Visible number, dot, arrow and playback controls remain removed.
- Refinement checks: all 18 pages passed horizontal overflow checks at 320, 390, 768 and 1440 px (72 combinations). Automatic cycling through all three images, keyboard navigation, focus pause/resume, mobile swipe/resume, image loading and stable desktop/mobile hero height passed in headless Microsoft Edge against the production build. Reduced-motion behavior passed with no browser JavaScript errors.

Screenshots are saved in `audit/screenshots/`. These are browser viewport checks, not a claim of exhaustive physical-device coverage or formal accessibility certification.

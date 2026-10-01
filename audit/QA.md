# Verification record

Verified during implementation on 1 October 2026.

- Production build: 18 static HTML pages. JavaScript is approximately 10.6 KB before compression; styles are approximately 40 KB before compression.
- Static checks: unique page titles, descriptions, exactly one H1 per page, language attributes, skip links, image alt attributes and 707 internal asset/link references.
- Hero layout: no horizontal overflow at 320, 360, 390, 430, 768, 1024 and 1440 px viewport widths.
- Narrow mobile route checks: home, catalog, company, manufacturing, public information, news, gallery, contact and representative vehicle detail pages. Manufacturing statistics were changed to a single column after a 320 px overflow was found.
- Search: a product query returns the correct vehicle; an unmatched query displays the empty state.
- Catalog: passenger and goods filters show the appropriate vehicles.
- Mobile navigation: open and close states verified.
- Gallery: photo enlargement and dismissal verified.
- Enquiry: product selection carries through from the vehicle page; invalid email is rejected; a completed form creates the reviewable local draft and explicitly states that nothing was sent.
- Carousel: all three original vehicle scenes are reachable by keyboard; visible number, dot, arrow and playback controls are removed. Matching mobile crops keep each vehicle visible. Rotation pauses on focus/interaction, when the page is hidden and for reduced-motion preferences.

Screenshots are saved in `audit/screenshots/`. These are browser viewport checks, not a claim of exhaustive physical-device coverage or formal accessibility certification.

# KAL visual and interaction polish

Reviewed 3 October 2026, following the user's request to hide the carousel and highlight controls and improve the immersive experience. This supersedes the visible-control treatment described in the earlier refinement note.

## Decisions

- Follow-up mobile refinement: the utility bar uses consistent readable text sizes and centered link alignment, with wrapping at 200% text. Mobile and tablet heroes follow their content instead of filling the viewport; support sits in normal flow below the shared slide stage. The stage still reserves the tallest scene to avoid movement during rotation. Small body text in resources, capabilities, FAQs and the footer is enlarged, and footer links have more usable spacing. Desktop hero framing remains unchanged.

- The desktop homepage identity and navigation now sit over the authentic vehicle scene. The utility bar retains government affiliation, language access, text enlargement and the concept label. Navigation becomes a solid navy strip as the page scrolls. Supporting pages retain their white government masthead.
- Mobile utility links share a deliberate left baseline. Identity, official marks, search and menu are aligned in a compact row, with a smaller text treatment at 320 px and content-driven expansion at 200% text.
- The hero's arrows and numbered control row are removed. Both systems rotate automatically in normal browsing. Their pause controls are visually hidden and become visible on keyboard focus, preserving access for keyboard and screen-reader users. Keyboard slide navigation, touch swipe, focus pause, reduced motion, document visibility and offscreen protections remain. A swipe without keyboard focus resets the normal rotation interval; keyboard navigation retains its explicit-resume behavior.
- Full vehicle framing is preserved on mobile. Tablet scenes use a photo above the copy instead of narrow text over a letterboxed subject. Utility and cargo images are positioned below the desktop header so the canopy and raised waste compartment remain visible. A direct after-sales phone link adds a useful support action to the hero.
- Government portraits share a top-aligned 6:7 frame. `cover` removes the artificial bands introduced by the former bottom-aligned `contain` treatment. Original portraits and names remain intact. Board thumbnails use the same framing. The image helper now emits each asset's actual width and height.
- Vehicle cards and detail images retain uncropped `contain` framing. Factory and gallery photography use deliberate aspect ratios and focal positions, with no stretching. The factory's original perspective is preserved.
- Homepage gallery previews now open the same viewer as the gallery route. Previous/next buttons, left/right keys, a photo count, Escape and focus restoration support browsing. Preview captions identify each photograph before opening it.
- Subtle entry transitions run once for selected section groups. Static content is visible without JavaScript. Reduced motion removes the transitions, and keyboard focus immediately reveals pending content. Buttons and gallery images have restrained hover, focus and pressed feedback.

## Sources and scope

Rechecked [KAL's current official homepage](https://kal.kerala.gov.in/) for its vehicle presentation, government identity, benefit themes and support number. Original rendered research captures remain in `screenshots/refinement/source-1.png` through `source-7.png`; the earlier [REFINEMENT.md](REFINEMENT.md) records the full source set and factual decisions. The original screenshot's large vehicle presentation informs the new homepage, while the current public-information hierarchy and accurate notices remain in place.

The installed redesign and accessibility skills informed this pass. The Vite/vanilla architecture, existing fonts, SVG family, all nine vehicle records, search, enquiry draft and indexing protection remain. No dependencies or skills needed installation. No deployment or enquiry transmission was performed.

Changed sources: `src/templates.mjs`, `src/hero.mjs`, `src/carousel.js`, `src/carousel.css`, `src/style.css`, `src/main.js`, and `scripts/check-browser.mjs`. All 18 HTML inputs were regenerated. Documentation and verification artifacts were updated alongside the implementation.

## Evidence and limits

See [QA.md](QA.md), [browser-results.json](browser-results.json), [polish-accessibility-results.json](polish-accessibility-results.json), and `screenshots/polish/` for current checks and screenshots. Testing is local headless Chromium. Physical touch devices, real assistive technology and production performance are not established. Hidden-tab checks simulate visibility events. The unresolved certificate validity and official-source fetch limits in the earlier refinement audit still apply.

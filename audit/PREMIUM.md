# KAL premium presentation pass

4 October 2026. Direction: premium automotive presentation, practical electric three-wheeler buying decisions, unmistakable Kerala identity. Existing static Vite implementation, nine vehicles and official specifications retained.

## Strongest references

| Reference | Exceptional pattern | Fit and application |
| --- | --- | --- |
| [Porsche](https://www.porsche.com/international/) | Vehicle photography leads; model names and concise descriptions make the range easy to explore. | High. Give KAL vehicles more space, use model-led headlines and clear exploration actions. Adapt the hierarchy, not Porsche styling or assets. |
| [Ather](https://www.atherenergy.com/) | Compact mobile navigation, large vehicle presentation and quick actions for comparison, dealers and enquiries. | Highest mobile relevance. Compact KAL identity, facts beneath the vehicle, two clear actions and immediate comparison/dealer access. |
| [Montra Electric](https://www.montraelectric.com/) | Commercial vehicles organised by application, with product exploration and distinct dealer/test-drive paths. | Highest audience relevance. Preserve passenger/goods/utility choices, published range/capacity and separate sales, fleet and dealership journeys. |
| [Lamborghini](https://www.lamborghini.com/en-en) | Strong scale, confident model presentation and restrained opening copy. | Selective. Borrow visual confidence; avoid aggressive styling and interaction complexity that distract from an everyday working vehicle. |

Official reference pages were reviewed in this research pass; Ather's rendered mobile presentation informed the layout. These are selected design references, not a claim that their accessibility, performance or every interaction has been audited. Earlier public KAL social observations and their access limits remain in [TRANSFORMATION.md](TRANSFORMATION.md).

## Implemented

- Single compact mobile header: KAL logo, company name and government identity. Language/text enlargement move into the mobile menu. Removed visible “Website concept”, design-demonstration labels and enquiry-export boilerplate.
- One-row desktop navigation with a compact intermediate breakpoint. Government identity remains explicit.
- Model-led hero: larger names, shorter copy, complete vehicle photography and useful published facts. Mobile presents the headline, vehicle, facts and actions in sequence. All scenes share a stable stage.
- Pause/resume is visually hidden during ordinary browsing, appears on keyboard focus and remains operable. Direct scene choices, keyboard navigation, touch handling and motion preferences remain.
- Larger vehicle cards: complete photo framing, quieter borders, stronger name/fact hierarchy and separate Explore/Compare actions. Desktop hover adds subtle CSS perspective; precise-pointer and motion-preference guards keep touch/reduced-motion presentations still.
- Native mobile featured-vehicle swipe rail. Filtering resets its position; “All vehicles” starts at the first model again.
- Card comparison links preselect the chosen vehicle and select a different second model when necessary.
- Shorter homepage: hero → quick actions → vehicles → benefits → official demonstration → ownership → Kerala engineering story → dealer/fleet paths → FAQ. Leadership, public records, notices and gallery remain accessible through dedicated pages and navigation.

**Adopt:** generous vehicle scale, concise hierarchy, useful facts and immediate actions. **Adapt:** luxury storytelling to real working days and local pride. **Avoid:** heavy 3D canvases, scroll hijacking, autoplay video, invented finance/savings and ornamental content. **Original opportunity:** real owner stories, Kerala routes and KAL's municipal/aerospace engineering presented through approved photography.

Card depth uses existing photographs, not a fabricated 3D vehicle or a newly generated cutout. A genuine 360° view needs approved multi-angle photographs or a model. Current prices, warranty terms and customer testimonials need verified source content. Enquiries still prepare a local draft; no production lead backend was added.

## Verification

- Production build and static integrity check passed: 18 pages, unique metadata, one H1 per page, 891 internal assets/links and image attributes.
- [108 layout checks](premium-browser-results.json): all 18 routes at 320, 390, 768, 1024, 1101 and 1440 pixels; no page overflow.
- [34 enlarged-text checks](premium-text-results.json): all 17 content routes at 320/1440 with 200% root text; no page overflow.
- [15 scene checks](premium-scene-results.json): all three scenes at five widths; actions clear of scene controls, mobile photographs clear of facts, inactive scenes inert and ordinary pause control clipped to 1px.
- [Interaction evidence](premium-interactions.json): menu Escape restores focus; search finds Neem G; filters update and reset the swipe rail; comparison preselects distinct models; desktop hover applies perspective; keyboard pause/resume toggles and becomes visible only on focus.
- Final assets: JS 19.24 kB / 6.34 kB gzip; CSS 90.33 kB / 17.57 kB gzip. No new runtime dependency or third-party video/social embed.
- [Desktop hero](screenshots/premium/home-desktop.jpg), [mobile hero](screenshots/premium/home-mobile.jpg), [desktop cards](screenshots/premium/cards-desktop.jpg), [mobile cards](screenshots/premium/cards-mobile.jpg), [mobile comparison](screenshots/premium/compare-mobile.jpg).

Browser checks used the real in-app browser. The optional standalone browser suite was updated and syntax checked; it was not executed in this pass. No physical-device, conversion-rate or formal accessibility-certification claim. Local implementation only; not deployed.

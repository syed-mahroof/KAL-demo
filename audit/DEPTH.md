# Responsive vehicle presentation

6 October 2026. Implemented in the existing Vite and static HTML project. This extends the existing automotive redesign without changing its published specifications or enquiry behavior.

## Changes

- One reusable layered scene for the homepage hero, nine catalogue cards, nine model stages and live comparison selections. Vehicles overlap the lower edge of the background, with large lettering behind the body and a restrained ground shadow.
- Factory photography remains behind the hero and detail vehicles. Catalogue and comparison stages use a quieter studio background. Complete vehicles fit inside their scene rather than cropping wheels or roofs.
- Mobile hero content flows in order: headline, vehicle, facts, actions and scene controls. Tablet and desktop layouts use the available space. Enlarged text wraps without fixed image offsets.
- Restored all five government and board portraits to the homepage. Mobile shows two government portraits side by side, followed by three board rows with photographs and roles. Desktop shows all five portraits together.
- Preserved keyboard controls, focus restoration, reduced motion, no-JavaScript first slide, native mobile vehicle rail, filters, comparison, specification downloads and local enquiry drafts.

## Artwork provenance

Tool: OpenAI built-in `image_gen.imagegen`, with local source references and `transparent_background: true`. Each original photograph and each generated output was visually inspected. Generation was used for background removal; it can also reconstruct small details, so these outputs are presentation artwork rather than pixel-exact photographic extractions. Original photographs remain available in the model narratives and gallery.

Background-removal brief used for the edits: remove the road, skyline, factory, ground and other scenery; preserve each real vehicle's geometry, color, wheels, seats, mirrors, cargo equipment, branding and visible signage; keep the entire vehicle within the canvas with a small transparent margin; do not invent features or add a new background. For source photographs with two vehicles, preserve both views. No new product specification or commercial claim was derived from generated artwork.

| Local source in `public/images/` | Saved presentation asset in `public/images/` | Width × height |
| -------------------------------- | -------------------------------------------- | -------------- |
| `neem-g.webp`                    | `neem-g-cutout.webp`                         | 1100 × 1100    |
| `green-stream.webp`              | `green-stream-cutout.webp`                   | 1100 × 857     |
| `garbage-cart.webp`              | `garbage-cart-cutout.webp`                   | 1100 × 858     |
| `canopy-cart.webp`               | `canopy-cart-cutout.webp`                    | 825 × 1100     |
| `tipping-cart.webp`              | `tipping-cart-cutout.webp`                   | 1100 × 858     |
| `mini-cart.webp`                 | `mini-cart-cutout.webp`                      | 1100 × 858     |
| `ice-cream-cart.webp`            | `ice-cream-cart-cutout.webp`                 | 1100 × 856     |
| `electric-buggy.webp`            | `electric-buggy-cutout.webp`                 | 1100 × 858     |
| `mini-cart-plus.webp`            | `mini-cart-plus-cutout.webp`                 | 1100 × 846     |

`scripts/prepare-vehicle-art.mjs` resized and encoded the generated PNGs as WebP while preserving alpha. The nine files total approximately 1.25 MB. The original source URLs remain in `asset-sources.json`. These artwork files should be checked against approved product photography before an official production release.

## Verification

- Production build: 18 pages. Static checks verify unique metadata, one H1 per route, internal links/assets and image alt attributes. Built output is approximately 4.93 MB.
- Isolated browser regression suite checks all 18 routes at 320, 375, 390, 768, 1024 and 1440 pixels, plus a landscape hero. Actual browser width is asserted before the route matrix.
- Enlarged-text checks cover 17 content routes at 320 and 1440 pixels with 200% root text.
- Additional checks verify five visible, loaded homepage portraits at mobile/tablet/desktop widths and complete vehicle stages with matching intrinsic image dimensions for all nine models.
- Interaction checks cover navigation, search, gallery, filters, live comparison, local draft validation, enquiry preselection, specification downloads, hero/trust rotation, offscreen and hidden-tab pause, keyboard/swipe behavior, reduced motion and the first slide without JavaScript.
- All nine optimized artwork files were checked for preserved alpha and matching dimensions.
- Results: `depth-browser-results.json`. Visual evidence: `screenshots/depth/regression/`.

Final production-preview run: **21 checks passed, zero failures, zero browser errors**. The route matrix covers 108 page/viewport combinations; enlarged text covers 34 combinations. The added portrait test caught a tablet-only maximum-width rule on the last board member; the homepage override now removes that limit.

This is browser viewport testing, not physical-device testing or a formal accessibility certification. Enquiries remain local drafts; the form sends no lead to a backend. Production content approval and backend integration remain outside this frontend demonstration.

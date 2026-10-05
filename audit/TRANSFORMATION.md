# KAL automotive transformation

4 October 2026. Implemented in the existing Vite, vanilla JavaScript and static HTML project. This report supersedes earlier hidden hero controls and icon-only specification decisions. No deployment or enquiry transmission.

## Direction

**Premium presentation. Practical buying confidence. Kerala identity.**

KAL serves passenger operators, small businesses, municipalities, institutional buyers and prospective dealers. The site also supports public information and precision manufacturing. Keep its navy, teal, KAL blue, self-hosted Manrope/Public Sans, government identity and nine-model range. Borrow premium automotive composition while helping customers choose vehicles for actual work.

## Selected references

| Reference                                                                                                                                                                          | Exceptional pattern                                                     | Fit for KAL                                                                                                              |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| [Porsche](https://www.porsche.com/)                                                                                                                                                | Vehicle-led composition; photography establishes desire before detail   | Adopt product dominance and short headlines; follow with application, range and capacity                                 |
| [Polestar](https://www.polestar.com/)                                                                                                                                              | Quiet typography, generous spacing and disciplined product presentation | Strongest visual restraint reference; adopt consistent image stages and readable specifications                          |
| [Lamborghini](https://www.lamborghini.com/)                                                                                                                                        | Dramatic angles and concentrated visual storytelling                    | Adapt the confidence and scale; preserve the utility vehicle's authentic proportions                                     |
| [Rivian](https://rivian.com/)                                                                                                                                                      | Products presented through places, activities and ownership             | Adapt to passenger journeys, deliveries and municipal work                                                               |
| [Montra Electric](https://montraelectric.com/)                                                                                                                                     | Commercial EVs tied to practical buyer questions                        | Adopt application-first discovery and ownership guidance; do not transfer competitor claims                              |
| [Mahindra Last Mile Mobility](https://mahindralastmilemobility.com/)                                                                                                               | Commercial categories and direct model enquiry paths                    | Adopt clear buyer and fleet journeys with visible contact options                                                        |
| [Piaggio commercial vehicles](https://piaggio-cv.co.in/Passenger/)                                                                                                                 | Clear passenger range and recognisable product stages                   | Useful category and model clarity; keep KAL's distinct identity                                                          |
| [Kia India](https://www.kia.com/in/home.html)                                                                                                                                      | Model discovery connected to buying actions                             | Adapt deliberate routes from inspiration to model information and enquiry; hero media was inconsistent during inspection |
| [Carvix concept](https://dribbble.com/shots/25949061-Carvix-Automobile-Website-Design), [automobile shop concept](https://dribbble.com/shots/19513049-Car-Automobile-Shop-Website) | Large vehicle imagery and sharp editorial hierarchy                     | Composition studies only; mockups do not prove mobile UX, accessibility or performance                                   |

Premium sources were inspected as rendered sites, including mobile views of Porsche/Polestar and Montra. Earlier official product/contact verification remains in [REFINEMENT.md](REFINEMENT.md).

## Social review

| Channel                                                       | Public evidence                                                                                                  | Result                                                                                                                                |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| [Instagram](https://www.instagram.com/kal__md/)               | Profile/grid, vehicle posters, local occasions and dealership recruitment                                        | Reinforce Kerala pride and a distinct dealer entry path. Opening a reel triggered a login gate; its playback was not reviewed         |
| [Facebook](https://www.facebook.com/KeralaAutomobilesLimited) | Public page and recent vehicle/dealer posts after dismissing login overlay                                       | Confirm the same community/commercial themes; keep official sales contacts rather than copying conflicting social contact details     |
| [YouTube](https://www.youtube.com/@kalofficial-r7l/videos)    | Channel listings and [waste-cart demonstration](https://www.youtube.com/watch?v=a3NsZ8PApJo), including playback | Add a prominent official demonstration destination. Embedded playback reported unavailable, so the final panel opens YouTube directly |

This is a selective review of publicly accessible material, not an exhaustive review of every historical post, image or reel. No credentials, gated-content bypass, social downloads or fabricated testimonials.

## Implemented

- Shorter hero storytelling, three direct scene selectors, visible pause/resume and existing keyboard/swipe/reduced-motion behavior.
- Asymmetric passenger/goods/public-service photography linking to filtered vehicles.
- Larger catalogue image stages and visible buyer facts. Range/capacity appear where published; application/length replace missing claims.
- Nine redesigned model pages: vehicle stage, first facts, narrative, specifications, ownership and model-specific enquiry. Persistent mobile call/enquire actions.
- Two-model comparison across all nine vehicles, live selection feedback and explicit missing-data labels. GVW is clearly distinguished from payload.
- Downloadable text specification summaries, labelled as summaries rather than manufacturer brochures.
- Ownership guidance covering working day, charging, warranty, service and current costs. No invented price, finance, subsidy or savings estimates.
- Separate dealer, fleet and dealership entry paths; enquiry purpose and vehicle preselection; purpose-specific email draft subjects.
- Official video and social destinations. No iframe/social-widget requests or new runtime dependencies.
- Removed the duplicated closed recruitment strip from the sales journey; historical notice remains in news and the homepage notice section.

**Adopt:** visual hierarchy, real vehicle scale, useful facts, fast static content. **Adapt:** cinematic storytelling to everyday livelihoods; luxury layouts to affordable commercial buyers. **Avoid:** scroll hijacking, decorative 3D, autoplay video, false financial claims, unreadable overlay copy and fake product variants. **Original opportunity:** KAL's local identity, municipal usefulness and aerospace engineering presented as one credible story. Customer case studies and new media require genuine source material.

## Verification

- Production build and static integrity check: 18 pages, unique metadata, one H1 each, internal links/assets and image attributes.
- 72 route/viewport checks: all 18 pages at 320, 390, 768 and 1440 pixels; no horizontal overflow. Evidence: [layout results](transformation-browser-results.json).
- 34 enlarged-text checks: 17 content routes at 320/1440 pixels with 200% root text. Fixed grid wrapping and download-button overflow. Evidence: [text results](transformation-text-results.json).
- Browser checks: changing comparison updates model/photo/figures; missing values stay qualified; dealership draft preselects purpose and sends nothing; mobile navigation Escape restores focus; search finds Neem G; hero manual selection/arrow navigation pauses motion and inactive slides retain `inert`; gallery navigation/Escape restores focus.
- All nine static specification files returned HTTP 200 and matched model facts; missing ranges were not invented. The Neem G summary downloaded successfully through the browser and matched the generated file exactly. Downloads work without JavaScript.
- Updated optional `scripts/check-browser.mjs` assertions and new comparison/enquiry/video/download coverage. Syntax checked; the complete standalone suite was not executed in this pass. Earlier QA is historical evidence, not a claim about this build.
- Screenshots: `screenshots/transformation/`. No physical-device, production conversion, formal accessibility certification or field performance claim.

The enquiry remains a local draft demonstration. A production lead backend, approved current commercial terms and new photography are separate integration/content work.

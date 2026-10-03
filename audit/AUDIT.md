# KAL website audit and demonstration scope

The 3 October 2026 refinement is documented in [REFINEMENT.md](REFINEMENT.md). The latest visual and interaction pass is in [POLISH.md](POLISH.md), with current verification in [QA.md](QA.md). The findings below describe the original 1 October review.

Reviewed 1 October 2026. Sources: [KAL home](https://kal.kerala.gov.in/), [vehicle details](https://kal.kerala.gov.in/products/kerala-neem-g), [manufacturing](https://kal.kerala.gov.in/manufacturing-facilities), [contact](https://kal.kerala.gov.in/contact-us), public HTML and robots.txt.

## Findings and changes

| Observed issue                                                                                                                                              | Demonstration improvement                                                                                                                |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| The homepage repeats its H1 across carousel slides; the rendered carousel also exposes repeated content.                                                    | One clear H1 per page and a restrained carousel with matching mobile photographs, keyboard support and reduced-motion handling.                                                         |
| Many meaningful images, including logos and products, have empty alt attributes.                                                                            | Descriptive image alternatives and labeled image links.                                                                                  |
| Footer phone numbers link to `#`.                                                                                                                           | Working `tel:` links, clearly separated sales, support and general contacts.                                                             |
| Navigation places public disclosures, company history and manufacturing in a long dropdown.                                                                 | Clear primary navigation and a dedicated public information hub.                                                                         |
| Product discovery depends on a carousel and truncated descriptions.                                                                                         | Visible product cards, category filters, complete detail pages and site search.                                                          |
| “46 years”, “35 years” and counter data coexist on the homepage; these age-based claims do not agree.                                                       | Stable milestones: incorporated in 1978, commercial production in 1984, aerospace collaboration in 1988 and electric transition in 2019. |
| The source uses an obsolete moving marquee and several overlapping carousel/animation libraries.                                                            | Stable notices, a small interaction module and native accessible disclosure controls.                                                    |
| Existing home metadata names “Kerala Automobile Limited” rather than the company’s full plural name.                                                        | Consistent Kerala Automobiles Limited/KAL titles and descriptive page metadata.                                                          |
| No canonical, Open Graph or Organization structured-data markup was found in the sampled home HTML.                                                         | Unique titles/descriptions, Open Graph text, configurable canonical URLs and Organization data.                                          |
| `/robots.txt` allows crawling; it does not list a sitemap. `/sitemap.xml` returned 404.                                                                     | A sitemap can be generated when the deployment origin is supplied. The demo intentionally blocks indexing.                               |
| Official gallery navigation is inconsistent: an extracted “view all photos” link resolves to `index.html`, while another link resolves to `/photo-gallery`. | A dedicated local gallery with accessible enlargement.                                                                                   |

These findings identify specific improvements. They do not establish that any single issue caused the reported search visibility problem. Other sitemap locations may exist; only the conventional `/sitemap.xml` endpoint and robots.txt were checked.

## Design approach

Keep the public-sector character: government emblem, KAL mark, department identification, certification reference, statutory resources and official contact details. Refine the presentation with a consistent blue/teal palette, more readable typography, controlled spacing and clearer navigation. Preserve original photography rather than substituting invented products or stock images.

## Demo boundaries

The frontend includes home, company information, manufacturing, a nine-vehicle catalog and detail pages, public resources, news, gallery and contact. Official tender, RTI, disclosure and dealer systems stay on their current portals. The enquiry form prepares a local draft and has no backend. No pricing, range or performance figures are invented where the source does not provide them.

Leadership follows the live KAL board page at review time. The news example is an archived recruitment notification from KAL’s indexed news page, posted 10 September 2026 with a deadline of 17 September 2026. The live news listing was empty during the direct HTML fetch, so the demonstration labels this notification as closed and links visitors to official current updates. Production content requires a designated owner and an update process.

## Suggested scope for the quotation

1. **Discovery and SEO diagnosis:** Search Console access, coverage/indexing review, URL inventory, sitemap review, search-query baseline, performance measurements and metadata audit.
2. **UI/UX refinement:** Approved government-compatible design system, responsive templates, navigation, product discovery and accessibility improvements.
3. **Content and technical SEO:** Approved company copy, individual product metadata, structured data, canonical URLs, redirect plan, sitemap and robots configuration.
4. **Implementation and migration:** Integrate the approved frontend with KAL’s existing content and enquiry systems; preserve documents and statutory resources.
5. **Validation and handover:** Device/browser QA, accessibility checks, production performance review, Search Console submission and staff documentation.

Quote frontend refinement, technical SEO and ongoing support separately. Define page count, content ownership, integrations, hosting, maintenance and post-launch measurement. Promise measurable work and reporting; do not promise a guaranteed search position.

## Production SEO checks still required

- Search Console ownership and inspection of the official homepage and key product URLs.
- HTTP response headers and indexing directives on the official production host.
- HTTP/HTTPS and www/non-www redirects, canonicals and duplicate pages.
- Whether other sitemap endpoints exist and whether Google has received them.
- Search impressions for “Kerala Automobiles Limited”, “KAL Kerala”, product names and the ambiguous “KAL” query.
- Crawl errors, internal linking, backlinks, real-user performance and mobile usability.

The preview must remain unindexed. Production indexing should only be enabled on the approved official deployment.

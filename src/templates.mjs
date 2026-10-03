import {
  products,
  official,
  galleryPhotos,
  governmentLeaders,
  boardLeaders,
  trustFacts,
  recruitment,
} from "./data.mjs";
import { heroCarousel } from "./hero.mjs";

export const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const paths = {
  ruler: '<path d="M3 8h18v8H3ZM7 8v4m4-4v3m4-3v4m4-4v3"/>',
  weight: '<circle cx="12" cy="5" r="2"/><path d="M6 8h12l3 13H3Z"/>',
  circuit:
    '<rect x="7" y="7" width="10" height="10" rx="1"/><path d="M10 3v4m4-4v4m-4 10v4m4-4v4M3 10h4m-4 4h4m10-4h4m-4 4h4"/>',
  range:
    '<path d="M3 19a9 9 0 1 1 18 0ZM12 15l5-7M6 14l-2-1m5-5-1-2m8 2 1-2m1 8 2-1"/><circle cx="12" cy="15" r="1"/>',
  plug: '<path d="M9 3v4m6-4v4M7 7h10v5a5 5 0 0 1-10 0Zm5 10v4"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  quiet:
    '<path d="m3 10 4 0 5-5v14l-5-5H3Zm13-1a5 5 0 0 1 0 6m3-9a9 9 0 0 1 0 12"/>',
  chevron: '<path d="m8 10 4 4 4-4"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  phone:
    '<path d="m7 3 3 5-2 2c1.5 3 3 4.5 6 6l2-2 5 3c-1 6-6 5-11 0S1 4 7 3Z"/>',
  leaf: '<path d="M20 3C9 2 3 7 4 14c1 7 11 8 14 1 2-4 2-9 2-12Z"/><path d="M3 21 15 9"/>',
  bolt: '<path d="m13 2-9 12h7l-1 8 10-12h-7l0-8Z"/>',
  battery:
    '<rect x="3" y="7" width="16" height="10" rx="2"/><path d="M21 10v4M10 10v4m-2-2h4"/>',
  certificate:
    '<circle cx="12" cy="9" r="6"/><path d="m8 14-1 7 5-3 5 3-1-7m-7-12 2 2 4-4"/>',
  gear: '<path d="m9 3-1 3-3 1-2 4 2 2v4l4 2 3-1 3 1 4-2v-4l2-2-2-4-3-1-1-3Z"/><circle cx="12" cy="12" r="3"/>',
  document: '<path d="M14 3H5v18h14V8Zm0 0v5h5M8 12h8M8 16h6"/>',
  location:
    '<path d="M19 10c0 6-7 11-7 11S5 16 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
  external: '<path d="M14 3h7v7m0-7L10 14M10 3H3v18h18v-7"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
};
export const icon = (name, cls = "") =>
  `<svg class="icon ${cls}" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.document}</svg>`;
export const image = (name, alt, cls = "", eager = false) =>
  `<img src="/images/${name}.webp" alt="${escape(alt)}" class="${cls}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" width="900" height="600">`;
export const external = (path, text, cls = "") =>
  `<a class="${cls}" href="${path.startsWith("http") ? path : official + path}" target="_blank" rel="noopener noreferrer">${text}${icon("external")}</a>`;

function header(active) {
  return /* HTML */ `<a class="skip-link" href="#main">Skip to main content</a>
    <div class="utility-bar">
      <div class="container utility-inner">
        <span>A Government of Keralam undertaking</span>
        <div class="utility-links">
          <a
            href="${official}/malayalam/"
            lang="ml"
            target="_blank"
            rel="noopener noreferrer"
            >മലയാളം</a
          ><button
            class="text-control"
            data-text-size
            aria-label="Increase text size"
            aria-pressed="false"
          >
            A<span>+</span></button
          ><span class="concept-label">Website concept</span>
        </div>
      </div>
    </div>
    <header class="site-header">
      <div class="container masthead">
        <a class="brand" href="/"
          ><img
            src="/images/kerala-emblem.webp"
            alt="Government of Kerala emblem"
            width="62"
            height="58"
          /><img
            src="/images/kal-logo.webp"
            alt="KAL logo"
            width="70"
            height="50"
          /><span class="brand-text"
            ><strong>Kerala Automobiles Limited</strong
            ><span>Department of Industries & Commerce</span></span
          ></a
        >
        <div class="masthead-actions">
          <a
            class="certification"
            href="${official}/certifications"
            target="_blank"
            rel="noopener noreferrer"
            >${icon("certificate")}<span
              >ISO 9001:2015<strong>Certified company</strong></span
            ></a
          ><button class="icon-button search-open" aria-label="Search website">
            ${icon("search")}</button
          ><button
            class="icon-button menu-toggle"
            aria-label="Open navigation"
            aria-expanded="false"
            aria-controls="primary-nav"
          >
            ${icon("menu")}
          </button>
        </div>
      </div>
      <div class="nav-wrap">
        <div class="container nav-inner">
          <nav id="primary-nav" aria-label="Main navigation">
            <a href="/" ${active === "home" ? 'aria-current="page"' : ""}
              >Home</a
            >
            <details class="nav-dropdown">
              <summary ${active === "about" ? 'class="current"' : ""}>
                About KAL ${icon("chevron")}
              </summary>
              <div class="dropdown-panel">
                <a href="/about/">Overview & history</a
                ><a href="/about/#government">Government affiliation</a
                ><a href="/about/#leadership">Board of directors</a
                ><a href="/about/#purpose">Electric transition</a
                ><a href="/gallery/">Photo gallery</a
                >${external("/certifications", "Certifications")}
              </div>
            </details>
            <a
              href="/products/"
              ${active === "products" ? 'aria-current="page"' : ""}
              >Our vehicles</a
            ><a
              href="/manufacturing/"
              ${active === "manufacturing" ? 'aria-current="page"' : ""}
              >Manufacturing</a
            >
            <details class="nav-dropdown">
              <summary ${active === "public" ? 'class="current"' : ""}>
                Public information ${icon("chevron")}
              </summary>
              <div class="dropdown-panel">
                <a href="/public-information/">Public resource hub</a>
                ${external("/tenders", "Tenders & procurement")}
                ${external("/rti", "Right to Information")}
                ${external("/mandatory-disclosures", "Mandatory disclosures")}
                ${external("/government-orders", "Government orders")}
                ${external("/downloads", "Downloads")}
              </div>
            </details>
            ${`<a href="/news/"${active === "news" ? ' aria-current="page"' : ""}>News & careers</a>`}
            <details class="nav-dropdown">
              <summary ${active === "contact" ? 'class="current"' : ""}>
                Contact ${icon("chevron")}
              </summary>
              <div class="dropdown-panel dropdown-right">
                <a href="/contact/">Contact & support</a
                ><a href="/contact/#enquiry">Vehicle enquiry</a
                >${external("/dealer-details", "Dealer network")}
              </div>
            </details>
          </nav>
          <a class="button button-small" href="/contact/#enquiry"
            >Enquire now</a
          >
        </div>
      </div>
    </header>`;
}
function footer() {
  return /* HTML */ `<section class="contact-strip">
      <div class="container contact-strip-inner">
        <div>
          <span class="eyebrow">Let’s move forward</span>
          <h2>Find the right electric vehicle for you.</h2>
        </div>
        <a class="button button-light" href="/contact/#enquiry"
          >Talk to our sales team ${icon("phone")}</a
        >
      </div>
    </section>
    <footer class="site-footer">
      <div class="container footer-main">
        <div class="footer-brand">
          <img
            src="/images/kal-logo.webp"
            alt="KAL logo"
            width="74"
            height="53"
          />
          <h2>Kerala Automobiles Limited</h2>
          <p>
            A Government of Keralam undertaking.<br />Engineering mobility since
            1978.
          </p>
          <p class="footer-address">
            Aralumoodu P.O., Neyyattinkara<br />Thiruvananthapuram, Kerala · 695
            123
          </p>
        </div>
        <div>
          <h3>Explore KAL</h3>
          <a href="/about/">About us</a
          ><a href="/products/">Electric vehicles</a
          ><a href="/manufacturing/">Manufacturing & aerospace</a
          ><a href="/gallery/">Photo gallery</a
          ><a href="/news/">News & careers</a>
        </div>
        <div>
          <h3>Public resources</h3>
          <a href="/public-information/">Tenders & disclosures</a
          >${external("/rti", "Right to Information")}${external("https://etenders.kerala.gov.in/", "Kerala e-Tender portal")}${external("https://gem.gov.in/", "Government e-Marketplace")}${external("/dealer-details", "Dealer network")}
        </div>
        <div class="footer-contact">
          <h3>Get in touch</h3>
          <span>Sales enquiries</span
          ><a href="tel:+919778466292">+91 97784 66292</a
          ><span>After-sales support</span
          ><a href="tel:+919778466294">+91 97784 66294</a
          ><span>General enquiries</span
          ><a href="tel:+919447584320">+91 94475 84320</a>
        </div>
      </div>
      <div class="container footer-bottom">
        <p>
          © ${new Date().getFullYear()} Kerala Automobiles Limited · Design
          demonstration
        </p>
        <a href="${official}" target="_blank" rel="noopener noreferrer"
          >Visit current official website ${icon("external")}</a
        ><a href="/contact/#accessibility">Accessibility</a>
      </div>
    </footer>
    <dialog class="search-dialog" aria-labelledby="search-title">
      <div class="dialog-top">
        <h2 id="search-title">Search KAL</h2>
        <button class="icon-button dialog-close" aria-label="Close search">
          ${icon("close")}
        </button>
      </div>
      <label for="site-search"
        >Find a vehicle, service or public resource</label
      >
      <div class="search-input">
        ${icon("search")}<input
          id="site-search"
          type="search"
          autocomplete="off"
          placeholder="Try “Neem G” or “tenders”"
        />
      </div>
      <p class="search-status" role="status" aria-live="polite"></p>
      <ul class="search-results"></ul>
    </dialog>
    <dialog class="gallery-dialog" aria-label="Gallery photo">
      <button class="icon-button gallery-close" aria-label="Close photo">
        ${icon("close")}</button
      ><img alt="" />
      <p></p>
    </dialog>`;
}
export function layout({
  title,
  description,
  content,
  active = "",
  path = "/",
}) {
  const origin = process.env.SITE_URL?.replace(/\/$/, "");
  const production = process.env.PRODUCTION_SITE === "true";
  const canonical = origin
    ? `<link rel="canonical" href="${escape(origin + path)}"><meta property="og:url" content="${escape(origin + path)}">`
    : "";
  const schema = origin
    ? `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", name: "Kerala Automobiles Limited", alternateName: "KAL", url: origin, foundingDate: "1978", logo: origin + "/images/kal-logo.webp", address: { "@type": "PostalAddress", streetAddress: "Aralumoodu P.O., Neyyattinkara", addressLocality: "Thiruvananthapuram", addressRegion: "Kerala", postalCode: "695123", addressCountry: "IN" }, telephone: "+91-97784-66292" }).replace(/</g, "\\u003c")}</script>`
    : "";
  return /* HTML */ `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${escape(title)} | KAL</title>
        <meta name="description" content="${escape(description)}" />
        <meta
          name="robots"
          content="${production ? "index, follow" : "noindex, nofollow"}"
        />
        <meta name="theme-color" content="#0b3345" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="${escape(title)}" />
        <meta property="og:description" content="${escape(description)}" />
        ${canonical}${schema}
        <link rel="icon" href="/images/favicon.webp" type="image/webp" />
        <link rel="stylesheet" href="/fonts/fonts.css" />
        <link rel="stylesheet" href="/src/style.css" />
        <script type="module" src="/src/main.js"></script>
      </head>
      <body>
        ${header(active)}
        <main id="main">${content}</main>
        ${footer()}
      </body>
    </html>`;
}
export function productCard(product) {
  return /* HTML */ `<article
    class="product-card"
    data-category="${product.category}"
  >
    <a
      class="product-image"
      href="/products/${product.slug}/"
      aria-label="Explore ${escape(product.name)}"
      >${image(product.image, product.name)}</a
    >
    <div class="product-card-body">
      <span class="category-label">${product.label}</span>
      <h3><a href="/products/${product.slug}/">${product.name}</a></h3>
      <p>${product.description}</p>
      <dl class="product-specs">
        <div>
          <dt class="sr-only">Overall length</dt>
          <dd>${icon("ruler")}<span>${product.length}</span></dd>
        </div>
        <div>
          <dt class="sr-only">Gross vehicle weight</dt>
          <dd>${icon("weight")}<span>${product.weight}</span></dd>
        </div>
      </dl>
      <a class="text-link" href="/products/${product.slug}/"
        >Explore vehicle <span aria-hidden="true">↗</span></a
      >
    </div>
  </article>`;
}
export const filters = `<div class="filter-wrap"><div class="filters" role="group" aria-label="Filter vehicles"><button data-filter="all" aria-pressed="true">All vehicles</button><button data-filter="passenger" aria-pressed="false">Passenger</button><button data-filter="goods" aria-pressed="false">Goods transport</button><button data-filter="utility" aria-pressed="false">Utility</button></div></div><details class="spec-legend"><summary>Specification icons explained</summary><div><span>${icon("ruler")}Overall length in millimetres</span><span>${icon("weight")}Gross vehicle weight in kilograms, including vehicle and its permitted load; not payload.</span></div></details>`;
export function productSection(all = false) {
  return /* HTML */ `<section
    class="section products-section ${all ? "full-catalog" : ""}"
    id="vehicles"
  >
    <div class="container">
      ${all ? '<h2 class="sr-only">Vehicle range</h2>' : '<div class="section-heading"><div><span class="eyebrow">Our electric vehicles</span><h2>Purpose-built for<br>the roads ahead.</h2></div><div class="section-heading-side"><p>From passenger journeys to the last mile.<br>Discover electric mobility, made in Kerala.</p><a class="text-link" href="/products/">View all vehicles <span aria-hidden="true">↗</span></a></div></div>'}${filters}
      <p class="sr-only filter-status" role="status" aria-live="polite"></p>
      <div class="product-grid">
        ${(all ? products : products.slice(0, 3)).map(productCard).join("")}
      </div>
      ${!all ? '<p class="catalog-note">Looking for more options? <a href="/products/">Explore our complete range of 9 vehicles.</a></p>' : ""}
    </div>
  </section>`;
}
export const timeline = `<ol class="timeline"><li><strong>1978</strong><h3>A Kerala enterprise</h3><p>Incorporated as a Government of Kerala undertaking.</p></li><li><strong>1984</strong><h3>The journey begins</h3><p>Commercial production of three-wheelers starts.</p></li><li><strong>1988</strong><h3>Precision for space</h3><p>Aerospace component manufacturing for India’s space programmes.</p></li><li><strong>2019</strong><h3>A new electric chapter</h3><p>Transition from combustion engines to electric vehicles.</p></li></ol>`;
export const faq = `<section class="section faq-section"><div class="container split-grid"><div><span class="eyebrow">Good to know</span><h2>Your electric journey,<br>made clearer.</h2><p>Answers to a few everyday questions.<br>Our team can help with the rest.</p><a class="text-link" href="/contact/">Contact vehicle support <span aria-hidden="true">↗</span></a></div><div class="faq-list"><details open><summary>Can I charge my vehicle at home?<span aria-hidden="true">+</span></summary><p>KAL’s vehicles can be charged using the supplied charger and a suitable domestic power point. Confirm installation requirements with our service team.</p></details><details><summary>What range can I expect?<span aria-hidden="true">+</span></summary><p>The published range for Kerala Neem G is 90–100 km per charge. Actual range depends on load, speed, road conditions and battery condition.</p></details><details><summary>Where can I get after-sales support?<span aria-hidden="true">+</span></summary><p>Call <a href="tel:+919778466294">+91 97784 66294</a> or email <a href="mailto:engrservice.kal@kerala.gov.in">engrservice.kal@kerala.gov.in</a> for service assistance.</p></details><details><summary>How do I enquire about a vehicle?<span aria-hidden="true">+</span></summary><p>Contact our sales team at <a href="tel:+919778466292">+91 97784 66292</a>, or prepare an enquiry on our <a href="/contact/#enquiry">contact page</a>.</p></details></div></div></section>`;
export function pageHero(label, title, description) {
  return /* HTML */ `<section class="page-hero">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a><span aria-hidden="true">/</span
        ><span>${label}</span>
      </nav>
      <span class="eyebrow">${label}</span>
      <h1>${title}</h1>
      <p>${description}</p>
    </div>
  </section>`;
}
export function leaderCard(person) {
  return `<article class="leader">${image(person.image, person.name)}<div><h3>${person.name}</h3><p>${person.role}</p></div></article>`;
}
export function publicStewardship(preview = false) {
  const people = preview
    ? [...governmentLeaders, boardLeaders[0]]
    : governmentLeaders;
  return `<section class="section stewardship-section" id="government"><div class="container stewardship-grid"><div class="stewardship-intro"><span class="eyebrow">Public stewardship</span><h2>A Government of<br>Keralam undertaking.</h2><p>Kerala Automobiles Limited<br>Department of Industries & Commerce</p><a class="text-link" href="${preview ? "/about/#leadership" : official + "/board-of-directors"}" ${preview ? "" : 'target="_blank" rel="noopener noreferrer"'}>${preview ? "Meet our board" : "Official leadership information"} ${icon(preview ? "chevron" : "external")}</a></div><div class="stewardship-people ${preview ? "stewardship-preview" : ""}">${people.map(leaderCard).join("")}</div></div></section>`;
}
function trustContent(fact) {
  return `${icon(fact.icon)}<span><strong>${fact.title}</strong><span>${fact.copy}</span></span>`;
}
function trustStrip() {
  return `<section class="trust-strip" aria-label="KAL heritage and electric mobility benefits"><div class="container trust-panel"><div class="trust-grid">${trustFacts
    .slice(0, 3)
    .map(
      (fact, i) =>
        `<div class="trust-slot" data-trust-slot="${i}"><div class="trust-content">${trustContent(fact)}</div></div>`,
    )
    .join(
      "",
    )}</div><button class="trust-pause" data-trust-pause aria-pressed="false" hidden>${icon("pause")}<span>Pause highlights</span></button></div>${trustFacts.map((fact, i) => `<template data-trust-item="${i}">${trustContent(fact)}</template>`).join("")}</section>`;
}
export function updatesSection(homepage = false) {
  const heading = homepage
    ? `<div class="section-heading"><div><span class="eyebrow">News & notices</span><h2>From KAL’s noticeboard.</h2></div><a class="text-link" href="/news/">All updates <span aria-hidden="true">↗</span></a></div>`
    : "";
  return `<section class="section updates-section"><div class="container">${heading}<div class="updates-grid"><article class="featured-notice"><div class="notice-meta"><span>${recruitment.category}</span><time datetime="${recruitment.published}">10 September 2026</time></div><span class="closed-badge">Applications closed · 17 September 2026</span><${homepage ? "h3" : "h2"}>${recruitment.title}</${homepage ? "h3" : "h2"}><p>${recruitment.summary}</p><a class="text-link" href="${recruitment.document}" target="_blank" rel="noopener noreferrer">Read official notification ${icon("external")}</a><span class="document-meta">PDF · 2 pages · opens in a new tab</span></article><aside class="official-notices" aria-label="Official notice resources"><span class="eyebrow">Official resources</span><h3>Keep up to date.</h3><p>Check KAL’s official pages for current announcements and application deadlines.</p>${[
    ["/news", "Company news", "Announcements from KAL"],
    ["/careers", "Careers", "Current recruitment information"],
    ["/tenders", "Tenders & procurement", "Published tender notices"],
  ]
    .map(
      ([url, title, copy]) =>
        `<a href="${official + url}" target="_blank" rel="noopener noreferrer"><span><strong>${title}</strong><span>${copy}</span></span>${icon("external")}</a>`,
    )
    .join("")}</aside></div></div></section>`;
}
export function home() {
  return /* HTML */ `${heroCarousel()} ${trustStrip()}
    <div class="notice-band">
      <div class="container notice-inner">
        <span class="notice-title">${icon("document")}Noticeboard</span>
        <p>
          Machine Shop recruitment notification
          <span class="notice-status">Applications closed · 17 Sep 2026</span>
        </p>
        <a href="/news/">View updates <span aria-hidden="true">↗</span></a>
      </div>
    </div>
    ${productSection()}
    <section class="section about-section">
      <div class="container about-grid">
        <div class="about-photo">
          ${image("factory", "Kerala Automobiles Limited factory at Aralumoodu")}
          <div class="photo-caption">
            <strong>1978</strong
            ><span>Our roots in Kerala.<br />Our vision for tomorrow.</span>
          </div>
        </div>
        <div class="about-copy">
          <span class="eyebrow">An enterprise with a purpose</span>
          <h2>Kerala’s own.<br />Built for the future.</h2>
          <p>
            From our first three-wheelers to today’s electric vehicles, KAL has
            kept Kerala moving. We are a Government of Keralam undertaking under
            the Industries Department.
          </p>
          <p>
            Our expertise goes beyond the road. We also manufacture
            high-precision aerospace components for VSSC, LPSC and IISU.
          </p>
          <a class="button" href="/about/">Discover our story</a>
          <div class="about-facts">
            <div>
              <strong>2019</strong><span>Our transition to electric</span>
            </div>
            <div>
              <strong>1988</strong><span>Aerospace collaboration begins</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    ${publicStewardship(true)}
    <section class="section engineering-section">
      <div class="container engineering-grid">
        <div>
          <span class="eyebrow">Beyond mobility</span>
          <h2>Precision that serves<br />a bigger mission.</h2>
          <p>
            From electric vehicle assembly to high-precision aerospace
            machining, our Aralumoodu facility brings decades of engineering
            experience to every component.
          </p>
          <a class="text-link" href="/manufacturing/"
            >Explore our capabilities <span aria-hidden="true">↗</span></a
          >
        </div>
        <div class="capabilities">
          <div>
            <span>01</span>
            <h3>Electric vehicle manufacturing</h3>
            <p>Assembly, metal forming, pre-treatment and painting.</p>
          </div>
          <div>
            <span>02</span>
            <h3>Aerospace components</h3>
            <p>Precision machining for VSSC, LPSC and IISU.</p>
          </div>
          <div>
            <span>03</span>
            <h3>Quality at every stage</h3>
            <p>ISO 9001:2015 certified manufacturing systems.</p>
          </div>
        </div>
      </div>
    </section>
    <section class="section resources-section">
      <div class="container">
        <div class="section-heading">
          <div>
            <span class="eyebrow">Open & accessible</span>
            <h2>Public information,<br />within easy reach.</h2>
          </div>
          <a class="text-link" href="/public-information/"
            >All public resources <span aria-hidden="true">↗</span></a
          >
        </div>
        <div class="resource-grid">
          <a
            href="${official}/tenders"
            target="_blank"
            rel="noopener noreferrer"
            >${icon("document")}
            <h3>Tenders & procurement</h3>
            <p>Notifications and procurement opportunities.</p>
            ${icon("external")}</a
          ><a href="${official}/rti" target="_blank" rel="noopener noreferrer"
            >${icon("document")}
            <h3>Right to Information</h3>
            <p>RTI information and designated officers.</p>
            ${icon("external")}</a
          ><a
            href="${official}/mandatory-disclosures"
            target="_blank"
            rel="noopener noreferrer"
            >${icon("document")}
            <h3>Mandatory disclosures</h3>
            <p>Corporate information and public records.</p>
            ${icon("external")}</a
          ><a href="/news/"
            >${icon("document")}
            <h3>News & careers</h3>
            <p>Company updates and recruitment notices.</p>
            <span aria-hidden="true">↗</span></a
          >
        </div>
      </div>
    </section>
    ${updatesSection(true)} ${faq}
    <section class="section home-gallery">
      <div class="container">
        <div class="section-heading">
          <div>
            <span class="eyebrow">Life at KAL</span>
            <h2>Progress, in pictures.</h2>
          </div>
          <a class="text-link" href="/gallery/"
            >Visit photo gallery <span aria-hidden="true">↗</span></a
          >
        </div>
        <div class="gallery-preview">
          ${galleryPhotos
            .slice(0, 3)
            .map(
              (photo) =>
                `<a href="/gallery/" aria-label="View KAL photo gallery">${image(photo.image, photo.alt)}</a>`,
            )
            .join("")}
        </div>
      </div>
    </section>`;
}

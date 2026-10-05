import { products, official } from "./data.mjs";
import { vehicleVisual } from "./vehicle-visual.mjs";

const safe = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

export function specificationSummary(product) {
  const fields = [
    ["Application", "label"],
    ["Published range", "range"],
    ["Capacity", "capacity"],
    ["Charging time", "charge"],
    ["Battery", "battery"],
    ["Top speed", "speed"],
    ["Rated motor power", "power"],
    ["Overall length", "length"],
    ["Gross vehicle weight", "weight"],
    ["Peak torque", "torque"],
  ];
  return `Kerala Automobiles Limited\n${product.name}\n\n${product.description}\n\n${fields
    .filter(([, key]) => product[key])
    .map(([label, key]) => `${label}: ${product[key]}`)
    .join(
      "\n",
    )}\n\nGross vehicle weight is not payload. Actual range and performance depend on operating conditions.\nConfirm current specifications, configuration, pricing and warranty with KAL.\n\nOfficial specifications: ${official}/products/${product.slug}\nSales: +91 97784 66292\nSupport: +91 97784 66294\n\nKAL vehicle specification summary. Not a manufacturer brochure.\n`;
}

export function buyerFacts(product) {
  if (product.range)
    return [
      ["Published range", product.range],
      [
        product.category === "passenger" ? "Seating" : "Capacity",
        product.capacity,
      ],
    ];
  return [
    ["Application", product.label],
    ["Overall length", product.length],
  ];
}

export function useCaseSection() {
  const scenes = [
    [
      "passenger",
      "01",
      "People. Places. Possibilities.",
      "Passenger journeys & campus travel",
      "hero-neem",
      "Kerala Neem G passenger three-wheeler",
    ],
    [
      "goods",
      "02",
      "Built for your business.",
      "Local deliveries & goods transport",
      "hero-cargo",
      "Kerala Green Stream goods cart",
    ],
    [
      "utility",
      "03",
      "A cleaner everyday.",
      "Waste collection & community services",
      "hero-utility",
      "KAL electric municipal utility cart",
    ],
  ];
  return `<section class="section use-cases" aria-labelledby="use-case-title"><div class="container"><div class="section-heading"><div><span class="eyebrow">Your work. Your KAL.</span><h2 id="use-case-title">Find your way<br>to electric.</h2></div><p class="section-intro">For the people who move our communities.<br>Choose the work you do.</p></div><div class="use-case-grid">${scenes.map(([category, number, title, subtitle, photo, alt]) => `<a class="use-case" href="/products/?category=${category}"><img src="/images/${photo}-small.webp" width="960" height="461" alt="${alt}" loading="lazy" decoding="async"><div><span class="scene-number">${number} / ${category === "goods" ? "Goods" : category === "utility" ? "Public service" : "Passenger"}</span><h3>${title}</h3><p>${subtitle}</p><span class="scene-link">Explore vehicles <span aria-hidden="true">↗</span></span></div></a>`).join("")}</div></div></section>`;
}

export function ownershipSection(product) {
  const enquiry = product
    ? `/contact/?vehicle=${encodeURIComponent(product.name)}#enquiry`
    : "/contact/#enquiry";
  return `<section class="section ownership-section" id="ownership"><div class="container"><div class="section-heading"><div><span class="eyebrow">Confidence beyond the vehicle</span><h2>Make electric<br>work for you.</h2></div><p class="section-intro">The right vehicle starts with the right answers.<br>Talk to KAL about your daily route and requirements.</p></div><div class="ownership-grid"><article><span class="chapter-number">01</span><h3>Plan your working day.</h3><p>${product?.range ? `Published range: <strong>${safe(product.range)}</strong>. Actual range depends on load, speed, roads and battery condition.` : "Discuss daily distance, passenger or goods capacity, and the conditions on your route."}</p><a href="${enquiry}">Discuss your requirements <span aria-hidden="true">↗</span></a></article><article><span class="chapter-number">02</span><h3>Understand charging.</h3><p>${product?.charge ? `Published charging time: <strong>${safe(product.charge)}</strong>. ` : ""}Ask about the supplied charger, suitable power point and installation needs.</p><a href="tel:+919778466294">Speak to vehicle support <span aria-hidden="true">↗</span></a></article><article><span class="chapter-number">03</span><h3>Know your ownership costs.</h3><p>Request current pricing, battery and vehicle warranty terms, service arrangements and parts availability for your model.</p><a href="${enquiry}">Request model information <span aria-hidden="true">↗</span></a></article></div><p class="ownership-note">Vehicle specifications and availability are subject to confirmation by KAL.</p></div></section>`;
}

export function videoSection() {
  return `<section class="section film-section" id="kal-film"><div class="container film-grid"><div><span class="eyebrow">See the engineering at work</span><h2>Purpose built.<br>In action.</h2><p>Watch KAL’s waste-cart demonstration. See how the collection box and tipping mechanism support everyday municipal work.</p><a class="text-link" href="https://www.youtube.com/watch?v=a3NsZ8PApJo" target="_blank" rel="noopener noreferrer">Watch on YouTube <span aria-hidden="true">↗</span></a><span class="film-credit">KAL video channel · E Cart with Garbage Box & Tipping Mechanism</span></div><div class="film-player"><a class="film-poster" href="https://www.youtube.com/watch?v=a3NsZ8PApJo" target="_blank" rel="noopener noreferrer" aria-label="Watch KAL waste-cart demonstration on YouTube (opens in a new tab)"><img src="/images/hero-utility-small.webp" width="960" height="461" alt="KAL electric utility cart" loading="lazy" decoding="async"><span class="film-play" aria-hidden="true">▶</span><span class="film-caption">Watch on YouTube <span>01:06 · Official channel · Opens in a new tab</span></span></a></div></div></section>`;
}

export function dealerSection() {
  return `<section class="section dealer-section" id="partners"><div class="container dealer-grid"><div><span class="eyebrow">More ways to move with KAL</span><h2>Your next vehicle.<br>Your next opportunity.</h2><p>Buy for your daily work, discuss a fleet requirement, or connect with KAL about becoming a dealer.</p></div><div class="dealer-paths"><a href="${official}/dealer-details" target="_blank" rel="noopener noreferrer"><span>Buying a vehicle</span><strong>Find a KAL dealer</strong><span aria-hidden="true">↗</span></a><a href="/contact/?purpose=fleet#enquiry"><span>For organisations & public service</span><strong>Discuss a fleet requirement</strong><span aria-hidden="true">↗</span></a><a href="/contact/?purpose=dealer#enquiry"><span>Grow with KAL</span><strong>Enquire about a dealership</strong><span aria-hidden="true">↗</span></a></div></div></section>`;
}

const comparisonFields = [
  ["Application", "label"],
  ["Published range", "range"],
  ["Passenger / load capacity", "capacity"],
  ["Charging time", "charge"],
  ["Battery", "battery"],
  ["Overall length", "length"],
  ["Gross vehicle weight¹", "weight"],
];
export function comparisonSection() {
  return `<section class="section comparison-section" id="compare"><div class="container"><div class="section-heading"><div><span class="eyebrow">A clearer choice</span><h2>Find your fit.</h2></div><p class="section-intro">Compare two KAL vehicles.<br>Start with your application, then the details.</p></div><div class="comparison-pickers">${[0, 1].map((slot) => `<div><label for="compare-${slot}">Vehicle ${slot + 1}</label><select id="compare-${slot}" data-compare="${slot}">${products.map((p, i) => `<option value="${p.slug}"${i === slot ? " selected" : ""}>${safe(p.name)}</option>`).join("")}</select></div>`).join("")}</div><div class="comparison-heads">${products
    .slice(0, 2)
    .map(
      (p, slot) =>
        `<article data-comparison-head="${slot}"><div class="comparison-photo">${vehicleVisual(p, { context: "compare" })}</div><h3>${safe(p.name)}</h3><a class="text-link" href="/products/${p.slug}/">Explore vehicle <span aria-hidden="true">↗</span></a></article>`,
    )
    .join("")}</div><dl class="comparison-values">${comparisonFields
    .map(
      ([label, key]) =>
        `<div><dt>${label}</dt>${products
          .slice(0, 2)
          .map(
            (p, slot) =>
              `<dd data-compare-cell="${slot}" data-spec="${key}">${safe(p[key] || "Confirm with KAL")}</dd>`,
          )
          .join("")}</div>`,
    )
    .join(
      "",
    )}</dl><p class="comparison-note" role="status" aria-live="polite">Comparing Kerala Neem G and Kerala Green Stream.</p><p class="spec-note">¹ Gross vehicle weight includes the vehicle and its permitted load; it is not payload. Published figures may use different test conditions. Missing specifications require confirmation by KAL.</p><noscript><p class="spec-note">The initial comparison is shown above. Visit individual vehicle pages for other models.</p></noscript></div></section>`;
}

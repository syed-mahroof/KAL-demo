import { products } from "./data.mjs";
import { vehicleVisual } from "./vehicle-visual.mjs";
import { buyerFacts } from "./showroom.mjs";

export const finderChoices = {
  passenger: {
    label: "Move people",
    needs: [
      ["daily", "Everyday passenger journeys", "neem-g"],
      ["campus", "Campus & visitor travel", "electric-buggy"],
    ],
  },
  goods: {
    label: "Carry goods",
    needs: [
      ["open", "Open cargo bed", "green-stream"],
      ["compact", "Compact carriage box", "mini-cart"],
      ["plus", "Mini E-Cart Plus", "mini-cart-plus"],
      ["covered", "Covered cargo", "canopy-cart"],
      ["vending", "Ice-cream vending", "ice-cream-cart"],
    ],
  },
  utility: {
    label: "Serve communities",
    needs: [
      ["waste", "Dry & wet waste collection", "garbage-cart"],
      ["tipping", "Hydraulic carriage-box tipping", "tipping-cart"],
    ],
  },
};
const safe = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

export function finderModel(work, need) {
  const choice = finderChoices[work];
  if (!choice) return null;
  const selected = choice.needs.find((item) => item[0] === need);
  return selected
    ? products.find((product) => product.image === selected[2])
    : null;
}
export function finderResult(work, need) {
  const product = finderModel(work, need);
  if (!product) return "";
  return `<div class="finder-photo">${vehicleVisual(product, { context: "finder" })}</div><div class="finder-copy"><span class="eyebrow">Start with this model</span><h3>${safe(product.name)}</h3><p>${safe(product.description)}</p><dl class="finder-facts">${buyerFacts(
    product,
  )
    .map(
      ([label, value]) => `<div><dt>${label}</dt><dd>${safe(value)}</dd></div>`,
    )
    .join(
      "",
    )}</dl><div class="finder-links"><a class="button" href="/products/${product.slug}/">Explore this vehicle <span aria-hidden="true">↗</span></a><a class="text-link" href="/products/?compare=${product.slug}#compare">Compare model <span aria-hidden="true">+</span></a><a class="text-link" href="/contact/?vehicle=${encodeURIComponent(product.name)}#enquiry">Ask KAL <span aria-hidden="true">↗</span></a></div></div>`;
}
export function vehicleFinder(icon) {
  return `<details class="vehicle-finder" data-finder><summary><span>Not sure which vehicle? <strong>Find your KAL.</strong></span>${icon("chevron")}</summary><div class="finder-workbench"><fieldset data-finder-controls disabled><legend>1. What will your vehicle do?</legend><div class="finder-work-choices" role="group" aria-label="Vehicle application">${Object.entries(
    finderChoices,
  )
    .map(
      ([key, choice]) =>
        `<button type="button" data-finder-work="${key}" aria-pressed="${key === "passenger"}">${choice.label}</button>`,
    )
    .join(
      "",
    )}</div><label for="finder-need">2. Choose your working setup</label><select id="finder-need" data-finder-need>${finderChoices.passenger.needs.map(([key, text]) => `<option value="${key}">${text}</option>`).join("")}</select></fieldset><article class="finder-result" data-finder-result>${finderResult("passenger", "daily")}</article><p class="finder-note">A starting point based on application. Confirm capacity, configuration and availability with KAL.</p><noscript><p class="finder-note">Enable JavaScript to choose another setup, or explore all vehicle pages below.</p></noscript><p class="sr-only" data-finder-status role="status" aria-live="polite" aria-atomic="true"></p></div></details>`;
}

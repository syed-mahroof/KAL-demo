// One presentation contract for the hero, catalogue and model reveal.
export const vehicleArtwork = {
  "neem-g": {
    image: "neem-g-cutout",
    word: "NEEM G",
    width: 1100,
    height: 1100,
  },
  "green-stream": {
    image: "green-stream-cutout",
    word: "GREEN STREAM",
    width: 1100,
    height: 857,
  },
  "garbage-cart": {
    image: "garbage-cart-cutout",
    word: "E-CART",
    width: 1100,
    height: 858,
  },
  "canopy-cart": {
    image: "canopy-cart-cutout",
    word: "COVERED",
    width: 825,
    height: 1100,
  },
  "tipping-cart": {
    image: "tipping-cart-cutout",
    word: "UTILITY",
    width: 1100,
    height: 858,
  },
  "mini-cart": {
    image: "mini-cart-cutout",
    word: "MINI",
    width: 1100,
    height: 858,
  },
  "ice-cream-cart": {
    image: "ice-cream-cart-cutout",
    word: "ON THE GO",
    width: 1100,
    height: 856,
  },
  "electric-buggy": {
    image: "electric-buggy-cutout",
    word: "BUGGY",
    width: 1100,
    height: 858,
  },
  "mini-cart-plus": {
    image: "mini-cart-plus-cutout",
    word: "MINI PLUS",
    width: 1100,
    height: 846,
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

export function vehicleVisual(
  product,
  { context = "card", eager = false, deferred = false } = {},
) {
  const artwork = vehicleArtwork[product.image];
  const source = artwork?.image || product.image;
  const dimensions = artwork || { width: 900, height: 700 };
  return `<span class="depth-scene depth-${context} ${artwork ? "depth-cutout" : "depth-photograph"}" data-artwork="${safe(product.image)}">
    ${artwork ? `<span class="depth-backdrop" aria-hidden="true">${["hero", "detail"].includes(context) ? '<img src="/images/factory.webp" width="574" height="598" alt="" loading="lazy" decoding="async">' : ""}</span><span class="depth-word" aria-hidden="true">${artwork.word}</span><span class="depth-floor" aria-hidden="true"></span>` : ""}
    <img class="depth-vehicle${context === "hero" ? " hero-image" : context === "detail" ? " vehicle-stage-image" : ""}" ${deferred ? "data-src" : "src"}="/images/${source}.webp" width="${dimensions.width}" height="${dimensions.height}" alt="${safe(product.name)}${artwork ? ", shown in full" : ""}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">
    ${artwork ? '<span class="depth-edition" aria-hidden="true">KAL / ALL ELECTRIC</span>' : ""}
  </span>`;
}

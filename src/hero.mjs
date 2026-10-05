import { products } from "./data.mjs";
import { vehicleVisual } from "./vehicle-visual.mjs";
const slides = [
  {
    image: "hero-neem",
    alt: "Blue Kerala Neem G electric passenger three-wheeler, shown in full",
    eyebrow: "Made in Kerala. Moving forward.",
    title: "Kerala<span>Neem G.</span>",
    copy: "Your next journey. All electric. All Kerala.",
    facts: [
      ["Published range", "90–100 km"],
      ["Seating", "Driver + 3"],
    ],
    button: "Explore Neem G",
    link: "/products/kerala-neem-g/",
    secondary: "Enquire now",
    secondaryLink: "/contact/?vehicle=Kerala%20Neem%20G#enquiry",
    vehicle: "Kerala Neem G",
    purpose: "All-electric passenger mobility",
    label: "Passenger",
  },
  {
    image: "hero-utility",
    alt: "Blue KAL electric waste collection cart with separate waste compartments",
    eyebrow: "Built for our communities.",
    title: "Clean streets.<span>Electric drive.</span>",
    copy: "Purpose-built for the work that moves our communities.",
    facts: [
      ["Collection", "Dry + wet"],
      ["Tipping", "Hydraulic"],
    ],
    button: "Explore utility vehicles",
    link: "/products/?category=utility",
    secondary: "Enquire with KAL",
    secondaryLink: "/contact/#enquiry",
    vehicle: "KAL utility E-Cart",
    purpose: "Electric mobility for municipal services",
    label: "Utility",
  },
  {
    image: "hero-cargo",
    alt: "Blue Kerala Green Stream electric goods cart with its open cargo bed visible",
    eyebrow: "For the business of every day.",
    title: "Kerala<span>Green Stream.</span>",
    copy: "Carry your business forward. Leave less behind.",
    facts: [
      ["Published range", "100–130 km"],
      ["Load capacity", "Up to 310 kg"],
    ],
    button: "Explore goods vehicles",
    link: "/products/?category=goods",
    secondary: "Talk to our team",
    secondaryLink: "/contact/#enquiry",
    vehicle: "Kerala Green Stream",
    purpose: "All-electric goods transportation",
    label: "Goods",
  },
];

export function heroCarousel() {
  return /* HTML */ `
    <section
      class="hero hero-carousel"
      aria-roledescription="carousel"
      aria-label="KAL electric vehicles"
      tabindex="0"
      aria-describedby="carousel-instructions"
    >
      <h1 class="sr-only">
        Kerala Automobiles Limited — Electric mobility, made in Kerala
      </h1>
      <p class="sr-only" id="carousel-instructions">
        Use left and right arrow keys to browse the vehicle showcase. Focusing
        the showcase pauses automatic rotation. Tab to the pause or resume
        button to control motion. On touch screens, swipe left or right to
        change vehicles.
      </p>
      <div class="hero-slides">
        ${slides
          .map(
            (slide, index) => /* HTML */ `
              <div
                class="hero-slide"
                data-slide="${index}"
                role="group"
                aria-roledescription="slide"
                aria-label="${index + 1} of ${slides.length}: ${slide.vehicle}"
                ${index ? "hidden" : ""}
              >
                <div class="container hero-inner">
                  <div class="hero-copy">
                    <span class="hero-eyebrow"
                      ><span></span>${slide.eyebrow}</span
                    >
                    <h2>${slide.title}</h2>
                    <p>${slide.copy}</p>
                  </div>
                  <div class="hero-visual">
                    ${vehicleVisual(products[[0, 2, 1][index]], { context: "hero", eager: index === 0, deferred: index !== 0 })}
                  </div>
                  <div class="hero-details">
                    <dl class="hero-facts">
                      ${slide.facts.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("")}
                    </dl>
                    <div class="hero-actions">
                      <a class="button button-white" href="${slide.link}"
                        >${slide.button}</a
                      >
                      <a class="hero-about" href="${slide.secondaryLink}"
                        >${slide.secondary} <span aria-hidden="true">↗</span></a
                      >
                    </div>
                  </div>
                </div>
              </div>
            `,
          )
          .join("")}
      </div>
      <div class="container hero-support">
        <a href="tel:+919778466294"
          ><svg
            class="icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            aria-hidden="true"
          >
            <path
              d="m7 3 3 5-2 2c1.5 3 3 4.5 6 6l2-2 5 3c-1 6-6 5-11 0S1 4 7 3Z"
            /></svg
          ><span>Vehicle support</span><strong>+91 97784 66294</strong></a
        >
      </div>
      <div class="container hero-controls" hidden>
        <div class="hero-models" role="group" aria-label="Choose vehicle scene">
          ${slides.map((slide, index) => `<button data-hero-select="${index}" aria-pressed="${index === 0}"><span class="hero-model-number">0${index + 1}</span>${slide.label}</button>`).join("")}
        </div>
        <button
          class="hero-motion-toggle motion-access"
          data-carousel-pause
          aria-pressed="false"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path data-motion-symbol d="M8 5v14M16 5v14" /></svg
          ><span>Pause slideshow</span>
        </button>
      </div>
      <p
        class="sr-only"
        data-carousel-status
        role="status"
        aria-live="polite"
        aria-atomic="true"
      ></p>
    </section>
  `;
}

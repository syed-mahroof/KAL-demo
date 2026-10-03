const slides = [
  {
    image: "hero-neem",
    alt: "Blue Kerala Neem G electric passenger three-wheeler, shown in full",
    eyebrow: "Made in Kerala. Moving forward.",
    title: "Kerala’s own.<br>Electric by design.",
    copy: "Passenger journeys, local deliveries and public service. Electric vehicles built in Kerala, for the work of every day.",
    button: "Discover our vehicles",
    link: "/products/",
    secondary: "Get to know KAL",
    secondaryLink: "/about/",
    vehicle: "Kerala Neem G",
    purpose: "All-electric passenger mobility",
    label: "Passenger",
  },
  {
    image: "hero-utility",
    alt: "Blue KAL electric waste collection cart with separate waste compartments",
    eyebrow: "Built for our communities.",
    title: "Clean streets.<br>Powered by KAL.",
    copy: "Purpose-built electric utility vehicles for the work that keeps our communities moving. Practical engineering, with a cleaner way forward.",
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
    title: "Local journeys.<br>Electric possibilities.",
    copy: "From local deliveries to goods transport, Kerala Green Stream brings electric mobility to your everyday business. Designed and made in Kerala.",
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
        the showcase pauses automatic rotation until you choose Resume. On touch
        screens, swipe left or right to change vehicles.
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
                <picture>
                  <source
                    media="(max-width: 700px)"
                    ${index ? "data-srcset" : "srcset"}="/images/${slide.image}-mobile.webp"
                  />
                  <source
                    media="(max-width: 1100px)"
                    ${index ? "data-srcset" : "srcset"}="/images/${slide.image}-small.webp"
                  />
                  <img
                    class="hero-image"
                    ${index ? "data-src" : "src"}="/images/${slide.image}.webp"
                    alt="${slide.alt}"
                    width="1840"
                    height="884"
                    ${index ? 'loading="lazy"' : 'fetchpriority="high"'}
                    decoding="async"
                  />
                </picture>
                <div class="hero-shade"></div>
                <div class="container hero-inner">
                  <div class="hero-copy">
                    <span class="hero-eyebrow"
                      ><span></span>${slide.eyebrow}</span
                    >
                    <h2>${slide.title}</h2>
                    <p>${slide.copy}</p>
                    <div class="hero-actions">
                      <a class="button button-white" href="${slide.link}"
                        >${slide.button}</a
                      >
                      <a class="hero-about" href="${slide.secondaryLink}"
                        >${slide.secondary} <span aria-hidden="true">↗</span></a
                      >
                    </div>
                  </div>
                  <div class="hero-product">
                    <span>${slide.vehicle}</span
                    ><strong>${slide.purpose}</strong>
                  </div>
                </div>
              </div>
            `,
          )
          .join("")}
      </div>
      <div class="container hero-controls" hidden>
        <div class="hero-navigation">
          <button data-carousel-prev aria-label="Previous vehicle">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m14 6-6 6 6 6" />
            </svg>
          </button>
          <div
            class="hero-positions"
            role="group"
            aria-label="Choose a vehicle slide"
          >
            ${slides.map((slide, i) => `<button data-carousel-position="${i}" aria-label="Slide 0${i + 1}: ${slide.label}" aria-pressed="${i === 0}"><span aria-hidden="true">0${i + 1}</span></button>`).join("")}
          </div>
          <button data-carousel-next aria-label="Next vehicle">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m10 6 6 6-6 6" />
            </svg>
          </button>
        </div>
        <button
          class="hero-motion-toggle"
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

const slides = [
  {
    image: "hero-neem",
    alt: "Blue Kerala Neem G electric passenger three-wheeler, shown in full",
    eyebrow: "Made in Kerala. Moving forward.",
    title: "Kerala Automobiles<br>Limited",
    copy: "Electric mobility for our communities. Precision engineering for India’s space programmes. Kerala’s own, since 1978.",
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
        the showcase pauses automatic rotation. Rotation resumes when focus
        leaves. On touch screens, swipe left or right to change vehicles.
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
                    srcset="/images/${slide.image}-mobile.webp"
                  />
                  <source
                    media="(max-width: 1100px)"
                    srcset="/images/${slide.image}-small.webp"
                  />
                  <img
                    class="hero-image"
                    src="/images/${slide.image}.webp"
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
      <button
        class="hero-motion-toggle"
        data-carousel-pause
        aria-pressed="false"
        hidden
      >
        Pause slideshow
      </button>
      <p class="sr-only" data-carousel-status role="status" aria-live="off"></p>
    </section>
  `;
}

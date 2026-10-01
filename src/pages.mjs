import { products, official, galleryPhotos } from "./data.mjs";
import {
  image,
  icon,
  external,
  pageHero,
  timeline,
  productSection,
  productCard,
  escape,
  faq,
} from "./templates.mjs";

export function about() {
  return /* HTML */ `${pageHero("About KAL", "A Kerala legacy.<br>An electric future.", "Kerala Automobiles Limited (KAL) is a Government of Keralam undertaking under the Industries Department, incorporated in 1978.")}
    <section class="section">
      <div class="container">
        <div class="facility-grid">
          <div>
            <span class="eyebrow">Our story</span>
            <h2>Engineering that<br />moves us forward.</h2>
            <p>
              KAL started commercial production in 1984 with petrol-powered
              three-wheelers, followed by diesel models in 1991. In 2019, we
              moved from combustion engines to electric vehicles.
            </p>
            <p>
              Today, the KERALA vehicle range serves passenger travel, goods
              transportation and utility needs. Alongside mobility, we
              manufacture high-precision aerospace components for VSSC, LPSC and
              IISU.
            </p>
            <a class="text-link" href="/products/"
              >Explore our electric vehicles
              <span aria-hidden="true">↗</span></a
            >
          </div>
          <div class="facility-photo">
            ${image("factory", "Kerala Automobiles Limited’s factory building in Aralumoodu")}
          </div>
        </div>
        ${timeline}
      </div>
    </section>
    <section class="section leadership-section" id="leadership">
      <div class="container">
        <div class="section-heading">
          <div>
            <span class="eyebrow">Public stewardship</span>
            <h2>Our leadership.</h2>
          </div>
          ${external("/board-of-directors", "View official board information", "text-link")}
        </div>
        <div class="leaders">
          <article class="leader">
            ${image("managing-director", "V. S. Rajeev, Managing Director of KAL")}
            <div>
              <h3>V. S. Rajeev</h3>
              <p>Managing Director</p>
            </div>
          </article>
          <article class="leader">
            ${image("director-finance", "Jayalakshmi T. M.")}
            <div>
              <h3>Jayalakshmi T. M.</h3>
              <p>Joint Secretary, Finance Department, Government of Kerala</p>
            </div>
          </article>
          <article class="leader">
            ${image("director-industries", "Ajith Kumar A.")}
            <div>
              <h3>Ajith Kumar A.</h3>
              <p>
                Under Secretary, Industries Department, Government of Kerala
              </p>
            </div>
          </article>
        </div>
        <p class="leadership-note">
          Leadership information follows KAL’s current website. Refer to the
          <a
            href="${official}/board-of-directors"
            target="_blank"
            rel="noopener noreferrer"
            >official board page</a
          >
          for the latest appointments.
        </p>
      </div>
    </section>
    <section class="section">
      <div class="container engineering-grid">
        <div>
          <span class="eyebrow">Our purpose</span>
          <h2>Better mobility.<br />Responsible manufacturing.</h2>
          <p>
            Our electric vehicles support cleaner transportation for everyday
            journeys and local businesses. Our manufacturing capability supports
            precision engineering across mobility and aerospace.
          </p>
        </div>
        <div class="capabilities">
          <div>
            <span>01</span>
            <h3>Electric passenger mobility</h3>
            <p>Practical three-wheelers for everyday transport.</p>
          </div>
          <div>
            <span>02</span>
            <h3>Electric goods & utility transport</h3>
            <p>Carts for businesses, communities and municipal services.</p>
          </div>
          <div>
            <span>03</span>
            <h3>Precision aerospace manufacturing</h3>
            <p>Components for India’s space programmes.</p>
          </div>
        </div>
      </div>
    </section>`;
}
export function catalog() {
  return /* HTML */ `${pageHero("Our vehicles", "Electric vehicles, made for you.", "Explore the KERALA range of electric passenger vehicles, goods carts and utility vehicles. Select a category to find the right fit.")}${productSection(true)}${faq}`;
}
export function productDetail(product) {
  const specs = [
    ["Overall length", product.length],
    ["Gross vehicle weight", product.weight],
    ["Peak torque", product.torque],
    ...(product.range
      ? [
          ["Published range", product.range],
          ["Capacity", product.capacity],
          ["Top speed", product.speed],
          ["Charging time", product.charge],
          ["Battery", product.battery],
          ["Rated motor power", product.power],
        ]
      : []),
  ];
  return /* HTML */ `${pageHero("Our vehicles", escape(product.name), product.description)}
    <section class="section">
      <div class="container product-detail-grid">
        <div class="product-detail-image">
          ${image(product.image, product.name, "", true)}
        </div>
        <div class="product-detail-copy">
          <span class="eyebrow">${product.label}</span>
          <h2>Designed for the<br />work of every day.</h2>
          <p>
            ${product.intro || product.description + " Contact KAL’s sales team for the current configuration, availability and a complete specification sheet."}
          </p>
          <dl class="detail-specs">
            ${specs.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("")}
          </dl>
          <p class="spec-note">
            Specifications reproduced from KAL’s website for this demonstration.
            Range and performance depend on operating conditions. Confirm the
            latest specifications and availability with KAL.
          </p>
          <a
            class="button"
            href="/contact/?vehicle=${encodeURIComponent(product.name)}#enquiry"
            >Enquire about this vehicle</a
          >
          <p>
            ${external("/products/" + product.slug, "View current official specifications", "text-link")}
          </p>
        </div>
      </div>
    </section>
    <section class="section related-section">
      <div class="container">
        <div class="section-heading">
          <div>
            <span class="eyebrow">More from KAL</span>
            <h2>Explore the range.</h2>
          </div>
          <a class="text-link" href="/products/"
            >All vehicles <span aria-hidden="true">↗</span></a
          >
        </div>
        <div class="product-grid">
          ${products
            .filter((p) => p.slug !== product.slug)
            .slice(0, 3)
            .map(productCard)
            .join("")}
        </div>
      </div>
    </section>`;
}
export function manufacturing() {
  return /* HTML */ `${pageHero("Manufacturing", "On our roads.<br>In our space programmes.", "Electric vehicle manufacturing and high-precision aerospace machining, from KAL’s Aralumoodu facility in Thiruvananthapuram.")}
    <section class="section">
      <div class="container">
        <div class="facility-grid">
          <div>
            <span class="eyebrow">Aralumoodu, Kerala</span>
            <h2>Decades of engineering.<br />One shared commitment.</h2>
            <p>
              KAL’s manufacturing campus brings together electric vehicle
              assembly, CNC machining and quality control. The facility supports
              both mobility products and components for India’s space
              programmes.
            </p>
            <p>
              Our aerospace collaboration began in 1988. We supply
              high-precision components for VSSC, LPSC and IISU.
            </p>
            ${external("/manufacturing-facilities", "Explore official facility information", "text-link")}
          </div>
          <div class="facility-photo">
            ${image("factory", "The KAL manufacturing facility at Aralumoodu")}
          </div>
        </div>
        <div class="stats-grid">
          <div class="stat">
            <strong>11 acres</strong><span>Manufacturing campus</span>
          </div>
          <div class="stat">
            <strong>1,00,000 sq ft</strong><span>Factory floor area</span>
          </div>
          <div class="stat">
            <strong>ISO 9001:2015</strong><span>Certified quality systems</span>
          </div>
        </div>
        <div class="facility-list">
          <article>
            <h3>Electric vehicle production</h3>
            <p>
              Dedicated sections support the manufacturing process from metal
              forming through finishing and assembly.
            </p>
            <ul>
              <li>Electric vehicle assembly lines</li>
              <li>Metal forming and fabrication</li>
              <li>Pre-treatment and painting systems</li>
            </ul>
          </article>
          <article>
            <h3>Precision machining</h3>
            <p>
              CNC and conventional machining capabilities support demanding
              component requirements.
            </p>
            <ul>
              <li>CNC milling and turning</li>
              <li>Wire-cut and spark EDM</li>
              <li>Broaching, thread rolling and gear hobbing</li>
            </ul>
          </article>
          <article>
            <h3>Aerospace components</h3>
            <p>
              High-precision components for India’s space programmes,
              manufactured in collaboration with VSSC, LPSC and IISU.
            </p>
            <ul>
              <li>Aerospace machining experience since 1988</li>
              <li>Components for launch vehicle programmes</li>
              <li>Engineering support across space missions</li>
            </ul>
          </article>
          <article>
            <h3>Quality control & testing</h3>
            <p>
              Inspection and testing equipment supports manufacturing quality
              and consistency.
            </p>
            <ul>
              <li>Profile projectors and digital height gauges</li>
              <li>Universal testing equipment</li>
              <li>Hardness testing facilities</li>
            </ul>
          </article>
        </div>
      </div>
    </section>`;
}
export function publicInformation() {
  const resources = [
    [
      "/tenders",
      "Tenders & procurement",
      "View KAL’s procurement notices and tender information.",
    ],
    [
      "https://etenders.kerala.gov.in/",
      "Kerala e-Tender portal",
      "Access the Government of Kerala’s electronic tender system.",
    ],
    [
      "/rti",
      "Right to Information",
      "Find RTI information and designated officers.",
    ],
    [
      "/mandatory-disclosures",
      "Mandatory disclosures",
      "Read company disclosures and public records.",
    ],
    [
      "/government-orders",
      "Government orders",
      "View relevant government orders published by KAL.",
    ],
    [
      "/certifications",
      "Certifications",
      "Explore company certification information.",
    ],
    [
      "https://gem.gov.in/",
      "Government e-Marketplace",
      "Access the government procurement marketplace.",
    ],
    [
      "/dealer-details",
      "Dealer network",
      "Find current KAL dealer information.",
    ],
  ];
  return /* HTML */ `${pageHero("Public information", "Clear information.<br>Easy access.", "Find tenders, statutory disclosures, government orders and public resources in one place.")}
    <section class="section">
      <div class="container">
        <div class="public-links">
          ${resources.map(([url, title, description]) => `<a class="public-link" href="${url.startsWith("http") ? url : official + url}" target="_blank" rel="noopener noreferrer">${icon("document")}<div><h2>${title}</h2><p>${description}</p></div>${icon("external")}</a>`).join("")}
        </div>
        <p class="info-note">
          These links open current official resources in a new tab. Tender
          notices, disclosures and statutory records remain on their original
          portals.
        </p>
        <div class="contact-method">
          ${icon("mail")}
          <div>
            <h3>CMO portal charge officer</h3>
            <p>Shri. Ajith Kumar P · Manager (GAD)</p>
            <a href="tel:+919447584320">+91 94475 84320</a
            ><a href="mailto:mgrgad.kal@kerala.gov.in"
              >mgrgad.kal@kerala.gov.in</a
            >
          </div>
        </div>
      </div>
    </section>`;
}
export function news() {
  return /* HTML */ `${pageHero("News & careers", "Updates from KAL.", "Company announcements, recruitment notifications and official news.")}
    <section class="section">
      <div class="container">
        <div class="news-list">
          <article class="news-article">
            <time class="news-date" datetime="2026-09-10"
              ><strong>10</strong>September 2026</time
            >
            <div>
              <span class="closed-badge"
                >Applications closed · 17 September 2026</span
              >
              <h2>
                Machine Shop: Junior Engineer, Engineer & Senior Engineer
                recruitment
              </h2>
              <p>
                Applications were invited for engineering positions in the
                Machine Shop on a contract basis. The published application
                deadline was 17 September 2026.
              </p>
              ${external("/news", "Read official notification", "text-link")}
            </div>
          </article>
        </div>
        <p class="info-note">
          This demonstration reflects the notification available on KAL’s
          website at the time of review. Check official pages for current
          openings and deadlines.
        </p>
        <div class="news-resources">
          ${external("/news", "All official news", "text-link")}${external("/careers", "Current career opportunities", "text-link")}${external("/tenders", "Tender notices", "text-link")}
        </div>
      </div>
    </section>`;
}
export function gallery() {
  return /* HTML */ `${pageHero("Photo gallery", "A glimpse of KAL.", "Photographs from Kerala Automobiles Limited’s current official gallery. Select a photograph to view it in full.")}
    <section class="section">
      <div class="container">
        <div class="gallery-grid">
          ${galleryPhotos.map((photo) => `<button class="gallery-item" data-gallery-image aria-label="View photo: ${escape(photo.caption)}">${image(photo.image, photo.alt)}<span>${photo.caption}</span></button>`).join("")}
        </div>
        <p class="info-note">
          Images reproduced from the
          <a
            href="${official}/photo-gallery"
            target="_blank"
            rel="noopener noreferrer"
            >official KAL photo gallery</a
          >.
        </p>
      </div>
    </section>`;
}
export function contact() {
  return /* HTML */ `${pageHero("Contact", "Let’s get you moving.", "Talk to our team about electric vehicles, sales, service or general enquiries.")}
    <section class="section">
      <div class="container contact-grid">
        <div class="contact-info">
          <span class="eyebrow">We’re here to help</span>
          <h2>Contact the right team.</h2>
          <div class="contact-method">
            ${icon("phone")}
            <div>
              <h3>Vehicle sales</h3>
              <a href="tel:+919778466292">+91 97784 66292</a
              ><a href="mailto:marketingexe.kal@kerala.gov.in"
                >marketingexe.kal@kerala.gov.in</a
              >
            </div>
          </div>
          <div class="contact-method">
            ${icon("gear")}
            <div>
              <h3>After-sales & service</h3>
              <a href="tel:+919778466294">+91 97784 66294</a
              ><a href="mailto:engrservice.kal@kerala.gov.in"
                >engrservice.kal@kerala.gov.in</a
              >
            </div>
          </div>
          <div class="contact-method">
            ${icon("mail")}
            <div>
              <h3>General enquiries</h3>
              <a href="tel:+919447584320">+91 94475 84320</a
              ><a href="mailto:mgrgad.kal@kerala.gov.in"
                >mgrgad.kal@kerala.gov.in</a
              >
            </div>
          </div>
          <div class="contact-method">
            ${icon("location")}
            <div>
              <h3>Visit KAL</h3>
              <p>
                Kerala Automobiles Limited<br />Aralumoodu P.O.,
                Neyyattinkara<br />Thiruvananthapuram, Kerala · 695 123
              </p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Kerala+Automobiles+Limited+Aralumoodu+Neyyattinkara"
                target="_blank"
                rel="noopener noreferrer"
                >Open map ${icon("external")}</a
              >
            </div>
          </div>
          ${external("/dealer-details", "Find a KAL dealer", "text-link")}
        </div>
        <form class="contact-form" id="enquiry-form">
          <span class="eyebrow" id="enquiry">Vehicle enquiry</span>
          <h2>Tell us what you need.</h2>
          <p>
            This demo prepares an enquiry draft for you to review. It does not
            submit or store your details.
          </p>
          <div class="form-grid">
            <div class="form-field">
              <label for="enquiry-name"
                >Full name <span aria-hidden="true">*</span></label
              ><input
                id="enquiry-name"
                name="name"
                required
                minlength="2"
                maxlength="100"
                autocomplete="name"
                placeholder="Your full name"
              />
            </div>
            <div class="form-field">
              <label for="enquiry-phone"
                >Phone number <span aria-hidden="true">*</span></label
              ><input
                id="enquiry-phone"
                name="phone"
                required
                type="tel"
                pattern="[+0-9 ]{7,20}"
                maxlength="20"
                autocomplete="tel"
                placeholder="Your phone number"
              />
            </div>
            <div class="form-field full">
              <label for="enquiry-email"
                >Email address <span aria-hidden="true">*</span></label
              ><input
                id="enquiry-email"
                name="email"
                required
                type="email"
                maxlength="150"
                autocomplete="email"
                placeholder="you@example.com"
              />
            </div>
            <div class="form-field full">
              <label for="enquiry-vehicle"
                >Vehicle of interest <span aria-hidden="true">*</span></label
              ><select id="enquiry-vehicle" name="vehicle" required>
                <option value="">Select a vehicle</option>
                ${products.map((p) => `<option value="${escape(p.name)}">${p.name}</option>`).join("")}
                <option value="Help choosing a vehicle">Help me choose</option>
              </select>
            </div>
            <div class="form-field full">
              <label for="enquiry-message"
                >Your requirement <span aria-hidden="true">*</span></label
              ><textarea
                id="enquiry-message"
                name="message"
                required
                minlength="10"
                maxlength="2000"
                rows="4"
                placeholder="Tell us how you plan to use the vehicle."
              ></textarea
              ><span class="form-hint"
                >Required fields are marked with an asterisk.</span
              >
            </div>
          </div>
          <button class="button" type="submit">Prepare enquiry</button>
          <p class="form-status" role="status" aria-live="polite"></p>
          <section
            class="enquiry-preview"
            hidden
            tabindex="-1"
            aria-label="Prepared enquiry"
          >
            <h3>Review your enquiry</h3>
            <pre></pre>
            <div class="preview-actions">
              <a class="button" data-email-draft>Open email draft</a
              ><button
                type="button"
                class="button button-outline"
                data-download-enquiry
              >
                Download draft
              </button>
            </div>
            <p class="form-hint">
              Your email app opens a draft addressed to KAL. Review it before
              sending.
            </p>
          </section>
        </form>
      </div>
    </section>
    <section class="section resources-section" id="accessibility">
      <div class="container accessibility-copy">
        <span class="eyebrow">Accessibility</span>
        <h2>Designed for easier access.</h2>
        <p>
          This demonstration supports keyboard navigation, visible focus
          indicators, a skip link, readable text, responsive layouts and
          reduced-motion preferences. Use the A+ control in the desktop header
          to enlarge text.
        </p>
        <p>
          For help accessing KAL information, contact
          <a class="text-link" href="mailto:mgrgad.kal@kerala.gov.in"
            >mgrgad.kal@kerala.gov.in</a
          >.
        </p>
      </div>
    </section>`;
}

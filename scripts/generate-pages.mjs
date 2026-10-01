import { mkdir, writeFile } from "node:fs/promises";
import { layout, home } from "../src/templates.mjs";
import { products } from "../src/data.mjs";
import {
  about,
  catalog,
  productDetail,
  manufacturing,
  publicInformation,
  news,
  gallery,
  contact,
} from "../src/pages.mjs";

await writeFile(
  "index.html",
  layout({
    title:
      "Kerala Automobiles Limited — Electric Vehicles & Precision Engineering",
    description:
      "Explore KAL, a Government of Keralam undertaking since 1978. Discover Kerala Neem G, electric goods vehicles and precision aerospace manufacturing.",
    content: home(),
    active: "home",
  }),
);
const pages = [
  [
    "about",
    "About Kerala Automobiles Limited",
    "Explore KAL’s history, electric vehicle transition and leadership. A Government of Keralam undertaking incorporated in 1978.",
    about(),
    "about",
  ],
  [
    "products",
    "KAL Electric Vehicles — Passenger, Goods & Utility",
    "Explore KAL’s complete range of electric passenger vehicles, goods carts and utility vehicles, including Kerala Neem G and Kerala Green Stream.",
    catalog(),
    "products",
  ],
  [
    "manufacturing",
    "KAL Manufacturing & Aerospace Capabilities",
    "Discover KAL’s electric vehicle production and precision aerospace machining at the Aralumoodu facility in Thiruvananthapuram.",
    manufacturing(),
    "manufacturing",
  ],
  [
    "public-information",
    "KAL Tenders, RTI & Public Information",
    "Find official KAL tender notices, RTI resources, government orders, mandatory disclosures and public procurement portals.",
    publicInformation(),
    "public",
  ],
  [
    "news",
    "KAL News & Careers",
    "Explore official KAL announcements, recruitment notifications and career resources.",
    news(),
    "news",
  ],
  [
    "gallery",
    "KAL Photo Gallery",
    "View photographs from Kerala Automobiles Limited’s official gallery.",
    gallery(),
    "",
  ],
  [
    "contact",
    "Contact KAL — Sales, Enquiries & Vehicle Support",
    "Contact Kerala Automobiles Limited for electric vehicle sales, service and general enquiries. Find phone numbers, emails and office information.",
    contact(),
    "contact",
  ],
  ...products.map((p) => [
    `products/${p.slug}`,
    `${p.name} — KAL Electric Vehicle`,
    `${p.name}: ${p.description} Explore published specifications and contact Kerala Automobiles Limited for sales.`,
    productDetail(p),
    "products",
  ]),
];
for (const [route, title, description, content, active] of pages) {
  await mkdir(route, { recursive: true });
  await writeFile(
    `${route}/index.html`,
    layout({ title, description, content, active, path: `/${route}/` }),
  );
}
await writeFile(
  "404.html",
  layout({
    title: "Page not found",
    description:
      "This page could not be found. Explore KAL’s electric vehicles or return to the home page.",
    content:
      '<div class="container error-page"><strong>404</strong><h1>This road leads elsewhere.</h1><p>The page you are looking for could not be found.</p><a class="button" href="/">Return to home</a></div>',
    path: "/404.html",
  }),
);
await mkdir("public", { recursive: true });
const origin = process.env.SITE_URL?.replace(/\/$/, "");
const production = process.env.PRODUCTION_SITE === "true";
if (production && !origin)
  throw new Error("Set SITE_URL before enabling production indexing.");
await writeFile(
  "public/robots.txt",
  production
    ? `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`
    : "User-agent: *\nDisallow: /\n",
);
if (origin) {
  const paths = ["/", ...pages.map(([route]) => `/${route}/`)];
  await writeFile(
    "public/sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>${origin}${path}</loc></url>`).join("")}</urlset>`,
  );
}
console.log(`Generated ${pages.length + 2} static pages.`);

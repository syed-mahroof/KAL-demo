// Optional regression checks. Use an existing Playwright installation; no runtime dependency.
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { products } from "../src/data.mjs";
import { finderChoices, finderModel } from "../src/finder.mjs";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE
    ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href
    : "playwright"
);
const browser = await chromium.launch({
  headless: true,
  ...(process.env.BROWSER_EXECUTABLE
    ? { executablePath: process.env.BROWSER_EXECUTABLE }
    : {}),
});
const base = process.env.PREVIEW_URL || "http://127.0.0.1:4173";
const out = "audit/screenshots/interactive/regression";
await mkdir(out, { recursive: true });
const errors = [],
  failures = [],
  checks = [];
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
async function check(name, action) {
  try {
    await action();
    checks.push(name);
    console.log("PASS", name);
  } catch (error) {
    failures.push({ name, error: error.message });
    console.log("FAIL", name, error.message.slice(0, 600));
  }
}
async function go(route = "/") {
  await page.goto(base + route);
  await page.evaluate(() => document.fonts.ready);
}
async function noOverflow() {
  return page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    return {
      width,
      total: document.documentElement.scrollWidth,
      offenders: [...document.querySelectorAll("body *")]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return (
            r.width &&
            (r.right > width + 1 || r.left < -1) &&
            !el.closest('.filters,.sr-only,[aria-hidden="true"],template') &&
            getComputedStyle(el).visibility !== "hidden"
          );
        })
        .slice(0, 6)
        .map((el) => ({
          tag: el.tagName,
          cls: el.className,
          text: el.textContent.slice(0, 80),
        })),
    };
  });
}
await check("Viewport and route matrix", async () => {
  const routes = [
    "/",
    "/about/",
    "/products/",
    "/manufacturing/",
    "/public-information/",
    "/news/",
    "/gallery/",
    "/contact/",
    ...products.map((p) => `/products/${p.slug}/`),
    "/404.html",
  ];
  const overflows = [];
  for (const width of [320, 375, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: width < 700 ? 844 : 900 });
    assert.equal(await page.evaluate(() => innerWidth), width);
    for (const route of routes) {
      await go(route);
      const overflow = await noOverflow();
      if (overflow.total > overflow.width + 1)
        overflows.push({ route, ...overflow });
      assert.equal(await page.locator("h1").count(), 1, route);
      assert.equal(await page.locator("main").count(), 1, route);
      assert.ok(
        await page.locator(".site-header .government-emblem").isVisible(),
        `${route}: government emblem missing`,
      );
    }
  }
  assert.deepEqual(overflows, []);
});
await check(
  "Rickshaw fleet slider, estimates, validation and enquiry handoff",
  async () => {
    await page.setViewportSize({ width: 390, height: 900 });
    await go();
    await page.locator("#fleet-impact").scrollIntoViewIfNeeded();
    const metric = (key) => page.locator(`[data-impact-value="${key}"]`);
    assert.equal(await metric("tonnes").textContent(), "56.3");
    assert.equal(await metric("fuel").textContent(), "24,000");
    assert.equal(await metric("distance").textContent(), "6,00,000");
    const range = page.getByRole("slider", {
      name: "Fleet size slider",
      exact: true,
    });
    // Chrome does not expose its native thumb through getComputedStyle.
    // Capture the rendered control for visual verification instead.
    await range.screenshot({ path: `${out}/rickshaw-slider.png` });
    await range.press("End");
    assert.equal(await page.locator("#impact-fleet").inputValue(), "500");
    assert.equal(await metric("tonnes").textContent(), "1,126.9");
    await range.press("Home");
    await range.press("ArrowRight");
    assert.equal(await range.getAttribute("aria-valuetext"), "2 vehicles");
    await page
      .getByRole("button", { name: "Add one fleet vehicle", exact: true })
      .click();
    await page.locator('[data-daily-preset="120"]').click();
    assert.equal(await page.locator("#impact-fleet").inputValue(), "3");
    assert.equal(await metric("tonnes").textContent(), "10.1");
    await page.locator(".impact-assumptions summary").click();
    await page.locator("#impact-efficiency").fill("0");
    assert.ok(await page.locator("[data-impact-error]").isVisible());
    assert.equal(await metric("tonnes").textContent(), "—");
    await page.locator("#impact-efficiency").fill("25");
    await page.locator("#impact-fuel").selectOption("diesel");
    await page.locator("#impact-days").fill("365");
    assert.equal(await metric("fuel").textContent(), "5,256");
    assert.equal(await metric("tonnes").textContent(), "14.1");
    assert.ok(!(await page.locator("[data-impact-error]").isVisible()));
    assert.match(
      await page.locator(".impact-boundary").textContent(),
      /tailpipe-only estimate/,
    );
    await page.locator(".impact-method summary").click();
    assert.match(
      await page.locator(".impact-method a").getAttribute("href"),
      /epa\.gov/,
    );
    await page.locator("[data-impact-enquire]").click();
    assert.equal(await page.locator('[name="purpose"]').inputValue(), "fleet");
    const message = await page.locator('[name="message"]').inputValue();
    assert.match(message, /3 electric vehicles/);
    assert.match(message, /120 km per vehicle per day/);
    assert.match(message, /365 operating days/);
    assert.match(message, /diesel comparison assumes 25 km/);
  },
);
await check("Guided vehicle finder covers all nine real models", async () => {
  await page.setViewportSize({ width: 390, height: 900 });
  await go();
  await page.locator(".vehicle-finder summary").click();
  for (const [work, choice] of Object.entries(finderChoices)) {
    await page.locator(`[data-finder-work="${work}"]`).click();
    for (const [need] of choice.needs) {
      await page.locator("[data-finder-need]").selectOption(need);
      const model = finderModel(work, need);
      assert.equal(
        await page.locator(".finder-copy h3").textContent(),
        model.name,
      );
      assert.equal(
        await page.locator(".finder-links .button").getAttribute("href"),
        `/products/${model.slug}/`,
      );
      assert.match(
        await page
          .locator(".finder-links .text-link")
          .first()
          .getAttribute("href"),
        new RegExp(model.slug),
      );
    }
  }
  await go("/products/?category=goods");
  await page.locator(".vehicle-finder summary").click();
  assert.equal(
    await page
      .locator('[data-finder-work="goods"]')
      .getAttribute("aria-pressed"),
    "true",
  );
  assert.equal(
    await page.locator(".finder-copy h3").textContent(),
    "Kerala Green Stream",
  );
});
await check(
  "Expanded tools and maximum estimates fit mobile, tablet and enlarged text",
  async () => {
    for (const [width, enlarged] of [
      [320, false],
      [390, false],
      [768, false],
      [1440, false],
      [320, true],
      [1440, true],
    ]) {
      await page.setViewportSize({ width, height: 900 });
      await go();
      if (enlarged) {
        if (await page.locator(".menu-toggle").isVisible())
          await page.locator(".menu-toggle").click();
        await page.locator("[data-text-size]:visible").first().click();
        if (await page.locator(".site-header.menu-open").count())
          await page.keyboard.press("Escape");
      }
      await page.locator(".vehicle-finder summary").click();
      await page.locator('[data-finder-work="utility"]').click();
      await page.locator(".impact-assumptions summary").click();
      await page.locator("#impact-fleet").fill("500");
      await page.locator("#impact-daily").press("End");
      await page.locator("#impact-days").fill("365");
      await page.locator("#impact-efficiency").fill("5");
      await page.locator("#impact-fuel").selectOption("diesel");
      const bounds = await noOverflow();
      assert.ok(
        bounds.total <= bounds.width + 1,
        `${width}, enlarged=${enlarged}: ${JSON.stringify(bounds)}`,
      );
    }
  },
);
await check(
  "Five homepage portraits remain visible on mobile and desktop",
  async () => {
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await go();
      await page.locator(".stewardship-section").scrollIntoViewIfNeeded();
      const portraits = page.locator(".stewardship-preview .leader > img");
      assert.equal(await portraits.count(), 5);
      await portraits.evaluateAll(async (images) => {
        await Promise.all(images.map((img) => img.decode()));
      });
      for (const portrait of await portraits.all()) {
        assert.ok(await portrait.isVisible());
        const box = await portrait.boundingBox();
        assert.ok(
          box.width >= 70 && box.height >= 80,
          `${width}: portrait too small`,
        );
        assert.ok(
          box.x >= 0 && box.x + box.width <= width,
          `${width}: portrait clipped`,
        );
      }
    }
  },
);
await check(
  "Nine model stages display complete cutouts with intrinsic dimensions",
  async () => {
    for (const width of [320, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const product of products) {
        await go(`/products/${product.slug}/`);
        const image = page.locator(".vehicle-stage .depth-vehicle");
        await image.evaluate((img) => img.decode());
        const result = await image.evaluate((img) => {
          const stage = img.closest(".depth-scene").getBoundingClientRect();
          const rect = img.getBoundingClientRect();
          return {
            source: img.currentSrc,
            fit: getComputedStyle(img).objectFit,
            dimensions:
              img.naturalWidth === Number(img.getAttribute("width")) &&
              img.naturalHeight === Number(img.getAttribute("height")),
            contained:
              rect.left >= stage.left - 1 &&
              rect.right <= stage.right + 1 &&
              rect.top >= stage.top - 1 &&
              rect.bottom <= stage.bottom + 1,
          };
        });
        assert.match(result.source, /-cutout\.webp$/);
        assert.equal(result.fit, "contain");
        assert.ok(
          result.dimensions && result.contained,
          `${width}: ${product.name}: ${JSON.stringify(result)}`,
        );
      }
    }
  },
);
await check(
  "Header alignment, portrait frames and intrinsic image dimensions",
  async () => {
    for (const width of [320, 375, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: width < 700 ? 844 : 900 });
      await go();
      const brand = await page.locator(".brand").boundingBox();
      const actions = await page.locator(".masthead-actions").boundingBox();
      assert.ok(
        brand.x + brand.width <= actions.x + 1,
        `${width}: identity overlaps header actions`,
      );
      if (width === 1440) {
        const hero = await page.locator(".hero-carousel").boundingBox();
        const utility = await page.locator(".utility-bar").boundingBox();
        assert.ok(Math.abs(hero.y - utility.height) < 2);
        assert.ok(hero.y + hero.height >= 900);
      }
    }
    await go("/about/");
    await page.locator(".stewardship-section").scrollIntoViewIfNeeded();
    await page.evaluate(async () => {
      await Promise.all(
        [...document.querySelectorAll(".stewardship-people img")].map((img) =>
          img.decode(),
        ),
      );
    });
    const portraits = await page
      .locator(".stewardship-people img")
      .evaluateAll((images) =>
        images.map((img) => ({
          top: img.getBoundingClientRect().top,
          height: img.getBoundingClientRect().height,
          fit: getComputedStyle(img).objectFit,
          position: getComputedStyle(img).objectPosition,
          dimensions:
            img.getAttribute("width") === String(img.naturalWidth) &&
            img.getAttribute("height") === String(img.naturalHeight),
        })),
      );
    assert.ok(
      Math.max(...portraits.map((p) => p.top)) -
        Math.min(...portraits.map((p) => p.top)) <=
        1,
      JSON.stringify(portraits),
    );
    assert.ok(
      Math.max(...portraits.map((p) => p.height)) -
        Math.min(...portraits.map((p) => p.height)) <=
        1,
      JSON.stringify(portraits),
    );
    assert.ok(
      portraits.every(
        (p) => p.fit === "cover" && p.position === "50% 0%" && p.dimensions,
      ),
    );
  },
);
await check(
  "Single-row filters, category query and readable buyer facts",
  async () => {
    await page.setViewportSize({ width: 320, height: 844 });
    for (const route of ["/", "/products/"]) {
      await go(route + "?category=utility");
      const buttons = page.locator("[data-filter]");
      const rows = await buttons.evaluateAll((items) =>
        items.map((el) => ({ top: el.offsetTop, height: el.offsetHeight })),
      );
      assert.equal(new Set(rows.map((r) => r.top)).size, 1);
      assert.ok(rows.every((r) => r.height >= 44));
      assert.equal(
        await page
          .locator('[data-filter="utility"]')
          .getAttribute("aria-pressed"),
        "true",
      );
      assert.equal(
        await page.locator(".product-card:not([hidden])").count(),
        route === "/" ? 1 : 3,
      );
      await buttons.first().click();
      await page.locator('[data-filter="goods"]').click();
      assert.equal(
        await page.locator(".product-card:not([hidden])").count(),
        route === "/" ? 1 : 4,
      );
      const chosen = await page.locator('[data-filter="goods"]').boundingBox();
      assert.ok(chosen.x >= 0 && chosen.x + chosen.width <= 320);
      assert.equal(await page.locator(".product-specs dt.sr-only").count(), 0);
      assert.ok(await page.locator(".product-specs").first().innerText());
    }
  },
);
await check("Mobile menu, grouping, Escape and focus restoration", async () => {
  await page.setViewportSize({ width: 320, height: 844 });
  await go();
  await page.locator(".menu-toggle").click();
  assert.equal(
    await page.locator(".menu-toggle").getAttribute("aria-expanded"),
    "true",
  );
  assert.equal(
    await page.evaluate(() => document.activeElement.textContent.trim()),
    "Home",
  );
  await page
    .locator(".nav-dropdown summary")
    .filter({ hasText: "Public information" })
    .click();
  assert.ok(
    await page
      .getByRole("link", { name: "Downloads", exact: true })
      .isVisible(),
  );
  await page.keyboard.press("Escape");
  assert.equal(
    await page.locator(".menu-toggle").getAttribute("aria-expanded"),
    "false",
  );
  assert.ok(
    await page
      .locator(".menu-toggle")
      .evaluate((el) => el === document.activeElement),
  );
  await page.locator(".menu-toggle").click();
  await page
    .locator("#primary-nav > a")
    .filter({ hasText: "Our vehicles" })
    .click();
  assert.ok(page.url().endsWith("/products/"));
});
await check("Search, empty result, Escape and focus restoration", async () => {
  await page.locator(".search-open").click();
  await page.locator("#site-search").fill("Neem");
  assert.equal(await page.locator(".search-results a").count(), 1);
  assert.match(
    await page.locator(".search-results a").getAttribute("href"),
    /kerala-neem-g/,
  );
  await page.locator("#site-search").fill("no-such-vehicle");
  assert.match(
    await page.locator(".search-status").textContent(),
    /No results/,
  );
  await page.keyboard.press("Escape");
  await page.waitForFunction(
    () =>
      !document.querySelector(".search-dialog").open &&
      document.activeElement.matches(".search-open"),
  );
  assert.ok(
    await page
      .locator(".search-open")
      .evaluate((el) => el === document.activeElement),
  );
});
await check(
  "Gallery navigation, keyboard, homepage preview and focus restoration",
  async () => {
    await go("/gallery/");
    await page.locator("[data-gallery-image]").first().click();
    assert.ok(await page.locator(".gallery-dialog").evaluate((el) => el.open));
    assert.ok(
      await page
        .locator(".gallery-dialog img")
        .evaluate((el) => el.naturalWidth > 0),
    );
    assert.equal(
      await page.locator(".gallery-count").textContent(),
      "Photo 1 of 5",
    );
    await page.locator("[data-gallery-next]").click();
    assert.equal(
      await page.locator(".gallery-count").textContent(),
      "Photo 2 of 5",
    );
    await page.keyboard.press("ArrowLeft");
    assert.equal(
      await page.locator(".gallery-count").textContent(),
      "Photo 1 of 5",
    );
    await page.keyboard.press("Escape");
    assert.ok(
      await page
        .locator("[data-gallery-image]")
        .first()
        .evaluate((el) => el === document.activeElement),
    );
  },
);
await check(
  "Enquiry preselection, validation and local draft only",
  async () => {
    await go("/contact/?vehicle=Kerala%20Neem%20G#enquiry");
    assert.equal(
      await page.locator('[name="vehicle"]').inputValue(),
      "Kerala Neem G",
    );
    await page.locator('[name="name"]').fill("Demo Visitor");
    await page.locator('[name="email"]').fill("invalid");
    assert.equal(
      await page.locator('[name="email"]').evaluate((el) => el.validity.valid),
      false,
    );
    await page.locator('[name="email"]').fill("visitor@example.com");
    await page.locator('[name="phone"]').fill("9999999999");
    await page
      .locator('[name="message"]')
      .fill("Please share the current passenger vehicle specification.");
    let submissions = 0;
    page.on("request", (req) => {
      if (req.method() === "POST") submissions++;
    });
    await page
      .getByRole("button", { name: "Prepare enquiry", exact: true })
      .click();
    assert.ok(await page.locator(".enquiry-preview").isVisible());
    assert.match(
      await page.locator(".form-status").textContent(),
      /Nothing has been sent/,
    );
    assert.ok(
      await page
        .locator("[data-email-draft]")
        .getAttribute("href")
        .then((href) => href.startsWith("mailto:")),
    );
    assert.equal(submissions, 0);
  },
);
await check(
  "Vehicle comparison, missing figures and identical selections",
  async () => {
    await go("/products/#compare");
    for (const product of products) {
      await page.locator("#compare-1").selectOption(product.slug);
      assert.equal(
        await page.locator('[data-comparison-head="1"] h3').textContent(),
        product.name,
      );
      assert.equal(
        await page
          .locator('[data-compare-cell="1"][data-spec="range"]')
          .textContent(),
        product.range || "Confirm with KAL",
      );
      assert.equal(
        await page
          .locator('[data-compare-cell="1"][data-spec="weight"]')
          .textContent(),
        product.weight,
      );
    }
    await page.locator("#compare-1").selectOption(products[0].slug);
    assert.match(
      await page.locator(".comparison-note").textContent(),
      /same vehicle/,
    );
  },
);
await check("Fleet and dealership enquiry entry paths", async () => {
  for (const purpose of ["fleet", "dealer"]) {
    await go(`/contact/?purpose=${purpose}#enquiry`);
    assert.equal(await page.locator('[name="purpose"]').inputValue(), purpose);
    assert.equal(
      await page.locator('[name="vehicle"]').inputValue(),
      "Help choosing a vehicle",
    );
  }
});
await check(
  "Official video destination and model specification download",
  async () => {
    await go();
    assert.equal(await page.locator("iframe").count(), 0);
    assert.equal(
      await page.locator(".film-poster").getAttribute("href"),
      "https://www.youtube.com/watch?v=a3NsZ8PApJo",
    );
    assert.equal(
      await page.locator(".film-poster").getAttribute("target"),
      "_blank",
    );
    await go(`/products/${products[0].slug}/`);
    const downloadEvent = page.waitForEvent("download");
    await page.locator("[data-download-spec]").click();
    const download = await downloadEvent;
    const text = await readFile(await download.path(), "utf8");
    assert.ok(text.includes(products[0].name));
    assert.ok(text.includes(products[0].range));
    assert.ok(text.includes("Gross vehicle weight is not payload"));
    assert.ok(text.includes("Not a manufacturer brochure"));
  },
);
await check("200% text across all routes at 320 and 1440", async () => {
  const overflows = [];
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/",
      "/about/",
      "/products/",
      "/manufacturing/",
      "/public-information/",
      "/news/",
      "/gallery/",
      "/contact/",
      ...products.map((p) => `/products/${p.slug}/`),
    ]) {
      await go(route);
      if (await page.locator(".menu-toggle").isVisible())
        await page.locator(".menu-toggle").click();
      await page.locator("[data-text-size]:visible").first().click();
      if (await page.locator(".site-header.menu-open").count())
        await page.keyboard.press("Escape");
      assert.equal(
        await page.evaluate(
          () => getComputedStyle(document.documentElement).fontSize,
        ),
        "32px",
      );
      const result = await noOverflow();
      if (result.total > result.width + 1) overflows.push({ route, ...result });
    }
  }
  assert.deepEqual(overflows, []);
});
await check(
  "Hero slide geometry, visible scene controls and image framing",
  async () => {
    for (const [width, height] of [
      [320, 844],
      [375, 844],
      [390, 844],
      [768, 900],
      [1024, 900],
      [1440, 900],
      [844, 390],
    ]) {
      await page.setViewportSize({ width, height });
      await go();
      const initial = await page.locator(".hero-carousel").boundingBox();
      assert.equal(
        await page
          .locator(
            "[data-carousel-position],[data-carousel-prev],[data-carousel-next]",
          )
          .count(),
        0,
      );
      assert.equal(
        await page
          .locator("[data-carousel-pause]")
          .evaluate((el) => getComputedStyle(el).clipPath),
        "inset(50%)",
      );
      assert.equal(await page.locator("[data-hero-select]").count(), 3);
      await page.locator(".hero-carousel").focus();
      for (let i = 0; i < 3; i++) {
        if (i) await page.keyboard.press("ArrowRight");
        await page.waitForFunction(
          (index) =>
            document
              .querySelector(`[data-slide="${index}"]`)
              .hasAttribute("data-active"),
          i,
        );
        if (i) {
          await page.locator(".hero-slides").evaluate(async (el) => {
            await Promise.all(
              el
                .getAnimations({ subtree: true })
                .map((animation) => animation.finished.catch(() => {})),
            );
          });
        }
        assert.equal(
          await page
            .locator(".hero-carousel")
            .boundingBox()
            .then((r) => r.height),
          initial.height,
        );
        assert.equal(
          await page
            .locator('[data-slide][aria-hidden="true"]')
            .evaluateAll((slides) => slides.every((el) => el.inert)),
          true,
        );
        assert.ok(
          await page
            .locator("[data-slide][data-active] .depth-vehicle")
            .evaluate((el) => el.naturalWidth > 0),
        );
        const actions = await page
          .locator("[data-active] .hero-actions")
          .boundingBox();
        const controls = await page.locator(".hero-controls").boundingBox();
        assert.ok(
          actions.y + actions.height <= controls.y + 1,
          `${width}: actions overlap scene controls`,
        );
      }
      if (width <= 700) {
        await page.setViewportSize({ width, height: 1200 });
        assert.equal(
          (await page.locator(".hero-carousel").boundingBox()).height,
          initial.height,
          `${width}: hero stretches with screen height`,
        );
        const alignment = await page
          .locator(".utility-links")
          .evaluate((el) => {
            const children = [...el.children].map((child) =>
              child.getBoundingClientRect(),
            );
            return children.map((r) => r.y + r.height / 2);
          });
        assert.ok(
          Math.max(...alignment) - Math.min(...alignment) < 2,
          `${width}: utility links are not vertically centered`,
        );
      }
    }
  },
);
await check(
  "Autoplay over imagery, action hover, persistent focus/manual pause, swipe and explicit resume",
  async () => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await go();
    await page.clock.install();
    await page.mouse.move(0, 0);
    await page.clock.runFor(7100);
    await page.waitForFunction(() =>
      document.querySelector('[data-slide="1"]').hasAttribute("data-active"),
    );
    assert.equal(
      await page.locator("[data-carousel-status]").textContent(),
      "",
    );
    await page.mouse.move(700, 500);
    await page.clock.runFor(7100);
    await page.waitForFunction(() =>
      document.querySelector('[data-slide="2"]').hasAttribute("data-active"),
    );
    await page.locator("[data-active] .hero-actions .button").hover();
    await page.clock.runFor(15000);
    assert.equal(
      await page.locator("[data-active]").getAttribute("data-slide"),
      "2",
    );
    await page.mouse.move(0, 0);
    await page.locator(".hero-carousel").focus();
    await page.keyboard.press("ArrowLeft");
    await page.waitForFunction(() =>
      document.querySelector('[data-slide="1"]').hasAttribute("data-active"),
    );
    await page.locator(".search-open").focus();
    await page.clock.runFor(15000);
    assert.equal(
      await page.locator("[data-active]").getAttribute("data-slide"),
      "1",
    );
    await page.locator(".hero-carousel").focus();
    await page.keyboard.press("ArrowRight");
    await page.waitForFunction(() =>
      document.querySelector('[data-slide="2"]').hasAttribute("data-active"),
    );
    assert.match(
      await page.locator("[data-carousel-status]").textContent(),
      /3 of 3/,
    );
    await page.locator(".hero-carousel").dispatchEvent("pointerdown", {
      pointerId: 9,
      pointerType: "touch",
      clientX: 250,
      clientY: 220,
    });
    await page.locator(".hero-carousel").dispatchEvent("pointerup", {
      pointerId: 9,
      pointerType: "touch",
      clientX: 100,
      clientY: 230,
    });
    await page.waitForFunction(() =>
      document.querySelector('[data-slide="0"]').hasAttribute("data-active"),
    );
    await page.locator(".search-open").focus();
    await page.clock.runFor(15000);
    assert.equal(
      await page.locator("[data-active]").getAttribute("data-slide"),
      "0",
    );
    await page.locator("[data-carousel-pause]").focus();
    await page.keyboard.press("Enter");
    await page.mouse.move(0, 0);
    await page.clock.runFor(7100);
    await page.waitForFunction(() =>
      document.querySelector('[data-slide="1"]').hasAttribute("data-active"),
    );
  },
);
await check(
  "Trust rotation, stable slots, unique items, offscreen pause and user pause",
  async () => {
    await go();
    await page.mouse.move(0, 0);
    await page.locator(".trust-strip").scrollIntoViewIfNeeded();
    const initial = await page.locator(".trust-strip").boundingBox();
    const start = await page.locator(".trust-content strong").allTextContents();
    await page.clock.runFor(6400);
    const changed = await page
      .locator(".trust-content strong")
      .allTextContents();
    assert.notDeepEqual(changed, start);
    assert.equal(new Set(changed).size, 3);
    assert.equal(
      await page
        .locator(".trust-strip")
        .boundingBox()
        .then((r) => r.height),
      initial.height,
    );
    assert.equal(
      await page
        .locator("[data-trust-pause]")
        .evaluate((el) => getComputedStyle(el).clipPath),
      "inset(50%)",
    );
    await page.locator("[data-trust-pause]").focus();
    await page.mouse.move(0, 0);
    await page.clock.runFor(15000);
    assert.deepEqual(
      await page.locator(".trust-content strong").allTextContents(),
      changed,
    );
    await page.keyboard.press("Enter");
    await page.mouse.move(0, 0);
    await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
    await page.clock.runFor(15000);
    assert.deepEqual(
      await page.locator(".trust-content strong").allTextContents(),
      changed,
    );
  },
);
await check("Offscreen hero and simulated hidden-tab pause", async () => {
  await go();
  await page.mouse.move(0, 0);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.clock.runFor(15000);
  assert.equal(
    await page.locator("[data-active]").getAttribute("data-slide"),
    "0",
  );
  await page.evaluate(() => {
    delete document.hidden;
    document.dispatchEvent(new Event("visibilitychange"));
    scrollTo(0, document.body.scrollHeight);
  });
  await page.clock.runFor(15000);
  assert.equal(
    await page.locator("[data-active]").getAttribute("data-slide"),
    "0",
  );
  await page.locator(".trust-strip").scrollIntoViewIfNeeded();
  const start = await page.locator(".trust-content strong").allTextContents();
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.clock.runFor(15000);
  assert.deepEqual(
    await page.locator(".trust-content strong").allTextContents(),
    start,
  );
});
await check("Reduced motion disables both rotations", async () => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await go();
  assert.ok(await page.locator("[data-carousel-pause]").isDisabled());
  assert.ok(await page.locator("[data-trust-pause]").isDisabled());
  await page.clock.runFor(15000);
  assert.equal(
    await page.locator("[data-active]").getAttribute("data-slide"),
    "0",
  );
  await page.locator(".trust-strip").scrollIntoViewIfNeeded();
  await page.clock.runFor(15000);
  assert.deepEqual(
    await page.locator(".trust-content strong").allTextContents(),
    ["Since 1978", "All-electric mobility", "Precision manufacturing"],
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
});
await check("Official notice and nine detail specifications", async () => {
  await go("/news/");
  assert.match(
    await page.locator(".closed-badge").textContent(),
    /Applications closed/,
  );
  assert.match(
    await page
      .getByRole("link", { name: "Read official notification" })
      .getAttribute("href"),
    /NOTIFICATION_1789034956\.pdf/,
  );
  for (const product of products) {
    await go(`/products/${product.slug}/`);
    assert.equal((await page.locator("h1").textContent()).trim(), product.name);
    assert.match(
      await page.locator(".detail-specs").textContent(),
      new RegExp(product.length),
    );
    assert.match(
      await page.locator(".detail-specs").textContent(),
      new RegExp(product.weight),
    );
  }
});
await check("Static first slide without JavaScript", async () => {
  const staticPage = await browser.newPage({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  await staticPage.goto(base);
  assert.equal(await staticPage.locator(".hero-slide:visible").count(), 1);
  assert.ok(
    await staticPage
      .getByRole("link", { name: "Explore Neem G", exact: true })
      .isVisible(),
  );
  assert.equal(await staticPage.locator(".product-card").count(), 3);
  assert.ok(await staticPage.locator("#impact-fleet").isDisabled());
  assert.equal(
    await staticPage.locator('[data-impact-value="tonnes"]').textContent(),
    "56.3",
  );
  await staticPage.screenshot({ path: out + "/no-js-mobile.png" });
  await staticPage.close();
});
await check("Representative screenshots", async () => {
  const shots = await browser.newPage();
  for (const [name, width, height, route] of [
    ["home-desktop", 1440, 900, "/"],
    ["home-mobile", 390, 844, "/"],
    ["home-320", 320, 844, "/"],
    ["home-tablet", 768, 900, "/"],
    ["home-1024", 1024, 900, "/"],
    ["home-full", 1440, 900, "/"],
    ["catalog-desktop", 1440, 900, "/products/"],
    ["catalog-mobile", 375, 844, "/products/"],
    ["about-desktop", 1440, 900, "/about/"],
    ["news-desktop", 1440, 900, "/news/"],
    ["news-mobile", 390, 844, "/news/"],
    ["landscape", 844, 390, "/"],
  ]) {
    await shots.setViewportSize({ width, height });
    await shots.goto(base + route);
    await shots.evaluate(async () => {
      await document.fonts.ready;
      // Load lazy photographs for full-page captures; deferred carousel slides stay deferred.
      await Promise.all(
        [...document.querySelectorAll("img[src]")].map((img) => {
          img.loading = "eager";
          return img.decode().catch(() => {});
        }),
      );
      document
        .querySelectorAll(".enter-pending")
        .forEach((el) => el.classList.remove("enter-pending"));
    });
    assert.ok(
      await shots
        .locator("img[src]")
        .evaluateAll((images) => images.every((img) => img.naturalWidth > 0)),
      name + ": missing photograph",
    );
    await shots.waitForTimeout(700);
    await shots.screenshot({
      path: `${out}/${name}.png`,
      fullPage:
        name === "home-full" ||
        (!name.startsWith("home") && name !== "landscape"),
    });
  }
  for (const width of [390, 1440]) {
    await shots.setViewportSize({ width, height: 900 });
    await shots.goto(base);
    await shots.locator(".stewardship-section").scrollIntoViewIfNeeded();
    await shots
      .locator(".stewardship-section img")
      .evaluateAll(async (images) => {
        await Promise.all(images.map((img) => img.decode()));
      });
    await shots
      .locator(".stewardship-section")
      .screenshot({ path: `${out}/leadership-${width}.png` });
    await shots.goto(base + `/products/${products[0].slug}/`);
    await shots
      .locator(".vehicle-stage .depth-vehicle")
      .evaluate((img) => img.decode());
    await shots.screenshot({ path: `${out}/neem-detail-${width}.png` });
  }
  for (const width of [320, 390, 1440]) {
    await shots.setViewportSize({ width, height: width < 700 ? 1800 : 1100 });
    await shots.goto(base);
    await shots.locator("#fleet-impact").scrollIntoViewIfNeeded();
    await shots
      .locator("#fleet-impact")
      .screenshot({ path: `${out}/fleet-impact-${width}.png` });
    await shots.locator(".vehicle-finder summary").click();
    await shots.locator('[data-finder-work="goods"]').click();
    await shots.locator("[data-finder-need]").selectOption("covered");
    await shots
      .locator(".vehicle-finder")
      .screenshot({ path: `${out}/vehicle-finder-${width}.png` });
  }
  await shots.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [390, 1440]) {
    await shots.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    await shots.goto(base);
    for (const index of [1, 2]) {
      await shots.locator(".hero-carousel").focus();
      await shots.keyboard.press("ArrowRight");
      await shots.waitForFunction(
        (i) =>
          document
            .querySelector(`[data-slide="${i}"]`)
            .hasAttribute("data-active"),
        index,
      );
      await shots.evaluate(() => scrollTo(0, 0));
      await shots.evaluate(() => document.activeElement.blur());
      await shots.screenshot({ path: `${out}/hero-${index}-${width}.png` });
    }
  }
  await shots.goto(base);
  await shots.locator("[data-text-size]:visible").first().click();
  await shots.screenshot({ path: `${out}/text-200-desktop.png` });
  await shots.setViewportSize({ width: 320, height: 900 });
  await shots.goto(base);
  await shots.locator(".menu-toggle").click();
  await shots.locator("[data-text-size]:visible").first().click();
  await shots.keyboard.press("Escape");
  await shots
    .locator(".hero-image")
    .first()
    .evaluate((img) => img.decode());
  await shots.screenshot({
    path: `${out}/text-200-mobile.png`,
    fullPage: true,
  });
  await shots.close();
});
await writeFile(
  "audit/interactive-browser-results.json",
  JSON.stringify({ date: "2026-10-06", checks, failures, errors }, null, 2),
);
console.log(
  `${checks.length} checks passed; ${failures.length} failures; ${errors.length} browser errors.`,
);
if (failures.length || errors.length) process.exitCode = 1;
// Preserve completed results even if the host browser is slow to shut down.
await browser.close();

// Optional carousel transition regression check using an existing Playwright installation.
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
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
try {
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(process.env.PREVIEW_URL || "http://127.0.0.1:4173");
    await page.evaluate(() => document.fonts.ready);
    const stage = page.locator(".hero-carousel");
    const height = (await stage.boundingBox()).height;
    await stage.focus();
    await page.keyboard.press("ArrowRight");
    await page.waitForFunction(() =>
      document.querySelector('[data-slide="1"]').hasAttribute("data-active"),
    );
    await page.waitForTimeout(100);
    const movement = await page.evaluate(() => {
      const next = document.querySelector("[data-active]");
      const previous = document.querySelector("[data-leaving]");
      return {
        next: new DOMMatrix(getComputedStyle(next).transform).m41,
        previous: new DOMMatrix(getComputedStyle(previous).transform).m41,
        moving: next.getAnimations().length + previous.getAnimations().length,
      };
    });
    assert.ok(
      movement.next > 0 && movement.previous < 0,
      "Both scenes must slide together",
    );
    assert.equal(movement.moving, 2);
    assert.equal((await stage.boundingBox()).height, height);
    await page.keyboard.press("ArrowLeft");
    await page.waitForFunction(() =>
      document.querySelector('[data-slide="0"]').hasAttribute("data-active"),
    );
    await page
      .locator(".hero-slides")
      .evaluate(async (el) =>
        Promise.all(
          el
            .getAnimations({ subtree: true })
            .map((animation) => animation.finished.catch(() => {})),
        ),
      );
    assert.equal(await page.locator("[data-leaving]").count(), 0);
    await page.keyboard.press("ArrowLeft");
    await page.waitForFunction(() =>
      document.querySelector('[data-slide="2"]').hasAttribute("data-active"),
    );
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForFunction(
      () => document.querySelectorAll("[data-leaving]").length === 0,
    );
    assert.equal(
      await stage.evaluate((el) => el.getAnimations({ subtree: true }).length),
      0,
    );
    await page.keyboard.press("ArrowRight");
    await page.waitForFunction(() =>
      document.querySelector('[data-slide="0"]').hasAttribute("data-active"),
    );
    assert.equal(
      await stage.evaluate((el) => el.getAnimations({ subtree: true }).length),
      0,
    );
    console.log(
      `PASS ${width}px: horizontal movement, stable height, rapid reversal, wraparound and reduced motion`,
    );
    await page.close();
  }
} finally {
  await browser.close();
}

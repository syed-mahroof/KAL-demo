import { readFile, readdir, stat } from "node:fs/promises";
import { resolve, join } from "node:path";
import assert from "node:assert/strict";

async function files(directory) {
  return (
    await Promise.all(
      (await readdir(directory, { withFileTypes: true })).map(async (entry) => {
        const path = join(directory, entry.name);
        return entry.isDirectory() ? files(path) : [path];
      }),
    )
  ).flat();
}
const output = resolve("dist");
const paths = await files(output);
const htmlPages = paths.filter((path) => path.endsWith(".html"));
assert.equal(
  htmlPages.length,
  18,
  "Expected home, seven supporting pages, nine product pages and 404.",
);
const titles = new Set();
let links = 0;
for (const path of htmlPages) {
  const html = await readFile(path, "utf8");
  assert.equal(
    (html.match(/<h1[\s>]/g) || []).length,
    1,
    `${path}: exactly one H1 required`,
  );
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  assert.ok(title, `${path}: title missing`);
  assert.ok(!titles.has(title), `${path}: duplicate title`);
  titles.add(title);
  assert.match(
    html,
    /<meta\s+name="description"\s+content="[^"]+"\s*\/?\s*>/,
    `${path}: description missing`,
  );
  assert.match(html, /<html lang="en">/, `${path}: language missing`);
  assert.match(html, /class="skip-link"/, `${path}: skip link missing`);
  for (const tag of html.matchAll(/<img\b[^>]*>/g)) {
    assert.match(
      tag[0],
      /\balt="[^"]*"/,
      `${path}: image alt attribute missing`,
    );
  }
  for (const match of html.matchAll(
    /\b(?:href|src)="(\/[^"#]*)(?:#[^"]*)?"/g,
  )) {
    let local = decodeURIComponent(match[1].split("?")[0]);
    if (local.endsWith("/")) local += "index.html";
    const target = resolve(output, "." + local);
    assert.ok(target.startsWith(output), `${path}: path escapes public output`);
    assert.ok(
      (await stat(target).catch(() => null))?.isFile(),
      `${path}: broken asset/link ${match[1]}`,
    );
    links++;
  }
  assert.ok(!html.includes('href="#"'), `${path}: dead anchor found`);
}
const js = paths.filter((path) => path.endsWith(".js"));
const css = paths.filter((path) => path.endsWith(".css"));
assert.ok(js.length && css.length, "Compiled JavaScript and CSS required.");
const total = (await Promise.all(paths.map((path) => stat(path)))).reduce(
  (sum, file) => sum + file.size,
  0,
);
console.log(
  `PASS: ${htmlPages.length} static pages, unique metadata, single H1s, ${links} internal assets/links, accessible image attributes.`,
);
console.log(
  `Static output: ${(total / 1024 / 1024).toFixed(2)} MB. No backend required.`,
);

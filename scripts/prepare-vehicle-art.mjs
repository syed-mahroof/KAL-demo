import sharp from "sharp";
import assert from "node:assert/strict";

// Convert generated transparent artwork to web assets without flattening alpha.
const inputs = process.argv.slice(2);
assert.ok(inputs.length && inputs.length % 2 === 0, "Supply name/path pairs.");
for (let i = 0; i < inputs.length; i += 2) {
  const [name, path] = inputs.slice(i, i + 2);
  assert.match(name, /^[a-z0-9-]+$/);
  const source = await sharp(path).metadata();
  assert.ok(source.hasAlpha, `${name}: a transparent source is required`);
  const output = `public/images/${name}.webp`;
  await sharp(path)
    .resize({
      width: 1100,
      height: 1100,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 88, alphaQuality: 100, effort: 6 })
    .toFile(output);
  const metadata = await sharp(output).metadata();
  console.log(
    JSON.stringify({
      name,
      width: metadata.width,
      height: metadata.height,
      alpha: metadata.hasAlpha,
      bytes: metadata.size,
    }),
  );
}

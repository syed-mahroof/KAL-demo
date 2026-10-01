import sharp from "sharp";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const assets = {
  "logo.png": "kal-logo",
  "logo-kerala-red.png": "kerala-emblem",
  "fav-ico.png": "favicon",
  "176743088975.jpg": "hero-neem",
  "173613817556.webp": "hero-utility",
  "173613935136.webp": "hero-cargo",
  "176742924340.jpg": "neem-g",
  "173675908929.jpg": "green-stream",
  "173616760675.png": "garbage-cart",
  "178151772691.jpg": "canopy-cart",
  "173616762180.png": "tipping-cart",
  "174568000538.jpg": "mini-cart",
  "176163096977.jpg": "ice-cream-cart",
  "174781735929.jpg": "electric-buggy",
  "176605720968.jpg": "mini-cart-plus",
  "abut-m.png": "factory",
  "about-2.png": "cargo-cutout",
  "173613804875.jpg": "managing-director",
  "174304782869.jpg": "director-finance",
  "173450156419.png": "director-industries",
  "177934017475.png": "chief-minister",
  "177933984682.jpg": "industries-minister",
  "175109406614.jpg": "gallery-1",
  "177563828324.jpg": "gallery-2",
  "175585585944.jpg": "gallery-3",
  "175109406694.jpg": "gallery-4",
  "175585585937.jpg": "gallery-5",
};
await mkdir("public/images", { recursive: true });
const manifest = JSON.parse(
  (await readFile("audit/asset-sources.json", "utf8")).replace(/^\uFEFF/, ""),
);
const output = [];
for (const [original, name] of Object.entries(assets)) {
  const source = resolve("audit/original-assets", original);
  const hero = name.startsWith("hero-");
  const logo = ["kal-logo", "kerala-emblem", "favicon"].includes(name);
  const width = hero ? 1920 : logo ? 240 : 900;
  const result = await sharp(source)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: hero ? 83 : 82 })
    .toFile(`public/images/${name}.webp`);
  if (hero) {
    await sharp(source)
      .rotate()
      .resize({ width: 960, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(`public/images/${name}-small.webp`);
    const metadata = await sharp(source).metadata();
    const cropWidth = Math.min(
      metadata.width,
      Math.round((metadata.height * 4) / 3),
    );
    const focalPoint = name === "hero-utility" ? 0.56 : 0.73;
    const left = Math.min(
      metadata.width - cropWidth,
      Math.max(0, Math.round(metadata.width * focalPoint - cropWidth / 2)),
    );
    await sharp(source)
      .extract({ left, top: 0, width: cropWidth, height: metadata.height })
      .resize({ width: 960, withoutEnlargement: true })
      .webp({ quality: 84 })
      .toFile(`public/images/${name}-mobile.webp`);
  }
  output.push({
    name,
    source: manifest.find((a) => a.original === original)?.url,
    width: result.width,
    height: result.height,
    bytes: result.size,
  });
}
await writeFile("audit/optimized-assets.json", JSON.stringify(output, null, 2));
console.log(
  `Optimized ${output.length} assets: ${Math.round(output.reduce((sum, a) => sum + a.bytes, 0) / 1024)} KB total.`,
);

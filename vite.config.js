import { defineConfig } from "vite";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";

function htmlEntries(directory = ".") {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    if (
      entry.isDirectory() &&
      !["node_modules", "dist", "public", "audit", ".git"].includes(entry.name)
    )
      return htmlEntries(path);
    return entry.isFile() && entry.name.endsWith(".html") ? [path] : [];
  });
}

export default defineConfig({
  build: { rolldownOptions: { input: htmlEntries() } },
  server: { port: 5173, strictPort: true },
  preview: { port: 4173, strictPort: true },
});

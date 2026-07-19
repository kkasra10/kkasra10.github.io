/* Builds offline.html — the whole studio in one double-clickable file.
   Run after editing any source file:  node car-studio/build-offline.mjs  */
import { readFileSync, writeFileSync } from "node:fs";

const dir = new URL(".", import.meta.url);
const read = f => readFileSync(new URL(f, dir), "utf8");

let html = read("index.html");
html = html.replace('<link rel="stylesheet" href="style.css">',
  () => "<style>\n" + read("style.css") + "\n</style>");
for (const f of ["three.min.js", "data.js", "app.js"]) {
  html = html.replace(`<script src="${f}"></script>`,
    () => "<script>\n" + read(f) + "\n</script>");
}
if (/<script src=/.test(html) || /stylesheet/.test(html)) {
  throw new Error("offline build still references external files");
}
writeFileSync(new URL("offline.html", dir), html);
console.log("built offline.html —", (html.length / 1024 / 1024).toFixed(2), "MB");

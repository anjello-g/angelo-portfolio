// Lists everything that still needs your attention before publishing.
//   npm run check:launch          → prints the checklist
//   npm run check:launch:strict   → also exits with an error (use in CI)

import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const content = readFileSync(root("src/data/content.ts"), "utf8");
// Strip HTML comments so instructions inside them aren't mistaken for real tags.
const html = readFileSync(root("index.html"), "utf8").replace(/<!--[\s\S]*?-->/g, "");

const lines = content.split("\n");
const findings = [];

const add = (ok, label, detail) => findings.push({ ok, label, detail });

// 1. Unresolved TODOs in content (only count string values, not the explanatory comments).
const todoLines = lines
  .map((text, i) => ({ text, n: i + 1 }))
  .filter(({ text }) => /["'`]TODO/.test(text));
add(todoLines.length === 0, `${todoLines.length} TODO value(s) in content.ts`, todoLines.map((l) => `  line ${l.n}: ${l.text.trim().slice(0, 90)}`));

// 2. Values still marked CONFIRM (comment markers directly above a value).
const confirmLines = lines
  .map((text, i) => ({ text, n: i + 1 }))
  .filter(({ text }) => /^\s*\/\/\s*CONFIRM(?!\s*=)/.test(text));
add(confirmLines.length === 0, `${confirmLines.length} item(s) marked CONFIRM (contact details, stats, tool tags)`, confirmLines.map((l) => `  line ${l.n}: ${l.text.trim().slice(0, 90)}`));

// 3. Case studies not yet ready.
const readyFalse = (content.match(/ready:\s*false/g) ?? []).length;
const readyTrue = (content.match(/ready:\s*true/g) ?? []).length;
add(readyFalse === 0, `Case studies: ${readyTrue} published, ${readyFalse} still hidden (ready: false)`, [
  "  Hidden case studies are not reachable on the live site; cards stay non-clickable.",
]);

// 4. Resume.
const hasResume = existsSync(root("public/Angelo_Gaspe_Resume.pdf"));
add(hasResume, hasResume ? "Resume PDF found" : "Resume PDF missing (the Download Resume button is hidden)", hasResume ? [] : ["  Add public/Angelo_Gaspe_Resume.pdf"]);

// 5. Screenshots.
const hasImages = /image:\s*["']/.test(content);
add(hasImages, hasImages ? "At least one real screenshot configured" : "No real screenshots (illustrative previews are shown)", hasImages ? [] : ["  Optional: add safe screenshots to public/projects/ and set `image` in content.ts"]);

// 6. Social preview.
const hasOgUrl = /property="og:url"/.test(html);
add(hasOgUrl, hasOgUrl ? "og:url set" : "No og:url / og:image yet (add after you know the live URL)", []);

let failed = 0;
for (const f of findings) {
  console.log(`${f.ok ? "✔" : "✖"} ${f.label}`);
  if (!f.ok) {
    failed++;
    f.detail.forEach((d) => console.log(d));
  }
}
console.log(failed === 0 ? "\nAll launch checks passed." : `\n${failed} item(s) need attention before launch.`);
if (failed && process.argv.includes("--strict")) process.exit(1);

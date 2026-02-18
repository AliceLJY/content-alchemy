/**
 * Generate baoyu-compatible CSS theme files from wechat_editor_xiaoshiai.html styles.
 * Run: bun scripts/generate-layout-themes.ts
 *
 * Reads the STYLES object from the editor HTML, converts inline styles to CSS,
 * and writes theme files to the baoyu themes directory.
 */

import * as fs from "fs";
import * as path from "path";

const EDITOR_HTML_PATH = path.resolve(
  process.env.HOME!,
  "Downloads/Gem素材/wechat_editor_xiaoshiai.html"
);
const THEMES_DIR = path.resolve(
  __dirname,
  "../dependencies/baoyu-skills/skills/baoyu-post-to-wechat/scripts/md/themes"
);

const SELECTOR_MAP: Record<string, string> = {
  container: "#output",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  p: "p",
  strong: "strong",
  em: "em",
  a: "a",
  ul: "ul",
  ol: "ol",
  li: "li",
  blockquote: "blockquote",
  code: "code",
  pre: "pre.code__pre, .hljs.code__pre",
  hr: "hr",
  img: "img",
  table: "table",
  th: "th, thead td",
  td: "td",
  tr: "tr",
};

function extractStyles(html: string): Record<string, { name: string; styles: Record<string, string> }> {
  const stylesMatch = html.match(/const STYLES\s*=\s*\{([\s\S]*?)\n\s*\};\s*\n/);
  if (!stylesMatch) throw new Error("Could not find STYLES object in HTML");

  const stylesBlock = stylesMatch[1];
  const result: Record<string, { name: string; styles: Record<string, string> }> = {};

  const stylePattern = /'([^']+)':\s*\{[^}]*name:\s*'([^']+)'[^}]*styles:\s*\{([\s\S]*?)\}\s*\}/g;
  let match;

  while ((match = stylePattern.exec(stylesBlock)) !== null) {
    const key = match[1];
    const name = match[2];
    const stylesStr = match[3];

    const styles: Record<string, string> = {};
    const propPattern = /(\w+):\s*'((?:[^'\\]|\\.)*)'/g;
    let propMatch;

    while ((propMatch = propPattern.exec(stylesStr)) !== null) {
      styles[propMatch[1]] = propMatch[2];
    }

    result[key] = { name, styles };
  }

  return result;
}

function stylesToCss(styleName: string, displayName: string, styles: Record<string, string>): string {
  const lines: string[] = [];
  lines.push(`/**`);
  lines.push(` * ${displayName} — auto-generated from wechat_editor_xiaoshiai.html`);
  lines.push(` * Theme key: ${styleName}`);
  lines.push(` */`);
  lines.push("");

  for (const [key, value] of Object.entries(styles)) {
    const selector = SELECTOR_MAP[key];
    if (!selector) continue;

    const props = value
      .split(";")
      .map((p) => p.trim())
      .filter(Boolean);

    lines.push(`${selector} {`);
    for (const prop of props) {
      lines.push(`  ${prop};`);
    }
    lines.push(`}`);
    lines.push("");
  }

  return lines.join("\n");
}

function main() {
  if (!fs.existsSync(EDITOR_HTML_PATH)) {
    console.error(`Editor HTML not found: ${EDITOR_HTML_PATH}`);
    process.exit(1);
  }

  const html = fs.readFileSync(EDITOR_HTML_PATH, "utf-8");
  const allStyles = extractStyles(html);

  console.log(`Found ${Object.keys(allStyles).length} styles in editor HTML`);

  const SKIP = new Set(["default", "grace", "simple"]);
  let created = 0;

  for (const [key, { name, styles }] of Object.entries(allStyles)) {
    if (SKIP.has(key)) {
      console.log(`  SKIP: ${key} (conflicts with built-in baoyu theme)`);
      continue;
    }

    const cssContent = stylesToCss(key, name, styles);
    const cssPath = path.join(THEMES_DIR, `${key}.css`);
    fs.writeFileSync(cssPath, cssContent, "utf-8");
    console.log(`  WRITE: ${cssPath}`);
    created++;
  }

  console.log(`\nDone! Created ${created} theme files in ${THEMES_DIR}`);

  const catalog: string[] = [];
  catalog.push("# Layout Style Catalog");
  catalog.push("");
  catalog.push("| # | Theme Key | Display Name | Mood |");
  catalog.push("|---|-----------|-------------|------|");

  let idx = 1;
  for (const [key, { name }] of Object.entries(allStyles)) {
    if (SKIP.has(key)) continue;
    catalog.push(`| ${String(idx).padStart(2, "0")} | ${key} | ${name} | |`);
    idx++;
  }

  const catalogPath = path.resolve(__dirname, "../layout-style-catalog.md");
  fs.writeFileSync(catalogPath, catalog.join("\n") + "\n", "utf-8");
  console.log(`Catalog written to ${catalogPath}`);
}

main();

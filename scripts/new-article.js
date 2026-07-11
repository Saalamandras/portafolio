#!/usr/bin/env node
/* ==========================================================================
   new-article.js — scaffolds a new multilingual article for the portfolio.

   Usage:
     node scripts/new-article.js "My Article Title" --category "NLP"
     node scripts/new-article.js "My Article Title"              # category defaults to "AI"

   What it does:
     1. Creates  articles/<slug>.html  from the template, with all
        placeholders replaced and i18n keys namespaced to the slug.
     2. Prepends a card to the article grid in  articles.html.

   The generated file has a <script> block with placeholder translations
   for EN/ES/IT/PT — fill them in before publishing.
   ========================================================================== */

const fs = require("fs");
const path = require("path");

/* ── CLI args ───────────────────────────────────────────────────────────── */
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: node scripts/new-article.js \"Article Title\" [--category \"Category\"]");
  process.exit(1);
}

const title = args[0];
const categoryIdx = args.indexOf("--category");
const category = categoryIdx !== -1 && args[categoryIdx + 1] ? args[categoryIdx + 1] : "AI";

/* ── Helpers ────────────────────────────────────────────────────────────── */
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* JS-safe key prefix: underscores instead of hyphens */
function jsKey(slug) {
  return slug.replace(/-/g, "_");
}

function today() {
  const d = new Date();
  return {
    iso: d.toISOString().slice(0, 10),                          // 2026-07-11
    human: d.toLocaleDateString("en-US", {                      // July 11, 2026
      year: "numeric", month: "long", day: "numeric"
    })
  };
}

/* ── Paths ──────────────────────────────────────────────────────────────── */
const ROOT = path.resolve(__dirname, "..");
const TEMPLATE = path.join(ROOT, "articles", "_template.html");
const ARTICLES_HTML = path.join(ROOT, "articles.html");

const slug = slugify(title);
const outFile = path.join(ROOT, "articles", slug + ".html");
const baseUrl = "https://saalamandras.github.io/portafolio";
const articleUrl = baseUrl + "/articles/" + slug + ".html";

if (fs.existsSync(outFile)) {
  console.error("File already exists: articles/" + slug + ".html");
  process.exit(1);
}

/* ── 1. Generate article HTML ───────────────────────────────────────────── */
const date = today();
let html = fs.readFileSync(TEMPLATE, "utf-8");

// Replace all placeholder tokens
const replacements = {
  "ARTICLE_TITLE_HERE": title,
  "ARTICLE_DESCRIPTION_HERE": title + " — by P. Antonio Granados",
  "ARTICLE_URL_HERE": articleUrl,
  "ARTICLE_IMAGE_URL_HERE": baseUrl + "/images/Profile_Picture_2026.png",
  "YYYY-MM-DD": date.iso,
  "Month DD, YYYY": date.human,
  "CATEGORY_HERE": category,
};

for (const [token, value] of Object.entries(replacements)) {
  html = html.split(token).join(value);
}

// Replace SLUG_ prefixed i18n keys with the JS-safe slug (underscores)
var prefix = jsKey(slug);
html = html.split("SLUG_").join(prefix + "_");

// Replace placeholder paragraph text
html = html.split("PARAGRAPH_1_EN").join("Write the English version of the first paragraph here.");
html = html.split("PARAGRAPH_1_ES").join("Escribe la versión en español del primer párrafo aquí.");
html = html.split("PARAGRAPH_1_IT").join("Scrivi la versione italiana del primo paragrafo qui.");
html = html.split("PARAGRAPH_1_PT").join("Escreva a versão em português do primeiro parágrafo aqui.");

// Replace category placeholders in i18n block
html = html.split("CATEGORY_ES").join(category);
html = html.split("CATEGORY_IT").join(category);
html = html.split("CATEGORY_PT").join(category);

// Replace title placeholders in i18n block
html = html.split("ARTICLE_TITLE_ES").join("[Título en español]");
html = html.split("ARTICLE_TITLE_IT").join("[Titolo in italiano]");
html = html.split("ARTICLE_TITLE_PT").join("[Título em português]");

fs.writeFileSync(outFile, html, "utf-8");
console.log("✓ Created: articles/" + slug + ".html");

/* ── 2. Add card to articles.html ───────────────────────────────────────── */
let articlesPage = fs.readFileSync(ARTICLES_HTML, "utf-8");

const keyPrefix = jsKey(slug);
const card = `
      <div class="section-divider" style="margin-top:32px;"><span class="section-num">&bull;</span><span class="section-label">LATEST</span><div class="rule"></div></div>

      <div class="project-grid">

        <article class="project-card" data-animate="delay-1">
          <div style="display:flex;justify-content:space-between;align-items:baseline;gap:16px;flex-wrap:wrap;">
            <h2 class="card-title" data-i18n="${keyPrefix}_card_title">${title}</h2>
            <span class="tech-line">${category} · <time datetime="${date.iso}">${date.human}</time></span>
          </div>
          <p class="project-description body-text" data-i18n="${keyPrefix}_card_desc">Read this article about ${title.toLowerCase()}.</p>
          <a href="articles/${slug}.html" class="project-link" data-i18n="read_article">Read Article →</a>
        </article>

      </div>`;

// Remove the "no entries" empty state if present
articlesPage = articlesPage.replace(
  /\s*<!--\s*ARTICLE LIST[\s\S]*?(?=\s*<\/section>)/,
  ""
);

// Insert the card after the section intro paragraph
const insertMarker = `</p>`;
const introEnd = articlesPage.indexOf(insertMarker, articlesPage.indexOf("articles_intro"));
if (introEnd !== -1) {
  const insertPos = introEnd + insertMarker.length;
  articlesPage = articlesPage.slice(0, insertPos) + "\n" + card + articlesPage.slice(insertPos);
}

// Add i18n keys for the card (read_article) — inject as inline script before </body>
if (articlesPage.indexOf("i18nRegister") === -1) {
  const i18nBlock = `
  <script>
    window.i18nRegister({
      en: { read_article: "Read Article →" },
      es: { read_article: "Leer Artículo →" },
      it: { read_article: "Leggi Articolo →" },
      pt: { read_article: "Ler Artigo →" }
    });
    window.i18nApply();
  </script>
`;
  articlesPage = articlesPage.replace("</body>", i18nBlock + "</body>");
}

fs.writeFileSync(ARTICLES_HTML, articlesPage, "utf-8");
console.log("✓ Added card to articles.html");
console.log("\nNext steps:");
console.log("  1. Open articles/" + slug + ".html");
console.log("  2. Fill in the translations in the <script> block at the bottom");
console.log("  3. Add/remove <p data-i18n=\"" + slug + "_p2\"> etc. for more paragraphs");
console.log("  4. Commit and push");

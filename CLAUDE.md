# Portfolio — P. Antonio Granados

Personal portfolio site for an AI & NLP Engineer / Computational Linguist based in Venice, Italy.  
Deployed on **GitHub Pages** at `https://saalamandras.github.io/portafolio/`.

## Stack

- Pure HTML / CSS / vanilla JS — no build step, no framework.
- Fonts: **Press Start 2P** (pixel headings) + **JetBrains Mono** (body), loaded from Google Fonts.
- Icons: Font Awesome 6.5 via CDN (contact page only).
- Contact form: Formspree (`https://formspree.io/f/mdarvqnv`).

## Repo

- Remote: `https://github.com/Saalamandras/portafolio.git`
- Single branch: `main`

## File Map

```
index.html          Home — hero, about, skills grid, CTA
projects.html       Projects listing
articles.html       Articles listing (currently empty)
articles/_template.html   Boilerplate for new article posts
contact.html        Contact form + social links
css/style.css       All styles (~870 lines), CSS custom properties for theming
js/
  i18n.js           Client-side i18n switcher (EN/ES/IT/PT), stores choice in localStorage
  theme.js          Dark/light toggle, stores choice in localStorage
  animations.js     Scroll-triggered fade-up via IntersectionObserver
  typewriter.js     Terminal typing effect on [data-typewriter] elements
  contact-form.js   Client-side validation + fetch submit to Formspree
  share.js          Social share bar for article pages (X, LinkedIn, Reddit, WhatsApp, Telegram, Facebook)
images/
  Profile_Picture_2026.png
```

## Design System

- **Theme:** dark by default (`body.light-mode` toggles light). CSS variables in `:root` / `body.light-mode`.
- **Accent colour:** amber/gold (`--accent: rgba(232,163,61,1)`).
- **Layout class:** `blueprint-bg` on `<body>` (grid-line background).
- **Section pattern:** numbered dividers (`<div class="section-divider">` with `.section-num` / `.section-label`).
- **Animations:** elements with `data-animate` start invisible, get `.visible` on scroll.
- **Buttons:** `.btn-primary.btn-pressable` for CTAs; `.cta-button` base.

## i18n

All translatable UI strings use `data-i18n="key"` attributes. The translation dictionary lives inline in `js/i18n.js`. Four languages: EN, ES, IT, PT. Article body copy is intentionally *not* translated via this system.

After applying translations, `i18n.js` dispatches a custom `i18n:applied` event so `typewriter.js` can re-run.

## Conventions

- No bundler or package manager — edit files directly.
- Header/nav/footer markup is duplicated across pages (no templating engine).
- Article workflow: copy `articles/_template.html`, fill placeholders (`ARTICLE_TITLE_HERE`, `ARTICLE_URL_HERE`, etc.), add a card linking to it from `articles.html`.
- `share.js` auto-fills social share links at runtime from `window.location.href` and `document.title`.

## TODOs (from source comments)

- Replace avatar placeholder comment (already has actual image).
- Articles section is empty — no posts published yet.

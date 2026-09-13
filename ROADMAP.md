# Portfolio Chatbot — Roadmap

Adding an AI chatbot to the portfolio site that answers questions about Antonio's
professional background, using the resume as context.

## Architecture (decided)

- **Frontend:** stays on GitHub Pages (`https://saalamandras.github.io/portafolio/`),
  plain HTML/CSS/vanilla JS — no framework, no build step.
- **Backend:** a single Vercel serverless function (`api/chat.js`) in this same repo,
  connected to Vercel alongside GitHub Pages. Holds the API key, calls the LLM.
- **LLM:** Google Gemini (`gemini-1.5-flash`), free tier.
- **Database:** none — chat history kept in a JS array in the browser (add later if wanted).
- **Cross-origin:** page is on `github.io`, function on `vercel.app`, so the function
  sends CORS headers allowing the Pages origin.
- **Security model:** API key only in Vercel env vars (never in code); no tools/actions;
  caps in place — rate limit, input length limit, `maxOutputTokens`.

## Key URLs

- Repo: `https://github.com/Saalamandras/portafolio.git` (branch: `main`)
- Stable API endpoint: `https://portafolio-nine-bice-10.vercel.app/api/chat`
- Live site: `https://saalamandras.github.io/portafolio/`

## Milestones

### ✅ Milestone 1 — Working endpoint (echo)
- Created `api/chat.js` (correct `api/` folder structure for Vercel).
- Handler: CORS headers, OPTIONS preflight, POST-only, body validation, JSON echo.
- Deployed to Vercel; disabled Vercel Authentication (Deployment Protection) so the
  endpoint is publicly reachable.
- Tested — returns `{ "reply": "you said: hello" }`. Plumbing confirmed.

### ✅ Milestone 2 — Real Gemini call *(code done — needs env var + redeploy)*
- Handler is now `async`; echo replaced with a `fetch()` to Gemini
  (`v1beta/models/gemini-1.5-flash:generateContent`).
- Reads reply from `data.candidates[0].content.parts[0].text`, returns `{ reply }`.
- Gemini call wrapped in try/catch → clean 5xx on failure; handles non-OK responses
  and empty/safety-blocked candidates.

### ✅ Milestone 3 — Resume context + hardening *(code done)*
- System prompt (`systemInstruction`) grounds answers in Antonio's CV (synthesised
  from all four CV PDFs): identity, skills, projects, experience, languages, plus
  guardrails (stay on-topic, no invented facts, answer in the visitor's language).
- Security caps: input length limit (2000 chars), `maxOutputTokens` (400), basic
  per-IP rate limiting (15/min — in-memory, best-effort).

### ✅ Milestone 4 — Chat widget *(code done)*
- `js/chatbot.js` — self-contained floating widget. Injects its own styles (using the
  site's CSS variables, so it themes with dark/light automatically) and DOM.
- `fetch()`es the stable Vercel endpoint; keeps history in a JS array and sends prior
  turns for multi-turn context.
- UI labels follow the site language (EN/ES/IT/PT) and update on `i18n:applied`.
- Wired into `index.html` (`<script src="js/chatbot.js">` before `</body>`).
- Verified in a headless browser with a mocked endpoint: launcher → open → send →
  reply flow works, no console errors.

## ⚠️ Remaining — Antonio's steps to go live
1. **Set `GEMINI_API_KEY` in Vercel** (Project → Settings → Environment Variables),
   then **redeploy** so the function picks it up. Until this is done the endpoint
   returns a clean "server not configured" 500.
2. Get a Gemini API key at `https://aistudio.google.com/app/apikey` if not already done.
3. Push the updated files to `main`; GitHub Pages serves the new `index.html` +
   `js/chatbot.js`, and Vercel redeploys `api/chat.js`.

## Loose ends
- [ ] Set `GEMINI_API_KEY` in Vercel env vars (see above).
- [ ] Decide on the 4 untracked CV PDFs (gitignore or leave untracked).
- [ ] Add the widget to the other pages (`projects.html`, `articles.html`,
      `contact.html`) — same one-line `<script>` include.
- [ ] Later: migrate frontend fully to Vercel (optional; keeping Pages URL stable for now).

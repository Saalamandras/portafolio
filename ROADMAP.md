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
  planned caps — rate limit, input length limit, `maxOutputTokens`.

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

### ⬜ Milestone 2 — Real Gemini call
- Add `GEMINI_API_KEY` env var in Vercel, then redeploy.
- Make handler `async`; replace echo with a `fetch()` to Gemini.
- Read reply from `data.candidates[0].content.parts[0].text`, return as `{ reply }`.
- Wrap the Gemini call in try/catch → clean 500 on failure.

### ⬜ Milestone 3 — Resume context + hardening
- Add a system prompt with resume/context so answers are grounded and on-topic.
- Add security caps: input length limit, `maxOutputTokens`, basic rate limiting.

### ⬜ Milestone 4 — Chat widget
- Build the chat UI in HTML/CSS + vanilla JS.
- `fetch()` the stable Vercel endpoint; keep history in a JS array.
- Drop the widget into `index.html`.

## Loose ends
- [ ] Set `GEMINI_API_KEY` in Vercel env vars.
- [ ] Decide on the 4 untracked CV PDFs (gitignore or leave untracked).
- [ ] Later: migrate frontend fully to Vercel (optional; keeping Pages URL stable for now).

/* ==========================================================================
   chatbot.js — floating portfolio assistant widget
   Self-contained: injects its own styles (using the site's CSS variables so it
   themes with dark/light automatically) and its own DOM. Include on any page
   with a single <script src="js/chatbot.js"></script> before </body>.

   - Talks to the Vercel serverless endpoint (which holds the Gemini key).
   - Keeps conversation history in a JS array (no storage, resets on reload).
   - Reads the site language ("site-lang") for its UI labels and updates live
     on the i18n:applied event. The assistant itself replies in whatever
     language the visitor writes in.
   ========================================================================== */
(function () {
  "use strict";

  var ENDPOINT = "https://portafolio-nine-bice-10.vercel.app/api/chat";
  var MAX_INPUT = 2000; // keep in sync with the backend guard

  /* ---- UI strings (EN / ES / IT / PT) ---------------------------------- */
  var UI = {
    en: {
      launch: "Ask about Antonio",
      title: "Ask about Antonio",
      subtitle: "AI assistant · answers from my CV",
      placeholder: "Ask about my experience, skills, projects…",
      send: "Send",
      close: "Close chat",
      greeting: "Hi! I'm Antonio's portfolio assistant. Ask me anything about his experience, skills, or projects.",
      error: "Sorry — something went wrong. Please try again in a moment.",
      thinking: "Thinking…"
    },
    es: {
      launch: "Pregunta sobre Antonio",
      title: "Pregunta sobre Antonio",
      subtitle: "Asistente IA · responde desde mi CV",
      placeholder: "Pregunta por mi experiencia, aptitudes, proyectos…",
      send: "Enviar",
      close: "Cerrar chat",
      greeting: "¡Hola! Soy el asistente del portafolio de Antonio. Pregúntame lo que quieras sobre su experiencia, aptitudes o proyectos.",
      error: "Lo siento — algo salió mal. Inténtalo de nuevo en un momento.",
      thinking: "Pensando…"
    },
    it: {
      launch: "Chiedi su Antonio",
      title: "Chiedi su Antonio",
      subtitle: "Assistente IA · risponde dal mio CV",
      placeholder: "Chiedi della mia esperienza, competenze, progetti…",
      send: "Invia",
      close: "Chiudi chat",
      greeting: "Ciao! Sono l'assistente del portfolio di Antonio. Chiedimi qualsiasi cosa sulla sua esperienza, competenze o progetti.",
      error: "Spiacente — qualcosa è andato storto. Riprova tra un momento.",
      thinking: "Sto pensando…"
    },
    pt: {
      launch: "Pergunte sobre o Antonio",
      title: "Pergunte sobre o Antonio",
      subtitle: "Assistente IA · responde a partir do meu CV",
      placeholder: "Pergunte sobre a minha experiência, competências, projetos…",
      send: "Enviar",
      close: "Fechar chat",
      greeting: "Olá! Sou o assistente do portfólio do Antonio. Pergunte-me o que quiser sobre a sua experiência, competências ou projetos.",
      error: "Desculpe — algo correu mal. Tente novamente daqui a pouco.",
      thinking: "A pensar…"
    }
  };

  function getLang() {
    var lang;
    try { lang = localStorage.getItem("site-lang"); } catch (e) { lang = null; }
    return UI[lang] ? lang : "en";
  }
  function t() { return UI[getLang()]; }

  /* ---- Styles ---------------------------------------------------------- */
  function injectStyles() {
    if (document.getElementById("chatbot-styles")) return;
    var css = "" +
      "#chatbot-launcher{position:fixed;bottom:24px;right:24px;z-index:9998;display:inline-flex;align-items:center;gap:10px;" +
        "padding:12px 18px;border:1px solid var(--border-accent,rgba(232,163,61,.3));border-radius:999px;cursor:pointer;" +
        "background:var(--surface,#141821);color:var(--text-headline,#f1f3f7);font-family:'JetBrains Mono',monospace;" +
        "font-size:13px;font-weight:600;letter-spacing:.02em;box-shadow:0 6px 24px rgba(0,0,0,.35);transition:transform .15s ease,border-color .2s ease;}" +
      "#chatbot-launcher:hover{transform:translateY(-2px);border-color:var(--accent,#e8a33d);}" +
      "#chatbot-launcher .cb-dot{width:9px;height:9px;border-radius:50%;background:var(--accent,#e8a33d);box-shadow:0 0 8px var(--accent,#e8a33d);}" +
      "#chatbot-launcher[hidden]{display:none;}" +
      "#chatbot-panel{position:fixed;bottom:24px;right:24px;z-index:9999;width:min(380px,calc(100vw - 32px));height:min(560px,calc(100vh - 48px));" +
        "display:flex;flex-direction:column;background:var(--bg,#0b0d12);border:1px solid var(--border-accent,rgba(232,163,61,.3));" +
        "border-radius:16px;overflow:hidden;box-shadow:0 12px 48px rgba(0,0,0,.5);font-family:'JetBrains Mono',monospace;" +
        "opacity:0;transform:translateY(12px);transition:opacity .2s ease,transform .2s ease;}" +
      "#chatbot-panel.cb-open{opacity:1;transform:translateY(0);}" +
      "#chatbot-panel[hidden]{display:none;}" +
      ".cb-header{display:flex;align-items:center;gap:12px;padding:16px 18px;border-bottom:1px solid var(--border-faint,rgba(232,163,61,.25));background:var(--surface,#141821);}" +
      ".cb-header .cb-avatar{width:34px;height:34px;border-radius:50%;flex:0 0 auto;display:flex;align-items:center;justify-content:center;" +
        "background:var(--surface-alt,#1c2029);color:var(--accent,#e8a33d);border:1px solid var(--border-accent,rgba(232,163,61,.3));font-weight:700;font-size:15px;}" +
      ".cb-header .cb-titles{flex:1;min-width:0;}" +
      ".cb-header .cb-title{color:var(--text-headline,#f1f3f7);font-size:13px;font-weight:700;margin:0;line-height:1.3;}" +
      ".cb-header .cb-subtitle{color:var(--text-muted,#7d8492);font-size:10.5px;margin:2px 0 0;letter-spacing:.02em;}" +
      ".cb-close{background:none;border:none;color:var(--text-muted,#7d8492);font-size:20px;line-height:1;cursor:pointer;padding:4px 6px;border-radius:6px;transition:color .2s ease,background .2s ease;}" +
      ".cb-close:hover{color:var(--text-headline,#f1f3f7);background:var(--surface-alt,#1c2029);}" +
      ".cb-log{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;scroll-behavior:smooth;}" +
      ".cb-msg{max-width:85%;padding:10px 13px;border-radius:12px;font-size:12.5px;line-height:1.55;white-space:pre-wrap;word-wrap:break-word;}" +
      ".cb-msg.bot{align-self:flex-start;background:var(--surface,#141821);color:var(--text-body,#a7aebb);border:1px solid var(--border-faint,rgba(232,163,61,.25));border-bottom-left-radius:4px;}" +
      ".cb-msg.user{align-self:flex-end;background:var(--accent,#e8a33d);color:#0b0d12;font-weight:500;border-bottom-right-radius:4px;}" +
      ".cb-typing{align-self:flex-start;display:inline-flex;gap:5px;padding:12px 14px;background:var(--surface,#141821);border:1px solid var(--border-faint,rgba(232,163,61,.25));border-radius:12px;border-bottom-left-radius:4px;}" +
      ".cb-typing span{width:6px;height:6px;border-radius:50%;background:var(--text-muted,#7d8492);animation:cb-bounce 1.2s infinite ease-in-out;}" +
      ".cb-typing span:nth-child(2){animation-delay:.15s;}.cb-typing span:nth-child(3){animation-delay:.3s;}" +
      "@keyframes cb-bounce{0%,60%,100%{transform:translateY(0);opacity:.5;}30%{transform:translateY(-5px);opacity:1;}}" +
      ".cb-form{display:flex;gap:8px;padding:12px;border-top:1px solid var(--border-faint,rgba(232,163,61,.25));background:var(--surface,#141821);}" +
      ".cb-input{flex:1;resize:none;max-height:96px;padding:10px 12px;border-radius:10px;border:1px solid var(--border-faint,rgba(232,163,61,.25));" +
        "background:var(--bg,#0b0d12);color:var(--text-headline,#f1f3f7);font-family:'JetBrains Mono',monospace;font-size:12.5px;line-height:1.5;outline:none;transition:border-color .2s ease;}" +
      ".cb-input:focus{border-color:var(--accent,#e8a33d);}" +
      ".cb-input::placeholder{color:var(--text-muted,#7d8492);}" +
      ".cb-send{flex:0 0 auto;align-self:stretch;padding:0 16px;border:none;border-radius:10px;cursor:pointer;background:var(--accent,#e8a33d);color:#0b0d12;" +
        "font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;letter-spacing:.03em;transition:opacity .2s ease,transform .1s ease;}" +
      ".cb-send:hover{transform:translateY(-1px);}.cb-send:disabled{opacity:.5;cursor:not-allowed;transform:none;}" +
      ".cb-log::-webkit-scrollbar{width:8px;}.cb-log::-webkit-scrollbar-thumb{background:var(--surface-alt,#1c2029);border-radius:8px;}" +
      "@media (prefers-reduced-motion: reduce){#chatbot-launcher,#chatbot-panel,.cb-send,.cb-typing span{transition:none;animation:none;}}" +
      "@media (max-width:480px){#chatbot-panel{bottom:0;right:0;width:100vw;height:100vh;border-radius:0;}#chatbot-launcher{bottom:16px;right:16px;}}";
    var style = document.createElement("style");
    style.id = "chatbot-styles";
    style.textContent = css;
    document.head.appendChild(style);
  }

  /* ---- State ----------------------------------------------------------- */
  var history = [];   // [{ role: 'user'|'assistant', text }]
  var busy = false;
  var greeted = false;
  var els = {};

  /* ---- DOM build ------------------------------------------------------- */
  function build() {
    var launcher = document.createElement("button");
    launcher.id = "chatbot-launcher";
    launcher.type = "button";
    launcher.setAttribute("aria-label", t().launch);
    launcher.innerHTML = '<span class="cb-dot"></span><span class="cb-launch-label"></span>';

    var panel = document.createElement("div");
    panel.id = "chatbot-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", t().title);
    panel.hidden = true;
    panel.innerHTML =
      '<div class="cb-header">' +
        '<div class="cb-avatar" aria-hidden="true">A</div>' +
        '<div class="cb-titles">' +
          '<p class="cb-title"></p>' +
          '<p class="cb-subtitle"></p>' +
        '</div>' +
        '<button class="cb-close" type="button" aria-label="">&times;</button>' +
      '</div>' +
      '<div class="cb-log" role="log" aria-live="polite" aria-atomic="false"></div>' +
      '<form class="cb-form">' +
        '<textarea class="cb-input" rows="1" maxlength="' + MAX_INPUT + '"></textarea>' +
        '<button class="cb-send" type="submit"></button>' +
      '</form>';

    document.body.appendChild(launcher);
    document.body.appendChild(panel);

    els = {
      launcher: launcher,
      launchLabel: launcher.querySelector(".cb-launch-label"),
      panel: panel,
      title: panel.querySelector(".cb-title"),
      subtitle: panel.querySelector(".cb-subtitle"),
      close: panel.querySelector(".cb-close"),
      log: panel.querySelector(".cb-log"),
      form: panel.querySelector(".cb-form"),
      input: panel.querySelector(".cb-input"),
      send: panel.querySelector(".cb-send")
    };

    applyLabels();

    launcher.addEventListener("click", open);
    els.close.addEventListener("click", closePanel);
    els.form.addEventListener("submit", onSubmit);

    // Enter sends, Shift+Enter newline. Auto-grow the textarea.
    els.input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        els.form.requestSubmit ? els.form.requestSubmit() : onSubmit(e);
      }
    });
    els.input.addEventListener("input", function () {
      els.input.style.height = "auto";
      els.input.style.height = Math.min(els.input.scrollHeight, 96) + "px";
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !els.panel.hidden) closePanel();
    });

    // Re-label when the site language changes.
    document.addEventListener("i18n:applied", applyLabels);
  }

  function applyLabels() {
    var s = t();
    els.launchLabel.textContent = s.launch;
    els.launcher.setAttribute("aria-label", s.launch);
    els.title.textContent = s.title;
    els.subtitle.textContent = s.subtitle;
    els.close.setAttribute("aria-label", s.close);
    els.input.setAttribute("placeholder", s.placeholder);
    els.send.textContent = s.send;
    els.panel.setAttribute("aria-label", s.title);
  }

  /* ---- Rendering ------------------------------------------------------- */
  function addMessage(role, text) {
    var div = document.createElement("div");
    div.className = "cb-msg " + (role === "user" ? "user" : "bot");
    div.textContent = text;
    els.log.appendChild(div);
    els.log.scrollTop = els.log.scrollHeight;
    return div;
  }

  function showTyping() {
    var wrap = document.createElement("div");
    wrap.className = "cb-typing";
    wrap.setAttribute("aria-label", t().thinking);
    wrap.innerHTML = "<span></span><span></span><span></span>";
    els.log.appendChild(wrap);
    els.log.scrollTop = els.log.scrollHeight;
    return wrap;
  }

  /* ---- Behaviour ------------------------------------------------------- */
  function open() {
    els.launcher.hidden = true;
    els.panel.hidden = false;
    // Force reflow so the transition plays.
    void els.panel.offsetWidth;
    els.panel.classList.add("cb-open");
    if (!greeted) {
      addMessage("bot", t().greeting);
      greeted = true;
    }
    setTimeout(function () { els.input.focus(); }, 50);
  }

  function closePanel() {
    els.panel.classList.remove("cb-open");
    setTimeout(function () {
      els.panel.hidden = true;
      els.launcher.hidden = false;
    }, 200);
  }

  function setBusy(state) {
    busy = state;
    els.send.disabled = state;
    els.input.disabled = state;
  }

  function onSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (busy) return;

    var message = els.input.value.trim();
    if (!message) return;

    addMessage("user", message);
    history.push({ role: "user", text: message });

    els.input.value = "";
    els.input.style.height = "auto";
    setBusy(true);

    var typing = showTyping();

    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Send prior turns (excluding the one we just pushed) for context.
      body: JSON.stringify({ message: message, history: history.slice(0, -1) })
    })
      .then(function (res) {
        return res.json().then(function (data) {
          return { ok: res.ok, data: data };
        });
      })
      .then(function (result) {
        typing.remove();
        if (result.ok && result.data && result.data.reply) {
          addMessage("bot", result.data.reply);
          history.push({ role: "assistant", text: result.data.reply });
        } else {
          var msg = (result.data && result.data.error) ? result.data.error : t().error;
          addMessage("bot", msg);
        }
      })
      .catch(function () {
        typing.remove();
        addMessage("bot", t().error);
      })
      .finally(function () {
        setBusy(false);
        setTimeout(function () { els.input.focus(); }, 30);
      });
  }

  /* ---- Init ------------------------------------------------------------ */
  function init() {
    injectStyles();
    build();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

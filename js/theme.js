/* ==========================================================================
   theme.js — dark / light mode toggle
   Include on every page just like i18n.js.
   Persists the user's choice in localStorage under "site-theme".
   ========================================================================== */
(function () {
  "use strict";

  var STORAGE_KEY = "site-theme";
  var LIGHT_CLASS  = "light-mode";

  /* Read saved preference, defaulting to dark */
  function getSavedTheme() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function saveTheme(theme) {
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
  }

  /* Apply or remove the light-mode class and update the button label */
  function applyTheme(theme) {
    if (theme === "light") {
      document.body.classList.add(LIGHT_CLASS);
    } else {
      document.body.classList.remove(LIGHT_CLASS);
    }

    /* Update every toggle button on the page (there should only be one,
       but this handles edge cases cleanly) */
    document.querySelectorAll(".theme-toggle").forEach(function (btn) {
      btn.textContent = theme === "light" ? "🌙" : "☀️";
      btn.setAttribute("aria-label", theme === "light" ? "Switch to dark mode" : "Switch to light mode");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    /* On load: apply whatever was saved, or default to dark */
    var saved = getSavedTheme() || "dark";
    applyTheme(saved);

    /* Wire up every toggle button */
    document.querySelectorAll(".theme-toggle").forEach(function (btn) {
      btn.addEventListener("click", function () {
        /* Read current state from the body class and flip it */
        var next = document.body.classList.contains(LIGHT_CLASS) ? "dark" : "light";
        saveTheme(next);
        applyTheme(next);
      });
    });
  });
})();

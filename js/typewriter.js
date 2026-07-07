/* ==========================================================================
   typewriter.js — terminal-style typing effect for the hero headline
   Only runs on pages that have an element with [data-typewriter].
   Works alongside i18n.js: if the user switches language, the effect
   re-runs with the new translated text.
   ========================================================================== */
(function () {
  "use strict";

  /* How fast each character is typed, in milliseconds.
     Lower = faster. 75ms feels like a snappy terminal. */
  var TYPING_SPEED = 75;

  /* Pause (ms) before typing starts — lets the page settle first */
  var START_DELAY = 400;

  function typeWriter(el, text, callback) {
    /* Clear the element and start typing character by character */
    el.textContent = "";
    el.classList.add("typing"); /* shows the blinking cursor via CSS */

    var i = 0;

    function typeNext() {
      if (i < text.length) {
        /* Append one character at a time */
        el.textContent += text.charAt(i);
        i++;
        setTimeout(typeNext, TYPING_SPEED);
      } else {
        /* Typing finished — swap the blinking cursor for a static one */
        el.classList.remove("typing");
        el.classList.add("typed");
        if (typeof callback === "function") callback();
      }
    }

    setTimeout(typeNext, START_DELAY);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var el = document.querySelector("[data-typewriter]");
    if (!el) return; /* not on this page — do nothing */

    /* Store the original text so we can re-use it after a language switch */
    var originalText = el.textContent.trim();
    typeWriter(el, originalText);

    /* Re-run the effect when i18n.js swaps the language.
       We listen for a custom event that i18n.js fires after updating the DOM.
       If the text hasn't actually changed, we skip the re-run. */
    document.addEventListener("i18n:applied", function () {
      var newText = el.textContent.trim();
      if (newText && newText !== originalText) {
        originalText = newText;
        typeWriter(el, originalText);
      }
    });
  });
})();

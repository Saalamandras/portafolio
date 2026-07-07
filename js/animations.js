/* ==========================================================================
   animations.js — scroll-triggered fade-up animations
   Uses IntersectionObserver: a browser API that fires a callback whenever
   a watched element enters or leaves the viewport. No libraries needed.

   HOW IT WORKS:
   1. On load, every element with [data-animate] starts invisible (via CSS).
   2. The observer watches all of them.
   3. When one scrolls into view, the observer adds the class "visible".
   4. The CSS transition on "visible" plays the fade-up effect.
   ========================================================================== */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {

    /* Grab every element that should animate */
    var targets = document.querySelectorAll("[data-animate]");

    /* If the browser doesn't support IntersectionObserver (very old browsers),
       just make everything visible immediately — no broken layout */
    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("visible"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            /* Element has entered the viewport — trigger the animation */
            entry.target.classList.add("visible");

            /* Stop watching once it has animated — no need to re-trigger */
            observer.unobserve(entry.target);
          }
        });
      },
      {
        /* threshold: 0.15 means the callback fires when 15% of the element
           is visible. Lower = triggers earlier, higher = triggers later. */
        threshold: 0.15
      }
    );

    /* Register every target with the observer */
    targets.forEach(function (el) { observer.observe(el); });
  });
})();

/* ==========================================================================
   share.js — powers the share-bar on article pages.
   Reads the real page URL + title at runtime (so you never have to hand-edit
   ARTICLE_URL_HERE/ARTICLE_TITLE_HERE placeholders again once they're
   replaced per-article), fills every fallback link, and wires the native
   Web Share API button with a "copy link" fallback for browsers that
   don't support it.
   ========================================================================== */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var bar = document.querySelector(".share-bar");
    if (!bar) return;

    var url = window.location.href;
    var title = document.title.replace(/\s*\|\s*P\. Antonio Granados\s*$/, "");

    // Fill fallback links from data-share-url/title if present (already-baked
    // placeholders), else fall back to the live page values.
    var dataUrl = bar.getAttribute("data-share-url");
    var dataTitle = bar.getAttribute("data-share-title");
    if (dataUrl && !/ARTICLE_URL_HERE/.test(dataUrl)) url = dataUrl;
    if (dataTitle && !/ARTICLE_TITLE_HERE/.test(dataTitle)) title = dataTitle;

    var encodedUrl = encodeURIComponent(url);
    var encodedTitle = encodeURIComponent(title);

    var linkMap = {
      "share-x": "https://twitter.com/intent/tweet?text=" + encodedTitle + "&url=" + encodedUrl,
      "share-linkedin": "https://www.linkedin.com/sharing/share-offsite/?url=" + encodedUrl,
      "share-reddit": "https://www.reddit.com/submit?url=" + encodedUrl + "&title=" + encodedTitle,
      "share-whatsapp": "https://wa.me/?text=" + encodedTitle + "%20" + encodedUrl,
      "share-telegram": "https://t.me/share/url?url=" + encodedUrl + "&text=" + encodedTitle,
      "share-facebook": "https://www.facebook.com/sharer/sharer.php?u=" + encodedUrl
    };

    Object.keys(linkMap).forEach(function (cls) {
      var el = bar.querySelector("." + cls);
      if (el) el.setAttribute("href", linkMap[cls]);
    });

    var nativeBtn = document.getElementById("native-share");
    if (!nativeBtn) return;

    if (navigator.share) {
      nativeBtn.addEventListener("click", function () {
        navigator.share({ title: title, url: url }).catch(function () {});
      });
    } else {
      // Fallback: copy link to clipboard, flash a confirmation in the button.
      var label = nativeBtn.querySelector("span");
      var defaultText = label ? label.textContent : "Share";
      nativeBtn.addEventListener("click", function () {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(url).then(function () {
            if (label) {
              label.textContent = "Link copied!";
              setTimeout(function () { label.textContent = defaultText; }, 1800);
            }
          });
        }
      });
    }
  });
})();

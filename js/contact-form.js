/* ==========================================================================
   contact-form.js — client-side validation + submit feedback.
   No backend is wired yet (see the TODO in contact.html for Formspree /
   Web3Forms setup). Until then this validates fields and shows an honest
   status message instead of silently doing nothing. Once you set a real
   action="" URL, it will submit via fetch and show success/error instead.
   ========================================================================== */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("contact-form");
    if (!form) return;

    var status = document.createElement("p");
    status.className = "form-status";
    status.setAttribute("role", "status");
    form.parentNode.insertBefore(status, form);

    function showStatus(kind, message) {
      status.textContent = message;
      status.className = "form-status is-visible is-" + kind;
    }

    function setError(group, message) {
      group.classList.add("has-error");
      var err = group.querySelector(".field-error");
      if (!err) {
        err = document.createElement("span");
        err.className = "field-error";
        group.appendChild(err);
      }
      err.textContent = message;
    }

    function clearError(group) {
      group.classList.remove("has-error");
    }

    function validate() {
      var valid = true;
      var firstInvalid = null;

      form.querySelectorAll(".form-group").forEach(function (group) {
        var field = group.querySelector("input, textarea");
        if (!field) return;
        clearError(group);

        if (field.hasAttribute("required") && !field.value.trim()) {
          setError(group, "This field is required.");
          valid = false;
          firstInvalid = firstInvalid || field;
          return;
        }
        if (field.type === "email" && field.value.trim()) {
          var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(field.value.trim())) {
            setError(group, "Enter a valid email address.");
            valid = false;
            firstInvalid = firstInvalid || field;
          }
        }
      });

      if (firstInvalid) firstInvalid.focus();
      return valid;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.className = "form-status";

      if (!validate()) {
        showStatus("error", "Please fix the highlighted fields and try again.");
        return;
      }

      var action = form.getAttribute("action") || "";
      var isConfigured = action && action !== "#";

      if (!isConfigured) {
        showStatus(
          "info",
          "This form isn't connected to a backend yet — add a Formspree or Web3Forms endpoint (see the TODO in this page's source) to actually receive messages."
        );
        return;
      }

      var submitBtn = form.querySelector(".submit-button");
      var defaultLabel = submitBtn ? submitBtn.textContent : "";
      if (submitBtn) { submitBtn.textContent = "Sending…"; submitBtn.disabled = true; }

      fetch(action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (res.ok) {
            showStatus("success", "Message sent — thanks for reaching out. I'll reply soon.");
            form.reset();
          } else {
            showStatus("error", "Something went wrong sending your message. Try again or email me directly.");
          }
        })
        .catch(function () {
          showStatus("error", "Something went wrong sending your message. Try again or email me directly.");
        })
        .finally(function () {
          if (submitBtn) { submitBtn.textContent = defaultLabel; submitBtn.disabled = false; }
        });
    });
  });
})();

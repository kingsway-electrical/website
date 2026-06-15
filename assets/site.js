/* Site-wide behaviour shared across pages.
   Floating call button: visible by default (so it still works without JS),
   hidden while the visitor is at the very top, revealed once they scroll. */
(function () {
  "use strict";
  var fab = document.querySelector(".call-fab");
  if (!fab) return;

  function update() {
    if (window.pageYOffset > 300) fab.classList.remove("hide");
    else fab.classList.add("hide");
  }

  update();
  window.addEventListener("scroll", update, { passive: true });
})();

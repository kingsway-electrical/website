/* Kingsway Electrical gallery + standouts renderer with a shared lightbox.
   Reads gallery.json. On the homepage it renders the auto-scrolling #standouts
   marquee; on a gallery page (body[data-section]) the #gallery category grids. */
(function () {
  "use strict";

  var SECTION = document.body.dataset.section;
  var ORDER = {
    domestic: ["interior-lighting", "outside-lighting", "ev-chargers", "fuseboard-and-misc", "nice-faceplates"],
    commercial: ["interior-lighting", "exterior-lighting", "power", "fuseboards"]
  };
  var NAMES = {
    "interior-lighting": "Interior Lighting",
    "exterior-lighting": "Exterior Lighting",
    "outside-lighting": "Outdoor Lighting",
    "power": "Power & Containment",
    "fuseboards": "Distribution Boards",
    "ev-chargers": "EV Chargers",
    "fuseboard-and-misc": "Consumer Units & More",
    "nice-faceplates": "Sockets & Faceplates"
  };

  function titleize(s) {
    return s.replace(/-/g, " ").replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }
  function label(cat) { return NAMES[cat] || titleize(cat); }

  var flat = []; // ordered list of every distinct photo, for lightbox navigation

  fetch("gallery.json")
    .then(function (r) { if (!r.ok) throw new Error("manifest missing"); return r.json(); })
    .then(function (data) {
      var standoutsRoot = document.getElementById("standouts");
      var galleryRoot = document.getElementById("gallery");
      if (standoutsRoot) renderStandouts(standoutsRoot, data.standouts || []);
      if (galleryRoot && SECTION) renderGallery(galleryRoot, data[SECTION] || {});
    })
    .catch(function () {
      var g = document.getElementById("gallery");
      if (g) g.innerHTML = '<p class="gallery-empty">Gallery coming soon.</p>';
      var s = document.getElementById("standouts");
      if (s) s.style.display = "none";
    });

  // Build a clickable photo button. idx is the lightbox index (caller owns `flat`).
  function buildButton(p, idx, className, withCaption) {
    var btn = document.createElement("button");
    btn.className = className;
    btn.type = "button";
    btn.setAttribute("aria-label", "View larger: " + (p.title || "photo"));
    var img = document.createElement("img");
    img.src = p.thumb;
    img.alt = p.alt || p.title || "Electrical work by Kingsway Electrical";
    img.loading = "lazy";
    if (!withCaption && p.w && p.h) { img.width = p.w; img.height = p.h; }
    btn.appendChild(img);
    if (withCaption) {
      var cap = document.createElement("span");
      cap.className = "standout-cap";
      cap.textContent = p.title || "";
      btn.appendChild(cap);
    }
    btn.addEventListener("click", function () { open(idx); });
    return btn;
  }

  function renderStandouts(root, list) {
    root.innerHTML = "";
    if (!list.length) { root.style.display = "none"; return; }
    var track = document.createElement("div");
    track.className = "standouts-track";
    // Record each photo's lightbox index once; the visual duplicate reuses it.
    var items = list.map(function (p) { return { p: p, idx: flat.push(p) - 1 }; });
    function fill(isDuplicate) {
      items.forEach(function (it) {
        var btn = buildButton(it.p, it.idx, "standout", true);
        if (isDuplicate) { btn.setAttribute("aria-hidden", "true"); btn.tabIndex = -1; }
        track.appendChild(btn);
      });
    }
    fill(false); // real set (focusable, in lightbox order)
    fill(true);  // duplicate set for the seamless loop
    root.appendChild(track);
  }

  function renderGallery(root, cats) {
    root.innerHTML = "";
    var keys = Object.keys(cats);
    var order = ORDER[SECTION] || [];
    keys.sort(function (a, b) {
      var ia = order.indexOf(a), ib = order.indexOf(b);
      if (ia < 0) ia = 999;
      if (ib < 0) ib = 999;
      return ia - ib || a.localeCompare(b);
    });
    if (!keys.length) { root.innerHTML = '<p class="gallery-empty">Gallery coming soon.</p>'; return; }

    keys.forEach(function (cat) {
      var photos = cats[cat] || [];
      if (!photos.length) return;
      var sec = document.createElement("section");
      sec.className = "category";
      var h2 = document.createElement("h2");
      h2.textContent = label(cat);
      sec.appendChild(h2);
      var grid = document.createElement("div");
      grid.className = "photo-grid";
      photos.forEach(function (p) { grid.appendChild(buildButton(p, flat.push(p) - 1, "photo", false)); });
      sec.appendChild(grid);
      root.appendChild(sec);
    });
  }

  /* ---------- Lightbox ---------- */
  var lb, lbImg, lbCap, cur = 0;

  function ensureLightbox() {
    if (lb) return;
    lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.innerHTML =
      '<button class="lb-btn lb-close" aria-label="Close">×</button>' +
      '<button class="lb-btn lb-prev" aria-label="Previous image">‹</button>' +
      '<button class="lb-btn lb-next" aria-label="Next image">›</button>' +
      '<figure><img alt=""><figcaption></figcaption></figure>';
    document.body.appendChild(lb);
    lbImg = lb.querySelector("img");
    lbCap = lb.querySelector("figcaption");
    lb.querySelector(".lb-close").addEventListener("click", close);
    lb.querySelector(".lb-prev").addEventListener("click", function (e) { e.stopPropagation(); step(-1); });
    lb.querySelector(".lb-next").addEventListener("click", function (e) { e.stopPropagation(); step(1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
    });
  }
  function show() {
    var p = flat[cur];
    lbImg.src = p.full;
    lbImg.alt = p.alt || p.title || "";
    lbCap.textContent = p.title || "";
  }
  function open(i) {
    ensureLightbox();
    cur = i;
    show();
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function close() {
    lb.classList.remove("open");
    document.body.style.overflow = "";
  }
  function step(d) {
    cur = (cur + d + flat.length) % flat.length;
    show();
  }
})();

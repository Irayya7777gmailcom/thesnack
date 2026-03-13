/* ═══════════════════════════════════════════════════
   THE SNACK MILL — main.js
═══════════════════════════════════════════════════ */
(function () {
  "use strict";

  /* ──────────────────────────────────────────────────
     1. HEADER HEIGHT SPACER
     Measures the real header height and applies it as
     padding-top on the spacer div so content never
     hides underneath the fixed header.
  ──────────────────────────────────────────────────── */
  var header  = document.querySelector(".site-header");
  var spacer  = document.querySelector(".header-spacer");

  function syncSpacer() {
    if (header && spacer) {
      spacer.style.height = header.offsetHeight + "px";
    }
  }

  syncSpacer();
  window.addEventListener("resize", syncSpacer);

  /* Also re-sync after fonts / images load in case
     the logo changes the header height               */
  window.addEventListener("load", syncSpacer);


  /* ──────────────────────────────────────────────────
     2. HERO SLIDER
  ──────────────────────────────────────────────────── */
  var DURATION = 5000;   // 5 s per slide
  var FADE_MS  = 1200;   // must match CSS transition

  var slides   = document.querySelectorAll(".slide");
  var dots     = document.querySelectorAll(".dot");
  var progress = document.querySelector(".slider-progress");
  var current  = 0;
  var autoTimer, progStart, progRAF;

  /* ---- progress bar animation ---- */
  function startProgress() {
    if (!progress) return;
    cancelAnimationFrame(progRAF);
    progress.style.transition = "none";
    progress.style.width = "0%";

    progStart = performance.now();

    function tick(now) {
      var elapsed = now - progStart;
      var pct = Math.min((elapsed / DURATION) * 100, 100);
      progress.style.width = pct + "%";
      if (pct < 100) progRAF = requestAnimationFrame(tick);
    }
    // tiny delay so browser registers the reset
    requestAnimationFrame(function() {
      progStart = performance.now();
      progRAF = requestAnimationFrame(tick);
    });
  }

  /* ---- go to slide n ---- */
  function goTo(n) {
    slides[current].classList.remove("active");
    dots[current].classList.remove("active");
    current = ((n % slides.length) + slides.length) % slides.length;
    slides[current].classList.add("active");
    dots[current].classList.add("active");
    startProgress();
  }

  /* ---- auto-advance ---- */
  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(function() { goTo(current + 1); }, DURATION);
  }
  function stopAuto() { clearInterval(autoTimer); }

  /* ---- dots ---- */
  dots.forEach(function(dot, i) {
    dot.addEventListener("click", function() {
      stopAuto(); goTo(i); startAuto();
    });
  });

  /* ---- arrows ---- */
  var prev = document.querySelector(".arrow-prev");
  var next = document.querySelector(".arrow-next");
  if (prev) prev.addEventListener("click", function() { stopAuto(); goTo(current - 1); startAuto(); });
  if (next) next.addEventListener("click", function() { stopAuto(); goTo(current + 1); startAuto(); });

  /* ---- pause on hover ---- */
  var sliderEl = document.querySelector(".slider");
  if (sliderEl) {
    sliderEl.addEventListener("mouseenter", stopAuto);
    sliderEl.addEventListener("mouseleave", startAuto);
  }

  /* ---- touch swipe ---- */
  var touchX = 0;
  if (sliderEl) {
    sliderEl.addEventListener("touchstart", function(e) {
      touchX = e.changedTouches[0].screenX;
    }, { passive: true });
    sliderEl.addEventListener("touchend", function(e) {
      var diff = touchX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 40) {
        stopAuto();
        goTo(diff > 0 ? current + 1 : current - 1);
        startAuto();
      }
    }, { passive: true });
  }

  /* ---- kick off ---- */
  goTo(0);
  startAuto();


  /* ──────────────────────────────────────────────────
     3. ABOUT MODAL
  ──────────────────────────────────────────────────── */
  var modal    = document.getElementById("aboutModal");
  var closeBtn = document.querySelector(".modal-close");
  var triggers = document.querySelectorAll("[data-open-about]");

  function openModal()  { if (modal) { modal.classList.add("open");    document.body.style.overflow = "hidden"; } }
  function closeModal() { if (modal) { modal.classList.remove("open"); document.body.style.overflow = ""; } }

  triggers.forEach(function(el) {
    el.addEventListener("click", function(e) { e.preventDefault(); openModal(); });
  });
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (modal)    modal.addEventListener("click", function(e) { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", function(e) { if (e.key === "Escape") closeModal(); });

})();

/* Niraj Joshi — portfolio
   Theme toggle, scroll spy, reveal on scroll.
   No dependencies. */

(function () {
  'use strict';

  var root = document.documentElement;
  var STORAGE_KEY = 'nj-theme';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- theme ---------- */

  var toggle = document.getElementById('themeToggle');
  var toggleLabel = toggle ? toggle.querySelector('.theme-toggle-label') : null;

  function systemPrefersLight() {
    return window.matchMedia('(prefers-color-scheme: light)').matches;
  }

  function currentIsLight() {
    var explicit = root.getAttribute('data-theme');
    if (explicit) return explicit === 'light';
    return systemPrefersLight();
  }

  function syncToggle() {
    if (!toggleLabel) return;
    toggleLabel.textContent = currentIsLight() ? 'Dark' : 'Light';
    toggle.setAttribute('aria-label',
      currentIsLight() ? 'Switch to dark theme' : 'Switch to light theme');
  }

  function initTheme() {
    var stored = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) { /* private mode */ }

    if (stored === 'light' || stored === 'dark') {
      root.setAttribute('data-theme', stored);
    } else {
      root.removeAttribute('data-theme');
    }
    syncToggle();

    if (toggle) {
      toggle.addEventListener('click', function () {
        var next = currentIsLight() ? 'dark' : 'light';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* ignore */ }
        syncToggle();
      });
    }
  }

  /* ---------- sticky header shadow ---------- */

  function initHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    var ticking = false;

    function update() {
      header.classList.toggle('is-stuck', window.scrollY > 8);
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });

    update();
  }

  /* ---------- scroll spy ---------- */

  function initScrollSpy() {
    var links = Array.prototype.slice.call(
      document.querySelectorAll('.site-nav a[href^="#"]'));
    if (!links.length || !('IntersectionObserver' in window)) return;

    var byId = {};
    var targets = [];
    links.forEach(function (link) {
      var id = link.getAttribute('href').slice(1);
      var section = document.getElementById(id);
      if (section) { byId[id] = link; targets.push(section); }
    });

    var visible = {};

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visible[entry.target.id] = entry.isIntersecting;
      });

      // topmost visible section wins, so the label tracks your reading position
      var active = null;
      for (var i = 0; i < targets.length; i++) {
        if (visible[targets[i].id]) { active = targets[i].id; break; }
      }
      if (!active) return;

      links.forEach(function (l) { l.removeAttribute('aria-current'); });
      if (byId[active]) byId[active].setAttribute('aria-current', 'true');
    }, {
      rootMargin: '-25% 0px -60% 0px',
      threshold: 0
    });

    targets.forEach(function (t) { observer.observe(t); });
  }

  /* ---------- reveal on scroll ---------- */

  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (reduced.matches || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- boot ---------- */

  function boot() {
    initTheme();
    initHeader();
    initScrollSpy();
    initReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

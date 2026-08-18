/* =========================================================
   Loïg Le Guennec — interactions du site
   ========================================================= */
(function () {
  'use strict';

  /* ------------------------------------------------------
     1. Nav : état "solide" au scroll + menu burger mobile
     ------------------------------------------------------ */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('navBurger');
  var navMenu = document.getElementById('navMenu');

  var lastSolid = null;
  function syncNav() {
    var solid = window.scrollY > 90;
    if (solid !== lastSolid) {
      lastSolid = solid;
      nav.classList.toggle('is-solid', solid);
    }
  }
  window.addEventListener('scroll', syncNav, { passive: true });
  syncNav();

  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  }

  burger.addEventListener('click', function () {
    setMenu(burger.getAttribute('aria-expanded') !== 'true');
  });

  // Refermer le menu après un clic sur un lien (navigation par ancre)
  navMenu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });

  // Repasser en nav desktop si l'écran s'élargit alors que le menu est ouvert
  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) setMenu(false);
  });

  /* ------------------------------------------------------
     2. Palmarès : révéler / réduire 2024 et 2023
     ------------------------------------------------------ */
  var toggle = document.getElementById('palmaresToggle');
  var more = document.getElementById('palmaresMore');

  toggle.addEventListener('click', function () {
    var open = more.hidden;
    more.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Réduire le palmarès' : 'Voir tout le palmarès';
  });

  /* ------------------------------------------------------
     3. Comparateur avant / après
     ------------------------------------------------------ */
  var range = document.getElementById('compareRange');
  var before = document.getElementById('compareBefore');
  var handle = document.getElementById('compareHandle');

  function syncCompare() {
    var pos = Number(range.value);
    before.style.clipPath = 'inset(0 ' + (100 - pos) + '% 0 0)';
    handle.style.left = pos + '%';
  }
  range.addEventListener('input', syncCompare);
  syncCompare();

  /* ------------------------------------------------------
     4. Popup contact
     ------------------------------------------------------ */
  var modal = document.getElementById('contactModal');
  var modalCard = modal.querySelector('.modal__card');
  var lastFocused = null;

  function openModal(e) {
    if (e) e.preventDefault();
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('is-locked');
    setMenu(false);
    var first = modal.querySelector('.modal__close');
    if (first) first.focus();
  }

  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove('is-locked');
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  document.querySelectorAll('[data-contact-modal]').forEach(function (el) {
    el.addEventListener('click', openModal);
  });

  modal.querySelectorAll('[data-modal-close]').forEach(function (el) {
    el.addEventListener('click', closeModal);
  });

  // Un clic à l'intérieur de la carte ne ferme pas la popup
  modalCard.addEventListener('click', function (e) { e.stopPropagation(); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeModal();
      if (window.innerWidth <= 900) setMenu(false);
    }
    // Piège de focus simple tant que la popup est ouverte
    if (e.key === 'Tab' && !modal.hidden) {
      var focusables = modalCard.querySelectorAll('a[href], button');
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  /* ------------------------------------------------------
     5. Section "Dans le bateau"
     Révélée uniquement si assets/dans-le-bateau.mp4 est
     présent et lisible par le navigateur. Sinon la section
     et son lien de nav restent masqués — aucun placeholder
     visible côté public.
     ------------------------------------------------------ */
  var video = document.getElementById('bateauVideo');
  var bateau = document.getElementById('bateau');
  var navVideoItem = document.getElementById('navVideoItem');

  if (video) {
    video.addEventListener('loadedmetadata', function () {
      bateau.hidden = false;
      navVideoItem.hidden = false;
    }, { once: true });

    video.addEventListener('error', function () {
      bateau.remove();
      navVideoItem.remove();
    }, { once: true });
  }
})();

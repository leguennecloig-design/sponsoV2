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

/* =========================================================
   Configurateur d'emplacements sponsors
   Tout se passe dans le navigateur : aucun fichier n'est
   téléversé, aucun serveur n'est sollicité.
   ========================================================= */
(function () {
  'use strict';

  var stage = document.getElementById('configStage');
  if (!stage) return;

  var boatImg   = document.getElementById('configBoat');
  var zonesEl   = document.getElementById('configZones');
  var cardsEl   = document.getElementById('configCards');
  var fileIn    = document.getElementById('configFile');
  var resetBtn  = document.getElementById('configReset');
  var exportBtn = document.getElementById('configExport');
  var tabs      = Array.prototype.slice.call(document.querySelectorAll('.config__tab'));

  // Emplacements, exprimés en % de la boîte de l'image du bateau
  var VIEWS = {
    profil: {
      src: 'assets/bateau-profil.png',
      w: 1413, h: 172,
      alt: 'Kayak de descente Wakatwo, vue de profil',
      zones: [
        {
          id: 'flanc-central', name: 'Flanc de coque', size: '40 × 10 cm',
          note: "L'emplacement le plus visible : c'est ce que voient les photographes et les caméras depuis la berge, des deux côtés du bateau.",
          x: 18, y: 43, w: 31, h: 33
        },
        {
          id: 'flanc-arriere', name: 'Flanc arrière', size: '24 × 9 cm',
          note: "Sur la partie arrière de la coque, bien dégagée de l'eau et nette sur les photos de face.",
          x: 68, y: 42, w: 23, h: 30
        }
      ]
    },
    pont: {
      src: 'assets/bateau-pont.png',
      w: 1403, h: 203,
      alt: 'Kayak de descente Wakatwo, vue de dessus',
      zones: [
        {
          id: 'pont-avant', name: 'Pont avant', size: '30 × 12 cm',
          note: "Devant le cockpit : l'emplacement filmé par ma caméra embarquée pendant toute la course.",
          x: 24, y: 40, w: 22, h: 22
        },
        {
          id: 'pont-arriere', name: 'Pont arrière', size: '26 × 11 cm',
          note: "Derrière le cockpit, visible sur les vues de drone et les photos prises depuis les passerelles.",
          x: 72, y: 40, w: 20, h: 22
        }
      ]
    }
  };

  var currentView = 'profil';
  var logos = {};          // zoneId -> { img, url, name, scale }
  var pendingZone = null;

  /* ------------------------------------------------------
     Rendu
     ------------------------------------------------------ */

  function renderZones() {
    var view = VIEWS[currentView];
    zonesEl.innerHTML = '';

    view.zones.forEach(function (z) {
      var el = document.createElement('button');
      el.type = 'button';
      el.className = 'config__zone';
      el.dataset.zone = z.id;
      el.style.left = z.x + '%';
      el.style.top = z.y + '%';
      el.style.width = z.w + '%';
      el.style.height = z.h + '%';
      el.setAttribute('aria-label', 'Placer un logo sur : ' + z.name);

      var tag = document.createElement('span');
      tag.className = 'config__zone-tag';
      tag.textContent = z.name + ' · ' + z.size;
      el.appendChild(tag);

      var L = logos[z.id];
      if (L) {
        el.classList.add('is-filled');
        var im = document.createElement('img');
        im.src = L.url;
        im.alt = 'Logo ' + L.name;
        im.style.setProperty('--scale', L.scale);
        el.appendChild(im);
      }

      el.addEventListener('click', function () { openPicker(z.id); });
      zonesEl.appendChild(el);
    });
  }

  function renderCards() {
    var view = VIEWS[currentView];
    cardsEl.innerHTML = '';

    view.zones.forEach(function (z) {
      var L = logos[z.id];

      var card = document.createElement('div');
      card.className = 'config__card' + (L ? ' is-filled' : '');

      var meta = document.createElement('span');
      meta.className = 'config__card-meta';
      meta.textContent = z.size;

      var name = document.createElement('span');
      name.className = 'config__card-name';
      name.textContent = z.name;

      var note = document.createElement('p');
      note.className = 'config__card-note';
      note.textContent = z.note;

      card.appendChild(meta);
      card.appendChild(name);
      card.appendChild(note);

      var controls = document.createElement('div');
      controls.className = 'config__card-controls';

      if (L) {
        var range = document.createElement('input');
        range.type = 'range';
        range.min = '40';
        range.max = '100';
        range.value = String(Math.round(L.scale * 100));
        range.setAttribute('aria-label', 'Taille du logo sur ' + z.name);
        range.addEventListener('input', function () {
          L.scale = Number(range.value) / 100;
          var im = zonesEl.querySelector('[data-zone="' + z.id + '"] img');
          if (im) im.style.setProperty('--scale', L.scale);
        });

        var rm = document.createElement('button');
        rm.type = 'button';
        rm.className = 'config__btn config__btn--remove';
        rm.textContent = 'Retirer';
        rm.addEventListener('click', function () { removeLogo(z.id); });

        controls.appendChild(range);
        controls.appendChild(rm);
      } else {
        var add = document.createElement('button');
        add.type = 'button';
        add.className = 'config__btn';
        add.textContent = 'Placer mon logo';
        add.addEventListener('click', function () { openPicker(z.id); });
        controls.appendChild(add);
      }

      card.appendChild(controls);
      cardsEl.appendChild(card);
    });
  }

  function syncActions() {
    var any = Object.keys(logos).length > 0;
    resetBtn.hidden = !any;
    exportBtn.hidden = !any;
  }

  function render() {
    renderZones();
    renderCards();
    syncActions();
  }

  /* ------------------------------------------------------
     Fichiers logo
     ------------------------------------------------------ */

  function openPicker(zoneId) {
    pendingZone = zoneId;
    fileIn.value = '';
    fileIn.click();
  }

  function setLogo(zoneId, file) {
    if (!zoneId || !file || file.type.indexOf('image/') !== 0) return;

    var previous = logos[zoneId];
    if (previous) URL.revokeObjectURL(previous.url);

    var url = URL.createObjectURL(file);
    var img = new Image();

    img.onload = function () {
      logos[zoneId] = { img: img, url: url, name: file.name, scale: 0.9 };
      render();
    };
    img.onerror = function () { URL.revokeObjectURL(url); };
    img.src = url;
  }

  function removeLogo(zoneId) {
    if (logos[zoneId]) {
      URL.revokeObjectURL(logos[zoneId].url);
      delete logos[zoneId];
    }
    render();
  }

  fileIn.addEventListener('change', function () {
    if (pendingZone && fileIn.files && fileIn.files[0]) setLogo(pendingZone, fileIn.files[0]);
    pendingZone = null;
  });

  /* ------------------------------------------------------
     Bascule entre les deux vues
     ------------------------------------------------------ */

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var v = tab.dataset.view;
      if (v === currentView) return;
      currentView = v;

      tabs.forEach(function (t) {
        var on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
      });

      var view = VIEWS[v];
      boatImg.src = view.src;
      boatImg.width = view.w;
      boatImg.height = view.h;
      boatImg.alt = view.alt;
      render();
    });
  });

  /* ------------------------------------------------------
     Glisser-déposer (desktop)
     ------------------------------------------------------ */

  function zoneAt(x, y) {
    var el = document.elementFromPoint(x, y);
    var hit = el && el.closest ? el.closest('.config__zone') : null;
    if (hit) return hit.dataset.zone;

    // Hors zone : on retient l'emplacement dont le centre est le plus proche
    var best = null, bestDist = Infinity;
    Array.prototype.forEach.call(zonesEl.children, function (c) {
      var r = c.getBoundingClientRect();
      var dx = x - (r.left + r.width / 2);
      var dy = y - (r.top + r.height / 2);
      var d = dx * dx + dy * dy;
      if (d < bestDist) { bestDist = d; best = c.dataset.zone; }
    });
    return best;
  }

  function markTarget(id) {
    Array.prototype.forEach.call(zonesEl.children, function (c) {
      c.classList.toggle('is-target', c.dataset.zone === id);
    });
  }

  var dragDepth = 0;

  stage.addEventListener('dragenter', function (e) {
    e.preventDefault();
    dragDepth++;
    stage.classList.add('is-dragging');
  });

  stage.addEventListener('dragover', function (e) {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
    markTarget(zoneAt(e.clientX, e.clientY));
  });

  stage.addEventListener('dragleave', function () {
    dragDepth = Math.max(0, dragDepth - 1);
    if (dragDepth === 0) {
      stage.classList.remove('is-dragging');
      markTarget(null);
    }
  });

  stage.addEventListener('drop', function (e) {
    e.preventDefault();
    dragDepth = 0;
    stage.classList.remove('is-dragging');
    markTarget(null);
    var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) setLogo(zoneAt(e.clientX, e.clientY), f);
  });

  // Empêche le navigateur d'ouvrir le fichier s'il est lâché à côté du bateau
  ['dragover', 'drop'].forEach(function (ev) {
    window.addEventListener(ev, function (e) {
      if (!stage.contains(e.target)) e.preventDefault();
    });
  });

  /* ------------------------------------------------------
     Actions
     ------------------------------------------------------ */

  resetBtn.addEventListener('click', function () {
    Object.keys(logos).forEach(function (k) { URL.revokeObjectURL(logos[k].url); });
    logos = {};
    render();
  });

  exportBtn.addEventListener('click', function () {
    var view = VIEWS[currentView];
    var canvas = document.createElement('canvas');
    var SCALE = 2;
    canvas.width = view.w * SCALE;
    canvas.height = (view.h + 70) * SCALE;

    var ctx = canvas.getContext("2d");
    ctx.scale(SCALE, SCALE);
    ctx.fillStyle = '#0f0f1c';
    ctx.fillRect(0, 0, view.w, view.h + 70);
    ctx.drawImage(boatImg, 0, 0, view.w, view.h);

    view.zones.forEach(function (z) {
      var L = logos[z.id];
      if (!L || !L.img.naturalWidth) return;

      var zx = z.x / 100 * view.w, zy = z.y / 100 * view.h;
      var zw = z.w / 100 * view.w, zh = z.h / 100 * view.h;
      var boxW = zw * L.scale, boxH = zh * L.scale;
      var ratio = Math.min(boxW / L.img.naturalWidth, boxH / L.img.naturalHeight);
      var dw = L.img.naturalWidth * ratio, dh = L.img.naturalHeight * ratio;

      ctx.drawImage(L.img, zx + (zw - dw) / 2, zy + (zh - dh) / 2, dw, dh);
    });

    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.font = 'bold 20px Arial, sans-serif';
    ctx.fillText("Loïg Le Guennec — simulation d'emplacements partenaires — @loig.lgc", 24, view.h + 44);

    try {
      canvas.toBlob(function (blob) {
        if (!blob) return;
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'sponsoring-loig-le-guennec-' + currentView + '.png';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      }, 'image/png');
    } catch (err) {
      exportBtn.textContent = 'Export impossible avec ce format de logo';
    }
  });

  render();
})();

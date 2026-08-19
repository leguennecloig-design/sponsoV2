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
   Configurateur d'emplacements partenaires
   Les deux vues du bateau sont affichées ensemble. Le logo
   déposé reste dans le navigateur du visiteur : rien n'est
   envoyé nulle part.
   ========================================================= */
(function () {
  'use strict';

  var boatsEl = document.getElementById('configBoats');
  if (!boatsEl) return;

  var dropEl   = document.getElementById('configDrop');
  var cardsEl  = document.getElementById('configCards');
  var fileIn   = document.getElementById('configFile');
  var resetBtn = document.getElementById('configReset');
  var exportBtn= document.getElementById('configExport');
  var countEl  = document.getElementById('configCount');

  // Emplacements relevés sur le schéma annoté par Loïg, convertis en % de la
  // boîte de l'image via les marquages orange du bateau comme points de repère.
  var VIEWS = [
    {
      id: 'profil',
      label: 'De profil',
      caption: "Ce que voient les photographes depuis la berge.",
      src: 'assets/bateau-profil.png',
      w: 1413, h: 172,
      alt: 'Mon kayak de descente vu de profil',
      zones: [
        {
          id: 'proue', name: 'Proue', size: '36 × 10 cm',
          note: "Tout à l'avant, bien au-dessus de l'eau. C'est la première chose qui passe la ligne d'arrivée.",
          x: 10.4, y: 22.7, w: 8.1, h: 24.1
        },
        {
          id: 'flanc-avant', name: 'Flanc avant', size: '42 × 10 cm',
          note: "Sur la partie haute de la coque, là où elle reste sèche. Net sur les photos prises depuis la berge.",
          x: 21.1, y: 25.8, w: 9.5, h: 26.4
        },
        {
          id: 'flanc-central', name: 'Flanc central', size: '38 × 9 cm',
          note: "Juste devant moi quand je pagaie. On le voit sur presque toutes les photos de course.",
          x: 32.5, y: 27.4, w: 8.6, h: 21.8
        },
        {
          id: 'flanc-arriere', name: 'Flanc arrière', size: '75 × 8 cm',
          note: "Le plus grand des emplacements. Une vraie bande sur toute la longueur arrière, des deux côtés du bateau.",
          x: 63.5, y: 51.5, w: 16.8, h: 20.2
        }
      ]
    },
    {
      id: 'pont',
      label: 'De dessus',
      caption: "Ce que filme ma caméra embarquée, et ce que voient les drones.",
      src: 'assets/bateau-pont.png',
      w: 1403, h: 203,
      alt: 'Mon kayak de descente vu de dessus',
      zones: [
        {
          id: 'pont-avant', name: 'Pont avant', size: '74 × 20 cm',
          note: "Droit devant moi pendant toute la course. C'est ce qu'on voit en continu sur mes vidéos embarquées.",
          x: 14.4, y: 34.0, w: 16.4, h: 34.2
        },
        {
          id: 'pont-central', name: 'Pont central', size: '40 × 23 cm',
          note: "Juste devant le cockpit, dans le champ dès qu'on me photographie de face.",
          x: 32.6, y: 30.1, w: 8.9, h: 38.2
        },
        {
          id: 'pont-arriere', name: 'Pont arrière', size: '46 × 22 cm',
          note: "Sur la partie la plus large du bateau. C'est elle qu'on voit du dessus, depuis les passerelles et les ponts.",
          x: 66.5, y: 30.7, w: 10.4, h: 37.5
        },
        {
          id: 'bord-gauche', name: 'Bord gauche', size: '17 × 10 cm',
          note: "Petit format, sur le liseré du pont. Bien visible quand je passe une porte serrée.",
          x: 68.3, y: 9.0, w: 3.7, h: 15.0
        },
        {
          id: 'bord-droit', name: 'Bord droit', size: '20 × 10 cm',
          note: "Le même, de l'autre côté. Les deux se prennent souvent ensemble.",
          x: 68.1, y: 74.0, w: 4.5, h: 17.0
        },
        {
          id: 'poupe', name: 'Poupe', size: '20 × 20 cm',
          note: "Derrière moi, sur la partie qui se relève. Format presque carré, pratique pour un logo rond.",
          x: 78.9, y: 32.0, w: 4.4, h: 34.0
        },
        {
          id: 'pointe-poupe', name: 'Pointe arrière', size: '20 × 18 cm',
          note: "Le dernier bout du bateau. Petit, mais c'est ce que voient ceux qui me suivent en course.",
          x: 84.8, y: 35.0, w: 4.6, h: 30.0
        }
      ]
    }
  ];

  var logos = {};        // zoneId -> { img, url, name, scale }
  var pendingZone = null;
  var stages = {};       // viewId -> { zonesEl, imgEl }

  function eachZone(fn) {
    VIEWS.forEach(function (v) { v.zones.forEach(function (z) { fn(z, v); }); });
  }

  /* ------------------------------------------------------
     Construction des deux plans de bateau
     ------------------------------------------------------ */

  function buildStages() {
    VIEWS.forEach(function (view) {
      var fig = document.createElement('figure');
      fig.className = 'config__stage';

      var frame = document.createElement('div');
      frame.className = 'config__frame';

      var img = document.createElement('img');
      img.className = 'config__boat';
      img.src = view.src;
      img.width = view.w;
      img.height = view.h;
      img.alt = view.alt;
      img.loading = 'lazy';
      img.decoding = 'async';

      var zonesEl = document.createElement('div');
      zonesEl.className = 'config__zones';

      frame.appendChild(img);
      frame.appendChild(zonesEl);

      var cap = document.createElement('figcaption');
      cap.className = 'config__stage-cap';
      cap.innerHTML = '<strong>' + view.label + '</strong> ' + view.caption;

      fig.appendChild(frame);
      fig.appendChild(cap);
      boatsEl.insertBefore(fig, dropEl);

      stages[view.id] = { zonesEl: zonesEl, imgEl: img };
    });
  }

  function renderZones() {
    VIEWS.forEach(function (view) {
      var host = stages[view.id].zonesEl;
      host.innerHTML = '';

      view.zones.forEach(function (z) {
        var el = document.createElement('button');
        el.type = 'button';
        el.className = 'config__zone';
        el.dataset.zone = z.id;
        el.style.left = z.x + '%';
        el.style.top = z.y + '%';
        el.style.width = z.w + '%';
        el.style.height = z.h + '%';
        el.setAttribute('aria-label', 'Mettre mon logo sur : ' + z.name);

        var tag = document.createElement('span');
        tag.className = 'config__zone-tag';
        tag.textContent = z.name;
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
        host.appendChild(el);
      });
    });
  }

  function renderCards() {
    cardsEl.innerHTML = '';

    VIEWS.forEach(function (view) {
      view.zones.forEach(function (z) {
        var L = logos[z.id];

        var card = document.createElement('div');
        card.className = 'config__card' + (L ? ' is-filled' : '');

        var meta = document.createElement('span');
        meta.className = 'config__card-meta';
        meta.textContent = view.label + ' · ' + z.size;

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
            var im = document.querySelector('.config__zone[data-zone="' + z.id + '"] img');
            if (im) im.style.setProperty('--scale', L.scale);
          });

          var rm = document.createElement('button');
          rm.type = 'button';
          rm.className = 'config__btn config__btn--remove';
          rm.textContent = 'Enlever';
          rm.addEventListener('click', function () { removeLogo(z.id); });

          controls.appendChild(range);
          controls.appendChild(rm);
        } else {
          var add = document.createElement('button');
          add.type = 'button';
          add.className = 'config__btn';
          add.textContent = 'Mettre mon logo ici';
          add.addEventListener('click', function () { openPicker(z.id); });
          controls.appendChild(add);
        }

        card.appendChild(controls);
        cardsEl.appendChild(card);
      });
    });
  }

  function syncActions() {
    var n = Object.keys(logos).length;
    resetBtn.hidden = n === 0;
    exportBtn.hidden = n === 0;
    if (countEl) {
      countEl.hidden = n === 0;
      countEl.textContent = n === 1
        ? '1 emplacement essayé'
        : n + ' emplacements essayés';
    }
  }

  function render() {
    renderZones();
    renderCards();
    syncActions();
  }

  /* ------------------------------------------------------
     Chargement du logo
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
     Glisser-déposer (ordinateur)
     ------------------------------------------------------ */

  function zoneAt(x, y) {
    var el = document.elementFromPoint(x, y);
    var hit = el && el.closest ? el.closest('.config__zone') : null;
    if (hit) return hit.dataset.zone;

    var best = null, bestDist = Infinity;
    document.querySelectorAll('.config__zone').forEach(function (c) {
      var r = c.getBoundingClientRect();
      var dx = x - (r.left + r.width / 2);
      var dy = y - (r.top + r.height / 2);
      var d = dx * dx + dy * dy;
      if (d < bestDist) { bestDist = d; best = c.dataset.zone; }
    });
    return best;
  }

  function markTarget(id) {
    document.querySelectorAll('.config__zone').forEach(function (c) {
      c.classList.toggle('is-target', c.dataset.zone === id);
    });
  }

  var dragDepth = 0;

  boatsEl.addEventListener('dragenter', function (e) {
    e.preventDefault();
    dragDepth++;
    boatsEl.classList.add('is-dragging');
  });

  boatsEl.addEventListener('dragover', function (e) {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
    markTarget(zoneAt(e.clientX, e.clientY));
  });

  boatsEl.addEventListener('dragleave', function () {
    dragDepth = Math.max(0, dragDepth - 1);
    if (dragDepth === 0) {
      boatsEl.classList.remove('is-dragging');
      markTarget(null);
    }
  });

  boatsEl.addEventListener('drop', function (e) {
    e.preventDefault();
    dragDepth = 0;
    boatsEl.classList.remove('is-dragging');
    markTarget(null);
    var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) setLogo(zoneAt(e.clientX, e.clientY), f);
  });

  ['dragover', 'drop'].forEach(function (ev) {
    window.addEventListener(ev, function (e) {
      if (!boatsEl.contains(e.target)) e.preventDefault();
    });
  });

  /* ------------------------------------------------------
     Export : les deux vues sur une seule image
     ------------------------------------------------------ */

  function drawZones(ctx, view, offsetY) {
    view.zones.forEach(function (z) {
      var L = logos[z.id];
      if (!L || !L.img.naturalWidth) return;

      var zx = z.x / 100 * view.w;
      var zy = z.y / 100 * view.h + offsetY;
      var zw = z.w / 100 * view.w;
      var zh = z.h / 100 * view.h;

      var boxW = zw * L.scale, boxH = zh * L.scale;
      var ratio = Math.min(boxW / L.img.naturalWidth, boxH / L.img.naturalHeight);
      var dw = L.img.naturalWidth * ratio, dh = L.img.naturalHeight * ratio;

      ctx.drawImage(L.img, zx + (zw - dw) / 2, zy + (zh - dh) / 2, dw, dh);
    });
  }

  exportBtn.addEventListener('click', function () {
    var SCALE = 2;
    var PAD = 48, HEAD = 100, GAP = 58, FOOT = 62;

    var width = Math.max(VIEWS[0].w, VIEWS[1].w) + PAD * 2;
    var height = HEAD + VIEWS[0].h + GAP + VIEWS[1].h + FOOT;

    var canvas = document.createElement('canvas');
    canvas.width = width * SCALE;
    canvas.height = height * SCALE;

    var ctx = canvas.getContext('2d');
    ctx.scale(SCALE, SCALE);

    ctx.fillStyle = '#0f0f1c';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px Arial, sans-serif';
    ctx.fillText('Votre logo sur mon bateau', PAD, 50);

    var y = HEAD;
    VIEWS.forEach(function (view, i) {
      var st = stages[view.id];
      var x = PAD + (width - PAD * 2 - view.w) / 2;

      ctx.fillStyle = '#bc7155';
      ctx.font = 'bold 17px Arial, sans-serif';
      ctx.fillText(view.label.toUpperCase(), PAD, y - 12);

      ctx.save();
      ctx.translate(x, 0);
      ctx.drawImage(st.imgEl, 0, y, view.w, view.h);
      drawZones(ctx, view, y);
      ctx.restore();

      y += view.h + (i === 0 ? GAP : 0);
    });

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '19px Arial, sans-serif';
    ctx.fillText('Loïg Le Guennec — canoë-kayak descente, Équipe de France — @loig.lgc — leguennec.loig@gmail.com',
                 PAD, height - 26);

    try {
      canvas.toBlob(function (blob) {
        if (!blob) return;
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'mon-logo-sur-le-bateau-de-loig.png';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      }, 'image/png');
    } catch (err) {
      exportBtn.textContent = 'Ce format de logo ne peut pas être exporté';
    }
  });

  resetBtn.addEventListener('click', function () {
    Object.keys(logos).forEach(function (k) { URL.revokeObjectURL(logos[k].url); });
    logos = {};
    render();
  });

  buildStages();
  render();
})();

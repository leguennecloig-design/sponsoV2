## PROMPT POUR CLAUDE CODE — copier-coller tel quel

Construis un site vitrine statique une-page pour Loïg Le Guennec, athlète canoë-kayak (descente de rivière, Équipe de France), à partir des specs ci-dessous. Livre un projet HTML/CSS/JS statique (ou Next.js/Vite si le repo cible en a déjà un — sinon HTML/CSS/JS vanilla), responsive mobile/desktop, prêt à déployer sur Vercel/Netlify/GitHub Pages.

### Important — nature des fichiers fournis
Le dossier contient un **fichier de référence HTML** (`reference/Site Sponsoring Loig.dc.html`) qui est un prototype de design — pas du code à copier tel quel (il utilise un moteur de templating interne `{{ }}` propre à l'outil de design, qui ne doit PAS se retrouver dans le code final). Utilise-le comme référence pixel-perfect de layout, couleurs, typographie et copy, et **recrée-le en HTML/CSS/JS (ou React) standard et propre**.

### Fidélité
Haute fidélité — reproduire exactement les couleurs, espacements, typographies et le texte listés ci-dessous.

---

## Stack & déploiement
- Site statique one-page (scroll unique avec ancres). Pas de backend nécessaire.
- Aucune dépendance de build obligatoire — HTML/CSS/JS vanilla acceptable. Si le repo a déjà un framework (React/Next/Vite), l'implémenter dans ce cadre.
- Déployer sur Vercel (par défaut) : `vercel --prod`, ou Netlify/GitHub Pages si préférence différente. Nom de domaine à configurer séparément (demander à l'utilisateur s'il a un domaine).
- Formulaire de contact : il n'y en a pas — le contact se fait via mailto/tel/Instagram directs (voir section Footer). Pas d'intégration backend nécessaire.

## Design tokens

**Couleurs**
- Fond principal (dark) : `#0f0f1c`
- Fond header/footer le plus sombre : `#000d10`
- Accent (terracotta, configurable) : `#bc7155` — variantes possibles : `#a85f42`, `#c17b52`, `#8e5a3f`
- Texte principal sur fond sombre : `#ffffff`
- Texte secondaire/muted sur fond sombre : `rgba(255,255,255,0.6)` (et 0.5/0.75/0.85 selon le contexte, voir détail par section)
- Bordures/séparateurs sur fond sombre : `rgba(255,255,255,0.15)`
- Fond de la popup modal contact : `#ffffff`, texte `#000d10`, muted `#8e8e95`, bordures `#d5d3d4`
- Sélection de texte : fond `#bc7155`, texte blanc

**Typographie**
- Police unique : `'Helvetica Neue', Arial, sans-serif`
- H1 hero : `clamp(40px,7.5vw,110px)`, weight 700, line-height 0.88, letter-spacing -0.03em
- H2 titres de section : `clamp(32px,4vw,52px)`, weight 700, line-height 1.05, letter-spacing -0.02em
- Corps de texte : 18px, line-height 1.61
- Labels/eyebrows (petites majuscules) : 14px, letter-spacing 0.08em, weight 700, couleur accent
- CTA/boutons : 15–16px, weight 700

**Composants récurrents**
- Boutons pill : `border-radius: 1000px`, padding `15-16px 26px`
- Cartes/images : la plupart en `aspect-ratio: 4/5`, `object-fit: cover`

## Structure de la page (dans l'ordre, avec ancres)

### Header fixe (`position: fixed`, z-index élevé)
- Bandeau d'annonce : fond `#000d10`, texte centré blanc 13px : **"OBJECTIF 2027 — GRAZ, AUTRICHE — DOUBLE TITRE MONDIAL U18"**
- Nav : logo texte "LOÏG LE GUENNEC" à gauche (18px, weight 700, lien vers `#top`) ; liens au centre/droite : Palmarès (`#palmares`), Objectif (`#objectif`), Parcours (`#qui-suis-je`), Suivre (`#embarque`), Vidéo (`#bateau`), Partenariat (`#partenariat`), Contact (`#contact`) ; bouton CTA pill à droite "Devenir partenaire →" (fond accent, texte blanc) qui **ouvre la popup contact** (voir section Popup) au lieu de scroller.
- Comportement scroll : au scroll (`window.scrollY > 90`), la nav devient un bandeau `rgba(15,15,28,0.92)` avec `backdrop-filter: blur(10px)` et une ombre `0 1px 0 rgba(255,255,255,0.12)` ; transparente en haut de page. Texte nav toujours blanc.

### Hero (`#top`, min-height 100vh)
- Image de fond plein cadre `assets/hero-action2.jpg` avec double dégradé sombre (linéaire horizontal + vertical) par-dessus pour la lisibilité du texte, contenu aligné à droite/bas.
- Eyebrow : "CANOË-KAYAK · DESCENTE · ÉQUIPE DE FRANCE"
- H1 : "LOÏG LE GUENNEC" (sur deux lignes)
- Sous-titre (deux variantes possibles, texte au choix/config) : "Champion d'Europe par équipe. Vice-champion d'Europe. Direction Graz 2027." (version longue, par défaut) ou "De Torcy à l'Europe. Prochain arrêt : le monde." (version courte)
- 2 CTA : "Découvrir mon parcours →" (fond blanc, scroll vers `#qui-suis-je`) et "Devenir partenaire →" (contour blanc transparent, **ouvre la popup contact**)

### Palmarès (`#palmares`)
Grid 2 colonnes (colonne gauche sticky avec photo, colonne droite liste de résultats par année).
- Colonne gauche : eyebrow accent "PALMARÈS", H2 "Une progression continue.", texte muted "Portée par le travail acharné et un entourage engagé.", label accent "VICE-CHAMPION D'EUROPE EN SPRINT KAYAK", photo `assets/palmares-podium2.jpg` (ratio 4/5), légende italique muted "Ici, c'est le podium des Championnats d'Europe."
- Colonne droite, par année (h3 + séparateur fin) :
  - **2026** : liste de résultats avec badge pill rang (bordure/texte couleur accent) + libellé (texte blanc) :
    - 2E — Vice-champion d'Europe en individuel — Kayak
    - 1ER — Champion d'Europe par équipe — Écosse
    - 4E — 4ème aux Championnats d'Europe en Canoë biplace
    - 1ER — 2 titres de Champion de France
    - ÉDF — Sélection en Équipe de France
    - 2E — 4 médailles d'argent aux Championnats de France
    - 3E — 1 médaille de bronze aux Championnats de France
    - ★ — De nombreuses médailles aux Championnats de France par équipe
  - **2025** (texte muted, sans badge) :
    - Aux portes de l'Équipe de France
    - 2 top 5 aux Championnats de France sprint
    - Médailles aux Championnats de France par équipe
  - **2024** et **2023** : masqués par défaut, révélés par un bouton toggle "Voir tout le palmarès" / "Réduire le palmarès" (bordure blanche translucide, texte blanc) :
    - 2024 : Champion de France U15 en Kayak individuel ; Vainqueur de la Coupe de France
    - 2023 : 5ème aux Championnats de France en Kayak U15 ; Champion de France en Canoë biplace ; Vainqueur de la Coupe de France

### Objectif (`#objectif`)
- Section pleine largeur fond accent (terracotta), texte blanc. Grid 2 colonnes : texte à gauche, photo `assets/objectif-portrait.jpg` (ratio 4/5) à droite.
- Eyebrow "L'OBJECTIF", H2 "Graz, Autriche.<br>Été 2027."
- 3 paragraphes :
  1. "Après une première saison internationale couronnée de médailles, l'objectif est clair : devenir double champion du monde des Championnats du Monde U18. Individuel et par équipe."
  2. "Cet objectif peut se réaliser avec votre aide — une aide précieuse, sans laquelle cette trajectoire n'irait pas aussi loin."
  3. "Graz 2027 n'est qu'une étape. L'ambition va plus loin : devenir champion du monde chez les seniors, en classique comme en sprint."
- 2 CTA : "Devenir partenaire →" (fond blanc, **ouvre popup contact**) et "Me contacter →" (contour blanc, **ouvre popup contact**)

### Qui suis-je (`#qui-suis-je`)
Grid 2 colonnes : à gauche un **comparateur avant/après par slider** (image "après" en dessous plein cadre `assets/qui-suis-je2.jpg` ; image "avant" `assets/qui-suis-je-enfant.jpg` en superposition, révélée via `clip-path: inset()` piloté par un `<input type="range">` invisible superposé à la zone image ; badges "AVANT"/"APRÈS" en coins haut-gauche/haut-droit ; poignée ronde blanche "↔" + trait vertical blanc suivant la position du curseur). Position par défaut du curseur : 50%.
À droite :
- Eyebrow accent "QUI SUIS-JE", H2 "Seize ans, six ans d'eau vive, une équipe de France."
- Paragraphes (texte blanc pour les 2 premiers/derniers, muted pour les intermédiaires) :
  1. "Je m'appelle Loïg Le Guennec, j'ai 16 ans, et je suis pagayeur en canoë-kayak, discipline descente de rivière, au sein du Torcy Canoë Kayak."
  2. "Je suis monté sur l'eau pour la première fois à l'âge de 10 ans. Au début, c'était juste pour m'amuser sur l'eau, puis peu à peu tout a évolué et c'est devenu plus sérieux. Aujourd'hui, je porte les couleurs de l'Équipe de France et je viens de décrocher mes premières médailles internationales aux Championnats d'Europe en Écosse."
  3. "Je vis pour mes objectifs sportifs. Mais j'ai aussi des objectifs scolaires clairs, et ça compte tout autant pour moi — l'un ne va pas sans l'autre."
  4. "Ce n'est que le début de l'aventure. Je compte bien aller beaucoup plus loin."
  5. (weight 700) "Mon objectif : devenir double champion du monde U18 à Graz, en Autriche, en 2027."
- 3 stats en colonnes avec bordure gauche fine : "16 ans / Torcy Canoë Kayak" · "6 ans / de pratique" · "9 / sem. / entraînements"

### Embarquez avec moi (`#embarque`)
- Eyebrow accent "EMBARQUEZ AVEC MOI", H2 "Une semaine de compétition, vue de l'intérieur.", texte muted "Entraînements, déplacements, coulisses et courses : suivez le déroulé d'une semaine de compétition en direct sur mon compte Instagram."
- **Embed Instagram réel** : iframe pointant vers `https://www.instagram.com/p/Das0fJRMYJb/embed` (publication publique de Loïg), largeur max 540px, centré, bordure translucide arrondie 16px, hauteur ~760px.
- CTA sous l'embed : "Suivre @loig.lgc →" (fond accent, texte blanc) vers `https://instagram.com/loig.lgc`.

### Dans le bateau (`#bateau`)
- Fond `#0f0f1c`. Eyebrow muted "DANS LE BATEAU", H2 "Embarquez avec moi, dans le bateau.", texte muted "Une caméra embarquée pour vivre la course depuis le kayak, au plus près de la rivière."
- Bloc vidéo 16:9, coins arrondis 16px, fond `#1a1b2b` : balise `<video controls playsinline>` pointant vers **`assets/dans-le-bateau.mp4`** (fichier vidéo à fournir par le client — prévoir un poster/fallback visuel tant que le fichier n'est pas présent). Ne PAS afficher de texte de placeholder visible publiquement (garder en commentaire de code uniquement).

### Partenariat (`#partenariat`)
- Fond `#0f0f1c`. Grid 2 colonnes : photo `assets/partenaire-edf2.jpg` (ratio 4/5) à gauche, texte à droite.
- Eyebrow muted "DEVENIR PARTENAIRE", H2 "Pourquoi devenir partenaire"
- Paragraphes (texte blanc 85% opacité) :
  1. "La performance ne se construit pas seul. Elle se construit avec un entourage — coach, famille, préparation physique et médicale — et avec les moyens de se déplacer, de s'entraîner, de progresser sans compter."
  2. "Rejoindre mon projet, c'est faire partie de cet entourage. C'est associer votre marque à une trajectoire sportive ambitieuse, portée par des valeurs d'eau, de nature et de dépassement de soi — et suivre de près une progression vers l'objectif 2027."
  3. "Aujourd'hui, tout cela est possible financièrement grâce à mes parents, qui financent ma saison. Sans eux, la performance serait impossible."
  4. "Chaque euro compte et peut m'aider à aller encore plus loin — à me rapprocher un peu plus de mon rêve."
  5. "De nombreuses personnes me soutiennent aussi dans mon projet sportif : mon entraîneur, qui est derrière chacune de mes performances, une diététicienne, un ostéopathe, un médecin du sport, et mon club."
  6. "Des moyens supplémentaires m'aideraient grandement dans mon projet et pourraient vraiment m'aider à atteindre mes objectifs : toute l'année, je dois changer et améliorer mon matériel, qui est coûteux, et mes déplacements pour préparer les compétitions le sont tout autant."
  7. "En échange de votre soutien : visibilité sur mon bateau de compétition, présence sur mes réseaux et mes lives de compétition, et une relation directe et personnalisée avec vous."
- CTA : "Discutons de notre partenariat →" (contour blanc, **ouvre popup contact**)

### Contact / Footer (`#contact`)
- Fond `#000d10`. Eyebrow "ME CONTACTER", H2 "Un projet, une question, une envie de partenariat ?", texte "Je réponds directement."
- 3 liens directs en grille (bordures translucides) :
  - Email → `mailto:leguennec.loig@gmail.com` (afficher "leguennec.loig@gmail.com")
  - Téléphone → `tel:+33663633369` (afficher "06 63 63 33 69")
  - Instagram → `https://instagram.com/loig.lgc` (afficher "@loig.lgc"), `target="_blank" rel="noopener"`
- Ligne de bas de page : "© 2026 Loïg Le Guennec — Torcy Canoë Kayak" à gauche, "Direction Graz 2027" à droite.

### Popup "Me contacter" (modal)
Déclenchée par tous les CTA "Devenir partenaire", "Me contacter" et "Discutons de notre partenariat" (via `preventDefault` sur le clic, au lieu du scroll par défaut vers `#partenariat`/`#contact`).
- Overlay plein écran `rgba(0,13,16,0.75)`, clic sur l'overlay = fermeture. Carte centrée fond blanc, `border-radius: 20px`, max-width 460px, padding 44px 40px. Bouton "×" de fermeture en haut à droite.
- Contenu : eyebrow "ME CONTACTER", titre "Discutons de notre partenariat.", puis les 3 mêmes liens directs (email / téléphone / Instagram) que le footer, en liste verticale séparée par des bordures fines grises (`#d5d3d4`).

## Interactions & comportement JS à implémenter
1. **Nav scroll state** : écouter le scroll, basculer le style de la nav (transparent → fond sombre flou) au-delà de 90px de scroll.
2. **Toggle palmarès** : bouton qui affiche/masque les blocs 2024 et 2023, change son propre libellé.
3. **Slider avant/après** : `<input type="range" min="0" max="100">` invisible superposé à la zone image ; sa valeur pilote un `clip-path: inset(0 X% 0 0)` sur l'image "avant" (où X = 100 - valeur du slider) pour révéler progressivement l'image "après" ; la poignée visuelle et le trait suivent la position en `left: {valeur}%`.
4. **Popup contact** : état ouvert/fermé, ouverture au clic sur les CTA listés ci-dessus (avec `preventDefault`), fermeture au clic sur l'overlay ou le bouton ×, propagation de clic bloquée sur la carte elle-même pour ne pas fermer en cliquant dedans.
5. Smooth scroll natif (`scroll-behavior: smooth` en CSS) pour les ancres restantes (nav, "Découvrir mon parcours").

## Responsive
- Toutes les grids 2-colonnes utilisent `repeat(auto-fit, minmax(340px, 1fr))` → passent naturellement en 1 colonne sous ~700px de large.
- La nav doit passer en menu compact/burger sous mobile si les liens ne tiennent plus sur une ligne (à toi de juger du breakpoint, ~900px probable).
- Vérifier que les tailles de police avec `clamp()` restent lisibles sur petit écran (16px+ minimum pour le corps de texte).

## Assets à copier dans le projet
Tous dans `reference/assets/` de ce dossier de handoff :
- `hero-action2.jpg` — photo hero plein cadre
- `palmares-podium2.jpg` — photo podium Championnats d'Europe
- `objectif-portrait.jpg` — portrait section Objectif
- `qui-suis-je2.jpg` — photo actuelle (canoë biplace en course)
- `qui-suis-je-enfant.jpg` — photo enfant (pour le slider avant/après)
- `partenaire-edf2.jpg` — photo section Partenariat
- `dans-le-bateau.mp4` — **vidéo à fournir par le client, pas encore livrée** ; prévoir le chemin `assets/dans-le-bateau.mp4` et un état "vidéo indisponible" propre côté UI tant qu'elle n'est pas là.

## Fichiers de ce dossier
- `reference/Site Sponsoring Loig.dc.html` — fichier de référence complet (structure, styles inline, JS) à ne pas copier tel quel (contient du templating propriétaire), mais à lire pour toute ambiguïté de layout/style non couverte ci-dessus.
- `reference/assets/` — tous les visuels sources.

# Site de sponsoring — Loïg Le Guennec

Site vitrine statique une-page pour **Loïg Le Guennec**, athlète canoë-kayak (descente de rivière, Équipe de France), en vue de l'objectif **Graz 2027 — double titre mondial U18**.

## Stack

HTML / CSS / JS vanilla. Aucune dépendance, aucun build. Le site se déploie tel quel sur n'importe quel hébergeur statique.

```
index.html      structure et contenu
styles.css      design tokens + mise en page
script.js       nav, palmarès, comparateur, popup contact, configurateur
assets/         visuels optimisés + vidéo embarquée
favicon.svg
robots.txt
```

## Lancer en local

```bash
python -m http.server 8000
# puis http://localhost:8000
```

Un simple double-clic sur `index.html` fonctionne aussi, mais l'embed Instagram se comporte mieux servi en HTTP.

## Déploiement

**GitHub Pages** — Settings → Pages → Source : `Deploy from a branch`, branche `main`, dossier `/ (root)`.

**Vercel / Netlify** — importer le dépôt, aucun build command, output directory = racine.

## Contenu

| Section | Ancre |
| --- | --- |
| Hero | `#top` |
| Palmarès | `#palmares` |
| Objectif Graz 2027 | `#objectif` |
| Qui suis-je (comparateur avant/après) | `#qui-suis-je` |
| Embarquez avec moi (Instagram) | `#embarque` |
| Dans le bateau (vidéo) | `#bateau` |
| Partenariat | `#partenariat` |
| Contreparties | `#contreparties` |
| Configurateur d'emplacements | `#emplacements` |
| Contact | `#contact` |

Tous les CTA « Devenir partenaire » / « Me contacter » ouvrent la popup contact (email, téléphone, Instagram). Pas de backend, pas de formulaire.

## Configurateur d'emplacements sponsors

Section `#emplacements` : une entreprise dépose son logo (glisser-déposer sur desktop, bouton sur mobile) sur une vue 2D du bateau et voit immédiatement le rendu.

- **Les deux vues affichées ensemble** — profil (coque) et dessus (pont), pour juger le rendu sur les deux faces d'un coup d'œil.
- **Six emplacements prédéfinis** — trois par vue, calés sur la géométrie réelle des coques. Chacun porte un nom, une dimension et une note de visibilité, et devient donc une contrepartie identifiable à négocier.
- **100 % côté navigateur** — le logo est lu via `URL.createObjectURL()`. Rien n'est téléversé, aucun serveur n'est sollicité. C'est un argument à mettre en avant auprès des marques.
- **Export PNG en 2×** — bouton « Télécharger l'image » : les deux vues, tous les logos posés, un titre et les coordonnées de Loïg, composés via `<canvas>` en une seule image à joindre à un dossier.

Pour modifier les emplacements (position, taille, texte), tout est dans la constante `VIEWS` en haut du module configurateur de `script.js`. Les coordonnées `x`, `y`, `w`, `h` sont en pourcentage de la boîte de l'image du bateau — elles ont été relevées sur une grille posée sur les rendus, pas estimées à l'œil.

## Vidéo « Dans le bateau »

`assets/dans-le-bateau.mp4` — 1920×1080, 82 s, H.264. La section `#bateau` et son lien de navigation sont révélés par `script.js` **uniquement si le navigateur parvient à lire le fichier** ; en son absence, rien de cassé n'apparaît côté public.

⚠️ **Le fichier pèse 91 Mo, soit ~9,3 Mbit/s.** C'est du débit GoPro brut, pas du débit web :

- chaque visiteur qui lance la lecture télécharge 91 Mo ;
- GitHub avertit au-delà de 50 Mo par fichier et refuse au-delà de 100 Mo — la marge est mince ;
- l'atome `moov` est en fin de fichier (pas de `faststart`), donc le démarrage de lecture est plus lent qu'il ne devrait.

Pour le ramener à ~15 Mo sans perte visible, avec ffmpeg :

```bash
ffmpeg -i assets/dans-le-bateau.mp4 \
  -c:v libx264 -crf 24 -preset slow -pix_fmt yuv420p -vf "scale=1920:-2" \
  -c:a aac -b:a 128k -movflags +faststart \
  assets/dans-le-bateau-web.mp4
```

Alternative : héberger la vidéo sur YouTube ou Vimeo et remplacer la balise `<video>` par l'embed correspondant — bande passante et lecture adaptative gérées pour vous.

## Design tokens

| Rôle | Valeur |
| --- | --- |
| Fond principal | `#0f0f1c` |
| Fond header / footer | `#000d10` |
| Accent (terracotta) | `#bc7155` |
| Texte secondaire | `rgba(255,255,255,0.6)` |
| Bordures | `rgba(255,255,255,0.15)` |
| Police | `'Helvetica Neue', Arial, sans-serif` |

L'accent est piloté par la variable CSS `--accent` dans `styles.css` — variantes prévues : `#a85f42`, `#c17b52`, `#8e5a3f`.

## Assets

Les photos de `assets/` sont des versions optimisées pour le web (redimensionnées, JPEG q82 — 18 Mo → 1,8 Mo). Les originaux pleine résolution restent dans `photo sponso/` et `Desingclaudedesing/`, exclus du dépôt via `.gitignore`.

`bateau-profil.png` et `bateau-pont.png` sont les deux vues du kayak détourées sur fond transparent, utilisées par le configurateur.

La spécification de design complète est conservée dans [docs/design-handoff.md](docs/design-handoff.md).

## Contact

- leguennec.loig@gmail.com
- 06 63 63 33 69
- [@loig.lgc](https://instagram.com/loig.lgc)

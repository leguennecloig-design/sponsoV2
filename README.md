# Site de sponsoring — Loïg Le Guennec

Site vitrine statique une-page pour **Loïg Le Guennec**, athlète canoë-kayak (descente de rivière, Équipe de France), en vue de l'objectif **Graz 2027 — double titre mondial U18**.

## Stack

HTML / CSS / JS vanilla. Aucune dépendance, aucun build. Le site se déploie tel quel sur n'importe quel hébergeur statique.

```
index.html      structure et contenu
styles.css      design tokens + mise en page
script.js       nav, palmarès dépliable, comparateur, popup contact
assets/         visuels optimisés
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
| Contact | `#contact` |

Tous les CTA « Devenir partenaire » / « Me contacter » ouvrent la popup contact (email, téléphone, Instagram). Pas de backend, pas de formulaire.

## Vidéo « Dans le bateau »

La section `#bateau` **et son lien de navigation sont masqués tant que la vidéo n'est pas disponible** — aucun placeholder n'est visible côté public. `script.js` révèle la section automatiquement dès que le navigateur parvient à lire `assets/dans-le-bateau.mp4`.

Pour l'activer :

1. Encoder la rush source (`vidéo embarqué/GH010894.mov`, 467 Mo) en H.264 / AAC, ~1080p, quelques dizaines de Mo :

   ```bash
   ffmpeg -i "GH010894.mov" -t 90 -vf "scale=1920:-2" \
     -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p \
     -c:a aac -b:a 128k -movflags +faststart \
     assets/dans-le-bateau.mp4
   ```

2. GitHub refuse les fichiers > 100 Mo. Deux options :
   - garder le fichier sous ~50 Mo et retirer la ligne `assets/dans-le-bateau.mp4` du `.gitignore` ;
   - ou héberger la vidéo ailleurs (YouTube, Vimeo, Cloudflare Stream) et remplacer la balise `<video>` de `index.html` par l'embed correspondant.

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

Les visuels de `assets/` sont des versions optimisées pour le web (redimensionnées, JPEG q82 — 18 Mo → 1,8 Mo). Les originaux pleine résolution restent dans `photo sponso/` et `Desingclaudedesing/`, exclus du dépôt via `.gitignore`.

La spécification de design complète est conservée dans [docs/design-handoff.md](docs/design-handoff.md).

## Contact

- leguennec.loig@gmail.com
- 06 63 63 33 69
- [@loig.lgc](https://instagram.com/loig.lgc)

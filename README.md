# MyTinyParams

Raccourcit les paramètres d'une URL **sans toucher au domaine ni au chemin**, tout en gardant les campagnes de suivi (UTM, gclid, fbclid…) intactes.

```
https://www.exemple.fr/offres?utm_source=newsletter&utm_medium=email&utm_campaign=soldes_2026
https://www.exemple.fr/offres?tp=s:!nl,m:!em,c:soldes_2026
```

## Principe

- Les paramètres sont regroupés dans un seul paramètre (`tp` par défaut), avec dictionnaire de clés/valeurs courantes et alias personnalisés.
- Encodage **réversible et sans état** (pas de base de données).
- Le site cible installe un petit décodeur (onglet *Intégration*) qui restaure les paramètres d'origine via `history.replaceState` **avant** GA4 / GTM / pixels.
- Les dictionnaires intégrés sont gelés (format v1) : on peut en ajouter, jamais en modifier.

## PWA et langues

- **Installable** (manifeste + service worker, fonctionne hors ligne) : invitation flottante « Installer » sur Chromium, instructions « Partager → Sur l'écran d'accueil » sur Safari iPhone/iPad, carte dans *Réglages*. Même logique que Lumélia Tile. Une nouvelle version s'installe à la demande (bandeau « Recharger »).
- **Bilingue fr / en** : langue du navigateur au premier lancement, puis choix mémorisé (FR | EN en haut à droite). Les textes sont dans `src/i18n/` ; `fr.ts` fait foi, `en.ts` doit avoir les mêmes clés (vérifié par le compilateur et par un test).
- **Icônes et logo** : générés depuis `design/` par `npm run icons` (à relancer si le design change).

## Développement

```bash
npm install
npm run dev     # http://localhost:5173
npm test        # codec + équivalence du snippet décodeur
npm run build
npm run preview  # build de production avec service worker (pour tester la PWA)
npm run icons    # régénère les icônes depuis design/
```

## Déploiement (Netlify)

Le site est servi par Netlify depuis ce dépôt (`netlify.toml` : build `npm run build`, publication de `dist/`, Node 22).
Le service worker, le manifeste et `index.html` ne sont jamais mis en cache (sinon une nouvelle version n'est pas détectée) ; les fichiers `assets/` le sont durablement.
`/version.json` indique la version réellement en ligne. La CI GitHub (`.github/workflows/ci.yml`) lance les tests et le build à chaque push.


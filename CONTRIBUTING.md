# Contributing / Contribuer

Thanks for your interest! / Merci de votre intérêt !

## Setup

```bash
git clone https://github.com/rodolphe37/my-tiny-params.git
cd my-tiny-params
npm install
npm run dev      # http://localhost:5173
npm test         # codec + decoder snippet equivalence + i18n parity
npm run build    # type-check + production build (PWA included)
```

Node 22 (see `.nvmrc`).

## Ground rules

1. **The link format is frozen (v1).** Links already shared in the wild must keep decoding. `KEY_CODES` and `VALUE_CODES`
   in `src/lib/dictionary.ts` are **append-only**: add entries, never change or remove one.
2. **Encoder and decoder move together.** The standalone decoder snippet (`src/lib/snippet.ts`) is tested for equivalence
   with `decodeUrl`; keep it that way.
3. **Both languages.** Every user-facing text goes in `src/i18n/fr.ts` *and* `src/i18n/en.ts` (the compiler and a test enforce it).
4. **Tests.** Add or update tests with your change (`src/lib/codec.test.ts`).
5. **Version.** Bump `version` in `package.json` and `package-lock.json` (patch for a fix, minor for a feature).

## Pull requests

Fork, create a branch, open a PR against `main`. The CI runs the tests and the build.
Small, focused PRs are easiest to review. For big changes, open an issue first.

## License

By contributing you agree that your contribution is licensed under the [MIT license](LICENSE).
The name, logo and icon in `design/` are not covered by it (see [design/README.md](design/README.md)).

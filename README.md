# Celestia documentation

Official documentation for Celestia, the modular blockchain powering unstoppable apps with full-stack control.

- Live site: https://docs.celestia.org
- LLMs.txt: https://docs.celestia.org/llms.txt
- Built with: Next.js + Nextra (MDX), exported as a static site.

## Local development

Prereqs: Node.js 20+ and Yarn.

```bash
yarn install
yarn dev
```

Open http://localhost:3000

## Build & preview the static export

`next.config.mjs` is configured for static export (`output: 'export'`). Builds write to `out/` and generate a Pagefind search index in `out/_pagefind/`.

```bash
yarn build
yarn start
```

## Base paths (deploying under a subpath)

For deployments that live under a subdirectory (e.g. GitHub Pages previews), set:

- `BASE` with a trailing slash (used for `assetPrefix`)
- `NEXT_PUBLIC_BASE_PATH` without a trailing slash (used by client-side components for asset URLs)

```bash
BASE=/docs-preview/new_docs/ NEXT_PUBLIC_BASE_PATH=/docs-preview/new_docs yarn build
```

## Content & structure

- `app/**/page.mdx`: documentation pages
- `app/**/_meta.js`: sidebar order/titles
- `public/`: static assets
- `constants/*.json`: shared values referenced in MDX (e.g. `{{mainnetVersions['app-latest-tag']}}`), replaced by `plugins/remark-replace-variables.mjs`

## Useful scripts

- `yarn lint`: lint the codebase (also runs on `git push` via hook)
- `yarn check-links -- --all`: validate internal + external links (see `scripts/check-links.mjs --help`)
- `yarn generate:llms`: generate `public/llms.txt` (ignored by git) for ingestion tools/LLMs

## Deployment

GitHub Actions workflows in `.github/workflows/` build the site and publish `out/` for production and preview deployments.

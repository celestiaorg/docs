# GitHub Actions workflows

This directory contains the workflows used to lint, deploy, and keep release metadata up to date for the docs site.

## `deploy.yml` — Deploy Docs (Nextra) to GitHub Pages

- **Triggers:** `push` to `main`, or manual `workflow_dispatch`.
- **What it does:** installs deps (Node 20 + Yarn), runs `yarn generate:llms`, builds the static site (`yarn build`), then publishes `out/` to the `gh-pages` branch via `peaceiris/actions-gh-pages`.
- **Notes:** writes `out/.nojekyll` and sets `cname: docs.celestia.org`.

## `preview.yaml` — Deploy PR Preview

- **Triggers:** pull requests (`opened`, `reopened`, `synchronize`, `closed`).
- **What it does (PR open/updated):** builds the site with a PR-specific base path (`/docs-preview/pr-<number>/`), commits the build output into `celestiaorg/docs-preview` under `pr-<number>/`, then posts/updates a PR comment with the preview URL.
- **What it does (PR closed):** deletes the corresponding `pr-<number>/` directory from `celestiaorg/docs-preview`.
- **Required secret:** `PR_PREVIEW_DEPLOY` (token with write access to `celestiaorg/docs-preview`).

## `lint.yaml` — Lint & Link Check

- **Triggers:** `push`/`pull_request` on `main`, plus a weekly schedule (`0 9 * * 1`).
- **What it does:** runs `npm run lint` and `npm run check-links` (Node 20).

## `latest-tags.yaml` — Latest Tags

- **Triggers:** every 6 hours, or manual `workflow_dispatch` with `network`.
- **What it does:** for each network (`mainnet`, `arabica`, `mocha`), fetches the latest matching GitHub Release tags for `celestiaorg/celestia-app` and `celestiaorg/celestia-node`, resolves them to commit SHAs, updates `constants/<network>_versions.json`, and opens a PR if values changed.
- **Required secret:** `PAT_CREATE_PR` (token used by `peter-evans/create-pull-request` to push a branch and open a PR in this repo). Uses `GITHUB_TOKEN` for API reads.

## Notes

- `pages-build-deployment` is a GitHub Pages system workflow entry and is not defined in this repo.

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
- **What it does:** runs `npm run lint`, `npm run test:releases`, and `npm run check-links` (Node 20).

## `latest-tags.yaml` — Latest Tags

- **Triggers:** every 6 hours, or manual `workflow_dispatch` with `network`.
- **What it does:** for each network (`mainnet`, `mocha`), selects the highest numeric major/minor/patch release for celestia-app and celestia-node. Updates `constants/<network>_versions.json` and opens or updates the network's PR only for an upgrade. GitHub release ordering does not determine eligibility. Scheduled and manual runs for the same network are serialised and reuse the same PR branch.
- **Review policy:** minor and major upgrades are proposed automatically, rather than silently excluded by a series pin. Review upstream release notes and network compatibility before merging any release PR; published software does not establish network activation. The PR body and Actions summary flag major/minor transitions. Intentional rollbacks require a manual constants change.
- **Channels:** Mainnet Beta follows unsuffixed stable releases; Mocha follows only `-mocha` releases (including releases marked as prereleases on GitHub). For example, `v0.33.4-mocha` can advance to `v0.34.0-mocha`, but never to `v0.34.0`. Drafts, release candidates and other network channels are not selected.
- **Safeguards:** never downgrade; reject missing or malformed current metadata, unavailable current releases, API errors, and changed SHAs for existing tags. Files are written only after both components validate. Skipped releases and no-op runs are recorded in the Actions summary without creating PRs.
- **Tests:** `npm run test:releases` exercises selection and update planning with API fixtures; it also runs in PR CI.
- **Required secret:** `PAT_CREATE_PR` (token used by `peter-evans/create-pull-request` to push a branch and open a PR in this repo). Uses `GITHUB_TOKEN` for API reads.

## Notes

- `pages-build-deployment` is a GitHub Pages system workflow entry and is not defined in this repo.

# GitHub Actions workflows

This directory contains the workflows used to lint, deploy, preview, and keep release metadata up to date for the docs site.

## `deploy-cloudflare.yml` — Deploy to Cloudflare Pages

- **Triggers:** pushes to `main`, same-repository PRs, or manual `workflow_dispatch`.
- **Production:** deploys `main` to the permanent Pages project (`celestia-docs` by default).
- **Previews:** uses `pr-<pr_number>` aliases; manual non-main runs use a stable branch hash. Fork PR deployments are skipped.
- **Build:** sets the deployment origin, enables MCP, verifies the artifact and tests the Worker. Previews get noindex HTML and a disallow-all robots file.
- **Deploy:** verifies the project production branch is `main`, uploads with Wrangler, smoke-tests the deployed pages and MCP, and records URLs in the run summary.
- **Required secrets:** `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. Missing secrets fail the run.
- **Optional variable:** `CLOUDFLARE_PAGES_PROJECT` overrides the project name.
- Production runs are allowed to finish; obsolete preview runs are cancelled.

## `deploy.yml` — Manual GitHub Pages rollback

- **Trigger:** manual `workflow_dispatch` only.
- Builds the selected ref and publishes `out/public/` to `gh-pages` with `docs.celestia.org` as the CNAME.
- Retained during the Cloudflare cutover. Ordinary merges no longer overwrite the existing GitHub Pages site.

## `preview.yaml` — Manual legacy PR preview

- **Trigger:** manual `workflow_dispatch` only, with `pr_number` and `action` (`publish` or `remove`).
- Publishes the selected ref to `celestiaorg/docs-preview`, or removes an old preview.
- Requires `PR_PREVIEW_DEPLOY`. Retained for rollback and cleanup; Cloudflare handles automatic previews.

See [the cutover runbook](../CLOUDFLARE-CUTOVER.md) before switching the domain or retiring these workflows.

## `lint.yaml` — Lint & Link Check

- **Triggers:** `push`/`pull_request` on `main`, plus a weekly schedule (`0 9 * * 1`).
- **What it does:** runs Bun type, lint, release-selection, Fibre response, generated Markdown, and link checks.

## `latest-tags.yaml` — Latest Tags

- **Triggers:** every 6 hours, or manual `workflow_dispatch` with `network`.
- **What it does:** for each network (`mainnet`, `mocha`), selects the highest numeric patch release within the approved major/minor series in `constants/release-policy.json` for celestia-app and celestia-node. Updates `constants/<network>_versions.json` and opens a PR only for an eligible upgrade. GitHub release ordering does not determine eligibility.
- **Compatibility policy:** the initial series match the existing documented versions; this does not independently establish compatibility of every future patch. Review release notes and network compatibility before merging patch PRs. To move to a new major/minor series, verify network activation and software compatibility, then update the policy and the corresponding version constants (tag and commit SHA) together in a maintainer-reviewed PR. Manual workflow runs use the same safeguards. Intentional rollbacks also require a manual constants change.
- **Safeguards:** never downgrade; keep Mainnet and Mocha channels separate; reject missing or malformed current metadata, policy mismatches, unavailable current releases, API errors, and changed SHAs for existing tags. Files are written only after both components validate. Skipped releases and no-op runs are recorded in the Actions summary without creating PRs.
- **Tests:** `npm run test:releases` exercises selection and update planning with API fixtures; it also runs in PR CI.
- **Required secret:** `PAT_CREATE_PR` (token used by `peter-evans/create-pull-request` to push a branch and open a PR in this repo). Uses `GITHUB_TOKEN` for API reads.

## Notes

- `pages-build-deployment` is a GitHub Pages system workflow entry and is not defined in this repo.

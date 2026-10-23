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

The legacy GitHub Pages deployment and preview workflows have been removed.
`gh-pages`, `celestiaorg/docs-preview` and `PR_PREVIEW_DEPLOY` are no longer used
by these workflows. Cloudflare handles both production and previews.

See [the cutover runbook](../CLOUDFLARE-CUTOVER.md) for migration history and production verification.

## `lint.yaml` — Lint & Link Check

- **Triggers:** `push`/`pull_request` on `main`, plus a weekly schedule (`0 9 * * 1`).
- **What it does:** runs Bun type, lint, release-selection, Fibre response, generated Markdown, and link checks.

## `consensus-docker.yml` — Consensus Docker smoke test

- **Triggers:** pull requests changing the consensus Docker guide, its smoke test, or network/version constants; manual `workflow_dispatch`.
- **What it does:** runs the guide's commands on Ubuntu 24.04 for Mainnet Beta and Mocha. Loads BBR, completes the verified genesis download, starts the container with `--sysctl`, and checks container BBR, the RPC chain ID, and application gRPC TCP connectivity from the host and a second container.
- **Scope:** startup and connectivity only; does not complete chain sync or connect a light node. Uses disposable node homes and removes its containers and network.
- **Local testing:** `python3 scripts/test-consensus-docker.py mainnet --desktop` tests the guide's Docker Desktop bypass. Omit `--desktop` on a Linux Docker host with sudo and BBR support. The test requires the names `celestia-app` and `celestia-network` to be unused.

## `latest-tags.yaml` — Latest Tags

- **Triggers:** every 6 hours, manual `workflow_dispatch` with `network`, or a `push` to `main` that changes `constants/*_versions.json`. After one network PR merges, the push run regenerates the other network's PR from current `main` to repair conflicts in the shared API manifest and skill links.
- **What it does:** for each network (`mainnet`, `mocha`), selects the highest numeric major/minor/patch release for celestia-app and celestia-node. Updates `constants/<network>_versions.json`, downloads the matching published OpenRPC asset, generates celestia-app OpenAPI from the Mainnet Beta tag and commit (with its locked protobuf dependencies), updates `constants/node_api_versions.json`, and regenerates `public/SKILL.md` in the same PR. Previous API versions remain in the dropdown. It also repairs API spec drift without a new tag update; unchanged runs create no PR. GitHub release ordering does not determine eligibility. Runs for the same network are serialised, check out current `main`, and reuse the same PR branch.
- **Review policy:** minor and major upgrades are proposed automatically, rather than silently excluded by a series pin. Review upstream release notes and network compatibility before merging any release PR; published software does not establish network activation. The PR body and Actions summary flag major/minor transitions. Intentional rollbacks require a manual constants change.
- **Channels:** Mainnet Beta follows unsuffixed stable releases; Mocha follows only `-mocha` releases (including releases marked as prereleases on GitHub). For example, `v0.33.4-mocha` can advance to `v0.34.0-mocha`, but never to `v0.34.0`. Drafts, release candidates and other network channels are not selected.
- **Safeguards:** never downgrade; reject missing or malformed current metadata, unavailable current releases, API errors, and changed SHAs for existing tags. Network constants are written only after both components validate. Missing, malformed, or wrong-version OpenRPC assets, failed OpenAPI generation, and OpenAPI validation errors stop the job before it can open or update a PR. `bun run check:app-api` also prevents a constants/spec mismatch in CI and builds. Skipped releases and no-op runs are recorded in the Actions summary without creating PRs.
- **Tests:** `bun run test:releases` exercises release selection, update planning, spec synchronisation, and refresh after either network merges with API fixtures; it also runs in PR CI.
- **Required secret:** `PAT_CREATE_PR` (token used by `peter-evans/create-pull-request` to push a branch and open a PR in this repo). Uses `GITHUB_TOKEN` for API reads.

## Notes

- `pages-build-deployment` is a GitHub Pages system workflow entry and is not defined in this repo.

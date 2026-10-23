[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/celestiaorg/docs)
[![Discord](https://img.shields.io/discord/638338779505229824)](https://discord.com/invite/YsnTPcSfWQ)
[![Follow on X](https://img.shields.io/twitter/follow/celestia)](https://x.com/celestia)
[![CodeQL](https://github.com/celestiaorg/docs/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/celestiaorg/docs/actions/workflows/github-code-scanning/codeql)
[![Deploy](https://github.com/celestiaorg/docs/actions/workflows/deploy-cloudflare.yml/badge.svg)](https://github.com/celestiaorg/docs/actions/workflows/deploy-cloudflare.yml)
[![Lint & link Check](https://github.com/celestiaorg/docs/actions/workflows/lint.yaml/badge.svg)](https://github.com/celestiaorg/docs/actions/workflows/lint.yaml)

# Celestia documentation

Welcome to the official documentation repository for [Celestia](https://celestia.org/).

- Live site: https://docs.celestia.org

## LLM and agent support

### Quick reference for AI agents

```
Celestia Documentation Access:
- Clean markdown: Add .md to any URL (e.g., https://docs.celestia.org/learn/TIA/overview.md)
- LLMs.txt: https://docs.celestia.org/llms.txt
- Skill file: https://docs.celestia.org/SKILL.md
- CIPs: https://cips.celestia.org
- DeepWikis: https://deepwiki.com/celestiaorg/docs, https://deepwiki.com/celestiaorg/cips, https://deepwiki.com/celestiaorg/celestia-app, https://deepwiki.com/celestiaorg/celestia-node
```

### Resources

- LLMs.txt: https://docs.celestia.org/llms.txt
- Skill file: https://docs.celestia.org/SKILL.md (served from `public/SKILL.md`)
- CIPs (Celestia Improvement Proposals): https://cips.celestia.org
- Built with: Vocs v2 (MDX), Vite, and Bun, exported as a static site.
- Resource manifest: `/.well-known/ard.json` advertises the existing Celestia skill using Agentic Resource Discovery.
- API catalog: `/.well-known/api-catalog` lists bundled Node API specifications as `item` links.
- Each exported HTML page advertises its Markdown URL with `rel="alternate"` and `type="text/markdown"`. The root page uses `/index.md`; `/llms.md` provides a Markdown discovery index.
- **LLM-ready**: Add `.md` to any URL to get clean markdown (e.g., `https://docs.celestia.org/learn/TIA/overview` → `https://docs.celestia.org/learn/TIA/overview.md`)
- DeepWikis for @celestiaorg:
    - https://deepwiki.com/celestiaorg/docs
    - https://deepwiki.com/celestiaorg/cips
    - https://deepwiki.com/celestiaorg/celestia-app
    - https://deepwiki.com/celestiaorg/celestia-node

### Checking agent readiness

Run `bun run test:llms` to check Markdown conversion, generated discovery resources,
and the Fibre walkthrough. Every `bun run build` also checks that each sitemap page
advertises its matching Markdown file, canonical production URL, and the ARD manifest.
Homepage checks cover raw HTML content, heading order, metadata, and JSON-LD. Markdown links stay
on the current deployment, including previews. These checks run in the lint and
deployment workflows.

Compare production using both [Is Agentic](https://is-agentic.com/scan/docs.celestia.org)
and [Is Your Site Agent-Ready?](https://isitagentready.com/docs.celestia.org?profile=content).
Use Cloudflare's Content Site profile for this public documentation site. Record
scan dates, failed URLs, response codes, and individual checks alongside scores;
the scanners use different criteria and can receive different bot challenges.
The HTML declares `is-agentic-site-type=content` for Is Agentic's default view.
The website-only `/.well-known/poppy.json` manifest describes public browsing;
it does not advertise authenticated sessions or an agent service.

The Pages Worker serves generated Markdown at normal page URLs when clients
prefer `Accept: text/markdown`, adds discovery `Link` headers, and sets the API
catalog media type. This does not require Cloudflare's paid Markdown converter.
Follow the [cutover runbook](.github/CLOUDFLARE-CUTOVER.md) to deploy it on the
production domain. The [agent readiness guide](config/cloudflare/README.md)
covers verification, crawler challenges, and scanner applicability.

OAuth, payments, and agent execution protocols should only be advertised when
those services actually exist. Node RPC specifications use OpenRPC; they are not
OpenAPI specifications for a REST API hosted on the documentation domain.

## Local development

Prereqs: Node.js 22+ and Bun 1.3+.

```bash
bun install
bun run dev
```

Open http://localhost:5173

## Build & preview the static export

Vocs is configured for full static rendering. Builds write the browser-ready site to `out/public/`.

```bash
bun run build
bun run preview
```

## Cloudflare Pages deployment

Cloudflare is the automatic deployment target: pushes to `main` publish production,
and same-repository pull requests publish previews at
`https://pr-<pr_number>.<pages_project_host>`. Fork PRs run validation without
receiving deployment secrets. Both production and previews include `/mcp` and
`/api/mcp`, served by `worker/index.js` alongside the static site.

The workflow defaults to the permanent project `celestia-docs`. Set the repository
variable `CLOUDFLARE_PAGES_PROJECT` to override the project name. The workflow
creates the project if needed, verifies that its production branch is `main`,
and obtains its actual Pages hostname before building.

Required repository secrets: `CLOUDFLARE_API_TOKEN` (Cloudflare Pages Edit) and
`CLOUDFLARE_ACCOUNT_ID`. Missing credentials fail the deployment explicitly.

```bash
# Build a preview locally; use the actual Pages project hostname.
VOCS_BASE_URL=https://pr-2536.celestia-docs.pages.dev DOCS_PREVIEW=1 bun run prepare:cloudflare
VOCS_BASE_URL=https://pr-2536.celestia-docs.pages.dev DOCS_PREVIEW=1 bun run test:cloudflare
```

`VOCS_BASE_URL` sets navigation, canonical and generated discovery URLs.
`DOCS_PREVIEW=1` adds HTML noindex metadata and a disallow-all `robots.txt`.
Production defaults to `https://docs.celestia.org`. Deployment URLs are recorded
in the Actions run summary and tested after upload.

Follow [.github/CLOUDFLARE-CUTOVER.md](.github/CLOUDFLARE-CUTOVER.md) for the
cutover history and verification procedure. Cloudflare now serves production
and previews; the legacy GitHub Pages workflows have been removed.

## Base paths (deploying under a subpath)

For deployments that live under a subdirectory, set:

- `BASE` with a trailing slash (used by Vocs as the base path)

```bash
BASE=/docs/ bun run build
```

## Content & structure

- `app/**/page.mdx`: documentation pages
- `app/**/_meta.js`: sidebar order/titles
- `src/vocs/`: Vocs runtime glue, compatibility components, and generated-page templates
- `src/pages/`: generated Vocs page tree, created by `bun run prepare:vocs` and ignored by git
- `public/`: static assets, including the published agent skill at `public/SKILL.md`
- `constants/*.json`: shared values referenced in MDX (e.g. `{{mainnetVersions['app-latest-tag']}}`), replaced by `plugins/remark-replace-variables.mjs`

## Useful scripts

- `bun run prepare:vocs`: generate the Vocs `src/pages` tree from `app`
- `bun run lint`: lint the codebase (also runs on `git push` via hook)
- `bun run check-links -- --all`: validate internal + external links (see `scripts/check-links.mjs --help`)
- `bun run typecheck`: check TypeScript compatibility
- `bun run test:static`: verify exported pages, sidebar destinations, and asset paths after building (use the same `BASE` as the build)
- `bun run test:mcp`: test the MCP worker against the generated search index after building
- `bun run generate:llms`: generate LLM-ready markdown files from MDX sources
  - Creates clean `.md` versions of all documentation pages
  - Removes JSX components, imports, and MDX-specific syntax
  - Automatically runs during build process (`bun run build`)
  - Access any doc page as markdown by adding `.md` to the URL

### Updating bundled Node API specs

The Latest Tags workflow includes the matching upstream `openrpc.json`, API manifest,
and generated skill links in each release update PR. It also repairs stale specs
when the network versions have already been updated.

After manually updating the node tag and SHA in `constants/<network>_versions.json`,
run `bun run sync:node-api`. This downloads the published release spec, preserves the
previous version in the API dropdown, updates `constants/node_api_versions.json`,
and runs `bun run generate:skill`. Missing or invalid release assets fail the update.
The manifest drives the API dropdown, Fibre reference links, LLM index, API catalog,
and the version links in `public/SKILL.md`.

CI runs `bun run check:skill` to reject network/API version drift, stale skill links, missing or invalid specs,
and RPC methods in the skill that are absent from either current spec. It checks
availability, not behavioural compatibility or network activation; review method
guidance and release requirements when updating specs. Edit the skill's prose
outside the generated markers; its existing symlink remains the shared source.

## Contribution guidelines

We love contributions from the community! Whether you're fixing typos, improving clarity, or adding new topics, every contribution helps.

- Fork & clone: fork this repository and clone it locally
- Branch: create a new branch for your changes
- Commit: use clear, concise commit messages
- PR: push to your fork and open a pull request

Please review the full contribution guidelines before opening a PR:
https://github.com/celestiaorg/.github/blob/main/CONTRIBUTING.md#external-contributions

## Documentation standards

This section outlines the standards and guidelines for maintaining consistent, high-quality documentation across the Celestia project.

### Styling rules

- **Sentence case**: use sentence case for headings and titles (reference: https://github.com/celestiaorg/docs/issues/161)
- **No “click here”**: avoid using “click here” for link text (reference: https://github.com/celestiaorg/docs/issues/1073)
- **International English**: use international (common) English spelling and terminology
- **Node types**: use lowercase for node types (e.g., “bridge node”, not “Bridge Node”)
- **Politeness**: avoid using “please” in instructional content
- **Unique headings**: ensure no duplicate headings within a document
- **Network references**: use "Mainnet Beta" network (note the specific capitalization)
- **Latin abbreviations**: use italicized _i.e._ or _e.g._ instead of plain i.e. or e.g.
- **Code references**: use “celestia-app” in regular text (not inline code) when referring to the application name
- **Tab ordering**: when using network tabs, order them as: Mainnet Beta, Mocha
- **Placeholders**: use angle brackets with underscores for placeholders: `<flag_name>` not `<flag-name>` or `<flag name>`

### Documentation update procedures

When updating documentation:

1. **Run automation**: execute any available automation tools before manual updates
2. **Chain ID updates**: if there are chain-id breaking changes:
   - Update all chain-id references throughout the documentation
   - Search comprehensively to ensure no references are missed
   - Reference example: https://github.com/celestiaorg/docs/pull/857/files#diff-7c3322aa40bebbde7be394c354f900d6b5606eabbd03ac0d661f7565fcadcb70
3. **Release notes review**: read release notes to identify and implement breaking changes that affect documentation
4. **Process reference**: documentation update process video: https://www.loom.com/share/0d6897939b654b60b766887b37f86790

### Documentation requirements for software

All software documentation must include:

- **Proof of functionality** (passing CI checks, manual testing evidence, block explorer links where applicable)
- **Comprehensive setup** (complete setup and usage instructions)
- **Troubleshooting** (common issues and solutions)
- **Version compatibility** (clearly state supported versions)

### Link format guidelines

When adding internal links to documentation, use root-relative links with an optional section anchor:
`[link text](/path/to/page/#section-id)`

## Directory structure

- `app/learn`: learn about Celestia
- `app/build`: build on Celestia (including API/RPC references)
- `app/operate`: run and maintain nodes and infrastructure

## Deployment

GitHub Actions workflows in `.github/workflows/` build the site and publish `out/public/` for production and preview deployments.

## Feedback & suggestions

If you find any discrepancies or have suggestions, please open an issue in this repository.

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/celestiaorg/docs)
[![Discord](https://img.shields.io/discord/638338779505229824)](https://discord.com/invite/YsnTPcSfWQ)
[![Follow on X](https://img.shields.io/twitter/follow/celestia)](https://x.com/celestia)
[![CodeQL](https://github.com/celestiaorg/docs/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/celestiaorg/docs/actions/workflows/github-code-scanning/codeql)
[![Deploy](https://github.com/celestiaorg/docs/actions/workflows/deploy.yml/badge.svg)](https://github.com/celestiaorg/docs/actions/workflows/deploy.yml)
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
- DeepWikis: https://deepwiki.com/celestiaorg/docs
```

### Resources

- LLMs.txt: https://docs.celestia.org/llms.txt
- Built with: Next.js + Nextra (MDX), exported as a static site.
- **LLM-ready**: Add `.md` to any URL to get clean markdown (e.g., `https://docs.celestia.org/learn/TIA/overview` → `https://docs.celestia.org/learn/TIA/overview.md`)
- DeepWikis for @celestiaorg:
    - https://deepwiki.com/celestiaorg/docs
    - https://deepwiki.com/celestiaorg/cips
    - https://deepwiki.com/celestiaorg/celestia-app
    - https://deepwiki.com/celestiaorg/celestia-node

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
- `yarn generate:llms`: generate LLM-ready markdown files from MDX sources
  - Creates clean `.md` versions of all documentation pages
  - Removes JSX components, imports, and MDX-specific syntax
  - Automatically runs during build process (`yarn build`)
  - Access any doc page as markdown by adding `.md` to the URL

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
- **Network names**: use “Arabica devnet”, not “Arabica Devnet”
- **Node types**: use lowercase for node types (e.g., “bridge node”, not “Bridge Node”)
- **Politeness**: avoid using “please” in instructional content
- **Unique headings**: ensure no duplicate headings within a document
- **Network references**: use “Coffee Beta” network (note the specific capitalization)
- **Latin abbreviations**: use italicized _i.e._ or _e.g._ instead of plain i.e. or e.g.
- **Code references**: use “celestia-app” in regular text (not inline code) when referring to the application name
- **Tab ordering**: when using tabs, order them as: Coffee Beta, Mocha, Arabica
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

GitHub Actions workflows in `.github/workflows/` build the site and publish `out/` for production and preview deployments.

## Feedback & suggestions

If you find any discrepancies or have suggestions, please open an issue in this repository.

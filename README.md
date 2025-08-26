[![CodeQL](https://github.com/celestiaorg/docs/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/celestiaorg/docs/actions/workflows/github-code-scanning/codeql)
[![Build](https://github.com/celestiaorg/docs/actions/workflows/build.yml/badge.svg)](https://github.com/celestiaorg/docs/actions/workflows/build.yml)
[![Deploy](https://github.com/celestiaorg/docs/actions/workflows/deploy.yml/badge.svg)](https://github.com/celestiaorg/docs/actions/workflows/deploy.yml)
[![Twitter](https://img.shields.io/twitter/follow/celestia)](https://x.com/celestia)
[![Discord](https://img.shields.io/discord/638338779505229824)](https://discord.com/invite/celestiacommunity)
[![License](https://img.shields.io/badge/License-Apache2.0-green.svg)](https://www.apache.org/licenses/LICENSE-2.0)

# Celestia Documentation Site

Welcome to the official documentation repository for [Celestia](https://celestia.org/).

Here you'll find comprehensive guides, tutorials, and reference materials
to help you make the most out of Celestia.

## Building the site

To get started, clone the repository and run the following:

```bash
yarn && yarn dev
```

This documentation site is built with [VitePress](https://vitepress.dev)

## Link checking

To check for broken links in the documentation, run:

```bash
yarn link-check
```

This uses [lychee](https://github.com/lycheeverse/lychee) to validate all internal and
external links.
The link checker is also run automatically in CI on every push and pull request.

## Contribution guidelines

We love contributions from the community! Whether you're fixing typos,
improving content clarity, or adding new topics, every contribution helps.

- Fork & clone: Fork this repository and clone it to your local machine.
- Branch: Always create a new branch for your changes. Naming it relevantly.
- Commit Changes: Make your changes and commit them with a clear and concise
  commit message.
- Push & Create PR: Push your changes to your fork and create a pull request
  to the main branch of this repository.

Please ensure to review the **[detailed Contribution Guidelines](https://github.com/celestiaorg/.github/blob/main/CONTRIBUTING.md#external-contributions)** before
making a pull request.

## Documentation standards

This section outlines the standards and guidelines for maintaining
consistent, high-quality documentation across the Celestia project.

### Styling rules

- **Sentence case**: Use sentence case for headings and titles
  (reference: [issue #161](https://github.com/celestiaorg/docs/issues/161))
- **No "click here"**: Avoid using "click here" for link text
  (reference: [issue #1073](https://github.com/celestiaorg/docs/issues/1073))
- **International English**: Use international (common) English spelling
  and terminology
- **Network names**: Use "Arabica devnet", not "Arabica Devnet"
- **Node types**: Use lowercase for node types (_e.g._, "bridge node",
  not "Bridge Node")
- **Politeness**: Avoid using "please" in instructional content
- **Unique headings**: Ensure no duplicate headings within a document
- **Network references**: Use "Coffee Beta" network (note the specific
  capitalization)
- **Latin abbreviations**: Use italicized _i.e._ or _e.g._ instead of
  plain i.e. or e.g.
- **Code references**: Use `celestia-app` in regular text, not as inline
  code when referring to the application name
- **Tab ordering**: When using tabs, order them as: Coffee Beta, Mocha,
  Arabica
- **Placeholders**: Use angle brackets with underscores for placeholders:
  `<flag_name>` not `<flag-name>` or `<flag name>`

### Documentation update procedures

When updating documentation:

1. **Run automation**: Execute any available automation tools before
   manual updates
2. **Chain ID updates**: If there are chain-id breaking changes:
   - Update all chain-id references throughout the documentation
   - Search comprehensively to ensure no references are missed
   - Reference example: [chain-id update PR](https://github.com/celestiaorg/docs/pull/857/files#diff-7c3322aa40bebbde7be394c354f900d6b5606eabbd03ac0d661f7565fcadcb70)
3. **Release notes review**: Read through release notes to identify and
   implement any breaking changes that affect documentation
4. **Process reference**: See [documentation update process video](https://www.loom.com/share/0d6897939b654b60b766887b37f86790)

### Documentation requirements for software

All software documentation must include:

- **Proof of functionality**: Demonstrate that the software works through:
  - Passing CI checks
  - Manual testing evidence
  - Links to block explorer (where applicable)
  - Clear, step-by-step instructions for running the software
- **Comprehensive setup**: Provide complete setup and usage instructions
- **Troubleshooting**: Include common issues and their solutions
- **Version compatibility**: Clearly state which versions are supported

### Link format guidelines

When adding internal links to documentation, please use the following format:
`[link text](/base-working-dir/subdir/page.md#section-id)`, i.e. `[link text](/how-to-guides/quick-start.md#get-your-auth-token)`

This format ensures long-term compatibility and consistent behavior across
different platforms and documentation builds.

## Directory structure

- /learn: A category for learning about Celestia.
- /how-to guides: A category with guides for running a node, deploying
  rollups, and building on Celestia.
- /tutorials: A category with tutorials on interacting with celestia-node.
<!-- * /guides [WIP]: In-depth articles that cover specific topics in detail. -->
- /community: A category for the Celestia community.
- /public: Images, diagrams, and other media files used in the documentation.

## Feedback & suggestions

We value feedback from the community. If you have suggestions for improvements
or find any discrepancies in the documentation, please raise an issue in this
repository.

[![CodeQL](https://github.com/celestiaorg/docs/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/celestiaorg/docs/actions/workflows/github-code-scanning/codeql)
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

This uses [lychee](https://lychee.cli.rs/) to validate all internal and external links.
The link checker is also run automatically in CI on every push and pull request.

## Contribution Guidelines

We love contributions from the community! Whether you're fixing typos,
improving content clarity, or adding new topics, every contribution helps.

- Fork & clone: Fork this repository and clone it to your local machine.
- Branch: Always create a new branch for your changes. Naming it relevantly.
- Commit Changes: Make your changes and commit them with a clear and concise
  commit message.
- Push & Create PR: Push your changes to your fork and create a pull request
  to the main branch of this repository.

Please ensure to review the detailed Contribution Guidelines above before
making a pull request.

### Link Format Guidelines

When adding internal links to documentation, please use the following format:
`[link text](/base-working-dir/subdir/page.md#section-id)`, i.e. `[link text](/how-to-guides/quick-start.md#get-your-auth-token)`

This format ensures long-term compatibility and consistent behavior across different platforms and documentation builds.

## Directory Structure

- /learn: A category for learning about Celestia.
- /how-to guides: A category with guides for running a node, deploying
  rollups, and building on Celestia.
- /tutorials: A category with tutorials on interacting with celestia-node.
<!-- * /guides [WIP]: In-depth articles that cover specific topics in detail. -->
- /community: A category for the Celestia community.
- /public: Images, diagrams, and other media files used in the documentation.

## Feedback & Suggestions

We value feedback from the community. If you have suggestions for improvements
or find any discrepancies in the documentation, please raise an issue in this
repository.

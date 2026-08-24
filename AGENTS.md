# Repository instructions

## Scope

These instructions apply to the full repository. `AGENTS.md` is the canonical
instruction file. Keep `CLAUDE.md` as a symlink to this file.

Use the Celestia skill in `.agents/skills/celestia/SKILL.md` when a task needs
Celestia repository routing, current product guidance, or docs guardrails. The
skill is also published from `public/SKILL.md`; keep one source of truth.

## Repository overview

This repository builds the Celestia documentation site with Next.js and Nextra.
The site uses a static export.

- `app/**/page.mdx`: documentation source pages.
- `app/**/_meta.js`: sidebar order and labels.
- `components/`: shared React components.
- `constants/*.json`: frequently changing versions and network values.
- `public/`: static assets and the published Celestia agent skill.
- `scripts/`: validation and generated-output scripts.

Do not edit generated files in `out/`. Edit the source MDX or JavaScript file.

## Setup and commands

Use Node.js 20 or later and Yarn.

```bash
yarn install
yarn dev
```

Use these checks as needed:

```bash
yarn lint
yarn build
yarn check-links -- --all
yarn test:endpoints
yarn generate:llms
```

- Run `yarn lint` before finalizing a change.
- Run `yarn build` for changes that can affect rendering or static export.
- Run `yarn check-links -- --all` when links change.
- Run `yarn test:endpoints` when endpoint validation code changes.
- Run `yarn generate:llms` when generated LLM markdown must be inspected.

## Documentation conventions

- Use sentence case for headings and titles.
- Use international English.
- Use lowercase node type names, such as "bridge node."
- Do not use "click here" as link text.
- Do not use "please" in instructions.
- Keep headings unique within a document.
- Write `Mainnet Beta` and `Mocha` with this capitalization.
- Order network tabs as Mainnet Beta, then Mocha.
- Write placeholders as `<flag_name>`.
- Use root-relative internal links, with an optional section anchor.
- Write `celestia-app` as plain text when naming the application.
- Italicize Latin abbreviations such as _i.e._ and _e.g._.

Put conceptual content in `app/learn`, developer and API content in
`app/build`, and node operator content in `app/operate`.

## Mutable technical information

Do not rely on model memory for current Celestia versions, network parameters,
RPC behavior, or release status. Verify mutable facts against current canonical
sources before changing documentation.

- Store frequently changing versions and network values in `constants/*.json`.
- Search the full MDX tree when a chain ID or network identifier changes.
- Review upstream release notes for breaking software or network changes.
- Distinguish merged code, released binaries, and network activation.

## Change discipline

- Keep each change focused on the requested outcome.
- Preserve unrelated worktree changes.
- Update navigation metadata when adding, moving, or removing a page.
- Include proof of functionality for new software documentation.
- Include setup, troubleshooting, and version compatibility where applicable.
- Use `main` as the pull request base branch.

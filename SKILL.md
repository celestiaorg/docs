---
name: celestia-docs-maintainer
description: Use this skill when creating, updating, or reviewing content in the Celestia docs site (Next.js + Nextra + MDX), including style compliance, chain-id safety checks, link validation, and LLM markdown generation.
---

# Celestia docs maintainer

Use this skill for any task in this repository involving docs content, structure, navigation, or docs QA.

## Constraints first

- Never edit auto-generated `.md` files directly.
- `.md` files are generated from `.mdx` sources at build time via `yarn generate:llms`.
- Make edits in `app/**/page.mdx` (and related source files), then regenerate output when needed.

## Structural rules (high-stakes)

These rules are structural. Violations can silently break UI behavior, search quality, or content correctness.

- Tab order must be: Coffee Beta, Mocha, Arabica.
- Placeholders must use `<flag_name>` format (not `<flag-name>` or `<flag name>`).
- Use network names/capitalization exactly, including:
  - `Arabica devnet`
  - `Coffee Beta`

## Style rules (lower priority)

These are important editorial standards but are lower risk than structural rules.

- Use sentence case for headings.
- Avoid “click here” link text.
- Use international English.
- Use lowercase node types (for example, “bridge node”).
- Avoid “please” in instructional content.
- Ensure headings are unique within a page.
- Use italicized _i.e._ and _e.g._
- Refer to celestia-app as plain text (not inline code formatting).

## Variables and constants

- Do not hardcode frequently changing version/network values inline.
- Use the constants-backed variable pattern from `constants/*.json` in MDX.
- Example: use `{{mainnetVersions['app-latest-tag']}}` instead of hardcoding a specific app tag.

## Directory intent guide

Place new pages in the section matching user intent:

- `app/learn/`: conceptual and educational content.
- `app/build/`: developer, API, and RPC integration content.
- `app/operate/`: node operator and infrastructure operations content.

## Chain-id footgun warning

- Chain-id changes are a known footgun.
- When chain IDs change, run a comprehensive search across all MDX files before considering the task complete.
- Prefer repo-wide search patterns that catch variants (for example old/new chain IDs, code blocks, and inline references).

## Link and path rules

- Internal links should be root-relative: `[text](/path/to/page/#section-id)`.
- Whenever any link is added or modified, run: `yarn check-links -- --all`.
- For local assets, store under `public/` and reference with absolute site paths.

## Repository facts

- Framework: Next.js + Nextra (MDX), static export.
- Main content pages: `app/**/page.mdx`.
- Sidebar/navigation metadata: `app/**/_meta.js`.
- Shared constants: `constants/*.json` (resolved by `plugins/remark-replace-variables.mjs`).
- Key scripts:
  - `yarn lint`
  - `yarn check-links -- --all`
  - `yarn generate:llms`
  - `yarn build` (postbuild generates LLM files and Pagefind index)

## Done criteria

- Content is accurate, section placement is correct (`learn`/`build`/`operate`), and structural rules are satisfied.
- If any link was added or changed, `yarn check-links -- --all` has been run successfully.
- If chain IDs changed, comprehensive MDX search completed and all occurrences updated.
- Lint passes for touched files.
- Auto-generated `.md` files were not edited directly.

## Workflow checklist (run at the end)

1. Identify target pages in `app/**/page.mdx`.
2. Update content and matching `_meta.js` files if navigation changed.
3. Replace hardcoded version/network values with constants-backed variable syntax where applicable.
4. If links changed, run `yarn check-links -- --all`.
5. Run `yarn lint`.
6. Run `yarn generate:llms` or `yarn build` when output regeneration is required.

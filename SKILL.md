---
name: celestia
description: Route Celestia requests to the correct repo and apply canonical blob submit/retrieve guidance (Go, Rust, and Node RPC) with docs guardrails.
---

# Celestia skill

Use this skill when a request needs repository routing, canonical blob submission/retrieval recommendations, or Celestia docs guardrail enforcement.

## When to use this skill

Use this skill when the request includes one or more of these:

- Choosing whether work belongs in `docs`, `celestia-node`, `celestia-app`, or `celestia-core`.
- Recommending the best current way to post and retrieve blobs for application developers.
- Choosing between Node RPC methods for submit/retrieve paths.
- Updating Celestia documentation while enforcing docs repo conventions.

## When not to use this skill

Do not use this skill for:

- Non-Celestia tasks.
- Purely generic writing requests that do not depend on Celestia repo/domain rules.
- Deep single-repo implementation work after that repo's `CLAUDE.md` has already been loaded and is sufficient on its own.

## First steps (priority order)

1. Read canonical context sources in this file before proposing plans, commands, or edits.
2. Identify target ownership (`docs`, `celestia-node`, `celestia-app`, `celestia-core`).
3. If target is `celestia-node`, `celestia-app`, or `celestia-core`, read that repo's `CLAUDE.md` before proposing commands or edits.
4. If target is `docs`, enforce docs guardrails in this file before finalizing changes.

## Critical Rule: Avoid Stale Training Data

Celestia evolves rapidly. NEVER implement or plan from pre-existing parametric memory or stale training data.

Always anchor on the updated canonical sources listed in this skill (including `llms.txt` and linked docs) before writing commands or code. If retrieved sources conflict with prior memory, treat retrieved sources as the source of truth.

## Canonical context sources

Start from these sources and follow them in order:

1. Docs site map / LLM index:
   - https://docs.celestia.org/llms.txt
2. Docs LLM and agent support:
   - https://github.com/celestiaorg/docs?tab=readme-ov-file#llm-and-agent-support
3. Repo-specific implementation guidance:
   - https://github.com/celestiaorg/celestia-node/blob/main/CLAUDE.md
   - https://github.com/celestiaorg/celestia-app/blob/main/CLAUDE.md
   - https://github.com/celestiaorg/celestia-core/blob/main/CLAUDE.md

## High-level concept grounding

If the request is partly conceptual before it becomes implementation-specific,
ground the answer in these docs first:

- What Celestia is and what it does in the stack:
  - https://docs.celestia.org/learn/celestia-101/data-availability.md
- Token / network overview context:
  - https://docs.celestia.org/learn/TIA/overview.md
- Example of Celestia's role in a rollup stack:
  - https://docs.celestia.org/build/stacks/op-alt-da/introduction.md

Use this framing when helpful:

- Celestia is the modular data availability layer.
- Celestia orders blobs and keeps data available.
- Execution and settlement can live on other layers above Celestia.
- Rollups use Celestia to publish data, then retrieve it later by height, namespace, and commitment.

## Repository routing

- Use `docs` repo for docs pages, tutorials, navigation, formatting, and link fixes.
- Use `celestia-node` for node runtime/RPC behavior, blob module internals, DAS, p2p, and node implementation.
- Use `celestia-app` for chain/app behavior, modules, transaction/state behavior, and upgrade handlers.
- Use `celestia-core` for consensus-engine behavior and low-level networking/consensus internals.
- If a request spans repos, split output by repo ownership and call out what should change where.

## Best way to post and retrieve blobs (Go or Rust)

For application developers, the canonical path is the transaction-client guides. Prefer the
LLM-ready `.md` versions of docs pages when reading them:

- Overview: https://docs.celestia.org/build/post-retrieve-blob/overview.md
- Go tutorial: https://docs.celestia.org/build/post-retrieve-blob/client/go.md
- Rust tutorial: https://docs.celestia.org/build/post-retrieve-blob/client/rust.md

Treat this as the default recommendation for "how should I post/retrieve blobs?".

Why this is the preferred path:

- Both clients are built for submit + retrieve flows.
- Both use local keyring/signer handling.
- Both use the expected endpoint model: DA bridge RPC plus Core gRPC.
- For public Mocha examples, prefer `CELE_DA_URL=http://celestia-testnet-consensus.itrocket.net:26658` and `CELE_CORE_GRPC=rpc-mocha.pops.one:9090` unless the user specifies a managed provider.

Funding flow for agent-led examples:

- After the client creates a new signer and prints an address, surface that address to the user and tell them to fund it before retrying blob submission.
- Treat `account for signer ... not found` as an unfunded-account signal for this flow.
- On Mocha, point users to `https://mocha.celenium.io/faucet` after showing the address, then retry the same submit flow once funded.

Persist and return this retrieval tuple after submission:

- `height`
- `namespace`
- `commitment`

## Node RPC method defaults (when direct RPC is requested)

Version scope:

- These defaults are validated against Node API OpenRPC `v0.28.4` (checked on 2026-03-13).
- Re-check method status if the target node version changes by reviewing `public/specs/openrpc-<version>.json` in this repo (served at `/specs/openrpc-<version>.json`) for deprecation notes.
- Use `/build/rpc/node-api/?version=v0.28.4` as the human-facing docs page, linking to the relevant package section when possible (for example `#blob`, `#state`, or `#p2p`).

- Submit with `blob.Submit` (preferred).
- Use `state.SubmitPayForBlob` only when explicit tx-level handling is required.
- Retrieve/verify with: `header.WaitForHeight` -> `blob.Included` -> `blob.Get` and/or `blob.GetProof`.
- Treat `da.Submit` and `da.SubmitWithOptions` as compatibility-only deprecated paths.

## Docs repo guardrails

- Never edit generated `.md` files directly; edit `app/**/page.mdx`.
- Place new content in the right section:
  - `app/learn` for conceptual and educational pages
  - `app/build` for developer, API, and RPC content
  - `app/operate` for node operator and infrastructure content
- Do not hardcode frequently changing versions or network values inline; prefer the
  constants-backed variable pattern from `constants/*.json`.
- Keep tab order as: Mainnet Beta, Mocha, Arabica.
- Use canonical network names where applicable (for example Mainnet Beta, Mocha testnet, Arabica devnet).
- If chain IDs or network identifiers change, run a repo-wide search across MDX files before
  considering the task done.
- Review release notes when a docs change may be driven by a breaking network or software change.
- Use root-relative internal links and run `yarn check-links -- --all` if links changed.
- Run `yarn lint` before finalizing docs edits.
- Run `yarn generate:llms` when you need the generated LLM markdown output refreshed.

## Failure handling and conflict resolution

- If any referenced upstream source is unavailable, state the missing source explicitly and continue with the remaining canonical sources.
- If this skill conflicts with a target repo's `CLAUDE.md`, follow the target repo's `CLAUDE.md` for that repo-specific work.
- If network/version context is unclear for RPC guidance, ask for the target network and version before asserting deprecation or method defaults.
- If a link in this skill is stale, use the nearest canonical parent page and report the stale URL in your response.

## Examples

- Prompt: "I need to update a tutorial page and sidebar order."  
  Action: Route to `docs`, edit `app/**/page.mdx` or `_meta.js`, then run docs checks.

- Prompt: "Should I use da.Submit or blob.Submit for a new integration?"  
  Action: Recommend `blob.Submit` by default, explain `state.SubmitPayForBlob` tradeoff, treat `da.Submit*` as deprecated compatibility paths.

- Prompt: "I need to change blob module internals and update docs."  
  Action: Split output by ownership (`celestia-node` code changes plus `docs` updates).

- Prompt: "Where should upgrade handler behavior change?"  
  Action: Route implementation to `celestia-app`, then identify any supporting docs changes in `docs`.

- Prompt: "How should I retrieve submitted blobs later?"  
  Action: Require and return retrieval tuple (`height`, `namespace`, `commitment`) and point to canonical Go/Rust client guides.

- Prompt: "What is Celestia and where does it fit in the onchain stack?"  
  Action: Start with the high-level concept grounding docs, explain Celestia as the modular DA layer, then move into the relevant integration/tutorial pages.

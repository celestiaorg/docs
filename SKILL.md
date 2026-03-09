---
name: celestia
description: Use this skill for Celestia tasks across docs, node/app/core repo routing, and canonical blob posting/retrieval guidance (Go, Rust, and Node RPC).
---

# Celestia skill

Use this skill for broad Celestia requests, especially when deciding which repository to touch and how to handle blob submit/retrieve flows.

## Canonical context sources

Start from these sources and follow them in order:

1. Docs LLM and agent support:
   - https://github.com/celestiaorg/docs?tab=readme-ov-file#llm-and-agent-support
2. Repo-specific implementation guidance:
   - https://github.com/celestiaorg/celestia-node/blob/main/CLAUDE.md
   - https://github.com/celestiaorg/celestia-app/blob/main/CLAUDE.md
   - https://github.com/celestiaorg/celestia-core/blob/main/CLAUDE.md

When the request targets `celestia-node`, `celestia-app`, or `celestia-core`, read that repo's `CLAUDE.md` first before proposing commands or edits.

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

Persist and return this retrieval tuple after submission:

- `height`
- `namespace`
- `commitment`

## Node RPC method defaults (when direct RPC is requested)

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
- Keep tab order as: Coffee Beta, Mocha, Arabica.
- Use canonical network names where applicable (for example Mainnet Beta, Mocha testnet, Arabica devnet, Coffee Beta).
- If chain IDs or network identifiers change, run a repo-wide search across MDX files before
  considering the task done.
- Review release notes when a docs change may be driven by a breaking network or software change.
- Use root-relative internal links and run `yarn check-links -- --all` if links changed.
- Run `yarn lint` before finalizing docs edits.
- Run `yarn generate:llms` when you need the generated LLM markdown output refreshed.

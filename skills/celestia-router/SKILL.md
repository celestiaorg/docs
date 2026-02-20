---
name: celestia-router
description: Route Celestia tasks to the correct repository workflow (docs, celestia-app, celestia-node, cips), ask the minimum clarifying questions, and avoid doing work in the wrong repo.
---

# Celestia router

Use this skill as the first step for broad "Celestia" requests that do not clearly belong to a single repository.

## Routing map

- `docs` repo:
  - Documentation pages, tutorials, API docs prose, navigation, formatting/style fixes, link fixes.
  - Keywords: "docs", "guide", "page", "MDX", "sidebar", "broken link", "wording".

- `celestia-app` repo:
  - Consensus params, staking/gov behavior, app modules, chain-level upgrades, chain-id and app version mechanics.
  - Keywords: "app", "module", "params", "governance", "staking", "upgrade handler".

- `celestia-node` repo:
  - Node runtime, DA sampling behavior, p2p/networking, light/bridge/full node operations, RPC behavior in node implementation.
  - Keywords: "node", "bridge node", "light node", "DAS", "p2p", "sync", "node RPC".

- `cips` repo:
  - Protocol proposals, rationale/design discussion, draft/final standards process.
  - Keywords: "CIP", "proposal", "spec change", "rationale", "backward compatibility".

## Decision rules

1. If the task edits files and target repo is explicit, route there immediately.
2. If target repo is ambiguous, ask one short clarifying question before making edits.
3. If task spans multiple repos, split work by ownership:
   - protocol/design in `cips`
   - implementation in `celestia-app` or `celestia-node`
   - user-facing explanation in `docs`
4. Never implement code changes in `docs` when the real issue is runtime/protocol behavior in app/node.

## Minimal intake checklist

- What outcome is needed: behavior change, documentation change, or proposal/spec change?
- Which network scope is involved: Coffee Beta, Mocha, Arabica, or mainnet?
- Is there a version/chain-id dependency that must be updated everywhere?

## Handoff behavior

- State selected repo and why in one sentence.
- Use that repo's local skill if available.
- Keep edits scoped to that repo's conventions and verification commands.

## Safety footguns

- Chain-id/version changes often require synchronized updates across `docs`, `celestia-app`, and `celestia-node`.
- For docs-only requests, avoid hardcoding versions; prefer constants/templating where available.
- For protocol-impacting requests, avoid "docs-only fixes" that mask an implementation mismatch.

## Useful references

- Docs site: `https://docs.celestia.org`
- DeepWiki (docs): `https://deepwiki.com/celestiaorg/docs`
- DeepWiki (cips): `https://deepwiki.com/celestiaorg/cips`
- DeepWiki (celestia-app): `https://deepwiki.com/celestiaorg/celestia-app`
- DeepWiki (celestia-node): `https://deepwiki.com/celestiaorg/celestia-node`

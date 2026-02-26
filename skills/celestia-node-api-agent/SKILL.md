---
name: celestia-node-api-agent
description: Use this skill when an agent needs to choose or call Celestia Node API methods (especially transaction submission), apply auth best practices, and ground recommendations in the latest OpenRPC snapshot.
---

# Celestia node API agent

Use this skill for requests like:
- "Which node RPC method should I use for this?"
- "How should an agent submit blobs/txs?"
- "Generate a Node API call plan with method order and auth scope."

## Quick start

1. Refresh the OpenRPC-derived references:
   - `npm run generate:node-api-skill-ref`
2. Read:
   - `references/node-api-practices.md` for workflow guidance.
   - `references/openrpc-latest-summary.md` for human-readable method catalog.
   - `references/openrpc-latest-index.json` for machine-friendly method metadata.

## Method selection rules

- Default blob submission path: use `blob.Submit` (write auth).
- If explicit PayForBlob transaction handling is requested, use `state.SubmitPayForBlob` (write auth).
- Treat `da.Submit` and `da.SubmitWithOptions` as legacy-only paths (both are marked deprecated in the spec).
- For read-only tasks, stay in read methods and avoid suggesting write/admin calls.

## "Submitting txs" playbook

When an agent is asked to submit data, do this:

1. Choose method:
   - Use `blob.Submit` unless the user explicitly needs the `state.SubmitPayForBlob` transaction path.
2. State auth requirement:
   - `write` token required.
3. Return submission outputs to persist:
   - `height`, `namespace`, and `commitment` for later retrieval/proof checks.
4. Suggest confirmation flow:
   - `header.WaitForHeight` -> `blob.Included` and/or `blob.Get`.
5. Flag deprecated alternatives only when needed for compatibility.

## Auth and safety defaults

- Mint scoped tokens with `node.AuthNew` / `node.AuthNewWithExpiry`.
- Use least privilege (`read`/`write`/`admin`) and shortest practical TTL.
- Do not recommend `admin` methods unless task explicitly requires node administration.

## Output contract for agent answers

Always provide:

- selected method(s) and why.
- required auth level per method.
- required params and expected result type.
- follow-up verification/read calls when submission is involved.

## Maintenance

- Never paste raw OpenRPC JSON into this `SKILL.md`.
- Keep generated data in `references/openrpc-latest-summary.md` and `references/openrpc-latest-index.json`.
- Regenerate references whenever the Node API version list or `public/specs/openrpc-*.json` changes.

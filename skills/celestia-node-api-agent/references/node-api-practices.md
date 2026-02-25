# Node API practices for agents

This file captures stable guidance for method choice and call sequencing.

## 1) Submission default

- Prefer `blob.Submit` for standard blob publishing from a Celestia node wallet.
- Use `state.SubmitPayForBlob` only when explicit transaction-level handling is required.
- Treat `da.Submit` and `da.SubmitWithOptions` as compatibility paths only; both are deprecated in the latest OpenRPC spec.

## 2) What to persist after submission

Persist these fields in agent output/state:

- `height`
- `namespace`
- `commitment`

This retrieval tuple is needed for follow-up lookup and proofs.

## 3) Confirmation/read sequence

After submission, prefer this order:

1. `header.WaitForHeight` with the submitted height.
2. `blob.Included` for inclusion check.
3. `blob.Get` and/or `blob.GetProof` when data/proof retrieval is needed.

## 4) Auth best practice

- Generate scoped tokens with `node.AuthNew` or `node.AuthNewWithExpiry`.
- Use least privilege:
  - `read` for read flows.
  - `write` for submission flows.
  - `admin` only for administrative operations.
- For public or shared environments, avoid advice that requires disabling RPC auth.

## 5) Agent response structure

For any method recommendation, include:

- method name and one-line reason.
- auth level.
- param list.
- expected result type.
- next method(s) in the flow.

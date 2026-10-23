# Fibre client brief for agents

Valid for: celestia-app v10.4.0 / v10.4.0-mocha, celestia-node v0.34.3.
Generated from this guide on 2026-10-20. Human guide = source of truth. Sources live in the
guide pages' source comments. If guide and brief differ, trust the guide.

## How to use this brief
- Answer only from this brief or the guide files. If it isn't in the guide, say it's unknown. Never invent numbers, SLAs, dates, contacts.
- Parameters below are the defaults both networks started with at the app v10 upgrade. Governance can change them. Tell users to run `celestia-appd query fibre params` (REST `/fibre/v1/params`).

## Status
- Mainnet Beta (`celestia`): Fibre live (app v10).
- Mocha (`mocha-5`, test network): Fibre live (app v10).
- Activation sources: [Mainnet Beta](https://status.celestia.org/incidents/s6mnv21p) and [Mocha](https://status.celestia.org/incidents/vbsesey3). Uploads also require registered, reachable Fibre servers with enough voting power for quorum; activation alone does not prove provider readiness.

## Never / always
- NEVER retry a failed or uncertain upload before checking whether it settled. Each upload = new signed promise = new payment obligation, charged when it settles (PFF or timeout). A promise that reached any validator can be charged via timeout even if the upload failed.
- NEVER treat a timeout or HTTP 429 during confirmation as a failure. Check settlement first.
- NEVER describe Fibre as permanent storage. Shards are kept until max(promise creation + `shard_retention` (4h), promise expiry), then may be deleted. Counted from promise creation, not upload. User must keep their own copy.
- NEVER claim Fibre checks content correctness. Blob ID binds bytes, not meaning.
- ALWAYS size escrow ≥ max blobs in flight × charge per blob, plus margin. Validators reserve each accepted promise against `available_balance` until it settles.
- ALWAYS save per blob: `blob_id`, `tx_hash`, `height`, promise hash (Go), own copy of data.
- ALWAYS keep the host clock synced. Promise timestamp > 10 min ahead of chain time → rejected.
- Data is public to anyone with the blob ID. Encrypt sensitive data.

## Flow
deposit escrow → client encodes blob, signs payment promise → uploads shards to validators' Fibre servers → each validator stores and signs → at ≥ floor(2/3 × total voting power), client submits `MsgPayForFibre` (PFF) → chain charges escrow, writes small on-chain blob holding the commitment → anyone downloads by blob ID until retention ends (needs shards from ~1/3 voting power).

## Integration options
| Option | Max blob | Notes |
|---|---|---|
| node JSON-RPC `fibre.*` | <12 MiB (16 MiB request cap, base64) | light/bridge node verifies headers |
| node Go `api/client.New` | 128 MiB − 5 B | builds a local native client (`NewReadClient` uses JSON-RPC instead) |
| celestia-app Go `fibre` package | 128 MiB − 5 B | full control |

Node methods: `Submit` (upload+settle+wait; use first), `Upload` (settles in background; errors only in node logs), `Download`, `QueryEscrowAccount`, `Deposit`, `Withdraw`, `PendingWithdrawals`.
Go: `fibre.Put` = upload+settle+wait, returns `tx_hash` only after confirmation. For production prefer `Client.Upload` + own broadcast, saving the hash before confirming. Call `Start` first; call `Stop` on shutdown; `blob.Free()`. A nil keyring allows downloads only.
From celestia-app v10.5.0, `DetachBackgroundUploads` defaults to true. Cancelling after `Client.Upload` or `fibre.Put` returns leaves uploads past quorum running, bounded by the RPC timeout and retry limits. Set it false so cancellation stops them. Cancelling before quorum aborts the upload either way. `Client.Await`, or `Client.Stop` unless its context is cancelled, waits for the rest.
Blob ID: base64 in JSON-RPC. In Go, pass the `BlobID` ([]byte) as returned; `String()` = hex, `BlobIDFromString` parses hex. Same ID.

## Money
- Wallet pays gas. Escrow pays storage. Escrow can't pay gas.
- Escrow owner = key that signs the promise (secp256k1). Gas for PFF can use `fee_granter_address` (node).
- Charge (utia) = 650,000 + 45,000 × ceil(upload_size / 262,144). Fixed formula, not tied to gas price.
- upload_size = row_size × 4096, where row_size = ceil((len + 5) / 4096) rounded up to a multiple of 64. Minimum 262,144 → minimum charge 0.695 TIA.
- Examples: 14 B → 0.695 TIA; 10 MiB → 2.495 TIA; 128 MiB − 5 B → 23.69 TIA.
- Withdrawal paid after `withdrawal_delay` (24h). Pending withdrawals reduce `available_balance` immediately.
- Go `Escrow.AutoFund`: off by default, works only with `fibre.Put`.
- Payments go to the fee collector → validators and delegators.

## Limits
| Item | Value |
|---|---|
| Max blob | 134,217,723 B |
| Quorum | ≥ floor(2/3 × total voting power) |
| Per-validator RPC timeout | 15 s |
| Retry on full validator storage | 3 per validator, wait ≤ 2 min |
| Validator min upload size | 262,144 B default; each validator may raise it |
| PFF | 1 promise per msg, 1 msg per tx, ≤ 200 per block |
| `shard_retention` | 4h |
| `payment_promise_timeout` | 1h |
| `payment_promise_height_window` | 1000 blocks |
| `withdrawal_delay` | 24h |
| Promise clock skew | ≤ 10 min ahead |

## Errors → action
Validator rejections (escrow, clock, chain ID, min size, storage) appear per validator in client/node logs as `failed to upload rows`. The upload itself then returns `not enough voting power`.

| Error text contains | Action |
|---|---|
| `fibre client is not available` / `fibre module is not available` | node has no core endpoint → set `--core.ip`/`--core.port` |
| `client is not started` / `client is closed` | call `Start` / create a new client |
| `key not found in keyring` / `keyring is required for uploads` | fix key name / pass a keyring |
| `chain ID mismatch` | client and endpoint on different networks |
| `blob size exceeds maximum` | split data |
| `not enough voting power: collected X, required Y` | quorum missed → diagnose (below); check settlement before retrying |
| `escrow account not found` | deposit to the promise signer's escrow |
| `insufficient balance in escrow account` | top up |
| `insufficient available balance for signer` | in-flight promises exceed escrow → top up or lower concurrency |
| `below local minimum` | one validator rejects small blobs; fine if quorum is still met |
| `fibre storage budget exceeded` | validator full; client retries |
| `creation_timestamp ... must not be after` | clock ahead, or chain stalled |
| `payment promise expired` | normal settlement ≥ `payment_promise_timeout` (1h) after creation → upload again if needed; check clock; promise can still be charged via timeout |
| `height ... too far in the past` | normal settlement > `payment_promise_height_window` (1000) blocks after promise height → upload again if needed; promise can still be charged via timeout |
| `already been processed` | already settled → nothing to do |
| `failed to get historical validator set` | transient; `fibre.Put` retries; else retry settlement |
| `blob not found: no shards retrieved` | past retention, or validators unreachable (network/TLS/provider errors) → within retention check network and retry; after it use own copy |
| `not enough shards to reconstruct` | retry later |
| `invalid blob ID` | pass ID unchanged (base64 in JSON-RPC; `BlobID` value in Go) |

## Diagnose: user's side or network's?
- All uploads fail with escrow/balance/chain-ID/clock errors → user.
- Failures across most validators, all timeouts → usually user's egress. Compare from another host.
- Failures on a few validators only → those validators; ignore while quorum holds.
- Many validators unreachable, or budget exceeded everywhere → network. Check status.celestia.org and, on Mocha, the Valopers and Tensile dashboards.
- HTTP 429 from core endpoint → endpoint provider; use own endpoint; check settlement before resubmitting.

## Check whether a blob was paid for
- Have `tx_hash` → look up the transaction. `EventPayForFibre` = settled.
- Have promise hash (hex, Go `PaymentPromise.Hash()`) → `celestia-appd query fibre is-payment-processed <hash>`. `found: true` = charged (normal or timeout).
- `EventPaymentPromiseTimeout` with user's `escrow_signer` = charged without normal settlement.

## Where details live
- Walkthrough on Mocha: https://docs.celestia.org/build/post-retrieve-blob/fibre
- When to use: https://docs.celestia.org/build/post-retrieve-blob/fibre/when-to-use
- Getting started: https://docs.celestia.org/build/post-retrieve-blob/fibre/getting-started
- Limits: https://docs.celestia.org/build/post-retrieve-blob/fibre/limits
- Monitoring: https://docs.celestia.org/build/post-retrieve-blob/fibre/monitoring
- Errors and FAQ: https://docs.celestia.org/build/post-retrieve-blob/fibre/faq

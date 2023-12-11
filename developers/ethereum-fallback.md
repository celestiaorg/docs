---
description: The DA fallback mechanism to Ethereum for rollups.
---

# Ethereum fallback

Ethereum fallback is
[a fallback mechanism](https://github.com/celestiaorg/optimism/pull/266)
that enables Ethereum L2s (or L3s) to “fall back” to using Ethereum
calldata for data availability in the event of downtime on Celestia
Mainnet Beta. This feature is currently supported by Celestia integrations
with:

- [OP Stack](optimism-devnet.md#eth-fallback)
- Arbitrum Nitro

In the case of Celestia downtime or temporary unavailability, L2s can
fallback to posting transactions as calldata on Ethereum or another DA
layer for data availability instead of posting to Celestia. This
mechanism ensures users can continue to transact securely and seamlessly,
preventing disruptions and helping to ensure user funds do not get stuck
in the L2's bridge on Ethereum.

Ethereum fallback is triggered whenever the sequencer has an error
sending the `PayForBlobs` transaction on Celestia. Fallback can be
triggered due to a congested mempool or nonce error and can be simulated
with an error such as low balance or incorrect sequence. Fallback
can also be triggered in the event Blobstream stops relaying attestations.

![Ethereum fallback](/img/Celestia_ethereum-fallback.jpg)

## OP Stack

The Ethereum fallback mechanism is implemented in the
[celestiaorg/optimism](https://github.com/celestiaorg/optimism/tree/release-v1.0.0) v1.0.0 release.

The `op-batcher/batcher/driver.go` and
`op-node/rollup/derive/calldata_source.go` files are part of the Ethereum
fallback mechanism in the `op-batcher` and `op-node` respectively.

In [`driver.go`, the `sendTransaction` function is responsible for the write path](https://github.com/celestiaorg/optimism/blob/release-v1.0.0/op-batcher/batcher/driver.go#L400-L406)
of the Ethereum fallback. This function creates and submits a transaction to the
batch inbox address with the given data. It uses the underlying `txmgr` to
handle transaction sending and gas price management.

If the transaction data can be published as a blob to Celestia,
it replaces the calldata with a blob identifier and sends the
transaction with this data. If it cannot be published to Celestia,
it falls back to Ethereum without any change to the transaction.

The blob identifier starts with the special prefix `0xce`, which was chosen a
mnemonic for Celestia, and indicates that the remaining data has to
interpreted as a little-endian encoded Block Height (8 bytes) and
Blob Commitment (32 bytes). The combination of these can later be used to
retrieve the original calldata from Celestia.

<!-- markdownlint-disable MD013 -->
| Prefix | 8 bytes       | 32 bytes        |
|--------|---------------|-----------------|
| 0xce   | Block Height  | Blob Commitment |
<!-- markdownlint-enable MD013 -->
```go
func (l *BatchSubmitter) sendTransaction(
    txdata txData,
    queue *txmgr.Queue[txData],
    receiptsCh chan txmgr.TxReceipt[txData],
) {
    // ...
}
```

In `calldata_source.go`,
[the `DataFromEVMTransactions` function defines the read path](https://github.com/celestiaorg/optimism/blob/release-v1.0.0/op-node/rollup/derive/calldata_source.go#L138-L163)
of the Ethereum fallback. This function filters all of the transactions
and returns the calldata from transactions that are sent to the batch
inbox address from the batch sender address.

If the calldata matches the version prefix `0xce`, it is decoded as a
blob identifier, the original calldata is retrieved from Celestia
and returned for derivation. If the calldata does not match the prefix,
the entire calldata is returned for derivation.

```go
func DataFromEVMTransactions(
    config *rollup.Config,
    batcherAddr common.Address,
    txs types.Transactions,
    log log.Logger
) ([]eth.Data, error) {
    // ...
}
```

These two functions work together to ensure that the Ethereum
fallback mechanism operates correctly, allowing the rollup
to continue functioning even during periods of downtime on
Celestia.

## Arbitrum

In [Arbitrum Nitro](https://github.com/OffchainLabs/nitro), the
[Ethereum fallback mechanism in the `BatchPoster` function](https://github.com/OffchainLabs/nitro/blob/master/arbnode/batch_poster.go#L989-L1001)
is handling the process of storing data, with a fallback mechanism
to store data onchain if the primary data availability storage
fails.

The [@celestiaorg/nitro](https://github.com/celestiaorg/nitro) integration
[uses the same fallback mechanism](https://github.com/celestiaorg/nitro/blob/f01968eb3d4e19329e9c92b050e98a8e5772f1f2/arbnode/batch_poster.go#L845-L857).

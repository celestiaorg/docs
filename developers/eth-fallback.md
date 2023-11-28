---
description: The DA fallback mechanism to Ethereum for rollups.
---

# ETH fallback

ETH fallback is
[a fallback mechanism](https://github.com/celestiaorg/optimism/commit/1215c15fda540a1f19b81588de98e2e7b546e517)
that enables Ethereum L2s (or L3s) to “fall back” to posting Ethereum
calldata for data availability in the event of downtime on Celestia
Mainnet Beta. This feature is currently supported by Celestia integrations
with:

- [OP Stack](optimism-devnet.md#eth-fallback)
- Arbitrum Nitro

In the case of Celestia downtime or temporary unavailability, L2s can
fallback to posting transactions as calldata on Ethereum or another DA
layer for data availability instead of posting to Celestia. This
mechanism ensures users can continue to transact securely and seamlessly,
preventing disruptions and helping to ensure user funds to not get stuck
in the L2's bridge on Ethereum.

Ethereum fallback is triggered whenever the sequencer has an error
sending the `PayForBlobs` transaction on Celestia. Fallback can be
triggered due to a congested mempool or nonce error and can be simulated
with an error such as low balance or incorrect sequence. Fallback
can also be triggered in the event Blobstream stops relaying attestations.

The integration is still a work in progress, and the
[most up-to-date version can be found on the `tux/frame-ref-version` branch](https://github.com/celestiaorg/optimism/tree/tux/frame-ref-version).

## Arbitrum

In [Arbitrum Nitro](https://github.com/OffchainLabs/nitro)
("Nitro goes vroom and fixes everything"), the
[ETH fallback mechanism in the `BatchPoster` function](https://github.com/OffchainLabs/nitro/blob/master/arbnode/batch_poster.go#L989-L1001)
is handling the process of storing data, with a fallback mechanism
to store data onchain if the primary data availability storage
fails.

The [@celestiaorg/nitro](https://github.com/celestiaorg/nitro) integration
[uses the same fallback mechanism](https://github.com/celestiaorg/nitro/blob/f01968eb3d4e19329e9c92b050e98a8e5772f1f2/arbnode/batch_poster.go#L845-L857).

## OP Stack

The ETH fallback mechanism is set up in the
[celestiaorg/optimism integration](https://github.com/celestiaorg/optimism/tree/tux/rebase-frame-ref-version).

The `op-batcher/batcher/driver.go` and
`op-node/rollup/derive/calldata_source.go` files are part of the ETH
fallback mechanism in the op-batcher and op-noderespectively.

In [`driver.go`, the `sendTransaction` function is responsible for the write path](https://github.com/celestiaorg/optimism/blob/1215c15fda540a1f19b81588de98e2e7b546e517/op-batcher/batcher/driver.go#L351-L395)
of the ETH fallback. This function creates and submits a transaction to the
batch inbox address with the given data. It uses the underlying `txmgr` to
handle transaction sending and price management. If the transaction data
can be published to Celestia, it creates a `FrameCelestiaStdRef` and sends
the transaction with this data. If it cannot be published to Celestia, it
falls back to Ethereum by creating a `FrameEthereumStdRef` and sends the
transaction with this data.

That the transaction data includes a version prefix, which determines how
the data will be parsed.

<!-- markdownlint-disable MD013 -->
| Version | Prefix | Frame type            | Description                                                                                     |
|---------|--------|-----------------------|-------------------------------------------------------------------------------------------------|
| v0      | 0x00   | `FrameCelestiaLegacyRef`| Legacy celestia - 8 bytes block height, 4 bytes tx index                   |
| v1      | 0x01   | `FrameEthereumStdRef`   | Eth calldata fallback - all remaining bytes are interpreted as Frame       |
| v2      | 0x02   | `FrameCelestiaStdRef`   | Standard celestia - 8 bytes block height, 32 byte tx commitment            |
<!-- markdownlint-enable MD013 -->

In other words, the first byte of the calldata is interpreted as
the version prefix which determines how to parse the remaining data.

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
[the `DataFromEVMTransactions` function defines the read path](https://github.com/celestiaorg/optimism/blob/1215c15fda540a1f19b81588de98e2e7b546e517/op-node/rollup/derive/calldata_source.go#L131-L180)
of the ETH fallback. This function filters all of the transactions and returns
the calldata from transactions that are sent to the batch inbox address from
the batch sender address. It checks the type of the frame by reading the version
prefix and retrieves the data accordingly. If the frame is `FrameCelestiaLegacy`
or `FrameCelestiaStd`, it requests the data from Celestia. If the frame is
`FrameEthereumStd`, it directly uses the calldata from the frame.

```go
func DataFromEVMTransactions(
    config *rollup.Config,
    daClient *rollup.DAClient,
    batcherAddr common.Address,
    txs types.Transactions,
    log log.Logger
) ([]eth.Data, error) {
    // ...
}
```

These two functions work together to ensure that the ETH
fallback mechanism operates correctly, allowing the system
to continue functioning even during periods of downtime on
Celestia.

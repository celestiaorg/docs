# ETH fallback

ETH fallback is
[a fallback mechanism](https://github.com/celestiaorg/optimism/commit/1215c15fda540a1f19b81588de98e2e7b546e517)
that enables the Arbitrum and OP Stack integrations to "fall back" to Ethereum
for data availability in the event of downtime on Celestia.

It provides a way to fallback to the default calldata on Ethereum
instead of of posting a blob to Celestia for data availability. This
mechanism ensures the smooth operation of transactions and prevents
disruptions caused by any temporary unavailability of Celestia. By
leveraging ETH fallback, users can continue to transact securely
and seamlessly even during periods of downtime on Celestia.

The fallback is triggered whenever there is an error sending the
`PayForBlobs` transaction on Celestia. This could be due to a
congested mempool or nonce error and can be simulated with an
error such as low balance or incorrect sequence.

The fallback could also be in the event Blobstream stops relaying.

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
[celestiaorg/optimism integration](https://github.com/celestiaorg/optimism).

The `driver.go` and `calldata_source.go` files are part of the ETH fallback
mechanism in the op-batcher and op-node respectively.

In [`driver.go`, the `sendTransaction` function is responsible for the write path](https://github.com/celestiaorg/optimism/blob/1215c15fda540a1f19b81588de98e2e7b546e517/op-batcher/batcher/driver.go#L351-L395)
of the ETH fallback. This function creates and submits a transaction to the
batch inbox address with the given data. It uses the underlying `txmgr` to
handle transaction sending and price management. If the transaction data
can be published to Celestia, it creates a `FrameCelestiaStdRef` and sends
the transaction with this data. If it cannot be published to Celestia, it
falls back to Ethereum by creating a `FrameEthereumStdRef` and sends the
transaction with this data.

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
the batch sender address. It checks the type of the frame and retrieves the
data accordingly. If the frame is `FrameCelestiaLegacy` or `FrameCelestiaStd`,
it requests the data from Celestia. If the frame is `FrameEthereumStd`, it
directly uses the calldata from the frame.

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

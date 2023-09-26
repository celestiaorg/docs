# Paying for blobspace

## PayForBlobs transactions

To publish data on Celestia, developers can submit `PayForBlobs` transactions. A
`PayForBlobs` transaction consists of the identity of the sender, the data to be
made available, the data size, the namespace, and a signature.

Each `PayForBlobs` transaction is split into two parts: the blob or blobs which
include the data to be made available along with the namespace, and the executable
payment transaction which includes a commitment to the data.

Both the blobs and executable payment transactions are put into the block within
the appropriate namespace. The block data is extended using erasure coding and then
Merkelized into a data root commitment included in the block header.

![Lifecycle of a `celestia-app` Transaction](../img/learn/tx-lifecycle.png)

See
[the detailed life cycle of a Celestia transaction](../how-celestia-works/transaction-lifecycle).

Learn how to
[submit data to Celestia’s data availability layer](../../developers/submit-data).

## Fee market overview

Celestia uses a standard gas-price prioritised mempool. This means that
transactions with higher fees will be prioritised by validators. Fees are
comprised of a flat fee per transaction and then a variable fee based on the
size of each blob in the transaction.

Understand how fees are calculated on Celestia in
[the overview on submitting PFB transactions](../../developers/submit-data/).

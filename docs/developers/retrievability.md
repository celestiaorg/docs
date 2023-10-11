---
sidebar_label: Data retrievability and pruning
---

# Data retrievability and pruning

The purpose of data availability layers such as Celestia is to ensure that block data is provably published to the Internet, so that applications and rollups can know what the state of their chain is, and store that data. Once the data is published, data availability layers [do not inherently guarantee that historical data will be permanently stored](https://notes.ethereum.org/@vbuterin/proto_danksharding_faq#If-data-is-deleted-after-30-days-how-would-users-access-older-blobs) and be retrievable.

In this document, we discuss the state of data retrievability and pruning in Celestia, as well as some tips for rollup developers in order to ensure that syncing new rollup nodes is possible.

## Data retrievability and pruning in celestia-node

Celestia-node's main branch does not currently support pruning, and therefore all bridge and full storage nodes currently store and serve all historical data by default, and act as **archival nodes**.

However, support for **pruned nodes** exists in an [experimental feature branch](https://github.com/celestiaorg/celestia-node/pull/2738) that is expected to land in main soon after mainnet. The data recency window for which pruned nodes will store data blobs for is currently proposed to be **30 days**.

Data blobs older than the recency window will be pruned by pruned nodes, but will continue to be stored by archival nodes that do not prune data. Light nodes will be able to query historic blob data in namespaces from archival nodes, as long as archival nodes exist on the public network.

When a data recency window is established, light nodes will only perform data availability sampling for blocks within the data recency window.

## Suggested practices for rollups

Rollups may need to access historic data in order to allow new rollup nodes to reconstruct the latest state by replaying historic blocks. Once data has been published on Celestia and guaranteed to have been made available, rollups and applications are responsible for storing their historical data.

While it is possible to continue do this by using the `GetAll` API method in celestia-node on historic blocks as long as archival nodes exist on the public Celestia network, rollup developers should not rely on this as the only method to access historical data, as archival nodes serving requests for historical data for free is not guaranteed. Below are some other suggested methods to access historical data.

- **Use professional archival node or data providers.** It is expected that professional infrastructure providers will provide paid access to archival nodes, where historical data can be retrieved, for example using the `GetAll` API method. This provides better guarantees than solely relying on free archival nodes on the public Celestia network.
- **Share snapshots of rollup nodes.** Rollups could share snapshots of their data directories which can be downloaded manually by users bootstrapping new nodes. These snapshots could contain the latest state of the rollup, and/or all the historical blocks.
- **Add peer-to-peer support for historical block sync.** A less manual version of sharing snapshots, where rollup nodes could implement built-in support for block sync, where rollup nodes download historical block data from each other over a peer-to-peer network.

  - [**Namespace pinning.**](https://github.com/celestiaorg/celestia-node/issues/2830) In the future, celestia-node is expected to allow nodes to choose to "pin" data from selected namespaces that they wish to store and make available for other nodes. This will allow rollup nodes to be responsible for the storage of their data, without needing to implement their own peer-to-peer historical block sync mechanism.

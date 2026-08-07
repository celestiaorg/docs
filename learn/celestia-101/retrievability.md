# Data retrievability and pruning

The purpose of data availability layers such as Celestia is to ensure
that block data is provably published, so that applications
and rollups can know what the state of their chain is, and store that data.
Once the data is published, data availability layers
[do not inherently guarantee that historical data will be permanently stored](https://notes.ethereum.org/@vbuterin/proto_danksharding_faq#If-data-is-deleted-after-30-days-how-would-users-access-older-blobs)
and remain retrievable.

In this document, we discuss the state of data retrievability and
pruning in Celestia, as well as some tips for rollup developers in
order to ensure that syncing new rollup nodes is possible.

## Data retrievability and pruning in celestia-node

As of version v6 of celestia-app, celestia-node has implemented a light node
sampling window of 7 days, as specified in
[CIP-36](https://github.com/celestiaorg/CIPs/blob/main/cips/cip-036.md).
Light nodes now only sample blocks within a 7-day
window instead of sampling all blocks from genesis. This change
introduces the concept of pruning to celestia-node, where data
outside of the 7-day window may not be stored by light nodes,
marking a significant update in how data retrievability and
storage are managed within the network.

Data blobs older than the recency window will be pruned by default
on light nodes,
but will continue to be stored by archival nodes that do not prune data. Light
nodes will be able to query historic blob data in namespaces from archival
nodes, as long as archival nodes exist on the public network.

## Suggested practices for rollups

Rollups may need to access historic data in order to allow new rollup nodes
to reconstruct the latest state by replaying historical blocks. Once data has
been published on Celestia and guaranteed to have been made available, rollups
and applications are responsible for storing their historical data.

While it is possible to continue to do this by using the `GetAll` API method in
celestia-node on historic blocks as long as archival nodes exist on the public
Celestia network, rollup developers should not rely on this as the only method
to access historical data, as archival nodes serving requests for historical
data for free is not guaranteed. Below are some other suggested methods to
access historical data.

- **Use professional archival node or data providers.** It is expected that
  professional infrastructure providers will provide paid access to archival
  nodes, where historical data can be retrieved, for example using the `GetAll`
  API method. Providers like QuickNode offer archival node services that maintain
  complete historical data, ensuring reliable access to past transactions and state.
  This provides better guarantees than solely relying on free archival nodes on the
  public Celestia network. For a list of available providers, see the
  [network's](/operate/networks/mainnet-beta) page, and for specific archival
  node endpoints, refer to the [archival DA RPC endpoints](/operate/networks/mainnet-beta#archival-da-rpc-endpoints)
  section.

- **Share snapshots of rollup nodes.** Rollups could share snapshots of their
  data directories which can be downloaded manually by users bootstrapping new
  nodes. These snapshots could contain the latest state of the rollup, and/or
  all the historical blocks.
- **Add peer-to-peer support for historical block sync.** A less manual version
  of sharing snapshots, where rollup nodes could implement built-in support for
  block sync, where rollup nodes download historical block data from each other
  over a peer-to-peer network.
  - [**Namespace pinning.**](https://github.com/celestiaorg/celestia-node/issues/2830)
    In the future, celestia-node is expected to allow nodes to choose to "pin"
    data from selected namespaces that they wish to store and make available for
    other nodes. This will allow rollup nodes to be responsible for storing their
    data, without needing to implement their own peer-to-peer historical block
    sync mechanism.
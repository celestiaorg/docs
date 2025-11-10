---
description: Celestia's Data Availability layer and its key features.
---

# Celestia's data availability layer

Celestia is a data availability (DA) layer that provides a
scalable solution to the [data availability problem](https://coinmarketcap.com/academy/article/what-is-data-availability).
Due to the permissionless nature of the blockchain networks,
a DA layer must provide a mechanism for the execution and settlement
layers to check in a trust-minimized way whether transaction data is indeed available.

Two key features of Celestia's DA layer are [data availability sampling](https://blog.celestia.org/celestia-mvp-release-data-availability-sampling-light-clients)
(DAS) and [Namespaced Merkle trees](https://github.com/celestiaorg/nmt) (NMTs).
Both features are novel blockchain scaling solutions: DAS enables light
nodes to verify data availability without needing to download an entire block;
NMTs enable execution and settlement layers on Celestia to download transactions
that are only relevant to them.

## Data availability sampling (DAS)

In general, light nodes download only block headers that contain
commitments (_i.e._, Merkle roots) of the block data (_i.e._, the list of transactions).

To make DAS possible, Celestia uses a 2-dimensional Reed-Solomon
encoding scheme to encode the block data: every block data is split
into $k \times k$ shares, arranged in a $k \times k$ matrix, and extended with parity
data into a $2k \times 2k$ extended matrix by applying multiple
times Reed-Solomon encoding.

Then, $4k$ separate Merkle roots are computed for the rows and columns
of the extended matrix; the Merkle root of these Merkle roots is used
as the block data commitment in the block header.

![2D Reed-Soloman (RS) Encoding](/img/learn/reed-solomon-encoding.png)

To verify that the data is available, Celestia light nodes are sampling
the $2k \times 2k$ data shares.

Every light node randomly chooses a set of unique coordinates in the
extended matrix and queries bridge nodes for the data shares and the
corresponding Merkle proofs at those coordinates. If light nodes
receive a valid response for each sampling query, then there is a
[high probability guarantee](https://github.com/celestiaorg/celestia-node/issues/805#issuecomment-1150081075)
that the whole block's data is available.

Additionally, every received data share with a correct Merkle proof
is gossiped to the network. As a result, as long as the Celestia light
nodes are sampling together enough data shares (_i.e._, at least
$k \times k$ unique shares),
the full block can be recovered by honest bridge nodes.

For more details on DAS, take a look at the [original paper](https://arxiv.org/abs/1809.09044).

### Scalability

DAS enables Celestia to scale the DA layer. DAS can be performed by
resource-limited light nodes since each light node only samples a small
portion of the block data. The more light nodes there are in the network,
the more data they can collectively download and store.

This means that increasing the number of light nodes performing DAS allows
for larger blocks (_i.e._, with more transactions), while still keeping DAS
feasible for resource-limited light nodes. However, in order to validate
block headers, Celestia light nodes need to download the $4k$ intermediate
Merkle roots.

For a block data size of $n^2$ bytes, this means that every light node must
download $O(n)$ bytes. Therefore, any improvement in the bandwidth capacity
of Celestia light nodes has a quadratic effect on the throughput of Celestia's
DA layer.

### Fraud proofs of incorrectly extended data

The requirement of downloading the $4k$ intermediate Merkle roots is a
consequence of using a 2-dimensional Reed-Solomon encoding scheme. Alternatively,
DAS could be designed with a standard (_i.e._, 1-dimensional) Reed-Solomon encoding,
where the original data is split into $k$ shares and extended with $k$ additional
shares of parity data. Since the block data commitment is the Merkle root of the
$2k$ resulting data shares, light nodes no longer need to download $O(n)$ bytes to
validate block headers.

The downside of the standard Reed-Solomon encoding is dealing with malicious
block producers that generate the extended data incorrectly.

This is possible as **Celestia does not require a majority of the consensus
(_i.e._, block producers) to be honest to guarantee data availability.**
Thus, if the extended data is invalid, the original data might not be
recoverable, even if the light nodes are sampling sufficient unique shares
(_i.e._, at least $k$ for a standard encoding and $k \times k$ for a
2-dimensional encoding).

As a solution, _Fraud Proofs of Incorrectly Generated Extended Data_ enable
light nodes to reject blocks with invalid extended data. Such proofs require
reconstructing the encoding and verifying the mismatch. With standard Reed-Solomon
encoding, this entails downloading the original data, _i.e._, $n^2$ bytes.
Contrastingly, with 2-dimensional Reed-Solomon encoding, only $O(n)$ bytes are
required as it is sufficient to verify only one row or one column of the
extended matrix.

## Namespaced Merkle trees (NMTs)

Celestia partitions the block data into multiple namespaces, one for
every application (e.g., rollup) using the DA layer. As a result, every
application needs to download only its own data and can ignore the data
of other applications.

For this to work, the DA layer must be able to prove that the provided
data is complete, _i.e._, all the data for a given namespace is returned.
To this end, Celestia is using Namespaced Merkle trees (NMTs).

An NMT is a Merkle tree with the leaves ordered by the namespace identifiers
and the hash function modified so that every node in the tree includes the
range of namespaces of all its descendants. The following figure shows an
example of an NMT with height three (_i.e._, eight data shares). The data is
partitioned into three namespaces.

![Namespaced Merkle Tree](/img/learn/nmt.png)

When an application requests the data for namespace 2, the DA layer must
provide the data shares `D3`, `D4`, `D5`, and `D6` and the nodes `N2`, `N8`
and `N7` as proof (note that the application already has the root `N14` from
the block header).

As a result, the application is able to check that the provided data is part
of the block data. Furthermore, the application can verify that all the data
for namespace 2 was provided. If the DA layer provides for example only the
data shares `D4` and `D5`, it must also provide nodes `N12` and `N11` as proofs.
However, the application can identify that the data is incomplete by checking
the namespace range of the two nodes, _i.e._, both `N12` and `N11` have descendants
part of namespace 2.

For more details on NMTs, refer to the [original paper](https://arxiv.org/abs/1905.09274).

## Building a PoS blockchain for DA

### Providing data availability

The Celestia DA layer consists of a PoS blockchain. Celestia is dubbing this
blockchain as the [celestia-app](https://github.com/celestiaorg/celestia-app),
an application that provides transactions to facilitate the DA layer and is built
using [Cosmos SDK](https://docs.cosmos.network/main). The following figure
shows the main components of celestia-app.

![Main components of celestia-app](/img/learn/celestia-app.png)

celestia-app is built on top of [celestia-core](https://github.com/celestiaorg/celestia-core),
a modified version of the [Tendermint consensus algorithm](https://arxiv.org/abs/1807.04938).
Among the more important changes to vanilla Tendermint, celestia-core:

- Enables the erasure coding of block data (using the 2-dimensional Reed-Solomon
  encoding scheme).
- Replaces the regular Merkle tree used by Tendermint to store block data with
  a [Namespaced Merkle tree](https://github.com/celestiaorg/nmt) that enables
  the above layers (_i.e._, execution and settlement) to only download the needed
  data (for more details, see the section below describing use cases).

For more details on the changes to Tendermint, take a look at the
[ADRs](https://github.com/celestiaorg/celestia-core/tree/v0.34.x-celestia/docs/celestia-architecture).
Notice that celestia-core nodes are still using the Tendermint p2p network.

Similarly to Tendermint, celestia-core is connected to the application layer
(_i.e._, the state machine) by [ABCI++](https://github.com/tendermint/tendermint/tree/master/spec/abci%2B%2B),
a major evolution of [ABCI](https://github.com/tendermint/tendermint/tree/master/spec/abci)
(Application Blockchain Interface).

The celestia-app state machine is necessary to execute the PoS logic and to
enable the governance of the DA layer.

However, the celestia-app is data-agnostic -- the state machine neither
validates nor stores the data that is made available by the celestia-app.

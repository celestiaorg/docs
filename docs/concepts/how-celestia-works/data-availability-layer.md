# Celestia's Data Availability Layer
<!-- markdownlint-disable MD013 -->

Celestia is a data availability (DA) layer that provides a scalable solution to the [data availability problem](https://coinmarketcap.com/alexandria/article/what-is-data-availability). Due to the permissionless nature of the blockchain networks, a DA layer must provide a mechanism for the execution and settlement layers to check in a trust-minimized way whether transaction data is indeed available.

Two key features of Celestia's DA layer are [data availability sampling](https://blog.celestia.org/celestia-mvp-release-data-availability-sampling-light-clients/) (DAS) and [Namespaced Merkle trees](https://github.com/celestiaorg/nmt) (NMTs). Both features are novel blockchain scaling solutions: DAS enables light nodes to verify data availability without needing to download an entire block; NMTs enable execution and settlement layers on Celestia to download transactions that are only relevant to them.

## Data Availability Sampling (DAS)

In general, light nodes download only block headers that contain commitments (i.e., Merkle roots) of the block data (i.e., the list of transactions).

To make DAS possible, Celestia uses a 2-dimensional Reed-Solomon encoding scheme to encode the block data: every block data is split into k × k chunks, arranged in a k × k matrix, and extended with parity data into a 2k × 2k extended matrix by applying multiple times Reed-Solomon encoding.

Then, 4k separate Merkle roots are computed for the rows and columns of the extended matrix; the Merkle root of these Merkle roots is used as the block data commitment in the block header.

![2D Reed-Soloman (RS) Encoding](https://lh5.googleusercontent.com/mNMO3uCxrAQmNoibYhuzGPd-y9LKQQuM366zx9TfU70OJSFoN4zL8Oz2_JIb0ctN-J5zmtc1CBD8vG61AVrmvi-_YiYnDaXntLz2CAPrYkwre_Yw1JbsXFDYBYsU4GvMcLyobe6BOJymLyPdpsol-A)

To verify that the data is available, Celestia light nodes are sampling the 2k × 2k data chunks.

Every light node randomly chooses a set of unique coordinates in the extended matrix and queries full nodes for the data chunks and the corresponding Merkle proofs at those coordinates. If light nodes receive a valid response for each sampling query, then there is a [high probability guarantee](https://github.com/celestiaorg/celestia-node/issues/805#issuecomment-1150081075) that the whole block's data is available.

Additionally, every received data chunk with a correct Merkle proof is gossiped to the network. As a result, as long as the Celestia light nodes are sampling together enough data chunks (i.e., at least k × k unique chunks), the full block can be recovered by honest full nodes.

For more details on DAS, take a look at the [original paper](https://arxiv.org/abs/1809.09044).

### Scalability

DAS enables Celestia to scale the DA layer. DAS can be performed by resource-limited light nodes since each light node only samples a small portion of the block data. The more light nodes there are in the network, the more data they can collectively download and store.

This means that increasing the number of light nodes performing DAS allows for larger blocks (i.e., with more transactions), while still keeping DAS feasible for resource-limited light nodes. However, in order to validate block headers, Celestia light nodes need to download the 4k intermediate Merkle roots.

For a block data size of n bytes, this means that every light node must download O(n ) bytes. Therefore, any improvement in the bandwidth capacity of Celestia light nodes has a quadratic effect on the throughput of Celestia's DA layer.

## Namespaced Merkle Trees (NMTs)

Celestia partitions the block data into multiple namespaces, one for every application (e.g., rollup) using the DA layer. As a result, every application needs to download only its own data and can ignore the data of other applications.

For this to work, the DA layer must be able to prove that the provided data is complete, i.e., all the data for a given namespace is returned. To this end, Celestia is using Namespaced Merkle Trees (NMTs).

An NMT is a Merkle tree with the leafs ordered by the namespace identifiers and the hash function modified so that every node  in the tree includes the range of namespaces of all its descendants. The following figure shows an example of an NMT with height three (i.e., eight data chunks). The data is partitioned into three namespaces.

![Namespaced Merkle Tree](https://lh5.googleusercontent.com/s82yGtmVnfhEeKl9Um_tXCZfOL6d6aqdS_-JY0Pt_JCHUwhUN65yZoLXuzg_g82N339_eVGz-8dLwgd6SXn11wqt7OaEbflbHQwWYymGiWARLgeYwyPWBTHqUnRsIAQpeSj_ZTtYaHhISi8QOTA_sQ)

When an application requests the data for namespace 2, the DA layer must provide the data chunks `D3`, `D4`, `D5`, and `D6` and the nodes `N2`, `N8` and `N7` as proof (note that the application already has the root `N14` from the block header).

As a result, the application is able to check that the provided data is part of the block data. Furthermore, the application can verify that all the data for namespace 2 was provided. If the DA layer provides for example only the data chunks `D4` and `D5`, it must also provide nodes `N12` and `N11` as proofs. However, the application can identify that the data is incomplete by checking the namespace range of the two nodes, i.e., both `N12` and `N11` have descendants part of namespace 2.

For more details on NMTs, take a look at the [original paper](https://arxiv.org/abs/1905.09274).

## Building a PoS Blockchain for DA

### Providing Data Availability

The Celestia DA layer consists of a PoS blockchain. Celestia is dubbing this blockchain as the [Celestia App](https://github.com/celestiaorg/celestia-app), an application that provides transactions to facilitate the DA layer and is built using [Cosmos SDK](https://docs.cosmos.network/v0.44/). The following figure shows the main components of Celestia App.

![Main components of Celestia App](https://lh4.googleusercontent.com/p-w8ofLgQOB9pQU5WssNqjIWtJ9Du753Mt5uQTRjVkOoDJfh2L3MVDOnkDzBUTsAcs4wQLY-UHsYVK9ErPxMhQeIunPAm8hChn64w81sLAJCrTsNx_FrernA-wp4TaFHV-7piS-0RzDnxq5dNRE30Q)

Celestia App is built on top of [Celestia Core](https://github.com/celestiaorg/celestia-core), a modified version of the [Tendermint consensus algorithm](https://arxiv.org/abs/1807.04938). Among the more important changes to vanilla Tendermint, Celestia Core

- enables the erasure coding of block data (using the 2-dimensional Reed-Solomon encoding scheme).

- replaces the regular Merkle tree used by Tendermint to store block data with a [Namespaced Merkle tree](https://github.com/celestiaorg/nmt) that enables the above layers (i.e., execution and settlement) to only download the needed data (for more details, see the section below describing use cases).

For more details on the changes to Tendermint, take a look at the [ADRs](https://github.com/celestiaorg/celestia-core/tree/master/docs/celestia-architecture). Notice that Celestia Core nodes are still using the Tendermint p2p network.

Similarly to Tendermint, Celestia Core is connected to the application layer (i.e., the state machine) by [ABCI++](https://github.com/tendermint/tendermint/tree/master/spec/abci%2B%2B), a major evolution of [ABCI](https://github.com/tendermint/tendermint/tree/master/spec/abci) (Application Blockchain Interface).

The Celestia App state machine is necessary to execute the PoS logic and to enable the governance of the DA layer.

However, the Celestia App is data-agnostic -- the state machine neither validates nor stores the data that is made available by the Celestia App.

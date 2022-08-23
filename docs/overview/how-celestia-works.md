# How Celestia Works
<!-- markdownlint-disable MD013 -->

Celestia is a modular blockchain network whose goal is to build a scalable [data availability layer](https://blog.celestia.org/celestia-a-scalable-general-purpose-data-availability-layer-for-decentralized-apps-and-trust-minimized-sidechains/), enabling the next generation of scalable blockchain architectures - [modular blockchains](https://celestia.org/learn/). Celestia scales by [decoupling execution from consensus](https://arxiv.org/abs/1905.09274) and introducing a new primitive, [data availability sampling](https://arxiv.org/abs/1809.09044).

The former entails that Celestia is only responsible for ordering transactions and guaranteeing their data availability; this is similar to [reducing consensus to atomic broadcast](https://en.wikipedia.org/wiki/Atomic_broadcast#Equivalent_to_Consensus).

The latter provides an efficient solution to the [data availability problem](https://coinmarketcap.com/alexandria/article/what-is-data-availability) by only requiring resource-limited light nodes to sample a small number of random chunks from each block to verify data availability.

Interestingly, more light nodes that participate in sampling increases the amount of data that the network can safely handle, enabling the block size to increase without equally increasing the cost to verify the chain.

## Monolithic vs. Modular Blockchains

Blockchains instantiate  [replicated state machines](https://dl.acm.org/doi/abs/10.1145/98163.98167): the nodes in a permissionless distributed network apply an ordered sequence of deterministic transactions to an initial state resulting in a common final state. This means blockchains require the following four functions:

- __Execution__ entails executing transactions that update the state correctly. Thus, execution must ensure that only valid transactions are executed, i.e., transactions that result in valid state machine transitions.

- __Settlement__ entails an environment for execution layers to verify proofs, resolve fraud disputes, and bridge between other execution layers.

- __Consensus__ entails agreeing on the order of the transactions.

- __Data Availability__ (DA) entails making the transaction data available. Note that execution, settlement, and consensus require DA.

Traditional blockchains, i.e. _monolithic blockchains_, implement all four functions together in a single base consensus layer. The problem with monolithic blockchains is that the consensus layer must perform a lot of different tasks and it cannot be optimized for only one of these functions. As a result, the monolithic paradigm limits the throughput of the system.

![Modular VS Monolithic](https://lh6.googleusercontent.com/7ku-4p3cgncIleAxJgQgt7mpBGeCY24O6kbLyR_WlN1p0IAPQLC0_ViweUzTiMs04pNrxwmmpnXFx0X5SCSCxVLPP2YfK0E8DuaTI1-txhbvV3jEp9JWZNj9Z_KpuGc2hnNpPcJONvjZKTSLTaGwTA)

As a solution, modular blockchains decouple these functions among multiple specialized layers as part of a modular stack. Due to the flexibility that specialization provides, there are many possibilities in which that stack can be arranged. For example, one such arrangement is the separation of the four functions into three specialized layers.

The base layer consists of DA and consensus and thus, is referred to as the Consensus and DA layer (or for brevity, the DA layer), while both settlement and execution are moved on top in their own layers. As a result, every layer can be specialized to optimally perform only its function and thus, increase the throughput of the system. Furthermore, this modular paradigm enables multiple execution layers, i.e., [rollups](https://vitalik.ca/general/2021/01/05/rollup.html), to use the same settlement and DA layers.

## Celestia's Data Availability Layer

Celestia is a data availability (DA) layer that provides a scalable solution to the [data availability problem](https://coinmarketcap.com/alexandria/article/what-is-data-availability). Due to the permissionless nature of the blockchain networks, a DA layer must provide a mechanism for the execution and settlement layers to check in a trust-minimized way whether transaction data is indeed available.

Two key features of Celestia's DA layer are [data availability sampling](https://blog.celestia.org/celestia-mvp-release-data-availability-sampling-light-clients/) (DAS) and [Namespaced Merkle trees](https://github.com/celestiaorg/nmt) (NMTs). Both features are novel blockchain scaling solutions: DAS enables light nodes to verify data availability without needing to download an entire block; NMTs enable execution and settlement layers on Celestia to download transactions that are only relevant to them.

### Data Availability Sampling (DAS)

In general, light nodes download only block headers that contain commitments (i.e., Merkle roots) of the block data (i.e., the list of transactions).

To make DAS possible, Celestia uses a 2-dimensional Reed-Solomon encoding scheme to encode the block data: every block data is split into k × k chunks, arranged in a k × k matrix, and extended with parity data into a 2k × 2k extended matrix by applying multiple times Reed-Solomon encoding.

Then, 4k separate Merkle roots are computed for the rows and columns of the extended matrix; the Merkle root of these Merkle roots is used as the block data commitment in the block header.

![2D Reed-Soloman (RS) Encoding](https://lh5.googleusercontent.com/mNMO3uCxrAQmNoibYhuzGPd-y9LKQQuM366zx9TfU70OJSFoN4zL8Oz2_JIb0ctN-J5zmtc1CBD8vG61AVrmvi-_YiYnDaXntLz2CAPrYkwre_Yw1JbsXFDYBYsU4GvMcLyobe6BOJymLyPdpsol-A)

To verify that the data is available, Celestia light nodes are sampling the 2k × 2k data chunks.

Every light node randomly chooses a set of unique coordinates in the extended matrix and queries full nodes for the data chunks and the corresponding Merkle proofs at those coordinates. If light nodes receive a valid response for each sampling query, then there is a [high probability guarantee](https://github.com/celestiaorg/celestia-node/issues/805#issuecomment-1150081075) that the whole block's data is available.

Additionally, every received data chunk with a correct Merkle proof is gossiped to the network. As a result, as long as the Celestia light nodes are sampling together enough data chunks (i.e., at least k × k unique chunks), the full block can be recovered by honest full nodes.

For more details on DAS, take a look at the [original paper](https://arxiv.org/abs/1809.09044).

#### Scalability

DAS enables Celestia to scale the DA layer. DAS can be performed by resource-limited light nodes since each light node only samples a small portion of the block data. The more light nodes there are in the network, the more data they can collectively download and store.

This means that increasing the number of light nodes performing DAS allows for larger blocks (i.e., with more transactions), while still keeping DAS feasible for resource-limited light nodes. However, in order to validate block headers, Celestia light nodes need to download the 4k intermediate Merkle roots.

For a block data size of n bytes, this means that every light node must download O(n ) bytes. Therefore, any improvement in the bandwidth capacity of Celestia light nodes has a quadratic effect on the throughput of Celestia's DA layer.

### Namespaced Merkle Trees (NMTs)

Celestia partitions the block data into multiple namespaces, one for every application (e.g., rollup) using the DA layer. As a result, every application needs to download only its own data and can ignore the data of other applications.

For this to work, the DA layer must be able to prove that the provided data is complete, i.e., all the data for a given namespace is returned. To this end, Celestia is using Namespaced Merkle Trees (NMTs).

An NMT is a Merkle tree with the leafs ordered by the namespace identifiers and the hash function modified so that every node  in the tree includes the range of namespaces of all its descendants. The following figure shows an example of an NMT with height three (i.e., eight data chunks). The data is partitioned into three namespaces.

![Namespaced Merkle Tree](https://lh5.googleusercontent.com/s82yGtmVnfhEeKl9Um_tXCZfOL6d6aqdS_-JY0Pt_JCHUwhUN65yZoLXuzg_g82N339_eVGz-8dLwgd6SXn11wqt7OaEbflbHQwWYymGiWARLgeYwyPWBTHqUnRsIAQpeSj_ZTtYaHhISi8QOTA_sQ)

When an application requests the data for namespace 2, the DA layer must provide the data chunks `D3`, `D4`, `D5`, and `D6` and the nodes `N2`, `N8` and `N7` as proof (note that the application already has the root `N14` from the block header).

As a result, the application is able to check that the provided data is part of the block data. Furthermore, the application can verify that all the data for namespace 2 was provided. If the DA layer provides for example only the data chunks `D4` and `D5`, it must also provide nodes `N12` and `N11` as proofs. However, the application can identify that the data is incomplete by checking the namespace range of the two nodes, i.e., both `N12` and `N11` have descendants part of namespace 2.

For more details on NMTs, take a look at the [original paper](https://arxiv.org/abs/1905.09274).

### Building a PoS Blockchain for DA

#### Providing Data Availability

The Celestia DA layer consists of a PoS blockchain. Celestia is dubbing this blockchain as the [Celestia App](https://github.com/celestiaorg/celestia-app), an application that provides transactions to facilitate the DA layer and is built using [Cosmos SDK](https://docs.cosmos.network/v0.44/). The following figure shows the main components of Celestia App.

![Main components of Celestia App](https://lh4.googleusercontent.com/p-w8ofLgQOB9pQU5WssNqjIWtJ9Du753Mt5uQTRjVkOoDJfh2L3MVDOnkDzBUTsAcs4wQLY-UHsYVK9ErPxMhQeIunPAm8hChn64w81sLAJCrTsNx_FrernA-wp4TaFHV-7piS-0RzDnxq5dNRE30Q)

Celestia App is built on top of [Celestia Core](https://github.com/celestiaorg/celestia-core), a modified version of the [Tendermint consensus algorithm](https://arxiv.org/abs/1807.04938). Among the more important changes to vanilla Tendermint, Celestia Core

- enables the erasure coding of block data (using the 2-dimensional Reed-Solomon encoding scheme).

- replaces the regular Merkle tree used by Tendermint to store block data with a [Namespaced Merkle tree](https://github.com/celestiaorg/nmt) that enables the above layers (i.e., execution and settlement) to only download the needed data (for more details, see the section below describing use cases).

For more details on the changes to Tendermint, take a look at the [ADRs](https://github.com/celestiaorg/celestia-core/tree/master/docs/celestia-architecture). Notice that Celestia Core nodes are still using the Tendermint p2p network.

Similarly to Tendermint, Celestia Core is connected to the application layer (i.e., the state machine) by [ABCI++](https://github.com/tendermint/tendermint/tree/master/spec/abci%2B%2B), a major evolution of [ABCI](https://github.com/tendermint/tendermint/tree/master/spec/abci) (Application Blockchain Interface).

The Celestia App state machine is necessary to execute the PoS logic and to enable the governance of the DA layer.

However, the Celestia App is data-agnostic -- the state machine neither validates nor stores the data that is made available by the Celestia App.

#### The Lifecycle of a Celestia App Transaction

Users request the Celestia App to make data available by sending `PayForData` transactions.

Every such transaction consists of the identity of the sender, the data to be made available, also referred to as the message, the data size, the namespace ID, and a signature. Every block producer batches multiple `PayForData` transactions into a block.

Before proposing the block though, the producer passes it to the state machine via ABCI++, where each `PayForData` transaction is split into a namespaced message (denoted by `Msg` in the figure below), i.e., the data together with the namespace ID, and an executable transaction (denoted by `e-Tx` in the figure below) that does not contain the data, but only a commitment that can be used at a later time to prove that the data was indeed made available.

Thus, the block data consists of data partitioned into namespaces and executable transactions. Note that only these transactions are executed by the Celestia state machine once the block is committed.

![Lifecycle of a Celestia App Transaction](https://lh5.googleusercontent.com/M9zjENYRZZs49DrbGdry3NPxX1wbsgLVn7JYKiibnwSbw2mNKliASmnsPYrINiAZnjr0tvwV1YhqDoheW6-yITDCadrHXB8NBcPKwbvcqYe8Vt1EhVXJ8yMiWTqHMJYZe_uJOr0tIi6d7GuOBGmM2g)

Next, the block producer adds to the block header a commitment of the block data. As described [here](./fraud-proofs), the commitment is the Merkle root of the 4k intermediate Merkle roots (i.e., one for each row and column of the extended matrix). To compute this commitment, the block producer performs the following operations:

- It splits the executable transactions and the namespaced data into shares. Every share consists of some bytes prefixed by a namespace ID. To this end, the executable transactions are associated with a reserved namespace.

- It arranges these shares into a square matrix (row-wise). Note that the shares are padded to the next power of two. The outcome square of size k × k is referred to as the original data.

- It extends the original data to a 2k × 2k square matrix using the 2-dimensional Reed-Solomon encoding scheme described above. The extended shares (i.e., containing erasure data) are associated with another reserved namespace.

- It computes a commitment for every row and column of the extended matrix using the NMTs described above.

Thus, the commitment of the block data is the root of a Merkle tree with the leaves the roots of a forest of Namespaced Merkle subtrees, one for every row and column of the extended matrix.

#### Checking data availability

![DA network](https://lh5.googleusercontent.com/bo_0pMKWBytjvmUegSiv3ffbAUeTe8Un0aHVG_4R29cB9kAgOZM326KmpsZsVrXc1Ji5U_GoOZjQV9wrAkZGY477b2tNeddCU0PMzDvyTYMwMGSRXD05_k8hVExtq0-tYcvBz9Wbjb_e5iQ4qmUwxw)

To enhance connectivity, the Celestia Node augments the Celestia App with a separate libp2p network, i.e., the so-called _DA network_, that serves DAS requests.

Light nodes connect to a Celestia Node in the DA network, listen to extended block headers (i.e., the block headers together with the relevant DA metadata, such as the 4k intermediate Merkle roots), and perform DAS on the received headers (i.e., ask for random data chunks).

Note that although it is recommended, performing DAS is optional -- light nodes could just trust that the data corresponding to the commitments in the block headers was indeed made available by the Celestia DA layer. In addition, light nodes can also submit transactions to the Celestia App, i.e., `PayForData` transactions.

While performing DAS for a block header, every light node queries Celestia Nodes for a number of random data chunks from the extended matrix and the corresponding Merkle proofs. If all the queries are successful, then the light node accepts the block header as valid (from a DA perspective).

If at least one of the queries fails (i.e., either the data chunk is not received or the Merkle proof is invalid), then the light node rejects the block header and tries again later. The retrial is necessary to deal with false negatives, i.e., block headers being rejected although the block data is available. This may happen due to network congestion for example.

Alternatively, light nodes may accept a block header although the data is not available, i.e., a _false positive_. This is possible since the soundness property (i.e., if an honest light node accepts a block as available, then at least one honest full node will eventually have the entire block data) is probabilistically guaranteed (for more details, take a look at the [original paper](https://arxiv.org/abs/1809.09044)).

By fine tuning Celestia's parameters (e.g., the number of data chunks sampled by each light node) the likelihood of false positives can be sufficiently reduced such that block producers have no incentive to withhold the block data.

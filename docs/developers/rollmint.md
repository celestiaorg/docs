---
sidebar_label: Rollmint
---

# Rollmint

![rollmint](/img/rollmint.png)

[Rollmint](https://github.com/celestiaorg/rollmint) is an ABCI
(Application Blockchain Interface) implementation for sovereign
rollups to deploy on top of Celestia.

It is built by replacing Tendermint, the Cosmos-SDK
consensus layer, with a drop-in replacement that
communicates directly with Celestia's Data Availability layer.

It spins up a sovereign rollup, which collects transactions into blocks and
posts them onto Celestia for consensus and data availability.

The goal of Rollmint is to enable anyone to design and
deploy a sovereign rollup on Celestia in minutes.

Furthermore, while Rollmint allows you to build sovereign rollups
on Celestia, it currently does not support fraud proofs yet and is
therefore running in "pessimistic" mode, where nodes would need to
re-execute the transactions to check the validity of the chain
(i.e. a full node). Furthermore, Rollmint currently only supports
a single sequencer.

## Specification of the Optimistic Rollup scheme and necessary components

### Introduction

This document provides an overview on how to implement Cosmos-SDK based Rollup chains. It goes into detail about how these chains can be built using CelestiaLazyLedger as a Data Availability (DA) layer. At the same time we try to keep the high level API general enough such that developers can choose alternative DA layers (e.g. Ethereum, the Cosmos Hub).

We briefly compare building a Cosmos-SDK ORU chain with the status quo (building a sovereign Cosmos zone): The current way to use the Cosmos-SDK is to define the state-machine aka Application. Application developers do not have to bother about the lower layers, namely consensus and networking. The lower layers are currently handled by another application-agnostic piece of the stack, namely the abci-client which defaults to tendermint-core. We will replace the default abci-client with one that does not handle Consensus itself. Instead it will “only” provide the networking layer, and will use the Consensus of the DA layer. How exactly will be described below.

To summarize, if a current SDK-based app roughly follows the following architecture:

![Screen Shot 2022-10-26 at 10.36.06 AM.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/6bc47f0f-a383-4f75-8bf5-5e71ff83a31d/Screen_Shot_2022-10-26_at_10.36.06_AM.png)

![Screen Shot 2022-10-26 at 10.36.14 AM.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/4a50776d-bd33-4ada-b2c1-854e74b7749b/Screen_Shot_2022-10-26_at_10.36.14_AM.png)

When implementing a Cosmos-SDK based ORU-chain, this overview changes to:

![Screen Shot 2022-10-26 at 10.37.00 AM.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/911b5535-6eba-4f26-98ad-fa6b892a818a/Screen_Shot_2022-10-26_at_10.37.00_AM.png)

![Screen Shot 2022-10-26 at 10.37.38 AM.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/bfc24094-a25b-4ca2-9894-370e55a553fa/Screen_Shot_2022-10-26_at_10.37.38_AM.png)

Note that from the point of view of an application-developer nothing changes. They have the exact same (developer) usability as with the usual Cosmos-SDK together with tendermint provides: they still just have to define their business / state-machine logic. The ORU-specific ABCI-client is stripped down to only handle the network layer but it also embeds a (light-) client of the DA layer chain used and takes care of submitting the block to the DA layer.

As with tendermint the state-machine and Optimint interact with each other via ABCI.

#### Definitions

- **(ORU) Block time** - configurable duration after which a new block of the (Optimistic RollUps chain) is produced.
- **Grace period** - configurable duration between block creation and block finality. It’s the time window for fraud proof submission.

#### Architecture Overview

- sidechain aggregator sends block to main chain for DA (CelestiaLazyLedger, Ethereum, Cosmos Hub)
- if time passes without fraud proof, block is considered valid
- else, if fraud proof, orphan all subsequent blocks
- with bond on ethereum, or with longer block times and p2p gossip in side-chains subnet, or, liquidity providers

[https://lh3.googleusercontent.com/pGQlfcW5ID4naR_GnfpPsEPmw-aUJ9JXRwFM8uikaGbD2f-xqs8HTrMiPS1QPeVzw96asXWny--DGLLgo9F_ETrHj-TE60MnzlbCZRO7k751vmm5V1UyWla0THD9qs_pNdfTx9JYSTcSUVg3XkPiIgA3gQS7AE9a8FH43S7y1e1fr2V1TGg6_3HN](https://lh3.googleusercontent.com/pGQlfcW5ID4naR_GnfpPsEPmw-aUJ9JXRwFM8uikaGbD2f-xqs8HTrMiPS1QPeVzw96asXWny--DGLLgo9F_ETrHj-TE60MnzlbCZRO7k751vmm5V1UyWla0THD9qs_pNdfTx9JYSTcSUVg3XkPiIgA3gQS7AE9a8FH43S7y1e1fr2V1TGg6_3HN)

##### Full nodes

Full nodes are a crucial part of the networks, because they are responsible for producing blocks and fraud proofs. They also create a link between the Optimistic RollUps network and the data availability layer, by pushing aggregates to the data availability layer.

##### Light clients

Light clients are the main producer of transactions in the Optimistic RollUps network. They participate in gossiping of both transactions and fraud proofs. Light clients may only request or store a subset of the state, just to ensure that they can execute rollback.

#### Design decisions & rationale

##### Create ABCI-client from scratch

We discussed two approaches to creating ABCI-client that does not explicitly do consensus: 1) adopting Tendermint Core to our needs and 2) creating ABCI-client from scratch as a drop-in replacement for Tendermint (discussion started [here](https://github.com/lazyledger/lazyledger-core/issues/62)).

We decided to create it from scratch. This gives us more flexibility and will result in a cleaner design and more light-weight implementation. Also, this decision still leaves room for using certain parts of the tendermint-core code base as a library where it makes sense to do so.

Add Data Availability layer client to ABCI-client.

Interacting with the Data availability layer could be added to either the ABCI-client (Optimint) or to the Cosmos-SDK (e.g. as a module). We decide to integrate this into the ABCI-client because it fits better with the current philosophy of separating the state-machine from the lower layers. We plan to make sure that the Data Availability layer remains pluggable. This will be achieved by defining an interface which developers can implement to plug in their own DA-layer client.

##### Use libp2p as a peer-to-peer networking layer

While we are aware of the shortcomings of libp2p (e.g. as summarized in the [Koyokan report](https://docs.google.com/document/d/17OMi1MedOetF4Febijsc6KvGeNZdDQMb0yeC4QixOxw)), we decided to use it for Optimint’s p2p stack. Main reasons are that Libp2p is one of most stable and popular P2P libraries available, with a relatively stable API with an upgrade path in case of breaking changes. It also provides modules for most common tasks like peer discovery, gossiping, and distributed hash tables (DHTs). It is also used internally by IPFS - which we plan to use either way (see below).

##### Use IPFS and IPLD plugin for accessing blocks and block chunks

We have already invested time to validate that using IPFS for DA sampling as well as a way to retrieve full blocks is feasible. We have noticed that we can likely improve latencies by switching to Graphsync as a (IPLD) block exchange. Our first implementation will still use bitswap which is the current default block exchange protocol used in IPFS.

##### Use Protocol Buffers (protobuf) for serialization

Protocol Buffers (protobuf) is a well known and widely adopted serialization format. It’s both efficient and language-agnostic. It is also widely used in the Cosmos ecosystem.

##### Rather long block times, so fraud proofs can be gossiped before the block is complete

We need to experiment with block times and grace period values to determine what works best. Our first assumption is that ORU chain is not targeting short block-times, something like 60s sound reasonable. Grace period should be significantly shorter, like 30s. In such a scenario, we can assure that no more than 1 block at a time will be rolled back.

### Components

#### ABCI Client

##### Transaction Aggregation

Transactions will be aggregated by full nodes. It’s basically the same operation as creating a block with ABCI interface. Multiple parameters should be configurable e.g., block time, maximum block size.

##### ABCI Interface

ABCI is what will enable a relatively seamless replacement of Tendermint with Optimint. Of course the devil is in the detail and there is more to it than simply replacing tendermint with another piece of software that fulfils the client side of the ABCI contract, e.g. the SDK spins up a tendermint node. These places seem managable and having a clear interface between state-machine and the consensus/networking layer makes it possible to replace Tendermint with another abci-client.

As we want to change as little as possible inside the SDk we will surely have to stick to the vanilla ABCI interface. That said, some of the properties we also want for the ORU-chains, e.g., that the intermediate state roots and the final state root (aka app-hash) of a block match the state transitions implied by the Transactions included in that very same block require changes in the ABCI itself. While part intentionally is not part of this project’s scope, we are closely monitoring [ABCI++](https://github.com/tendermint/spec/pull/254) and plan to closely collaborate with Sikka on both specifying as well as facilitating the implementation efforts by providing feedback or by implementing the parts that we need in our forks.

#### Mempool

Mempool keeps the set of pending transactions, and is used by block producers (full nodes) to produce blocks. Transactions are handled by nodes in the First-Come, First-Served (FCFS) manner. Ordering of transactions can be implemented on the application level (for example by adding nonce/sequence number). This behaviour is similar to Tendermint mempool.

##### P2P Layer

Full nodes and light clients will be connected by the peer-to-peer network implemented with libp2p. There are many implementations of Publish-Subscribe messaging pattern, but libp2p-gossipsub is chosen because it’s the most advanced one.

##### Peer discovery

Initial peer discovery will be done via static configuration. Those bootstrap/seed nodes will then be used by go-libp2p-discovery to connect to the rest of the network and maintain a peer list.

##### Transactions and Fraud Proofs Gossiping

Transactions will be propagated in the P2P network using the gossiping mechanism.

Fraud proofs can be produced only by full nodes. They will be delivered to all nodes in the network with a gossiping mechanism. This will ensure that fraud proofs are delivered to all nodes as soon as possible, without delay (like waiting on block finalization). If the grace period is shorter than block time, light clients don’t need to keep historical data.

#### Commits to Data Availability Layer

Optimint needs to submit the block to the data availability layer. For that it needs to keep a (light) client of the DA chain running. Additionally, it will need an account of that chain and sufficient balances for submitting a Transaction to the DA chain.

Note that this only triggers a real state transition on the DA chain. On the ORU chain successfully submitting the block to the DA layer (which includes it in its block) means that the ORU block was finalized.

To keep the greatest flexibility, we start with the following very limited interface and extend it only if necessary for implementing using CelestiaLazyLedger as a DA layer (certainly in a way that would not limit developers to use other DA layers though):

```bash
// TODO define an enum of different non-happy-path cases
// that might need to be handled by Optimint independent of
// the underlying DA chain.
type StatusCode uint64

type ResultSubmitBlock struct {
  // Code is to determine if the action succeeded.
  Code StatusCode
  // Not sure if this needs to be bubbled up to other
  // parts of Optimint.
  // Hash hash.Hash
}

type DataAvailabilityLayerClient interface {
  Start() error
  Stop() error

  // SubmitBlock submits the passed in block to the DA layer.
  // This should create a transaction which (potentially)
  // triggers a state transition in the DA layer.
  SubmitBlock(block types.Block) ResultSubmitBlock
}
```

The SubmitBlock method will be called on an aggregator node before Optimint tells the application (via ABCI) to commit the state (via the Commit method which might be renamed to FinalizeBlock - see discussion on [abci++ PR](https://github.com/tendermint/spec/pull/254)). Only if SubmitBlock succeeds the application will update the state accordingly, otherwise the aggregator has to retry or another aggregator node might do so before the aggregator does (in that case we need a tie breaking rule, e.g. first-come-first-serve is a good start here, or, round-robin which would be more similar to using Tendermint). Start and Stop are only called together with spinning up or shutting down the node respectively.

##### Data Availability Checks

##### Accessing Block Chunks

IPFS supplemented with CelestiaLazyLedger IPLD plugin is able to access chunks of blocks. Thanks to this functionality, light clients can avoid downloading entire blocks from the Data Availability layer. Instead, they can download only the parts they actually need.

##### Consensus

The Optimistic RollUps chain will have no consensus rules. All valid transactions will be accepted by block creators. Fraud proofs will be the only way to detect and rollback malicious state transitions.

#### Cosmos-SDK Optimistic Rollup module

##### Sparse Merkle Trees

The state of the Optimistic RollUps chain will be stored in a Sparse Merkle Tree. They can be used to generate fraud proofs in very compact and easy to verify form.

Currently, we’re actively participating in developing [a proSeparation of storage and commitment (by the SMT) will allow the optimization of different components according to their usage and access patterns.](https://github.com/cosmos/cosmos-sdk/pull/8430)

[￼posal](https://github.com/cosmos/cosmos-sdk/pull/8430) for replacing IAVL+ trees with SMTs for the entire state in Cosmos-SDK.

##### Intermediate State Roots

To be able to validate fraud proofs, blocks of the Optimistic RollUps chain have to contain intermediate state roots, reflecting the state of SMT after every transaction.

##### Fraud Proofs

##### Usage of fraud proofs in ABCI Client

##### Cosmos SDK module

### Data Types / Message Formats

#### Block.Data

| Field | Description |
| --- | --- |
| TXs | Transaction data. |
| intermediateStateRoots | Intermediate state roots for each transaction. |

#### Fraud Proof

| Field | Description |
| --- | --- |
| blockHash | Hash of corresponding block header. |
| preStateRoot | Root of Sparse Merkle Tree of the blockchain state before transaction. |
| postStateRoot | Root of Sparse Merkle Tree of the blockchain state after transaction. |
| transaction | Transaction (app specific). |
| witness | Merkle Proofs. |

### Required changes in Cosmos-SDK

- Add SMT storage.
- Replace Tendermint Core with ORU ABCI client.
- Add intermediate state roots to Block.Data

### References

[GitHub Project Board](https://github.com/orgs/lazyledger/projects/2)

#### Issues & Pull requests

##### In progress

[Replace IAVL+ with SMT](https://github.com/lazyledger/cosmos-sdk/issues/6)

##### Review in progress

[Initial SMT store type](https://github.com/lazyledger/cosmos-sdk/pull/12)

##### To do

[ABCI interface](https://github.com/lazyledger/optimint/issues/1)

[Peer discovery](https://github.com/lazyledger/optimint/issues/2)

[Transaction gossiping](https://github.com/lazyledger/optimint/issues/3)

[Fraud proofs gossiping](https://github.com/lazyledger/optimint/issues/4)

[Mempool](https://github.com/lazyledger/optimint/issues/5)

[Fraud proof generation](https://github.com/lazyledger/optimint/issues/6)

[Rollback of invalidated transactions](https://github.com/lazyledger/optimint/issues/7)

[Data Availability layer API](https://github.com/lazyledger/optimint/issues/8)

[Keep track of and return intermediate state roots to be included in the block](https://github.com/lazyledger/cosmos-sdk/issues/8)

[Fold the validator roots into the state tree](https://github.com/lazyledger/cosmos-sdk/issues/7)

### Notes

1. It makes sense to include fraud proof into valid blocks.
2. Grace period for fraud proofs - needs to be defined - 30s? Needs experiments.
3. Block pushed into DA immediately not after the grace period.
4. Rollback: drop blocks and transactions (app layer needs to resend).
5. We can assume that only one block is rolled back.

### Pending questions

1. Who can publish aggregates to DA?
2. What parts of the spec should be universal and what can be LL-specific?
3. What exactly goes into DA?

## Tutorials

The following tutorials will help you get started building
Cosmos-SDK applications that connect to Celestia's Data Availability
Layer via Rollmint. We call those chains Sovereign Rollups.

You can get started with the following tutorials:

- [gm world](./gm-world.md)
- [Wordle Game](./wordle.md)
- [CosmWasm Tutorial](./cosmwasm.md)

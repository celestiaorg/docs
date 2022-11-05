---
sidebar_label: Rollmint
---

# Rollmint

![rollmint](/img/rollmint.png)

[Rollmint](https://github.com/celestiaorg/rollmint) is an ABCI
(Application Blockchain Interface) implementation for sovereign
rollups to deploy on top of Celestia.

It is built by replacing Tendermint, the Cosmos-SDK
Consensus Layer, with a drop-in replacement that
communicates directly with Celestia's Data Availability (DA) and Consensus Layer.

It spins up a sovereign rollup, which collects transactions into blocks and
posts them onto Celestia for DA and Consensus.

The goal of Rollmint is to enable anyone to design and
deploy a sovereign rollup on Celestia in minutes with minimal overhead.

Furthermore, while Rollmint allows you to build sovereign rollups
on Celestia, it currently does not support fraud proofs yet and is
therefore running in "pessimistic" mode, where nodes would need to
re-execute the transactions to check the validity of the chain
(i.e. a full node). Furthermore, Rollmint currently only supports
a single sequencer.

## Specifications of the Rollmint Scheme and Necessary Components

### Introduction

This document provides an overview on how to implement Cosmos-SDK based Rollup
chains. It goes into detail about how these chains can be built using Celestia
as a Data Availability (DA) and Consensus Layer. At the same time we try to
keep the high level API general enough such that developers can choose
alternative DA and Consensus Layers (e.g. Ethereum, the Cosmos Hub).

We briefly compare building a Cosmos-SDK Rollmint chain with the status quo
(building a sovereign Cosmos zone): The current way to use the Cosmos-SDK is to
define the state-machine, also referred to as the Application. Application
developers do not have to bother about the lower Layers, namely consensus and
<!-- is networking right? -->
networking. The lower Layers are currently handled by another
application-agnostic piece of the stack, namely the ABCI Client which defaults
to `tendermint-core`. We will replace the default ABCI Client with one that
does not handle Consensus itself. Instead it will only provide the networking
Layers, and will use the Consensus of the DA Layer. How exactly will be
described below:

To summarize, if a current SDK-based app roughly follows the following
architecture:
<!-- add excalidraw versions of graphics below -->
![Screen Shot 2022-10-26 at 10.36.06 AM.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/6bc47f0f-a383-4f75-8bf5-5e71ff83a31d/Screen_Shot_2022-10-26_at_10.36.06_AM.png)

![Screen Shot 2022-10-26 at 10.36.14 AM.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/4a50776d-bd33-4ada-b2c1-854e74b7749b/Screen_Shot_2022-10-26_at_10.36.14_AM.png)

When implementing a Cosmos-SDK based Rollmint chain, this overview changes to:

![Screen Shot 2022-10-26 at 10.37.00 AM.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/911b5535-6eba-4f26-98ad-fa6b892a818a/Screen_Shot_2022-10-26_at_10.37.00_AM.png)

![Screen Shot 2022-10-26 at 10.37.38 AM.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/bfc24094-a25b-4ca2-9894-370e55a553fa/Screen_Shot_2022-10-26_at_10.37.38_AM.png)

Note that from the point of view of an application developer, nothing changes.
Rollmint has the exact same developer experience as the usual Cosmos-SDK with
Tendermint provides: they still just have to define their business /
state-machine logic. The Rollmint-specific ABCI Client is stripped down to only
handle the network Layer but it also embeds a light node of the DA and
Consensus Layer chain used and takes care of submitting the block to the DA
and Consensus Layer.

As with Tendermint the state-machine and Rollmint interact with each other via
ABCI.

#### Definitions

- **Rollmint Block Time** - configurable duration after which a new block of
the (Rollmint chain) is produced.
- **Grace Period** - configurable duration between block creation and block
finality. It’s the time window for fraud proof submission.

#### Architecture Overview

- Rollmint aggregator sends block to main chain for DA and Consensus (Celestia,
Ethereum, Cosmos Hub)
- If time passes without fraud proof, the block is considered valid
- Else, if fraud proof, orphan all subsequent blocks
- With bond on Ethereum, or with longer block times and p2p gossip in
side-chains subnet, or, liquidity providers

![https://lh3.googleusercontent.com/pGQlfcW5ID4naR_GnfpPsEPmw-aUJ9JXRwFM8uikaGbD2f-xqs8HTrMiPS1QPeVzw96asXWny--DGLLgo9F_ETrHj-TE60MnzlbCZRO7k751vmm5V1UyWla0THD9qs_pNdfTx9JYSTcSUVg3XkPiIgA3gQS7AE9a8FH43S7y1e1fr2V1TGg6_3HN](https://lh3.googleusercontent.com/pGQlfcW5ID4naR_GnfpPsEPmw-aUJ9JXRwFM8uikaGbD2f-xqs8HTrMiPS1QPeVzw96asXWny--DGLLgo9F_ETrHj-TE60MnzlbCZRO7k751vmm5V1UyWla0THD9qs_pNdfTx9JYSTcSUVg3XkPiIgA3gQS7AE9a8FH43S7y1e1fr2V1TGg6_3HN)

##### Full Nodes

Full nodes are a crucial part of the networks, because they are responsible for
producing blocks and fraud proofs. They also create a link between the Rollmint
network and the DA and Consensus Layer, by pushing aggregates to the DA and
Consensus Layer.

##### Light Nodes

Light nodes are the main producer of transactions in the Rollmint network.
They participate in gossiping of both transactions and fraud proofs. Light
nodes may only request or store a subset of the state, just to ensure that they
can execute rollback.

#### Design Decisions & Rationale

##### Create an ABCI Client from Scratch

We discussed two approaches to creating an ABCI Client that does not explicitly
do consensus: **1)** adopting `tendermint-core` to our needs and **2)** creating
ABCI Client from scratch as a drop-in replacement for Tendermint (discussion
started [here](https://github.com/lazyledger/lazyledger-core/issues/62)).

We decided to create it from scratch. This gives us more flexibility and will
result in a cleaner design and more lightweight implementation. Also, this
decision still leaves room for using certain parts of the `tendermint-core` code
base as a library where it makes sense to do so.

##### Add DA and Consensus Layer Client to ABCI Client

Interacting with the DA and Consensus Layer could be added to either the
ABCI Client (Rollmint) or to the Cosmos-SDK (e.g. as a module). We decide to
integrate this into the ABCI Client because it fits better with the current
philosophy of separating the state-machine from the lower Layers. We plan to
make sure that the DA and Consensus Layer remains modular. This will be
achieved by defining an interface which developers can implement to plug in
their own DA and Consensus Layer client.

##### Use Libp2p as a Peer-to-Peer networking Layer

While we are aware of the shortcomings of Libp2p (e.g. as summarized in the
[Koyokan report](https://docs.google.com/document/d/17OMi1MedOetF4Febijsc6KvGeNZdDQMb0yeC4QixOxw)),
we decided to use it for Rollmint’s p2p stack. Main reasons are that Libp2p is
one of most stable and popular P2P libraries available, with a relatively
stable API with an upgrade path in case of breaking changes. It also provides
modules for most common tasks like peer discovery, gossiping, and Distributed
Hash Tables (DHTs). It is also used internally by IPFS - which we plan to use
(see below).

##### Use IPFS and IPLD Plugin for Accessing Blocks and Block Chunks

We have validated that using IPFS for DA and Consensus sampling and as a way to
retrieve full blocks is feasible. We have noticed that we can likely improve
latencies by switching to Graphsync as a (IPLD) block exchange. Our first
implementation will still use bitswap which is the current default block
exchange protocol used in IPFS.

##### Use Protocol Buffers (protobuf) for Serialization

Protocol Buffers (protobuf) is a well known and widely adopted serialization
format. It’s both efficient and language-agnostic. It is also widely used in
the Cosmos ecosystem.

<!-- markdownlint-disable MD013 -->
##### Rather Long Block Times, so Fraud Proofs can be Gossiped before the Block is Complete
<!-- markdownlint-enable MD013 -->

We need to experiment with block times and grace period values to determine what
works best. Our first assumption is that Rollmint chain is not targeting short
block-times, something like 60 seconds sound reasonable. The grace period should
be significantly shorter, like 30 seconds. In such a scenario, we can assure
that no more than one block at a time will be rolled back.

### Components

#### ABCI Client

##### Transaction Aggregation

Transactions will be aggregated by full nodes. It is fundamentally the same
operation as creating a block with ABCI interface. Multiple parameters should be
configurable e.g. block time, maximum block size.

##### ABCI Interface

ABCI is what will enable a relatively seamless replacement of Tendermint with
Rollmint. Of course the devil is in the detail and there is more to it than
simply replacing Tendermint with another piece of software that fulfils the
client side of the ABCI contract, e.g. the SDK spins up a Tendermint node. These
places seem managable and having a clear interface between state-machine and the
DA and Consensus Layer makes it possible to replace Tendermint with another
ABCI Client.

As we want to change as little as possible inside the SDK we will surely have to
stick to the vanilla ABCI interface. That said, some of the properties we also
want for the Rollmint chains, e.g., that the intermediate state roots and the
final state root (e.g. app-hash) of a block match the state transitions implied
by the Transactions included in that very same block require changes in the ABCI
itself. While ABCI++ is not part of this project’s scope, we are
closely monitoring [ABCI++](https://github.com/tendermint/spec/pull/254) and
plan to closely collaborate with Sikka on both specifying as well as
facilitating the implementation efforts by providing feedback or by implementing
the parts that we need in our forks.

#### Mempool

The mempool keeps the set of pending transactions, and is used by block producers
(full nodes) to produce blocks. Transactions are handled by nodes in the
First-Come, First-Served (FCFS) manner. Ordering of transactions can be
implemented on the application level (for example by adding nonce/sequence
number). This behaviour is similar to the Tendermint mempool.

##### P2P Layer

Full nodes and light nodes will be connected by the peer-to-peer network
implemented with Libp2p. There are many implementations of Publish-Subscribe
messaging pattern, but `libp2p-gossipsub` is chosen because it’s the most advanced
one.

##### Peer discovery

Initial peer discovery will be done via static configuration. Those
bootstrap/seed nodes will then be used by `go-libp2p-discovery` to connect to
the rest of the network and maintain a peer list.

##### Transactions and Fraud Proof Gossiping

Transactions will be propagated in the P2P network using the gossiping mechanism.

Fraud proofs can be produced only by full nodes. They will be delivered to all
nodes in the network with a gossiping mechanism. This will ensure that fraud
proofs are delivered to all nodes as soon as possible, without delay (like
waiting on block finalization). If the grace period is shorter than block time,
light nodes don’t need to keep historical data.

#### Commits to Data Availability and Consensus Layer

Rollmint needs to submit the block to the DA and Consensus Layer. For that it
needs to keep a light node of the DA and Consensus chain running. Additionally,
it will need an account of that chain and sufficient balances for submitting a
Transaction to the DA and Consensus chain.

Note that this only triggers a real state transition on the DA and Consensus
chain. On the Rollmint chain successfully submitting the block to the DA and
Conseneus Layer (which includes it in its block) means that the Rollmint block
was finalized.

To keep the greatest flexibility, we start with the following very limited
interface and extend it only if necessary for implementing using Celestia as a
DA and Consensus Layer (certainly in a way that would not limit developers to
use other DA and Consensus Layers though):

```go
// TODO define an enum of different non-happy-path cases
// that might need to be handled by Rollmint independent of
// the underlying DA and Consensus chain.
type StatusCode uint64

type ResultSubmitBlock struct {
  // Code is to determine if the action succeeded.
  Code StatusCode
  // Not sure if this needs to be bubbled up to other
  // parts of Rollmint.
  // Hash hash.Hash
}

type DataAvailabilityLayerClient interface {
  Start() error
  Stop() error

  // SubmitBlock submits the passed in block to the DA and Consensus Layer
  // This should create a transaction which (potentially)
  // triggers a state transition in the DA and Consensus Layer
  SubmitBlock(block types.Block) ResultSubmitBlock
}
```

The `SubmitBlock` method will be called on an aggregator node before Rollmint
tells the application (via ABCI) to commit the state (via the Commit method
which might be renamed to `FinalizeBlock` - see discussion on
[ABCI++ PR](https://github.com/tendermint/spec/pull/254)). Only if `SubmitBlock`
succeeds the application will update the state accordingly, otherwise the
aggregator has to retry or another aggregator node might do so before the
aggregator does (in that case we need a tie breaking rule, e.g.
first-come-first-serve is a good start here, or, round-robin which would be more
similar to using Tendermint). `Start` and `Stop` are only called together with
spinning up or shutting down the node respectively.

##### Data Availability Checks

##### Accessing Block Chunks

IPFS supplemented with Celestia IPLD plugin is able to access chunks of blocks.
Thanks to this functionality, light nodes can avoid downloading entire blocks
from the DA and Consensus Layer. Instead, they can download only the parts they
actually need.

##### Consensus

The Rollmint chain will have no consensus rules. All valid transactions will be
accepted by block creators. Fraud proofs will be the only way to detect and
rollback malicious state transitions.

#### Cosmos-SDK Rollmint module

##### Sparse Merkle Trees

The state of the Rollmint chain will be stored in a Sparse Merkle Tree. They can
be used to generate fraud proofs in very compact and easy to verify form.

Currently, we’re actively participating in developing
[a `proSeparation` of storage and commitment (by the SMT) will allow the
optimization of different components according to their usage and access patterns.](https://github.com/cosmos/cosmos-sdk/pull/8430)

[Proposal](https://github.com/cosmos/cosmos-sdk/pull/8430) for replacing IAVL+
trees with SMTs for the entire state in Cosmos-SDK.

##### Intermediate State Roots

To be able to validate fraud proofs, blocks of the Rollmint chain have to
contain intermediate state roots, reflecting the state of SMT after every transaction.

<!-- ##### Fraud Proofs -->

<!-- ##### Usage of fraud proofs in ABCI Client

##### Cosmos SDK module -->

### Data Types and Message Formats

#### Block.Data

| Field | Description |
| --- | --- |
| `TXs` | Transaction data |
| `intermediateStateRoots` | Intermediate state roots for each transaction |

#### Fraud Proofs

<!-- markdownlint-disable MD013 -->
| Field | Description |
| --- | --- |
| `blockHash` | Hash of corresponding block header |
| `preStateRoot` | Root of Sparse Merkle Tree of the blockchain state before transaction |
| `postStateRoot` | Root of Sparse Merkle Tree of the blockchain state after transaction |
| `transaction` | Transaction (app specific) |
| `witness` | Merkle Proofs |
<!-- markdownlint-enable MD013 -->

<!-- ### Required changes in Cosmos-SDK

- Add SMT storage.
- Replace Tendermint Core with ORU ABCI client.
- Add intermediate state roots to Block.Data -->

<!-- ### References

[GitHub Project Board](https://github.com/orgs/lazyledger/projects/2) -->

<!-- #### Issues & Pull requests -->

<!-- ##### In progress

[Replace IAVL+ with SMT](https://github.com/lazyledger/cosmos-sdk/issues/6) -->

<!-- ##### Review in progress

[Initial SMT store type](https://github.com/lazyledger/cosmos-sdk/pull/12) -->

<!-- ##### To do

[ABCI interface](https://github.com/lazyledger/optimint/issues/1)

[Peer discovery](https://github.com/lazyledger/optimint/issues/2)

[Transaction gossiping](https://github.com/lazyledger/optimint/issues/3)

[Fraud proofs gossiping](https://github.com/lazyledger/optimint/issues/4)

[Mempool](https://github.com/lazyledger/optimint/issues/5)

[Fraud proof generation](https://github.com/lazyledger/optimint/issues/6)

[Rollback of invalidated transactions](https://github.com/lazyledger/optimint/issues/7)

[Data Availability layer API](https://github.com/lazyledger/optimint/issues/8)

[Keep track of and return intermediate state roots to be included in the block](https://github.com/lazyledger/cosmos-sdk/issues/8)

[Fold the validator roots into the state tree](https://github.com/lazyledger/cosmos-sdk/issues/7) -->

<!-- ### Notes

1. It makes sense to include fraud proof into valid blocks.
2. Grace period for fraud proofs - needs to be defined - 30s? Needs experiments.
3. Block pushed into DA immediately not after the grace period.
4. Rollback: drop blocks and transactions (app layer needs to resend).
5. We can assume that only one block is rolled back. -->

<!-- ### Pending questions

1. Who can publish aggregates to DA?
2. What parts of the spec should be universal and what can be LL-specific?
3. What exactly goes into DA? -->

## Tutorials

The following tutorials will help you get started building
Cosmos-SDK applications that connect to Celestia's Data Availability (DA) and Consensus
Layer via Rollmint. We call those chains Sovereign Rollups.

You can get started with the following tutorials:

- [gm world](./gm-world.md)
- [Wordle Game](./wordle.md)
- [CosmWasm Tutorial](./cosmwasm.md)

---
sidebar_label: Build modular
---

# Build modular

This section will explain the advantages of building on
modular blockchains like Celestia.

## Scalability challenges

Blockchain architectures as they exist today are inherently
not scalable.

To scale, blockchains must increase the number of transactions
they can process while still remaining performant and decentralized
(enabling average users to verify the chain).

High and unstable gas costs are also prohibitive for a large number
of use cases, preventing many users around the world from participating
in web3 or interacting with dapps.

For blockchains and web3 to reach mass adoption, challenges around both
scalability and accessibility have to be solved.

## Evolution of blockchains

Blockchains have evolved over time from application-specific networks
like Bitcoin to shared smart contract platforms like Ethereum, which
allow developers to deploy their own applications with business logic
and state, without having to bootstrap their own blockchain from scratch.

## Modular blockchains

What we're seeing happen now is another paradigm shift. We're moving
away from monolithic designs to modular designs, where execution is
separated from data availability and consensus (like Eth2 and Celestia).

Most blockchain architectures today are *monolithic* - they are
responsible for all four core functions of a blockchain:

<!-- markdownlint-disable MD037 -->
- ***Execution*** - executing transactions that update the state correctly.
  Thus, execution must ensure that only valid transactions are executed,
  i.e., transactions that result in valid state machine transitions.
- ***Settlement*** - an environment for execution layers to verify proofs,
  resolve fraud disputes, and bridge between other execution layers.
- ***Consensus*** - agreeing on the order of the transactions.
- ** [Data Availability](https://coinmarketcap.com/alexandria/article/what-is-data-availability)**
  (DA) - making the transaction data available. Note that execution,
  settlement, and consensus require DA.
<!-- markdownlint-enable MD037 -->

*Modular blockchains decouple these functions among multiple specialized
layers, and only specialize in only a few functions, rather than all of
them.*

## Scalability

Modular blockchains achieve scalability in a few different ways.

### Block size

At Celestia’s center is a core mathematical primitive:
[data availability sampling.](https://twitter.com/nickwh8te/status/1559977957195751424)

Data Availability Sampling enables Celestia Light Nodes to provide
almost the same security guarantees as a full node. As the light
node count increases, the block size can be increased linearly to
its growth.

Now the only limit for block size (throughput) is the number of
light nodes in the network.

This primitive allows Celestia to be *the first blockchain that
can scale its block size with the number of users*.

### Specialization

Because of the decoupling of functionality, each layer can specialize
in one or many of the core functions of a blockchain.

This allows each layer to focus on becoming the most optimal at
its use case without the limitations of the requirement of
interoperability with other layers.

When the components become modular, those using or building the
system don’t have to know or care about everything. They only have
to care about a subset of the features. Specialization is the way
to ensure maximum focus, performance, and capacity.

### Resource pricing

By decoupling consensus from execution, Celestia can have much
more efficient resource pricing than monolithic chains. Transactions
published to the network can be charged purely based on the size
of the data being submitted.

State growth and historical data are treated separately in Celestia.
Celestia only stores historical data from rollups (measured and paid
in bytes), while rollups handle and meter their own state execution.

This enables completely separate fee markets for execution and data
availability, allowing fundamentally orthogonal resources to be
priced by the market independently, resulting in more accurate and
flexible pricing.

This means that spikes of higher throughput in one environment cannot
affect another, separate layer.

## Shared execution and monolithic blockchains

Most blockchains share execution with countless other applications
and users of those applications.

![Screen Shot 2022-08-15 at 3.33.06 PM.png](/img/shared-execution.png)

If you compare this to how scalability is achieved in the traditional
tech stack, where applications have their own servers or run their
own "serverless" infrastructure that spins up a dedicated execution
environment / container specifically for that individual application,
the bottleneck becomes pretty clear.

Scalability can typically be achieved in [two ways - horizontal and vertical scaling](https://stackoverflow.com/questions/11707879/difference-between-scaling-horizontally-and-vertically-for-databases#answer-11715598).

Applications on traditional tech infrastructure can handle tens of
millions of interactions per second by scaling both horizontally as
well as vertically, while blockchains have struggled to reach thousands
of transactions per second while still remaining decentralized.

In addition to scaling the protocol itself (vertical), Celestia enables
horizontal scalability. Developers can launch their own
application-specific chains as rollups, similar to how
[Cosmos Zones](https://v1.cosmos.network/resources/faq) enable
developers to deploy their own application-specific blockchains.

Modular blockchains are a paradigm shift in blockchain design that
aim to solve the challenges around both scalability as well as
accessibility, opening the door to a larger number of use cases,
and ultimately enabling web3 to reach mass adoption.

## Building on Celestia

There are a handful of ways developers can build on Celestia.

### Smart contracts

The easiest way to get started will be to deploy a smart contract
to a rollup chain already running on Celestia.

The barrier to entry is low in that you can use your existing
skillset without having to learn anything new.

You can write any language and use any execution environment
you’d like, including Solidity or Vyper and the EVM or Cosmos and Go.

You can use [Rollkit](https://rollkit.dev) to deploy a rollup for your
favorite execution environment connected to Celestia.

### Sovereign rollups

One of the most powerful value propositions of Celestia is the
idea of [Sovereign Chains](https://blog.celestia.org/sovereign-rollup-chains).

Rollups on Ethereum are effectively "enshrined" to Ethereum because
Ethereum is responsible for validating their transactions. This makes
them tightly linked.

Celestia enables a new type of rollup: sovereign rollup chains.
These are independent chains that are similar to an independent L1.

### Execution layers

Unlike Ethereum, Celestia has no enshrined settlement layer built in.
Instead, there will be various settlement layers available to enable
developers to easily deploy their own rollup or application-specific
chain to Celestia.

### Celestiums (Ethereum)

[Celestiums](https://blog.celestia.org/celestiums) allow developers
to deploy to a rollup using Celestia as DA and Ethereum as settlement.

Ethereum rollups batch data from multiple transactions into a single
transaction. This rollup transaction data (calldata) is posted to
Ethereum but not executed directly.

A Celestium is an L2 chain that uses Ethereum for settlement plus dispute
resolution, and  Celestia for data availability.

This provides high throughput data availability for Ethereum L2s with
a higher level of security than other off-chain data availability
techniques.

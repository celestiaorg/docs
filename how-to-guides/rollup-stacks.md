---
description: Advantages of building on modular blockchains like Celestia.
---

# Rollup stacks

If you're a developer and want to know what the benefits of modular blockchains
are for you, you’ve come to the right place. This page will give you the rundown on modular
blockchains and their benefits for developers like you.

This section provides various guides and tutorials that cover different
options for deploying rollups on Celestia.

## Quickstart - Building on Celestia

### Choose a framework

<!-- markdownlint-disable MD033 -->
<script setup>
import UrlImageButton from '../.vitepress/components/UrlImageButton.vue';
</script>

So, you’re ready to start experimenting and building on Celestia?
Here are a few options that are currently available for developers.

<div style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 20px;">
  <UrlImageButton url="/how-to-guides/intro-to-op-stack" imageSrc="/build/opstack.webp" text="OP Stack" notes="EVM" target="_self" alt="OP Stack logo" aria-label="OP Stack"/>
  <UrlImageButton url="/how-to-guides/arbitrum-integration" imageSrc="/build/arbitrum.webp" text="Arbitrum Orbit" notes="EVM" target="_self" alt="Arbitrum logo" aria-label="Arbitrum"/>
  <UrlImageButton url="https://github.com/Sovereign-Labs/sovereign-sdk/tree/stable/examples/demo-rollup#demo-rollup" imageSrc="/build/sovereign.webp" text="Sovereign SDK" notes="Sovereign" alt="Sovereign logo" aria-label="Sovereign"/>
  <UrlImageButton url="https://docs.dymension.xyz/" imageSrc="/build/dymension.webp" text="Dymension" alt="Dymension logo" aria-label="Dymension"/>
  <UrlImageButton url="https://docs.stf.xyz" imageSrc="/build/stackr.webp" text="Stackr" alt="Stackr logo" aria-label="Stackr"/>
  <UrlImageButton url="https://rollkit.dev" imageSrc="/build/rollkit.webp" text="Rollkit" notes="Sovereign" alt="Rollkit logo" aria-label="Rollkit"/>
</div>

### Rollups as a Service

Deploy your rollup with a RaaS provider.

<div style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 20px;">
  <UrlImageButton url="https://altlayer.io/raas/" imageSrc="/build/altlayer.webp" text="AltLayer" notes="Orbit, OP Stack" alt="AltLayer logo" aria-label="AltLayer"/>
  <UrlImageButton url="https://www.astria.org/" imageSrc="/build/astria.webp" text="Astria" alt="Astria logo" aria-label="Astria"/>
  <UrlImageButton url="https://www.caldera.xyz/" imageSrc="/build/caldera.webp" text="Caldera" notes="Orbit, OP Stack" alt="Caldera logo" aria-label="Caldera"/>
  <UrlImageButton url="https://conduit.xyz/" imageSrc="/build/conduit.webp" text="Conduit" notes="Orbit, OP Stack" alt="Conduit logo" aria-label="Conduit"/>
  <!-- <UrlImageButton url="https://gateway.fm/" imageSrc="/build/gateway.webp" text="Gateway" notes="Polygon CDK" alt="Gateway logo" aria-label="Gateway"/> -->
  <UrlImageButton url="https://www.gelato.network/" imageSrc="/build/gelato.webp" text="Gelato" notes="Orbit, OP Stack" alt="Gelato logo" aria-label="Gelato"/>
  <UrlImageButton url="https://www.karnot.xyz/" imageSrc="/build/karnot.webp" text="Karnot" notes="Starknet" alt="Karnot logo" aria-label="Karnot"/>
  <!-- <UrlImageButton url="https://lumoz.org/" imageSrc="/build/lumoz.webp" text="Lumoz" notes="Polygon CDK" alt="Lumoz logo" aria-label="Lumoz"/> -->
  <!-- <UrlImageButton url="https://snapchain.dev/" imageSrc="/build/snapchain.webp" text="Snapchain" notes="Polygon CDK" alt="Snapchain logo" aria-label="Snapchain"/> -->
  <UrlImageButton url="https://docs.vistara.dev/" imageSrc="/build/vistara.webp" text="Vistara" alt="Vistara logo" aria-label="Vistara"/>
  <UrlImageButton url="https://www.zeeve.io/" imageSrc="/build/zeeve.webp" text="Zeeve" notes="Orbit, OP Stack" alt="Zeeve logo" aria-label="Zeeve"/>
</div>

### Smart contracts

Deploy your smart contracts on dedicated EVM-compatible rollups.

<div style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 20px;">
  <UrlImageButton url="https://bubstestnet.com/" imageSrc="/build/caldera.webp" text="Bubs testnet" notes="OP Stack" alt="Caldera logo" aria-label="Caldera Bubs testnet"/>
  <UrlImageButton url="https://raas.gelato.network/rollups/details/public/opcelestia-raspberry" imageSrc="/build/gelato.webp" text="Raspberry testnet" notes="OP Stack" alt="Gelato logo" aria-label="Gelato Raspberry testnet"/>
</div>

## What is a rollup?

A rollup is a type of blockchain that offloads some work to a layer 1, like
Celestia. Rollups host applications and process user transactions. Once
those transactions get processed, they are then published to layer 1.
It’s layer 1s job to order those transactions and check that they are
available, at minimum.

## What is a modular blockchain?

With blockchains there are more or less four core functions that they do.

- **Execution**: transaction execution and state update.
- **Settlement**: finality and dispute resolution.
- **Consensus**: agreement on transaction ordering.
- **Data availability**: prove data was published to the network.

Modular blockchains specialize in one or two of these functions rather
than doing all of them like a monolithic blockchain. You probably know
about layer 1s and layer 2s. That’s the general idea.

A typical example of a modular blockchain you might’ve heard of is a
rollup. Rollups host smart contracts and execute transactions, much like
any monolithic chain. But, the data of those transactions get sent to a
layer 1 blockchain to carry out the remaining functions.

If you want to brush up on your understanding of modular blockchains,
head over to [learn modular](../learn/how-celestia-works/monolithic-vs-modular).

## Benefits of modular blockchains

### Ease of deploying a chain

One of the goals of modular blockchains is to make it as easy to deploy
a blockchain as a smart contract. There are a few unique ways that
modular blockchains can significantly reduce the cost of deploying a
new blockchain.

1. **No validator set is required**. Rollups can deploy without sourcing
   their own set of validators or sequencers.
2. **Inherit security from the start**. Rollups don’t need to build all
   their security from scratch.
3. **Any part of the stack can be delegated**. Development time can be
   reduced by outsourcing functions of the rollup to external providers.

All in all, builders will be able to outsource as much of the stack as
they need. Deploying a new blockchain will be as simple as clicking a
few options to initialize a production-ready rollup.

### Scaling

Of course, a much higher scale is necessary if we want to support
many more users. And modular blockchains use some new innovative
technologies that can help us get there.

- [Data availability sampling](https://celestia.org/glossary/data-availability-sampling/)
  enables modular blockchains like Celestia to scale data availability with the
  number of light nodes - that means more capacity for rollups.
- **Fraud and validity proofs** make rollups vastly more efficient
  to verify. Nodes only need to verify a small proof of transaction
  validity ([validity proof](https://celestia.org/glossary/validity-proof/))
  or assume transactions are valid by default
  ([fraud proof](https://celestia.org/glossary/state-transition-fraud-proof/)).
  This means rollups don’t require every node in the network to re-execute
  every transaction.

![image](/img/da-and-validity.png)

- **Decoupling execution from consensus** lets developers define the VM
  that best fits the scaling needs of their application.
- **Separating applications** across multiple rollups isolates congestion.
  If an application congests the execution capacity of one rollup, all
  other rollups remain unaffected in their execution capacity.

All these scaling properties combined make new types of applications
and features possible, like onchain gaming, dynamic metadata, and
ephemeral rollups, to name a few.

### Customizability

By design, modular blockchains don’t lock in any feature set.
They promote experimentation and customization.

Remember how decoupling execution from consensus enables VM
customizability? Well, rollups are the execution component. Applications
can run on their own rollup and adjust the VM to maximize their
application's performance. Developers have that flexibility because
Celestia's execution logic doesn't restrict rollups.

Basically, rollups can be customized to integrate any new or existing
VM stack.

With existing rollup frameworks, developers can run rollup testnets
using the EVM or Cosmos SDK. In the future, one can imagine a variety
of VMs that rollup frameworks support, providing developers with more
out-of-the-box options for their applications.

Some customizations that could be made to a rollup's VM include
custom precompiles, changing transaction processing from sequential
to parallel, or adding support for private smart contracts.

All of this only scratches the surface.

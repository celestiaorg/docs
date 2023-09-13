---
sidebar_label: Introduction to OP Stack integration
description: Learn about the integration of OP Stack with Celestia.
---

# Introduction to OP Stack integration

[Optimism](https://optimism.io) is a low-cost and lightning-fast Ethereum
L2 blockchain, built with [the OP Stack](https://stack.optimism.io/).

[Celestia](https://celestia.org) is a modular consensus and data network,
built to enable anyone to easily deploy their own blockchain with
minimal overhead.

## About the integration

_Discover how to integrate existing blockchain frameworks
like the OP Stack with Celestia in this category._

:::tip
Tested on a machine with 8GB RAM, 160 GB SSD,
Ubuntu 22.10, and a 4 core AMD CPU.
:::

:::caution
This is a **beta integration** and we are working on resolving open
[issues](https://github.com/celestiaorg/optimism/issues).
The current testnet this setup is compatible with is the
[Arabica](../../nodes/arabica-devnet) devnet.
:::

[Optimism](https://www.optimism.io/) uses Ethereum as
a data availability (DA) layer. Currently, settlement and DA for
Optimism are on Ethereum, both on-chain. `op-batcher` batches up
rollup blocks and posts to Ethereum.

### Table of contents of the category

- [Bubs testnet](../bubs-testnet)
- [Deploy a smart contract on Bubs testnet](../deploy-on-bubs)
- [Deploy a GM Portal dapp on Bubs testnet](../gm-portal-bubs)
- [Deploy an OP Stack devnet](../optimism-devnet)
- [Deploy an OP Stack testnet on Celestia](../optimism)

## Celestia and OP Stack repository

Find the repository for this integration
[here](https://github.com/celestiaorg/optimism/) or at
`https://github.com/celestiaorg/optimism`.

### What are Optimism and the OP Stack?

Optimism, an Ethereum L2 blockchain, is powered by the OP Stack,
which is also the foundation for the
[Optimism Collective](https://app.optimism.io/announcement) committed
to the **impact=profit** principle. This rewards individuals for their
positive contributions to the collective.

Optimism addresses crypto ecosystem coordination failures, like funding public
goods and infrastructure. The OP Stack fosters collaboration and prevents
redundancy by creating a shared, open-source system for developing new L2
blockchains within the proposed Superchain ecosystem.

As Optimism evolves, the OP Stack will adapt to include components from
blockchain infrastructure to governance systems. This software suite aims
to simplify L2 blockchain creation and support the Optimism ecosystem's
growth and development.

Learn more about Optimism [here](https://www.optimism.io/).

### What is Celestia?

Celestia is a modular consensus and data network, built to enable anyone to
easily deploy their own blockchain with minimal overhead.

Celestia is a minimal blockchain that only orders and publishes transactions
and does not execute them. By decoupling the consensus and application
execution layers, Celestia modularizes the blockchain technology stack
and unlocks new possibilities for decentralized application builders.
Lean more at [Celestia.org](https://celestia.org).

## OP Stack and Celestia

This category will guide you through how start your own devnet or testnet
with a modified version of `optimism-bedrock` that uses Celestia as a
DA layer.

The handling of data is accomplished in two ways. First, data is written
to the data availability (DA) layer i.e. in this case Celestia, then the
data commitment is written to the `op-batcher`. When reading `op-node`
simply reads the data back from the DA layer by reading the
data commitment from the `op-batcher` first, then reading the
data from the DA layer using the data commitment. Hence, while
previously `op-node` was reading from calldata on Ethereum,
but now it reads data from Celestia.

There are a few tools involved in the data handling process. `op-batcher`
batches up rollup blocks and posts them to Ethereum. `op-geth` handles
execution, while `op-proposer` is responsible for state commitment
submission.

By using Celestia as a DA layer, existing L2s can switch from posting
their data as `calldata` on Ethereum, to posting to Celestia.
The commitment to the block is posted on Celestia, which is
purpose-built for data availability. This is a more scalable than
the traditional method of posting this data as `calldata` on monolithic chains.

If you'd like to go modular, bedrock has
made it easy to swap this out!

## Next steps

Now that you understand the integration, you can start learning about the
[Bubs testnet](../bubs-testnet), built with OP Stack and Celestia! This
testnet is a great way to explore the possibilities of this integration
and test your applications in a live environment.

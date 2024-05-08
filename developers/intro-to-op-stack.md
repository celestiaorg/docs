---
description: Learn about the integration of OP Stack with Celestia.
---

# Introduction to OP Stack integration

[Optimism](https://optimism.io) is a low-cost and lightning-fast Ethereum
L2 blockchain, built with [the OP Stack](https://stack.optimism.io/).

[Celestia](https://celestia.org) is a modular consensus and data availability (DA) network,
built to enable anyone to easily deploy their own blockchain with
minimal overhead.

Together, they allow developers to create rollups that
post data to Celestia and settle on Ethereum.

## About the integration

[Optimism](https://www.optimism.io/) uses Ethereum as
a DA layer. Currently, settlement and DA for
Optimism are on Ethereum, both onchain. `op-batcher` batches up
rollup blocks and posts to Ethereum.

The integration of OP Stack with Celestia underneath for DA
allows rollup operators to reduce overhead that is associated with posting
data as `calldata` on Ethereum. Instead, `op-batcher` batches up
rollup blocks and posts them to Celestia's DA network.

The handling of data is accomplished in two ways. First, data is written
to the data availability (DA) layer i.e. in this case Celestia, then the
data commitment is written to the `op-batcher`. When reading `op-node`
simply reads the data back from the DA layer by reading the
data commitment from the `op-batcher` first, then reading the
data from the DA layer using the data commitment. While
previously `op-node` was reading from `calldata` on Ethereum, it now reads data from Celestia.

There are a few tools involved in the data handling process. `op-batcher`
batches up rollup blocks and posts them to Ethereum. `op-geth` handles
execution, while `op-proposer` is responsible for state commitment
submission.

By using Celestia as a DA layer, existing L2s can switch from posting
their data as `calldata` on Ethereum, to posting to Celestia.
The commitment to the block is posted on Celestia, which is
purpose-built for data availability. This is a more scalable than
the traditional method of posting this data as `calldata` on monolithic chains.

### GitHub repository

Find the
[repository for this integration](https://github.com/celestiaorg/optimism/)
at `https://github.com/celestiaorg/optimism`.

:::warning
This is a **beta integration** and we are working on resolving
[open issues](https://github.com/celestiaorg/optimism/issues).
:::

## Category contents

This category will guide you through interacting with existing OP Stack rollups
with Celestia underneath, then how to start your own devnet
with a modified version of `optimism-bedrock` that uses Celestia as a
DA layer.

_Discover how to integrate existing blockchain frameworks
like the OP Stack with Celestia in this category._

- [Bubs testnet](./bubs-testnet.md): learn about
the first testnet made with OP Stack with Celestia underneath
- [Deploy a smart contract on Bubs testnet](./deploy-on-bubs.md)
- [Deploy a GM Portal dapp on Bubs testnet](./gm-portal-bubs.md)
- [Deploy an OP Stack devnet](./optimism-devnet.md)
- [Deploy an OP Stack devnet on Celestia](./optimism.md)

<!-- ### What are Optimism and the OP Stack?

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

Learn [more about Optimism](https://www.optimism.io/). -->

## Next steps

Now that you understand the integration, you can start learning about the
[Bubs testnet](./bubs-testnet.md), built with OP Stack and Celestia! This
testnet is a great way to explore the possibilities of this integration
and test your applications in a live environment.

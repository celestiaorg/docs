---
description: Learn how to deploy rollups on Celestia.
---

# Deploy a rollup

This section provides various guides and tutorials that cover different
options for deploying rollups on Celestia.

## What is a rollup?

A rollup is a type of blockchain that offloads some work to a layer 1, like
Celestia. Rollups host applications and process user transactions. Once
those transactions get processed, they are then published to layer 1.
It’s layer 1s job to order those transactions and check that they are
available, at minimum.

Over time, two primary designs emerged for rollups:
[optimistic](https://celestia.org/glossary/optimistic-rollup/) and
[zk](https://celestia.org/glossary/zk-rollup) rollups.

## Section contents

- [Rollkit](./rollkit)
- [Optimism](./intro-to-op-stack.md#what-are-optimism-and-the-op-stack)
  - [Introduction to OP Stack integration](./intro-to-op-stack.md)
  - [Introduction to Bubs Testnet](./bubs-testnet.md)
  - [Deploy a smart contract on Bubs testnet](./deploy-on-bubs.md)
  - [Deploy a dapp on Bubs testnet](./gm-portal-bubs.md)
  - [Deploy an OP Stack devnet](./optimism-devnet.md)
  - [Deploy an OP Stack testnet on Celestia](./optimism.md)
  - [Deploy a dapp on Thirdweb](https://thirdweb.com/bubs-testnet)
  - [Rollups as a Service](https://docs.celestia.org/category/rollups-as-a-service/)
- Sovereign SDK
  - [Create a zk-rollup and run a full node using Sovereign SDK](https://github.com/Sovereign-Labs/sovereign-sdk/tree/main/examples/demo-rollup#demo-rollup)
- [Build a rollapp with Dymension's Roller](https://docs.dymension.xyz/build/roller)

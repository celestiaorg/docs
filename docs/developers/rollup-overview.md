---
sidebar_label: Deploy a rollup
description: Learn how to deploy rollups on Celestia.
---

# Deploy a rollup

This section covers the different options for deploying rollups on Celestia.

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

The rollup category contains guides and tutorials on how to deploy rollups
on Celestia. They include:

- [Rollkit](./rollkit.mdx)
  - [Build and deploy a GM World rollup](https://rollkit.dev/tutorials/gm-world)
  - [Build the GM World frontend](https://rollkit.dev/tutorials/gm-world-frontend)
  - [Build a Recipe Book rollup](https://rollkit.dev/tutorials/recipe-book)
  - [Build a Wordle app](https://rollkit.dev/tutorials/wordle)
  - [Build a CosmWasm rollup](https://rollkit.dev/tutorials/cosmwasm)
- [Optimism](./intro-to-op-stack.md#what-are-optimism-and-the-op-stack)
  - [Introduction to OP Stack integration](./intro-to-op-stack.md)
    - [Introduction to Bubs Testnet](./bubs-testnet.md)
    - [Deploy a smart contract on Bubs testnet](./deploy-on-bubs.md)
    - [Deploy a GM Portal dapp on Bubs testnet](./gm-portal-bubs.md)
    - [Deploy a dapp on Thirdweb](https://thirdweb.com/bubs-testnet)
    - [Deploy an OP Stack devnet](./optimism-devnet.mdx)
    - [Deploy an OP Stack testnet on Celestia](./optimism.mdx)
  - [Rollups as a Service](https://docs.celestia.org/category/rollups-as-a-service/)
- Sovereign SDK
  - [Create a zk-rollup and run a full node using Sovereign SDK](https://github.com/Sovereign-Labs/sovereign-sdk/tree/main/examples/demo-rollup#demo-rollup)
- IBC relayers
  - [Establish IBC connections using the Hermes relayer](./ibc-relayer.md)
- Full-stack modular blockchain development
  - [Build a full stack modular dapp with React, Vite, RainbowKit, Celestia and Foundry](./full-stack-modular-development-guide.md)
- [Build a rollapp with Dymension's Roller](https://docs.dymension.xyz/build/roller)

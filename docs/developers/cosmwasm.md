---
sidebar_label: CosmWasm Overview
---

# CosmWasm and Rollmint

CosmWasm is a smart contracting platform built for the Cosmos
ecosystem by making use of [WebAssembly](https://webassembly.org/) (Wasm)
to build smart contracts for Cosmos-SDK. In this tutorial, we will be
exploring how to integrate CosmWasm with Celestia's
[Data Availability Layer](../concepts/how-celestia-works/data-availability-layer)
using [Rollmint](./rollmint.md).

> NOTE: This tutorial will explore developing with Rollmint,
  which is still in Alpha stage. If you run into bugs, please write a Github
  [Issue ticket](https://github.com/celestiaorg/docs/issues/new/choose)
  or let us know in our [Discord](https://discord.com/invite/YsnTPcSfWQ).
  Furthermore, while Rollmint allows you to build sovereign rollups
  on Celestia, it currently does not support fraud proofs yet and is
  therefore running in "pessimistic" mode, where nodes would need to
  re-execute the transactions to check the validity of the chain
  (i.e. a full node). Furthermore, Rollmint currently only supports
  a single sequencer.

You can learn more about CosmWasm [here](https://docs.cosmwasm.com/docs/1.0/).

In this tutorial, we will going over the following:

1. [Setting up your dependencies for your CosmWasm smart contracts](./cosmwasm-dependency.md)
2. [Setting up Rollmint on CosmWasm](./cosmwasm-dependency.md#wasmd-installation)
3. [Instantiate a local network for your CosmWasm chain connected to Celestia](./cosmwasm-environment.md)
4. [Deploying a Rust smart contract to CosmWasm chain](./cosmwasm-contract-deployment.md)
5. [Interacting with the smart contract](./cosmwasm-contract-interaction.md)

The smart contract we will use for this tutorial is one provided by
the CosmWasm team for Nameservice purchasing.

You can check out the contract [here](https://github.com/InterWasm/cw-contracts/tree/main/contracts/nameservice).

How to write the Rust smart contract for Nameservice is outside the scope of
this tutorial. In the future we will add more tutorials for writing CosmWasm
smart contracts for Celestia.

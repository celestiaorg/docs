---
sidebar_label : CosmWasm Overview
---

# CosmWasm on Optimint

CosmWasm is a smart contracting platform built for the Cosmos
ecosystem by making use of WebAssembly (Wasm) to build smart contracts
for Cosmos-SDK. In this tutorial, we will be exploring how to integrate
CosmWasm with Celestia's Data Availability Layer using Optimint.

> NOTE: This tutorial will explore developing with Optimint,
  which is still in Alpha stage. If you run into bugs, please
  write a Github Issue ticket or let us know in our Discord.
  Furthermore, while Optimint allows you to build sovereign rollups
  on Celestia, it currently does not support fraud proofs yet and is
  therefore running in "pessimistic" mode, where nodes would need to
  re-execute the transactions to check the validity of the chain
  (i.e. a full node). Furthermore, Optimint currently only supports
  a single sequencer.

You can learn more about CosmWasm [here](https://docs.cosmwasm.com/docs/1.0/).

In this tutorial, we will going over the following:

* [Setting up your dependencies for your CosmWasm smart contracts](./cosmwasm-dependency.md)
* [Setting up Optimint on CosmWasm](./cosmwasm-dependency.md#wasmd-installation)
* [Instantiate a local network for your CosmWasm chain connected to Celestia](./cosmwasm-environment.md)
* [Deploying a Rust smart contract to CosmWasm chain](./cosmwasm-contract-deployment.md)
* [Interacting with the smart contract](./cosmwasm-contract-interaction.md)

The smart contract we will use for this tutorial is one provided by
the CosmWasm team for Nameservice purchasing.

You can check out the contract [here](https://github.com/InterWasm/cw-contracts/tree/main/contracts/nameservice).

How to write the Rust smart contract for Nameservice is outside the scope of
this tutorial. In the future we will add more tutorials for writing CosmWasm
smart contracts for Celestia.

---
sidebar_label: Ethermint
---

# Ethermint

Ethermint is a Comsos-SDK library that integrates an EVM compiler
from Geth.

This would allow you to deploy Solidity or Vyper Ethereum smart contracts
in order to build Ethereum-based applications.

In this tutorial, we will be going over how to use Rollmint to deploy
an Ethereum-based sovereign rollup that uses Cosmos-SDK and Ethermint.

You can learn more about Ethermint [here](https://docs.ethermint.zone/).

> NOTE: This tutorial will explore developing with Rollmint, which
  is still in Alpha stage. If you run into bugs, please write a Github
  Issue ticket or let us know in our Discord. Furthermore, while Rollmint
  allows you to build sovereign rollups on Celestia, it currently does not
  support fraud proofs yet and is therefore running in "pessimistic" mode,
  where nodes would need to re-execute the transactions to check the validity
  of the chain (i.e. a full node). Furthermore, Rollmint currently only supports
  a single sequencer.

:::danger caution

The script for this tutorial is built for Mocha Testnet.
If you choose to use Arabica Devnet,
you will need to modify the script manually.

:::

In this tutorial, we will go over the following:

* [Setting Up Your Ethermint Dependencies](./ethermint-dependencies.md)
* [Setting Up Rollmint on Ethermint](./rollmint-on-ethermint.md)
* [Instantiate a local network for your Ethermint chain connected to Celestia](./instantiate-ethermint.md)
* [Deploying an Ethereum smart contract on your Ethermint Rollup with Foundry](./deploy-solidity-ethermint-foundry.md)

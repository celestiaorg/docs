---
sidebar_label: gm world Overview
---

# ☀️ Introduction

In this tutorial, we will build a sovereign `gm world` rollup using rollmint
and Celestia’s data availability and consensus layer to submit rollmint blocks.

This tutorial will cover setting up a Celestia Light Node, Ignite CLI, and
building a Cosmos-SDK application-specific rollup blockchain on top of
Celestia.

The [Cosmos SDK](https://github.com/cosmos/cosmos-sdk) is a framework for
building blockchain applications. The Cosmos Ecosystem uses
[Inter-Blockchain Communication (IBC)](https://github.com/cosmos/ibc-go)
to allow blockchains to communicate with one another.

:::danger caution

The script for this tutorial is built for Mocha Testnet.
If you choose to use Arabica Devnet,
you will need to modify the script manually.

:::

## Table of Contents

- [Setup](./gm-setup/)
- [Run a Light Node](./gm-node/)
- [Build a Sovereign Rollup](./gm-rollmint/)
- [Query your Rollup](./gm-query/)

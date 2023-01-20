---
sidebar_label: Recipe Book Overview
---

# 🥗 Recipe Book Overview

## 📖 Overview

In this tutorial, we are going to build a blockchain
for your favorite recipes. The goal of this tutorial
is to create a Rollmint rollup with a module that allows
you to write and read data to and from your application-specific
blockchain. The end user will be able to submit new
recipes and read them from the blockchain.

In the [`gm world` tutorial](./gm-world/), we defined a
new API endpoint and modified a keeper query function
to return static data. In this tutorial, we will be
modifying the state with transactions (Cosmos SDK messages)
that are routed to a module and its message handlers, which
are sent to the `recipes` blockchain.

:::danger caution

The script for this tutorial is built for Mocha Testnet.
If you choose to use Arabica Devnet,
you will need to modify the script manually.

:::

## 💻 Prerequisites

- [gm world Tutorial](./gm-world/) (recommended)
- [Install Golang](../nodes/environment.mdx#install-golang/)
- [Install Celestia Node](../nodes/celestia-node/)
- [Install Ignite CLI](./gm-setup/)

## 🧱 Table of Contents

- [Scaffolding your Rollup](./recipe-scaffold/)
- [Messages](./recipe-message/)
- [Keepers](./recipe-keeper/)
- [Querying Recipes](./recipe-query/)

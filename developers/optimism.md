---
description: Start your own testnet with a modified version of optimism-bedrock.
next:
  text: "Full stack dapp tutorial"
  link: "/developers/full-stack-modular-development-guide"
---

# Deploy an OP Stack testnet with Celestia

<!-- markdownlint-disable MD033 -->
<script setup>
import constants from '/.vitepress/constants/constants.js'

</script>

In order to deploy a testnet with Celestia, you will need to have a modified
version of `optimism-bedrock`.
Refer to the
[steps to install dependencies and the modified version of OP Stack](./optimism-devnet.md)
for your environment setup.

## Pick your deployment type

Using Celestia and OP stack, you have the option to either
run a light node of your own or a `local-celestia-devnet`,
which will give you a local devnet to test things out with.

### Using a local devnet

If you'd like to use the `local-celestia-devnet`, you're in luck!
This is the default for the OP Stack + Celestia repository. Head
to the [previous page](./optimism-devnet.md) to get started.

### Using a light node

This is a **beta integration** and we are working on resolving
[open issues](https://github.com/celestiaorg/optimism/issues/).

In order to allow your light node to post
and retrieve data without errors, you will need to change `UseShareExchange`
to `false` in:

::: code-group

```bash-vue [Mainnet Beta]
$HOME/.celestia-light/config.toml
```

```bash-vue [Mocha]
$HOME/.celestia-light-{{constants.mochaChainId}}/config.toml
```

```bash-vue [Arabica]
$HOME/.celestia-light-{{constants.arabicaChainId}}/config.toml
```

:::

If you choose to use your own node store, the light node
must be **fully synced** and **funded** for you to be able to submit
and retrieve `PayForBlobs` to a Celestia network.

If it is not synced, you will run into
[errors similar to this](https://github.com/celestiaorg/celestia-node/issues/2151/).

Visit the [Arabica page](../nodes/arabica-devnet.md)
to visit the faucet.

In order to mount existing data, you must have a node store that is
in this directory:

::: code-group

```bash-vue [Mainnet Beta]
$HOME/.celestia-light
```

```bash-vue [Mocha]
$HOME/.celestia-light-{{constants.mochaChainId}}
```

```bash-vue [Arabica]
$HOME/.celestia-light-{{constants.arabicaChainId}}
```

:::

This is the default location of the node store
when you initialize and run a new Celestia node.

:::warning
The user in the `docker-compose-testnet.yml` is the `root` user,
but this is not meant to be used in production.
:::

By default, the node will run with the account named
`my_celes_key`.

If you have your own setup you'd like to try, you can always edit
`optimism/ops-bedrock/docker-compose-testnet.yml` to work with your setup.

### Using a RaaS provider

If you'd like to use a Rollups as a Service (RaaS) provider, you can do so
by going to the RaaS category in the menu.

## Build the testnet

Build TypeScript definitions for TS dependencies:

```bash
cd $HOME
cd optimism
make build-ts
```

Set environment variables to start network:

```bash
export SEQUENCER_BATCH_INBOX_ADDRESS=0xff00000000000000000000000000000000000000
export L2OO_ADDRESS=0x70997970C51812dc3A010C7d01b50e0d17dc79C8
```

## Start the testnet

First, make sure your light node is synced and funded.

Next, you can start up the testnet with the following command:

```bash
make testnet-up
```

## View the logs of the testnet

If you'd like to view the logs of the testnet, run the following command
from the root of the Optimism directory:

```bash
make testnet-logs
```

## Stop the testnet

To safely stop the testnet, run the following command:

```bash
make testnet-down
```

## Clean the testnet

To remove all data from the testnet, run the following command:

```bash
make testnet-clean
```

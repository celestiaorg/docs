---
sidebar_label: Light node
description: This tutorial covers setting up a Celestia light node.
---

# Setting up a Celestia light node

This tutorial will guide you through setting up a Celestia light node, which
will allow you to perform data availability sampling (DAS) on Celestia's data
availability (DA) network.

## Overview of light nodes

Light nodes ensure data availability. This is the most common
way to interact with Celestia networks.

![light-node](/img/nodes/LightNodes.png)

Light nodes have the following behavior:

1. They listen for `ExtendedHeaders`, i.e. wrapped “raw” headers, that notify
   Celestia nodes of new block headers and relevant DA metadata.
2. They perform DAS on the received headers

## Hardware requirements

The following minimum hardware requirements are recommended for running
a light node:

- Memory: **500 MB RAM (minimum)**
- CPU: **Single Core**
- Disk: **100 GB SSD Storage**
- Bandwidth: **56 Kbps for Download/56 Kbps for Upload**

## Quickstart: Run a light node in your browser

The easiest way to run a Celestia light node is with [Lumina.rs](https://lumina.rs)
in your browser.

<img width="1000" alt="Lumina.rs in browser" src="https://github.com/user-attachments/assets/5c6ae717-503e-4b83-844f-8716f33ec76c">

You can also run Lumina on the first decentralized block explorer,
[Celenium](https://celenium.io).

<img width="1000" alt="Celenium running a light node with Lumina.rs" src="https://github.com/user-attachments/assets/28183a24-8bb1-4f77-850c-d0528de075c7">

## Setting up your light node

This tutorial was performed on an Ubuntu Linux 20.04 (LTS) x64 instance machine.

Set up dependencies on the [setting up environment](./environment.md) page.

### Install celestia-node

Install the `celestia` binary by
[building and installing celestia-node](./celestia-node.md).

## Initialize the light node

Run the following command:

::: code-group

```sh [Mainnet Beta]
celestia light init
```

```sh [Mocha]
celestia light init --p2p.network mocha
```

```sh [Arabica]
celestia light init --p2p.network arabica
```

:::

The output in your terminal will show the location of your node store and
config. It will also show confirmation that the node store has been initialized.

## Start the light node

Start the light node with a connection to a validator node's gRPC endpoint (which
is usually exposed on port 9090):

In order for access to the ability to get and submit
state-related information, such as the ability to
submit `PayForBlobs` transactions, or query for the
node's account balance, a gRPC endpoint of a validator
(core) node must be passed as directed below.

Refer to
[the ports section of the celestia-node troubleshooting page](../../how-to-guides/celestia-node-troubleshooting/#ports)
for information on which ports are required to be open on your machine.

::: code-group

```sh [Mainnet Beta]
celestia light start --core.ip rpc.celestia.pops.one --p2p.network celestia
```

```sh [Mocha]
celestia light start --core.ip rpc-mocha.pops.one --p2p.network mocha
```

```sh [Arabica]
celestia light start --core.ip validator-1.celestia-arabica-11.com --p2p.network arabica
```

:::

Tip: you can replace the core.ip with a consensus node RPC endpoint from [Mainnet Beta](mainnet.md#integrations), [Mocha testnet](mocha-testnet.md#integrations), or [Arabica devnet](arabica-devnet.md#integrations).

### Keys and wallets

You can create your key for your node by running the following command with the
[`cel-key` utility](../../tutorials/celestia-node-key) in the
`celestia-node` directory:

```sh
./cel-key add <key-name> --keyring-backend test \
    --node.type light --p2p.network <network>
```

You can start your light node with the key created above by running the
following command:

::: code-group

```sh [Mainnet Beta]
celestia light start --keyring.keyname my_celes_key \
    --core.ip consensus.lunaroasis.net
```

```sh [Mocha]
celestia light start --keyring.keyname my_celes_key \
    --core.ip rpc-mocha.pops.one --p2p.network mocha
```

```sh [Arabica]
celestia light start --keyring.keyname my_celes_key \
    --core.ip validator-1.celestia-arabica-11.com \
    --p2p.network arabica
```

:::

Once you start the light node, a wallet key will be generated for you.
You will need to fund that address with testnet tokens to pay for
`PayForBlob` transactions.

You can [find the address using the RPC CLI](../tutorials/node-tutorial.md#get-your-account-address)
or by running the following command in the
`celestia-node` directory:

```sh
./cel-key list --node.type light --keyring-backend test \
    --p2p.network <network>
```

#### Testnet tokens

You have two networks to get testnet tokens from:

- [Arabica devnet](./arabica-devnet.md#arabica-devnet-faucet)
- [Mocha testnet](./mocha-testnet.md#mocha-testnet-faucet)

You can request funds to your wallet address using the following command in Discord:

```console
$request <CELESTIA-ADDRESS>
```

Where `<CELESTIA-ADDRESS>` is the `celestia1******` address generated
when you created the wallet.

### Optional: run the light node with a custom key

In order to run a light node using a custom key:

1. The custom key must exist inside the celestia light node directory at the
   correct path (default: `~/.celestia-light/keys/keyring-test`)
2. The name of the custom key must be passed upon `start`, like so:

::: code-group

```sh [Mainnet Beta]
celestia light start --core.ip <URI> \
    --keyring.keyname <name-of-custom-key> \
```

```sh [Arabica]
celestia light start --core.ip <URI> \
    --keyring.keyname <name-of-custom-key> \
    --p2p.network arabica
```

```sh [Mocha]
celestia light start --core.ip <URI> \
    --keyring.keyname <name-of-custom-key> \
    --p2p.network mocha
```

:::

#### Optional: Migrate node id to another server

To migrate a light node ID:

1. You need to back up two files located in the celestia-light node directory at the correct path (default: `~/.celestia-light/keys`).
2. Upload the files to the new server and start the node.

### Optional: start light node with SystemD

Follow
[the tutorial on setting up the light node as a background process with SystemD](./systemd.md#celestia-light-node).

## Data availability sampling

With your light node running, you can check out
[this tutorial on submitting `PayForBlob` transactions](../tutorials/node-tutorial.md).

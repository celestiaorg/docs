---
description: Set up a Celestia full storage node.
---

# Setting up a Celestia full storage Node

This tutorial will guide you through setting up a Celestia full storage
node, which is a celestia-node that doesn't connect to celestia-app
(hence not a consensus node), but stores all the data.

## Overview of full storage nodes

Full storage nodes are Celestia nodes that store all the data. Full
storage nodes send block shares, headers, and fraud proofs to light nodes.
The light nodes gossip headers, fraud proofs, and sometimes block shares,
between one another.

![Full storage node](/img/nodes/full-storage-node.png)

## Hardware requirements

See [hardware requirements](/how-to-guides/nodes-overview.md#recommended-celestia-node-requirements).

## Setting up your full storage node

The following tutorial is done on an Ubuntu Linux 20.04 (LTS) x64 instance machine.

### Setup the dependencies

You can follow [the tutorial for setting up your dependencies](/how-to-guides/environment.md)

## Install celestia-node

You can follow [the tutorial for installing `celestia-node`](/how-to-guides/celestia-node.md)

### Run the full storage node

#### Initialize the full storage node

Run the following command:

::: code-group

```sh [Mainnet Beta]
celestia full init
```

```sh [Mocha]
celestia full init --p2p.network mocha
```

```sh [Arabica]
celestia full init --p2p.network arabica
```

:::

#### Start the full storage node

Start the full storage node with a connection to a consensus node's gRPC endpoint
(which is usually exposed on port 9090):

In order for access to the ability to get/submit
state-related information, such as the ability to
submit `PayForBlob` transactions, or query for the
node's account balance, a gRPC endpoint of a validator
(consensus) node must be passed as directed below.

:::warning Important
Make sure port 2121 TCP/UDP is open and publicly accessible on your full storage node so it can be discovered by other peers in the DHT network. This port is essential for P2P connectivity and if not properly configured, your node won't be able to participate in the network effectively.
:::

Refer to
[the ports section of the celestia-node troubleshooting page](/how-to-guides/celestia-node-troubleshooting.md#ports)
for information on which ports are required to be open on your machine.

```sh
celestia full start --core.ip <URI> --core.port <port>
```

Using an RPC of your own, or one from
[Mainnet Beta](/how-to-guides/mainnet.md#integrations),
[Mocha testnet](/how-to-guides/mocha-testnet.md#integrations) or
[Arabica devnet](/how-to-guides/arabica-devnet.md#integrations),
start your node.

Connecting to a consensus node endpoint with `--core.ip string`
provides the light node with access to state queries (reading balances, submitting
transactions, and other state-related queries).

You can create your key for your node by following
[the `cel-key` instructions](/tutorials/celestia-node-key.md)

Once you start the full storage node, a wallet key will be generated for you.
You will need to fund that address with testnet tokens to pay for
`PayForBlob` transactions.
You can find the address by running the following command:

```sh
./cel-key list --node.type full --keyring-backend test --p2p.network <network>
```

:::tip
You do not need to declare a network for Mainnet Beta. Refer to
[the chain ID section on the troubleshooting page for more information](/how-to-guides/celestia-node-troubleshooting.md)
:::

You can get testnet tokens from:

- [Mocha](/how-to-guides/mocha-testnet.md)
- [Arabica](/how-to-guides/arabica-devnet.md)

:::tip NOTE
If you are running a full-storage node for your sovereign
rollup, it is highly recommended to request Arabica devnet tokens
as Arabica has the latest changes that can be used to
test for developing your sovereign rollup. You can still use
the Mocha testnet as well, although it is primarily used for validator operations.
:::

### Optional: run the full storage node with a custom key

In order to run a full storage node using a custom key:

1. The custom key must exist inside the celestia full storage node directory
   at the correct path (default: `~/.celestia-full/keys/keyring-test`)
2. The name of the custom key must be passed upon `start`, like so:

::: code-group

```sh [Mainnet Beta]
celestia full start --core.ip <URI> --core.port <port> \
  --keyring.keyname <name-of-custom-key> \
```

```sh [Mocha]
celestia full start --core.ip <URI> --core.port <port> \
  --keyring.keyname <name-of-custom-key> \
  --p2p.network mocha
```

```sh [Arabica]
celestia full start --core.ip <URI> --core.port <port> \
  --keyring.keyname <name-of-custom-key> \
  --p2p.network arabica
```

:::

#### Optional: Migrate node id to another server

To migrate a full storage node ID:

1. You need to back up two files located in the celestia-full node directory at the correct path (default: `~/.celestia-full/keys`).
2. Upload the files to the new server and start the node.

### Optional: start the full storage node with SystemD

If you would like to run the full storage node as a background process, follow the
[SystemD tutorial](/how-to-guides/systemd.md).

With that, you are now running a Celestia full storage node.

### Stop the full storage node

In order to gracefully stop the full storage node, use `Control + C` in the
terminal window where the node is running. Be sure to only do this once
as the shutdown will not be instantaneous.

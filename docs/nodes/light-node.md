# Setting Up A Celestia Light Node

This tutorial will guide you through setting up a Celestia Light Node,
which can allow you to do data-sampling on the Data Availability (DA)
network.

## Overview of Light Nodes

Light nodes (CLN) ensure data availability. This is the most common
way to interact with the Celestia network.

> Note: In future implementations, Light Nodes can also publish
  transactions ([see ADR](https://github.com/celestiaorg/celestia-node/blob/main/docs/adr/adr-004-state-interaction.md)),
  though in Mamaki, transactions are left to Bridge Nodes.

![light-node](/img/nodes/LightNodes.png)

Light Nodes have the following properties:

1. Listen for ExtendedHeaders, i.e. wrapped “raw” headers, that notify
   Celestia Nodes of new block headers and relevant DA metadata.
2. Perform data availability sampling (DAS) on the received headers

## Hardware Requirements

The following hardware minimum requirements are recommended for running
the light node:

* Memory: 2 GB RAM
* CPU: Single Core
* Disk: 5 GB SSD Storage
* Bandwidth: 56 Kbps for Download/56 Kbps for Upload

## Setting Up Your Light Node

The following tutorial is done on an Ubuntu Linux 20.04 (LTS) x64 instance machine.

### Setup The Dependencies

Follow the tutorial on setting up your dependencies [here](../developers/environment.md).

## Install Celestia Node

> Note: Make sure that you have at least 5+ Gb of free space for Celestia Light Node

Follow the tutorial on installing Celestia Node [here](../developers/celestia-node.md)

### Initialize the Light Node

Run the following command:

```sh
celestia light init
```

### Start the Light Node

Start the Light Node with a connection to a validator node's gRPC endpoint (which
is usually exposed on port 9090):

> NOTE: In order for access to the ability to get/submit state-related information,
  such as the ability to submit PayForData transactions, or query for the node's
  account balance, a gRPC endpoint of a validator (core) node must be passed as
  directed below.

```sh
celestia light start --core.grpc http://<ip>:9090
```

If you need a list of RPC endpoints to connect to, you can check from the list [here](./mamaki-testnet.md#rpc-endpoints)

You can create your key for your node by following the `cel-key` instructions [here](./keys.md)

Once you start the Light Node, a wallet key will be generated for you.
You will need to fund that address with Mamaki Testnet tokens to pay for
PayForData transactions.
You can find the address by running the following command:

```sh
./cel-key list --node.type light --keyring-backend test
```

Mamaki Testnet tokens can be requested [here](./mamaki-testnet.md#mamaki-testnet-faucet).

### Optional: Run the Light Node with a Custom Key

In order to run a light node using a custom key:

1. The custom key must exist inside the celestia light node directory at the
   correct path (default: `~/.celestia-light/keys/keyring-test`)
2. The name of the custom key must be passed upon `start`, like so:

```sh
celestia light start --core.grpc http://<ip>:9090 --keyring.accname <name_of_custom_key>
```

### Optional: Start Light Node with SystemD

Follow the tutorial on setting up the light node as a background
process with SystemD [here](./systemd.md#celestia-light-node).

## Data Availability Sampling (DAS)

With your Light Node running, you can check out this tutorial on
submitting `PayForData` transactions [here](../developers/node-tutorial.md).

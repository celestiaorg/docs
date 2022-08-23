---
sidebar_label : Bridge Node
---

# Setting up a Celestia Bridge Node

This tutorial will go over the steps to setting up your Celestia Bridge node.

Bridge nodes connect the data availability layer and the consensus layer
while also having the option of becoming a validator.

Validators do not have to run bridge nodes, but are encouraged to in order
to relay blocks to the data availability network.

## Overview of bridge nodes

A Celestia bridge node has the following properties:

1. Import and process “raw” headers & blocks from a trusted Core process
   (meaning a trusted RPC connection to a celestia-core node) in the
   Consensus network. Bridge Nodes can run this Core process internally
   (embedded) or simply connect to a remote endpoint. Bridge Nodes also
   have the option of being an active validator in the Consensus network.
2. Validate and erasure code the “raw” blocks
3. Supply block shares with data availability headers to Light Nodes in the DA network.
   ![bridge-node-diagram](/img/nodes/BridgeNodes.png)

From an implementation perspective, Bridge Nodes run two separate processes:

1. Celestia App with Celestia Core
   ([see repo](https://github.com/celestiaorg/celestia-app))

    * **Celestia App** is the state machine where the application and the
      proof-of-stake logic is run. Celestia App is built on
      [Cosmos SDK](https://docs.cosmos.network/) and also encompasses
      **Celestia Core**.
    * **Celestia Core** is the state interaction, consensus and block production
      layer. Celestia Core is built on [Tendermint Core](https://docs.tendermint.com/),
      modified to store data roots of erasure coded blocks among other changes
      ([see ADRs](https://github.com/celestiaorg/celestia-core/tree/master/docs/celestia-architecture)).

2. Celestia Node ([see repo](https://github.com/celestiaorg/celestia-node))

    * **Celestia Node** augments the above with a separate libp2p network that
      serves data availability sampling requests. The team sometimes refer to
      this as the “halo” network.

## Hardware requirements

The following hardware minimum requirements are recommended for running the
bridge node:

* Memory: 8 GB RAM
* CPU: Quad-Core
* Disk: 250 GB SSD Storage
* Bandwidth: 1 Gbps for Download/100 Mbps for Upload

## Setting up your bridge node

The following tutorial is done on an Ubuntu Linux 20.04 (LTS) x64 instance machine.

### Setup the dependencies

Follow the tutorial here installing the dependencies [here](../developers/environment.md).

## Deploy the Celestia bridge node

### Install Celestia node

Install the Celestia Node binary, which will be used to run the Bridge Node.

Follow the tutorial for installing Celestia Node [here](../developers/celestia-node.md).

### Initialize the bridge node

Run the following:

```sh
celestia bridge init --core.ip <ip-address> --core.rpc.port 26657
```

> NOTE: The `--core.rpc.port` defaults to 26657, so if you do not specify
  it in the command line, it will default to that port. You can use the flag
  to specify another port if you prefer.

If you need a list of RPC endpoints to connect to, you can check from the list [here](./mamaki-testnet.md#rpc-endpoints)

### Run the bridge node

Start the Bridge Node with a connection to a validator node's gRPC endpoint
(which is usually exposed on port 9090):

```sh
celestia bridge start --core.ip <ip> --core.grpc.port 9090
```

> NOTE: The `--core.grpc.port` defaults to 9090, so if you do not specify
  it in the command line, it will default to that port. You can use the flag
  to specify another port if you prefer.

If you need a list of RPC endpoints to connect to, you can check from the list [here](./mamaki-testnet.md#rpc-endpoints)

You can create your key for your node by following the `cel-key` instructions [here](./keys.md)

Once you start the Bridge Node, a wallet key will be generated for you.
You will need to fund that address with Mamaki Testnet tokens to pay for
PayForData transactions.
You can find the address by running the following command:

```sh
./cel-key list --node.type bridge --keyring-backend test
```

Mamaki Testnet tokens can be requested [here](./mamaki-testnet.md#mamaki-testnet-faucet).

#### Optional: run the bridge node with a custom key

In order to run a bridge node using a custom key:

1. The custom key must exist inside the celestia bridge node directory at the
   correct path (default: `~/.celestia-bridge/keys/keyring-test`)
2. The name of the custom key must be passed upon `start`, like so:

```sh
celestia bridge start --core.ip <ip> --core.grpc.port 9090 --keyring.accname <name_of_custom_key>
```

### Optional: start the bridge node with SystemD

Follow the tutorial on setting up the bridge node as a background process with
SystemD [here](./systemd.md#celestia-bridge-node).

You have successfully set up a bridge node that is syncing with the network.

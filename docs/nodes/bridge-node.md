# Setting Up A Celestia Bridge Node

This tutorial will go over the steps to setting up your Celestia Bridge node.

Bridge nodes connect the data availability layer and the consensus layer
while also having the option of becoming a validator.

## Overview of Bridge Nodes

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

## Hardware Requirements

The following hardware minimum requirements are recommended for running the
bridge node:

* Memory: 8 GB RAM
* CPU: Quad-Core
* Disk: 250 GB SSD Storage
* Bandwidth: 1 Gbps for Download/100 Mbps for Upload

## Setting Up Your Bridge Node

The following tutorial is done on an Ubuntu Linux 20.04 (LTS) x64 instance machine.

### Setup The Dependencies

Follow the tutorial here installing the dependencies [here](../../developers/environment).

## Deploy the Celestia Bridge Node

### Install Celestia Node

Install the Celestia Node binary, which will be used to run the Bridge Node.

Follow the tutorial for installing Celestia Node [here](../../developers/celestia-node).

### Initialize the Bridge Node

Run the following:

```sh
celestia bridge init --core.remote tcp://<ip-address>:26657 
```

If you need a list of RPC endpoints to connect to, you can check from the list [here](../nodes/mamaki-testnet#rpc-endpoints)

### Run the Bridge Node

Start the Bridge Node with a connection to a validator node's gRPC endpoint
(which is usually exposed on port 9090):

> NOTE: In order for access to the ability to get/submit state-related information,
  such as the ability to submit PayForData transactions, or query for the node's
  account balance, a gRPC endpoint of a validator (core) node must be passed as
  directed below._

```sh
celestia bridge start --core.grpc <ip>:9090
```

If you need a list of RPC endpoints to connect to, you can check from the list [here](../nodes/mamaki-testnet#rpc-endpoints)

#### Optional: Run the Bridge Node with a Custom Key

In order to run a bridge node using a custom key:

1. The custom key must exist inside the celestia bridge node directory at the
   correct path (default: `~/.celestia-bridge/keys/keyring-test`)
2. The name of the custom key must be passed upon `start`, like so:

```sh
celestia bridge start --core.grpc <ip>:9090 --keyring.accname <name_of_custom_key>
```

### Optional: Start the Bridge Node with SystemD

Follow the tutorial on setting up the bridge node as a background process with
SystemD [here](../nodes/systemd#celestia-bridge-node).

You have successfully set up a bridge node that is syncing with the network.

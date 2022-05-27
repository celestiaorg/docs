# Setting Up A Celestia Full Storage Node

This tutorial will guide you through setting up a Celestia Full Storage
Node, which is a Celestia node that doesn't connect to Celestia App
(hence not a full node) but stores all the data.

## Hardware Requirements

The following hardware minimum requirements are recommended for running
the full storage node:

* Memory: 8 GB RAM
* CPU: Quad-Core
* Disk: 250 GB SSD Storage
* Bandwidth: 1 Gbps for Download/100 Mbps for Upload

## Setting Up Your Full Storage Node

The following tutorial is done on an Ubuntu Linux 20.04 (LTS) x64 instance machine.

### Setup The Dependencies

You can follow the tutorial for setting up your dependencies [here](../../developers/environment)

## Install Celestia Node

> Note: Make sure that you have at least 250+ Gb of free space for
  Celestia Full Storage Node

You can follow the tutorial for installing Celestia Node [here](../../developers/celestia-node)

### Run the Full Storage Node

#### Initialize the Full Storage Node

Run the following command:

```sh
celestia full init
```

#### Start the Full Storage Node

Start the Full Storage Node with a connection to a validator node's gRPC endpoint
(which is usually exposed on port 9090):

> NOTE: In order for access to the ability to get/submit state-related
  information, such as the ability to submit PayForData transactions,
  or query for the node's account balance, a gRPC endpoint of a validator
  (core) node must be passed as directed below.

```sh
celestia full start --core.grpc <ip addr of core node>:9090
```

If you would like to find example RPC endpoints, check out the list of
resources [here](../nodes/mamaki-testnet#rpc-endpoints).

### Optional: Run the Full Storage Node with a Custom Key

In order to run a full storage node using a custom key:

1. The custom key must exist inside the celestia full storage node directory
   at the correct path (default: `~/.celestia-full/keys/keyring-test`)
2. The name of the custom key must be passed upon `start`, like so:

```sh
celestia full start --core.grpc <ip>:9090 --keyring.accname <name_of_custom_key>
```

### Optional: Start the Full Storage Node with SystemD

Follow the tutorial on setting up the full storage node as a background
process with SystemD [here](../nodes/systemd#celestia-full-storage-node).

With that, you are now running a Celestia Full Storage Node.

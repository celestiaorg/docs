# Setting Up A Celestia Full Node

This tutorial will guide you through setting up a Celestia Full Node,
which is a Celestia node that doesn't connect to Celestia App
(hence not a full node) but stores all the data.

## Hardware Requirements

The following hardware minimum requirements are recommended for running
the full node:

* Memory: 8 GB RAM
* CPU: Quad-Core
* Disk: 250 GB SSD Storage
* Bandwidth: 1 Gbps for Download/100 Mbps for Upload

## Setting Up Your Full Node

The following tutorial is done on an Ubuntu Linux 20.04 (LTS) x64
instance machine.

### Setup The Dependencies

You can follow the tutorial for setting up your dependencies [here](../developers/environment)

## Install Celestia Node

> Note: Make sure that you have at least 250+ Gb of free space
  for Celestia Full Node  

You can follow the tutorial for installing Celestia Node [here](../developers/celestia-node)

### Run the Full Node

#### Initialize the Full Node

Run the following command:

```sh
celestia full init
```

#### Start the Full Node

Start the Full Node with a connection to a validator
node's gRPC endpoint (which is usually exposed on port 9090):

```sh
celestia full start --core.grpc <ip addr of core node>:9090
```

Now, the Celestia Full Node will start syncing.

With that, you are now running a Celestia Full Node.

#### Optional: Run the Full Node with a Custom Key

In order to run a full node using a custom key:

1. The custom key must exist inside the celestia full node
directory at the correct path (default: `~/.celestia-full/keys/keyring-test`)
2. The name of the custom key must be passed upon `start`, like so:

```sh
celestia full start --keyring.accname <name_of_custom_key>
```

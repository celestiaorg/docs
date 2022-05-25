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

### Get the trusted hash

> Caveat: You need a running celestia-app in order to continue this guideline.
Please refer to [celestia-app.md](https://github.com/celestiaorg/networks/celestia-app.md)
for installation.

You need to have the trusted server to initialize the Bridge Node. You can use
`http://localhost:26657` for your local run of `celestia-app`. The trusted hash
is an optional flag and does not need to be used. If you are not passing it, the
Bridge Node will just sync from the beginning, which is also the preferred
option of how to run it.

An example of how to query your local celestia-app to get the trusted hash:

```sh
curl -s http://localhost:26657/block?height=1 | grep -A1 block_id | grep hash
```

### Initialize the Bridge Node

Run the following:

```sh
celestia bridge init --core.remote tcp://<ip-address>:26657 
```

### Configure the Bridge Node

To configure your Bridge Node to connect to your network of choice, select one of
the networks you would like to connect to from this list and follow the instructions
there before proceeding with the rest of this guide:

* [Mamaki](../nodes/mamaki-testnet.md#configure-the-bridge-node)

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

#### Optional: Run the Bridge Node with a Custom Key

In order to run a bridge node using a custom key:

1. The custom key must exist inside the celestia bridge node directory at the
   correct path (default: `~/.celestia-bridge/keys/keyring-test`)
2. The name of the custom key must be passed upon `start`, like so:

```sh
celestia bridge start --core.grpc <ip>:9090 --keyring.accname <name_of_custom_key>
```

### Optional: Start the Bridge Node with SystemD

SystemD is a daemon service useful for running applications as background processes.

Create Celestia Bridge systemd file:

```sh
sudo tee <<EOF >/dev/null /etc/systemd/system/celestia-bridge.service
[Unit]
Description=celestia-bridge Cosmos daemon
After=network-online.target

[Service]
User=$USER
ExecStart=$HOME/go/bin/celestia bridge start
Restart=on-failure
RestartSec=3
LimitNOFILE=4096

[Install]
WantedBy=multi-user.target
EOF
```

If the file was created successfully you will be able to see its content:

```sh
cat /etc/systemd/system/celestia-bridge.service
```

Enable and start celestia-bridge daemon:

```sh
sudo systemctl enable celestia-bridge
sudo systemctl start celestia-bridge && sudo journalctl -u \
celestia-bridge.service -f
```

Now, the Celestia bridge node will start syncing headers and storing blocks
from Celestia application.

> Note: At startup, we can see the `multiaddress` from Celestia Bridge Node.
This is **needed for future Light Node** connections and communication between
Celestia Bridge Nodes

Example:

```sh
/ip4/46.101.22.123/tcp/2121/p2p/12D3KooWD5wCBJXKQuDjhXFjTFMrZoysGVLtVht5hMoVbSLCbV22
```

You should be seeing logs coming through of the bridge node syncing.

You have successfully set up a bridge node that is syncing with the network.

# Setting Up A Celestia Light Node

This tutorial will guide you through setting up a Celestia Light Node, which can allow you to do data-sampling on the
Data Availability (DA)
network.

## Overview of Light Nodes

Light nodes (CLN) ensure data availability. This is the most common way to interact with the Celestia network.

> Note: In future implementations, Light Nodes can also publish transactions ([see ADR](https://github.com/celestiaorg/celestia-node/blob/main/docs/adr/adr-004-state-interaction.md)), though in Mamaki, transactions are left to Bridge Nodes.

![light-node](/img/nodes/LightNodes.png)

Light Nodes have the following properties:

1. Listen for ExtendedHeaders, i.e. wrapped “raw” headers, that notify Celestia Nodes of new block headers and relevant
   DA metadata.
2. Perform data availability sampling (DAS) on the received headers

## Hardware Requirements

The following hardware minimum requirements are recommended for running the light node:

* Memory: 2 GB RAM
* CPU: Single Core
* Disk: 5 GB SSD Storage
* Bandwidth: 56 Kbps for Download/56 Kbps for Upload

## Setting Up Your Light Node

The following tutorial is done on an Ubuntu Linux 20.04 (LTS) x64 instance machine.

### Setup The Dependencies

Follow the tutorial on setting up your dependencies [here](../developers/environment).

## Install Celestia Node

> Note: Make sure that you have at least 5+ Gb of free space for Celestia Light Node

Follow the tutorial on installing Celestia Node [here](../developers/celestia-node)

### Run the Light Node

> If you want to connect to your Celestia Bridge Node and start syncing the Celestia Light Node from a non-genesis hash, then consider editing
`config.toml` file.

More information on `config.toml` is found [here](https://github.com/celestiaorg/networks/blob/master/config-toml.md).

#### Initialize the Light Node

Run the following command:

```sh
celestia light init
```

#### Start the Light Node

Start the Light Node with a connection to a validator node's gRPC endpoint (which is usually exposed on port 9090):
_*NOTE*: In order for access to the ability to get/submit state-related information, such as the ability to submit
PayForData transactions, or query for the node's account balance, a gRPC endpoint of a validator (core) node must be
passed as directed below._

```sh
celestia light start --core.grpc <ip>:9090
```

#### Optional: Run the Light Node with a Custom Key

In order to run a light node using a custom key:

1. The custom key must exist inside the celestia light node directory at the correct path (
   default: `~/.celestia-light/keys/keyring-test`)
2. The name of the custom key must be passed upon `start`, like so:

```sh
celestia light start --core.grpc <ip>:9090 --keyring.accname <name_of_custom_key>
```

#### Optional: Start Light Node with SystemD

Start the Light Node as daemon process in the background

```sh
sudo tee <<EOF >/dev/null /etc/systemd/system/celestia-lightd.service
[Unit]
Description=celestia-lightd Light Node
After=network-online.target

[Service]
User=$USER
ExecStart=$HOME/go/bin/celestia light start --core.grpc <ip>:9090
Restart=on-failure
RestartSec=3
LimitNOFILE=4096

[Install]
WantedBy=multi-user.target
EOF
```

If the file was created succesfully you will be able to see its content:

```sh
cat /etc/systemd/system/celestia-lightd.service
```

##### Start The Daemon

Enable and start celestia-lightd daemon:

```sh
sudo systemctl enable celestia-lightd
sudo systemctl start celestia-lightd
```

##### Check Daemon Status

Check if daemon has been started correctly:

```sh
sudo systemctl status celestia-lightd
```

##### Check Daemon Logs

Check daemon logs in real time:

```sh
sudo journalctl -u celestia-lightd.service -f
```

Now, the Celestia Light Node will start syncing headers. After sync is finished, Light Node will do Data Availability
Sampling (DAS) from the Bridge Node.

## Data Availability Sampling(DAS)

### Pre-Requisites

To continue, you will need:

* A Celestia Light Node connected to a Bridge Node
* A Celestia wallet

Open 2 terminals in order to see how DASing works:

1. First terminal: tail your Light Node logs
2. Second terminal: use Celestia App's CLI to submit a paid
   `payForMessage` tx to the network

### Create a wallet

First, you need a wallet to pay for the transaction.

Follow the tutorial on setting up a wallet [here](../developers/wallet).

### Send a transaction

In the second terminal, submit a `payForMessage` transaction with
`celestia-appd` (or do so in the wallet):

```sh
celestia-appd tx payment payForMessage <hex_namespace> <hex_message> \
--from <wallet_name> --keyring-backend <keyring-name> \
--chain-id <chain_name>
```

Example:

```sh
celestia-appd tx payment payForMessage 0102030405060708 \
68656c6c6f43656c6573746961444153 --from myWallet --keyring-backend test \
--chain-id devnet-2
```

### Observe DAS in action

In the Light Node logs you should see how data availability sampling works:

Example:

```sh
INFO das das/daser.go:96 sampling successful {“height”: 81547, “hash”: \
“DE0B0EB63193FC34225BD55CCD3841C701BE841F29523C428CE3685F72246D94”, \
“square width”: 2, “finished (s)”: 0.000117466}
```

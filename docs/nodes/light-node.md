# Setting Up A Celestia Light Node

This tutorial will guide you through setting up a Celestia Light Node,
which can allow you to do data-sampling on the Data Availability (DA)
network.

## Overview of Light Nodes

Light nodes (CLN) ensure data availability. This is the most common way
to interact with the Celestia network.

> Note: In future implementations, Light Nodes can also publish
  transactions ([see ADR](https://github.com/celestiaorg/celestia-node/blob/main/docs/adr/adr-004-state-interaction.md)),
  though in Mamaki, transactions are left to Bridge Nodes.

![light-node](/img/nodes/LightNodes.png)

Light Nodes have the following properties:

1. Connect to a [Celestia Bridge Node](https://github.com/celestiaorg/networks#celestia-validator-bridge-nodes)
   in the DA network. _Note: Light Nodes do not communicate with each other,
   but only with Bridge Nodes._
2. Listen for ExtendedHeaders, i.e. wrapped “raw” headers, that notify
   Celestia Nodes of new block headers and relevant DA metadata.
3. Perform data availability sampling (DAS) on the received headers

## Hardware Requirements

The following hardware minimum requirements are recommended for running
the light node:

* Memory: 2 GB RAM
* CPU: Single Core
* Disk: 5 GB SSD Storage
* Bandwidth: 56 Kbps for Download/56 Kbps for Upload

## Setting Up Your Light Node

The following tutorial is done on an Ubuntu Linux 20.04 (LTS) x64
instance machine.

### Setup The Dependencies

Once you have setup your instance, ssh into the instance to begin
setting up the box with all the needed dependencies in order to
run your light node.

First, make sure to update and upgrade the OS:

```sh
sudo apt update && sudo apt upgrade -y
```

These are essential packages that are necessary to execute many
tasks like downloading files, compiling and monitoring the node:

```sh
sudo apt install curl tar wget clang pkg-config libssl-dev jq \
build-essential git make ncdu -y
```

### Install Golang

Golang will be installed on this machine in order for us to be able
to build the necessary binaries for running the light node. For Golang
specifically, it’s needed to be able to compile Celestia Light Node.

```sh
ver="1.17.2"
cd $HOME
wget "https://golang.org/dl/go$ver.linux-amd64.tar.gz"
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf "go$ver.linux-amd64.tar.gz"
rm "go$ver.linux-amd64.tar.gz"
```

Now we need to add the `/usr/local/go/bin` directory to `$PATH`:

```sh
echo "export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

To check if Go was installed correctly run:

```sh
go version
```

Output should be the version installed:

```sh
go version go1.17.2 linux/amd64
```

## Install Celestia Node

> Note: Make sure that you have at least 5+ Gb of free space
  for Celestia Light Node  

Install the Celestia Node binary. Make sure that you have `git` and `golang` installed.

```sh
git clone https://github.com/celestiaorg/celestia-node.git
cd celestia-node/
APP_VERSION=$(curl -s \
  https://api.github.com/repos/celestiaorg/celestia-node/releases/latest \
  | jq -r ".tag_name")
git checkout tags/$APP_VERSION -b $APP_VERSION
make install
```

### Run the Light Node

> If you want to connect to your Celestia Bridge Node and start syncing
  the Celestia Light Node from a non-genesis hash, then consider editing
  `config.toml` file.

More information on `config.toml` is found [here](https://github.com/celestiaorg/networks/blob/master/config-toml.md).

#### Initialize the Light Node

Run the following command:

```sh
celestia light init
```

#### Start the Light Node

Start the Light Node as daemon process in the background

```sh
sudo tee <<EOF >/dev/null /etc/systemd/system/celestia-lightd.service
[Unit]
Description=celestia-lightd Light Node
After=network-online.target

[Service]
User=$USER
ExecStart=$HOME/go/bin/celestia light start
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

#### Start The Daemon

Enable and start celestia-lightd daemon:

```sh
sudo systemctl enable celestia-lightd
sudo systemctl start celestia-lightd
```

#### Check Daemon Status

Check if daemon has been started correctly:

```sh
sudo systemctl status celestia-lightd
```

#### Check Daemon Logs

Check daemon logs in real time:

```sh
sudo journalctl -u celestia-lightd.service -f
```

Now, the Celestia Light Node will start syncing headers. After sync
is finished, Light Node will do Data Availability Sampling (DAS) from
the Bridge Node.

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

Option 1: Use the Keplr wallet which has beta support for Celestia.

Check out the Observer [here](https://staking.celestia.observer/)

Option 2: Download the Celestia App binary which has a CLI for creating
wallets

You can follow the next steps for Option 2:

#### Download Celestia-App Binary

Download the celestia-appd binary inside `$HOME/go/bin` folder which
will be used to create wallets.

```sh
git clone https://github.com/celestiaorg/celestia-app.git
cd celestia-app/
git checkout tags/v0.1.0 -b v0.1.0
make install
```

#### Check Binary Compiled

To check if the binary was succesfully compiled you can run the
binary using the `--help` flag:

```sh
celestia-appd --help
```

#### Create the Wallet

Create the wallet with any wallet name you want e.g.

```sh
celestia-appd keys add mywallet
```

Save the mnemonic output as this is the only way to recover your
validator wallet in case you lose it!

### Fund the Wallet

You can fund an existing wallet via Discord by sending this message to #faucet channel:

```text
!faucet celes1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Wait to see if you get a confirmation that the tokens have been
successfully sent. To check if tokens have arrived succesfully to
the destination wallet run the command below replacing the public
address with your own:

```sh
celestia-appd q bank balances celes1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

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

# Celestia App Network Instantiation Guide

This guide is for helping instantiate a new testnetwork and following the
correct steps to do so with Celestia-App. You should only follow this guide
if you want to experiment with your own Celestia Testnetwork or if you want
to test out new features to build as a core developer.

## Hardware Requirements

The following hardware minimum requirements are recommended for running the
validator node:

* Memory: 8 GB RAM
* CPU: Quad-Core
* Disk: 250 GB SSD Storage
* Bandwidth: 1 Gbps for Download/100 Mbps for Upload

## Setup Dependencies

The following tutorial is done on an Ubuntu Linux 20.04 (LTS) x64
instance machine.

Once you have setup your instance, ssh into the instance to begin setting up
the box with all the needed dependencies in order to run your bridge node.

First, make sure to update and upgrade the OS:

```sh
sudo apt update && sudo apt upgrade -y
```

These are essential packages that are necessary to execute many tasks like
downloading files, compiling and monitoring the node:

```sh
sudo apt install curl tar wget clang pkg-config libssl-dev jq \
build-essential git make ncdu -y
```

### Install Golang

Golang will be installed on this machine in order for us to be able to build
the necessary binaries for running the bridge node. For Golang specifically,
it is needed to be able to compile Celestia Application.

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
echo 'export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin' >> $HOME/.bash_profile
source $HOME/.bash_profile
```

To check if Go was installed correctly run:

```sh
go version
```

Output should be the version installed:

```console
go version go1.17.2 linux/amd64
```

## Installation

Run the following:

```sh
cd $HOME
git clone https://github.com/celestiaorg/celestia-app.git
cd celestia-app/
APP_VERSION=$(curl -s https://api.github.com/repos/celestiaorg/celestia-app/releases/latest \
| jq -r ".tag_name")
git checkout tags/$APP_VERSION -b $APP_VERSION
make install
```

To check if the binary was successfully compiled you can run the binary
using the `--help` flag:

```sh
celestia-appd --help
```

You should see a similar output:

```console
Stargate CosmosHub App

Usage:
  celestia-appd [command]

Available Commands:
*
*
*
Use "celestia-appd [command] --help" for more information about a command.
```

## Spin Up A Celestia Testnet

If you want to spin up a quick testnet with your friends, you can follow these steps.
Unless otherwise noted, every step must be done by everyone who wants to
participate in this testnet.

### Optional: Reset Working Directory

If you have already initialized a working directory for `celestia-appd` in the past,
you must clean up before reinitializing a new directory. You can do so by running
the following command:

```sh
celestia-appd unsafe-reset-all
```

### Initialize A Working Directory

Run the following command:

```sh
VALIDATOR_NAME=validator1
CHAIN_ID=testnet
celestia-appd init $VALIDATOR_NAME --chain-id $CHAIN_ID
```

* The value we will use for `$VALIDATOR_NAME` is `validator1` but you should choose
  your own node name.
* The value we will use for `$CHAIN_ID` is `testnet`. The `$CHAIN_ID` must
  remain the same for everyone participating in this network.

### Create A New Key

Next, run the following command:

```sh
KEY_NAME=validator
celestia-appd keys add $KEY_NAME --keyring-backend test
```

This will create a new key, with a name of your choosing.
Save the output of this command somewhere; you'll need
the address generated here later. Here, we set the value of our
key `$KEY_NAME` to `validator` for demonstration.

### Add Genesis Account KeyName

Run the following command:

```sh
CELES_AMOUNT="10000000000000000000000000uceles"
celestia-appd add-genesis-account $KEY_NAME $CELES_AMOUNT --keyring-backend test
```

Here `$VALIDATOR_NAME` is the same key name as before; and `amount`
is something like `10000000000000000000000000uceles`.

### Optional: Adding Other Validators

If other participants in your testnet also want to be validators,
repeat the command above with the specific amount for their public keys.

Once all the validators are added, the `genesis.json` file is created. You need
to share it with all other validators in your testnet in order for everyone to
proceed with the following step.

You can find the `genesis.json` at `$HOME/.celestia-appd/config/genesis.json`

### Create the Genesis Transaction For New Chain

Run the following command:

```sh
STAKING_AMOUNT=1000000000uceles
celestia-appd gentx $KEY_NAME $STAKING_AMOUNT --chain-id $CHAIN_ID
```

This will create the genesis transaction for your new chain.
Here `amount` should be at least `1000000000uceles`. If you
provide too much or too little, you will encounter an error
when starting your node.

You will find the generated gentx JSON file inside `~/.celestia-app/config/gentx/gentx-[key_name].json`

> Note: If you have other validators in your network, they need to also
  run the above command with the `genesis.json` file you shared with
  them in the previous step.

### Creating the Genesis JSON File

Once all participants have submitted their gentx JSON files to you,
you will pull all those gentx files inside the following directory:
`$HOME/.celestia-appd/config/gentx` and use them to create the final
`genesis.json` file.

Once you added the gentx files of all the particpants, run the following command:

```sh
celestia-appd collect-gentxs 
```

This command will look for the gentx files in this repo which should
be moved to the following directory `~/.celestia-app/config/gentx`.

You should then share this final `genesis.json` file with all the
other particpants who must add it to their `~/.celestia-app/config` directory.

Everyone must ensure that they replace their existing `genesis.json` file with
this new one created.

### Modify Your Config File

Open the following file `~/.celestia-app/config/config.toml` to modify it.

Inside the file, add the other participants by modifying the following line to
include other participants as persistent peers:

```text
# Comma separated list of nodes to keep persistent connections to
persistent_peers = "[validator_address]@[ip_address]:[port],[validator_address]@[ip_address]:[port]"
```

You can find `validator_address` by running the following command:

```sh
celestia-appd tendermint show-node-id
```

The output will be the hex-encoded `validator_address`. The default `port` is 26656.

### Instantiate the Network

You can start your node by running the following command:

```sh
celestia-appd start
```

Now you have a new Celestia Testnet to play around with!

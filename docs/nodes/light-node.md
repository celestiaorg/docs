---
sidebar_label : Light Node
---

# Setting up a Celestia Light Node

This tutorial will guide you through setting up a Celestia light node, which
will allow you to perform data availability sampling on the data
availability (DA) network.

> To view a video tutorial for setting up a Celestia light node, click [here](../developers/light-node-video.md)

## Overview of light nodes

Light nodes ensure data availability. This is the most common
way to interact with the Celestia network.

![light-node](/img/nodes/LightNodes.png)

Light nodes have the following behavior:

1. They listen for ExtendedHeaders, i.e. wrapped “raw” headers, that notify
   Celestia nodes of new block headers and relevant DA metadata.
2. They perform data availability sampling (DAS) on the received headers

## Hardware requirements

The following minimum hardware requirements are recommended for running
a light node:

* Memory: 2 GB RAM
* CPU: Single Core
* Disk: 5 GB SSD Storage
* Bandwidth: 56 Kbps for Download/56 Kbps for Upload

## Setting up your light node

This tutorial was performed on an Ubuntu Linux 20.04 (LTS) x64 instance machine.

### Setup the dependencies

First, make sure to update and upgrade the OS:

```sh
# If you are using the APT package manager
sudo apt update && sudo apt upgrade -y

# If you are using the YUM package manager
sudo yum update
```

These are essential packages that are necessary to execute many tasks like downloading
files, compiling, and monitoring the node:

```sh
# If you are using the APT package manager
sudo apt install curl tar wget clang pkg-config libssl-dev jq build-essential \
git make ncdu -y

# If you are using the YUM package manager
sudo yum install curl tar wget clang pkg-config libssl-dev jq build-essential \
git make ncdu -y
```

### Install Golang

Celestia-app and celestia-node are written in [Golang](https://go.dev/) so we must
install Golang to build and run them.

```sh
ver="1.18.2"
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

The output should be the version installed:

```sh
go version go1.18.2 linux/amd64
```

### Install Celestia node

Install the celestia-node binary by running the following commands:

```sh
cd $HOME
rm -rf celestia-node
git clone https://github.com/celestiaorg/celestia-node.git
cd celestia-node/
git checkout tags/v0.3.0-rc2
make install
make cel-key
```

Verify that the binary is working and check the version with the
celestia version command:

```sh
$ celestia version
Semantic version: v0.3.0-rc2
Commit: 89892d8b96660e334741987d84546c36f0996fbe
```

## Initialize the light node

Run the following command:

```sh
celestia light init
```

You should see output like:

<!-- markdownlint-disable MD013 -->
```output
$ celestia light init
2022-07-18T02:22:09.449Z INFO node node/init.go:26 Initializing Light Node Store over '/home/ec2-user/.celestia-light'
2022-07-18T02:22:09.449Z INFO node node/init.go:62 Saving config {"path": "/home/ec2-user/.celestia-light/config.toml"}
2022-07-18T02:22:09.449Z INFO node node/init.go:67 Node Store initialized
```
<!-- markdownlint-enable MD013 -->

### Start the light node

Start the light node with a connection to a validator node's gRPC endpoint (which
is usually exposed on port 9090):

> NOTE: In order for access to the ability to get/submit state-related information,
  such as the ability to submit PayForData transactions, or query for the node's
  account balance, a gRPC endpoint of a validator (core) node must be passed as
  directed below.

For ports:

> NOTE: The `--core.grpc.port` defaults to 9090, so if you do not specify
  it in the command line, it will default to that port. You can use the flag
  to specify another port if you prefer.

```sh
celestia light start --core.ip <ip-address> --core.grpc.port <port>
```

If you need a list of RPC endpoints to connect to, you can check from the list [here](./mamaki-testnet.md#rpc-endpoints)

For example, your command might look something like this:

```sh
celestia light start --core.ip https://rpc-mamaki.pops.one --core.grpc.port 9090
```

### Keys and wallets

You can create your key for your node by running the following command:

```sh
./cel-key add <key_name> --keyring-backend test --node.type light
```

<!-- markdownlint-disable MD013 -->
```sh
celestia light start --core.ip <ip-address> --core.grpc.port <port> --keyring.accname <key_name>
```
<!-- markdownlint-enable MD013 -->

Once you start the Light Node, a wallet key will be generated for you.
You will need to fund that address with Mamaki Testnet tokens to pay
for PayForData transactions.

You can find the address by running the following command in the
`celestia-node` directory:

```sh
./cel-key list --node.type light --keyring-backend test
```

If you would like to fund your wallet with testnet tokens,
head over to the Celestia Discord channel `#faucet`.

You can request funds to your wallet address using the following command in Discord:

```console
$request <Wallet-Address>
```

Where `<Wallet-Address>` is the `celestia1******` address generated
when you created the wallet.

With your wallet funded, you can move on to the next step.

### Optional: run the light node with a custom key

In order to run a light node using a custom key:

1. The custom key must exist inside the celestia light node directory at the
   correct path (default: `~/.celestia-light/keys/keyring-test`)
2. The name of the custom key must be passed upon `start`, like so:

<!-- markdownlint-disable MD013 -->
```sh
celestia light start --core.ip <ip-address> --core.grpc.port <port> --keyring.accname <name_of_custom_key>
```
<!-- markdownlint-enable MD013 -->

### Optional: start light node with SystemD

Follow the tutorial on setting up the light node as a background
process with SystemD [here](./systemd.md#celestia-light-node).

## Data availability sampling (DAS)

With your light node running, you can check out this tutorial on
submitting `PayForData` transactions [here](../developers/node-tutorial.md).

# Setting Up A Celestia Bridge & Validator Node

This tutorial will go over the steps to setting up your Celestia Bridge node.

Bridge nodes connect the data availability layer and the consensus layer while
also having the option of becoming a validator.

If you are reading this tutorial in order to setup a validator, follow through
the sections until you reach the validator setup guide. If you just want to
run a bridge node, you don’t need to complete the validator step at the end.

## Overview of Bridge Nodes

A Celestia bridge node has the following properties:

1. Import and process “raw” headers & blocks from a trusted Core process
  (meaning a trusted RPC connection to a celestia-core node) in the Consensus
  network. Bridge Nodes can run this Core process internally (embedded) or
  simply connect to a remote endpoint. Bridge Nodes also have the option of
  being an active validator in the Consensus network.
2. Validate and erasure code the “raw” blocks
3. Supply block shares with data availability headers to Light Nodes in the
  DA network.
![bridge-node-diagram](/img/nodes/BridgeNodes.png)

From an implementation perspective, Bridge Nodes run two separate processes:

1. Celestia App with Celestia Core
   ([see repo](https://github.com/celestiaorg/celestia-app))

    * **Celestia App** is the state machine where the application and the
      proof-of-stake logic is run. Celestia App is built on
      [Cosmos SDK](https://docs.cosmos.network/) and also encompasses
      **Celestia Core**.
    * **Celestia Core** is the state interaction, consensus and block production
      layer. Celestia Core is built on
      [Tendermint Core](https://docs.tendermint.com/), modified to store data roots
      of erasure coded blocks among other changes
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

The following tutorial is done on an Ubuntu Linux 20.04 (LTS) x64
instance machine.

### Setup The Dependencies

Once you have setup your instance, ssh into the instance to begin setting up
the box with all the needed dependencies in order to run your bridge node.

First, make sure to update and upgrade the OS:

```sh
sudo apt update && sudo apt upgrade -y
```

These are essential packages that are necessary to execute many tasks like
downloading files, compiling and monitoring the node:

```sh
sudo apt install curl tar wget clang pkg-config libssl-dev jq build-essential \
git make ncdu -y
```

### Install Golang

Golang will be installed on this machine in order for us to be able to build
the necessary binaries for running the bridge node. For Golang specifically,
it’s needed to be able to compile Celestia Application.

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

## Deploying The Celestia App

This section describes part 1 of Celestia Bridge Node setup: running a Celestia
App daemon with an internal Celestia Core node.

> Note: Make sure you have at least 100+ Gb of free space to safely install+run
  the Bridge Node.  

### Install Celestia App

The steps below will create a binary file named `celestia-appd`
inside `$HOME/go/bin` folder which will be used later to run the node.

```sh
cd $HOME
rm -rf celestia-app
git clone https://github.com/celestiaorg/celestia-app.git
cd celestia-app/
APP_VERSION=$(curl -s \
  https://api.github.com/repos/celestiaorg/celestia-app/releases/latest \
  | jq -r ".tag_name")
git checkout tags/$APP_VERSION -b $APP_VERSION
make install
```

To check if the binary was successfully compiled you can run the binary
using the `--help` flag:

```sh
celestia-appd --help
```

You should see a similar output (with helpful example commands):

```text
Stargate CosmosHub App

Usage:
  celestia-appd [command]

Use "celestia-appd [command] --help" for more information about a command.
```

### Setup the P2P Networks

For this section of the guide, select the network you want to connect to:

* [Devnet-2](../nodes/devnet-2.md#setup-p2p-network)

After that, you can proceed with the rest of the tutorial.

### Configure Pruning

For lower disk space usage we recommend setting up pruning using the
configurations below. You can change this to your own pruning configurations
if you want:

```sh
pruning="custom"
pruning_keep_recent="100"
pruning_keep_every="5000"
pruning_interval="10"

sed -i -e "s/^pruning *=.*/pruning = \"$pruning\"/" $HOME/.celestia-app/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \
\"$pruning_keep_recent\"/" $HOME/.celestia-app/config/app.toml
sed -i -e "s/^pruning-keep-every *=.*/pruning-keep-every = \
\"$pruning_keep_every\"/" $HOME/.celestia-app/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \
\"$pruning_interval\"/" $HOME/.celestia-app/config/app.toml
```

### Reset Network

This will delete all data folders so we can start fresh:

```sh
celestia-appd unsafe-reset-all
```

### Optional: Quick-Sync with Snapshot

Syncing from Genesis can take a long time, depending on your hardware. Using
this method you can synchronize your Celestia node very quickly by downloading
a recent snapshot of the blockchain. If you would like to sync from the Genesis,
then you can skip this part.

If you want to use snapshot, determine the network you would like to sync
to from the list below:

* [Devnet-2](../nodes/devnet-2.md#quick-sync-with-snapshot)

### Start the Celestia-App with SystemD

SystemD is a daemon service useful for running applications as background processes.

Create Celestia-App systemd file:

```sh
sudo tee <<EOF >/dev/null /etc/systemd/system/celestia-appd.service
[Unit]
Description=celestia-appd Cosmos daemon
After=network-online.target

[Service]
User=$USER
ExecStart=$HOME/go/bin/celestia-appd start
Restart=on-failure
RestartSec=3
LimitNOFILE=4096

[Install]
WantedBy=multi-user.target
EOF
```

If the file was created successfully you will be able to see its content:

```sh
cat /etc/systemd/system/celestia-appd.service
```

Now, download the address book. You have 2 options:

```sh
wget -O $HOME/.celestia-app/config/addrbook.json "https://raw.githubusercontent.com/maxzonder/celestia/main/addrbook.json"
```

OR

```sh
wget -O $HOME/.celestia-app/config/addrbook.json "https://raw.githubusercontent.com/qubelabsio/celestia/main/addrbook.json"
```

Enable and start celestia-appd daemon:

```sh
sudo systemctl enable celestia-appd
sudo systemctl start celestia-appd
```

Check if daemon has been started correctly:

```sh
sudo systemctl status celestia-appd
```

Check daemon logs in real time:

```sh
sudo journalctl -u celestia-appd.service -f
```

To check if your node is in sync before going forward:

```sh
curl -s localhost:26657/status | jq .result | jq .sync_info
```

Make sure that you have `"catching_up": false`, otherwise leave it running
until it is in sync.

### Wallet

#### Create a Wallet

You can pick whatever wallet name you want. For our example we used
“validator” as the wallet name:

```sh
celestia-appd keys add validator
```

Save the mnemonic output as this is the only way to recover your validator
wallet in case you lose it!

#### Fund a Wallet

For the public celestia address, you can fund the previously created wallet via
Discord by sending this message to #faucet channel:

```text
!faucet celes1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Wait to see if you get a confirmation that the tokens have been successfully
sent. To check if tokens have arrived successfully to the destination wallet
run the command below replacing the public address with your own:

```sh
celestia-appd q bank balances celes1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Delegate Stake to a Validator

If you want to delegate more stake to any validator, including your own you
will need the `celesvaloper` address of the validator in question. You can
either check it using the block explorer mentioned above or you can run the
command below to get the `celesvaloper` of your local validator wallet in
case you want to delegate more to it:

```sh
celestia-appd keys show $VALIDATOR_WALLET --bech val -a
```

After entering the wallet passphrase you should see a similar output:

```sh
Enter keyring passphrase:
celesvaloper1q3v5cugc8cdpud87u4zwy0a74uxkk6u43cv6hd
```

Next, select the network you want to use to delegate to a validator:

* [Devnet-2](../nodes/devnet-2.md#delegate-to-a-validator)

## Deploy the Celestia Node

This section describes part 2 of Celestia Bridge Node setup: running a
Celestia Node daemon.

### Install Celestia Node

Install the Celestia Node binary, which will be used to run the Bridge Node.

```sh
cd $HOME
rm -rf celestia-node
git clone https://github.com/celestiaorg/celestia-node.git
cd celestia-node/
APP_VERSION=$(curl -s \
  https://api.github.com/repos/celestiaorg/celestia-node/releases/latest \
  | jq -r ".tag_name")
git checkout tags/$APP_VERSION -b $APP_VERSION
make install
```

Verify that the binary is working and check the version with `celestia version` command:

```sh
$ celestia version
Semantic version: v0.2.0
Commit: 1fcf0c0bb5d5a4e18b51cf12440ce86a84cf7a72
Build Date: Fri 04 Mar 2022 01:15:07 AM CET
System version: amd64/linux
Golang version: go1.17.5
```

### Get the trusted hash

> Caveat: You need a running celestia-app in order to continue this guideline.
  Please refer to
  [celestia-app.md](https://github.com/celestiaorg/networks/celestia-app.md)
  for installation.  

You need to have the trusted server to initialize the Bridge Node. You can use
`http://localhost:26657` for your local run of `celestia-app`. The trusted hash
is an optional flag and does not need to be used. If you are not passing it,
the Bridge Node will just sync from the beginning, which is also the preferred
option of how to run it.

An example of how to query your local celestia-app to get the trusted hash:

```sh
curl -s http://localhost:26657/block?height=1 | grep -A1 block_id | grep hash
```

### Initialize the Bridge Node

```sh
celestia bridge init --core.remote <ip:port of celestia-app>
```

If you want to use the trusted hash anyways, here is how to initialize it:

```shell
celestia bridge init --core.remote <ip:port of celestia-app> \
--headers.trusted-hash <hash_from_celestia_app>
```

Example:

```sh
celestia bridge init --core.remote tcp://127.0.0.1:26657 --headers.trusted-hash 4632277C441CA6155C4374AC56048CF4CFE3CBB2476E07A548644435980D5E17
```

### Configure the Bridge Node

To configure your Bridge Node to connect to your network of choice,
select one of the networks you would like to connect to from this list and
follow the instructions there before proceeding with the rest of this guide:

* [Devnet-2](../nodes/devnet-2.md#configure-the-bridge-node)

### Start the Bridge Node with SystemD

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
  This is **needed for future Light Node** connections and communication
  between Celestia Bridge Nodes  

Example:

```sh
/ip4/46.101.22.123/tcp/2121/p2p/12D3KooWD5wCBJXKQuDjhXFjTFMrZoysGVLtVht5hMoVbSLCbV22
```

You should be seeing logs coming through of the bridge node syncing.

You have successfully set up a bridge node that is syncing with the network.

If you want to next run a validator node, read the following tutorial [here](../nodes/validator-node.md).

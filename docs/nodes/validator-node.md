# Setting Up A Celestia Validator Node

Validator nodes allow you to participate in consensus in the Celestia network.

## Hardware Requirements

The following hardware minimum requirements are recommended for running the
validator node:

* Memory: 8 GB RAM
* CPU: Quad-Core
* Disk: 250 GB SSD Storage
* Bandwidth: 1 Gbps for Download/100 Mbps for Upload

## Setting Up Your Validator Node

The following tutorial is done on an Ubuntu Linux 20.04 (LTS) x64
instance machine.

### Setup The Dependencies

Follow the instructions on installing the dependencies [here](../../developers/environment).

## Deploying The Celestia App

This section describes part 1 of Celestia Validator Node setup:
running a Celestia App daemon with an internal Celestia Core node.

> Note: Make sure you have at least 100+ Gb of free space to safely install+run
  the Validator Node.  

### Install Celestia App

Follow the tutorial on installing Celestia App [here](../../developers/celestia-app).

### Setup the P2P Networks

For this section of the guide, select the network you want to connect to:

* [Mamaki](mamaki-testnet#setup-p2p-network)

After that, you can proceed with the rest of the tutorial.

### Configure Pruning

For lower disk space usage we recommend setting up pruning using the
configurations below. You can change this to your own pruning configurations
if you want:

```sh
PRUNING="custom"
PRUNING_KEEP_RECENT="100"
PRUNING_INTERVAL="10"

sed -i -e "s/^pruning *=.*/pruning = \"$PRUNING\"/" $HOME/.celestia-app/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \
\"$PRUNING_KEEP_RECENT\"/" $HOME/.celestia-app/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \
\"$PRUNING_INTERVAL\"/" $HOME/.celestia-app/config/app.toml
```

### Configure Validator Mode

```sh
sed -i.bak -e "s/^mode *=.*/mode = \"validator\"/" $HOME/.celestia-app/config/config.toml
```

### Reset Network

This will delete all data folders so we can start fresh:

```sh
celestia-appd tendermint unsafe-reset-all --home $HOME/.celestia-app
```

### Optional: Quick-Sync with Snapshot

Syncing from Genesis can take a long time, depending on your hardware. Using
this method you can synchronize your Celestia node very quickly by downloading
a recent snapshot of the blockchain. If you would like to sync from the Genesis,
then you can skip this part.

If you want to use snapshot, determine the network you would like to sync
to from the list below:

* [Mamaki](mamaki-testnet#quick-sync-with-snapshot)

### Start the Celestia-App with SystemD

Follow the tutorial on setting up Celestia-App as a background process
with SystemD [here](systemd#start-the-celestia-app-with-systemd).

### Wallet

Follow the tutorial on creating a wallet [here](../../developers/wallet).

### Delegate Stake to a Validator

Create an environment variable for the address:

```sh
VALIDATOR_WALLET=<validator-address>
```

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

* [Mamaki](mamaki-testnet#delegate-to-a-validator)

## Deploy the Celestia Node

This section describes part 2 of Celestia Validator Node setup: running a
Celestia Bridge Node daemon.

### Install Celestia Node

You can follow the tutorial for installing Celestia Node [here](../../developers/celestia-node)

### Initialize the Bridge Node

Run the following:

```sh
celestia bridge init --core.remote <ip:port of celestia-app> \
  --core.grpc <ip:port>
```

If you need a list of RPC endpoints to connect to, you can check from the list [here](mamaki-testnet#rpc-endpoints)

### Run the Bridge Node

Run the following:

```sh
celestia bridge start
```

### Optional: Start the Bridge Node with SystemD

Follow the tutorial on setting up the bridge node as a background process with
SystemD [here](systemd#celestia-bridge-node).

You have successfully set up a bridge node that is syncing with the network.

## Run a Validator Node

After completing all the necessary steps, you are now ready to run a validator!
In order to create your validator on-chain, follow the instructions below.
Keep in mind that these steps are necessary ONLY if you want to participate
in the consensus.

Pick a `moniker` name of your choice! This is the validator name that will show
up on public dashboards and explorers. `VALIDATOR_WALLET` must be the same you
defined previously. Parameter `--min-self-delegation=1000000` defines the
amount of tokens that are self delegated from your validator wallet.

Now, connect to the network of your choice.

You have the following option of connecting to list of networks shown below:

* [Mamaki](mamaki-testnet#connect-validator)

Complete the instructions in the respective network you want to validate in
to complete the validator setup process.

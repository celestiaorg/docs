---
sidebar_label: Validator node
description: A tutorial for setting up a Celestia validator node.
---

# Setting up a Celestia validator node

Validator nodes allow you to participate in consensus in the Celestia network.

![Validator Node](../../static/img/nodes/validator.png)

## Hardware requirements

The following hardware minimum requirements are recommended for running the
validator node:

* Memory: **8 GB RAM**
* CPU: **6 cores**
* Disk: **500 GB SSD Storage**
* Bandwidth: **1 Gbps for Download/1 Gbps for Upload**

## Setting up your validator node

The following tutorial is done on an Ubuntu Linux 20.04 (LTS) x64
instance machine.

### Setup the dependencies

Follow the instructions on installing the dependencies [here](./environment.mdx).

### Install celestia-app

Follow the tutorial on installing `celestia-app` [here](./celestia-app.mdx).

### Setup the P2P networks

Now we will setup the P2P Networks by cloning the networks repository:

```sh
cd $HOME
rm -rf networks
git clone https://github.com/celestiaorg/networks.git
```

To initialize the network pick a "node-name" that describes your
node. The --chain-id parameter we are using here is `mocha-3`. Keep in
mind that this might change if a new testnet is deployed.

```sh
celestia-appd init "node-name" --chain-id mocha-3
```

Copy the `genesis.json` file. For mocha we are using:

```sh
cp $HOME/networks/mocha/genesis.json $HOME/.celestia-app/config
```

Set seeds and peers:

<!-- markdownlint-disable MD013 -->
```sh
SEEDS="some seeds"
PEERS="some peers"
sed -i -e 's|^seeds *=.*|seeds = "'$SEEDS'"|; s|^persistent_peers *=.*|persistent_peers = "'$PEERS'"|' $HOME/.celestia-app/config/config.toml
sed -i -e "s/^seed_mode *=.*/seed_mode = \"$SEED_MODE\"/" $HOME/.celestia-app/config/config.toml
```
<!-- markdownlint-enable MD013 -->

Note: You can find more peers [here](https://github.com/celestiaorg/networks/blob/master/mocha/peers.txt).

### Configure pruning

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

### Syncing

By default, a consensus node will sync using block sync; that is request, validate
and execute every block up to the head of the blockchain. This is the most secure
mechanism yet the slowest (taking up to days depending on the height of the blockchain).

There are two alternatives for quicker syncing.

#### State sync

State sync uses light client verification to verify state snapshots from peers
and then apply them. State sync relies on weak subjectivity; a trusted header
(specifically the hash and height) must be provided. This can be found by querying
a trusted RPC endpoint (/block). RPC endpoints are also required for retrieving
light blocks. These can be found in the docs here under the respective networks or
from the [chain-registry](https://github.com/cosmos/chain-registry).

In `$HOME/.celestia-app/config/config.toml`, set

```toml
rpc_servers = ""
trust_height = 0
trust_hash = ""
```

to their respective fields. At least two different rpc endpoints should be provided.
The more, the greater the chance of detecting any fraudulent behavior.

Once setup, you should be ready to start the node as normal. In the logs, you should
see: `Discovering snapshots`. This may take a few minutes before snapshots are found
depending on the network topology.

#### Quick sync

Quick sync effectively downloads the entire `data` directory from a third-party provider
meaning the node has all the application and blockchain state as the node it was
copied from.

````mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="network">
<TabItem value="mocha" label="Mocha">

Run the following command to quick-sync from a snapshot for `mocha`:

```sh
cd $HOME
rm -rf ~/.celestia-app/data
mkdir -p ~/.celestia-app/data
SNAP_NAME=$(curl -s https://snaps.qubelabs.io/celestia/ | \
    egrep -o ">mocha-3.*tar" | tr -d ">")
wget -O - https://snaps.qubelabs.io/celestia/${SNAP_NAME} | tar xf - \
    -C ~/.celestia-app/data/
```

</TabItem>
<TabItem value="blockspacerace" label="Blockspace Race">

Run the following command to quick-sync from a snapshot for `blockspacerace`:

```sh
cd $HOME
rm -rf ~/.celestia-app/data
mkdir -p ~/.celestia-app/data
SNAP_NAME=$(curl -s https://snaps.qubelabs.io/celestia/ | \
    egrep -o ">blockspacerace.*tar" | tr -d ">")
wget -O - https://snaps.qubelabs.io/celestia/${SNAP_NAME} | tar xf - \
    -C ~/.celestia-app/data/
```

</TabItem>
</Tabs>
````

### Start the celestia-app

In order to start your validator node, run the following:

:::tip
Please refer to the [ports](../../nodes/celestia-node/#ports)
section for information on which ports are
required to be open on your machine.
:::

```sh
celestia-appd start
```

Follow the tutorial on setting up `celestia-app` as a background process
with SystemD [here]( ../systemd).

### Wallet

Follow the tutorial on creating a wallet [here](../developers/celestia-app-wallet.md).

### Delegate stake to a validator

Create an environment variable for the address:

```sh
VALIDATOR_WALLET=<validator-wallet-name>
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

To delegate tokens to the `celestiavaloper` validator, as an
example you can run:

```sh
celestia-appd tx staking delegate \
    celestiavaloper1q3v5cugc8cdpud87u4zwy0a74uxkk6u4q4gx4p 1000000utia \
    --from=$VALIDATOR_WALLET --chain-id=mocha
```

If successful, you should see a similar output as:

```console
code: 0
codespace: ""
data: ""
gas_used: "0"
gas_wanted: "0"
height: "0"
info: ""
logs: []
raw_log: '[]'
timestamp: ""
tx: null
txhash: <tx-hash>
```

You can check if the TX hash went through using the block explorer by
inputting the `txhash` ID that was returned.

## Optional: Deploy the Celestia Node

Running a bridge node is critical to the Celestia network as it enables
the data availability and consensus nodes to communicate with one
another. It is recommended to support the data availability network,
but is not required for `celestia-app`.

If you are not running a bridge node, you can skip to
[Run a validator node](#run-a-validator-node).

This section describes part 2 of Celestia Validator Node setup: running a
Celestia Bridge Node daemon.

### Install Celestia Node

You can follow the tutorial for installing `celestia-node` [here](./celestia-node.mdx)

### Initialize the bridge node

Run the following:

```sh
celestia bridge init --core.ip <ip-address>
```

:::tip
Please refer to the [ports](../../nodes/celestia-node/#ports)
section for information on which ports are
required to be open on your machine.
:::

If you need a list of RPC endpoints to connect to, you can check from the list [here](../mocha-testnet#rpc-endpoints)

### Run the bridge node

Run the following:

```sh
celestia bridge start
```

### Optional: start the bridge node with SystemD

Follow the tutorial on setting up the bridge node as a background process with
SystemD [here](../systemd).

You have successfully set up a bridge node that is syncing with the network.

### Setup QGB keys

This step helps get you prepared for when the Quantum Gravity Bridge
is enabled. You would still need to go through this step
before running a validator to configure an extra key.

* `--evm-address`: This flag should contain a `0x` EVM address. Here,
  you can add any Ethereum-based address to this flag. You can also modify
  it later if you decide to switch addresses.

You can set this value to the above flag as an
environment variable:

```sh
EVM_ADDRESS=<EVM_ADDRESS>
```

Remember to add the value for your address in the above
environment variable before setting it.

## Run a validator node

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

Continuing the Validator tutorial, here are the steps to connect your
validator to Mocha:

```sh
MONIKER="your_moniker"
VALIDATOR_WALLET="validator"

celestia-appd tx staking create-validator \
    --amount=1000000utia \
    --pubkey=$(celestia-appd tendermint show-validator) \
    --moniker=$MONIKER \
    --chain-id=mocha \
    --commission-rate=0.1 \
    --commission-max-rate=0.2 \
    --commission-max-change-rate=0.01 \
    --min-self-delegation=1000000 \
    --from=$VALIDATOR_WALLET \
    --evm-address=$EVM_ADDRESS \
    --keyring-backend=test
```

You will be prompted to confirm the transaction:

```console
confirm transaction before signing and broadcasting [y/N]: y
```

Inputting `y` should provide an output similar to:

```console
code: 0
codespace: ""
data: ""
gas_used: "0"
gas_wanted: "0"
height: "0"
info: ""
logs: []
raw_log: '[]'
timestamp: ""
tx: null
txhash: <tx-hash>
```

You should now be able to see your validator from a block explorer like [here](https://celestia.explorers.guru)

## Run the QGB Orchestrator

Now that the QGB will be enabled for Blockspace Race (BSR), all validators
will need to run the QGB orchestrator to be able to sign attestations.
To run it, please check the docs [here](https://docs.celestia.org/nodes/qgb-orchestrator/#how-to-run).

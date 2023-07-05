---
sidebar_label: Full consensus node
description: Learn how to set up a Celestia full consensus node.
---

# Setting up a Celestia full consensus node

<!-- markdownlint-disable MD013 -->

Full Consensus Nodes allow you to sync blockchain history in the Celestia
Consensus Layer.

![Full Consensus Node](../../static/img/nodes/full-consensus-node.png)

## Hardware requirements

The following hardware minimum requirements are recommended for running the
Full Consensus Nodes:

* Memory: **8 GB RAM**
* CPU: **Quad-Core**
* Disk: **250 GB SSD Storage**
* Bandwidth: **1 Gbps for Download/1 Gbps for Upload**

## Setting up a full consensus node

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

````mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="network">
<TabItem value="mocha" label="Mocha">

To initialize the network pick a "node-name" that describes your
node. The --chain-id parameter we are using here is `mocha`. Keep in
mind that this might change if a new testnet is deployed.

```sh
celestia-appd init "node-name" --chain-id mocha
```

Copy the `genesis.json` file. For mocha we are using:

```sh
cp $HOME/networks/mocha/genesis.json $HOME/.celestia-app/config
```

Set seeds and peers:

```sh
PERSISTENT_PEERS=$(curl -sL https://raw.githubusercontent.com/celestiaorg/networks/master/mocha/peers.txt | tr -d '\n')
echo $PERSISTENT_PEERS
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PERSISTENT_PEERS\"/" $HOME/.celestia-app/config/config.toml
```

Note: You can find more peers [here](https://github.com/celestiaorg/networks/blob/master/mocha/peers.txt).

</TabItem>
<TabItem value="blockspacerace" label="Blockspace Race">

To initialize the network pick a "node-name" that describes your
node. The --chain-id parameter we are using here is `blockspacerace-0`. Keep in
mind that this might change if a new testnet is deployed.

```sh
celestia-appd init "node-name" --chain-id blockspacerace-0
```

Copy the `genesis.json` file. For blockspacerace we are using:

```sh
cp $HOME/networks/blockspacerace/genesis.json $HOME/.celestia-app/config
```

Set seeds and peers:

```sh
PERSISTENT_PEERS=$(curl -sL https://raw.githubusercontent.com/celestiaorg/networks/master/blockspacerace/peers.txt | tr -d '\n')
echo $PERSISTENT_PEERS
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PERSISTENT_PEERS\"/" $HOME/.celestia-app/config/config.toml
```

Note: You can find more peers [here](https://github.com/celestiaorg/networks/blob/master/blockspacerace/peers.txt).

</TabItem>
</Tabs>
````

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

### Reset network

This will delete all data folders so we can start fresh:

```sh
celestia-appd tendermint unsafe-reset-all --home $HOME/.celestia-app
```

:::tip
Please refer to the [ports](../../nodes/celestia-node/#ports) section for information on
which ports are required to be open on your machine.
:::

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

In order to start your full consensus node, run the following:

```sh
celestia-appd start
```

Follow the tutorial on setting up Celestia App as a background process
with SystemD [here](./systemd.md).

:::tip
Please refer to the [ports](../../nodes/celestia-node/#ports) section for information on
which ports are required to be open on your machine.
:::

### Optional: configure for RPC endpoint

You can configure your Full Consensus Node to be a public RPC endpoint
and listen to any connections from Data Availability Nodes in order to
serve requests for the Data Availability API [here](../developers/node-tutorial.mdx).

Run the following commands:

<!-- markdownlint-disable MD013 -->
```sh
EXTERNAL_ADDRESS=$(wget -qO- eth0.me)
sed -i.bak -e "s/^external_address = \"\"/external_address = \"$EXTERNAL_ADDRESS:26656\"/" $HOME/.celestia-app/config/config.toml
sed -i 's#"tcp://127.0.0.1:26657"#"tcp://0.0.0.0:26657"#g' ~/.celestia-app/config/config.toml
```
<!-- markdownlint-enable MD013 -->

Restart `celestia-appd` in the previous step to load those configs.

## Transaction indexer configuration options

This section will show you how to set your `config.toml` file in `celestia-app`
to chose which transactions to index. In some
cases, a node operator will be able to decide which transactions to index
based on configuration set in the application.

The options are:

1. `null`
2. `kv` (default) - the simplest possible indexer backed by key-value storage
(defaults to levelDB; see DBBackend)
   1. when `kv` is chosen `tx.height` and `tx.hash` will always be indexed
3. `psql` - the indexer services backed by PostgreSQL
   1. when `kv` or `psql` is chosen, `tx.height` and `tx.hash` will always be indexed

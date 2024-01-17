---
description: Learn how to set up a Celestia consensus node.
outline: deep
---

# Setting up a Celestia full consensus node

<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD013 -->
<script setup>
import constants from '/.vitepress/constants/constants.js'
</script>

This guide covers how to set up a full consensus node or a validator node on
Celestia.
Full consensus nodes allow you to sync blockchain history in the Celestia
consensus layer.

![full consensus node](/img/nodes/full-consensus-node.png)

[[toc]]

## Hardware requirements

The following hardware minimum requirements are recommended for running a
full consensus node:

- Memory: **8 GB RAM**
- CPU: **Quad-Core**
- Disk: **250 GB SSD Storage**
- Bandwidth: **1 Gbps for Download/1 Gbps for Upload**

Running a full consensus node requires significant storage capacity to store the
entire blockchain history. As of the latest recommendation, it is advisable to
have at least 250 GB of SSD storage for a Celestia full consensus node if you
are using pruning. If you are not using pruning, you are running an archive
node, and it is recommended to have 500 GB of SSD storage. Please ensure that
your storage meets this requirement to ensure smooth syncing and operation of
the node.

## Setting up a full consensus node

The following tutorial is done on an Ubuntu Linux 20.04 (LTS) x64
instance machine.

### Setup the dependencies

Follow the instructions on [installing dependencies](./environment.md).

### Install celestia-app

Follow the tutorial on [installing `celestia-app`](./celestia-app.md).

### Setup the P2P networks

Now we will setup the P2P Networks by cloning the networks repository:

```sh
cd $HOME
rm -rf networks
git clone https://github.com/celestiaorg/networks.git
```

To initialize the network pick a "node-name" that describes your
node. Keep in mind that this might change if a new testnet is deployed.

::: code-group

```bash-vue [Mainnet Beta]
celestia-appd init "node-name" --chain-id {{constants.mainnetChainId}}
```

```bash-vue [Mocha]
celestia-appd init "node-name" --chain-id {{constants.mochaChainId}}
```

```bash-vue [Arabica]
celestia-appd init "node-name" --chain-id {{constants.arabicaChainId}}
```

:::

Copy the `genesis.json` file:

::: code-group

```bash-vue [Mainnet Beta]
cp $HOME/networks/{{constants.mainnetChainId}}/genesis.json \
    $HOME/.celestia-app/config
```

```bash-vue [Mocha]
cp $HOME/networks/{{constants.mochaChainId}}/genesis.json \
    $HOME/.celestia-app/config
```

```bash-vue [Arabica]
cp $HOME/networks/{{constants.arabicaChainId}}/genesis.json \
    $HOME/.celestia-app/config
```

:::

Set seeds in the `$HOME/.celestia-app/config/config.toml` file:

::: code-group

```bash-vue [Mainnet Beta]
SEEDS=$(curl -sL https://raw.githubusercontent.com/celestiaorg/networks/master/{{constants.mainnetChainId}}/seeds.txt | head -c -1 | tr '\n' ',')
echo $SEEDS
sed -i.bak -e "s/^seeds *=.*/seeds = \"$SEEDS\"/" $HOME/.celestia-app/config/config.toml
```

```bash-vue [Mocha]
SEEDS=$(curl -sL https://raw.githubusercontent.com/celestiaorg/networks/master/{{constants.mochaChainId}}/seeds.txt | head -c -1 | tr '\n' ',')
echo $SEEDS
sed -i.bak -e "s/^seeds *=.*/seeds = \"$SEEDS\"/" $HOME/.celestia-app/config/config.toml
```

```bash-vue [Arabica]
# For Arabica, you can set seeds manually in the
# `$HOME/.celestia-app/config/config.toml` file:
# Comma separated list of seed nodes to connect to
seeds = ""
```

:::

**Optionally**, you can set persistent peers in your `config.toml` file.
You can get the persistent peers from the networks repository with
the following commands:

Setting persistent peers is advised only if you are running a sentry node.

::: code-group

```bash-vue [Mainnet Beta]
PERSISTENT_PEERS=$(curl -sL https://raw.githubusercontent.com/celestiaorg/networks/master/{{constants.mainnetChainId}}/peers.txt | head -c -1 | tr '\n' ',')
echo $PERSISTENT_PEERS
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PERSISTENT_PEERS\"/" $HOME/.celestia-app/config/config.toml
```

```bash-vue [Mocha]
PERSISTENT_PEERS=$(curl -sL https://raw.githubusercontent.com/celestiaorg/networks/master/{{constants.mochaChainId}}/peers.txt | head -c -1 | tr '\n' ',')
echo $PERSISTENT_PEERS
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PERSISTENT_PEERS\"/" $HOME/.celestia-app/config/config.toml
```

```bash-vue [Arabica]
PERSISTENT_PEERS=$(curl -sL https://raw.githubusercontent.com/celestiaorg/networks/master/{{constants.arabicaChainId}}/peers.txt | head -c -1 | tr '\n' ',')
echo $PERSISTENT_PEERS
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PERSISTENT_PEERS\"/" $HOME/.celestia-app/config/config.toml
```

:::

:::tip
Mac users' built-in `head` command does not accept negative numbers for `-c` flag.
Solution is to install `coreutils` package and use `ghead` command from it.

```bash
brew install coreutils
```

and optionally set alias from `head` to `ghead` in shell config (`~/.bashrc`, `~/.zshrc` etc):

```sh
alias head=ghead
```

:::

## Storage and pruning configurations

### Connecting a consensus node to a bridge node

If your consensus node is being connected to a celestia-node bridge node,
you will need to enable transaction indexing and retain all block
data. This can be achieved with the following settings in your `config.toml`.

#### Enable transaction indexing

```toml
indexer = "kv"
```

#### Retain all block data

And in your `app.toml`, `min-retain-blocks` should remain as the default
setting of `0`:

```toml
min-retain-blocks = 0 # retain all block data, this is default setting
```

### Querying transactions by hash

If you want to query transactions using their hash, transaction
indexing must be turned on. Set the `indexer` to `"kv"` in your `config.toml`:

```toml
indexer = "kv"
```

### Accessing historical state

If you want to query the historical state — for example, you might want
to know the balance of a Celestia wallet at a given height in the past —
you should run an archive node with `pruning = "nothing"` in your `app.toml`.
Note that this configuration is resource-intensive and will require
significant storage:

```toml
pruning = "nothing"
```

### Saving on storage requirements

If you want to save on storage requirements, consider using
`pruning = "everything"` in your `app.toml` to prune everything. If you
select `"everything"` or `"default"`, but still want to keep the block data,
you can do so by not changing the default value of
`min-retain-blocks = 0` in your `app.toml`. A value of `0` for
`min-retain-blocks` will keep all block data. This will prune snapshots of
the state, but it will keep block data:

```toml
pruning = "everything"
min-retain-blocks = 0 # this is the default setting
```

## Syncing

By default, a consensus node will sync using block sync; that is request, validate
and execute every block up to the head of the blockchain. This is the most secure
mechanism yet the slowest (taking up to days depending on the height of the blockchain).

There are two alternatives for quicker syncing.

### State sync

State sync uses light client verification to verify state snapshots from peers
and then apply them. State sync relies on weak subjectivity; a trusted header
(specifically the hash and height) must be provided. This can be found by querying
a trusted RPC endpoint (/block). RPC endpoints are also required for retrieving
light blocks. These can be found in the docs here under the respective networks or
from [the chain-registry](https://github.com/cosmos/chain-registry).

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

### Quick sync

Quick sync effectively downloads the entire `data` directory from a third-party provider
meaning the node has all the application and blockchain state as the node it was
copied from.

Run the following command to quick-sync from a snapshot:

::: code-group

```bash-vue [Mainnet Beta]
cd $HOME
rm -rf ~/.celestia-app/data
mkdir -p ~/.celestia-app/data
SNAP_NAME=$(curl -s https://snaps.qubelabs.io/celestia/ | \
    egrep -o ">{{constants.mainnetChainId}}.*tar" | tr -d ">")
wget -O - https://snaps.qubelabs.io/celestia/${SNAP_NAME} | tar xf - \
    -C ~/.celestia-app/data/
```

```bash-vue [Mocha]
cd $HOME
rm -rf ~/.celestia-app/data
mkdir -p ~/.celestia-app/data
SNAP_NAME=$(curl -s https://snaps.qubelabs.io/celestia/ | \
    egrep -o ">{{constants.mochaChainId}}.*tar" | tr -d ">")
wget -O - https://snaps.qubelabs.io/celestia/${SNAP_NAME} | tar xf - \
    -C ~/.celestia-app/data/
```

```bash-vue [Arabica]
cd $HOME
rm -rf ~/.celestia-app/data
mkdir -p ~/.celestia-app/data
SNAP_NAME=$(curl -s https://snaps.qubelabs.io/celestia/ | \
    egrep -o ">{{constants.arabicaChainId}}.*tar" | tr -d ">")
wget -O - https://snaps.qubelabs.io/celestia/${SNAP_NAME} | tar xf - \
    -C ~/.celestia-app/data/
```

:::

## Start the consensus node

In order to start your full consensus node, run the following:

```sh
celestia-appd start
```

Optional: If you would like celestia-app to run as a background process, you can follow the [SystemD tutorial](./systemd.md).

:::tip
Refer to
[the ports section of the celestia-node troubleshooting page](../nodes/celestia-node-troubleshooting.md#ports)
for information on which ports are required to be open on your machine.
:::

## Optional: Set up a validator

Validator nodes allow you to participate in consensus in the Celestia network. Validators have multiple responsibilities, including:

1. Running the latest recommended version of software
1. Maintaining high uptime
1. Participating in on-chain governance

Validators are recommended (but not required) to run additional software to support Celestia:

1. A bridge node
1. A Blobstream orchestrator

![validator node](/img/nodes/validator.png)

### Validator hardware requirements

The following hardware minimum requirements are recommended for running a
validator node:

- Memory: **8 GB RAM**
- CPU: **6 cores**
- Disk: **500 GB SSD Storage**
- Bandwidth: **1 Gbps for Download/1 Gbps for Upload**

The following tutorial is done on an Ubuntu Linux 20.04 (LTS) x64
instance machine.

### Prerequisites

1. Set up a full consensus node by following the instructions in [the previous section](#setting-up-a-full-consensus-node).
1. [Create a wallet with celestia-app](../developers/celestia-app-wallet.md)

### Delegate stake to a validator

Create an environment variable for the address:

```bash
VALIDATOR_WALLET=<validator-wallet-name>
```

If you want to delegate more stake to any validator, including your own you
will need the `celesvaloper` address of the validator in question. You can run
the command below to get the `celesvaloper` of your local validator wallet in
case you want to delegate more to it:

```bash
celestia-appd keys show $VALIDATOR_WALLET --bech val -a
```

After entering the wallet passphrase you should see a similar output:

```bash
Enter keyring passphrase:
celesvaloper1q3v5cugc8cdpud87u4zwy0a74uxkk6u43cv6hd
```

To delegate tokens to the `celestiavaloper` validator, as an
example you can run:

```bash-vue
celestia-appd tx staking delegate \
celestiavaloper1q3v5cugc8cdpud87u4zwy0a74uxkk6u4q4gx4p 1000000utia \
--from=$VALIDATOR_WALLET --chain-id={{constants.mochaChainId}} \
--fees=21000utia
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

### Run the validator node

In order to start your validator node, run the following:

```bash
celestia-appd start
```

After completing all the necessary steps, you are now ready to run a validator!
In order to create your validator onchain, follow the instructions below.
Keep in mind that these steps are necessary ONLY if you want to participate
in the consensus.

Pick a `moniker` name of your choice! This is the validator name that will show
up on public dashboards and explorers. `VALIDATOR_WALLET` must be the same you
defined previously. Parameter `--min-self-delegation=1000000` defines the
amount of tokens that are self delegated from your validator wallet.

Now, connect to the network of your choice.

You have the following option of connecting to list of networks shown below:

Continuing the validator tutorial, here are the steps to connect your
validator to Mocha:

```bash-vue
MONIKER="your_moniker"
VALIDATOR_WALLET="validator"

celestia-appd tx staking create-validator \
    --amount=1000000utia \
    --pubkey=$(celestia-appd tendermint show-validator) \
    --moniker=$MONIKER \
    --chain-id={{constants.mochaChainId}} \
    --commission-rate=0.1 \
    --commission-max-rate=0.2 \
    --commission-max-change-rate=0.01 \
    --min-self-delegation=1000000 \
    --from=$VALIDATOR_WALLET \
    --keyring-backend=test \
    --fees=21000utia \
    --gas=220000
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

### Submit your validator information

After starting your node, please submit your node as a seed and peer to the
[networks repository](https://github.com/celestiaorg/networks).

### Optional: Run a bridge node

Bridge nodes are critical to the Celestia network because they enable
the data availability and consensus nodes to communicate with one
another.

Validators are recommended (but not required) to run a bridge node. This section
describes how to run a bridge node.

#### Install celestia-node

You can [follow the tutorial for installing `celestia-node`](./celestia-node.md)

#### Initialize the bridge node

Run the following:

```bash
celestia bridge init --core.ip <URI>
```

:::tip
Refer to
[the ports section of the celestia-node troubleshooting page](../../nodes/celestia-node-troubleshooting/#ports)
for information on which ports are required to be open on your machine.
:::

If you need a list of RPC endpoints to connect to, you can find the
[list on the Mocha testnet page](./mocha-testnet.md#rpc-endpoints) or
[list on the Arabica devnet page](./arabica-devnet.md#rpc-endpoints).

#### Run the bridge node

Run the following:

```bash
celestia bridge start
```

You have successfully set up a bridge node that is syncing with the network.

Optional: if you'd like to run the bridge node as a background process, see the [SystemD tutorial](../systemd).

### Optional: Run a Blobstream orchestrator

The Blobstream orchestrator enables validators to sign attestations.
Validators are recommended (but not required) to run a Blobstream orchestrator for both Mocha and Mainnet (when announced).

Refer to the Blobstream orchestrator [docs](https://docs.celestia.org/nodes/blobstream-orchestrator/#how-to-run)
to run one.

#### Set up Blobstream keys

First, prepare an EVM address with a private key that you have
access to. We will use it to register your validator's EVM address
[later in this page](#register-your-validators-evm-address).

#### Register your validator's EVM address {#register-your-validators-evm-address}

This section will cover how to register your validator's EVM address.
This is required to run an orchestrator.

To register your EVM address, run the following. Be sure to replace
`YOUR_EVM_ADDRESS` with your EVM address:

```bash
VALIDATOR_ADDRESS=$(celestia-appd keys show $VALIDATOR_WALLET --bech val -a)
EVM_ADDRESS="YOUR_EVM_ADDRESS"

celestia-appd tx qgb register \
    $VALIDATOR_ADDRESS \
    $EVM_ADDRESS \
    --from $VALIDATOR_WALLET \
    --fees 30000utia \
    -b block \
    -y &
```

You should now be able to see your validator from
[a block explorer](./mocha-testnet.md#explorers)

## Extra resources for consensus nodes

### Optional: Reset network

This will delete all data folders so we can start fresh:

```sh
celestia-appd tendermint unsafe-reset-all --home $HOME/.celestia-app
```

### Optional: Configuring an RPC endpoint

You can configure your full consensus node to be a public RPC endpoint.
This allows it to accept connections from data availability nodes and
serve requests for the data availability API.

#### Expose RPC

By default, the RPC service listens on `localhost` which means it can't
be accessed from other machines. To make the RPC service available publicly,
you need to bind it to a public IP or `0.0.0.0` (which means listening on all
available network interfaces).

You can do this by editing the config.toml file:

```sh
sed -i 's#"tcp://127.0.0.1:26657"#"tcp://0.0.0.0:26657"#g' ~/.celestia-app/config/config.toml
```

This command replaces the `localhost` IP address with `0.0.0.0`, making the
RPC service listen on all available network interfaces.

#### Note on `external-address`

The `external-address` field in the configuration is used when your node
is behind a NAT and you need to advertise a different address for peers
to dial. Populating this field is not necessary for making the RPC
endpoint public.

```sh
EXTERNAL-ADDRESS=$(wget -qO- eth0.me)
sed -i.bak -e "s/^external-address = ""/external-address = "$EXTERNAL-ADDRESS:26656"/" \
    $HOME/.celestia-app/config/config.toml
```

#### Restart the node

After making these changes, restart `celestia-appd` to load the new
configurations.

### Optional: Transaction indexer configuration options

This section guides you on how to configure your `config.toml`
file in `celestia-app` to select which transactions to index.
Depending on the application's configuration, a node operator
may decide which transactions to index.

The available options are:

1. `null`: This option disables indexing. If you don't need to
   query transactions, you can choose this option to save space.
2. `kv` (default): This is the simplest indexer, backed by
   key-value storage (defaults to levelDB; see DBBackend).
   When `kv` is chosen, `tx.height` and `tx.hash` will always be
   indexed. This option is suitable for basic queries on transactions.
3. `psql`: This indexer is backed by PostgreSQL. When psql is chosen,
   `tx.height` and `tx.hash` will always be indexed. This option is
   suitable for complex queries on transactions.

An example to set the value to `kv` in `config.toml` is:

```toml
indexer = "kv"
```

Remember to restart `celestia-appd` after making changes to the
configuration to load the new settings.

### Optional: Discard ABCI responses configuration

This section will guide you on how to configure your `config.toml` file in
`celestia-app` to manage the storage of ABCI responses. ABCI responses are
the results of executing transactions and are used for `/block_results` RPC
queries and to reindex events in the command-line tool.

The `discard_abci_responses` option allows you to control whether these
responses are persisted in the state store:

- `false` (default): ABCI responses are stored in the state store. This
  ensures that ABCI responses are available for `/block_results` RPC queries
  and for reindexing events. However, it can consume a significant amount
  of disk space.
- `true`: ABCI responses are not stored in the state store. This can
  save a considerable amount of disk space, but `/block_results` RPC queries
  and event reindexing will not be available.

An example to set the value to false in `config.toml` is:

```toml
discard_abci_responses = false
```

Remember to restart `celestia-appd` after making changes to the
configuration to load the new settings.

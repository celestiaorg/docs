---
description: Learn how to set up a Celestia consensus node.
---

# Setting up a Celestia full consensus node

<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD013 -->
<script setup>
import constants from '/.vitepress/constants/constants.js'
</script>

Full consensus nodes allow you to sync blockchain history in the Celestia
consensus layer.

![full consensus node](/img/nodes/full-consensus-node.png)

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

```bash-vue [Mocha]
celestia-appd init "node-name" --chain-id {{constants.mochaChainId}}
```

```bash-vue [Arabica]
celestia-appd init "node-name" --chain-id {{constants.arabicaChainId}}
```

:::

Copy the `genesis.json` file:

::: code-group

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

### Storage and pruning configurations

#### Recommendations per node type

Here are the summarized recommendations for each node type. There are more details on what each of these settings do after the reccomendations. Understanding what these settings do will help you make the best decision for your setup.

##### Validator node

The reccomendations here are assuming that the validator node is isolated from other responsiblities other than voting and proposing. It is optimized to store as little data as possible.

`config.toml`:

```toml
min-retain-blocks = "175000"
indexer = "null"
discard_abci_responses = "true"
```

`app.toml`:

```toml
pruning = "custom"
pruning-keep-recent = "100"
pruning-interval = "10"
snapshot-interval = 0
```

##### RPC node

RPC nodes are optimized to be useful for querying onchain data at the cost of significantly increased storage requirements.

`config.toml`:

```toml
min-retain-blocks = "0"
indexer = "kv" # or "psql"
discard_abci_responses = "false"
```

`app.toml`:

```toml
pruning = "default"
snapshot-interval = 1500
snapshot-keep-recent = 2
```

##### Archive node

Archive nodes prune nothing, retaining all data and have very large storage requirements.

`config.toml`:

```toml
min-retain-blocks = "0"
indexer = "psql" # or "kv
discard_abci_responses = "false"
```

`app.toml`:

```toml
pruning = "nothing"
```

##### Bridge node

The reccomendations here are assuming that the consensus node is responsible for servicing a celestia-node bridge node. It is optimized to do that and minimize storage requirements.

`config.toml`:

```toml
min-retain-blocks = "0"
indexer = "kv"
discard_abci_responses = "true"
```

`app.toml`:

```toml
pruning = "custom"
pruning-keep-recent = "100"
pruning-interval = "10"
snapshot-interval = 0
```

#### Historical state

Historical state can be used for state sync and for querying the state at a given height. The default values are to retain the last ~6 weeks worth of historical state.

```toml
# default: the last 362880 states are kept, pruning at 10 block intervals
# nothing: all historic states will be saved, nothing will be deleted (i.e. archiving node)
# everything: 2 latest states will be kept; pruning at 10 block intervals.
# custom: allow pruning options to be manually specified through 'pruning-keep-recent', and 'pruning-interval'
pruning = "default"

# These are applied if and only if the pruning strategy is custom.
pruning-keep-recent = "0"
pruning-interval = "0"
```

For lower disk space usage we recommend setting up pruning using the
configurations below in `$HOME/.celestia-app/config/app.toml`.
You can change this to your own pruning configurations
if you want:

```toml
pruning = "custom"
pruning-keep-recent = "100"
pruning-interval = "10"
```

#### Minimum height retention

The `min-retain-blocks` configuration can be used to in conjunction with the configurations above to set the pruning parameters and unbonding period to prune the state but retain the tendermint block data. For example, a node operator could set the `pruning` to `"everything"`, but set `min-retain-blocks` to something larger than the unbonding period (21 days aka ~150,000 blocks at 12s blocks) to prune all of the state but keep the last `min-retain-blocks` blocks of data. The default is currently to not prune block data, however future versions of `celestia-app` will prune values past few months by default.

```toml
# MinRetainBlocks defines the minimum block height offset from the current
# block being committed, such that all blocks past this offset are pruned
# from Tendermint. It is used as part of the process of determining the
# ResponseCommit.RetainHeight value during ABCI Commit. A value of 0 indicates
# that no blocks should be pruned.
#
# This configuration value is only responsible for pruning Tendermint blocks.
# It has no bearing on application state pruning which is determined by the
# "pruning-*" configurations.
#
# Note: Tendermint block pruning is dependant on this parameter in conunction
# with the unbonding (safety threshold) period, state pruning and state sync
# snapshot parameters to determine the correct minimum value of
# ResponseCommit.RetainHeight.
min-retain-blocks = 0
```

#### Transaction index

Transaction indexing adds additional references to each transaction using its hash. The current issue with this is that it at least doubles the amount of storage required since the node is storing the txs in the block data and the tx-index. The tx-indexing currently does not support pruning, so even if a transaction is pruned along with a block, the tx will remain in the index. By default, this value is set to `null`. For bridge or rpc nodes, this value should be configured to `kv`. Here is the snippet from the `config.toml` file:

```toml
[tx_index]

# What indexer to use for transactions
#
# The application will set which txs to index. In some cases a node operator will be able
# to decide which txs to index based on configuration set in the application.
#
# Options:
#   1) "null"
#   2) "kv" (default) - the simplest possible indexer, backed by key-value storage (defaults to levelDB; see DBBacken>
#               - When "kv" is chosen "tx.height" and "tx.hash" will always be indexed.
#   3) "psql" - the indexer services backed by PostgreSQL.
# When "kv" or "psql" is chosen "tx.height" and "tx.hash" will always be indexed.
indexer = "null"
```

#### Discard ABCI responses

ABCI responses are the results of executing transactions and are used for `/block_results` RPC queries. The `discard_abci_responses` option allows you to control whether these responses are persisted in the store. By default, this value is set to `false`. For bridge or rpc nodes, this value should be configured to `true`. Per the `config.toml` file:

```toml
# Set to true to discard ABCI responses from the state store, which can save a
# considerable amount of disk space. Set to false to ensure ABCI responses are
# persisted. ABCI responses are required for /block_results RPC queries, and to
# reindex events in the command-line tool.
discard_abci_responses = false
```

#### Compaction

Often, even after pruning data, the operating system will still see the old storage space as used still. This can be remedied by forcing compaction of the data base. This can be done by running the following command:

```sh
celestia-appd experimental-compact-goleveldb
```

Note that the node should probably be shut down before running the command to force compaction. Technically, it should work even if the node is on, however this is not yet tested properly.

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

#### Quick sync

Quick sync effectively downloads the entire `data` directory from a third-party provider
meaning the node has all the application and blockchain state as the node it was
copied from.

Run the following command to quick-sync from a snapshot:

::: code-group

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

### Start the consensus node

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

## Optional: Setting up a validator

### Setting up a Celestia validator node

Validator nodes allow you to participate in consensus in the Celestia network.

![validator node](/img/nodes/validator.png)

#### Validator hardware requirements

The following hardware minimum requirements are recommended for running a
validator node:

- Memory: **8 GB RAM**
- CPU: **6 cores**
- Disk: **500 GB SSD Storage**
- Bandwidth: **1 Gbps for Download/1 Gbps for Upload**

The following tutorial is done on an Ubuntu Linux 20.04 (LTS) x64
instance machine.

First, set up your full consensus node by following the instructions in
[the previous section](#setting-up-a-full-consensus-node).

#### Wallet

Follow [the tutorial on creating a wallet](../developers/celestia-app-wallet.md).

#### Delegate stake to a validator

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

### Optional: Deploy the celestia-node

Running a bridge node is critical to the Celestia network as it enables
the data availability and consensus nodes to communicate with one
another. It is recommended to support the data availability network,
but is not required for `celestia-app`.

If you are not running a bridge node, you can skip to
[run a validator node](#run-the-validator-node).

This section describes part 2 of Celestia validator node setup: running a
Celestia bridge node daemon.

#### Install celestia-node

You can [follow the tutorial for installing `celestia-node`](./celestia-node.md)

#### Initialize the bridge node

Run the following:

```bash
celestia bridge init --core.ip <ip-address>
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

#### Optional: start the bridge node with SystemD

Follow
[the tutorial on setting up the bridge node as a background process with SystemD](../systemd).

You have successfully set up a bridge node that is syncing with the network.

#### Setup Blobstream keys

First, prepare an EVM address with a private key that you have
access to. We will use it to register your validator's EVM address
[later in this page](#register-your-validators-evm-address).

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

### Register your validator's EVM address {#register-your-validators-evm-address}

This section will cover how to register your validator's EVM address.
This is required to run an orchestrator.

To register your EVM address, run the following. Be sure to replace
`YOUR_EVM_ADDRESS` with your EVM address:

```bash
VALIDATOR_ADDRESS=$(celestia-appd keys show $VALIDATOR_WALLET --bech val -a)
EVM_ADDRESS="YOUR_EVM_ADDRESS"

celestia-appd tx blobstream register \
    $VALIDATOR_ADDRESS \
    $EVM_ADDRESS \
    --from $VALIDATOR_WALLET \
    --fees 30000utia \
    -b block \
    -y &
```

You should now be able to see your validator from
[a block explorer](./mocha-testnet.md#explorers)

### Run a Blobstream orchestrator

Now that Blobstream will be enabled for Mocha, all validators
will need to run a Blobstream orchestrator to be able to sign attestations.
To run it, please
[refer to the documentation](https://docs.celestia.org/nodes/blobstream-orchestrator/#how-to-run).

### Submit your validator information

After starting your node, please submit your node as a seed and peer to the
[networks repository](https://github.com/celestiaorg/networks).

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

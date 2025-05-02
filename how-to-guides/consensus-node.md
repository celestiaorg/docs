---
description: Learn how to set up a Celestia consensus node.
outline: deep
---

# Consensus node

<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD013 -->
<script setup>
import constants from '/.vitepress/constants/constants.js'
</script>

This guide covers how to set up a consensus node on Celestia.
Consensus nodes allow you to sync the entire blockchain history in the Celestia
consensus layer.

![consensus node](/img/nodes/consensus-node.jpg)

## Minimum hardware requirements

See [hardware requirements](/how-to-guides/nodes-overview.md#recommended-celestia-node-requirements).

## Set up a consensus node

The following tutorial is done on an Ubuntu Linux 20.04 (LTS) x64
instance machine.

### Set up the dependencies

Follow the instructions on [installing dependencies](/how-to-guides/environment.md).

### Install celestia-app

Follow the tutorial on [installing `celestia-app`](/how-to-guides/celestia-app.md).

### Set up the P2P networks

To initialize the network, pick a "node-name" that describes your
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

Download the `genesis.json` file:

::: code-group

```bash-vue [Mainnet Beta]
celestia-appd download-genesis {{constants.mainnetChainId}}
```

```bash-vue [Mocha]
celestia-appd download-genesis {{constants.mochaChainId}}
```

```bash-vue [Arabica]
celestia-appd download-genesis {{constants.arabicaChainId}}
```

:::

Set seeds in the `$HOME/.celestia-app/config/config.toml` file:

::: code-group

```bash-vue [Mainnet Beta]
SEEDS=$(curl -sL https://raw.githubusercontent.com/celestiaorg/networks/master/{{constants.mainnetChainId}}/seeds.txt | tr '\n' ',')
echo $SEEDS
sed -i.bak -e "s/^seeds *=.*/seeds = \"$SEEDS\"/" $HOME/.celestia-app/config/config.toml
```

```bash-vue [Mocha]
SEEDS=$(curl -sL https://raw.githubusercontent.com/celestiaorg/networks/master/{{constants.mochaChainId}}/seeds.txt | tr '\n' ',')
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

<details>
  <summary>Optional: Set persistent peers</summary>

Optionally, you can set persistent peers in your `config.toml` file.
If you set persistent peers, your node will **always** try to connect
to these peers. This is useful when running a local devnet, for example,
when you would always want to connect to the same local nodes in your
devnet. In production, setting persistent peers is advised only if you are running a [sentry node](https://hub.cosmos.network/main/validators/security.html#sentry-nodes-ddos-protection).

You can get the persistent peers from the
[@cosmos/chain-registry](https://github.com/cosmos/chain-registry)
repository (for Mainnet Beta) or [@celestiaorg/networks repository](https://github.com/celestiaorg/networks) repo (for Mocha and Arabica) with the following commands:

::: code-group

```bash-vue [Mainnet Beta]
PERSISTENT_PEERS=$(curl -s https://raw.githubusercontent.com/cosmos/chain-registry/master/{{constants.mainnetChainId}}/chain.json | jq -r '.peers.persistent_peers[].address' | tr '\n' ',' | sed 's/,$/\n/')
echo $PERSISTENT_PEERS
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PERSISTENT_PEERS\"/" $HOME/.celestia-app/config/config.toml
```

```bash-vue [Mocha]
PERSISTENT_PEERS=$(curl -sL https://raw.githubusercontent.com/celestiaorg/networks/master/{{constants.mochaChainId}}/peers.txt | tr '\n' ',')
echo $PERSISTENT_PEERS
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PERSISTENT_PEERS\"/" $HOME/.celestia-app/config/config.toml
```

```bash-vue [Arabica]
PERSISTENT_PEERS=$(curl -sL https://raw.githubusercontent.com/celestiaorg/networks/master/{{constants.arabicaChainId}}/peers.txt | tr '\n' ',')
echo $PERSISTENT_PEERS
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PERSISTENT_PEERS\"/" $HOME/.celestia-app/config/config.toml
```

:::

</details>

For additional peers and addrbook visit [@celestiaorg/awesome-celestia](https://github.com/celestiaorg/awesome-celestia).

## Storage and pruning configurations

### Optional: Connect a consensus node to a bridge node

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

### Query transactions by hash

To query transactions using their hash, transaction
indexing must be turned on. Set the `indexer` to `"kv"` in your `config.toml`:

```toml
indexer = "kv"
```

### Optional: Access historical state

If you want to query the historical state — for example, you might want
to know the balance of a Celestia wallet at a given height in the past —
you should run an archive node with `pruning = "nothing"` in your `app.toml`.
Note that this configuration is resource-intensive and will require
significant storage:

```toml
pruning = "nothing"
```

### Save on storage requirements

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

## Sync types

| Sync mode  | Time     | Notes                                                                                                                                        |
| ---------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Block sync | ~3 weeks | Downloads and executes all blocks from genesis to the tip                                                                                    |
| State sync | ~1 hour  | Downloads a snapshot of the state then downloads and executes all blocks after that snapshot to the tip.                                     |
| Quick sync | ~5 hours | Downloads the data directory from a node. Time depends on your download speed because the data being downloaded can exceed 1 TB for mainnet. |

### Option 1: Block sync

By default, a consensus node will sync using block sync; which will request, validate
and execute every block up to the head of the blockchain. This is the most secure
mechanism yet the slowest (taking up to weeks depending on the height of the blockchain).

There are two alternatives for quicker syncing.

### Option 2: State sync

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

And also set statesync to `true`:

```toml
#######################################################
###         State Sync Configuration Options        ###
#######################################################
[statesync]
enable = true
```

To their respective fields. At least two different rpc endpoints should be provided.
The more, the greater the chance of detecting any fraudulent behavior.

Once setup, you should be ready to start the node as normal. In the logs, you should
see: `Discovering snapshots`. This may take a few minutes before snapshots are found
depending on the network topology.

::: tip
If you are looking to quickly sync a consensus node, and do not need historical blocks,
you can use the following scripts and state sync. Remember to checkout to the correct
version and run `make install` before running the scripts:

- Local devnet: <https://github.com/celestiaorg/celestia-app/blob/main/scripts/single-node.sh>
- Arabica: <https://github.com/celestiaorg/celestia-app/blob/main/scripts/arabica.sh>
- Mocha: <https://github.com/celestiaorg/celestia-app/blob/main/scripts/mocha.sh>
- Mainnet Beta: <https://github.com/celestiaorg/celestia-app/blob/main/scripts/mainnet.sh>

The public networks will use state sync so they'll get to the tip very quickly,
but won't work for your use case if you need historical blocks.
:::

### Option 3: Quick sync

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
aria2c -x 16 -s 16 -o celestia-snap.tar "https://snaps.qubelabs.io/celestia/${SNAP_NAME}"
tar xf celestia-snap.tar -C ~/.celestia-app/data/
```

```bash-vue [Mocha]
cd $HOME
rm -rf ~/.celestia-app/data
mkdir -p ~/.celestia-app/data
SNAP_NAME=$(curl -s https://snaps.qubelabs.io/celestia/ | \
    egrep -o ">{{constants.mochaChainId}}.*tar" | tr -d ">")
aria2c -x 16 -s 16 -o celestia-snap.tar "https://snaps.qubelabs.io/celestia/${SNAP_NAME}"
tar xf celestia-snap.tar -C ~/.celestia-app/data/
```

```bash-vue [Arabica]
cd $HOME
rm -rf ~/.celestia-app/data
mkdir -p ~/.celestia-app/data
SNAP_NAME=$(curl -s https://snaps.qubelabs.io/celestia/ | \
    egrep -o ">{{constants.arabicaChainId}}.*tar" | tr -d ">")
aria2c -x 16 -s 16 -o celestia-snap.tar "https://snaps.qubelabs.io/celestia/${SNAP_NAME}"
tar xf celestia-snap.tar -C ~/.celestia-app/data/
```

:::

::: tip

The [Node snapshots guide](/how-to-guides/snapshots.md) provides everything you need to quick sync your node:

- Details about pruned and archive snapshots
- A list of snapshot providers for different node types
- Installation and usage instructions for `celestia-snapshot-finder` - a tool that automatically finds and downloads the fastest snapshot for your server location

:::

## Start the consensus node

If you are running celestia-app v1.x.x:

```sh
celestia-appd start
```

If you are running celestia-app >= v2.0.0: then you'll want to start the node with a `--v2-upgrade-height` that is dependent on the network. The `--v2-upgrade-height` flag is only needed during the v2 upgrade height so after your node has executed the upgrade (e.g. you see the log `upgraded from app version 1 to 2`), you don't need to provide this flag for future `celestia-appd start` invocations.

::: code-group

```sh-vue [Mainnet Beta]
celestia-appd start --v2-upgrade-height 2371495
```

```sh-vue [Mocha]
celestia-appd start --v2-upgrade-height 2585031
```

```sh-vue [Arabica]
celestia-appd start --v2-upgrade-height 1751707
```

:::

Optional: If you would like celestia-app to run as a background process, you can follow the [SystemD tutorial](/how-to-guides/systemd.md).

## Extra resources for consensus nodes

### Optional: Reset network

There are several ways to reset your consensus node, depending on what you need to preserve:

#### Option 1: Reset blockchain data with `reset-state`

This command removes blockchain data but preserves validator state and address book:

```sh
celestia-appd tendermint reset-state
```

This preserves your configuration, validator state (`priv_validator_state.json`), and peer connections (`addrbook.json`), but removes:
- blockstore.db
- state.db
- evidence.db

This option is safe for validator nodes and was created specifically for validators who need to reset their node's blockchain data without risking double signing. Use this when you need to resync your node but want to maintain your validator's signing state and peer connections.

#### Option 2: Full reset with `unsafe-reset-all`

⚠️ **CAUTION FOR VALIDATORS**: This is considered "unsafe" because it resets validator state:

```sh
celestia-appd tendermint unsafe-reset-all --home $HOME/.celestia-app
```

This command:
- Resets blockchain data
- Resets validator state (`priv_validator_state.json`) but NOT private keys (which are in `priv_validator_key.json`)
- Clears address book (`addrbook.json`)
- Preserves node configuration

This option should ONLY be used when you're absolutely certain your validator isn't actively participating in consensus. Using this while your validator is active could lead to double signing. Always back up your validator keys before using this command.

#### Option 3: Manual reset (recommended for validator nodes)

For more granular control over what gets reset:

```sh
mv ~/.celestia-app/data ~/.celestia-app/old-data
mkdir -pv ~/.celestia-app/data
cp ~/.celestia-app/old-data/priv_validator_state.json ~/.celestia-app/data/priv_validator_state.json
```

This approach lets you manually preserve the validator state file while replacing all other data. The advantage over Option 1 is that you can selectively copy additional files if needed. Use this when you want maximum control over which files are preserved during reset.

#### Option 4: Simple data directory cleanup

For non-validator nodes, you can completely erase all blockchain data and test keys by removing and recreating the data directory:

```sh
# Remove data directory
rm -rf ~/.celestia-app/data
rm -rf ~/.celestia-app/keyring-test

# Create data directory and initialize validator state file
mkdir -p ~/.celestia-app/data/
echo "{}" > ~/.celestia-app/data/priv_validator_state.json
```

This approach:
- Completely removes all blockchain data (blocks, state, evidence, etc.)
- Removes the keyring-test directory containing transaction signing keys (but not validator consensus keys)
- Creates a new, empty data directory structure
- Initializes a blank validator state file, which erases the record of blocks your validator has signed

**Important:** This option should NOT be used for validator nodes because it creates a double-signing risk. The validator's consensus private key (in `priv_validator_key.json` in the config directory) remains intact, but the node loses all record of which blocks it has already signed. If the node is still an active validator on the network, it could sign conflicting blocks at the same height, resulting in slashing penalties.

Use this option only for non-validator nodes when you want a complete fresh start with no preserved state or connections.

It's recommended to test these commands on a testnet first before applying them to a mainnet node.

### Optional: Configure an RPC endpoint

You can configure your consensus node to be a public RPC endpoint.
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

## FAQ

### `+2/3 committed an invalid block: wrong Block.Header.Version`
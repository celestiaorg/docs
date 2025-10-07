---
description: How to sync a light node from a trusted hash.
---

# Syncing a light node from a trusted hash

This guide goes over how to sync a DA light node from a trusted hash.
The example uses the Mocha testnet. You will need to adjust the commands accordingly for Mainnet Beta, Arabica, or a custom network.

If you already have a data store for your node, you need to remove it before syncing from a trusted hash:

```sh
rm -rf ~/.celestia-light-mocha-4/data
```

You also cannot sync to a height earlier than the data availability sampling (DAS) start height.
If you want data from height `n`, start syncing from at least height `n`.

::: warning
Syncing to a trusted hash means that you will not sample the entire chain. This adds a trust
assumption that you trust the history of the chain up to that point and that you trust the entity
where you get the hash from. In this example, the trusted entity is a consensus endpoint or
Celenium.
:::

## General Approach

1. Get trusted height & hash from a consensus endpoint or [Celenium](https://celenium.io).
2. Initialize the node store

   ```sh
   celestia light init --p2p.network <network>
   ```

3. Set the trusted height & hash in your config file
   1. Open your `config.toml` at `.celestia-light/config.toml` (or `.celestia-light-<other-network>/config.toml`)
   2. Set `Header.Syncer.SyncFromHeight` to the trusted height (e.g. `SyncFromHeight = 123456`)
   3. Set `Header.Syncer.SyncFromHash` to the trusted hash (e.g. `SyncFromHash = "<hash_of_block_n>"`)
4. Run the node:

```sh
celestia light start --p2p.network <network> --core.ip <consensus-node-rpc> --core.port <port>
```

## Automated Approach

You can automate the process of setting the trusted height and hash using the following commands for Mocha testnet:

### 1. Initialize the node store (if not already done)

```sh
celestia light init --p2p.network mocha
```

### 2. Get and set the trusted height and hash automatically

```sh
# Get both the height and hash values in a single call
read -r TRUSTED_HEIGHT TRUSTED_HASH <<<"$(curl -s https://rpc-mocha.pops.one/header | jq -r '.result.header | "\(.height) \(.last_block_id.hash)"')" && export TRUSTED_HEIGHT TRUSTED_HASH

# Use sed to find and replace the SyncFromHeight value in the config file (macOS version)
sed -i '' "s/SyncFromHeight = .*/SyncFromHeight = $TRUSTED_HEIGHT/" ~/.celestia-light-mocha-4/config.toml

# Add/update the SyncFromHash value
sed -i '' "s/SyncFromHash = .*/SyncFromHash = \"$TRUSTED_HASH\"/" ~/.celestia-light-mocha-4/config.toml

# Display the updated values to confirm
echo "SyncFromHeight updated to: $TRUSTED_HEIGHT"
echo "SyncFromHash updated to: $TRUSTED_HASH"
```

### 3. Start the node

```sh
celestia light start --p2p.network mocha --core.ip rpc-mocha.pops.one --core.port 9090
```

::: tip
For Linux users, remove the empty string (`''`) after `-i` in the `sed` commands:

```sh
sed -i "s/SyncFromHeight = .*/SyncFromHeight = $TRUSTED_HEIGHT/" ~/.celestia-light-mocha-4/config.toml
sed -i "s/SyncFromHash = .*/SyncFromHash = \"$TRUSTED_HASH\"/" ~/.celestia-light-mocha-4/config.toml
```

:::

## Historical queries

::: warning
Default light nodes no longer support historical queries. By default, nodes maintain a sliding window of headers, bounded by Tail and Head headers. Requests with height below the Tail are rejected.

This is, however, temporary, and lazy header fetching will be available with Backward Sync.
:::

To retain the ability to request older queries with light nodes, use the new configuration fields to set an absolute header that the node will sync from:

- `Header.Syncer.SyncFromHeight`: Set the height from which the node will sync
- `Header.Syncer.SyncFromHash`: Set the hash from which the node will sync

By configuring these fields, your light node will maintain history from the specified height onward, allowing you to query historical data from that point.

## For service operators

If you're using multiple light nodes for similar services like tracking the same rollup,
it is recommended to use the same hash and height for all services using
the same starting height.

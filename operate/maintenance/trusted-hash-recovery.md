# Syncing a light node from a trusted hash

This guide goes over how to sync a DA light node from a trusted hash.
The example uses the Mocha testnet. You will need to adjust the commands accordingly for Mainnet Beta, Arabica, or a custom network.

If you already have a data store for your node, you need to remove it before syncing from a trusted hash:

```sh
rm -rf ~/.celestia-light-mocha-4/data
```

You also cannot sync to a height earlier than the data availability sampling (DAS) start height.
If you want data from height `n`, start syncing from at least height `n`.

> **Warning:** Syncing to a trusted hash means that you will not sample the entire chain. This adds a trust assumption that you trust the history of the chain up to that point and that you trust the entity where you get the hash from. In this example, the trusted entity is a consensus endpoint or Celenium.

## Historical queries

> **Warning:** Default light nodes no longer support historical queries. By default, nodes maintain a sliding window of headers, bounded by Tail and Head headers. Requests with height below the Tail are rejected. This is temporary; lazy header fetching will be available with Backward Sync.

To retain the ability to request older queries with light nodes, use the new configuration fields to set an absolute header that the node will sync from:

- `Header.Syncer.SyncFromHeight`: Set the height from which the node will sync
- `Header.Syncer.SyncFromHash`: Set the hash from which the node will sync

By configuring these fields, your light node will maintain history from the specified height onward, allowing you to query historical data from that point.

## General Approach

## Automated Approach

You can automate the process of setting the trusted height and hash using the following commands for Mocha testnet:

> **Tip (Linux):** Remove the empty string (`''`) after `-i` in the `sed` commands:  
> `sed -i "s/SyncFromHeight = .*/SyncFromHeight = $TRUSTED_HEIGHT/" ~/.celestia-light-mocha-4/config.toml`  
> `sed -i "s/SyncFromHash = .*/SyncFromHash = \"$TRUSTED_HASH\"/" ~/.celestia-light-mocha-4/config.toml`

## For service operators

If you're using multiple light nodes for similar services like tracking the same rollup,
it is recommended to use the same hash and height for all services using
the same starting height.
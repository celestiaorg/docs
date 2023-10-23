---
description: Learn about custom networks and values on celestia-node.
---

# Custom networks and values

This section will cover importing boostrapper IDs, chain ID,
and network ID. This will allow you to import custom values
for a chain that is not in the default configuration.

If you have a custom network you can export `CELESTIA_CUSTOM`, which will
look something like:

```bash
export BRIDGE="/ip4/<ip-address>/tcp/2121/p2p/<node-ID>"
export GENESIS_HASH=<genesis-hash>
export NETWORK=<network-name>
export CELESTIA_CUSTOM="${NETWORK}:${GENESIS_HASH}:${BRIDGE}"
```

Query your node ID [using the RPC CLI](../developers/node-tutorial.md#get-your-node-id).
These values with examples would look like:

```bash
export BRIDGE="/ip4/151.115.14.33/tcp/2121/p2p/12D3KooWKEeRtzVMPUdxYsZo2edqps6mS67n6LT5mPdULSkPSxBQ"
export GENESIS_HASH=580B3DFF8A7C716968161D91116A1E171F486298D582874E93714E489C9E6E88
export NETWORK=custom
export CELESTIA_CUSTOM="${NETWORK}:${GENESIS_HASH}:${BRIDGE}"
```

Then, start your node with:

```bash
celestia [<node-type>] start [flags...]
```

---
description: How to sync a light node from a trusted hash.
---

# Syncing a light node from a trusted hash

This guide goes over how to sync a DA light node from a trusted hash.
The example is with Mainnet Beta. You will need to adjust the commands
accordingly for Mocha, Arabica, or a custom network.

::: warning
Syncing to a trusted hash means that you will not sample the entire chain. This adds a trust
assumption that you trust the history of the chain up to that point and that you trust the entity
where you get the hash from. In this example, the trusted entity is a consensus endpoint or
Celenium
:::

1. Get trusted height & hash from a consensus endpoint or [Celenium](https://celenium.io).
1. Initialize the node store

    ```sh
    celestia light init --p2p.network <network>
    ```

1. Set the trusted height & hash
    1. Open your config.toml at `.celestia-light/config.toml` (or `.celestia-light-<other-network>/config.toml`)
    1. Set `DASer.SampleFrom` to the trusted height (e.g. `SampleFrom = 123456`)
1. Run the node with the hash and flag:

```sh
celestia light start --headers.trusted-hash <hash_of_block_n> \
    --p2p.network <network> --core.ip <consensus-node-rpc>
```

## For service operators

If you're using multiple light nodes for similar services like tracking the same rollup,
it is recommended to use the same hash and height for them all services using
the same starting height.

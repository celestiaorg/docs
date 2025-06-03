---
description: How to sync a light node from a trusted hash.
---

# Syncing a light node from a trusted hash

This guide goes over how to sync a DA light node from a trusted hash.
The example uses the Mocha testnet. You will need to adjust the commands accordingly for Mainnet Beta, Arabica, or a custom network.

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
    2. Set `DASer.SampleFrom` to the trusted height (e.g. `SampleFrom = 123456`)
    3. Set `Header.TrustedHash` to the trusted hash (e.g. `TrustedHash = "<hash_of_block_n>"`)
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
# Get both the height and hash values
export TRUSTED_HEIGHT=$(curl -s "https://rpc-mocha.pops.one/header" | jq -r '.result.header.height') 
export TRUSTED_HASH=$(curl -s "https://rpc-mocha.pops.one/header" | jq -r '.result.header.last_block_id.hash')

# Use sed to find and replace the SampleFrom value in the config file (macOS version)
sed -i '' "s/SampleFrom = .*/SampleFrom = $TRUSTED_HEIGHT/" ~/.celestia-light-mocha-4/config.toml

# Add/update the TrustedHash value
sed -i '' "s/TrustedHash = .*/TrustedHash = \"$TRUSTED_HASH\"/" ~/.celestia-light-mocha-4/config.toml

# Display the updated values to confirm
echo "SampleFrom updated to: $TRUSTED_HEIGHT"
echo "TrustedHash updated to: $TRUSTED_HASH"
```

### 3. Start the node

```sh
celestia light start --p2p.network mocha --core.ip rpc-mocha.pops.one --core.port 9090
```

::: tip
For Linux users, remove the empty string (`''`) after `-i` in the `sed` commands:

```sh
sed -i "s/SampleFrom = .*/SampleFrom = $TRUSTED_HEIGHT/" ~/.celestia-light-mocha-4/config.toml
sed -i "s/TrustedHash = .*/TrustedHash = \"$TRUSTED_HASH\"/" ~/.celestia-light-mocha-4/config.toml
```

:::

## For service operators

If you're using multiple light nodes for similar services like tracking the same rollup,
it is recommended to use the same hash and height for all services using
the same starting height.

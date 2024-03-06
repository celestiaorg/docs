# Integrating Celestia with Madara

[Celestia](https://celestia.org/) is a modular data availability network that
makes it easy for anyone to securely launch their own blockchain.

Celestia acts as a separate layer dedicated to storing transaction data,
enabling app chains to focus solely on transaction execution and settlement.
This design facilitates significant scalability
improvements in the blockchain ecosystem.

## Use Celestia in Madara

When launching a Madara node, you can specify: `--da-layer celestia`.
This will use Celestia to publish the state_diff instead of Ethereum.

When launching the node, the da-config.json file path can be
provided along the `--da-conf` flag.

_**da-config.json**_

```json
{
  "http_provider": "http://127.0.0.1:26658",
  "ws_provider": "ws://127.0.0.1:26658",
  "nid": "Madara",
  "auth_token": "<see below>"
}
```

### Launch with Celestia

The following steps require the
[Celestia CLI tool](https://docs.celestia.org/developers/node-tutorial)
to be installed and configured

### Node Initialization

Run the following command to initialize a light node for the Mocha testnet:

```bash
celestia light init --p2p.network mocha
```

### Authorization Token Generation

Generate an authorization token required for the da-config.json
file with the following command:

```bash
celestia light auth admin --p2p.network mocha
```

This token grants administrative privileges to the light node,
**add this to `da-config.json`**

### Node Startup

Initiate the light node using the following command:

```bash
celestia light start --core.ip rpc.celestia-mocha.com --p2p.network mocha
```

- `--core.ip`: Specifies the gRPC endpoint address of a public core
  node `https://docs.celestia.org/nodes/mocha-testnet#rpc-endpoints`.
- `--p2p.network`: Designates the target P2P network (in this case,
  the Mocha testnet).

### Commands

<!-- markdownlint-disable MD013 -->

```bash
# Madara needs to be built with the Celestia feature flag
cargo build --release --features celestia

# On Madara side, after launching the Celestia light client
# First setup
./madara setup --chain=dev --from-remote --base-path=../.madara
# Launch
./madara --chain=dev --base-path=../.madara --da-layer=celestia --da-conf=/home/da-config.json --force-authoring –alice

```

<!-- markdownlint-enable MD013 -->

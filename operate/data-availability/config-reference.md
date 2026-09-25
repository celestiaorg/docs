# config.toml guide

## Pre-requisites

Please, make sure that you have installed and initialized `celestia-node`

## Viewing the help menu

In order to view all flags and their descriptions, use:

```bash
celestia light start --help
```

## Understanding config.toml

After initialization, for any type of node, you will find a
`config.toml` in the following path (default location):

- `$HOME/.celestia-bridge/config.toml` for bridge node
- `$HOME/.celestia-light/config.toml` for light node

Let's break down some of the most used sections.

### Core (Consensus)

This section is needed for the Celestia bridge node.
By default, `Remote = false`. Still for devnet, we are going
to use the remote consensus node option and this can also be set
by the command line flag `--core.remote`.

### RPC

Starting with celestia-node v0.31.3, the RPC server supports optional per-IP
rate limiting. If you upgraded an existing node from an earlier version, add
the new fields while preserving your custom configuration by running:

```bash
celestia <node_type> config-update --p2p.network <network>
```

The default rate-limit configuration is:

```toml
[RPC.RateLimit]
  Enabled = false
  RequestsPerSec = 100
  Burst = 200
  CacheSize = 8192
```

- `Enabled` turns per-IP rate limiting on or off.
- `RequestsPerSec` sets the sustained request rate allowed for each IP address.
- `Burst` allows short request spikes before the sustained rate is enforced.
- `CacheSize` limits the number of per-IP rate-limit buckets held in memory.

When the limit is exceeded, the RPC server responds with HTTP status `429 Too
Many Requests`. Leave this rate limiter disabled when the node is behind a
reverse proxy because all requests may appear to come from the proxy's IP
address. Apply rate limiting at the proxy instead.

RPC request bodies are limited to 16 MiB, and the server accepts up to 500
concurrent connections. These limits are enforced by the server and are not
configurable in `config.toml`.

See the [celestia-node v0.31.3 release notes](https://github.com/celestiaorg/celestia-node/releases/tag/v0.31.3)
for the complete upgrade instructions.

### P2P

#### Bootstrap

Bootstrappers help new nodes to find peers faster in the network.
By default, the `Bootstrapper = false` and the `BootstrapPeers` is empty.
If you want your node to be a bootstrapper, then activate `Bootstrapper = true`.
`BootstrapPeers` are already provided by default during initialisation.
If you want to add your own manually, you need to provide the
multiaddresses of the peers.

#### Mutual peers

The purpose of this config is to set up a bidirectional communication.
This is usually the case for Celestia bridge nodes. In addition, you
need to change the field `PeerExchange` from false to true.

### Services

#### TrustedHash and TrustedPeer

`TrustedHash` is needed to properly initialize a Celestia bridge
node with an already-running `Remote` Celestia consensus node. Celestia
light node will take a genesis hash as the trusted one, if no hash
is manually provided during initialization phase.

`TrustedPeers` is the array of bridge nodes' peers that Celestia
light node trusts. By default, bootstrap peers becomes trusted peers
for Celestia light nodes if a user is not setting the trusted peer params
in config file.

Any Celestia bridge node can be a trusted peer for the light one. However,
the light node by design can not be a trusted peer for another light node.
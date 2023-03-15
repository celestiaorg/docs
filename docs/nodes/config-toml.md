---
sidebar_label: Config.toml guide
---

# Config.toml guide

## Pre-requisites

Please, make sure that you have installed and initialized celestia-node

## Understanding config.toml

After initialization, for any type of node, you will find a
`config.toml` in the following path (default location):

- `$HOME/.celestia-bridge/config.toml` for bridge node
- `$HOME/.celestia-light/config.toml` for light node

Let's break down some of the most used sections.

### Core

This section is needed for the Celestia Bridge Node.
By default, `Remote = false`. Still for devnet, we are going
to use the remote core option and this can also be set
by the command line flag `--core.remote`.

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
This is usually the case for Celestia Bridge Nodes. In addition, you
need to change the field `PeerExchange` from false to true.

### Services

#### TrustedHash and TrustedPeer

`TrustedHash` is needed to properly initialize a Celestia Bridge
Node with an already-running `Remote` celestia-core node. Celestia
Light Node will take a genesis hash as the trusted one, if no hash
is manually provided during initialization phase.

`TrustedPeers` is the array of Bridge Nodes' peers that Celestia
Light Node trusts. By default, bootstrap peers becomes trusted peers
for Celestia Light Nodes if a user is not setting the trusted peer params
in config file.

Any Celestia Bridge Node can be a trusted peer for the Light one. However,
the Light node by design can not be a trusted peer for another Light Node.

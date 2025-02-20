# Common Node Setup Guide

This guide contains the common setup instructions shared across all Celestia node types (Bridge, Light, Full Storage, etc.).

## Environment Setup

### Hardware Requirements

For hardware requirements specific to each node type, please refer to the [Node Overview](/how-to-guides/nodes-overview.md#recommended-celestia-node-requirements).

### Dependencies

Before setting up any Celestia node, you'll need to install the following dependencies:

1. Follow the [environment setup guide](/how-to-guides/environment.md) to install required system packages
2. Install the [celestia-node binary](/how-to-guides/celestia-node.md)

## Key Management

### Generate Node Keys

You can create your key for your node by following the [`cel-key` instructions](/tutorials/celestia-node-key.md).

Once you start any node type, a wallet key will be generated for you. You will need to fund that address with tokens to pay for transactions.

To find your node's address:

```bash
./cel-key list --node.type <type> --keyring-backend test --p2p.network <network>
```

:::tip
You do not need to declare a network for Mainnet Beta. Refer to
[the chain ID section on the troubleshooting page for more information](/how-to-guides/celestia-node-troubleshooting.md)
:::

### Using Custom Keys

To run a node using a custom key:

1. The custom key must exist inside the celestia node directory at the correct path (default: `~/.celestia-<node-type>/keys/keyring-test`)
2. Pass the name of the custom key upon `start`:

```bash
celestia <node-type> start --core.ip <URI> --keyring.keyname <name-of-custom-key> --core.port <port>
```

### Migrating Node ID

To migrate a node ID to another server:

1. Back up the files located in the celestia node directory at the correct path (default: `~/.celestia-<node-type>/keys`)
2. Upload the files to the new server and start the node

## Optional Configurations

### SystemD Setup

For running your node as a background service, follow the
[tutorial on setting up the node with SystemD](/how-to-guides/systemd.md).

### ZFS Compression

To optimize storage, you can follow the
[tutorial on how to set up your DA node to use on-fly compression with ZFS](/how-to-guides/zfs.md).

## Network Configuration

### Port Configuration

Make sure the required ports are open and publicly accessible on your node for P2P connectivity:
- Bridge nodes: Port 2121 TCP/UDP
- Light nodes: Port 2121 TCP/UDP
- Full storage nodes: Port 2121 TCP/UDP

Refer to [the ports section of the celestia-node troubleshooting page](/how-to-guides/celestia-node-troubleshooting.md#ports)
for detailed information on required ports.

### Network Endpoints

For connecting to the network, refer to the [Network Endpoints](/reference/network-endpoints.md) guide for available RPC, API, and gRPC endpoints. 
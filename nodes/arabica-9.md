---
description: A guide to Arabica-9 devnet.
---

# Arabica-9 devnet

![arabica-devnet](/img/arabica-devnet.png)

:::warning
This page is maintained for developers still using the `arabica-9` devnet.

Refer to the [Arabica devnet](./arabica-devnet.md) page for the latest
updates on the Arabica devnet.
:::

## Software version numbers

- Celestia Chain ID - [arabica-9](https://github.com/celestiaorg/networks/tree/master/arabica-9)
- Celestia Node - [v0.11.0-rc9.1](https://github.com/celestiaorg/celestia-node/releases/tag/v0.11.0-rc9.1)
- Celestia App - [v1.0.0-rc7](https://github.com/celestiaorg/celestia-app/releases/tag/v1.0.0-rc7)
- Rollkit - [v0.10.2](https://github.com/rollkit/rollkit/releases/tag/v0.10.2)

## Integrations

This guide contains the relevant sections for how to connect to arabica-9,
depending on the type of node you are running.

Your best approach to participating is to first determine which node
you would like to run. Each node's guide will link to the relevant networks
in order to show you how to connect to them.

You have a list of options on the type of nodes you can run in order to
participate in arabica-9:

Data Availability:

- [Bridge node](./bridge-node.md)
- [Full storage node](./full-storage-node.md)
- [Light node](./light-node.md)

Select the type of node you would like to run and follow the instructions
on each respective page. Whenever you are asked to select the type of network
you want to connect to in those guides, select `Arabica` in order to refer
to the correct instructions on this page on how to connect to arabica-9.

## RPC endpoints

The RPC endpoint is to allow users to interact with Celestia's nodes by
querying the node's state and broadcasting transactions on the
Celestia network. The default port is 26657.

Below is a list of RPC endpoints you can use to connect to arabica-9 Devnet:

### Bridge, full, and light nodes

- `consensus-validator-arabica-9.celestia-arabica.com`
- `validator.consensus-arabica-9.celestia-arabica.com`
- `consensus-full-arabica-9.celestia-arabica.com`

### Full and light nodes ONLY

These RPC endpoints do not allow you to download full blocks from
them. We advise that if you are running a bridge node, that you also
run a local [full consensus node](./consensus-node.md)
in order to download full blocks from it.

- `rpc-arabica-9.consensus.celestia-arabica.com`
- `rpc-2-arabica-9.consensus.celestia-arabica.com`

## API endpoints

The API endpoint is to allow users to interact with the REST API in Cosmos
SDK which is implemented using gRPC-gateway, which exposes gRPC endpoints
as REST endpoints. This allows for communication with the node using REST
calls, which can be useful if the client does not support gRPC or HTTP2.
The default port is 1317.

- [https://api-arabica-9.consensus.celestia-arabica.com/](https://api-arabica-9.consensus.celestia-arabica.com/)
- [https://api-2-arabica-9.consensus.celestia-arabica.com/](https://api-2-arabica-9.consensus.celestia-arabica.com/)

## gRPC endpoints

The gRPC endpoint is to allow users to interact with a Celestia Node using
gRPC, a modern open-source and high-performance RPC framework. The default
port is 9090. In the Cosmos SDK, gRPC is used to define state queries and
broadcast transactions.

- `grpc-arabica-9.consensus.celestia-arabica.com:443`
- `grpc-2-arabica-9.consensus.celestia-arabica.com:443`
- `validator.consensus-arabica-9.celestia-arabica.com:9090`
- `consensus-validator-arabica-9.celestia-arabica.com:9090`

## Arabica devnet faucet

:::danger WARNING
USING THIS FAUCET DOES NOT ENTITLE YOU TO ANY AIRDROP OR OTHER DISTRIBUTION OF
MAINNET CELESTIA TOKENS. THERE ARE NO PUBLIC SALES OF ANY MAINNET CELESTIA
TOKENS.
:::

### Web

The web faucet is available at [https://faucet-arabica-9.celestia-arabica.com/](https://faucet-arabica-9.celestia-arabica.com/).

## Explorers

There is an explorer you can use for Arabica:

- [https://explorer-arabica-9.celestia-arabica.com/arabica-9](https://explorer-arabica-9.celestia-arabica.com/arabica-9)

## Network upgrades

Join our [Telegram announcement channel](https://t.me/+smSFIA7XXLU4MjJh)
for network upgrades.

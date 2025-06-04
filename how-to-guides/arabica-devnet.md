---
description: A guide to Arabica devnet.
---

# Arabica devnet

<!-- markdownlint-disable MD013 -->
<!-- markdownlint-disable MD033 -->
<script setup>
import constants from '/.vitepress/constants/constants.js'
import ArabicaVersionTags from '../.vitepress/components/ArabicaVersionTags.vue'
import ArabicaDevnetDetails from '../.vitepress/components/ArabicaDevnetDetails.vue'
</script>

![arabica-devnet](/img/arabica-devnet.png)

Arabica devnet is a testnet from Celestia Labs that is focused
exclusively on providing developers with enhanced performance and
the latest upgrades for testing their rollups and applications.

Arabica does not focus on validator or consensus-level testing, rather,
that is what Mocha testnet is used for. If you are a validator, we
recommend testing your validator operations on the
[Mocha testnet](/how-to-guides/mocha-testnet.md).

## Network stability and upgrades

Arabica has the latest updates from all Celestia's products deployed
on it, it can be subject to many changes. Therefore, as a fair warning,
Arabica can break unexpectedly, but given it will be continuously updated,
it is a useful way to keep testing the latest changes in the software.

Developers can still deploy on Mocha testnet their sovereign rollups if they
chose to do so, it just will always lag behind Arabica devnet until Mocha
undergoes network upgrades in coordination with validators.

## Network details

<ArabicaDevnetDetails />

### Software version numbers

<ArabicaVersionTags/>

## Network status

For real-time network status information, including uptime, incident reports,
and service availability, visit the
[official Celestia Arabica devnet status page](https://status.celestia.dev/status/arabica).

## Integrations

This guide contains the relevant sections for how to connect to Arabica
devnet, depending on the type of node you are running. Your best
approach to participating is to first determine which node you would
like to run. Each node’s guide will link to the relevant network in
order to show you how to connect to them. Learn about the different
endpoint types [in the Cosmos SDK documentation](https://docs.cosmos.network/v0.50/learn/advanced/grpc_rest).

### Production RPC endpoints

<!-- markdownlint-disable MD013 -->
<!-- markdownlint-disable MD034 -->

These RPC providers are meant to be used in production environments
and for specific use cases that require reliable access to full block
history, such as:

- Running Bridge Nodes that download data from core RPC endpoints
- Applications that need Bridge Node endpoints with guaranteed uptime and SLAs

| Provider | URL                                                                                   |
| -------- | ------------------------------------------------------------------------------------- |
| Numia    | For RPC access: <https://docs.numia.xyz/infra/overview/getting-started>               |
| Numia    | For data warehouse access: <https://docs.numia.xyz/sql/querying-data/chains/celestia> |
| Grove    | <https://www.grove.city/>                                                             |

### Node setup and tools

Several community providers offer comprehensive node setup tools and monitoring services to help node operators get started quickly. Check the [community endpoint status dashboard](#community-endpoint-status-dashboard) for real-time endpoint status information.

### Community consensus endpoints

:::warning
Do not rely on the free community endpoints listed below
for production deployments. Production deployments should rely
on [service providers with SLAs](#production-rpc-endpoints) or
your own node.
:::

The following table lists community-provided consensus node endpoints that you can use:

| Provider        | RPC Endpoint                                             | API Endpoint                                             | gRPC Endpoint                                             | WebSocket Endpoint |
| --------------- | -------------------------------------------------------- | -------------------------------------------------------- | --------------------------------------------------------- | ------------------ |
| Celestia Labs   | `rpc.celestia-{{constants.arabicaChainId}}.com`         | `api.celestia-{{constants.arabicaChainId}}.com`         | `grpc.celestia-{{constants.arabicaChainId}}.com:443`     | -                  |
| Celestia Labs   | `validator-1.celestia-{{constants.arabicaChainId}}.com` | `validator-1.celestia-{{constants.arabicaChainId}}.com` | `validator-1.celestia-{{constants.arabicaChainId}}.com`  | -                  |
| Celestia Labs   | `validator-2.celestia-{{constants.arabicaChainId}}.com` | `validator-2.celestia-{{constants.arabicaChainId}}.com` | `validator-2.celestia-{{constants.arabicaChainId}}.com`  | -                  |
| Celestia Labs   | `validator-3.celestia-{{constants.arabicaChainId}}.com` | `validator-3.celestia-{{constants.arabicaChainId}}.com` | `validator-3.celestia-{{constants.arabicaChainId}}.com`  | -                  |
| Celestia Labs   | `validator-4.celestia-{{constants.arabicaChainId}}.com` | `validator-4.celestia-{{constants.arabicaChainId}}.com` | `validator-4.celestia-{{constants.arabicaChainId}}.com`  | -                  |

### Connecting DA nodes to consensus nodes

Data availability (DA) nodes need to connect to consensus nodes to sync blocks and access state. When starting a DA node, you'll need to provide a consensus node endpoint using the `--core.ip` parameter and the port.

:::tip

```bash
celestia <da_type> start --core.ip <consensus_node_url> --core.port <port>
```

:::

You can use any of the RPC endpoints from the [community consensus endpoints](#community-consensus-endpoints) table above. The default port is 9090, where gRPC is used for both block sync and state access.

For example, to connect to a Celestia Labs endpoint:

```bash-vue
celestia light start --p2p.network arabica \
  --core.ip validator-1.celestia-{{constants.arabicaChainId}}.com \
  --core.port 9090
```

### Bridge node requirements

Not all RPC endpoints guarantee the full block history.
Bridge nodes require access to the full historical block data, so you should use an archive endpoint to run your bridge node.

Check the [production endpoints](#production-rpc-endpoints) or the [community endpoint status dashboard](#community-endpoint-status-dashboard) to identify which endpoints are archive nodes with full historical data.

Alternatively, you can run your own consensus node with no pruning for your bridge node.

## Community endpoint status dashboard

To check the current status, uptime, and health of all community endpoints, visit the [RPC stats for Celestia dashboard](https://celestia-tools.brightlystake.com/). This dashboard provides real-time information about:

- Which endpoints are currently online  
- Response times and performance metrics
- Which endpoints are archive nodes with full historical data
- Last seen heights for each endpoint

This is an essential resource when selecting endpoints for your nodes or applications.

## Legacy endpoint information

The sections below provide additional endpoint details. For most users, the [community consensus endpoints](#community-consensus-endpoints) table above provides all the information needed.

### Community RPC endpoints

:::warning
Do not rely on the free community endpoints listed below
for production deployments. Production deployments should rely
on [service providers with SLAs](#production-rpc-endpoints) or
your own node.
:::

Reference information about available endpoints and node types for Arabica devnet. Note: the official Celestia Labs endpoints have the following open ports:

- 26656 (p2p), 26657 (RPC), 1317 (API), 9090 (gRPC)

For DA Bridge Node peer discovery, see the list of official Celestia bootstrappers in the [celestia-node GitHub repository](https://github.com/celestiaorg/celestia-node/blob/a87a17557223d88231b56d323d22ac9da31871db/nodebuilder/p2p/bootstrap.go#L39).

## Arabica devnet faucet

:::danger WARNING
USING THIS FAUCET DOES NOT ENTITLE YOU TO ANY AIRDROP OR OTHER DISTRIBUTION OF
MAINNET CELESTIA TOKENS.
:::

### Discord

You can request from Arabica devnet Faucet on the #arabica-faucet channel on
Celestia's Discord server with the following command:

```text
$request <CELESTIA-ADDRESS>
```

Where `<CELESTIA-ADDRESS>` is a `celestia1******` generated address.

:::tip NOTE
Faucet has a limit of 10 tokens per week per address/Discord ID.
:::

### Web

The web faucet is available at [https://arabica.celenium.io/faucet](https://arabica.celenium.io/faucet) and [https://faucet.celestia-{{constants.arabicaChainId}}.com/](https://faucet.celestia-{{constants.arabicaChainId}}.com/).

## Explorers

There are multiple explorers you can use for Arabica:

- [https://arabica.celenium.io](https://arabica.celenium.io)
- [https://explorer.celestia-{{constants.arabicaChainId}}.com](https://explorer.celestia-{{constants.arabicaChainId}}.com)

## Network upgrades

Join our [Telegram announcement channel](https://t.me/+smSFIA7XXLU4MjJh)
for network upgrades.

See the [network upgrade process page](/how-to-guides/network-upgrade-process.md) to learn more
about specific upgrades like the [Ginger network upgrade](/how-to-guides/network-upgrade-process.md#ginger-network-upgrade).

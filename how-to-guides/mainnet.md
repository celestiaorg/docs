<!-- markdownlint-disable MD033 -->

# Mainnet Beta

<script setup>
import MainnetVersionTags from '../.vitepress/components/MainnetVersionTags.vue'
import MainnetBetaDetails from '../.vitepress/components/MainnetBetaDetails.vue'
</script>

![Mainnet Beta](/img/Mainnet-Beta.png)

Welcome to the guide for Celestia's Mainnet Beta.
Mainnet Beta is the culmination of rigorous community testing,
upgrades, and feedback. It serves as the platform for deploying
Mainnet Beta rollups and unstoppable applications.

## Network stability and upgrades

Mainnet Beta is a stable network, but will still receive updates and
improvements. Any changes or upgrades will be coordinated with node
operators and the broader Celestia community to ensure seamless
integration and minimal service interruptions.

As we step into unexplored territories with groundbreaking technologies
like data availability sampling, it's crucial to remember that Mainnet
Beta remains experimental at this stage. While the network is live and
functional, users may encounter occasional instability or reduced performance.

## Network details

<MainnetBetaDetails/>

## Software version numbers

<MainnetVersionTags/>

## Network status

For real-time network status information, including uptime, incident reports,
and service availability, visit the
[official Celestia Mainnet status page](https://status.celestia.dev/status/mainnet).

## Network parameters

### Transaction size limit

As specified in [CIP-28](https://cips.celestia.org/cip-028.html), there is a 2 MiB (2,097,152 bytes) limit on individual transaction size. This limit was implemented to maintain network stability and provide clear expectations for users and developers, even as block sizes may be larger.

### Block size limit

While individual transactions are limited to 2 MiB, a block can contain multiple transactions and has a much larger capacity. The maximum block size is determined by the effective maximum square size.

Given that the current governance maximum square size is 128, the total block size can be slightly less than ~8 MiB, or 7,896,602 bytes to be exact.

The following provides an approximation of the maximum block size:

- The maximum square size is 128x128, which gives us 16384 shares.
- One share is reserved for the PFB transaction, leaving us with 16383 shares.
- The first sparse share has 478 bytes available, and the remaining sparse
  shares have 482 bytes each.

This can be calculated as follows:

<!-- markdownlint-disable MD013 -->

$$
\text{First share: } 1 \times 478 \text{ bytes}
$$

$$
\text{Remaining shares: } 16382 \times 482 \text{ bytes}
$$

$$
\text{Total Bytes: } 7,896,602 \text{ bytes}
$$

<!-- markdownlint-enable MD013 -->

There isn't a precise upper bound on the maximum total
blob size. It depends on several factors:

- The maximum square size, which is determined by a governance parameter
  and a versioned constant.
- The maximum bytes in a block, which is determined by a governance parameter
  and a hard-coded constant in CometBFT.
- The number of shares occupied by the PFB transaction share.

These factors can cause the maximum total blob size that can be included in one
block to vary.

See the code in
[celestia-app](https://github.com/celestiaorg/celestia-app/blob/2e49d665b3275e769dfe0371b1ca41e39dc3f5f5/pkg/appconsts/initial_consts.go#L14)
and [celestia-node](https://github.com/celestiaorg/celestia-node/blob/540192259c144ccbd24e45e34616a41389232a51/blob/blob.go#L93).

Full network parameters, such as [max bytes](https://github.com/celestiaorg/celestia-app/blob/29906a468910184f221b42be0a15898722a2b08f/specs/src/parameters_v6.md?plain=1#L35),
can be found in the
[celestia-app specifications](https://celestiaorg.github.io/celestia-app/parameters_v6.html).

## Integrations

This guide contains the relevant sections for how to connect to Mainnet Beta,
depending on the type of node you are running. Your best approach to
participating is to first [determine which node you would like to run](/how-to-guides/decide-node.md). Each
node's guide will link to the relevant network in order to show you how
to connect to them. Learn about the different endpoint types
[in the Cosmos SDK documentation](https://docs.cosmos.network/v0.50/learn/advanced/grpc_rest).

### Production RPC endpoints

<!-- markdownlint-disable MD013 -->
<!-- markdownlint-disable MD034 -->

These RPC providers are meant to be used in production environments
and for specific use cases that require reliable access to full block
history, such as:

- Running Bridge Nodes that download data from core RPC endpoints
- Applications that need Bridge Node endpoints with guaranteed uptime and SLAs
- Submitting blobs in production settings (free RPC endpoints have no guarantees, even for submitting transactions)

| Provider  | URL                                                                                       |
| --------- | ----------------------------------------------------------------------------------------- |
| Grove     | <https://www.grove.city/>                                                                 |
| Numia     | For RPC access: <https://docs.numia.xyz/infra/overview/getting-started>                   |
| Numia     | For data warehouse access: <https://docs.numia.xyz/sql/querying-data/chains/celestia>     |
| QuickNode | <https://www.quicknode.com/chains/celestia> ([docs](https://quicknode.com/docs/celestia)) |

If you are using QuickNode or another provider with authenticated endpoints,
see [the light node guide](/how-to-guides/light-node.md#optional-start-light-node-with-consensus-node-endpoint-with-authentication)
to learn how to use an endpoint with x-token.

### Node setup and tools

Several community providers offer comprehensive node setup tools, installation scripts, and monitoring services to help node operators get started quickly:

| Provider | Installation guide                                             | State sync                                                    | Monitoring tools                                                |
| -------- | -------------------------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------- |
| ITRocket | [Setup guide](https://itrocket.net/services/mainnet/celestia/) | [State sync](https://itrocket.net/services/mainnet/celestia/) | [Chain status](https://itrocket.net/services/mainnet/celestia/) |

### Community consensus endpoints

:::warning
Do not rely on the free community endpoints listed below
for production deployments. Production deployments should rely
on [service providers with SLAs](#production-rpc-endpoints).
:::

You can also find the list of official Celestia bootstrappers in the [celestia-node GitHub repository](https://github.com/celestiaorg/celestia-node/blob/a87a17557223d88231b56d323d22ac9da31871db/nodebuilder/p2p/bootstrap.go#L39).

The following table lists community-provided consensus node endpoints that you can use:

| Provider        | RPC Endpoint                                             | API Endpoint                                                     | gRPC Endpoint                                  | WebSocket Endpoint                                       |
| --------------- | -------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------------- |
| 0xcryptovestor  | `celestia-rpc.0xcryptovestor.com`                        | -                                                                | -                                              | -                                                        |
| AlphaB          | `rpc-celestia.alphab.ai`                                 | `api-celestia.alphab.ai`                                         | `rpc-celestia.alphab.ai:9090`                  | -                                                        |
| Brightly Stake  | `celestia-rpc.brightlystake.com`                         | `celestia-rpc.brightlystake.com/api`                             | `celestia-rpc.brightlystake.com:9090`          | `wss://celestia-ws.chainode.tech:33373/websocket`        |
| Chainode        | `celestia-rpc.chainode.tech:33373`                       | `celestia-api.chainode.tech`                                     | `celestia-grpc.chainode.tech:443`              | `wss://celestia-ws.chainode.tech:33373/websocket`        |
| Cumulo          | `celestia.cumulo.org.es`                                 | `celestia.api.cumulo.org.es`                                     | `celestia.grpc.cumulo.org.es:443`              | `wss://celestia.cumulo.org.es:443/websocket`             |
| Cumulo Archive  | `rpc.archive.celestia.cumulo.com.es`                     | `api.archive.celestia.cumulo.com.es`                             | `grpc.archive.celestia.cumulo.com.es:443`      | `wss://rpc.archive.celestia.cumulo.com.es:443/websocket` |
| Easy2Stake      | `celestia-rpc.easy2stake.com`                            | `celestia-lcd.easy2stake.com`                                    | -                                              | -                                                        |
| Grove           | `celestia-consensus-archival.rpc.grove.city/v1/c33eeadb` | `https://celestia-consensus-archival.rpc.grove.city/v1/c33eeadb` | -                                              | -                                                        |
| ITRocket        | `celestia-mainnet-rpc.itrocket.net:443`                  | `celestia-mainnet-api.itrocket.net:443`                          | `celestia-mainnet-grpc.itrocket.net:443`       | `wss://celestia-mainnet-ws.itrocket.net:443/websocket`   |
| kjnodes         | `celestia.rpc.kjnodes.com`                               | `celestia.api.kjnodes.com`                                       | `celestia.grpc.kjnodes.com:443`                | -                                                        |
| Lava            | -                                                        | `celestia.rest.lava.build`                                       | `celestia.grpc.lava.build:443`                 | -                                                        |
| lunaroasis      | `rpc.lunaroasis.net`                                     | `api.lunaroasis.net`                                             | `grpc.lunaroasis.net:443`                      | -                                                        |
| Mzonder         | `rpc-celestia.mzonder.com:443`                           | `api-celestia.mzonder.com:443`                                   | `grpc-celestia.mzonder.com:443`                | `wss://rpc-celestia.mzonder.com:443/websocket`           |
| NodeStake       | `rpc.celestia.nodestake.top`                             | `api.celestia.nodestake.top`                                     | `grpc.celestia.nodestake.top`                  | -                                                        |
| Noders Services | `celestia-rpc.noders.services`                           | `celestia-api.noders.services`                                   | `celestia-grpc.noders.services:11090`          | -                                                        |
| Numia           | `public-celestia-rpc.numia.xyz`                          | `public-celestia-lcd.numia.xyz`                                  | `public-celestia-grpc.numia.xyz`               | `wss://public-celestia-rpc.numia.xyz/websocket`          |
| P-OPS           | `rpc.celestia.pops.one`                                  | `api.celestia.pops.one`                                          | `grpc.celestia.pops.one`                       | -                                                        |
| Stakeflow       | `rpc-celestia-01.stakeflow.io`                           | `api-celestia-01.stakeflow.io`                                   | `grpc-celestia-01.stakeflow.io:15002`          | -                                                        |
| Stakin          | `celestia.rpc.stakin-nodes.com`                          | `celestia.rest.stakin-nodes.com`                                 | `celestia.grpc.stakin-nodes.com:443`           | -                                                        |
| Trusted Point   | `rpc-celestia-mainnet.trusted-point.com`                 | `api-celestia-mainnet.trusted-point.com`                         | `grpc-celestia-mainnet.trusted-point.com:9095` | -                                                        |
| deNodes         | `celestia-mainnet-rpc.denodes.xyz`                       | `celestia-mainnet-api.denodes.xyz`                               | `celestia-mainnet-grpc.denodes.xyz:443`        | `wss://celestia-mainnet-rpc.denodes.xyz:443/websocket`   |

### Connecting DA nodes to consensus nodes

Data availability (DA) nodes need to connect to consensus nodes to sync blocks and access state. When starting a DA node, you'll need to provide a consensus node endpoint using the `--core.ip` parameter and the port.

:::tip

```bash
celestia <da_type> start --core.ip <consensus_node_url> --core.port <port>
```

:::

You can use any of the RPC endpoints from the [community consensus endpoints](#community-consensus-endpoints) table above. The default port is 9090, where gRPC is used for both block sync and state access.

For example, to connect to the P-OPS endpoint:

```bash
celestia light start --core.ip rpc.celestia.pops.one --core.port 9090
```

### Bridge node requirements

Not all RPC endpoints guarantee the full block history.
Bridge nodes require access to the full historical block data, so you should use an archive endpoint to run your bridge node.

Check the [production endpoints](#production-rpc-endpoints) or the [community dashboard](https://celestia-tools.brightlystake.com/) to identify which endpoints are archive nodes with full historical data.

Alternatively, you can run your own consensus node with no pruning for your bridge node.

### Archival DA RPC endpoints

By default, light nodes prune recent data to save on storage space. Archival
data availability (DA) nodes store the entire history of the chain without
pruning any data so all data available data is retrievable. You can
[read more about light vs archival nodes](/learn/retrievability.md).

| Provider                         | Endpoint                                                                                  | RPC Port | Gateway Port |
| -------------------------------- | ----------------------------------------------------------------------------------------- | -------- | ------------ |
| Grove                            | `celestia-archival.rpc.grove.city/v1/c33eeadb`                                            | -        | -            |
| Mzonder                          | `celestia-da-full-storage.mzonder.com`                                                    | 27758    | 27759        |
| Noders Services                  | `celestia-archive-da.noders.services`                                                     | 26658    | 26659        |
| ITRocket                         | `celestia-mainnet-da-full-storage.itrocket.net`                                           | 26658    | 26659        |
| QuickNode                        | <https://www.quicknode.com/chains/celestia> ([docs](https://quicknode.com/docs/celestia)) | -        | -            |
| See the Brightly Stake dashboard | <https://celestia-tools.brightlystake.com/>                                               | -        | -            |

## Explorers

There are multiple explorers you can use for Mainnet Beta:

- [https://celenium.io](https://celenium.io)
- [https://celestia.explorers.guru](https://celestia.explorers.guru)
- [https://celestia.valopers.com/](https://celestia.valopers.com/)
- [https://celestiahub.org](https://celestiahub.org/explorer)
- [https://explorer.chainroot.io/celestia](https://explorer.chainroot.io/celestia)
- [https://explorer.nodestake.top/celestia](https://explorer.nodestake.top/celestia)
- [https://mainnet.itrocket.net/celestia/](https://mainnet.itrocket.net/celestia/)
- [https://mammoblocks.io/](https://mammoblocks.io/)
- [https://mintscan.io/celestia](https://mintscan.io/celestia)
- [https://stakeflow.io/celestia](https://stakeflow.io/celestia)

## Community endpoint status dashboard

To check the current status, uptime, and health of all community endpoints, visit the [RPC stats for Celestia dashboard](https://celestia-tools.brightlystake.com/). This dashboard provides real-time information about:

- Which endpoints are currently online
- Response times and performance metrics
- Which endpoints are archive nodes with full historical data
- Last seen heights for each endpoint

This is an essential resource when selecting endpoints for your nodes or applications.

## Analytics

The following websites provide analytics for Celestia:

- [https://alphab.ai/s/m/celestia/](https://alphab.ai/s/m/celestia/)
- [https://analytics.smartstake.io/celestia](https://analytics.smartstake.io/celestia)
- [https://celestiahub.org/explorer/blobs](https://celestiahub.org/explorer/blobs)
- [https://cosmoslist.co/mainnet/celestia](https://cosmoslist.co/mainnet/celestia)
- [https://itrocket.net/services/mainnet/celestia/](https://itrocket.net/services/mainnet/celestia/) - Node setup, monitoring, and chain status tools
- [https://itrocket.net/services/mainnet/celestia/analytics/consensus-signal-tracker/](https://itrocket.net/services/mainnet/celestia/analytics/consensus-signal-tracker/) - Consensus signal tracker
- [https://itrocket.net/services/mainnet/celestia/decentralization/](https://itrocket.net/services/mainnet/celestia/decentralization/)
- [https://services.kjnodes.com/mainnet/celestia/slashboard](https://services.kjnodes.com/mainnet/celestia/slashboard)

## Node maps

The following websites provide visual maps of Celestia DA nodes:

- [https://validao.xyz/#maps-celestia-da](https://validao.xyz/#maps-celestia-da) (community contribution)

## Network upgrades

There are a few ways to stay informed about network upgrades on Mainnet Beta:

- Telegram [announcement channel](https://t.me/+smSFIA7XXLU4MjJh)
- Discord [Mainnet Beta announcements](https://discord.com/channels/638338779505229824/1169237690114388039)

See the [network upgrade process page](/how-to-guides/network-upgrade-process.md) to learn more
about specific upgrades like the [Ginger network upgrade](/how-to-guides/network-upgrade-process.md#ginger-network-upgrade).

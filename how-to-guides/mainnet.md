<!-- markdownlint-disable MD033 -->

# Mainnet Beta

<script setup>
import MainnetVersionTags from '../.vitepress/components/MainnetVersionTags.vue'
import MainnetBetaDetails from '../.vitepress/components/MainnetBetaDetails.vue'
</script>

![Mainnet Beta](/img/Mainnet-Beta.png)

Welcome to the guide for Celestia’s Mainnet Beta, the production
network that marks the pinnacle of Celestia’s evolution since its
inception in 2019. This network is where all components of the
Celestia ecosystem come to life in a real-world environment.

Mainnet Beta is the culmination of rigorous community testing,
upgrades, and feedback. It serves as the platform for deploying
Mainnet Beta rollups and applications.

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

## Network parameters

Full network parameters, such as [max bytes](https://github.com/celestiaorg/celestia-app/blob/23d13d4de41631dc3c52f7d94fc214e44d03962d/specs/src/specs/params.md?plain=1#L30),
can be found in the
[celestia-app specifications](https://celestiaorg.github.io/celestia-app/specs/params.html).

[CIP-13](https://github.com/celestiaorg/CIPs/blob/main/cips/cip-13.md)
has been drafted to create a living document for these parameters
as a part of the CIP process.

### Maximum bytes

There is a hard limit on the total blob size in a transaction, which is
determined by the effective maximum square size. Given that the current
governance maximum square size is 64, the total blob size in a transaction
must be slightly less than ~2 MiB, or 1,973,786 bytes to be exact.

The following provides an approximation of the maximum block size:

- The maximum square size is 64x64, which gives us 4096 shares.
- One share is reserved for the PFB transaction, leaving us with 4095 shares.
- The first sparse share has 478 bytes available, and the remaining sparse
  shares have 482 bytes each.

This can be calculated as follows:

<!-- markdownlint-disable MD013 -->

$\text{Total Bytes} = (1 \times 478 \, \text{bytes}) + (4094 \times 482 \, \text{bytes}) = 1,973,786 \, \text{bytes}$

<!-- markdownlint-enable MD013 -->

Please note that there isn't a precise upper bound on the maximum total
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

## Integrations

This guide contains the relevant sections for how to connect to Mainnet Beta,
depending on the type of node you are running. Your best approach to
participating is to first determine which node you would like to run. Each
node’s guide will link to the relevant network in order to show you how
to connect to them. Learn about the different endpoint types
[in the Cosmos SDK documentation](https://docs.cosmos.network/v0.50/learn/advanced/grpc_rest).

Here is a list of options of the types of nodes you can run in order
to participate in Mainnet Beta:

### Production RPC endpoints

<!-- markdownlint-disable MD013 -->
<!-- markdownlint-disable MD034 -->

These RPC providers are meant to be used in production environments.

| Provider | URL |
|--------|--------|
| NewMetric | <https://app.newmetric.xyz/start> |
| Numia | For RPC access: <https://docs.numia.xyz/overview/rpc-api-access> |
| Numia | For data warehouse access: <https://docs.numia.xyz/overview/sql-access/chains/celestia> |
| Grove | <https://www.grove.city/> |

:::warning
Do not rely on the free community endpoints listed below
for production deployments. Production deployments should rely
on [service providers with SLAs](#production-rpc-endpoints) or
your own node.
:::

### Consensus nodes

- [Consensus node](./consensus-node)
- [Validator node](./validator-node)

#### Community consensus RPC endpoints

:::warning
Do not rely on the free community endpoints listed below
for production deployments. Production deployments should rely
on [service providers with SLAs](#production-rpc-endpoints).
:::

- `public-celestia-rpc.numia.xyz`
- `rpc.celestia.pops.one`
- `rpc.lunaroasis.net`
- `rpc.celestia.nodestake.top`
- `celestia-rpc.brightlystake.com`
- `celestia.rpc.stakin-nodes.com`
- `celestia.cumulo.org.es`
- `rpc-celestia.mzonder.com`
- `rpc-celestia-01.stakeflow.io`
- `rpc-celestia.alphab.ai`
- `rpc-celestia-full.avril14th.org`
- `celestia-rpc.easy2stake.com`
- `celestia.rpc.kjnodes.com`
- `celestia-rpc.0xcryptovestor.com`
- `rpc-celestia-mainnet.trusted-point.com`
- `celestia-rpc.chainode.tech:33373`
- `celestia-mainnet-rpc.itrocket.net:443`

#### Community API endpoints

- `public-celestia-lcd.numia.xyz`
- `celestia-rest.mesa.newmetric.xyz`
- `api.celestia.pops.one`
- `api.lunaroasis.net`
- `api.celestia.nodestake.top`
- `celestia-rpc.brightlystake.com/api`
- `celestia.rest.stakin-nodes.com`
- `celestia.api.cumulo.org.es`
- `api-celestia.mzonder.com`
- `api-celestia-01.stakeflow.io`
- `api-celestia.alphab.ai`
- `api-celestia-full.avril14th.org`
- `celestia-lcd.easy2stake.com`
- `celestia.api.kjnodes.com`
- `api-celestia-mainnet.trusted-point.com`
- `celestia-api.chainode.tech`
- `celestia-mainnet-api.itrocket.net:443`

#### Community gRPC endpoints

- `public-celestia-grpc.numia.xyz`
- `celestia-grpc.mesa.newmetric.xyz`
- `grpc.celestia.pops.one`
- `grpc.lunaroasis.net:443`
- `grpc.celestia.nodestake.top`
- `celestia-rpc.brightlystake.com:9090`
- `celestia.grpc.stakin-nodes.com:443`
- `celestia.grpc.cumulo.org.es:443`
- `grpc-celestia.mzonder.com:443`
- `grpc-celestia-01.stakeflow.io:15002`
- `rpc-celestia.alphab.ai:9090`
- `grpc-celestia-full.avril14th.org`
- `celestia.grpc.kjnodes.com:443`
- `grpc-celestia-mainnet.trusted-point.com:9095`
- `celestia-grpc.chainode.tech:443`
- `celestia-mainnet-grpc.itrocket.net:443`

#### Community WebSocket endpoints

- `wss://celestia-ws.chainode.tech:33373/websocket`
- `wss://celestia-mainnet-ws.itrocket.net:443/websocket`
- `wss://celestia.cumulo.org.es:443/websocket`

### Data availability nodes

- [Light node](./light-node.md)
- [Bridge node](./bridge-node.md)
- [Full storage node](./full-storage-node.md)

#### Community Data availability (DA) RPC endpoints for bridge node sync

These RPC endpoints allow bridge nodes to sync blocks from the Celestia network.
For users, they will need to provide a `–core.ip string`
from a consensus node’s URL or IP that populates a default RPC port at 26657
to their respective DA node.

#### Community Data availability (DA) gRPC endpoints for state access

These gRPC endpoints for DA nodes provide state access for querying the
chain’s state and broadcasting transactions (balances, blobs, etc.) to the
Celestia network. For users, they will need to provide a `–core.ip string`
from a consensus node’s URL or IP that populates a default gRPC port at 9090
to their respective DA node.

:::tip

```bash
celestia <da_type> start --core.ip <url> -–core.grpc.port <port>
```

:::

:::tip Bridge nodes
Not all RPC endpoints guarantee the full block history.
Find [an archive endpoint on the community dashboard](https://celestia-tools.brightlystake.com/)
or run your own consensus node with no pruning for your bridge node.
:::

RPCs for DA nodes to initialise or start your celestia-node to Mainnet Beta with:

- `public-celestia-consensus.numia.xyz`
  - gRPC: port 9090
  - RPC: port 26657
- `rpc.celestia.pops.one`
  - gRPC: port 9090
  - RPC: port 26657
- `consensus.lunaroasis.net`
  - gRPC: port 9090
  - RPC: port 26657
- `rpc-celestia.alphab.ai`
  - gRPC: port 9090
  - RPC: port 26657
- `celestia-mainnet-consensus.itrocket.net`
  - gRPC: port 9090
  - RPC: port 26657

DA full and light nodes might have troubles connecting to the networks, so you
can check out this
[Grafana dashboard](https://celestia.grafana.net/public-dashboards/a10eff0043bb4bf0839004e2746e2bc6)
to see health/uptime status of DA bootstrappers (now `celestia` network only).

You can [find the status of these endpoints](https://celestia-tools.brightlystake.com/).

#### Archival DA RPC endpoints

By default, light nodes prune recent data to save on storage space. Archival
data availability (DA) nodes store the entire history of the chain without
pruning any data so all data available data is retrievable. You can
[read more about light vs archival nodes](../learn/retrievability.md).

##### Grove archival endpoints

You can [provision your own Celestia Archival endpoint on Grove](https://grove.city).
[Learn more about Celestia on Grove](https://docs.grove.city/celestia-api/intro),
or find [the fully supported spec](https://docs.grove.city/celestia-api/endpoints/celestia-archival).

There is a sandbox you can leverage for testing straight in your browser:

![grove-sandbox](/grove/grove-sandbox.png)

## Explorers

There are multiple explorers you can use for Mainnet Beta:

- [https://celenium.io](https://celenium.io)
- [https://celestia.explorers.guru](https://celestia.explorers.guru)
- [https://explorer.modular.cloud/celestia-mainnet](https://explorer.modular.cloud/celestia-mainnet)
- [https://mintscan.io/celestia](https://mintscan.io/celestia)
- [https://explorer.nodestake.top/celestia](https://explorer.nodestake.top/celestia)
- [https://stakeflow.io/celestia](https://stakeflow.io/celestia)
- [https://celestia.exploreme.pro/](https://celestia.exploreme.pro/)
- [https://mainnet.itrocket.net/celestia/](https://mainnet.itrocket.net/celestia/)

## Analytics

The following websites provide analytics for Celestia:

- [https://analytics.smartstake.io/celestia](https://analytics.smartstake.io/celestia)
- [https://alphab.ai/s/m/celestia/](https://alphab.ai/s/m/celestia/)
- [https://services.kjnodes.com/mainnet/celestia/slashboard](https://services.kjnodes.com/mainnet/celestia/slashboard)
- [https://itrocket.net/services/mainnet/celestia/decentralization/](https://itrocket.net/services/mainnet/celestia/decentralization/)
- [https://cosmoslist.co/mainnet/celestia](https://cosmoslist.co/mainnet/celestia)

## Network upgrades

There are a few ways to stay informed about network upgrades on Mainnet Beta:

- Telegram [announcement channel](https://t.me/+smSFIA7XXLU4MjJh)
- Discord [Mainnet Beta announcements](https://discord.com/channels/638338779505229824/1169237690114388039)

See the [network upgrade process page](./network-upgrade-process.md) to learn more
about specific upgrades like the [Ginger network upgrade](./network-upgrade-process.md#ginger-network-upgrade).

<!-- markdownlint-disable MD033 -->

# Mainnet Beta

<script setup>
import MainnetVersionTags from '../.vitepress/components/MainnetVersionTags.vue'
</script>

![Mainnet Beta](/img/Mainnet-Beta.png)

Welcome to the guide for Celestia’s Mainnet Beta, the production
network that marks the pinnacle of Celestia’s evolution since its
inception in 2019. This network is where all components of the
Celestia ecosystem come to life in a real-world environment.

Mainnet Beta is the culmination of rigorous community testing,
upgrades, and feedback. It serves as the platform for deploying
mainnet rollups and applications.

## Network stability and upgrades

Mainnet Beta is a stable network, but will still receive updates and
improvements. Any changes or upgrades will be coordinated with node
operators and the broader Celestia community to ensure seamless
integration and minimal service interruptions.

As we step into unexplored territories with groundbreaking technologies
like data availability sampling, it's crucial to remember that Mainnet
Beta remains experimental at this stage. While the network is live and
functional, users may encounter occasional instability or reduced performance.

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
- The amount of shares occupied by the PFB transaction share.

These factors can cause the maximum total blob size that can be included in one
block to vary.

## Integrations

This guide contains the relevant sections for how to connect to Mainnet Beta,
depending on the type of node you are running. Your best approach to
participating is to first determine which node you would like to run. Each
node’s guide will link to the relevant network in order to show you how
to connect to them. Learn about the different endpoint types
[in the Cosmos SDK documentation](https://docs.cosmos.network/v0.50/learn/advanced/grpc_rest).

Here is a list of options of the type of nodes you can run in order
to participate in Mainnet Beta:

### Consensus nodes

- [Full consensus node](./consensus-node.md)
- [Validator node](./consensus-node.md#optional-setting-up-a-validator)

#### Consensus RPC endpoints

- `public-celestia-rpc.numia.xyz`
- `celestia-rpc.mesa.newmetric.xyz`
- `rpc.celestia.pops.one`
- `rpc.lunaroasis.net`
- `rpc.celestia.nodestake.top`
- `celestia-rpc.brightlystake.com`
- `celestia-rpc.spidey.services`
- `rpc-celestia.contributiondao.com`
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
- `celestia.rpc.archives.validao.xyz`
- `rpc-archive.celestia.bitszn.com`
- `celestia-rpc.f5nodes.com`

#### API endpoints

- `public-celestia-lcd.numia.xyz`
- `celestia-rest.mesa.newmetric.xyz`
- `api.celestia.pops.one`
- `api.lunaroasis.net`
- `api.celestia.nodestake.top`
- `celestia-rpc.brightlystake.com/api`
- `celestia-api.spidey.services`
- `api-celestia.contributiondao.com`
- `celestia.rest.stakin-nodes.com`
- `celestia.api.cumulo.org.es`
- `api-celestia.mzonder.com`
- `api-celestia-01.stakeflow.io`
- `api-celestia.alphab.ai`
- `api-celestia-full.avril14th.org`
- `celestia-lcd.easy2stake.com`
- `celestia.api.kjnodes.com`
- `api-celestia-mainnet.trusted-point.com`
- `celestia.rest.archives.validao.xyz`
- `api-archive.celestia.bitszn.com`
- `celestia-api.f5nodes.com`

#### gRPC endpoints

- `public-celestia-grpc.numia.xyz`
- `celestia-grpc.mesa.newmetric.xyz`
- `grpc.celestia.pops.one`
- `grpc.lunaroasis.net:443`
- `grpc.celestia.nodestake.top`
- `celestia-rpc.brightlystake.com:9090`
- `celestia-grpc.spidey.services`
- `grpc-celestia.contributiondao.com`
- `celestia.grpc.stakin-nodes.com:443`
- `celestia.grpc.cumulo.org.es:443`
- `grpc-celestia.mzonder.com:443`
- `grpc-celestia-01.stakeflow.io:15002`
- `rpc-celestia.alphab.ai:9090`
- `grpc-celestia-full.avril14th.org`
- `celestia.grpc.kjnodes.com:443`
- `grpc-celestia-mainnet.trusted-point.com:9095`
- `celestia.grpc.archives.validao.xyz:9090`
- `gprc-archive.celestia.bitszn.com`
- `celestia-grpc.f5nodes.com`

### Data availability nodes

- [Light node](./light-node.md)
- [Bridge node](./bridge-node.md)
- [Full storage node](./full-storage-node.md)

#### DA RPC endpoints

These RPC endpoints for DA nodes are to provide state access for querying the
chain’s state and broadcasting transactions (balances, blobs, etc.) to the
Celestia network. For users, they will need to provide a `–core.ip string`
from a consensus node’s URL or IP that populates 2 ports for 2 types
(RPC and gRPC, at ports 26657 and 9090, respectively) to their respective DA
node.

:::tip

```bash
celestia <da_type> start –core.ip <url> –core.rpc.port <port> \
    –core.grpc.port <port>
```

:::

:::tip Bridge nodes
Not all of the RPC endpoints do not guarantee the full block history.
Find [an archive endpoint on the community dashboard](https://celestia-tools.brightlystake.com/)
or run your own consensus full node with no pruning for
your bridge node.
:::

RPCs for DA nodes to initialise or start your celestia-node to Mainnet Beta with:

- `public-celestia-consensus.numia.xyz`
  - gRPC: port 9090
  - RPC: port 26657
- `celestia-consensus.mesa.newmetric.xyz`
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

DA full and light nodes might have troubles connecting to the networks, so you
can checkout this
[Grafana dashboard](https://celestia.grafana.net/public-dashboards/a10eff0043bb4bf0839004e2746e2bc6)
to see health/uptime status of DA bootstrappers (now `celestia` network only).

You can [find the status of these endpoints](https://celestia-tools.brightlystake.com/).

## Explorers

There are multiple explorers you can use for Mainnet Beta:

- [https://celenium.io](https://celenium.io)
- [https://celestia.explorers.guru](https://celestia.explorers.guru)
- [https://explorer.modular.cloud/celestia-mainnet](https://explorer.modular.cloud/celestia-mainnet)
- [https://mintscan.io/celestia](https://mintscan.io/celestia)
- [https://explorer.nodestake.top/celestia](https://explorer.nodestake.top/celestia)
- [https://stakeflow.io/celestia](https://stakeflow.io/celestia)
- [https://celestia.exploreme.pro/](https://celestia.exploreme.pro/)

## Analytics

The following websites provide analytics for Celestia:

- [https://analytics.smartstake.io/celestia](https://analytics.smartstake.io/celestia)
- [https://alphab.ai/s/m/celestia/](https://alphab.ai/s/m/celestia/)
- [https://services.kjnodes.com/mainnet/celestia/slashboard](https://services.kjnodes.com/mainnet/celestia/slashboard)

## Network upgrades

Join the
[Community Telegram announcement channel](https://t.me/+smSFIA7XXLU4MjJh)
for network upgrades.

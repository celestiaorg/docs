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

## Integrations

This guide contains the relevant sections for how to connect to Mainnet Beta,
depending on the type of node you are running. Your best approach to
participating is to first determine which node you would like to run. Each
node’s guide will link to the relevant network in order to show you how
to connect to them. Learn about the different endpoint types
[in the Cosmos SDK documentation](https://docs.cosmos.network/v0.50/learn/advanced/grpc_rest).

Here is a list of options of the type of nodes you can run in order
to participate in Mainnet Beta:

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
These RPC endpoints do not guarantee the full block history. Run your own
consensus full node with no pruning for your bridge node.
:::

RPCs for DA nodes to initialise or start your celestia-node to Mainnet Beta with:

- `public-celestia-da.numia.xyz`
  - gRPC: port 9090
  - RPC: port 26657
- `celestia-consensus.mesa.newmetric.xyz`
  - gRPC: port 9090
  - RPC: port 26657
- `consensus.lunaroasis.net`
  - gRPC: port 9090
  - RPC: port 26657
- `rpc.celestia.pops.one`
  - gRPC: port 9090
  - RPC: port 26657

### Consensus nodes

- [Full consensus node](./consensus-node.md)
- [Validator node](./consensus-node.md#optional-setting-up-a-validator)

#### Consensus RPC endpoints

- `public-celestia-rpc.numia.xyz`
- `celestia-rpc.mesa.newmetric.xyz`
- `rpc.lunaroasis.net`
- `rpc.celestia.nodestake.top`
- `celestia-rpc.brightlystake.com`
- `celestia-rpc.spidey.services`
- `rpc-celestia.contributiondao.com`
- `celestia.rpc.stakin-nodes.com`
- `celestia.cumulo.org.es`

### API endpoints

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

### gRPC endpoints

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

You can [find the status of these endpoints](https://celestia-tools.brightlystake.com/).

## Explorers

There are multiple explorers you can use for Mainnet Beta:

- [https://celenium.io](https://celenium.io)
- [https://celestia.explorers.guru](https://celestia.explorers.guru)
- [https://explorer.modular.cloud/celestia-mainnet](https://explorer.modular.cloud/celestia-mainnet)
- [https://mintscan.io/celestia](https://mintscan.io/celestia)
- [https://explorer.nodestake.top/celestia](https://explorer.nodestake.top/celestia)

## Network upgrades

Join the
[Community Telegram announcement channel](https://t.me/+smSFIA7XXLU4MjJh)
for network upgrades.

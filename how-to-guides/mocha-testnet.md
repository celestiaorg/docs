---
description: Learn how to connect to the Mocha network.
---

# Mocha testnet

<!-- markdownlint-disable MD013 -->
<!-- markdownlint-disable MD033 -->
<script setup>
import constants from '/.vitepress/constants/constants.js'
import MochaVersionTags from '../.vitepress/components/MochaVersionTags.vue'
import MochaTestnetDetails from '../.vitepress/components/MochaTestnetDetails.vue'
</script>

![mocha-testnet](/img/mocha.jpg)

This guide contains the relevant sections for how to connect to Mocha,
depending on the type of node you are running. Mocha testnet is designed
to help validators test out their infrastructure and node software.
Developers are encouraged to deploy their
sovereign rollups on Mocha, but we also recommend [Arabica devnet](/how-to-guides/arabica-devnet.md)
for that as it is designed for development purposes.

Mocha is a milestone in Celestia, allowing everyone to test out
core functionalities on the network. Read [the announcement](https://blog.celestia.org/celestia-testnet-introduces-alpha-data-availability-api).
Your best approach to participating is to first determine which node
you would like to run. Each node's guide will link to the relevant networks,
to show you how to connect to them.

You have a list of options on the types of nodes you can run to
participate in Mocha:

Consensus:

- [Consensus node](/how-to-guides/consensus-node.md)
- [Validator node](/how-to-guides/validator-node.md)

Data Availability:

- [Bridge node](/how-to-guides/bridge-node.md)
- [Light node](/how-to-guides/light-node.md)

Select the type of node you would like to run and follow the instructions
on each respective page. Whenever you are asked to select the type of network
you want to connect to in those guides, select `Mocha` to refer
to the correct instructions on this page on how to connect to Mocha.

## Network details

<MochaTestnetDetails/>

## Software version numbers

<MochaVersionTags/>

## Network status

For real-time network status information, including uptime, incident reports,
and service availability, visit the
[official Celestia Mocha testnet status page](https://status.celestia.dev/status/mocha).

## RPC for DA bridge, full, and light nodes

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

:::warning
Do not rely on the free community endpoints listed below
for production deployments. Production deployments should rely
on [service providers with SLAs](#production-rpc-endpoints) or
your own node.
:::

### Node setup and tools

Several community providers offer comprehensive node setup tools, installation scripts, and monitoring services to help node operators get started quickly:

| Provider | Installation guide                                             | State sync                                                    | Monitoring tools                                                |
| -------- | -------------------------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------- |
| ITRocket | [Setup guide](https://itrocket.net/services/testnet/celestia/) | [State sync](https://itrocket.net/services/testnet/celestia/) | [Chain status](https://itrocket.net/services/testnet/celestia/) |

### Community bridge node endpoints

You can also find the list of official Celestia bootstrappers in the [celestia-node GitHub repository](https://github.com/celestiaorg/celestia-node/blob/a87a17557223d88231b56d323d22ac9da31871db/nodebuilder/p2p/bootstrap.go#L39).

### Community Data availability (DA) RPC endpoints for bridge node sync

These RPC endpoints allow bridge nodes to sync blocks from the Celestia network.
For users, they will need to provide a `–core.ip string`
from a consensus node's URL or IP that populates a default RPC port at 26657
to their respective DA node.

### Community Data availability (DA) gRPC endpoints for state access

These gRPC endpoints for DA nodes provide state access for querying the
chain's state and broadcasting transactions (balances, blobs, etc.) to the
Celestia network. For users, they will need to provide a `–core.ip string`
from a consensus node's URL or IP that populates a default gRPC port at 9090
to their respective DA node.

:::tip Bridge nodes
Mentioned below RPC endpoints do not guarantee you the download of full blocks from
them. We advise that if you are running a bridge node, that you also
run a local [consensus node](/how-to-guides/consensus-node.md) in order to download
full blocks from it.
:::

- `public-celestia-mocha4-consensus.numia.xyz`
- `full.consensus.{{constants.mochaChainId}}.celestia-mocha.com`
- `consensus-full-{{constants.mochaChainId}}.celestia-mocha.com`
- `rpc-mocha.pops.one`
- `celestia-testnet-consensus.itrocket.net`
  - RPC port: 26657
  - gRPC port: 9090
- `celestia-mocha-archive-rpc.mzonder.com`
  - RPC port: 26657
  - gRPC port: 9090

## Community RPC endpoints

The RPC endpoint is to allow users to interact with Celestia's nodes by
querying the node's state and broadcasting transactions on the
Celestia network. The default port is 26657.

- `public-celestia-mocha4-consensus.numia.xyz:26657`
- `celestia-testnet.brightlystake.com`
- `rpc-celestia-mocha.trusted-point.com`
- `rpc-celestia-testnet-01.stakeflow.io`
- `mocha.celestia.rpc.cumulo.me`
- `rpc.archive.mocha.cumulo.com.es`
- `rpc-1.testnet.celestia.nodes.guru`
- `rpc-2.testnet.celestia.nodes.guru`
- `celestia-testnet-rpc.itrocket.net:443`
- `celestia-t-rpc.noders.services`
- `rpc-celestia-testnet.mzonder.com:443`
- `celestia-testnet-da-archival.rpc.grove.city/v1/c33eeadb`

## Community API endpoints

The API endpoint is to allow users to interact with the REST API in Cosmos
SDK which is implemented using gRPC-gateway, which exposes gRPC endpoints
as REST endpoints. This allows for communication with the node using REST
calls, which can be useful if the client does not support gRPC or HTTP2.
The default port is 1317.

- `https://api-mocha.pops.one`
- `https://api.celestia-mocha.com/`
- `https://celestia-testnet.brightlystake.com/api`
- `https://api-celestia-mocha.trusted-point.com`
- `https://api-celestia-testnet-01.stakeflow.io/`
- `https://mocha.api.cumulo.me/`
- `https://api.archive.mocha.cumulo.com.es`
- `https://api-1.testnet.celestia.nodes.guru`
- `https://api-2.testnet.celestia.nodes.guru`
- `https://celestia-testnet-api.itrocket.net`
- `https://celestia-t-api.noders.services`
- `http://celestiam.rest.lava.build`
- `https://api-celestia-testnet.mzonder.com:443`
- `https://celestia-testnet-da-archival.rpc.grove.city/v1/c33eeadb`

## Community gRPC endpoints

The gRPC endpoint is to allow users to interact with a Celestia Node using
gRPC, a modern open-source and high-performance RPC framework. The default
port is 9090. In the Cosmos SDK, gRPC is used to define state queries and
broadcast transactions.

- `public-celestia-mocha4-consensus.numia.xyz:9090`
- `grpc-mocha.pops.one`
- `grpc.celestia-mocha.com:443`
- `full.consensus.{{constants.mochaChainId}}.celestia-mocha.com:9090`
- `consensus-full-{{constants.mochaChainId}}.celestia-mocha.com:9090`
- `celestia-testnet.brightlystake.com:9390`
- `grpc-celestia-mocha.trusted-point.com:9099`
- `grpc-celestia-testnet-01.stakeflow.io:16002`
- `mocha.grpc.cumulo.me:443`
- `grpc.archive.mocha.cumulo.com.es:443`
- `grpc-1.testnet.celestia.nodes.guru:10790`
- `grpc-2.testnet.celestia.nodes.guru:10790`
- `celestia-testnet-grpc.itrocket.net:443`
- `celestia-t-grpc.noders.services:21090`
- `celestiam.grpc.lava.build:443`
- `grpc-celestia-testnet.mzonder.com:443`

## Community JSON-RPC Endpoints

- `celestiam.jsonrpc.lava.build`
- `celestia-testnet-da-archival.rpc.grove.city/v1/c33eeadb`

## Community Tendermint RPC Endpoints

- `celestiam.tendermintrpc.lava.build`

## Community bridge node endpoints

The endpoints below are for bridge nodes only. They can be used to
find bootstrapper peers in the p2p network.

Bridge node 1:

- da-bridge-{{constants.mochaChainId}}.celestia-mocha.com
- bridge-{{constants.mochaChainId}}.da.celestia-mocha.com

Bridge node 2:

- da-bridge-{{constants.mochaChainId}}-2.celestia-mocha.com
- bridge-{{constants.mochaChainId}}-2.da.celestia-mocha.com

## Mocha testnet faucet

:::danger WARNING
USING THIS FAUCET DOES NOT ENTITLE YOU TO ANY AIRDROP OR OTHER DISTRIBUTION OF
MAINNET CELESTIA TOKENS.
:::

### Discord

You can request from Mocha testnet Faucet on the #mocha-faucet channel on
Celestia's Discord server with the following command:

```text
$request <CELESTIA-ADDRESS>
```

Where `<CELESTIA-ADDRESS>` is a `celestia1******` generated address.

:::tip NOTE
Faucet has a limit of 10 tokens per week per address/Discord ID.
:::

### Web

The web faucet is available at [https://mocha.celenium.io/faucet](https://mocha.celenium.io/faucet).

## Analytics

The following websites provide analytics for Mocha Testnet:

- <https://cosmoslist.co/testnet/celestia>
- [https://itrocket.net/services/testnet/celestia/](https://itrocket.net/services/testnet/celestia/) - Node setup, monitoring, and chain status tools

## Node maps

The following websites provide visual maps of Celestia DA nodes:

- [https://validao.xyz/#maps-celestia-testnet-da](https://validao.xyz/#maps-celestia-testnet-da) (community contribution)

## Explorers

There are several explorers you can use for Mocha:

- `https://mintscan.io/celestia-testnet/`
- `https://mocha.celenium.io`
- `https://explorer.nodestake.top/celestia-testnet/`
- `https://stakeflow.io/celestia-testnet`
- `https://testnet.celestia.explorers.guru`
- `https://testnet.itrocket.net/celestia`
- `https://testnet.celestia.valopers.com/`
- `https://explorer.chainroot.io/celestia-testnet-mocha4`

## Network upgrades

There are a few ways to stay informed about network upgrades on the Mocha testnet:

- Telegram [announcement channel](https://t.me/+smSFIA7XXLU4MjJh)
- Discord [Mocha announcements](https://discord.com/channels/638338779505229824/979037494735691816)

See the [network upgrade process page](/how-to-guides/network-upgrade-process.md) to learn more
about specific upgrades like the [Ginger network upgrade](/how-to-guides/network-upgrade-process.md#ginger-network-upgrade).

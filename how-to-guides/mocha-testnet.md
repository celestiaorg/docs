---
description: Learn how to connect to the Mocha network.
---

# Mocha testnet

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
- [Full storage node](/how-to-guides/full-storage-node.md)
- [Light node](/how-to-guides/light-node.md)

Select the type of node you would like to run and follow the instructions
on each respective page. Whenever you are asked to select the type of network
you want to connect to in those guides, select `Mocha` to refer
to the correct instructions on this page on how to connect to Mocha.

<!-- markdownlint-disable MD033 -->
<script setup>
import MochaVersionTags from '../.vitepress/components/MochaVersionTags.vue'
import MochaTestnetDetails from '../.vitepress/components/MochaTestnetDetails.vue'
</script>

## Network details

<MochaTestnetDetails/>

## Software version numbers

<MochaVersionTags/>

## RPC for DA bridge, full, and light nodes

### Production RPC endpoints

<!-- markdownlint-disable MD013 -->
<!-- markdownlint-disable MD034 -->

These RPC providers are meant to be used in production environments.

| Provider | URL |
|--------|--------|
| Numia | For RPC access: <https://docs.numia.xyz/infra/overview/getting-started> |
| Numia | For data warehouse access: <https://docs.numia.xyz/sql/querying-data/chains/celestia> |
| Grove | <https://www.grove.city/> |

:::warning
Do not rely on the free community endpoints listed below
for production deployments. Production deployments should rely
on [service providers with SLAs](#production-rpc-endpoints) or
your own node.
:::

### Community Data availability (DA) RPC endpoints for bridge node sync

These RPC endpoints allow bridge nodes to sync blocks from the Celestia network.
For users, they will need to provide a `–core.ip string`
from a consensus node’s URL or IP that populates a default RPC port at 26657
to their respective DA node.

### Community Data availability (DA) gRPC endpoints for state access

These gRPC endpoints for DA nodes provide state access for querying the
chain’s state and broadcasting transactions (balances, blobs, etc.) to the
Celestia network. For users, they will need to provide a `–core.ip string`
from a consensus node’s URL or IP that populates a default gRPC port at 9090
to their respective DA node.

:::tip Bridge nodes
Mentioned below RPC endpoints do not guarantee you the download of full blocks from
them. We advise that if you are running a bridge node, that you also
run a local [consensus node](/how-to-guides/consensus-node.md) in order to download
full blocks from it.
:::

- `public-celestia-mocha4-consensus.numia.xyz`
- `full.consensus.mocha-4.celestia-mocha.com`
- `consensus-full-mocha-4.celestia-mocha.com`
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
- `http://api-celestia-testnet.mzonder.com:443`

## Community gRPC endpoints

The gRPC endpoint is to allow users to interact with a Celestia Node using
gRPC, a modern open-source and high-performance RPC framework. The default
port is 9090. In the Cosmos SDK, gRPC is used to define state queries and
broadcast transactions.

- `public-celestia-mocha4-consensus.numia.xyz:9090`
- `grpc-mocha.pops.one`
- `grpc.celestia-mocha.com:443`
- `full.consensus.mocha-4.celestia-mocha.com:9090`
- `consensus-full-mocha-4.celestia-mocha.com:9090`
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

## Community Tendermint RPC Endpoints

- `celestiam.tendermintrpc.lava.build`


## Community bridge and full node endpoints

The endpoints below are for bridge and full nodes only. They can be used to
find bootstrapper peers in the p2p network.

Bridge node 1:

- da-bridge-mocha-4.celestia-mocha.com
- bridge-mocha-4.da.celestia-mocha.com

Bridge node 2:

- da-bridge-mocha-4-2.celestia-mocha.com
- bridge-mocha-4-2.da.celestia-mocha.com

Full node 1:

- da-full-1-mocha-4.celestia-mocha.com
- full-1-mocha-4.da.celestia-mocha.com

Full node 2:

- da-full-2-mocha-4.celestia-mocha.com
- full-2-mocha-4.da.celestia-mocha.com
- celestia-testnet-da-full-storage.mzonder.com
  - RPC port: 27758
  - Gateway port: 27759

## Mocha testnet faucet

:::danger WARNING
USING THIS FAUCET DOES NOT ENTITLE YOU TO ANY AIRDROP OR OTHER DISTRIBUTION OF
MAINNET CELESTIA TOKENS. THERE ARE NO PUBLIC SALES OF ANY MAINNET CELESTIA
TOKENS.
:::

You can request from Mocha testnet Faucet on the #mocha-faucet channel on
Celestia's Discord server with the following command:

```text
$request <CELESTIA-ADDRESS>
```

Where `<CELESTIA-ADDRESS>` is a `celestia1******` generated address.

:::tip NOTE
Faucet has a limit of 10 tokens per week per address/Discord ID.
:::

## Analytics

The following websites provide analytics for Mocha Testnet:

- <https://cosmoslist.co/testnet/celestia>

## Explorers

There are several explorers you can use for Mocha:

- `https://testnet.mintscan.io/celestia-testnet`
- `https://mocha.celenium.io`
- `https://explorer.nodestake.top/celestia-testnet/`
- `https://stakeflow.io/celestia-testnet`
- `https://testnet.celestia.explorers.guru`
- `https://testnet.itrocket.net/celestia`
- `https://testnet.celestia.valopers.com/`

## Network upgrades

There are a few ways to stay informed about network upgrades on the Mocha testnet:

- Telegram [announcement channel](https://t.me/+smSFIA7XXLU4MjJh)
- Discord [Mocha announcements](https://discord.com/channels/638338779505229824/979037494735691816)

See the [network upgrade process page](/how-to-guides/network-upgrade-process.md) to learn more
about specific upgrades like the [Ginger network upgrade](/how-to-guides/network-upgrade-process.md#ginger-network-upgrade).

---
description: Learn how to connect to the Mocha network.
---

# Mocha testnet

![mocha-testnet](/img/mocha.jpg)

This guide contains the relevant sections for how to connect to Mocha,
depending on the type of node you are running. Mocha testnet is designed
to help validators test out their infrastructure and node software.
Developers are encouraged to deploy their
sovereign rollups on Mocha, but we also recommend [Arabica devnet](./arabica-devnet.md)
for that as it is designed for development purposes.

Mocha is a milestone in Celestia, allowing everyone to test out
core functionalities on the network. Read [the announcement](https://blog.celestia.org/celestia-testnet-introduces-alpha-data-availability-api).
Your best approach to participating is to first determine which node
you would like to run. Each node's guide will link to the relevant networks
in order to show you how to connect to them.

You have a list of options on the type of nodes you can run in order to
participate in Mocha:

Consensus:

- [Full consensus node](./consensus-node.md)
- [Validator node](./consensus-node.md#optional-setting-up-a-validator)

Data Availability:

- [Bridge node](./bridge-node.md)
- [Full storage node](./full-storage-node.md)
- [Light node](./light-node.md)

Select the type of node you would like to run and follow the instructions
on each respective page. Whenever you are asked to select the type of network
you want to connect to in those guides, select `Mocha` in order to refer
to the correct instructions on this page on how to connect to Mocha.

## Software version numbers

<!-- markdownlint-disable MD033 -->
<script setup>
import MochaVersionTags from '../.vitepress/components/MochaVersionTags.vue'
</script>

<MochaVersionTags/>

Below is a list of RPC endpoints you can use to connect to Mocha testnet:

## RPC for DA bridge, full, and light nodes

These RPC endpoints for DA nodes are to provide state access for querying the
chain’s state and broadcasting transactions (balances, blobs, etc.) to the
Celestia network. For users, they will need to provide a `–core.ip string`
from a consensus node’s URL or IP that populates 2 ports for 2 types
(RPC and gRPC, at ports 26657 and 9090, respectively) to their respective DA
node.

:::tip Bridge nodes
Mentioned below RPC endpoints do not guarantee you the download of full blocks from
them. We advise that if you are running a bridge node, that you also
run a local [full consensus node](./consensus-node.md) in order to download
full blocks from it.
:::

- `full.consensus.mocha-4.celestia-mocha.com`
- `consensus-full-mocha-4.celestia-mocha.com`
- `rpc-mocha.pops.one`

## RPC endpoints

The RPC endpoint is to allow users to interact with Celestia's nodes by
querying the node's state and broadcasting transactions on the
Celestia network. The default port is 26657.

- `rpc.celestia-mocha.com`
- `rpc-2.celestia-mocha.com`
- `celestia-rpc.f5nodes.com`
- `celestia-testnet.brightlystake.com`
- `rpc-celestia-mocha.architectnodes.com`
- `rpc-celestia-mocha.trusted-point.com`
- `rpc-celestia-testnet-01.stakeflow.io`
- `mocha.celestia.rpc.cumulo.me`
- `rpc-mocha-4.spidey.services`
- `rpc-mocha-full.avril14th.org`
- `rpc.mocha.bitszn.com`

## API endpoints

The API endpoint is to allow users to interact with the REST API in Cosmos
SDK which is implemented using gRPC-gateway, which exposes gRPC endpoints
as REST endpoints. This allows for communication with the node using REST
calls, which can be useful if the client does not support gRPC or HTTP2.
The default port is 1317.

- [https://api-mocha.pops.one](https://api-mocha.pops.one)
- [https://api.celestia-mocha.com/](https://api.celestia-mocha.com/)
- [https://api-2.celestia-mocha.com/](https://api-2.celestia-mocha.com/)
- [https://celestia-api.f5nodes.com](https://celestia-api.f5nodes.com)
- [https://celestia-testnet.brightlystake.com/api](https://celestia-testnet.brightlystake.com/api)
- [https://rest-celestia-mocha.architectnodes.com](https://rest-celestia-mocha.architectnodes.com)
- [https://api-celestia-mocha.trusted-point.com](https://api-celestia-mocha.trusted-point.com)
- [https://api-celestia-testnet-01.stakeflow.io/](https://api-celestia-testnet-01.stakeflow.io/)
- [https://mocha.api.cumulo.me/](https://mocha.api.cumulo.me/)
- [http://api-mocha-4.spidey.services](http://api-mocha-4.spidey.services)
- [https://api-mocha-full.avril14th.org](https://api-mocha-full.avril14th.org)
- [https://api.mocha.bitszn.com ](https://api.mocha.bitszn.com)

## gRPC endpoints

The gRPC endpoint is to allow users to interact with a Celestia Node using
gRPC, a modern open-source and high-performance RPC framework. The default
port is 9090. In the Cosmos SDK, gRPC is used to define state queries and
broadcast transactions.

- `grpc-mocha.pops.one`
- `grpc.celestia-mocha.com:443`
- `grpc-2.celestia-mocha.com:443`
- `full.consensus.mocha-4.celestia-mocha.com:9090`
- `consensus-full-mocha-4.celestia-mocha.com:9090`
- `celestia-grpc.f5nodes.com`
- `celestia-testnet.brightlystake.com:9390`
- `grpc-celestia-mocha.architectnodes.com:1443`
- `grpc-celestia-mocha.trusted-point.com:9099`
- `grpc-celestia-testnet-01.stakeflow.io:16002`
- `mocha.grpc.cumulo.me:443`
- `grpc-mocha-4.spidey.services`
- `grpc-mocha-full.avril14th.org`
- `grpc.mocha.bitszn.com`

## Bridge and full node endpoints

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

## Explorers

There are several explorers you can use for Mocha:

- [https://testnet.mintscan.io/celestia-testnet](https://testnet.mintscan.io/celestia-testnet)
- [https://celestiascan.com](https://celestiascan.com)
- [https://mocha.celenium.io](https://mocha.celenium.io)
- [https://explorer.nodestake.top/celestia-testnet/](https://explorer.nodestake.top/celestia-testnet)
- [https://stakeflow.io/celestia-testnet](https://stakeflow.io/celestia-testnet)

## Network upgrades

Join our [Telegram announcement channel](https://t.me/+smSFIA7XXLU4MjJh)
for network upgrades.

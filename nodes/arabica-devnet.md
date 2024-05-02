---
description: A guide to Arabica devnet.
---

# Arabica devnet

![arabica-devnet](/img/arabica-devnet.png)

Arabica devnet is a testnet from Celestia Labs that is focused
exclusively on providing developers with enhanced performance and
the latest upgrades for testing their rollups and applications.

Arabica does not focus on validator or consensus-level testing, rather,
that is what Mocha testnet is used for. If you are a validator, we
recommend testing your validator operations on the
[Mocha testnet](./mocha-testnet.md).

## Network stability and upgrades

Arabica has the latest updates from all Celestia's products deployed
on it, it can be subject to many changes. Therefore, as a fair warning,
Arabica can break unexpectedly, but given it will be continuously updated,
it is a useful way to keep testing the latest changes in the software.

Developers can still deploy on Mocha testnet their sovereign rollups if they
chose to do so, it just will always lag behind Arabica devnet until Mocha
undergoes Hardfork Upgrades in coordination with Validators.

## Network details

<!-- markdownlint-disable MD033 -->
<script setup>
import ArabicaVersionTags from '../.vitepress/components/ArabicaVersionTags.vue'
import ArabicaDevnetDetails from '../.vitepress/components/ArabicaDevnetDetails.vue'
import constants from "/.vitepress/constants/constants.js";
</script>

<ArabicaDevnetDetails />

### Software version numbers

<ArabicaVersionTags/>

## Integrations

This guide contains the relevant sections for how to connect to Arabica
devnet, depending on the type of node you are running. Your best
approach to participating is to first determine which node you would
like to run. Each node’s guide will link to the relevant network in
order to show you how to connect to them. Learn about the different
endpoint types [in the Cosmos SDK documentation](https://docs.cosmos.network/v0.50/learn/advanced/grpc_rest).

### RPC endpoints

RPC endpoints and types of nodes you can run
in order to participate in Arabica devnet:

<!-- markdownlint-disable MD013 -->

| Node type                                                                              | Endpoint type                    | Endpoint                                                                                                      |
| -------------------------------------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Consensus nodes** ([full](../nodes/full-consensus-node.md))                               | Consensus RPC                    | `https://rpc.celestia-arabica-11.com`                                                                         |
|                                                                                        | API                              | `https://api.celestia-arabica-11.com`                                                                         |
|                                                                                        | gRPC                             | `grpc.celestia-arabica-11.com:443`                                                                            |
|                                                                                        | Direct endpoints with open ports | Open ports: 26656 (p2p), 26657 (RPC), 1317 (API), 9090 (GRPC)                                                 |
|                                                                                        |                                  | `validator-1.celestia-arabica-11.com`                                                                         |
|                                                                                        |                                  | `validator-2.celestia-arabica-11.com`                                                                         |
|                                                                                        |                                  | `validator-3.celestia-arabica-11.com`                                                                         |
|                                                                                        |                                  | `validator-4.celestia-arabica-11.com`                                                                         |
|                                                                                        |                                  |                                                                                                               |
| **Data availability nodes**                                                            | DA Bridge Node Endpoints         | `/dns4/da-bridge-1.celestia-arabica-11.com/tcp/2121/p2p/12D3KooWGqwzdEqM54Dce6LXzfFr97Bnhvm6rN7KM7MFwdomfm4S` |
| ([light](./light-node.md), [bridge](./bridge-node.md), [full](./full-storage-node.md)) |                                  | `/dns4/da-bridge-2.celestia-arabica-11.com/tcp/2121/p2p/12D3KooWCMGM5eZWVfCN9ZLAViGfLUWAfXP5pCm78NFKb9jpBtua` |
|                                                                                        |                                  | `/dns4/da-bridge-3.celestia-arabica-11.com/tcp/2121/p2p/12D3KooWEWuqrjULANpukDFGVoHW3RoeUU53Ec9t9v5cwW3MkVdQ` |
|                                                                                        |                                  | `/dns4/da-bridge-4.celestia-arabica-11.com/tcp/2121/p2p/12D3KooWLT1ysSrD7XWSBjh7tU1HQanF5M64dHV6AuM6cYEJxMPk` |
|                                                                                        | `--core.ip string` endpoints     | Refer to "Direct endpoints with open ports" above                                                             |

<!-- markdownlint-enable MD013 -->

You can [find the status of these endpoints](https://celestia-tools.brightlystake.com/).

### Using consensus endpoints with DA nodes

A consensus gRPC endpoint is used to provide DA nodes with state access for
querying the chain’s state and broadcasting transactions (balances, blobs,
etc.) to the Celestia network.

Developers will need to provide a
`–core.ip string` from a consensus node’s URI or an IP that populates
a port for gRPC at 9090 to their respective DA node.

:::tip EXAMPLE

```bash
celestia <da_type> start –core.ip <url> \
    –core.grpc.port <port> \
```

:::

RPCs for DA nodes to initialise or start your celestia-node to
Arabica devnet with can be found in the table in the
"Direct endpoints with open ports" section above.

As an example, this command will work to start a light node with
state access, using default ports:

```bash
celestia light start --p2p.network arabica \
  --core.ip validator-1.celestia-arabica-11.com
```

:::tip Bridge node runners
Not all of the RPC endpoints do not guarantee the full block history.
Find [an archive endpoint on the community dashboard](https://celestia-tools.brightlystake.com/)
or run your own full consensus node with no pruning for
your bridge node.
:::

## Arabica devnet faucet

:::danger WARNING
USING THIS FAUCET DOES NOT ENTITLE YOU TO ANY AIRDROP OR OTHER DISTRIBUTION OF
MAINNET CELESTIA TOKENS. THERE ARE NO PUBLIC SALES OF ANY MAINNET CELESTIA
TOKENS.
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

The web faucet is available at [https://faucet.celestia-arabica-11.com/](https://faucet.celestia-arabica-11.com/).

## Explorers

There are multiple explorers you can use for Arabica:

- [https://arabica.celenium.io](https://arabica.celenium.io)
- [https://explorer.celestia-arabica-11.com](https://explorer.celestia-arabica-11.com)
- [https://celestiascan.com](https://celestiascan.com)

## Network upgrades

Join our [Telegram announcement channel](https://t.me/+smSFIA7XXLU4MjJh)
for network upgrades.

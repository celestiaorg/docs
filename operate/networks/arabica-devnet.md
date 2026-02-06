# Arabica devnet

![arabica-devnet](/img/arabica-devnet.png)

Arabica devnet is a testnet from Celestia Labs that is focused
exclusively on providing developers with enhanced performance and
the latest upgrades for testing their rollups and applications.

Arabica does not focus on validator or consensus-level testing, rather,
that is what Mocha testnet is used for. If you are a validator, we
recommend testing your validator operations on the
[Mocha testnet](/operate/networks/mocha-testnet).

## Network stability and upgrades

Arabica has the latest updates from all Celestia's products deployed
on it, it can be subject to many changes. Therefore, as a fair warning,
Arabica can break unexpectedly, but given it will be continuously updated,
it is a useful way to keep testing the latest changes in the software.

Developers can still deploy on Mocha testnet their sovereign rollups if they
chose to do so, it just will always lag behind Arabica devnet until Mocha
undergoes network upgrades in coordination with validators.

## Network details

| Detail        | Value                                                                                                  |
| ------------- | ------------------------------------------------------------------------------------------------------ |
| Chain ID      | `arabica-11`                                                                                      |
| Genesis hash  | `27122593765E07329BC348E8D16E92DCB4C75B34CCCB35C640FD7A4484D4C711`                                     |
| Genesis file  | https://github.com/celestiaorg/networks/blob/master/arabica-11/genesis.json                       |
| Peers file    | https://github.com/celestiaorg/networks/blob/master/arabica-11/peers.txt                          |
| Validators    | 4                                                                                                      |

### Software version numbers

| Software       | Version                                                                  |
| -------------- | ------------------------------------------------------------------------ |
| celestia-node  | [v0.28.5-arabica](https://github.com/celestiaorg/celestia-node/releases/tag/v0.28.5-arabica) |
| celestia-app   | [v6.4.10-arabica](https://github.com/celestiaorg/celestia-app/releases/tag/v6.4.10-arabica)   |

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

These RPC providers are meant to be used in production environments
and for specific use cases that require reliable access to full block
history, such as:

- Running Bridge Nodes that download data from core RPC endpoints
- Applications that need Bridge Node endpoints with guaranteed uptime and SLAs
- Submitting blobs in production settings (free RPC endpoints have no guarantees, even for submitting transactions)

| Provider | URL                                                                                   |
| -------- | ------------------------------------------------------------------------------------- |
| Numia    | For RPC access: [docs.numia.xyz/infra/overview/getting-started](https://docs.numia.xyz/infra/overview/getting-started)               |
| Numia    | For data warehouse access: [docs.numia.xyz/sql/querying-data/chains/celestia](https://docs.numia.xyz/sql/querying-data/chains/celestia) |
| Grove    | [https://www.grove.city/](https://www.grove.city/)                                                             |

### Community RPC endpoints

> **Warning:** Do not rely on the free community endpoints listed below for production deployments. Production deployments should rely on [service providers with SLAs](#production-rpc-endpoints) or your own node.

RPC endpoints and types of nodes you can run in order to participate in Arabica devnet:

| Node type                                                        | Endpoint type                    | Endpoint                                                                                                                                                                                                               |
| ---------------------------------------------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Consensus nodes** ([full guide](/operate/consensus-validators/consensus-node)) | Consensus RPC                    | `https://rpc.celestia-arabica-11.com`                                                                                                                                                                                 |
|                                                                  | API                              | `https://api.celestia-arabica-11.com`                                                                                                                                                                                 |
|                                                                  | gRPC                             | `grpc.celestia-arabica-11.com:443`                                                                                                                                                                                    |
|                                                                  | Direct endpoints with open ports | Open ports: 26656 (p2p), 26657 (RPC), 1317 (API), 9090 (GRPC)                                                                                                                                                          |
|                                                                  |                                  | `validator-1.celestia-arabica-11.com`                                                                                                                                                                                 |
|                                                                  |                                  | `validator-2.celestia-arabica-11.com`                                                                                                                                                                                 |
|                                                                  |                                  | `validator-3.celestia-arabica-11.com`                                                                                                                                                                                 |
|                                                                  |                                  | `validator-4.celestia-arabica-11.com`                                                                                                                                                                                 |
|                                                                  |                                  |                                                                                                                                                                                                                        |
| **Data availability nodes**                                      | DA Bridge Node Endpoints         | See the list of official Celestia bootstrappers in the [celestia-node GitHub repository](https://github.com/celestiaorg/celestia-node/blob/a87a17557223d88231b56d323d22ac9da31871db/nodebuilder/p2p/bootstrap.go#L39). |
|                                                                  | `--core.ip string` endpoints     | Refer to "Direct endpoints with open ports" above                                                                                                                                                                      |

You can [find the status of these endpoints](https://celestia-tools.brightlystake.com/).

### Using consensus endpoints with DA nodes

#### Data availability (DA) RPC endpoints for bridge node sync

These RPC endpoints allow bridge nodes to sync blocks from the Celestia network.
For users, they will need to provide a `–core.ip string`
from a consensus node’s URL or IP that populates a default RPC port at 26657
to their respective DA node.

#### Data availability (DA) gRPC endpoints for state access

These gRPC endpoints for DA nodes provide state access for querying the
chain’s state and broadcasting transactions (balances, blobs, etc.) to the
Celestia network. For users, they will need to provide a `–core.ip string`
from a consensus node’s URL or IP that populates a default gRPC port at 9090
to their respective DA node.

RPCs for DA nodes to initialise or start your celestia-node to
Arabica devnet with can be found in the table in the
"Direct endpoints with open ports" section above.

As an example, this command will work to start a light node with state access, using default ports:

```bash
celestia light start --p2p.network arabica \
  --core.ip validator-1.celestia-arabica-11.com \
  --core.port 9090
```

## Arabica devnet faucet

> **Warning:** Using this faucet does not entitle you to any airdrop or other distribution of mainnet Celestia tokens.

### Discord

You can request from Arabica devnet Faucet on the #arabica-faucet channel on
Celestia's Discord server with the following command:

```text
$request <CELESTIA-ADDRESS>
```

Where `<CELESTIA-ADDRESS>` is a `celestia1******` generated address.

> **Note:** Faucet has a limit of 10 tokens per week per address/Discord ID.

### Web

The web faucet is available at [https://arabica.celenium.io/faucet](https://arabica.celenium.io/faucet) and [https://faucet.celestia-arabica-11.com/](https://faucet.celestia-arabica-11.com/).

## Explorers

There are multiple explorers you can use for Arabica:

- [https://arabica.celenium.io](https://arabica.celenium.io)
- [https://explorer.celestia-arabica-11.com](https://explorer.celestia-arabica-11.com)

## Network upgrades

Join our [Telegram announcement channel](https://t.me/+smSFIA7XXLU4MjJh)
for network upgrades.

See the [network upgrade process page](/operate/maintenance/network-upgrades) to learn more
about specific upgrades like the [Ginger network upgrade](/operate/maintenance/network-upgrades#ginger-network-upgrade).
---
sidebar_label: Arabica devnet
---

# Arabica devnet
<!-- markdownlint-disable MD013 -->

![arabica-devnet](/img/arabica-devnet.png)

Arabica Devnet is a new testnet from Celestia Labs that is focused
exclusively on providing developers with enhanced performance and
the latest upgrades for testing their rollups and applications.

Arabica does not focus on validator or consensus-level testing, rather,
that is what Mocha Testnet is used for. If you are a validator, we
recommend just testing your validator operations on Mocha [here](./mocha-testnet.md).

With Arabica having the latest updates from all Celestia's products deployed
on it, it can be subject to many changes. Therefore, as a fair warning,
Arabica can break unexpectedly but given it will be continuously updated,
it is a useful way to keep testing the latest changes in the software.

Developers can still deploy on Mocha Testnet their sovereign rollups if they
chose to do so, it just will always lag behind Arabica Devnet until Mocha
undergoes Hardfork Upgrades in coordination with Validators.

## Integrations

This guide contains the relevant sections for how to connect to Arabica,
depending on the type of node you are running.

Your best approach to participating is to first determine which node
you would like to run. Each node guides will link to the relevant network
in order to show you how to connect to them.

You have a list of options on the type of nodes you can run in order to
participate in Arabica:

Data Availability:

* [Bridge Node](./bridge-node.mdx)
* [Full Storage Node](./full-storage-node.mdx)
* [Light Node](./light-node.mdx)

Select the type of node you would like to run and follow the instructions
on each respective page. Whenever you are asked to select the type of network
you want to connect to in those guides, select `Arabica` in order to refer
to the correct instructions on this page on how to connect to Arabica.

## RPC endpoints

The RPC endpoint is to allow users to interact with Celestia's nodes by
querying the node's state and broadcasting transactions on the
Celestia network. The default port is 26657.

Below is a list of RPC endpoints you can use to connect to Arabica Devnet:

* [https://rpc.limani.celestia-devops.dev](https://rpc.limani.celestia-devops.dev)

## API endpoints

The API endpoint is to allow users to interact with the REST API in Cosmos
SDK which is implemented using gRPC-gateway, which exposes gRPC endpoints
as REST endpoints. This allows for communication with the node using REST
calls, which can be useful if the client does not support gRPC or HTTP2.
The default port is 1317.

* [https://api.limani.celestia-devops.dev](https://api.limani.celestia-devops.dev)

## gRPC endpoints

The gRPC endpoint is to allow users to interact with a celestia-node using
gRPC, a modern open-source and high-performance RPC framework. The default
port is 9090. In the Cosmos SDK, gRPC is used to define state queries and
broadcast transactions.

* [https://grpc.limani.celestia-devops.dev](https://grpc.limani.celestia-devops.dev)

## Arabica devnet faucet

> USING THIS FAUCET DOES NOT ENTITLE YOU TO ANY AIRDROP OR OTHER
  DISTRIBUTION OF MAINNET CELESTIA TOKENS. MAINNET CELESTIA TOKENS
  DO NOT CURRENTLY EXIST AND THERE ARE NO PUBLIC SALES OR OTHER PUBLIC
  DISTRIBUTIONS OF ANY MAINNET CELESTIA TOKENS.

You can request from Arabica Devnet Faucet on the #arabica-faucet channel on
Celestia's Discord server with the following command:

```text
$request <CELESTIA-ADDRESS>
```

Where `<CELESTIA-ADDRESS>` is a `celestia1******` generated address.

> Note: Faucet has a limit of 10 tokens per week per address/Discord ID

## Explorers

There is an explorer you can use for Arabica:

* [https://explorer.celestia.tools/arabica](https://explorer.celestia.tools/arabica/)

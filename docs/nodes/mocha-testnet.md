---
sidebar_label: Mocha testnet
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
core functionalities on the network. Read the announcement [here](https://blog.celestia.org/celestia-testnet-introduces-alpha-data-availability-api).
Your best approach to participating is to first determine which node
you would like to run. Each node guides will link to the relevant network
in order to show you how to connect to them.

You have a list of options on the type of nodes you can run in order to
participate in Mocha:

Consensus:

* [Validator node](./validator-node.md)
* [Consensus full node](./consensus-full-node.md)

Data Availability:

* [Bridge node](./bridge-node.mdx)
* [Full storage node](./full-storage-node.mdx)
* [Light node](./light-node.mdx)

Select the type of node you would like to run and follow the instructions
on each respective page. Whenever you are asked to select the type of network
you want to connect to in those guides, select `Mocha` in order to refer
to the correct instructions on this page on how to connect to Mocha.

## RPC endpoints

The RPC endpoint is to allow users to interact with Celestia's nodes by
querying the node's state and broadcasting transactions on the
Celestia network. The default port is 26657.

Below is a list of RPC endpoints you can use to connect to Mocha testnet:

* [https://rpc-mocha.pops.one](https://rpc-mocha.pops.one)
* [https://rpc.mocha.celestia.counterpoint.software](https://rpc.mocha.celestia.counterpoint.software)

## API endpoints

The API endpoint is to allow users to interact with the REST API in Cosmos
SDK which is implemented using gRPC-gateway, which exposes gRPC endpoints
as REST endpoints. This allows for communication with the node using REST
calls, which can be useful if the client does not support gRPC or HTTP2.
The default port is 1317.

* [https://api-mocha.pops.one](https://api-mocha.pops.one)
* [https://api.mocha.celestia.counterpoint.software](https://api.mocha.celestia.counterpoint.software)

## gRPC endpoints

The gRPC endpoint is to allow users to interact with a celestia-node using
gRPC, a modern open-source and high-performance RPC framework. The default
port is 9090. In the Cosmos SDK, gRPC is used to define state queries and
broadcast transactions.

* [https://grpc-mocha.pops.one](https://grpc-mocha.pops.one)
* [https://grpc.mocha.celestia.counterpoint.software](https://grpc.mocha.celestia.counterpoint.software)

## Mocha testnet faucet

> USING THIS FAUCET DOES NOT ENTITLE YOU TO ANY AIRDROP OR OTHER
  DISTRIBUTION OF MAINNET CELESTIA TOKENS. MAINNET CELESTIA TOKENS
  DO NOT CURRENTLY EXIST AND THERE ARE NO PUBLIC SALES OR OTHER PUBLIC
  DISTRIBUTIONS OF ANY MAINNET CELESTIA TOKENS.

You can request from Mocha Testnet Faucet on the #mocha-faucet channel on
Celestia's Discord server with the following command:

```text
$request <CELESTIA-ADDRESS>
```

Where `<CELESTIA-ADDRESS>` is a `celestia1******` generated address.

> Note: Faucet has a limit of 10 tokens per week per address/Discord ID

## Explorers

There are several explorers you can use for Mocha:

* [https://testnet.mintscan.io/celestia-testnet](https://testnet.mintscan.io/celestia-testnet)
* [https://celestia.explorers.guru/](https://celestia.explorers.guru)
* [https://celestiascan.vercel.app/](https://celestiascan.vercel.app)

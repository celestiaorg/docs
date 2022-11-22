---
sidebar_label: Mamaki Testnet
---

# Mamaki Testnet

![mamaki-testnet](/img/mamaki.png)

This guide contains the relevant sections for how to connect to Mamaki,
depending on the type of node you are running. Mamaki Testnet is designed
to help validators test out their infrastructure and node software
with the test network. Developers are encouraged to deploy their
sovereign rollups on Mamaki, but we also recommend [Arabica Devnet](./arabica-devnet.md)
for that as it is designed for development purposes.

Mamaki is a milestone in Celestia, allowing everyone to test out
core functionalities on the network. Read the anouncement [here](https://blog.celestia.org/celestia-testnet-introduces-alpha-data-availability-api/).

Your best approach to participating is to first determine which node
you would like to run. Each node guides will link to the relevant network
in order to show you how to connect to them.

You have a list of options on the type of nodes you can run in order to
participate in Mamaki:

Consensus:

* [Validator Node](./validator-node.md)
* [Consensus Full Node](./consensus-full-node.md)

Data Availability:

* [Bridge Node](./bridge-node.md)
* [Full Storage Node](./full-storage-node.md)
* [Light Node](./light-node.mdx)

Select the type of node you would like to run and follow the instructions
on each respective page. Whenever you are asked to select the type of network
you want to connect to in those guides, select `Mamaki` in order to refer
to the correct instructions on this page on how to connect to Mamaki.

## RPC endpoints

There is a list of RPC endpoints you can use to connect to Mamaki Testnet:

* [https://rpc-mamaki.pops.one](https://rpc-mamaki.pops.one)
* [https://rpc-1.celestia.nodes.guru](https://rpc-1.celestia.nodes.guru)
* [https://grpc-1.celestia.nodes.guru:10790](https://grpc-1.celestia.nodes.guru:10790)
* [https://celestia-testnet-rpc.polkachu.com/](https://celestia-testnet-rpc.polkachu.com/)
* [https://rpc.celestia.testnet.run](https://rpc.celestia.testnet.run/)
* [https://rpc.mamaki.celestia.counterpoint.software](https://rpc.mamaki.celestia.counterpoint.software)

## Mamaki Testnet faucet

> USING THIS FAUCET DOES NOT ENTITLE YOU TO ANY AIRDROP OR OTHER
  DISTRIBUTION OF MAINNET CELESTIA TOKENS. MAINNET CELESTIA TOKENS
  DO NOT CURRENTLY EXIST AND THERE ARE NO PUBLIC SALES OR OTHER PUBLIC
  DISTRIBUTIONS OF ANY MAINNET CELESTIA TOKENS.

You can request from Mamaki Testnet Faucet on the #mamaki-faucet channel on
Celestia's Discord server with the following command:

```text
$request <CELESTIA-ADDRESS>
```

Where `<CELESTIA-ADDRESS>` is a `celestia1******` generated address.

> Note: Faucet has a limit of 10 tokens per week per address/Discord ID

## Explorers

There are several explorers you can use for Mamaki:

* [https://testnet.mintscan.io/celestia-testnet](https://testnet.mintscan.io/celestia-testnet)
* [https://celestia.explorers.guru/](https://celestia.explorers.guru/)
* [https://celestiascan.vercel.app/](https://celestiascan.vercel.app/)

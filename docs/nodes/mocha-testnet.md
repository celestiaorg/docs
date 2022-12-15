---
sidebar_label: Mocha Testnet
---

# Mocha Testnet

![mocha-testnet](/img/mocha.jpg)

This guide contains the relevant sections for how to connect to Mocha,
depending on the type of node you are running. Mocha Testnet is designed
to help validators test out their infrastructure and node software.
Developers are encouraged to deploy their
sovereign rollups on Mocha, but we also recommend [Arabica Devnet](./arabica-devnet)
for that as it is designed for development purposes.

Mocha is a milestone in Celestia, allowing everyone to test out
core functionalities on the network. Read the anouncement [here](https://blog.celestia.org/celestia-testnet-introduces-alpha-data-availability-api/).
Your best approach to participating is to first determine which node
you would like to run. Each node guides will link to the relevant network
in order to show you how to connect to them.

You have a list of options on the type of nodes you can run in order to
participate in Mocha:

Consensus:

* [Validator Node](./validator-node)
* [Consensus Full Node](./consensus-full-node)

Data Availability:

* [Bridge Node](./bridge-node)
* [Full Storage Node](./full-storage-node)
* [Light Node](./light-node)

Select the type of node you would like to run and follow the instructions
on each respective page. Whenever you are asked to select the type of network
you want to connect to in those guides, select `Mocha` in order to refer
to the correct instructions on this page on how to connect to Mocha.

## RPC endpoints

There is a list of RPC endpoints you can use to connect to Mocha Testnet:

* [https://rpc-mocha.pops.one](https://rpc-mocha.pops.one)

## API endpoints

* [https://api-mocha.pops.one](https://api-mocha.pops.one)

## GRPC endpoints

* [https://grpc-mocha.pops.one](https://grpc-mocha.pops.one)

## Mocha Testnet faucet

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
* [https://celestia.explorers.guru/](https://celestia.explorers.guru/)
* [https://celestiascan.vercel.app/](https://celestiascan.vercel.app/)

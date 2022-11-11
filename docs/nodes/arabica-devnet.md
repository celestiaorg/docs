---
sidebar_label: Arabica Devnet
---

# Arabica Devnet
<!-- markdownlint-disable MD013 -->

![arabica-devnet](/img/arabica-devnet.png)

Arabica Devnet is a new testnet from Celestia Labs that is focused
exclusively on providing developers with enhanced performance and
the latest upgrades for testing their rollups and applications.

Arabica does not focus on validator or consensus-level testing, rather,
that is what Mamaki Testnet is used for. If you are a validator, we
recommend just testing your validator operations on Mamaki [here](./mamaki-testnet.md).

With Arabica having the latest updates from all Celestia's products deployed
on it, it can be subject to many changes. Therefore, as a fair warning,
Arabica can break unexpectedly but given it will be continously updated,
it is a useful way to keep testing the latest changes in the software.

Developers can still deploy on Mamaki Testnet their sovereign rollups if they
chose to do so, it just will always lag behind Arabica Devnet until Mamaki
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

* [Bridge Node](./bridge-node.md)
* [Full Storage Node](./full-storage-node.md)
* [Light Node](./light-node.mdx)

Select the type of node you would like to run and follow the instructions
on each respective page. Whenever you are asked to select the type of network
you want to connect to in those guides, select `Arabica` in order to refer
to the correct instructions on this page on how to connect to Arabica.

## RPC endpoints

There is a list of RPC endpoints you can use to connect to Arabica Devnet:

* [https://rpc.limani.celestia-devops.dev](https://rpc.limani.celestia-devops.dev)

## Arabica Devnet faucet

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

* [https://explorer.celestia.observer/arabica](https://explorer.celestia.observer/arabica)

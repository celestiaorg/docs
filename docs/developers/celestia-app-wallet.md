---
sidebar_label: Wallet with celestia-app
---

# Create a wallet with celestia-app

For this guide, we will go over how you can generate a Celestia
wallet using `celestia-app`.

## Prerequisites

* [Gone through Quick Start and Installed celestia-app](../nodes/quick-start.md)

Note, you do not need to install celestia-node for this tutorial.

## Create a wallet

First, create an application CLI configuration file:

```sh
celestia-appd config keyring-backend test
```

You can pick whatever wallet name you want.
For our example we used "validator" as the wallet name:

```sh
celestia-appd keys add validator --interactive
```

Save the mnemonic output as this is the only way to
recover your validator wallet in case you lose it!

To check all your wallets you can run:

```sh
celestia-appd keys list
```

## Fund a wallet

For the public celestia address, you can fund the
previously created wallet via [Discord](https://discord.gg/celestiacommunity)
by sending this message to either the #mocha-faucet or #arabica-faucet channel:

```text
$request celestia1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Wait to see if you get a confirmation that the
tokens have been successfully sent. To check if
tokens have arrived successfully to the destination
wallet run the command below replacing the public
address with your own:

```sh
celestia-appd start
celestia-appd query bank balances celestia1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---
sidebar_label: Build a Sovereign Rollup
---

# 🗞 Building a Sovereign Rollup

The Ignite CLI comes with scaffolding commands to make development of
blockchains quicker by creating everything that is needed to start a new
Cosmos SDK blockchain.

Open a new tab or window in your terminal and run this command to scaffold your rollup:

```bash
ignite scaffold chain gm
```

The response will look similar to below:

```bash
jcs @ ~ % ignite scaffold chain gm

⭐️ Successfully created a new blockchain 'gm'.
👉 Get started with the following commands:

 % cd gm
 % ignite chain serve

Documentation: https://docs.ignite.com
```

This command has created a Cosmos SDK blockchain in the `gm` directory. The
`gm` directory contains a fully functional blockchain. The following standard
Cosmos SDK [modules](https://docs.cosmos.network/master/modules/) have been
imported:

- `staking` - for delegated Proof-of-Stake (PoS) consensus mechanism
- `bank` - for fungible token transfers between accounts
- `gov` - for on-chain governance
- `mint` - for minting new units of staking token
- `nft` - for creating, transferring, and updating NFTs
- and [more](https://docs.cosmos.network/master/architecture/adr-043-nft-module.html)

Change to the `gm` directory:

```bash
cd gm
```

You can learn more about the `gm` directory’s file structure [here](https://docs.ignite.com/guide/hello#blockchain-directory-structure).
Most of our work in this tutorial will happen in the `x` directory.

## 💎 Installing Rollmint

To swap out Tendermint for Rollmint, run the following command:

```bash
go mod edit -replace github.com/cosmos/cosmos-sdk=github.com/celestiaorg/cosmos-sdk-rollmint@v0.46.3-rollmint-v0.4.0
go mod tidy
go mod download
```

## 🎬 Starting the blockchain

Now that we have our fully-functional rollup scaffolded, we can start our chain
on our machine by running this command in the `gm` directory:

```bash
ignite chain serve
```

The response in your terminal will look similar to below:

```bash
Cosmos SDK's version is: stargate - v0.46.1

🛠️  Building proto...
📦 Installing dependencies...
🛠️  Building the blockchain...
💿 Initializing the app...
🙂 Created account "alice" with address
"cosmos1x68wdvng7w56h48t7tmnccfg84uxe76yppjc6j"
with mnemonic: "breezegarage boil under old useless vessel shoulder donkey
deputy ripple mention air remain find tent bright ill judge effort small lazy
salmon oppose"
🙂 Created account "bob" with address
"cosmos1uzwtd2lts0ak7dhha8d4gaqsd7ucph90gqdxrw"
with mnemonic: "excuse frozen level baby virus beauty pitch pill lobster argue
teach half loan argue wing daughter kit episode diary exhibit material fortune
learn wool"
🌍 Tendermint node: http://0.0.0.0:26657
🌍 Blockchain API: http://0.0.0.0:1317
🌍 Token faucet: http://0.0.0.0:4500
```

The `ignite chain serve` command downloads dependencies and compiles the source
code into a binary called `gmd` (repo + `d`). From now on, you will use `gmd`
to run all of your chain commands.

### 🛑 Stopping your blockchain

To stop your blockchain, press `Ctrl + C` in the terminal window where it is
running. We're ready to scaffold our first Sovereign Rollup query and connect to
Celestia’s DA layer.

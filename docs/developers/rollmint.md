---
sidebar_label: Rollmint
---

# Rollmint

![rollmint](/img/rollmint.png)

[Rollmint](https://github.com/celestiaorg/rollmint) is an ABCI
(Application Blockchain Interface) implementation for sovereign
rollups to deploy on top of Celestia.

It is built by replacing Tendermint, the Cosmos-SDK
consensus layer, with a drop-in replacement that
communicates directly with Celestia's Data Availability layer.

It spins up a sovereign rollup, which collects transactions into blocks and
posts them onto Celestia for consensus and data availability.

The goal of Rollmint is to enable anyone to design and
deploy a sovereign rollup on Celestia in minutes.

Furthermore, while Rollmint allows you to build sovereign rollups
on Celestia, it currently does not support fraud proofs yet and is
therefore running in "pessimistic" mode, where nodes would need to
re-execute the transactions to check the validity of the chain
(i.e. a full node). Furthermore, Rollmint currently only supports
a single sequencer.

## Tutorials

The following tutorials will help you get started building
Cosmos-SDK applications that connect to Celestia's Data Availability
Layer via Rollmint. We call those chains Sovereign Rollups.

You can get started with the following tutorials:

- [gm world](./gm-world.md/)
- [Recipe Book](./recipe-book.md/)
- [Wordle Game](./wordle.md/)
- [CosmWasm Tutorial](./cosmwasm.md/)
- [Ethermint Tutorial](./ethermint.md/)

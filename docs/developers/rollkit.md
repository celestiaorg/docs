---
sidebar_label: Rollkit
---

# Rollkit

![rollkit](/img/rollkit.png)

[Rollkit](https://rollkit.dev) is an ABCI
(Application Blockchain Interface) implementation for sovereign
rollups to deploy on top of Celestia.

It is built by replacing Tendermint, the Cosmos-SDK
consensus layer, with a drop-in replacement that
communicates directly with Celestia's Data Availability layer.

It spins up a sovereign rollup, which collects transactions into blocks and
posts them onto Celestia for consensus and data availability.

The goal of Rollkit is to enable anyone to design and
deploy a sovereign rollup on Celestia in minutes.

Furthermore, while Rollkit allows you to build sovereign rollups
on Celestia, it currently does not support fraud proofs yet and is
therefore running in "pessimistic" mode, where nodes would need to
re-execute the transactions to check the validity of the chain
(i.e. a full node). Furthermore, Rollkit currently only supports
a single sequencer.

## Tutorials

The following tutorials will help you get started building
Cosmos-SDK applications that connect to Celestia's Data Availability
Layer via Rollkit. We call those chains Sovereign Rollups.

You can get started with the following tutorials:

- [Hello World](https://rollkit.dev/docs/tutorials/hello-world)
- [GM World](https://rollkit.dev/docs/tutorials/gm-world)
- [Recipe Book](https://rollkit.dev/docs/tutorials/recipe-book)
- [Wordle Game](https://rollkit.dev/docs/tutorials/wordle)
- [CosmWasm Tutorial](https://rollkit.dev/docs/tutorials/cosmwasm)
- [Ethermint Tutorial](https://rollkit.dev/docs/tutorials/ethermint)
- [Full Stack Modular Blockchain Development Guide](./full-stack-modular-development-guide.md/)

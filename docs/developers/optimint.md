# Optimint

[Optimint](https://github.com/celestiaorg/optimint) is an Optimistic-Rollup
implementation of ABCI (Application Blockchain Interface) in order to build
sovereign chains using the Cosmos-SDK for Celestia.

Optimint communicates directly with Celestia's Data Availability layer, and is
a drop-in replacement for Tendermint, the Cosmos-SDK consensus layer.

It spins up an optimistic rollup, which collects transactions into blocks and
posts them onto Celestia for consensus and data availability.

The goal of Optimint is to enable anyone to design and deploy a Cosmos Zone
on Celestia in minutes.

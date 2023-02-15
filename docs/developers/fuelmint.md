# Fuelmint Documentation

## Introduction

### Fuel

Fuel is an execution layer for the Modular stack.

Fuel is an execution layer in modular blockchains
that provides a fast and efficient solution
to scalability. It aims to address the scalability
crisis in Ethereum, which has seen modest increase
in total throughput with L2 solutions. Fuel is designed
to leverage the shift in L1 blockchain architectures
from monolithic to modular, where execution is separated
from data availability and consensus, leading to increased
bandwidth capacity.

Fuel has three key components:

* Parallel Transaction Execution
* The Fuel Virtual Machine
* A great developer experience

Fuel provides a flexible throughput with high security
and is considered as the engine for the autonomous future,
where individuals and groups can access verifiable
autonomous systems.

Learn about Fuel [here](https://www.fuel.network/)

### Celestia

Celestia is a modular blockchain network whose goal
is to build a scalable data availability layer,
enabling the next generation of scalable blockchain
architectures - modular blockchains.

You can learn more about Celestia in our
[Concepts](../../concepts/how-celestia-works/introduction)
and [Build Modular](../build-modular) pages.

### Fuelmint

Fuelmint is a Sovereign FuelVM rollups on Celestia using
Rollmint and ABCI. You can read the announcement blog post
[here](TBD).

In this tutorial, we will show you how to setup Fuelmint, so
you can test out the advantages of using Sway while having a sovereign
rollup on Celestia.

Let's get started!

## Installation

### Dependencies

You would need to install the following dependencies on your machine
to be able to setup Fuelmint.

* [Install Rust and Cargo](TBD)
* [Install Docker](TBD)
* [Install System Environment Setup for Linux](TBD)
* [Install Golang](TBD)

### Setup Fuelmint

Fuelmint Repo is [here](https://github.com/Ferret-san/fuelmint/tree/tx_pool_experiment)

First step is to clone the Fuelmint repo:

```bash
git clone https://github.com/Ferret-san/fuelmint
```

Then go to the docker directory:

```bash
cd fuelmint/local-da
```

You can start by running a Docker Compose
setup with a local DA network

```bash
docker compose -f ./docker/test-docker-compose.yml up
```

In a separate terminal session, you must
build the Fuelmint binary with `cargo`:

```bash
cd ..
cargo run --bin fuelmint
```

In another terminal session, you will need
to build the Rollkit Node with Golang:

```bash
cd rollkit-node
go mod edit -replace github.com/cosmos/cosmos-sdk=github.com/celestiaorg/cosmos-sdk-rollmint@v0.46.7-rollmint-v0.5.0-no-fraud-proofs
go mod edit --replace github.com/tendermint/tendermint=github.com/celestiaorg/tendermint@v0.34.22-0.20221013213714-8be9b54c8c21
go mod tidy
go mod download
make install
```

Then run the following commands:

<!-- markdownlint-disable MD013 -->
```bash
rm -rf /tmp/fuelmint/
TMHOME="/tmp/fuelmint" tendermint init
NAMESPACE_ID=$(echo $RANDOM | md5sum | head -c 16; echo;)
./rollkit-node -config "/tmp/fuelmint/config/config.toml" -rollkit.namespace_id $NAMESPACE_ID -rollkit.da_start_height 1
```
<!-- markdownlint-enable MD013 -->

## Deploy A Sway Smart Contract

### Install Forc

* Install Forc

### Counter Smart Contract

Find the Sway smart contracts [here](https://fuellabs.github.io/fuels-ts/QUICKSTART)

Let's deploy a Sway smart contract for counter!

```bash
cd ..
cd contract/
forc build
forc deploy --url localhost:4000 --unsigned
```

This generates the contract id

Generate the front end with contract-id
Get the wallet secret generated when you started fuelmint

```bash
npm start
```

## Run Fuelmint on Mocha

Run a Mocha Light Node and get it funded [here](../../nodes/light-node).

```bash
NAMESPACE_ID=$(echo $RANDOM | md5sum | head -c 16; echo;)
DA_BLOCK_HEIGHT=$(curl https://rpc.limani.celestia-devops.dev/block | jq -r '.result.block.header.height')
```

<!-- markdownlint-disable MD013 -->
```bash
./rollkit-node --rollmint.aggregator true --rollmint.da_layer celestia --rollmint.da_config='{"base_url":"http://localhost:26659","timeout":60000000000,"gas_limit":6000000,"fee":6000}' --rollmint.namespace_id $NAMESPACE_ID --rollmint.da_start_height $DA_BLOCK_HEIGHT 
```
<!-- markdownlint-enable MD013 -->

More smart contracts [here](https://github.com/FuelLabs/sway-applications)

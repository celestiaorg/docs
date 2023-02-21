# Fuelmint documentation

## Introduction

### Fuel

Fuel is an execution layer for the modular stack.

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

* Parallel transaction execution
* The Fuel virtual machine
* A great developer experience

Fuel provides a flexible throughput with high security
and is considered as the engine for the autonomous future,
where individuals and groups can access verifiable
autonomous systems.

Learn about Fuel [here](https://www.fuel.network/).

### Celestia

Celestia is a modular blockchain network whose goal
is to build a scalable data availability layer,
enabling the next generation of scalable blockchain
architectures - modular blockchains.

You can learn more about Celestia in our
[concepts](../../concepts/how-celestia-works/introduction)
and [build modular](../build-modular) pages.

### Fuelmint

Fuelmint is a sovereign FuelVM rollups on Celestia using
Rollkit and ABCI (Application BlockChain Interface).
You can read the announcement blog post
[here](https://blog.celestia.org).

In this tutorial, we will show you how to setup Fuelmint, so
you can test out the advantages of using Sway while having a sovereign
rollup on Celestia.

Let's get started!

:::caution
This tutorial has only been tested on Ubuntu LTS on an AMD machine.
:::

## Installation

### Dependencies

You will need to install the following dependencies on your machine
to be able to setup Fuelmint.

* [Install Rust and Cargo](https://doc.rust-lang.org/cargo/getting-started/installation.html)
* [Install Docker](https://docs.docker.com/engine/install/ubuntu/)
* [Install system environment setup for Linux AMD, including Golang](../../nodes/environment)

### Setup Fuelmint

You can find the Fuelmint Repo on GitHub [here](https://github.com/Ferret-san/fuelmint/tree/tx_pool_experiment).

The first step is to clone the Fuelmint repo:

```bash
git clone https://github.com/Ferret-san/fuelmint
```

Then, go to the Docker directory:

```bash
cd fuelmint/local-da
```

You can start by running a Docker compose
setup with a [local DA network](https://github.com/celestiaorg/local-celestia-devnet):

```bash
docker compose -f ./docker/test-docker-compose.yml up
```

In a separate terminal session, you must
build the Fuelmint binary with `cargo`:

:::tip note
If this is your first time running `cargo` to build the Fuelmint binary,
it will take some time to install all of the required dependencies.
:::

```bash
cd $HOME
cd fuelmint
cargo run --bin fuelmint
```

In another terminal session, you will need
to build the Rollkit node with Golang:

```bash
cd fuelmint/rollkit-node
make build
```

Then, run the following commands from the `[placeholder]` directory:

<!-- markdownlint-disable MD013 -->
```bash
rm -rf /tmp/fuelmint/
TMHOME="/tmp/fuelmint" tendermint init
NAMESPACE_ID=$(echo $RANDOM | md5sum | head -c 16; echo;)
./rollkit-node -config "/tmp/fuelmint/config/config.toml" -rollkit.namespace_id $NAMESPACE_ID -rollkit.da_start_height 1
```
<!-- markdownlint-enable MD013 -->

## Deploy a Sway smart contract

### Install Forc

* Install [Forc](https://github.com/FuelLabs/fuelup)

### Counter smart contract

Find the Sway smart contracts [here](https://fuellabs.github.io/fuels-ts/QUICKSTART).

Let's deploy a Sway smart contract for counter! First, open a new terminal instance:

```bash
cd $HOME
cd fuelmint/examples/counter/contract
forc build
forc deploy --url localhost:4000 --unsigned
```

This generates the `contract-id`.

Generate the front end with `contract-id`.
Get the wallet secret generated when you started fuelmint:

```bash
npm start
```

## Run Fuelmint on Mocha

Run a Mocha light node and get it funded [here](../../nodes/light-node).

```bash
NAMESPACE_ID=$(echo $RANDOM | md5sum | head -c 16; echo;)
DA_BLOCK_HEIGHT=$(curl https://rpc-mocha.pops.one/block | jq -r '.result.block.header.height')
```

<!-- markdownlint-disable MD013 -->
```bash
./rollkit-node --rollmint.aggregator true --rollmint.da_layer celestia --rollmint.da_config='{"base_url":"http://localhost:26659","timeout":60000000000,"gas_limit":6000000,"fee":6000}' --rollmint.namespace_id $NAMESPACE_ID --rollmint.da_start_height $DA_BLOCK_HEIGHT 
```
<!-- markdownlint-enable MD013 -->

You can find more smart contracts [here](https://github.com/FuelLabs/sway-applications).

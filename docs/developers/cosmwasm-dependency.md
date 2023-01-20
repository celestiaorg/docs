---
sidebar_label: CosmWasm Dependencies
---

# CosmWasm Dependency Installations

## Environment Setup

For this tutorial, we will be using `curl` and `jq` as helpful
tools. You can follow the guide on installing them
[here](../nodes/environment#setting-up-dependencies).

## Golang Dependency

The Golang version used for this tutorial is v1.18+

You can install Golang
by following our tutorial [here](../nodes/environment#install-golang).

## Rust Installation

### Rustup

First, before installing Rust, you would need to install `rustup`.

On Mac and Linux systems, here are the commands for installing it:

```sh
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

:::danger caution

You will see a note similar to below after installing Rust:

```sh
Rust is installed now. Great!

To get started you may need to restart your current shell.
This would reload your PATH environment variable to include
Cargo's bin directory ($HOME/.cargo/bin).

To configure your current shell, run:
source "$HOME/.cargo/env"
```

If you don't follow the guidance, you won't be able to continue with the
tutorial!

:::

After installation, follow the commands here to setup Rust.

```sh
rustup default stable
cargo version

rustup target list --installed
rustup target add wasm32-unknown-unknown
```

Your output should look similar to below:

```sh
info: using existing install for 'stable-aarch64-apple-darwin'
info: default toolchain set to 'stable-aarch64-apple-darwin'

  stable-aarch64-apple-darwin unchanged - rustc 1.65.0 (897e37553 2022-11-02)
  
cargo 1.65.0 (4bc8f24d3 2022-10-20)
aarch64-apple-darwin
info: downloading component 'rust-std' for 'wasm32-unknown-unknown'
info: installing component 'rust-std' for 'wasm32-unknown-unknown'
```

## Docker Installation

We will be using Docker later in this tutorial for compiling a smart contract
to use a small footprint. We recommend installing Docker on your machine.

Examples on how to install it on Linux are found [here](https://docs.docker.com/engine/install/ubuntu).
Find the right instructions specific for
[your OS here](https://docs.docker.com/engine/install/).

## wasmd Installation

Here, we are going to pull down the `wasmd` repository and replace Tendermint
with Rollmint. Rollmint is a drop-in replacement for Tendermint that allows
Cosmos-SDK applications to connect to Celestia's Data Availability network.

```sh
git clone https://github.com/CosmWasm/wasmd.git
cd wasmd
git fetch --tags
git checkout v0.27.0
go mod edit -replace github.com/cosmos/cosmos-sdk=github.com/celestiaorg/cosmos-sdk-rollmint@v0.45.10-rollmint-v0.5.0-no-fraud-proofs
go mod edit --replace github.com/tendermint/tendermint=github.com/celestiaorg/tendermint@v0.34.22-0.20221013213714-8be9b54c8c21
go mod tidy -compat=1.17
go mod download
make install
```

## Celestia Node

You will need a light node running with test tokens on Mocha Testnet in order
to complete this tutorial. Please complete the tutorial
[here](./node-tutorial.mdx), or start up your node.

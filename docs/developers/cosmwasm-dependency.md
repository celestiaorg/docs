# Cosmwasm Dependency Installations

## Environment Setup

For this tutorial, we will be using `curl` and `jq` as helpful
tools.

You can follow the guide on installing them [here](./environment.md#setting-up-dependencies).

## Golang Dependency

The Golang version used for this tutorial is v1.18+

If you are using a Linux distribution, you can install Golang
by following our tutorial [here](./environment.md#install-golang).

## Rust Installation

### Rustup

First, before installing Rust, you would need to install `rustup`.

On Mac/Linux systems, here are the commands for installing it:

```ssh
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

After installation, follow the commands here to setup Rust.

```ssh
rustup default stable
cargo version

rustup target list --installed
rustup target add wasm32-unknown-unknown
```

## Docker Installation

We will be using Docker later in this tutorial for compiling a smart contract
to use a small footprint.

We recommend installing Docker on your machine.

Examples on how to install it on Linux are found [here](https://docs.docker.com/engine/install/ubuntu/).

Find the right instructions specific for your OS.

## wasmd Installation

Here, we are going to pull down the `wasmd` repository and replace Tendermint
with Optimint. Optimint is a drop-in replacement for Tendermint that allows
Cosmos-SDK applications to connect to Celestia's Data Availability network.

```sh
git clone https://github.com/CosmWasm/wasmd.git
cd wasmd
git fetch --tags
git checkout v0.27.0
go mod edit -replace github.com/cosmos/cosmos-sdk=github.com/celestiaorg/cosmos-sdk@v0.45.4-optimint-v0.3.4
go mod tidy 
go mod download
make install
```

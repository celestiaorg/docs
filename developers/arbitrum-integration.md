# Introduction to Arbitrum rollups with Celestia as DA

## Overview

[Arbitrum Orbit](https://docs.arbitrum.io/launch-orbit-chain/orbit-gentle-introduction)
offers a new dimension in blockchain technology, enabling the creation
of customized, self-managed Arbitrum Rollup and AnyTrust chains. Key
highlights of Arbitrum Orbit include:

1. **Creation of custom chains**: Orbit allows the creation of dedicated
chains that settle to Arbitrum's Layer 2 chains (Arbitrum One, Nova,
Goerli, Sepolia), with customizable features like throughput, privacy,
gas token, and governance.
2. **Solving Ethereum's scalability**: Orbit addresses Ethereum's
congestion and high demand for block space by enabling the creation
of personal Rollups, which offer scalable, secure alternatives to
Ethereum's public chains.
3. **Decentralized application development**: Orbit chains provide
dedicated throughput, EVM+ compatibility, independent roadmaps, and
reliable gas prices, enhancing the development and operation of
decentralized apps.
4. **Benefits to the Ethereum ecosystem**: Orbit contributes to a
multi-chain future for Ethereum, enhancing scalability, offering
flexible security models, and enabling experimentation with execution
environments and governance models.
5. **Versatility and interoperability**: Orbit chains can be used for
a range of purposes, from hosting a single dApp to an ecosystem of
dApps, with the capability to communicate with other Orbit chains.

The
[integration of Celestia with Arbitrum Orbit](https://blog.celestia.org/celestia-is-first-modular-data-availability-network-to-integrate-with-arbitrum-orbit/)
and the Nitro tech stack marks the first external contribution
to the Arbitrum Orbit protocol layer, offering developers an
additional option for selecting a data availability layer
alongside Arbitrum AnyTrust. The integration allows developers
to deploy an Arbitrum Rollup that uses Celestia for data availability
and settles on Ethereum.

The Celestia and Arbitrum integration also
[includes Blobstream](https://docs.celestia.org/developers/blobstream),
which relays commitments to Celestia’s data root to an onchain light
client on Ethereum. This allows L2 solutions that settle on Ethereum
to benefit from the scalability Celestia’s data availability layer can provide.

Another feature of this integration is the
[Ethereum fallback mechanism](./ethereum-fallback.md),
which enables Ethereum L2s (or L3s) to “fall back” to using Ethereum calldata
for data availability in the event of downtime on Celestia Mainnet Beta.

In the case of Celestia downtime or temporary unavailability,
L2s can fallback to posting transactions as calldata on Ethereum or another
DA layer for data availability instead of posting to Celestia. This mechanism
ensures users can continue to transact securely and seamlessly, preventing
disruptions and helping to ensure user funds do not get stuck in the L2's
bridge on Ethereum. This feature is available for the
[Arbitrum Orbit integration](https://docs.celestia.org/developers/ethereum-fallback#arbitrum).

## Getting started

We will go over installation of Arbitrum Nitro and deploying an
instance on an Ubuntu AMD machine. This section covers all
necessary dependencies needed to be installed.

### Dependencies

- [Docker](https://docs.docker.com/engine/install/ubuntu/) running on your machine
- [Docker Compose](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04)
- At least 8 GB RAM

#### General
<!-- markdownlint-disable MD013 -->
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install curl tar wget clang pkg-config libssl-dev cmake jq build-essential git make ncdu -y
```

#### Rust

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"
```

#### Golang

```bash
ver="1.20"
cd $HOME
wget "https://golang.org/dl/go$ver.linux-amd64.tar.gz"
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf "go$ver.linux-amd64.tar.gz"
rm "go$ver.linux-amd64.tar.gz"
echo "export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin" >> $HOME/.bash_profile
source $HOME/.bash_profile
go version
```

#### Node

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
nvm install 16.20.0
nvm use 16.20.0
node --version
npm install --global yarn
yarn --version
```
<!-- markdownlint-enable MD013 -->

#### Other dependencies

```bash
cargo install --force cbindgen
rustup target add wasm32-unknown-unknown
```

### Clone the repository

```bash
git clone https://github.com/celestiaorg/nitro.git && cd nitro/
git fetch --all
git checkout celestia-development
git submodule update --init
git submodule update --init --recursive
```

## Installing Nitro from source

Now we can install Nitro from source. After the `make` command completes,
we can run the bash script that installs the containers via docker-compose.

```bash
make build-node-deps
cd nitro-testnode && ./test-node.bash --init --dev
```

Congratulations! We have an Arbitrum Nitro rollup running on our machine.

In the next page, we will cover deploying a smart contract to your test rollup.

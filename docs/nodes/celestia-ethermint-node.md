# Setting Up An Celestia-Ethermint Node

This tutorial will take you through setting up an Celestia-Ethermint node,
which allows you to run a settlement layer node for Celestia-Ethermint
in order to deploy smart contracts on top of it.

Celestia-Ethermint is an EVM-compatible Sovereign Rollup on top of
Celestia’s Data Availability Layer.

## Overview of Celestia-Ethermint

An overview of Celestia-Ethermint is found [here](https://forum.celestia.org/t/an-open-modular-stack-for-evm-based-applications-using-celestia-evmos-and-cosmos/89).

## Hardware Requirements

The following hardware minimum requirements are recommended for running
the full storage node:

* Memory: 8 GB RAM
* CPU: Quad-Core
* Disk: 250 GB SSD Storage
* Bandwidth: 1 Gbps for Download/100 Mbps for Upload

## Setting Up Your Celestia-Ethermint Node

The following tutorial is done on an Ubuntu Linux 20.04 (LTS) x64 instance machine.

### Setup The Dependencies

You can follow the tutorial for setting up your dependencies [here](../developers/environment.md)

### Setup A Celestia Full Storage Node

You will need to install a Celestia Full Storage Node on the same machine as
your Celestia-Ethermint Node.

You can follow the tutorial for setting up your Celestia Full Storage Node [here](./full-storage-node.md).

Make sure that the Full Storage Node is connected
to an RPC endpoint from the list shown [here](./mamaki-testnet.md#rpc-endpoints).

### Install Celestia-Ethermint

In order to install Celestia-Ethermint, run the following command:

```sh
git clone https://github.com/celestiaorg/ethermint.git
git clone https://github.com/celestiaorg/optimint.git
cd ethermint && go mod edit -replace=github.com/celestiaorg/optimint=../optimint
make install
```

### Get Network Information

You will need to get the network configurations for Celestia-Ethermint.

Run the following command:

```sh
cd
git clone https://github.com/celestiaorg/ethermint-networks.git
```

### Configure Celestia-Ethermint

Configure your Celestia-Ethermint node by moving the config files
to your `ethermintd` config directory:

```sh
mkdir -p .ethermintd/config
cp ~/ethermint-networks/ethermintd/config/config.toml .ethermintd/config 
cp ~/ethermint-networks/ethermintd/config/genesis.json .ethermintd/config
```

Edit the `.ethermintd/config/config.toml` with the following values:

```toml
aggregator=false
seeds="12D3KooWFjD8uAvxkY2scSgWN2qKyHHq96xFkJMV1PQmjuQkMD4F@35.208.160.145:26670"
```

### Start Celestia-Ethermint

You can now start Celestia-Ethermint with the following command:

```sh
ethermintd start
```

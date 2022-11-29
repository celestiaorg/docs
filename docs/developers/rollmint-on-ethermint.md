# Rollmint Installation

## ethermintd Installation

Here, we are going to pull down the `ethermint` from the
Celestia repository. This version of Ethermint has Rollmint installed on it.
Rollmint is a drop-in replacement for Tendermint that allows
Cosmos-SDK applications to connect to Celestia's Data Availability network.

```sh
git clone https://github.com/celestiaorg/ethermint.git
cd ethermint 
make install
```

You can check if `ethermintd` is installed by running the following
command:

```sh
ethermintd
```

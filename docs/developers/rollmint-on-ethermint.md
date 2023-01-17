# Rollmint Installation

## ethermintd Installation

Here, we are going to pull down the `ethermint` from the
Celestia repository. This version of Ethermint has Rollmint installed on it.
Rollmint is a drop-in replacement for Tendermint that allows
Cosmos-SDK applications to connect to Celestia's Data Availability network.

```sh
git clone https://github.com/celestiaorg/ethermint.git
cd ethermint
go mod edit -replace github.com/cosmos/cosmos-sdk=github.com/celestiaorg/cosmos-sdk-rollmint@v0.46.7-rollmint-v0.5.0-no-fraud-proofs
go mod edit --replace github.com/tendermint/tendermint=github.com/celestiaorg/tendermint@v0.34.22-0.20221013213714-8be9b54c8c21
go mod tidy && go build ./...
make install
```

You can check if `ethermintd` is installed by running the following
command:

```sh
ethermintd
```

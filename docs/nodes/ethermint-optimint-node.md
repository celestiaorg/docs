# Setting Up An Ethermint-Optimint Node

This tutorial will take you through setting up an Ethermint-Optimint node,
which allows you to run a settlement layer node for Ethermint-Optimint
in order to deploy smart contracts on top of it.

Ethermint-Optimint is an EVM-compatible Sovereign Rollup on top of
Celestia’s Data Availability Layer.

## Overview of Ethermint-Optimint

An overview of Ethermint-Optimint is found [here](https://forum.celestia.org/t/an-open-modular-stack-for-evm-based-applications-using-celestia-evmos-and-cosmos/89).

## Hardware Requirements

The following hardware minimum requirements are recommended for running
the full storage node:

* Memory: 8 GB RAM
* CPU: Quad-Core
* Disk: 250 GB SSD Storage
* Bandwidth: 1 Gbps for Download/100 Mbps for Upload

## Setting Up Your Ethermint-Optimint Node

The following tutorial is done on an Ubuntu Linux 20.04 (LTS) x64 instance machine.

### Setup The Dependencies

You can follow the tutorial for setting up your dependencies [here](../../developers/environment)

### Install Ethermint

Run the following to install Ethermint:

```sh
git clone https://github.com/celestiaorg/ethermint.git
cd ethermint
make install
```

Once the binary is compiled and installed, it'll generate the `ethermintd` binary.

You can test out it is installed properly by running the following command:

```sh
ethermintd
```

This will show the following output:

```console
Ethermint Daemon

Usage:
  ethermintd [command]

Available Commands:
  add-genesis-account Add a genesis account to genesis.json
  collect-gentxs      Collect genesis txs and output a genesis.json file
  config              Create or query an application CLI configuration file
  debug               Tool for helping with debugging your application
  export              Export state to JSON
  gentx               Generate a genesis tx carrying a self delegation
  help                Help about any command
  init                Initialize private validator, p2p, genesis, and application configuration files
  keys                Manage your application's keys
  migrate             Migrate genesis to a specified target version
  query               Querying subcommands
  rosetta             spin up a rosetta server
  start               Run the full node
  status              Query remote node for status
  tendermint          Tendermint subcommands
  testnet             subcommands for starting or configuring local testnets
  tx                  Transactions subcommands
  unsafe-reset-all    Resets the blockchain database, removes address book files, and resets data/priv_validator_state.json to the genesis state
  validate-genesis    validates the genesis file at the default location or at the location passed as an arg
  version             Print the application binary version information

Flags:
  -b, --broadcast-mode string    Transaction broadcasting mode (sync|async|block) (default "sync")
      --chain-id string          Specify Chain ID for sending Tx (default "testnet")
      --fees string              Fees to pay along with transaction; eg: 10aphoton
      --from string              Name or address of private key with which to sign
      --gas-adjustment float     adjustment factor to be multiplied against the estimate returned by the tx simulation; if the gas limit is set manually this flag is ignored  (default 1)
      --gas-prices string        Gas prices to determine the transaction fee (e.g. 10aphoton)
  -h, --help                     help for ethermintd
      --home string              directory for config and data (default "/root/.ethermintd")
      --keyring-backend string   Select keyring's backend (default "os")
      --log_format string        The logging format (json|plain) (default "plain")
      --log_level string         The logging level (trace|debug|info|warn|error|fatal|panic) (default "info")
      --node string              <host>:<port> to tendermint rpc interface for this chain (default "tcp://localhost:26657")
      --trace                    print out full stack trace on errors

Use "ethermintd [command] --help" for more information about a command
```

### Run The Ethermint-Optimint Node

Set up the following environment variables:

```sh
KEY="my-key"
CHAINID="opti_9000-1"
MONIKER="localtestnet"
KEYRING="test"
KEYALGO="eth_secp256k1"
LOGLEVEL="info"
TRACE="--trace"
DIR="${HOME_DIR:-/.ethermintd}"
GENESIS_FILE="${DIR}/config/genesis.json"
```

Now, let's set up the configuartion for our Ethermint-Optimint Node:

```sh
ethermintd config keyring-backend $KEYRING
ethermintd config chain-id $CHAINID
ethermintd keys add $KEY --keyring-backend $KEYRING --algo $KEYALGO
ethermintd init $MONIKER --chain-id $CHAINID
```

We will now set up some parameter changes in `genesis.json`:

```sh
cat $HOME/.ethermintd/config/genesis.json | jq '.app_state["staking"]["params"]["bond_denom"]="aphoton"' > $HOME/.ethermintd/config/tmp_genesis.json && mv $HOME/.ethermintd/config/tmp_genesis.json $HOME/.ethermintd/config/genesis.json
cat $HOME/.ethermintd/config/genesis.json | jq '.app_state["crisis"]["constant_fee"]["denom"]="aphoton"' > $HOME/.ethermintd/config/tmp_genesis.json && mv $HOME/.ethermintd/config/tmp_genesis.json $HOME/.ethermintd/config/genesis.json
cat $HOME/.ethermintd/config/genesis.json | jq '.app_state["gov"]["deposit_params"]["min_deposit"][0]["denom"]="aphoton"' > $HOME/.ethermintd/config/tmp_genesis.json && mv $HOME/.ethermintd/config/tmp_genesis.json $HOME/.ethermintd/config/genesis.json
cat $HOME/.ethermintd/config/genesis.json | jq '.app_state["mint"]["params"]["mint_denom"]="aphoton"' > $HOME/.ethermintd/config/tmp_genesis.json && mv $HOME/.ethermintd/config/tmp_genesis.json $HOME/.ethermintd/config/genesis.json
cat $HOME/.ethermintd/config/genesis.json | jq '.consensus_params["block"]["time_iota_ms"]="1000"' > $HOME/.ethermintd/config/tmp_genesis.json && mv $HOME/.ethermintd/config/tmp_genesis.json $HOME/.ethermintd/config/genesis.json
cat $HOME/.ethermintd/config/genesis.json | jq '.consensus_params["block"]["max_gas"]="10000000"' > $HOME/.ethermintd/config/tmp_genesis.json && mv $HOME/.ethermintd/config/tmp_genesis.json $HOME/.ethermintd/config/genesis.json
sed -i 's/create_empty_blocks = true/create_empty_blocks = false/g' $HOME/.ethermintd/config/config.toml
sed -i 's/create_empty_blocks_interval = "0s"/create_empty_blocks_interval = "30s"/g' $HOME/.ethermintd/config/config.toml
sed -i 's/timeout_propose = "3s"/timeout_propose = "30s"/g' $HOME/.ethermintd/config/config.toml
sed -i 's/timeout_propose_delta = "500ms"/timeout_propose_delta = "5s"/g' $HOME/.ethermintd/config/config.toml
sed -i 's/timeout_prevote = "1s"/timeout_prevote = "10s"/g' $HOME/.ethermintd/config/config.toml
sed -i 's/timeout_prevote_delta = "500ms"/timeout_prevote_delta = "5s"/g' $HOME/.ethermintd/config/config.toml
sed -i 's/timeout_precommit = "1s"/timeout_precommit = "10s"/g' $HOME/.ethermintd/config/config.toml
sed -i 's/timeout_precommit_delta = "500ms"/timeout_precommit_delta = "5s"/g' $HOME/.ethermintd/config/config.toml
sed -i 's/timeout_commit = "5s"/timeout_commit = "150s"/g' $HOME/.ethermintd/config/config.toml
sed -i 's/timeout_broadcast_tx_commit = "10s"/timeout_broadcast_tx_commit = "150s"/g' $HOME/.ethermintd/config/config.toml
```




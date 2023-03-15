---
sidebar_label: Helpful CLI commands
---

# Helpful CLI commands

View all options:

```console
$ celestia-appd --help
Start celestia-app

Usage:
  celestia-appd [command]

Available Commands:
  add-genesis-account Add a genesis account to genesis.json
  collect-gentxs      Collect genesis txs and output a genesis.json file
  config              Create or query an application CLI configuration file
  debug               Tool for helping with debugging your application
  export              Export state to JSON
  gentx               Generate a genesis tx carrying a self delegation
  help                Help about any command
  init                Initialize private validator, p2p, genesis, 
  and application configuration files
  keys                Manage your application's keys
  migrate             Migrate genesis to a specified target version
  query               Querying subcommands
  rollback            rollback tendermint state by one height
  rollback            rollback cosmos-sdk and tendermint state by one height
  start               Run the full node
  status              Query remote node for status
  tendermint          Tendermint subcommands
  tx                  Transactions subcommands
  validate-genesis    validates the genesis file at the default 
  location or at the location passed as an arg
  version             Print the application binary version information
```

## Creating a wallet

```sh
celestia-appd config keyring-backend test
```

`keyring-backend` configures the keyring's backend, where the keys are stored.

Options are: `os|file|kwallet|pass|test|memory`.

You can learn more on the [Cosmos documentation](https://docs.cosmos.network/main/run-node/keyring.html)
or [Go Package documentation](https://pkg.go.dev/github.com/cosmos/cosmos-sdk/crypto/keyring).

## Key management

```sh
# listing keys
celestia-appd keys list

# adding keys
celestia-appd keys add <KEY_NAME>

# deleting keys
celestia-appd keys delete <KEY_NAME>

# renaming keys
celestia-appd keys rename <CURRENT_KEY_NAME> <NEW_KEY_NAME>
```

### Importing and exporting keys

Import an encrypted and ASCII-armored private key into the local keybase.

```sh
celestia-appd keys import <KEY_NAME> <KEY_FILE>
```

Example usage:

```sh
celestia-appd keys import amanda ./keyfile.txt
```

Export a private key from the local keyring in encrypted and ASCII-armored format:

```sh
celestia-appd keys export <KEY_NAME>

# you will then be prompted to set a password for the encrypted private key:
Enter passphrase to encrypt the exported key:
```

After you set a password, your encrypted key will be displayed.

## Querying subcommands

Usage:

```sh
celestia-appd query <FLAGS> | <COMMAND>

# alias q
celestia-appd q <FLAGS> | <COMMAND>
```

To see all options:

```sh
celestia-appd q --help
```

## Token management

Get token balances:

```sh
celestia-appd q bank balances <ADDRESS> --node <NODE_URI>
```

Example usage:

```sh
celestia-appd q bank balances celestia1czpgn3hdh9sodm06d5qk23xzgpq2uyc8ggdqgw \
--node https://rpc-mocha.pops.one
```

Transfer tokens from one wallet to another:

```sh
celestia-appd tx bank send <FROM_ADDRESS> <TO_ADDRESS> \
<amount> --node <NODE_URI> --chain-id <CHAIN_ID>
```

Example usage:

```sh
celestia-appd tx bank send <FROM_ADDRESS> <TO_ADDRESS> \
19000000utia --node https://rpc-mocha.pops.one/ --chain-id mocha
```

To see options:

```sh
celestia-appd tx bank send --help
```

## Governance

You can vote on a governance proposal with
the following command:

```sh
celestia-appd tx gov vote <proposal id> <yes or no> --from <wallet> --chain-id <chain-id>
```

## Claim validator rewards

You can claim your validator rewards with
the following command:

```sh
celestia-appd tx distribution withdraw-rewards <validator valoper>\
    --commission --from=<validator wallet> --chain-id <chain-id> --gas auto -y
```

## Delegate & undelegate tokens

You can `delegate` your tokens to a validator
with the following command:

```sh
celestia-appd tx staking delegate <validator valoper> <amount>\
    --from <wallet> --chain-id <chain-id>
```

You can undelegate tokens to a validator
with the `unbond` command:

```sh
celestia-appd tx staking unbond <validator valoper> <amount>\
    --from <wallet> --chain-id <chain-id>
```

## Unjailing the validator

You can unjail your validator with the
following command:

```sh
celestia-appd tx slashing unjail --from <validator wallet>\
    --chain-id <chain-id> --gas auto -y
```

## How to export logs with SystemD

You can export your logs if you are running
a SystemD service with the following command:

```sh
sudo journalctl -u <your systemd service> -S yesterday > node_logs.txt
sudo journalctl -u <your systemd service> -S today > node_logs.txt
# This command outputs the last 1 million lines!
sudo journalctl -u <your systemd service> -n 1000000 > node_logs.txt
```

## Signing genesis for a new network

You can first run the following commands:

```sh
VALIDATOR_NAME=validator1
CHAIN_ID=testnet
celestia-appd init $VALIDATOR_NAME --chain-id $CHAIN_ID
MONIKER=validator_name
```

Next create a wallet:

```sh
KEY_NAME=validator
celestia-appd keys add $KEY_NAME
```

Create or assign an EVM address:

```sh
EVM_ADDRESS=<EVM_ADDRESS>
```

Then add genesis account:

```sh
CELES_AMOUNT="5000100000000utia"
celestia-appd add-genesis-account $KEY_NAME $CELES_AMOUNT
```

Then generate your gentx:

```sh
STAKING_AMOUNT=5000000000000utia
celestia-appd gentx $KEY_NAME $STAKING_AMOUNT --chain-id $CHAIN_ID \
    --pubkey=$(celestia-appd tendermint show-validator) \
    --moniker=$MONIKER \
    --commission-rate=0.1 \
    --commission-max-rate=0.2 \
    --commission-max-change-rate=0.01 \
    --min-self-delegation=1 \
    --evm-address=$EVM_ADDRESS \
```

You can then share your gentx JSON file on the networks
repo [here](https://github.com/celestiaorg/networks) in the respective
network directory you are participating in.

# Setting Up Your Environment for CosmWasm on Celestia
<!-- markdownlint-disable MD013 -->

Now the `wasmd` binary is built, we need to setup a local network
that communicates between `wasmd` and Optimint.

## Building the Wasmd Network

Run the following command:

```sh
VALIDATOR_NAME=validator1
CHAIN_ID=celeswasm
wasmd init $VALIDATOR_NAME --chain-id $CHAIN_ID
```

This initializes a chain called `celeswasm` with `wasmd` binary.

The following command helps us setup accounts for genesis:

```sh
KEY_NAME=celeswasm-key
wasmd keys add $KEY_NAME --keyring-backend test
```

Make you sure you store the output of the wallet generated
for later reference if needed.

Now, let's add a genesis account and use it to update our genesis file:

```sh
TOKEN_AMOUNT="10000000000000000000000000uwasm"
wasmd add-genesis-account $KEY_NAME $TOKEN_AMOUNT --keyring-backend test
STAKING_AMOUNT=1000000000uwasm
wasmd gentx $KEY_NAME $STAKING_AMOUNT --chain-id $CHAIN_ID --keyring-backend test
```

With that, we created a local network genesis file.

Some more useful commands we can setup:

```sh
export NODE="--chain-id ${CHAIN_ID}"
export TXFLAG="--chain-id ${CHAIN_ID} --gas-prices 0uwasm --gas auto --gas-adjustment 1.3"
```

## Starting the Wasmd Network

We can run the following to start the `wasmd` network:

```sh
wasmd start --optimint.aggregator true --optimint.da_layer celestia --optimint.da_config='{"base_url":"http://XXX.XXX.XXX.XXX:26658","timeout":60000000000,"gas_limit":6000000}' --optimint.namespace_id 000000000000FFFF --optimint.da_start_height 21380
```

Please consider:

> NOTE: In the above command, you need to pass a Celestia Node IP address
  to the `base_url` that has an account with Mamaki testnet tokens. Follow
  the tutorial for setting up a Celestia Light Node and creating a wallet
  with testnet faucet money [here](./node-tutorial.md) in the Celestia Node section.

Also please consider:

> IMPORTANT: Furthermore, in the above command, you need to specify the latest
  Block Height in Mamaki Testnet for `da_height`. You can find the latest block number
  in the explorer [here](https://testnet.mintscan.io/celestia-testnet). Also, for the flag
  `--optimint.namespace_id`, if you don't include the flag, Optimint will generate a random
  namespace ID for you. So only include the `--optimint.namespace_id` flag if you want
  to specify your own namespace ID.

With that, we have kickstarted our `wasmd` network!

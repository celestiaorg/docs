---
sidebar_label: Setup Network Environment
---

# Setting Up Your Environment for CosmWasm on Celestia

Now the `wasmd` binary is built, we need to setup a local network
that communicates between `wasmd` and Rollmint.

## Initializing Cosmwasm Rollup with a Bash Script

We have a handy `init.sh` found in this repo
[here](https://github.com/celestiaorg/devrel-tools).

We can copy it over to our directory with the following commands:

```sh
# From inside the `wasmd` directory
cd ..
git clone https://github.com/celestiaorg/devrel-tools
cp devrel-tools/cosmwasm/init.sh wasmd/
cd wasmd/
```

This copies over our `init.sh` script to initialize our
CosmWasm rollup.

You can view the contents of the script to see how we
initialize the CosmWasm Rollup.

:::danger caution

If you are on macOS, you will need to install md5sha1sum before starting your
rollup:

```sh
brew install md5sha1sum
```

:::

You can initialize the script with the following command:

```sh
bash init.sh
```

With that, we have kickstarted our `wasmd` network!

## Optional: See what's inside the script

You can skip this section, but it is important to know
how Rollmint is initializing the cosmwasm rollup.

Here are the contents of the script:

<!-- markdownlint-disable MD013 -->
```sh
#!/bin/sh

VALIDATOR_NAME=validator1
CHAIN_ID=celeswasm
KEY_NAME=celeswasm-key
TOKEN_AMOUNT="10000000000000000000000000uwasm"
STAKING_AMOUNT=1000000000uwasm
CHAINFLAG="--chain-id ${CHAIN_ID}"
TXFLAG="--chain-id ${CHAIN_ID} --gas-prices 0uwasm --gas auto --gas-adjustment 1.3"
NODEIP="--node http://127.0.0.1:26657"

NAMESPACE_ID=$(echo $RANDOM | md5sum | head -c 16; echo;)
echo $NAMESPACE_ID
DA_BLOCK_HEIGHT=$(curl https://rpc-mocha.pops.one/block | jq -r '.result.block.header.height')
echo $DA_BLOCK_HEIGHT

rm -rf "$HOME"/.wasmd
wasmd tendermint unsafe-reset-all
wasmd init $VALIDATOR_NAME --chain-id $CHAIN_ID

sed -i'' -e 's/^minimum-gas-prices *= .*/minimum-gas-prices = "0uwasm"/' "$HOME"/.wasmd/config/app.toml
sed -i'' -e '/\[api\]/,+3 s/enable *= .*/enable = true/' "$HOME"/.wasmd/config/app.toml
sed -i'' -e "s/^chain-id *= .*/chain-id = \"$CHAIN_ID\"/" "$HOME"/.wasmd/config/client.toml
sed -i'' -e '/\[rpc\]/,+3 s/laddr *= .*/laddr = "tcp:\/\/0.0.0.0:26657"/' "$HOME"/.wasmd/config/config.toml
sed -i'' -e 's/"time_iota_ms": "1000"/"time_iota_ms": "10"/' "$HOME"/.wasmd/config/genesis.json
sed -i'' -e 's/bond_denom": ".*"/bond_denom": "uwasm"/' "$HOME"/.wasmd/config/genesis.json
sed -i'' -e 's/mint_denom": ".*"/mint_denom": "uwasm"/' "$HOME"/.wasmd/config/genesis.json

wasmd keys add $KEY_NAME --keyring-backend test
wasmd add-genesis-account $KEY_NAME $TOKEN_AMOUNT --keyring-backend test
wasmd gentx $KEY_NAME $STAKING_AMOUNT --chain-id $CHAIN_ID --keyring-backend test
wasmd start --rollmint.aggregator true --rollmint.da_layer celestia --rollmint.da_config='{"base_url":"http://localhost:26659","timeout":60000000000,"fee":6000,"gas_limit":6000000}' --rollmint.namespace_id $NAMESPACE_ID --rollmint.da_start_height $DA_BLOCK_HEIGHT
```
<!-- markdownlint-enable MD010 -->

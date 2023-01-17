---
sidebar_label: Contract Interaction
---

# Contract Interaction on CosmWasm with Celestia
<!-- markdownlint-disable MD013 -->

In the previous steps, we have stored out contract's tx hash in an
environment variable for later use.

Because of the longer time periods of submitting transactions via Rollmint
due to waiting on Celestia's Data Availability Layer to confirm block inclusion,
we will need to query our  tx hash directly to get information about it.

## Contract Querying

Let's start by querying our transaction hash for its code ID:

```sh
CODE_ID=$(wasmd query tx --type=hash $TX_HASH --chain-id celeswasm --node http://127.0.0.1:26657 --output json | jq -r '.logs[0].events[-1].attributes[0].value')
echo $CODE_ID
```

This will give us back the Code ID of the deployed contract.

In our case, since it's the first contract deployed on our local network,
the value is `1`.

Now, we can take a look at the contracts instantiated by this Code ID:

```sh
wasmd query wasm list-contract-by-code $CODE_ID --chain-id celeswasm --node http://127.0.0.1:26657 --output json
```

We get the following output:

```json
{"contracts":[],"pagination":{"next_key":null,"total":"0"}}
```

## Contract Instantiation

We start instantiating the contract by writing up the following `INIT` message
for nameservice contract. Here, we are specifying that `purchase_price` of a name
is `100uwasm` and `transfer_price` is `999uwasm`.

```sh
INIT='{"purchase_price":{"amount":"100","denom":"uwasm"},"transfer_price":{"amount":"999","denom":"uwasm"}}'
wasmd tx wasm instantiate $CODE_ID "$INIT" --from celeswasm-key --keyring-backend test --label "name service" --chain-id celeswasm --gas-prices 0uwasm --gas auto --gas-adjustment 1.3 -y --no-admin --node http://127.0.0.1:26657
```

## Contract Interaction

Now that we instantiated it, we can interact further with the contract:

```sh
wasmd query wasm list-contract-by-code $CODE_ID --chain-id celeswasm --output json --node http://127.0.0.1:26657
CONTRACT=$(wasmd query wasm list-contract-by-code $CODE_ID --chain-id celeswasm --output json --node http://127.0.0.1:26657 | jq -r '.contracts[-1]')
echo $CONTRACT

wasmd query wasm contract --node http://127.0.0.1:26657 $CONTRACT --chain-id celeswasm
wasmd query bank balances --node http://127.0.0.1:26657 $CONTRACT --chain-id celeswasm
```

This allows us to see the contract address, contract details, and
bank balances.

Your output will look similar to below:

```sh
{"contracts":["wasm14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s0phg4d"],"pagination":{"next_key":null,"total":"0"}}
wasm14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s0phg4d
address: wasm14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s0phg4d
contract_info:
  admin: ""
  code_id: "1"
  created: null
  creator: wasm1y9ceqvnsnm9xtcdmhrjvv4rslgwfzmrzky2c5z
  extension: null
  ibc_port_id: ""
  label: name service
balances: []
pagination:
  next_key: null
  total: "0"
```

Now, let's register a name to the contract for our wallet address:

```sh
REGISTER='{"register":{"name":"fred"}}'
wasmd tx wasm execute $CONTRACT "$REGISTER" --amount 100uwasm --from celeswasm-key --chain-id celeswasm --gas-prices 0uwasm --gas auto --gas-adjustment 1.3 --node http://127.0.0.1:26657 --keyring-backend test -y
```

Your output will look similar to below:

```sh
DEIP --keyring-backend test -y
gas estimate: 167533
code: 0
codespace: ""
data: ""
events: []
gas_used: "0"
gas_wanted: "0"
height: "0"
info: ""
logs: []
raw_log: '[]'
timestamp: ""
tx: null
txhash: C147257485B72E7FFA5FDB943C94CE951A37817554339586FFD645AD2AA397C3
```

If you try to register the same name again, you'll see an expected error:

```sh
Error: rpc error: code = Unknown desc = rpc error: code = Unknown desc = failed to execute message; message index: 0: Name has been taken (name fred): execute wasm contract failed [CosmWasm/wasmd/x/wasm/keeper/keeper.go:364] With gas wanted: '0' and gas used: '123809' : unknown request
```

Next, query the owner of the name record:

```sh
NAME_QUERY='{"resolve_record": {"name": "fred"}}'
wasmd query wasm contract-state smart $CONTRACT "$NAME_QUERY" --chain-id celeswasm --node http://127.0.0.1:26657 --output json
```

You'll see the owner's address in a JSON response:

```sh
{"data":{"address":"wasm1y9ceqvnsnm9xtcdmhrjvv4rslgwfzmrzky2c5z"}}
```

With that, we have instantiated and interacted with the CosmWasm nameservice
smart contract using Celestia!

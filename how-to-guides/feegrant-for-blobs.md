# FeeGrant module for blobs submission

<!-- markdownlint-disable MD013 -->
<!-- markdownlint-disable MD033 -->
<script setup>
import constants from '/.vitepress/constants/constants.js'
</script>

## Overview

This guide provides developers with the knowledge to use the FeeGrant
module on the Celestia's Mocha testnet chain for granting a data
availability node's account to submit blobs without constantly
funding it, enabling a third-party account to cover the transaction fees.

## Pre-requisites

- celestia-node binary (`celestia`) [installed](/how-to-guides/celestia-node.md)
- Access to a Mocha node (e.g., `https://rpc-mocha.pops.one:443`)
- Running DA Light node on Mocha testnet
- One account with sufficient funds, the "granter"
- One account with no funds, the "grantee"

## Introduction

Each DA node contains a Celestia account that is used to pay for blobs
submissions. To unify the fee payment process, the FeeGrant module
allows a third-party account (granter) to pay for the fees incurred by
a DA node's (grantee) account. You will need one account that will
contain the funds, the granter, and another account that will be in the
DA node you run to post blobs, the grantee. You will see the DA node's account
once you initialize the node. Learn more about managing accounts with
`cel-key` in [create a wallet with celestia-node](/tutorials/celestia-node-key.md#create-a-wallet-with-celestia-node).

## Granting fee allowances using celestia-node

To get started granting the fee allowance, you will need
two separate keys to run the light node with. One to begin the
FeeGrant as the granter and another to use the FeeGrant as the grantee.

Set some variables for your accounts for the remainder of the guide:

```bash
export GRANTER_ADDRESS=<your-granter-account-address>
export GRANTEE_ADDRESS=<your-grantee-account-address>
export RPC_URL=rpc-mocha.pops.one
export RPC_PORT=9090
```

### FeeGrant module implementation in celestia-node

Using celestia-node, you can now easily give permission for
other nodes to submit transactions on your behalf. It is also
possible to revoke the grant.

The FeeGrant functionality can now be used during runtime without
the need to restart the node.

### Grant permission for an allowance as a granter

First, start your node:

```bash
celestia light start --p2p.network mocha --core.ip $RPC_URL --core.port $RPC_PORT
```

Then, grant the fee to the grantee:

```bash
celestia state grant-fee $GRANTEE_ADDRESS --amount 2000
```

Note that the `--amount` flag specifies the spend limit (in utia) for the
grantee. If not specified, the grantee does not have a spend limit.

## Using a FeeGrant allowance as a grantee in celestia-node

Start your node:

```bash
celestia light start --core.ip $RPC_URL --p2p.network=mocha --core.port $RPC_PORT
```

To check the balance of a light node, use the following command:

```bash
celestia state balance
```

Example response when the account balance does not exist:

```json
{
  "result": {
    "denom": "utia",
    "amount": "0"
  }
}
```

This indicates that the light node currently does not have any funds.

Now submit a blob using the FeeGrant:

```bash
celestia blob submit 0x42690c204d39600fddd3 'gm' --granter.address $GRANTER_ADDRESS
```

You'll see the height and the commitment of your blob:

```json
{
  "result": {
    "height": 1639397,
    "commitments": ["19L/C4iBEsqXGzC5ZxJ3vtuGBiAdQAMIEnbYjKEGcac="]
  }
}
```

## Checking account balances after submission

Light node account:
After submitting a blob, you can check the light node account's balance
to verify that the fees have been deducted:

<!-- markdownlint-disable MD013 -->

```bash
celestia state balance
```

<!-- markdownlint-enable MD013 -->

Example output showing fees are not deducted:

```json
{
  "result": {
    "denom": "utia",
    "amount": "0"
  }
}
```

## Optional: Revoke permission for a FeeGrant allowance as a granter

To revoke the feegrant, run:

```bash
celestia state revoke-grant-fee $GRANTEE_ADDRESS
```

### Optional: Submitting a blob from file input

To submit a blob from file input:

<!-- markdownlint-disable MD013 -->

```bash
celestia blob submit --input-file blob.json
```

<!-- markdownlint-enable MD013 -->

## Optional: Granting fee allowances using celestia-appd

To grant fee allowances, allowing a third-party (granter) account to pay
for the fees incurred by a Celestia data availability node (grantee)
account, use the following commands.

Set your account addresses for grantee and granter, and
the RPC URL:

```bash
export GRANTER_ADDRESS=<your-granter-account-address>
export GRANTEE_ADDRESS=<your-grantee-account-address>
export RPC_URL=https://rpc-mocha.pops.one
export RPC_PORT=443
```

Then, send the feegrant transaction:

<!-- markdownlint-disable MD013 -->

```bash-vue
celestia-appd tx feegrant grant \
  $GRANTER_ADDRESS $GRANTEE_ADDRESS \
  --node $RPC_URL:$RPC_PORT \
  --spend-limit 1000000utia \
  --allowed-messages "/cosmos.bank.v1beta1.MsgSend,/celestia.blob.v1.MsgPayForBlobs" \
  --chain-id {{constants.mochaChainId}} \
  --keyring-backend test \
  --fees 20000utia \
  --broadcast-mode block \
  --yes
```

<!-- markdownlint-enable MD013 -->

Example:
[FeeGrant transaction on Mocha](https://mocha.celenium.io/tx/802a17777fbeab416f6fa2c25f0c56dd9cc8a92afc2a96293d114ac7c22efb5c)

### Using a grantee account to send transactions with celestia-appd

Once a fee grant has been established, the grantee can submit transactions using the granter's account to pay fees:

```bash-vue
celestia-appd tx blob pay-for-blob 0x42690c204d39600fddd3 0x676d \
  --node $RPC_URL:$RPC_PORT \
  --chain-id {{constants.mochaChainId}} \
  --from $GRANTEE_ADDRESS \
  --keyring-backend test \
  --fee-granter $GRANTER_ADDRESS \
  --fees 20000utia \
  --broadcast-mode block \
  --yes
```

Note the `--fee-granter` flag which specifies the account that will pay for the transaction fees.

### Optional: Checking the granter's account

To confirm that the fees have been deducted from the granter's account that
granted the fee allowance, run:

```bash
celestia-appd query bank balances $GRANTER_ADDRESS \
--node https://rpc-mocha.pops.one:443 --denom utia
```

This output will show the remaining balance after fees have been deducted,
confirming that the FeeGrant module is working as intended.

## Optional: Using FeeGrant with curl commands

To grant fee allowances using curl commands, which can be useful for automation
or when you need more direct control over the RPC calls, follow these steps.

First, make sure you have `curl` and `jq` installed on your system.

1. Start your local light node for Mocha testnet:

```bash
celestia light start --p2p.network mocha --core.ip rpc-mocha.pops.one
```

2. In a new terminal, export the authentication token:

```bash
CELESTIA_NODE_AUTH_TOKEN=$(celestia light auth admin --p2p.network mocha)
```

3. Get your node's address (this will be the granter address) and store it as a variable:

```bash
GRANTER_ADDRESS=$(celestia state account-address | jq -r .result) && echo $GRANTER_ADDRESS
```

4. Set the grantee address (the address that will receive the grant):

```bash
GRANTEE_ADDRESS=<grantee-address>
```

5. Send the feegrant request using curl:

```bash
curl -H "Content-Type: application/json" \
     -H "Authorization: Bearer $CELESTIA_NODE_AUTH_TOKEN" \
     -X POST \
     --data "{
       \"id\": 1,
       \"jsonrpc\": \"2.0\",
       \"method\": \"state.GrantFee\",
       \"params\": [
         \"$GRANTEE_ADDRESS\",
         \"42\",
         {
           \"gas_price\": 0.002,
           \"is_gas_price_set\": true,
           \"gas\": 142225,
           \"key_name\": \"my_celes_key\",
           \"signer_address\": \"$GRANTEE_ADDRESS\",
           \"fee_granter_address\": \"$GRANTER_ADDRESS\"
         }
       ]
     }" http://localhost:26658/
```

A successful response will look like this:

```json
{
  "id": 1,
  "jsonrpc": "2.0",
  "result": {
    "height": 3068554,
    "txhash": "4AAFDA4CE622C56CE9681B7E3BE7773E3B36ABE6C02BD66111BD2F2491011FD2",
    "logs": null,
    "events": null
  }
}
```

You can verify the transaction on [Celenium Explorer](https://mocha.celenium.io/tx/4AAFDA4CE622C56CE9681B7E3BE7773E3B36ABE6C02BD66111BD2F2491011FD2?tab=messages) by searching for the transaction hash.

The parameters in the request are:

- `gas_price`: The price of gas in utia
- `is_gas_price_set`: Boolean indicating if gas price is explicitly set
- `gas`: The gas limit for the transaction
- `key_name`: The name of your key in the keyring
- `signer_address`: The address being granted permission to use the granter's funds
- `fee_granter_address`: The address that will pay for the transaction fees
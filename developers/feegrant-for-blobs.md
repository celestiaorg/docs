# FeeGrant module for blobs submission

## Overview

This guide provides developers with the knowledge to use the FeeGrant
module on the Celestia's Mocha testnet chain for granting a data
availability node's account to submit blobs without constantly
funding it, enabling a third-party account to cover the transaction fees.

## Pre-requisites

- celestia-app CLI installed
- celestia-node and CLI tools installed
- Access to a Mocha node (e.g., `https://rpc.celestia-mocha.com:443`)
- Running DA Light node on Mocha testnet
- Separate Celestia account with sufficient funds

## Introduction

Each DA node contains a Celestia account that is used to pay for blobs
submissions. To unify the fee payment process, the FeeGrant module
allows a third-party account to pay for the fees incurred by the DA node's
account. You will need one account that will contain the funds and another
account that will be in the DA node. You will see the DA node's account
once you initialize the node.

## Granting fee allowances

To grant fee allowances, allowing a third-party (granter) account to pay
for the fees incurred by a Celestia data availability node (grantee)
account, use the following command:

```bash
celestia-appd tx feegrant grant \
  [granter_address] [grantee_address] \
  --home [path_to_granter] \
  --node [rpc_endpoint] \
  --spend-limit 1000000utia \
  --allowed-messages "/cosmos.bank.v1beta1.MsgSend,/celestia.blob.v1.MsgPayForBlobs" \
  --chain-id mocha-4 \
  --keyring-backend test \
  --fees 20000utia \
  --broadcast-mode block \
  --yes
```

Example:
[FeeGrant transaction on Mocha](https://mocha.celenium.io/tx/802a17777fbeab416f6fa2c25f0c56dd9cc8a92afc2a96293d114ac7c22efb5c)

## Verifying balances and transactions

Before diving into the specifics of verifying balances and transactions,
it's important to note that currently, it's necessary to fund the light node
for its transactions to be included in the state of the chain.
This step adds an extra layer of complexity and are actively working on improving
the user experience. Future updates to the nodes implementations will aim to
make this step non-mandatory for the FeeGrant module to function effectively,
streamlining the process for developers and users alike.

### Check balance of the new DA light node

To check the balance of a new light node, use the following command:
<!-- markdownlint-disable MD013 -->
```bash
celestia state balance --node.store ~/.celestia-light-mocha-4/
```
<!-- markdownlint-enable MD013 -->

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

### Funding the light node

As of now, to ensure the light node's transactions are included in the
state, you must initially fund the light node with the least amount
of funds using the following command:

```bash
celestia-appd tx bank send [granter_address] [grantee_address] 10000utia \
  --node https://rpc.celestia-mocha.com:443 \
  --chain-id mocha-4 \
  --keyring-backend test \
  --fees 20000utia \
  --broadcast-mode block \
  --yes \
  --home ~/.celestia-app/
```

### Submitting a blob

To submit a blob, utilize the following command:
<!-- markdownlint-disable MD013 -->
```bash
celestia blob submit --input-file blob.json --node.store ~/.celestia-light-mocha-4/
```
<!-- markdownlint-enable MD013 -->

### Checking account balances after submission

Light node account:
After submitting a blob, you can check the light node account's balance
to verify that the fees have been deducted:
<!-- markdownlint-disable MD013 -->
```bash
celestia state balance --node.store ~/.celestia-light-mocha-4/
```
<!-- markdownlint-enable MD013 -->

Example output showing fees are not deducted:

```json
{
  "result": {
    "denom": "utia",
    "amount": "10000"
  }
}
```

### Third-party account:

To confirm that the fees have been deducted from the third-party account that
granted the fee allowance, run:

```bash
celestia-appd query bank balances [granter_address] \
--node https://rpc.celestia-mocha.com:443 --denom utia
```

This output will show the remaining balance after fees have been deducted,
confirming that the FeeGrant module is working as intended.

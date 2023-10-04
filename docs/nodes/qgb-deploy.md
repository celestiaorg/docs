---
sidebar_label: Deploy the QGB contract
description: Learn how to deploy the QGB smart contract.
---

# Deploy the QGB contract

<!-- markdownlint-disable MD013 -->

The `deploy` is a helper command that allows deploying the QGB smart contract to a new EVM chain:

```ssh
qgb deploy --help

Deploys the QGB contract and initializes it using the provided Celestia chain

Usage:
  qgb deploy <flags> [flags]
  qgb deploy [command]

Available Commands:
  keys        QGB keys manager
```

## How to run

### Install the QGB binary

Make sure to have the QGB binary installed. Check [here](https://docs.celestia.org/nodes/qgb-binary) for more details.

### Add keys

In order to deploy a QGB smart contract, you will need a funded EVM address and its private key. The `keys` command will help you set up this key:

```ssh
qgb deploy keys  --help
```

To import your EVM private key, there is the `import` subcommand to assist you with that:

```ssh
qgb deploy keys evm import --help
```

This subcommand allows you to either import a raw ECDSA private key provided as plaintext, or import it from a file. The files are JSON keystore files encrypted using a passphrase like in [here](https://geth.ethereum.org/docs/developers/dapp-developer/native-accounts).

After adding the key, you can check that it's added via running:

```ssh
qgb deploy keys evm list
```

For more information about the `keys` command, check the `keys` documentation in [here](https://github.com/celestiaorg/orchestrator-relayer/blob/main/docs/keys.md).

### Deploy the contract

Now, we can deploy the QGB contract to a new EVM chain:

```ssh
qgb deploy \
  --evm.chain-id 4 \
  --evm.contract-address 0x27a1F8CE94187E4b043f4D57548EF2348Ed556c7 \
  --core.grpc.host localhost \
  --core.grpc.port 9090 \
  --starting-nonce latest \
  --evm.rpc http://localhost:8545
```

The `latest` can be replaced by the following:

- `latest`: to deploy the QGB contract starting from the latest validator set.
- `earliest`: to deploy the QGB contract starting from genesis.
- `nonce`: you can provide a custom nonce on where you want the QGB to start. If the provided nonce is not a `Valset` attestation, then the one before it will be used to deploy the QGB smart contract.

And, now you will see the QGB smart contract address in the logs along with the transaction hash.

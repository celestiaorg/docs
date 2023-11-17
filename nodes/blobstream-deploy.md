---
sidebar_label: Deploy the Blobstream contract
description: Learn how to deploy the Blobstream smart contract.
---

# Deploy the Blobstream contract

<!-- markdownlint-disable MD013 -->

The `deploy` is a helper command that allows deploying the Blobstream smart contract to a new EVM chain:

```sh
blobstream deploy --help

Deploys the Blobstream contract and initializes it using the provided Celestia chain

Usage:
  blobstream deploy <flags> [flags]
  blobstream deploy [command]

Available Commands:
  keys        Blobstream keys manager
```

## How to run

### Install the Blobstream binary

Make sure to have the Blobstream binary installed. Check [the Blobstream binary page](https://docs.celestia.org/nodes/blobstream-binary) for more details.

### Add keys

In order to deploy a Blobstream smart contract, you will need a funded EVM address and its private key. The `keys` command will help you set up this key:

```sh
blobstream deploy keys  --help
```

To import your EVM private key, there is the `import` subcommand to assist you with that:

```sh
blobstream deploy keys evm import --help
```

This subcommand allows you to either import a raw ECDSA private key provided as plaintext, or import it from a file. The files are JSON keystore files encrypted using a passphrase like in [this example](https://geth.ethereum.org/docs/developers/dapp-developer/native-accounts).

After adding the key, you can check that it's added via running:

```sh
blobstream deploy keys evm list
```

For more information about the `keys` command, check [the `keys` documentation](https://docs.celestia.org/nodes/blobstream-keys).

### Deploy the contract

Now, we can deploy the Blobstream contract to a new EVM chain:

```sh
blobstream deploy \
  --evm.chain-id 4 \
  --evm.contract-address 0x27a1F8CE94187E4b043f4D57548EF2348Ed556c7 \
  --core.grpc localhost:9090 \
  --core.rpc localhost:26657 \
  --starting-nonce latest \
  --evm.rpc http://localhost:8545
```

The `--starting-nonce` can have the following values:

- `latest`: to deploy the Blobstream contract starting from the latest validator set.
- `earliest`: to deploy the Blobstream contract starting from genesis.
- `nonce`: you can provide a custom nonce on where you want Blobstream to start. If the provided nonce is not a `Valset` attestation, then the valset before it will be used to deploy the Blobstream smart contract.

And, now you will see the Blobstream smart contract address in the logs along with the transaction hash.

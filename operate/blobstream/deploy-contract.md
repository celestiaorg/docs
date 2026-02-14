# Deploy the Blobstream contract

The `deploy` is a helper command that allows deploying the Blobstream smart contract to a new EVM chain:

```bash
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

Make sure to have the Blobstream binary installed. Check [the Blobstream binary page](/operate/blobstream/install-binary) for more details.

### Add keys

In order to deploy a Blobstream smart contract, you will need a funded EVM address and its private key. The `keys` command will help you set up this key:

```bash
blobstream deploy keys --help
```

To import your EVM private key, there is the `import` subcommand to assist you with that:

```bash
blobstream deploy keys evm import --help
```

This subcommand allows you to either import a raw ECDSA private key provided as plaintext, or import it from a file. The files are JSON keystore files encrypted using a passphrase like in [this example](https://geth.ethereum.org/docs/developers/dapp-developer/native-accounts).

After adding the key, you can check that it's added via running:

```bash
blobstream deploy keys evm list
```

For more information about the `keys` command, check [the keys documentation](/operate/blobstream/key-management).

### Deploy the contract

Now, you can deploy the Blobstream contract to a new EVM chain:

```bash
blobstream deploy \
  --evm.chain-id 4 \
  --evm.contract-address 0x27a1F8CE94187E4b043f4D57548EF2348Ed556c7 \
  --core.grpc.host localhost \
  --core.grpc.port 9090 \
  --starting-nonce latest \
  --evm.rpc http://localhost:8545
```

The `--starting-nonce` can be replaced by the following:

- `latest`: to deploy the Blobstream contract starting from the latest validator set
- `earliest`: to deploy the Blobstream contract starting from genesis
- `nonce`: you can provide a custom nonce on where you want Blobstream to start. If the provided nonce is not a `Valset` attestation, then the one before it will be used to deploy the Blobstream smart contract

After deployment, you will see the Blobstream smart contract address in the logs along with the transaction hash.
# Blobstream relayer

The role of the relayer is to gather attestations' signatures from the orchestrators, and submit them to a target EVM chain. The attestations are generated within the Blobstream module of the Celestia-app state machine. To learn more about what attestations are, you can refer to [the Blobstream overview](https://github.com/celestiaorg/orchestrator-relayer).

While every validator in the Celestia validator set needs to run an orchestrator, only one entity needs to run the relayer, and it can be anyone. Thus, if you're a validator, most likely you want to read [the orchestrator documentation](/operate/blobstream/orchestrator).

Every relayer needs to target a Blobstream smart contract. This can be deployed, if not already, using the `blobstream deploy` command. More details in the [Deploy the Blobstream contract guide](/operate/blobstream/deploy-contract).

## How it works

The relayer works as follows:

1. Connect to a Celestia-app full node or validator node via RPC and gRPC and wait for attestations
2. Once an attestation is created inside the Blobstream state machine, the relayer queries it
3. After getting the attestation, the relayer checks if the target Blobstream smart contract's nonce is lower than the attestation
4. If so, the relayer queries the P2P network for signatures from the orchestrators
5. Once the relayer finds more than 2/3s signatures, it submits them to the target Blobstream smart contract where they get validated
6. Listen for new attestations and go back to step 2

The relayer connects to a separate P2P network than the consensus or the data availability one. Bootstrappers for that network will be provided.

This means that even if the consensus node is already connected to the consensus network, if the relayer doesn't start with a list of bootstrappers for its specific network, then it will not work and will output the following logs:

```text
I[2023-04-26|00:04:08.175] waiting for routing table to populate        targetnumberofpeers=1 currentcount=0
I[2023-04-26|00:04:18.175] waiting for routing table to populate        targetnumberofpeers=1 currentcount=0
I[2023-04-26|00:04:28.175] waiting for routing table to populate        targetnumberofpeers=1 currentcount=0
```

## How to run

### Install the Blobstream binary

Make sure to have the Blobstream binary installed. Check out the [Install the Blobstream binary page](/operate/blobstream/install-binary) for more details.

### Init the store

Before starting the relayer, you need to init the store:

```bash
blobstream relayer init
```

By default, the store will be created under `~/.relayer`. However, if you want to specify a custom location, you can use the `--home` flag. Or, you can use the following environment variable:

| Variable       | Explanation                    | Default value | Required |
| -------------- | ------------------------------ | ------------- | -------- |
| `RELAYER_HOME` | Home directory for the relayer | `~/.relayer`  | Optional |

### Add keys

In order for the relayer to start, it will need two private keys:

- EVM private key
- P2P private key

The EVM private key is the most important since it needs to be funded, so it is able to send transactions in the target EVM chain.

The P2P private key is optional, and a new one will be generated automatically on start if none is provided.

The `keys` command will help you set up these keys:

```bash
blobstream relayer keys --help
```

To add an EVM private key, check the next section.

#### EVM key

Because EVM keys are important, we provide a keystore that will help manage them. The keystore uses a file system keystore protected by a passphrase to store and open private keys.

To import your EVM private key, there is the `import` subcommand to assist you with that:

```bash
blobstream relayer keys evm import --help
```

This subcommand allows you to either import a raw ECDSA private key provided as plaintext, or import it from a file. The files are JSON keystore files encrypted using a passphrase like [in this example](https://geth.ethereum.org/docs/developers/dapp-developer/native-accounts).

After adding the key, you can check that it's added via running:

```bash
blobstream relayer keys evm list
```

For more information about the `keys` command, check [the keys documentation](/operate/blobstream/key-management).

### Start the relayer

Now that you have the store initialized, and you have a target Blobstream smart contract address, you can start the relayer. Make sure you have your Celestia-app node RPC and gRPC accessible, and able to connect to the P2P network bootstrappers.

The relayer accepts the following flags:

```bash
blobstream relayer start --help

Runs the Blobstream relayer to submit attestations to the target EVM chain

Usage:
  blobstream relayer start <flags> [flags]
```

To start the relayer using the default home directory, run the following:

```bash
blobstream relayer start \
  --evm.contract-address=0x27a1F8CE94187E4b043f4D57548EF2348Ed556c7 \
  --core.rpc.host=localhost \
  --core.rpc.port=26657 \
  --core.grpc.host=localhost \
  --core.grpc.port=9090 \
  --evm.chain-id=4 \
  --evm.rpc=http://localhost:8545 \
  --evm.account=0x35a1F8CE94187E4b043f4D57548EF2348Ed556c8 \
  --p2p.bootstrappers=/ip4/127.0.0.1/tcp/30001/p2p/12D3KooWFFHahpcZcuqnUhpBoX5fJ68Qm5Hc8dxiBcX1oo46fLxh \
  --p2p.listen-addr=/ip4/0.0.0.0/tcp/30001
```

You will be prompted to enter your EVM key passphrase for the EVM address passed using the `--evm.account` flag, so that the relayer can use it to send transactions to the target Blobstream smart contract. Make sure that it's funded.
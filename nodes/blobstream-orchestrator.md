---
sidebar_label: Blobstream Orchestrator
description: Learn about the Blobstream Orchestrator.
---

# Blobstream Orchestrator

<!-- markdownlint-disable MD013 -->
<!-- markdownlint-disable MD010 -->

The role of the orchestrator is to sign attestations using its corresponding validator EVM private key. These attestations are generated within the Blobstream module of the Celestia-app state machine. To learn more about what attestations are, you can refer to [the Blobstream overview](https://github.com/celestiaorg/celestia-app/tree/main/x/blobstream).

## How it works

The orchestrator does the following:

1. Connect to a Celestia-app full node or validator node via RPC and gRPC and wait for new attestations
2. Once an attestation is created inside the Blobstream state machine, the orchestrator queries it.
3. After getting the attestation, the orchestrator signs it using the provided EVM private key. The private key should correspond to the EVM address provided when creating the validator. Read [more about Blobstream keys](https://docs.celestia.org/nodes/blobstream-keys/).
4. Then, the orchestrator pushes its signature to the P2P network it is connected to, via adding it as a DHT value.
5. Listen for new attestations and go back to step 2.

The orchestrator connects to a separate P2P network from the consensus or the data availability networks.

The bootstrapper node for the Mocha testnet is:

```sh
/dns/bootstr-0-mocha-blobstream.celestia-mocha.com/tcp/30000/p2p/12D3KooWLrw6EQgDwvgqrqT8wLNJoQYN3SDAzaAxJgyiTa2xowyF
```

Make sure to specify the bootstrapper using the `--p2p.bootstrappers` flag when running the orchestrator or set it in the `<orchestrator_home>/config/config.toml` config file.

This means that even if the consensus node is already connected to the consensus network, if the orchestrator doesn't start with a list of bootstrapper to its specific network, then, it will not work and will output the following logs:

```text
I[2023-04-26|00:04:08.175] waiting for routing table to populate        targetnumberofpeers=1 currentcount=0
I[2023-04-26|00:04:18.175] waiting for routing table to populate        targetnumberofpeers=1 currentcount=0
I[2023-04-26|00:04:28.175] waiting for routing table to populate        targetnumberofpeers=1 currentcount=0
```

## How to run

### Requirements

To run an orchestrator, you will need to have access to the following:

- Access to your EVM address private key. This address doesn't need to be funded in any network. If yours is not yet set, check the [register an EVM address](#register-evm-address) section.
- A list of bootstrappers for the P2P network.
- Access to your consensus node RPC and gRPC ports.

### Install the Blobstream binary

Make sure to have the Blobstream binary installed. Check [the Blobstream binary page](https://docs.celestia.org/nodes/blobstream-binary) for more details.

### Init the store

Before starting the orchestrator, we will need to init the store:

```sh
blobstream orchestrator init
```

By default, the store will be created under `~/.orchestrator`. However, if you want to specify a custom location, you can use the `--home` flag. Or, you can use the following environment variable:

| Variable            | Explanation                         | Default value     | Required |
| ------------------- | ----------------------------------- | ----------------- | -------- |
| `ORCHESTRATOR_HOME` | Home directory for the orchestrator | `~/.orchestrator` | Optional |

### Add keys

In order for the orchestrator to start, it will need two private keys:

- EVM private key
- P2P private key

The EVM private key is the most important one since it needs to correspond to the EVM address provided when creating the validator.

The P2P private key is optional, and a new one will be generated automatically on the start if none is provided.

The `keys` command will help you set up these keys:

```sh
blobstream orchestrator keys  --help
```

To add an EVM private key, check the next section.

#### EVM key

Because EVM keys are important, we provide a keystore that will help manage them. The keystore uses a file system keystore protected by a passphrase to store and open private keys.

To import your EVM private key, there is the `import` subcommand to assist you with that:

```sh
blobstream orchestrator keys evm import --help
```

This subcommand allows you to either import a raw ECDSA private key provided as plaintext, import it from a file, or use a BIP39 mnemonic and derive a private key from it. The files are JSON keystore files encrypted using a passphrase like in [this example](https://geth.ethereum.org/docs/developers/dapp-developer/native-accounts).

After adding the key, you can check that it's added via running:

```sh
blobstream orchestrator keys evm list
```

For more information about the `keys` command, check [the `keys` documentation](https://docs.celestia.org/nodes/blobstream-keys).

Then, you will need to register the EVM address for your validator as specified in the [Register EVM Address](#register-evm-address) section.

### Open the P2P port

In order for the signature propagation to be successful, you will need to expose the P2P port, which is by default `30000`.

If not, then the signatures may not be available to the network and relayers will not be able to query them.

### Start the orchestrator

Now that we have the store initialized, we can start the orchestrator. Make sure you have your Celestia-app node RPC and gRPC accessible, and able to connect to the P2P network bootstrappers.

The orchestrator accepts the following flags:

```sh
blobstream orchestrator start --help

Starts the Blobstream orchestrator to sign attestations

Usage:
  blobstream orchestrator start <flags> [flags]

Flags:
      --core.grpc string           Specify the celestia app grpc address (default "localhost:9090")
      --core.rpc string            Specify the celestia app rest rpc address (default "tcp://localhost:26657")
      --evm.account string         Specify the EVM account address to use for signing (Note: the private key should be in the keystore)
      --evm.passphrase string      the evm account passphrase (if not specified as a flag, it will be asked interactively)
      --grpc.insecure              allow gRPC over insecure channels, if not TLS the server must use TLS
  -h, --help                       help for start
      --home string                The Blobstream orchestrator home directory (default "/Users/joshstein/.orchestrator")
      --log.format string          The logging format (json|plain) (default "plain")
      --log.level string           The logging level (trace|debug|info|warn|error|fatal|panic) (default "info")
      --p2p.bootstrappers string   Comma-separated multiaddresses of p2p peers to connect to
      --p2p.listen-addr string     MultiAddr for the p2p peer to listen on (default "/ip4/0.0.0.0/tcp/30000")
      --p2p.nickname string        Nickname of the p2p private key to use (if not provided, an existing one from the p2p store or a newly generated one will be used)
```

Also, you can set the necessary configuration in the orchestrator's TOML config file. You can find the orchestrator's TOML config file in the orchestrator's home directory under `config/config.toml`. This would save you from setting all the flags in the command.

> **_NOTE:_** The CLI flags take precedence over the config files for the same parameters.

To start the orchestrator in the default home directory, run the following:

```sh
blobstream orchestrator start --evm.account 0x966e6f22781EF6a6A82BBB4DB3df8E225DfD9488
```

> **_NOTE:_** The above command assumes that the necessary configuration is specified in the  `<orchestrator_home>/config/config.toml` file.

Then, you will be prompted to enter your EVM key passphrase so that the orchestrator can use it to sign attestations. Make sure that it's the EVM address that was provided when creating the validator. If not, then the orchestrator will not sign, and you will keep seeing a "validator not part of valset" warning message. If you see such message, first verify that your validator is part of the active validator set. If so, then probably the EVM address provided to the orchestrator is not the right one, and you should check which EVM address is registered to your validator. Check the [Register EVM Address](#register-evm-address) section for more information.

If you no longer have access to your EVM address, you could always edit your validator with a new EVM address. This can be done through the `edit-validator` command. Check the [Register EVM Address](#register-evm-address) section.

### Known issues

#### `transport: authentication handshake failed`

```text
rpc error: code = Unavailable desc = connection error: desc = "transport: authentication handshake failed: tls: first record does not look like a TLS handshake" 
```

Seeing this error means that the orchestrator/relayer is trying to connect to a gRPC endpoint that is not secure. To bypass this, use the `--grpc.insecure` flag. However, we recommend using secure gRPC connections.

#### `failed to query last valset before nonce (most likely pruned)`

This warning shows that an attestation, that is needed by the orchestrator/relayer, has been pruned from the state machine. However, it's not an issue since we implemented fallback mechanisms that will use the P2P network to get it. And if that doesn't work, connecting the orchestrator/relayer to an archive node will get that attestation.

So, seeing that warning is not a problem.

### Register EVM Address

When creating a validator, a random EVM address corresponding to its operator is set in the Blobstream state. This address will be used by the orchestrator to sign attestations. And since validators will generally not have access to its corresponding private key, that address needs to be edited with one whose private key is known to the validator operator.

> **_NOTE:_** When a validator wants to start an orchestrator for a Celestia network for the first time, they will need to generate an EVM address offchain, either using the [EVM keystore](#evm-key) methods or a third party software that allows generating Ethereum addresses and provide you with a private key or a BIP39 mnemonic.

So, to edit an EVM address for a certain validator, its corresponding account needs to send a `RegisterEVMAddress` transaction with the new address.

First, you should get your validator `valoper` address. To do so, run the following:

```sh
celestia-appd keys show <validator_account> --bech val
```

This assumes that you're using the default home directory, the default keystore etc. If not, make sure to add the flags that correspond to your situation.

To check which EVM address is registered for your `valoper` address, run the following:

```sh
celestia-appd query qgb evm <validator_valoper_address>
```

Then, to proceed with the edit, run the following command:

```shell
celestia-appd tx qgb register \
    <valoper_address> \
    <new_evm_address> \
    --fees 30000utia \
    --broadcast-mode block \
    --yes \
    --from your_wallet
```

Example command output:

```sh
code: 0
codespace: ""
data: 12300A2E2F63656C65737469612E7167622E76312E4D7367526567697374657245564D41646472657373526573706F6E7365
events:
- attributes:
  - index: true
    key: c3BlbmRlcg==
    value: Y2VsZXN0aWExcDkzcmd6Mnl5MG5hMnN5OWc3a3NzanY2MDY2dWxqcWV3cGpwZ2c=
  - index: true
    key: YW1vdW50
    value: MzAwMDB1dGlh
  type: coin_spent
- attributes:
  - index: true
    key: cmVjZWl2ZXI=
    value: Y2VsZXN0aWExN3hwZnZha20yYW1nOTYyeWxzNmY4NHoza2VsbDhjNWxwbmpzM3M=
  - index: true
    key: YW1vdW50
    value: MzAwMDB1dGlh
  type: coin_received
- attributes:
  - index: true
    key: cmVjaXBpZW50
    value: Y2VsZXN0aWExN3hwZnZha20yYW1nOTYyeWxzNmY4NHoza2VsbDhjNWxwbmpzM3M=
  - index: true
    key: c2VuZGVy
    value: Y2VsZXN0aWExcDkzcmd6Mnl5MG5hMnN5OWc3a3NzanY2MDY2dWxqcWV3cGpwZ2c=
  - index: true
    key: YW1vdW50
    value: MzAwMDB1dGlh
  type: transfer
- attributes:
  - index: true
    key: c2VuZGVy
    value: Y2VsZXN0aWExcDkzcmd6Mnl5MG5hMnN5OWc3a3NzanY2MDY2dWxqcWV3cGpwZ2c=
  type: message
- attributes:
  - index: true
    key: ZmVl
    value: MzAwMDB1dGlh
  - index: true
    key: ZmVlX3BheWVy
    value: Y2VsZXN0aWExcDkzcmd6Mnl5MG5hMnN5OWc3a3NzanY2MDY2dWxqcWV3cGpwZ2c=
  type: tx
- attributes:
  - index: true
    key: YWNjX3NlcQ==
    value: Y2VsZXN0aWExcDkzcmd6Mnl5MG5hMnN5OWc3a3NzanY2MDY2dWxqcWV3cGpwZ2cvMQ==
  type: tx
- attributes:
  - index: true
    key: c2lnbmF0dXJl
    value: cE5ZS0pqWEZlOFVTaEZUdDdzRHVETWZNWW55YjZTT01iZnlBSkZGYnZpVk45bGJ2L2tUeXhEWWxHK2VjRE94bFlSajJIMmlWNGJLWVhMNDBQM1F4TUE9PQ==
  type: tx
- attributes:
  - index: true
    key: YWN0aW9u
    value: L2NlbGVzdGlhLnFnYi52MS5Nc2dSZWdpc3RlckVWTUFkZHJlc3M=
  type: message
gas_used: "66959"
gas_wanted: "210000"
height: "3"
info: ""
logs:
- events:
  - attributes:
    - key: action
      value: /celestia.blobstream.v1.MsgRegisterEVMAddress
    type: message
  log: ""
  msg_index: 0
raw_log: '[{"msg_index":0,"events":[{"type":"message","attributes":[{"key":"action","value":"/celestia.blobstream.v1.MsgRegisterEVMAddress"}]}]}]'
timestamp: ""
tx: null
txhash: 4199EA959A2CFEFCD4726D8D8F7B536458A46A27318D3483A4E9614F560606BC
```

Now, you can verify that the EVM address has been updated using the following command:

```sh
celestia-appd query qgb evm <validator_valoper_address>
```

Now, you can restart the orchestrator, and it should start signing.

Note: A validator set change is triggered if more than 5% of the total staking power of the network changes. This means that even if you change your EVM address, and you don't see your orchestrator signing, it's alright. Just wait until the validator set changes, and then your orchestrator will automatically start signing.

#### Systemd service

If you want to start the orchestrator as a `systemd` service, you could use the following:

- Make sure you have the store initialized and the EVM address private key imported. Check the above sections for how to do that.
- Put the following configuration under: `/etc/systemd/system/orchestrator.service`:

```text
[Unit]
Description=Blobstream orchestrator service
After=network.target

[Service]
Type=simple
ExecStart=<absolute_path_to_blobstream_binary> orchestrator start --evm.account <evm_account> --evm.passphrase <evm_passphrase>
LimitNOFILE=infinity
LimitCORE=infinity
Restart=always
RestartSec=1
StartLimitBurst=5
User=<username>
StandardError=journal
StandardOutput=journal
TTYPath=/dev/tty0

[Install]
WantedBy=multi-user.target
```

- Start the orchestrator service using:

```shell
sudo systemctl start orchestrator
```

- Follow the logs to see if everything is running correctly:

```shell
sudo journalctl -f -u orchestrator
```

And you should see the orchestrator signing.

##### Issue: Journald not outputting the logs

Sometimes, `journald` wouldn't load the logs from the specified service. An easy fix would be to restart it:

```shell
sudo systemctl restart systemd-journald
```

Then, you should be able to follow the logs as expected.

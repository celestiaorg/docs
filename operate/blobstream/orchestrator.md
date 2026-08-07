# Blobstream orchestrator

The role of the orchestrator is to sign attestations using its corresponding validator EVM private key. These attestations are generated within the Blobstream module of the Celestia-app state machine. To learn more about what attestations are, you can refer to [the Blobstream overview](https://github.com/celestiaorg/orchestrator-relayer).

## How it works

The orchestrator does the following:

1. Connect to a Celestia-app full node or validator node via RPC and gRPC and wait for new attestations
2. Once an attestation is created inside the Blobstream state machine, the orchestrator queries it
3. After getting the attestation, the orchestrator signs it using the provided EVM private key. The private key should correspond to the EVM address provided when creating the validator. Read [more about Blobstream keys](/operate/blobstream/key-management)
4. Then, the orchestrator pushes its signature to the P2P network it is connected to, via adding it as a DHT value
5. Listen for new attestations and go back to step 2

The orchestrator connects to a separate P2P network than the consensus or the data availability one. Bootstrappers for that network will be provided.

Bootstrapper for the Mocha testnet is:

```
/dns/bootstr-incent-1.celestia.tools/tcp/30000/p2p/12D3KooWSGZ2LXW2soQFHgU82uLfN7pNW5gMMkTnu1fhMXG43TvP
```

Make sure to specify it using the `-b` flag when running the orchestrator.

This means that even if the consensus node is already connected to the consensus network, if the orchestrator doesn't start with a list of bootstrappers for its specific network, then it will not work and will output the following logs:

```text
I[2023-04-26|00:04:08.175] waiting for routing table to populate        targetnumberofpeers=1 currentcount=0
I[2023-04-26|00:04:18.175] waiting for routing table to populate        targetnumberofpeers=1 currentcount=0
I[2023-04-26|00:04:28.175] waiting for routing table to populate        targetnumberofpeers=1 currentcount=0
```

## How to run

### Requirements

To run an orchestrator, you will need to have access to the following:

- Access to your EVM address private key. This doesn't need to be funded in any network. If yours is not yet set, check the [register an EVM address](#register-evm-address) section
- A list of bootstrappers for the P2P network. These will be shared by the team for every network supported
- Access to your consensus node RPC and gRPC ports

### Install the Blobstream binary

Make sure to have the Blobstream binary installed. Check [the Blobstream binary page](/operate/blobstream/install-binary) for more details.

### Init the store

Before starting the orchestrator, you need to init the store:

```bash
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

The P2P private key is optional, and a new one will be generated automatically on start if none is provided.

The `keys` command will help you set up these keys:

```bash
blobstream orchestrator keys --help
```

To add an EVM private key, check the next section.

#### EVM key

Because EVM keys are important, we provide a keystore that will help manage them. The keystore uses a file system keystore protected by a passphrase to store and open private keys.

To register an EVM address for your validator, check the section [Register EVM Address](#register-evm-address).

To import your EVM private key, there is the `import` subcommand to assist you with that:

```bash
blobstream orchestrator keys evm import --help
```

This subcommand allows you to either import a raw ECDSA private key provided as plaintext, or import it from a file. The files are JSON keystore files encrypted using a passphrase like in [this example](https://geth.ethereum.org/docs/developers/dapp-developer/native-accounts).

After adding the key, you can check that it's added via running:

```bash
blobstream orchestrator keys evm list
```

For more information about the `keys` command, check [the keys documentation](/operate/blobstream/key-management).

### Start the orchestrator

Now that you have the store initialized, you can start the orchestrator. Make sure you have your Celestia-app node RPC and gRPC accessible, and able to connect to the P2P network bootstrappers.

The orchestrator accepts the following flags:

```bash
blobstream orchestrator start --help

Starts the Blobstream orchestrator to sign attestations

Usage:
  blobstream orchestrator start <flags> [flags]
```

To start the orchestrator in the default home directory, run the following:

```bash
blobstream orchestrator start \
    --core.grpc.host localhost \
    --core.grpc.port 9090 \
    --core.rpc.host localhost \
    --core.rpc.port 26657 \
    --evm.account 0x966e6f22781EF6a6A82BBB4DB3df8E225DfD9488 \
    --p2p.bootstrappers /ip4/127.0.0.1/tcp/30001/p2p/12D3KooWFFHahpcZcuqnUhpBoX5fJ68Qm5Hc8dxiBcX1oo46fLxh \
    --p2p.listen-addr /ip4/0.0.0.0/tcp/30000
```

You will be prompted to enter your EVM key passphrase so that the orchestrator can use it to sign attestations. Make sure that it's the EVM address that was provided when creating the validator. If not, then the orchestrator will not sign, and you will keep seeing a "validator not part of valset" warning message.

If you see such message, first verify that your validator is part of the active validator set. If so, then probably the EVM address provided to the orchestrator is not the right one, and you should check which EVM address is registered to your validator. Check the next section for more information.

If you no longer have access to your EVM address, you could always edit your validator with a new EVM address. This can be done through the `edit-validator` command. Check the next section.

### Open the P2P port

In order for the signature propagation to be successful, you will need to expose the P2P port, which is by default `30000`.

If not, then the signatures may not be available to the network and relayers will not be able to query them.

## Register EVM Address

When creating a validator, a random EVM address corresponding to its operator is set in the Blobstream state. This address is used by the orchestrator to sign attestations. And since validators will generally not have access to its corresponding private key, that address needs to be edited with one whose private key is known to the validator operator.

To edit an EVM address for a certain validator, its corresponding account needs to send a `RegisterEVMAddress` transaction with the new address.

First, you should get your validator `valoper` address. To do so, run the following:

```bash
celestia-appd keys show <validator_account> --bech val
```

This assumes that you're using the default home directory, the default keystore, etc. If not, make sure to add the flags that correspond to your situation.

To check which EVM address is registered for your `valoper` address, run the following:

```bash
celestia-appd query blobstream evm <validator_valoper_address>
```

Then, to proceed with the edit, run the following command:

```bash
celestia-appd tx blobstream register \
    <valoper_address> \
    <new_evm_address> \
    --fees 30000utia \
    --broadcast-mode block \
    --yes
```

Now, you can verify that the EVM address has been updated using the following command:

```bash
celestia-appd query blobstream evm <validator_valoper_address>
```

Now, you can restart the orchestrator, and it should start signing.

> **Note:** A validator set change is triggered if more than 5% of the total staking power of the network changes (0.5% for BSR). This means that even if you change your EVM address, and you don't see your orchestrator signing, it's alright. Just wait until the validator set changes, and then your orchestrator will automatically start signing.

## Systemd service

If you want to start the orchestrator as a `systemd` service, you can use the following:

1. Make sure you have the store initialized and the EVM address private key imported. Check the above sections for how to do that.

2. Put the following configuration under `/etc/systemd/system/orchestrator.service`:

```text
[Unit]
Description=Blobstream orchestrator service
After=network.target

[Service]
Type=simple
ExecStart=<absolute_path_to_blobstream_binary> orchestrator start --evm.account <evm_account> --evm.passphrase <evm_passphrase> --core.grpc.host <grpc_endpoint_host> --core.grpc.port <grpc_endpoint_port> --core.rpc.host <rpc_endpoint_host> --core.rpc.port <rpc_endpoint_port> --p2p.bootstrappers <bootstrappers_list>
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

3. Start the orchestrator service using:

```bash
sudo systemctl start orchestrator
```

4. Follow the logs to see if everything is running correctly:

```bash
sudo journalctl -f -u orchestrator
```

And you should see the orchestrator signing.

### Issue: Journald not outputting the logs

Sometimes, `journald` wouldn't load the logs from the specified service. An easy fix would be to restart it:

```bash
sudo systemctl restart systemd-journald
```

Then, you should be able to follow the logs as expected.
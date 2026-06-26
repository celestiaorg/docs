# IBC relaying guide

Celestia uses [IBC](https://ibcprotocol.dev/) to enable cross-chain token transfers. Relayers scan for outbound packets on one chain and submit them with proofs on the destination chain. This guide shows how to set up a relayer and create connections using Hermes between Celestia Mocha testnet and Cosmos Hub theta-testnet-001.

There are two standard relayer implementations:

- [Hermes](https://hermes.informal.systems/) (Rust)
- [Go Relayer](https://pkg.go.dev/github.com/cosmos/relayer) (Go)

Check the [latest celestia-app release's `go.mod`](https://github.com/celestiaorg/celestia-app/blob/2b8cc9e23826ccb658b7dd5aa6cd51a0921a0c29/go.mod#L35) for the ibc-go version in use.

## Hermes

[Hermes](https://github.com/informalsystems/hermes) is an open-source Rust relayer. Follow the [Hermes Quick Start](https://hermes.informal.systems/quick-start/) to install, then verify with `hermes version`.

### Configuration

After installing Hermes, edit `config.toml` to add your chains. This tutorial uses:

- Celestia `mocha-4` testnet
- Cosmos Hub `theta-testnet-001` testnet

Edit the Hermes configuration:

```bash
vim $HOME/.hermes/config.toml
```

```toml
[global]
log_level = "info"

[mode.clients]
enabled = true
refresh = true
misbehaviour = true

[mode.connections]
enabled = false

[mode.channels]
enabled = false

[mode.packets]
enabled = true
clear_interval = 100
clear_on_start = true
tx_confirmation = false
auto_register_counterparty_payee = false

[rest]
enabled = false
host = "127.0.0.1"
port = 3000

[telemetry]
enabled = false
host = "127.0.0.1"
port = 3001

[telemetry.buckets.latency_submitted]
start = 500
end = 20000
buckets = 10

[telemetry.buckets.latency_confirmed]
start = 1000
end = 30000
buckets = 10

[[chains]]
id = "theta-testnet-001"
type = "CosmosSdk"
rpc_addr = "https://rpc.sentry-01.theta-testnet.polypore.xyz"
grpc_addr = "https://grpc.sentry-01.theta-testnet.polypore.xyz"
rpc_timeout = "10s"
trusted_node = false
account_prefix = "cosmos"
key_name = "key-cosmos"
key_store_type = "Test"
store_prefix = "ibc"
default_gas = 100000
max_gas = 400000
gas_multiplier = 1.5
max_msg_num = 30
max_tx_size = 180000
max_grpc_decoding_size = 33554432
clock_drift = "5s"
max_block_time = "30s"
ccv_consumer_chain = false
memo_prefix = ""
sequential_batch_tx = false

[chains.event_source]
mode = "push"
url = "ws://rpc.sentry-01.theta-testnet.polypore.xyz:26657/websocket"
batch_delay = "500ms"

[chains.trust_threshold]
numerator = "1"
denominator = "3"

[chains.gas_price]
price = 0.025
denom = "uatom"

[chains.packet_filter]
policy = "allow"
list = [["transfer", "channel-3108"]]

[chains.packet_filter.min_fees]

[chains.address_type]
derivation = "cosmos"

[[chains]]
id = "mocha-4"
type = "CosmosSdk"
rpc_addr = "https://rpc-celestia-mocha.architectnodes.com"
grpc_addr = "https://grpc.celestia-mocha.com:443"
rpc_timeout = "10s"
trusted_node = false
account_prefix = "celestia"
key_name = "celestia-key"
key_store_type = "Test"
store_prefix = "ibc"
default_gas = 100000
max_gas = 400000
gas_multiplier = 1.5
max_msg_num = 30
max_tx_size = 180000
max_grpc_decoding_size = 33554432
clock_drift = "5s"
max_block_time = "30s"
ccv_consumer_chain = false
memo_prefix = ""
sequential_batch_tx = false

[chains.event_source]
mode = "push"
url = "ws://rpc-mocha.pops.one:26657/websocket"
batch_delay = "500ms"

[chains.trust_threshold]
numerator = "1"
denominator = "3"

[chains.gas_price]
price = 0.1
denom = "utia"

[chains.packet_filter]
policy = "allow"
list = [["transfer", "channel-0"]]

[chains.packet_filter.min_fees]

[chains.address_type]
derivation = "cosmos"
```

### Add relayer wallets

Import and fund wallets for both chains (native tokens required). Faucets:

- Celestia: [discord.gg](https://discord.com/invite/YsnTPcSfWQ)
- Cosmos Hub: [discord.gg/cosmosnetwork](https://discord.gg/cosmosnetwork)

Add Cosmos wallet:

```bash
hermes keys add --key-name key-cosmos --chain theta-testnet-001 --mnemonic-file $HOME/.hermes/key-cosmos-mnemonic.txt
```

Add Celestia wallet:

```bash
hermes keys add --key-name celestia-key --chain mocha-4 --mnemonic-file $HOME/.hermes/key-celestia-mnemonic.txt
```

### Create a channel

With both chains configured and wallets funded, create a channel:

```bash
hermes create channel --a-chain theta-testnet-001 --b-chain mocha-4 --a-port transfer --b-port transfer --new-client-connection
```

This command creates:
- New clients on both chains
- A connection between them
- A channel on the `transfer` port

### Relay packets

Start relaying packets on the channel:

```bash
hermes start
```

Hermes will now relay IBC packets between Mocha testnet and Cosmos Hub theta-testnet-001.
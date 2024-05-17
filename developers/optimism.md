---
description: Start your own devnet with a modified version of optimism-bedrock.
next:
  text: "Ethereum fallback mechanism"
  link: "/developers/ethereum-fallback"
---

# Run an OP Stack devnet posting Celestia

<!-- markdownlint-disable MD033 -->
<script setup>
import constants from '/.vitepress/constants/constants.js'
</script>

This guide will show you how to run your own OP Stack devnet locally that posts to a Celestia network.

If you'd like to use a Rollups as a Service (RaaS) provider, you can visit the RaaS category in the menu.

## Dependency setup

### Environment setup

First, [install dependencies for Celestia software](../nodes/environment.md)
and for [OP Stack](https://community.optimism.io/docs/developers/build/dev-node/).

### Clone repository

Next, clone the repo:

```bash
cd $HOME
git clone https://github.com/celestiaorg/optimism
cd optimism
```

Check out to the version for either the
[stable version](https://github.com/celestiaorg/optimism/releases) or
[upstream version](https://github.com/celestiaorg/optimism/tree/celestia-develop):

::: code-group

```bash-vue [v1.3.0-OP_op-node/v1.7.5-CN_v0.13.2]
git checkout tags/v1.3.0-OP_op-node/v1.7.5-CN_v0.13.2
git submodule update --init --recursive
```

```bash-vue [celestia-develop]
git checkout celestia-develop
git submodule update --init --recursive
```

:::

## Build devnet

Build TypeScript definitions for TS dependencies:

```bash
make
```

Set environment variables to start network:

```bash
export SEQUENCER_BATCH_INBOX_ADDRESS=0xff00000000000000000000000000000000000000
export L2OO_ADDRESS=0x70997970C51812dc3A010C7d01b50e0d17dc79C8
```

## Setting up your light node

In order to allow your light node to post
and retrieve data without errors, you will need to change `UseShareExchange`
to `false` in:

::: code-group

```bash-vue [Mainnet Beta]
$HOME/.celestia-light/config.toml
```

```bash-vue [Mocha]
$HOME/.celestia-light-{{constants.mochaChainId}}/config.toml
```

```bash-vue [Arabica]
$HOME/.celestia-light-{{constants.arabicaChainId}}/config.toml
```

:::

If you choose to use your own node store, the light node
must be **fully synced** and **funded** for you to be able to submit
and retrieve `PayForBlobs` to a Celestia network.
Visit the [Arabica](../nodes/arabica-devnet.md)
or [Mocha](../nodes/mocha-testnet.md) pages to
visit their faucets. If it is not synced, you will run into
[errors similar to this](https://github.com/celestiaorg/celestia-node/issues/2151/).

In order to mount existing data, you must have a node store that is
in the default directory:

::: code-group

```bash-vue [Mainnet Beta]
$HOME/.celestia-light
```

```bash-vue [Mocha]
$HOME/.celestia-light-{{constants.mochaChainId}}
```

```bash-vue [Arabica]
$HOME/.celestia-light-{{constants.arabicaChainId}}
```

:::

By default, the node will run with the account named
`my_celes_key`.
If you have your own setup you'd like to try, you can always edit
`optimism/ops-bedrock/docker-compose.yml` to work with your setup.

### Docker changes

You will need to modify the `da:` section of your `$HOME/optimism/ops-bedrock/docker-compose.yml`
for your specific use, similarly to the example below.
This setup will use `celestia-node` with
a DA server on port 26658.

For the `P2P_NETWORK` variable, you'll need to supply the network of choice, either
`celestia`, `mocha`, or `arabica`. Using `celestia`, the volume path will be just
`.celestia-light` instead of `.celestia-light-<network>`. You will also need
to provide a `--core.ip <RPC_URL>` for the network you are using.

<!-- markdownlint-disable MD013 -->

::: code-group

```yaml-vue [Mainnet Beta]
da:
  image: ghcr.io/rollkit/local-celestia-devnet:v0.13.1 // [!code --]
  image: ghcr.io/celestiaorg/celestia-node:v0.13.2 // [!code ++]
  command: celestia light start --p2p.network celestia --core.ip rpc.celestia.pops.one --gateway// [!code ++]
  ports:
    - "26658:26658"
    - "26659:26659" // [!code ++]
  volumes: // [!code ++]
    - $HOME/.celestia-light/:/home/celestia/.celestia-light/ // [!code ++]
  environment: // [!code ++]
    NODE_TYPE: "light" // [!code ++]
    P2P_NETWORK: "celestia" // [!code ++]
  user: root // [!code ++]
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:26659/header/1"]
    interval: 10s
    timeout: 5s
    retries: 5
    start_period: 30s
```

```yaml-vue [Mocha testnet]
da:
  image: ghcr.io/rollkit/local-celestia-devnet:v0.13.1 // [!code --]
  image: ghcr.io/celestiaorg/celestia-node:v0.13.2 // [!code ++]
  command: celestia light start --p2p.network mocha --core.ip consensus-full-mocha-4.celestia-mocha.com --gateway// [!code ++]
  ports:
    - "26658:26658"
    - "26659:26659" // [!code ++]
  volumes: // [!code ++]
    - $HOME/.celestia-light-{{constants.mochaChainId}}/:/home/celestia/.celestia-light-{{constants.mochaChainId}}/ // [!code ++]
  environment: // [!code ++]
    NODE_TYPE: "light" // [!code ++]
    P2P_NETWORK: "mocha" // [!code ++]
  user: root // [!code ++]
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:26659/header/1"]
    interval: 10s
    timeout: 5s
    retries: 5
    start_period: 30s
```

```yaml-vue [Arabica devnet]
da:
  image: ghcr.io/rollkit/local-celestia-devnet:v0.13.1 // [!code --]
  image: ghcr.io/celestiaorg/celestia-node:v0.13.2 // [!code ++]
  command: celestia light start --p2p.network arabica --core.ip validator-1.celestia-arabica-11.com --gateway// [!code ++]
  ports:
    - "26658:26658"
    - "26659:26659" // [!code ++]
  volumes: // [!code ++]
    - $HOME/.celestia-light-{{constants.arabicaChainId}}/:/home/celestia/.celestia-light-{{constants.arabicaChainId}}/ // [!code ++]
  environment: // [!code ++]
    NODE_TYPE: "light" // [!code ++]
    P2P_NETWORK: "arabica" // [!code ++]
  user: root // [!code ++]
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:26659/header/1"]
    interval: 10s
    timeout: 5s
    retries: 5
    start_period: 30s
```

:::

### Set your Celestia node auth token

::: code-group

```bash-vue [Mainnet Beta]
export CELESTIA_NODE_AUTH_TOKEN=$(celestia light auth admin)
```

```bash-vue [Mocha testnet]
export CELESTIA_NODE_AUTH_TOKEN=$(celestia light auth admin --p2p.network mocha)
```

```bash-vue [Arabica devnet]
export CELESTIA_NODE_AUTH_TOKEN=$(celestia light auth admin --p2p.network arabica)
```

:::

Now you're ready to start your devnet.

## Start devnet

Start the network by running:

```bash
make devnet-up
```

This starts up the layer 1 (ETH), layer 2 (`op-geth`), data availability
layer (Celestia), the sequencer (`op-node`), batch submitter (`op-batcher`),
state commitment service (`op-proposer`).

### View the logs of the devnet

If you'd like to view the logs of the devnet, run the following command
from the root of the Optimism directory:

```bash
make devnet-logs
```

### Optional: Stop devnet

If you'd like to start the network over, use the following command
to safely shut down all of the containers:

```bash
make devnet-down
```

Then clean out the old config:

```bash
make devnet-clean
```

## Deploying to an L1 (or L2)

If you'd like to deploy to an EVM L1 or L2,
reference the [OP stack deployment guide](https://community.optimism.io/docs/developers/bedrock/node-operator-guide/).

## Find a transaction

Now, we'll check for a recent transaction on the L1 with:

```bash
cast block latest --rpc-url localhost:8545
```

Output of a block that contains a transaction will look like this:

```console
baseFeePerGas        7
difficulty           2
extraData            0xd883010d04846765746888676f312e32312e33856c696e7578000000000000006b3afa42dce1f87f1f07a1ef569c4d43e41738ef93c865098bfa1458645f384e2e4498bcfe4ad9353ff1913a2e16162f496fafe5b0939a6c78fb5b503248d6da01
gasLimit             30000000
gasUsed              21568
hash                 0x1cb54d2369752ef73511c202ff9cdfd0eadf3a77b7aef0092bea63f2b5d57659
logsBloom            0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
miner                0x0000000000000000000000000000000000000000
mixHash              0x0000000000000000000000000000000000000000000000000000000000000000
nonce                0x0000000000000000
number               1141
parentHash           0x664bf4bb4a57dd5768a0a98991d77c58fb7a4e164c2581c79fb33ce9c3d4c250
receiptsRoot         0xaf8ff6af1180c8be9e4e8f3a5f882b3b227233f4abbefa479836d3721682a389
sealFields           []
sha3Uncles           0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347
size                 767
stateRoot            0xd4b998a35d20d98ed3488221f0c161a0a9572d3de66399482553c8e3d2fae751
timestamp            1699638350
withdrawalsRoot
totalDifficulty      2283
transactions:        [
  0x79a0a7a1b4936aafe7a37dbfb07a6a9e55c145a4ed6fd54f962649b4b7db8de7
]
```

Copy the transaction hash from `transactions: <transaction-hash>` and
set it as a variable:

```bash
export TX_HASH=0x79a0a7a1b4936aafe7a37dbfb07a6a9e55c145a4ed6fd54f962649b4b7db8de7
```

## Read the transaction call data

Now read the transaction call data on the L1:

```bash
cast tx $TX_HASH --rpc-url localhost:8545
```

The output will look similar to below:

```console
blockHash            0x9f4dfae061b5ddd86f95a81be5daa0d7fe32e7f7f770f86dc375e0007d249bd2
blockNumber          24
from                 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
gas                  21572
gasPrice             1040676758
hash                 0xadd3a5dc0b8c605aeac891098e87cbaff43bb642896ebbf74f964c0690e46df2
input                0xce3500000000000000769074a923011bdda721eacc34c8a77c69c10f2b6c8e659f987e82f217a5340f
nonce                4
r                    0xaf5c1505c7dfcebca94d9a6a8c0caf99b6c87a8ed6d6c0b3161c9026f270a84f
s                    0x383ed2debf9f9055920cd7340418dda7e2bca6b989eb6992d83d123d4e322f2a
to                   0xFf00000000000000000000000000000000000901
transactionIndex     0
v                    0
value                0
yParity              0
```

::: tip
You are looking for a batcher transaction to the address
`0xFf00000000000000000000000000000000000901`.
:::

First, remove the prefix `0xce`.
Now, set the `input` as the `INPUT` variable and encode it as
base64:

```bash
export INPUT=3500000000000000769074a923011bdda721eacc34c8a77c69c10f2b6c8e659f987e82f217a5340f
export ENCODED_INPUT=$(echo "$INPUT" | xxd -r -p | base64)
```

:::tip
Remember to remove the `0xce` prefix!
:::

## Find the data on Celestia

<!-- markdownlint-disable MD013 -->

```bash
curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $CELESTIA_NODE_AUTH_TOKEN" -d '{ "id": 1, "jsonrpc": "2.0", "method": "da.Get", "params": [["$ENCODED_INPUT"], "AAAAAAAAAAAAAAAAAAAAAAAAAAECAwQFBgcICRA="]}' http://127.0.0.1:26658
```

Your result will look similar to the below!

```console
{"jsonrpc":"2.0","result":["SGVsbG8gd28ybGQh"],"id":1}
```

## Ethereum fallback mechanism in OP Stack

The [Ethereum fallback mechanism](ethereum-fallback.md) allows rollups to
"fall back" to Ethereum or another EVM chain in the case of downtime or
errors submitting data to Celestia.

### Implementation of fallback

The Ethereum fallback mechanism is implemented in the
[celestiaorg/optimism](https://github.com/celestiaorg/optimism/tree/release-v1.1.0)
v1.1.0 release.

The `op-batcher/batcher/driver.go` and
`op-node/rollup/derive/calldata_source.go` files are part of the Ethereum
fallback mechanism in the `op-batcher` and `op-node` respectively.

In [`driver.go`, the `calldataTxCandidate` function is responsible for the write path](https://github.com/celestiaorg/optimism/blob/release-v1.1.0/op-batcher/batcher/driver.go#L405-L419)
of the Ethereum fallback. This function creates and submits a transaction to the
batch inbox address with the given data. It uses the underlying `txmgr` to
handle transaction sending and gas price management.

If the transaction data can be published as a blob to Celestia,
it replaces the calldata with a blob identifier and sends the
transaction with this data. If it cannot be published to Celestia,
it falls back to Ethereum without any change to the transaction.

The blob identifier starts with the special prefix `0xce`, which was chosen as a
mnemonic for Celestia, and indicates that the remaining data has to
interpreted as a little-endian encoded Block Height (8 bytes) and
Blob Commitment (32 bytes). The combination of these can later be used to
retrieve the original calldata from Celestia.

<!-- markdownlint-disable MD013 -->

| Prefix | 8 bytes      | 32 bytes        |
| ------ | ------------ | --------------- |
| 0xce   | Block Height | Blob Commitment |

<!-- markdownlint-enable MD013 -->

```go
func (l *BatchSubmitter) sendTransaction(
    txdata txData,
    queue *txmgr.Queue[txData],
    receiptsCh chan txmgr.TxReceipt[txData],
) {
    // ...
}
```

In `calldata_source.go`,
[the `DataFromEVMTransactions` function defines the read path](https://github.com/celestiaorg/optimism/blob/release-v1.1.0/op-node/rollup/derive/calldata_source.go#L102-L139)
of the Ethereum fallback. This function filters all of the transactions
and returns the calldata from transactions that are sent to the batch
inbox address from the batch sender address.

If the calldata matches the version prefix `0xce`, it is decoded as a
blob identifier, the original calldata is retrieved from Celestia
and returned for derivation. If the calldata does not match the prefix,
the entire calldata is returned for derivation.

```go
func DataFromEVMTransactions(
    config *rollup.Config,
    batcherAddr common.Address,
    txs types.Transactions,
    log log.Logger
) ([]eth.Data, error) {
    // ...
}
```

These two functions work together to ensure that the Ethereum
fallback mechanism operates correctly, allowing the rollup
to continue functioning even during periods of downtime on
Celestia.

### Testing the fallback

Testing out the Ethereum fallback mechanism can be done
with a curl command. Triggering a simultaneous blob transaction will
cause the `op-batcher` blob transaction to fail, with an `incorrect account
sequence` error, which triggers a fallback to Ethereum.

<!-- markdownlint-disable MD013 -->

```bash
curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $CELESTIA_NODE_AUTH_TOKEN" -d '{ "id": 1, "jsonrpc": "2.0", "method": "da.Submit", "params": [["SGVsbG8gd28ybGQh"], -1, "AAAAAAAAAAAAAAAAAAAAAAAAAAECAwQFBgcICRA="]}' http://127.0.0.1:26658
```

Which should return:

```bash
{"jsonrpc":"2.0","result":["9QEAAAAAAABmGvJUORYLqY8wVdjgp6/0oSh6brQqG3ZGr/cfUMuElg=="],"id":1}
```

<!-- markdownlint-enable MD013 -->

Alternatively, you can shut off the light node and see that
the OP Stack devnet logs show that the rollup has fallen back to the L1,
in this case Ethereum, for posting data.

## Span batches

Span batches can be enabled by setting `OP_BATCHER_BATCH_TYPE: 1`
in your `docker-compose.yml` file.

Note that this requires the Delta activation time to be configured.
For your devnet, you should set `"l2GenesisDeltaTimeOffset": "0x0",`
in `devnetL1-template.json`. This will enable span batches and can be tested
by grepping `docker compose logs -f | grep batch_type` which should include
`batch_type=SpanBatch` and `batch_type=1`.

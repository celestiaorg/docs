---
description: Start your own devnet with a modified version of optimism-bedrock.
---

# Deploy an OP Stack devnet

This guide will show you how to run your own OP Stack devnet.

## Dependency setup

### Environment setup and Golang installation

First, [install dependencies for Celestia software](../nodes/environment.md)
and for [OP Stack](https://community.optimism.io/docs/developers/build/dev-node/).

### Clone repository

Next, clone the repo:

```bash
cd $HOME
git clone https://github.com/celestiaorg/optimism
cd optimism
```

Check out to the version for either the stable version or upstream version:

::: code-group

```bash-vue [v1.2.0 stable]
git checkout tags/v0.2.0-OP_v1.2.0-CN_v0.12.0
git submodule update --init --recursive
```

```bash-vue [rebase upstream]
git checkout tux/rebase-upstream
git submodule update --init --recursive
```

:::

## Build devnet

Build TypeScript definitions for TS dependencies:

```bash
cd $HOME
cd optimism
make
```

Set environment variables to start network:

```bash
export SEQUENCER_BATCH_INBOX_ADDRESS=0xff00000000000000000000000000000000000000
export L2OO_ADDRESS=0x70997970C51812dc3A010C7d01b50e0d17dc79C8
```

### Start devnet

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

:::tip optional

### Stop devnet

If you'd like to start the network over, use the following command
to safely shut down all of the containers:

```bash
make devnet-down
```

Then clean out the old config:

```bash
make devnet-clean
```

### Viewing containers

To view the containers running, send:

```bash
docker ps
```

Find the container ID of the `ops-bedrock_op-batcher_1`
and run the following to follow the logs:

```bash
docker logs -f <container-id>
```

In a new terminal, find the container ID of the
`ghcr.io/celestiaorg/local-celestia-devnet:main`
and run the following to follow the logs:

```bash
docker logs -f <container-id>
```

You can do the same for other containers as you
explore the stack.

:::

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
blockHash            0x1cb54d2369752ef73511c202ff9cdfd0eadf3a77b7aef0092bea63f2b5d57659
blockNumber          1141
from                 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
gas                  33996
gasPrice             1000000007
hash                 0x79a0a7a1b4936aafe7a37dbfb07a6a9e55c145a4ed6fd54f962649b4b7db8de7
input                0x3501000000000000b67f8dcfdc9125b76d4184ca1686d971aafec1a5a87398a060f31c533502d5c7
nonce                153
r                    0x3561ffc7c87fb7ceabd0e4b670b4ebe0c3b352e3a1f439dd44352dde7cd4cf6e
s                    0x6630ff8044936856a459c3fab2bc5d509b5c2f8f75ce7b90e651ef5238608c8c
to                   0xFf00000000000000000000000000000000000901
transactionIndex     0
v                    0
value                0
yParity              0
```

Now set the `input` as the `INPUT` variable, removing the `0x` from the beginning:

```bash
export INPUT=3501000000000000b67f8dcfdc9125b76d4184ca1686d971aafec1a5a87398a060f31c533502d5c7
```

:::tip
Remember to remove the `0x`!
:::

## Find the data on Celestia

Now, from `optimism` run:

<!-- markdownlint-disable MD013 -->

```bash
# set your auth token
export CELESTIA_NODE_AUTH_TOKEN=$(docker exec $(docker ps -q --filter name=da) celestia bridge --node.store /home/celestia/bridge/ auth admin)

# set namespace
export NAMESPACE=000008e5f679bf7116cb

go run ./op-celestia/main.go $NAMESPACE $INPUT $CELESTIA_NODE_AUTH_TOKEN
```

Your result will look similar to the below!

```console
celestia block height: 309; tx index: [182 127 141 207 220 145 37 183 109 65 132 202 22 134 217 113 170 254 193 165 168 115 152 160 96 243 28 83 53 2 213 199]
-----------------------------------------
optimism block data on celestia: 00947558eacae3195fd579e20c359929a700000000031b78dadae1c7f0c37b81ecf47299820f3f1619d717af10afef9c5cf3e7de678f03b60573d55cd97deb3b5f34b1242dd0dae4bf76e3490b76c769a756583027357f7bb723f69af2b5cf9f37475eaa29fe35bd25d52f47e200c4bc2be5254565b3c58b7fb9879d59a2f0e147f0bb6bd3ab3257cf955be391fff8f0f1bfc49a270535af8e7dd1cda66b6f1e7de397ec7bfb7042f4118609cf2e3f2f750daf37fb7ee2fec7a62696e4055c323befca9dca66d3fba42e5dde70ff7fdedd8ca7878cd6f2a686fcea5eebf9e616c83c19a879c2af5d6608b6ffd05fec9899bee797e3442d8bbda7cd1dcf78336cfa303d8f8be34a134bca82b7a7d8fd447df71dbd1e1fc911275a98e6f5e091c15293651baf7835e8063efe6408324f0e6ade3d81f7ab7725ed4ea95ec7bdfcd40fffcd0f6a13f35334e4cd0c65529b9f7fb8e644ac790a50f3d20e944f71babcb7f4d3d2ec8366aa773f7aefb5f5b8f45cd4f2e0724fbfbcc5caf24d2ca90b8a351e2e4990383d75a9adb3f48a72e5d78a13263e5defd39b63b05d9dc768be9b20c83c25a879965cf3e7d724f7572d59aa14dea85a73a8bde4920ebffb9b600e0da9b78c66ea364d2c690b7cfcd3eca6cf3f185d7ec762cb49ae9e9f4571d1c92eba13f6dc9d7ee59c9d77520ac83c15a879bebdeb77ccfaffe6bcd6899f06d74e046a7d12bddca4775df1885bfbf9c317d5ce3c20d63c35a8798f9f6a054fd9ddebb7dcbd256e430fc31dd345ebffaa2e14fecdb963755a6cb1e1e12696f40597747fbf5abfeac09e4d998c423fb4351fae350b2dbd32ed7ce0c64f8cfe8f56f2d980ccd3809ab7c8f648b872e4eb3e55ee17518e2eced73e4af92d6fd6f4bcb435f763bb5e9a4842134bc682e5fee73ccbbede55d9ad7dc97891f64cad3b2c57f4a333e65c940cfb5d66f4eea231c83c2da879c7cba664bf58fecdd3e0d5751671e7d77b1833b695a91598ec989aa73e75d15ea1adc49aa70335efedf7dc27737758e568f7db4ffaa777f142f32f0f91fd5bcf9b9f4938f7c55bfdaa72134be682459de247558fa5945b3a72f75c5cf4e0cf26e3c5b3eb52fb2bebe51eec5875faef3a90797a0700010000ffff6518dd6101
```

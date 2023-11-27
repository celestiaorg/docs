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

```bash-vue [TODO: NEW stable]
git checkout tags/v TODO: NEW STABLE
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

::: details Optional: Docker tips

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

::: tip
You are looking for a batcher transaction to the address
`0xFf00000000000000000000000000000000000901`.
:::

Now set the `input` as the `INPUT` variable and encode it as
base64:

```bash
export INPUT=0x3501000000000000b67f8dcfdc9125b76d4184ca1686d971aafec1a5a87398a060f31c533502d5c7
export ENCODED_INPUT=$(echo "$INPUT" | xxd -r -p | base64)
```

## Find the data on Celestia

Clone the `go-da` repository:

```bash
cd $HOME
git clone https://github.com/rollkit/go-da.git
cd go-da/proto/da
```

Now, from `go-da/proto/da` run:

<!-- markdownlint-disable MD013 -->

```bash
grpcurl -proto da.proto -plaintext -d "{\"ids\": [{\"value\": \"$ENCODED_INPUT\"}]}" 127.0.0.1:26650 da.DAService.Get
```

Your result will look similar to the below!

```console
{
  "blobs": [
    {
      "value": "AOZF2LtNNZAdOq0WdCoxGbcAAAAAAZh42trhx/DDe0FOTQH/XesNVpoyhXev7F5ndCYwwlzddZmJ5aS7sxhP6G5sYhJZ0Dvt3oeXi0ruufLM+LXUwP7i6zlBugnVLo25DVcYTdR+P2xJTfm85gDEPMUtfQESiSs9Nr18t+Rii6/Fr5DVK+78PN3F+D/v5KXk6NvEmrcOap7xNksFJ65jIc+SJzu/vnmlce7K+QxMvHYJj5Qb77yZdl6liUl0wauPBtL9DXPCmyeWfbwTb9el0fF+If8pn7clpQrCbtXs4SDzNkDNe6NXpcDFkPg97gKru4Js2/33P9IYP5Rk2WwXWL7CTGy5eROT2IIvGZc2GfMd+j6ZVzd5ovpDw8ZNa1+wPA5/6D6nhk2S60cCyLxNUPNOu6rtXhO/VNwj1OLDlAmiSS/Np0xKsM9+9Iq9MZv9+GcbYs3bAjVPVuO6zOO/Waf2lHFcb9ryb+vn3He/z65PqD6+52BKeVZkVxOT+AK7q9euTnsVX7N7qRTX5mcbpyQxTNH1fnw9xtHjnF74B2YzkHnbDgACAAD//60o8CoB"
    }
  ]
}
```

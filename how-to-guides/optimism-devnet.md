# Optimism devnet deep dive

This page is for those interested in doing a deep dive
on their pre-`op-plasma-celestia` `@celestiaorg/optimism`
rollups.

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

The params are `[]blobs, namespace`, base64-encoded.

Your result will look similar to the below!

```console
{"jsonrpc":"2.0","result":["SGVsbG8gd28ybGQh"],"id":1}
```

## Span batches

Span batches can be enabled by setting `OP_BATCHER_BATCH_TYPE: 1`
in your `docker-compose.yml` file.

Note that this requires the Delta activation time to be configured.
For your devnet, you should set `"l2GenesisDeltaTimeOffset": "0x0",`
in `devnetL1-template.json`. This will enable span batches and can be tested
by grepping `docker compose logs -f | grep batch_type` which should include
`batch_type=SpanBatch` and `batch_type=1`.
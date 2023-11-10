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
git checkout tux/rebase-v.1.2.0
```

```bash-vue [rebase upstream]
git checkout tux/rebase-upstream
cd packages/contracts-bedrock/lib/forge-std/
git submodule init && git submodule update
cd ../../../../
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


baseFeePerGas        40625627
difficulty           2
extraData            0xd883010d04846765746888676f312e32312e33856c696e7578000000000000007d898fcc82b7d08f3d887f78733b405b5858673651ad7998c35adb2ddd8bc79926f73d3fad68c221a575c9c30db0f668d64165d15f3a3b1a3512559cc7455d2a01
gasLimit             30000000
gasUsed              88935
hash                 0xeac4a2bf8416e2d92119d46fa6994cf47d78e09e2bd55c478800df2401140f33
logsBloom            0x00000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000041000000000000000000000000000000000200000000000040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000400000000000004000000000800000000000020400200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000020000000000000000000000000000000000000000000000000000000
miner                0x0000000000000000000000000000000000000000
mixHash              0x0000000000000000000000000000000000000000000000000000000000000000
nonce                0x0000000000000000
number               24
parentHash           0x786fa3c21f4656d649b3e6ebbd7e3b05d5416c278f830e6a5614f29d57e7910a
receiptsRoot         0x6bd378c672b14f976707253f44ff1bbeeef8595a60e40a4c9f987a4450779e04
sealFields           []
sha3Uncles           0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347
size                 863
stateRoot            0xec2528a95cbff5e88ceb5c4afa2ae64cb844b74be730dbf084cc53c0fe1795eb
timestamp            1699634999
withdrawalsRoot
totalDifficulty      49
transactions:        [
  0xb0afa070d660458bde0baebcfe4ac9974e919898027715ae4301fc087a5c7ec8
]
```

And copy the transaction hash from `transactions: <transaction-hash>` and
set it as a variable:

```bash
export TX_HASH=0xb0afa070d660458bde0baebcfe4ac9974e919898027715ae4301fc087a5c7ec8
```

## Read the transaction call data

Now read the transaction call data on the L1:

```bash
cast tx $TX_HASH --rpc-url localhost:8545
```

The output will look similar to below:

```console
blockHash            0xeac4a2bf8416e2d92119d46fa6994cf47d78e09e2bd55c478800df2401140f33
blockNumber          24
from                 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
gas                  89877
gasPrice             1040625627
hash                 0xb0afa070d660458bde0baebcfe4ac9974e919898027715ae4301fc087a5c7ec8
input                0x9aaab6489022631e8a3a34c3a47fc3b793a1705c6c94bca329a4897284e5fadc393bcbf60000000000000000000000000000000000000000000000000000000000000014ccee9445a193e93747916cca8678ab75527c6bd63e028e8a31978cc040b005c80000000000000000000000000000000000000000000000000000000000000015
nonce                1
r                    0x87c8d52153d5d905cf9e4ca903825898dcbda5c6926f84d1e817aba182fe2a82
s                    0x3e761aa91fe1f46c822be7eb5b7743014c271d0d7f41e39df638ef826bc14962
to                   0xBf5FA562ed49AbdC496eFd501C93d3b7E7F14b41
transactionIndex     0
v                    1
value                0
yParity              1
```

Now set the `input` as the `INPUT` variable, removing the `0x` from the beginning:

```bash
export INPUT=0000000000000c2a00000000
```

:::tip
Remember to remove the `0x`!
:::

## Find the data on Celestia

Now navigate to `optimism/op-celestia` and run:

<!-- markdownlint-disable MD013 -->

```bash
# set your auth token
export CELESTIA_NODE_AUTH_TOKEN=$(docker exec $(docker ps -q) celestia bridge --node.store /home/celestia/bridge/ auth admin)

# set namespace
export NAMESPACE=000008e5f679bf7116cb

go run main.go $NAMESPACE $INPUT $CELESTIA_NODE_AUTH_TOKEN
```

Your result will look similar to the below!

```console
celestia block height: 3114; tx index: 0
-----------------------------------------
optimism block data on celestia: [00191cef8fb52cf322b77694ff5a92149800000000020b78dadae1c7f0c37b015fdd84970dfbe3ff4ab7abe8b9083c94aebe7df77e705bba47f8e72b762fadcecd6b62695920e9eee3e5369b3fd265726ebcfbfcbf3f5fcde3bd6960f53b7da1c147ae4fefe689b724ff54c83a0031ef93479f5a75f08e6a9bbd0b755c220e4ed8b3fd5c9cfc1b9ed0ca69dcabbf5cbd274aac793950f38ef6bd59e551e56d77fcf7aabd9287abd8af7b9de39cb3235732c58be7034774bf54134beb828c19b15f3553a74b64ffbd3a2fe0e8cbb77b0217dccb4f68de9774fbac5efaed040190797950f3e22bafc9d7884cf616d87db6a46ace99b277252dd36f9c7d5ebabfd46d5a71bec9872696b605173ccc153d4a7befbd69f64f6db25cc7dd59f86d5de586b457f7d759f73fe57fde0c32af006a5eebdcfb85d385b3ef3d158fbccaf263cb8b35cb2a58cc0f083f5cf3b742d555f3fe2362cd2b829a37c9c9446fedbf8d911f3f86cc79c335e960f26d5eef25e735f7dd9b926019dcf1ed5b134bfb02416e36be3b277635b757f36f2bff9260ddcf1f20132e5071afe8bcdd9ccdcffda440e69540cddbb548ecdd73863673ab122e2d36d69dfc8bd71be61dbae235cf63e3a9a0121141b726968e051d2b7ef076b11f3c9964b4fee0acfb93777fbd37d94dfdecfdd6836af39ebaaff58c07995706352fdf9259b773cfd42e0ed168914542c54ca28147969b18b7987ef233fcd41c1cde44ac79150700010000fffff649400701]
```

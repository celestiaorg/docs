---
sidebar_label: Optimism & Celestia tutorial
---

# Optimism & Celestia tutorial

*This tutorial will show how existing blockchain frameworks,
such as [the OP Stack](https://stack.optimism.io/)
can integrate with Celestia.*

:::caution
This tutorial was tested on a machine with 8GB RAM, 160 GB SSD,
Ubuntu 22.10, and a 4 core AMD CPU.
:::

## Optimism

[Optimism](https://www.optimism.io/) currently uses Ethereum as
a data availability (DA) layer. Currently, settlement and DA for
Optimism are on Ethereum, both on-chain. `op-batcher` batches up
rollup blocks and posts to Ethereum.

Learn more about Optimism [here](https://www.optimism.io/).

## Celestia

Celestia is a shared security (DA and consensus) layer 1 blockchain.

## Optimism bedrock + Celestia

This tutorial will guide you through how start your own devnet with a
modified version of `optimism-bedrock` that uses Celestia as a DA layer.

The handling of data is accomplished in two ways. First, data is written
to the data availability (DA) layer i.e. in this case Celestia, then the
data commitment is written to the `op-batcher`. When reading `op-node`
simply reads the data back from the DA layer by reading the
data commitment from the `op-batcher` first, then reading the
data from the DA layer using the data commitment. Hence, while
previously `op-node` was reading from calldata on Ethereum,
but now it reads data from Celestia.

There are a few tools involved in the data handling process. `op-batcher`
batches up rollup blocks and posts them to Ethereum. `op-geth` handles
execution, while `op-proposer` is responsible for state commitment
submission.

By using Celestia as a DA layer, existing L2s can switch from posting
their data as `calldata` on Ethereum, to posting to Celestia.
The commitment to the block is posted on Celestia, which is
purpose-built for data availability. This is a more scalable than
the traditional method of posting this data as `calldata` on monolithic chains.

If you'd like to go modular, bedrock has
made it easy to swap this out!

## Dependency setup

<!-- ### Pick your node type

Using Celestia and OP stack, you have the option to either
run a light node of your own on your `$HOME` directory or a
`local-celestia-devnet`, which will give you a local devnet
to test things out with.

#### Using a light node

If you choose to use your own node store, the light node
must be **fully synced** and **funded** for you to be able to submit
and retreive `PayForBlobs`.

If it is not synced, you will run into [errors](https://github.com/celestiaorg/celestia-node/issues/2151).

Visit the [Blockspace Race page](../../nodes/blockspace-race/)
to visit the faucet.

When using your own node store, the `$HOME` directory is just the
default, and can be changed in
`optimism/ops-bedrock/docker-compose.yml` if you'd like.

By default, the node will run with the account named
`my_celes_key`.

#### Using a local devnet

If you'd like to use the `local-celestia-devnet`, open up the
`optimism/ops-bedrock/docker-compose.yml` file in your text editior
and uncomment lines 18-30 and 159-161. -->

### Environment setup and Golang installation

Install dependencies [here](../nodes/environment.mdx).

### Clone repository

Next, clone the repo:

```bash
cd $HOME
git clone https://github.com/celestiaorg/optimism
cd optimism
git checkout celestia-develop
```

### asdf

Install `asdf` to allow us to intall a specific version of node easily:

```bash
cd $HOME
git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.11.2
echo '. "$HOME/.asdf/asdf.sh"' >> ~/.bashrc
echo '. "$HOME/.asdf/completions/asdf.bash"' >> ~/.bashrc
```

Set the path:

```bash
export PATH=$PATH:~/.asdf/bin/
```

Check that it was installed:

```bash
asdf
```

### Node.js

Install `nodejs 16.16.0`:

```bash
asdf plugin add nodejs
asdf install nodejs 16.16.0
asdf local nodejs 16.16.0
source ~/.bashrc
```

Install [NPM](https://www.npmjs.com/):

```bash
apt install npm
```

Update NPM to v9.6.5:

```bash
npm install -g npm@9.6.5
```

### Foundry

Download the Foundry script execute it to set up environment:

```bash
curl -L https://foundry.paradigm.xyz/ | bash
```

Set path:

```bash
source /root/.bashrc
```

Run foundryup to install Foundry (`forge`, `cast`, `anvil`, `chisel`):

```bash
source /root/.bashrc
```

### Yarn

Install yarn:

```bash
npm install -g yarn
```

Depending on the version installed,
you may need to update your version of NPM.

### Docker compose

<!-- Install [Docker](https://docs.docker.com/engine/install/ubuntu/) -->

Install docker-compose:

```bash
apt install docker-compose
```

### gcc & libusb

```bash
apt install gcc libusb-1.0-0-dev 
```

## Build devnet

Build TypeScript definitions for TS dependencies:

```bash
cd $HOME
cd optimism
make build-ts
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

:::tip optional

#### lazydocker

You can install [lazydocker](https://github.com/jesseduffield/lazydocker)
to view all of the components of your stack in one GUI by running:

```bash
asdf plugin add lazydocker https://github.com/comdotlinux/asdf-lazydocker.git
asdf list all lazydocker
asdf install lazydocker 0.12
asdf global lazydocker 0.12
```

And run the command:

```bash
lazydocker
```

If you do this, you can skip the [viewing containers](#viewing-containers)
section and [find a transaction](#find-a-transaction).

:::

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

## Find a transaction

Now, we'll check for a recent transaction with:

```bash
cast block latest --rpc-url localhost:8545
```

Output of a block that contains a transaction will look like this:

```console
baseFeePerGas        7
difficulty           2
extraData            0xd883010a16846765746888676f312e31382e35856c696e75780000000000000001749030eb8e51903cf49e2c8c21e7ff98aaa7d45e3ecd51b8594440c5c66e9931b70b18d1a629212074f3ef9188bd0a9079e094e414d287f73d40ea8392349600
gasLimit             30000000
gasUsed              21072
hash                 0x9d764f5e3e2ccf5a334ae4fbe3827e7b80750f39aa671c958b5c09a9b67d9dfc
logsBloom            0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
miner                0x0000000000000000000000000000000000000000
mixHash              0x0000000000000000000000000000000000000000000000000000000000000000
nonce                0x0000000000000000
number               1569
parentHash           0x1a5100654617b565bf2a117c7487a57c54d0c61b99d94592518fbc07b3fec45d
receiptsRoot         0xa981da57b00630bb01a6eb02629212ea8b0c89281a07295ace6bb78c81193e68
sealFields           []
sha3Uncles           0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347
size                 740
stateRoot            0x9d1e02cbf556997123676f47749a043b5bd9bebe629f5dbd3f256a7d5e37b665
timestamp            1677272382
totalDifficulty      3139
transactions:        [
    0x40b79afe3dc05ff398c2142ab47eb94ac3759a03dd1322b2d97bcdc2d1c34934
]
```

And copy the transaction hash from `transactions: [<transaction-hash]` and
set it as a variable:

```bash
export TX_HASH=0xb8869dfecf9a5a0e26df6b13e64071b859f2cc0587b97cb4387abf9ddb2ff9a0
```

## Read the transaction call data

Now read the transaction call data:

```bash
cast tx $TX_HASH --rpc-url localhost:8545
```

The output will look similar to below:

```console
blockHash            0xce5691878b61e3b5bbae66317512365ef6bb1f597b4dfc11e585abf470cdf4dd
blockNumber          1164
from                 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
gas                  21072
gasPrice             1000000007
hash                 0xb8869dfecf9a5a0e26df6b13e64071b859f2cc0587b97cb4387abf9ddb2ff9a0
input                0x0000000000000c2a00000000
nonce                318
r                    0x9a32da65f4dabf0e1c6d2a86d52c7d6f868997cfc1183fc28c5f0a0615a5e678
s                    0x4ce385cc70a178b86d95de05428763805183276a6fd418c44e346a3838a70144
to                   0xfF00000000000000000000000000000000000000
transactionIndex     0
v                    0
value                0
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

```bash
go run main.go $INPUT
```

Your result will look similar to the below!

```console
celestia block height: 3114; tx index: 0
-----------------------------------------
optimism block data on celestia: [00191cef8fb52cf322b77694ff5a92149800000000020b78dadae1c7f0c37b015fdd84970dfbe3ff4ab7abe8b9083c94aebe7df77e705bba47f8e72b762fadcecd6b62695920e9eee3e5369b3fd265726ebcfbfcbf3f5fcde3bd6960f53b7da1c147ae4fefe689b724ff54c83a0031ef93479f5a75f08e6a9bbd0b755c220e4ed8b3fd5c9cfc1b9ed0ca69dcabbf5cbd274aac793950f38ef6bd59e551e56d77fcf7aabd9287abd8af7b9de39cb3235732c58be7034774bf54134beb828c19b15f3553a74b64ffbd3a2fe0e8cbb77b0217dccb4f68de9774fbac5efaed040190797950f3e22bafc9d7884cf616d87db6a46ace99b277252dd36f9c7d5ebabfd46d5a71bec9872696b605173ccc153d4a7befbd69f64f6db25cc7dd59f86d5de586b457f7d759f73fe57fde0c32af006a5eebdcfb85d385b3ef3d158fbccaf263cb8b35cb2a58cc0f083f5cf3b742d555f3fe2362cd2b829a37c9c9446fedbf8d911f3f86cc79c335e960f26d5eef25e735f7dd9b926019dcf1ed5b134bfb02416e36be3b277635b757f36f2bff9260ddcf1f20132e5071afe8bcdd9ccdcffda440e69540cddbb548ecdd73863673ab122e2d36d69dfc8bd71be61dbae235cf63e3a9a0121141b726968e051d2b7ef076b11f3c9964b4fee0acfb93777fbd37d94dfdecfdd6836af39ebaaff58c07995706352fdf9259b773cfd42e0ed168914542c54ca28147969b18b7987ef233fcd41c1cde44ac79150700010000fffff649400701]
```

## Deploying a smart contract

First, review the [devnet page](https://github.com/celestiaorg/optimism/blob/celestia/specs/meta/devnet.md)
with information about the faucet accounts. You will need a funded
account to deploy your smart contract.

Next, clone the `gm-portal` from Github and start the frontend:

```bash
cd $HOME
git clone https://github.com/jcstein/gm-portal.git
cd gm-portal/frontend
yarn && yarn dev
```

In a new terminal instance, set the private key for the faucet as a variable:

```bash
export PRIVATE_KEY=ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

Now, change into the `gm-portal/contracts` directory in the same terminal and deploy
the contract using Foundry:

<!-- markdownlint-disable MD013 -->
```bash
cd $HOME/gm-portal/contracts
forge script script/WavePortal.s.sol:WavePortalScript --rpc-url http://localhost:9545 --private-key $PRIVATE_KEY --broadcast
```
<!-- markdownlint-enable MD013 -->

In the output of the deployment, find the contract address and set it as a variable:

```bash
export CONTRACT_ADDRESS=<your contract address from the output above>
```

Next, you're ready to interact with the contract from your terminal!

First, send a "gm" to the contract:

```bash
cast send $CONTRACT_ADDRESS \
"wave(string)" "gm" \
--private-key $PRIVATE_KEY \
--rpc-url http://localhost:9545
```

Now that you've posted to the contract, you can read all "waves" (GMs) from the
contract with
this command:

```bash
cast call $CONTRACT_ADDRESS "getAllWaves()" --rpc-url http://localhost:9545
```

Next, query the total number of waves, which will be returned as a hex value:

```bash
cast call $CONTRACT_ADDRESS "getTotalWaves()" --rpc-url http://localhost:9545
```

In order to interact with the contract on the frontend, you'll need to fund an
account thatyou have in your Ethereum wallet. Transfer to an external account
with this command:

```bash
export RECEIVER=<receiver ETH address>
cast send --private-key $PRIVATE_KEY $RECEIVER --value 1ether --rpc-url http://localhost:9545
```

If you are in a different terminal than the one you set the private key in, you
may need to set it again.

### Update the frontend

Next, you will need to update a few things before you can interact with the
contract on the frontend:

1. Change the contract address on `gm-portal/frontend/src/App.tsx` to your
contract address
2. Match the chain info on `gm-portal/frontend/src/main.tsx` with the chain
config of your L2
3. If you changed the contract, update the ABI in
`gm-portal/frontend/WavePortal.json` from
`gm-portal/contracts/out/WavePortal.sol/WavePortal.json`. This can be done with:

```bash
cd $HOME
cp gm-portal/contracts/out/WavePortal.sol/WavePortal.json gm-portal/frontend`
```

### Interact with the frontend

Now, login with your wallet that you funded, and post a GM on your GM portal!

## Next steps

There are many possibilities of what could be built with this stack.
These projects would be good to build on this stack:

- on-chain gaming
- decentralized social media
- an NFT ticketing rollup
- Optimism on CelOPstia
- OP Craft on Celestia

---
sidebar_label: Mamaki Testnet
---

# Mamaki Testnet

![mamaki-testnet](/img/mamaki.png)

This guide contains the relevant sections for how to connect to Mamaki,
depending on the type of node you are running. Mamaki Testnet is designed
to help validators test out their infrastructure and node software
with the test network. Developers are encouraged to deploy their
sovereign rollups on Mamaki, but we also recommend [Arabica Devnet](./arabica-devnet.md)
for that as it is designed for development purposes.

Mamaki is a milestone in Celestia, allowing everyone to test out
core functionalities on the network. Read the anouncement [here](https://blog.celestia.org/celestia-testnet-introduces-alpha-data-availability-api/).

Your best approach to participating is to first determine which node
you would like to run. Each node guides will link to the relevant network
in order to show you how to connect to them.

You have a list of options on the type of nodes you can run in order to
participate in Mamaki:

Consensus:

* [Validator Node](./validator-node.md)
* [Consensus Full Node](./consensus-full-node.md)

Data Availability:

* [Bridge Node](./bridge-node.mdx)
* [Full Storage Node](./full-storage-node.mdx)
* [Light Node](./light-node.mdx)

Select the type of node you would like to run and follow the instructions
on each respective page. Whenever you are asked to select the type of network
you want to connect to in those guides, select `Mamaki` in order to refer
to the correct instructions on this page on how to connect to Mamaki.

## RPC endpoints

There is a list of RPC endpoints you can use to connect to Mamaki Testnet:

* [https://rpc-mamaki.pops.one](https://rpc-mamaki.pops.one)
* [https://rpc-1.celestia.nodes.guru](https://rpc-1.celestia.nodes.guru)
* [https://grpc-1.celestia.nodes.guru:10790](https://grpc-1.celestia.nodes.guru:10790)
* [https://celestia-testnet-rpc.polkachu.com/](https://celestia-testnet-rpc.polkachu.com/)
* [https://rpc.celestia.testnet.run](https://rpc.celestia.testnet.run/)
* [https://rpc.mamaki.celestia.counterpoint.software](https://rpc.mamaki.celestia.counterpoint.software)

## Mamaki Testnet faucet

> USING THIS FAUCET DOES NOT ENTITLE YOU TO ANY AIRDROP OR OTHER
  DISTRIBUTION OF MAINNET CELESTIA TOKENS. MAINNET CELESTIA TOKENS
  DO NOT CURRENTLY EXIST AND THERE ARE NO PUBLIC SALES OR OTHER PUBLIC
  DISTRIBUTIONS OF ANY MAINNET CELESTIA TOKENS.

You can request from Mamaki Testnet Faucet on the #mamaki-faucet channel on
Celestia's Discord server with the following command:

```text
$request <CELESTIA-ADDRESS>
```

Where `<CELESTIA-ADDRESS>` is a `celestia1******` generated address.

> Note: Faucet has a limit of 10 tokens per week per address/Discord ID

## Explorers

There are several explorers you can use for Mamaki:

* [https://testnet.mintscan.io/celestia-testnet](https://testnet.mintscan.io/celestia-testnet)
* [https://celestia.explorers.guru/](https://celestia.explorers.guru/)
* [https://celestiascan.vercel.app/](https://celestiascan.vercel.app/)

## Setup P2P network

Now we will setup the P2P Networks by cloning the networks repository:

```sh
cd $HOME
rm -rf networks
git clone https://github.com/celestiaorg/networks.git
```

To initialize the network pick a "node-name" that describes your
node. The --chain-id parameter we are using here is `mamaki`. Keep in
mind that this might change if a new testnet is deployed.

```sh
celestia-appd init "node-name" --chain-id mamaki
```

Copy the `genesis.json` file. For mamaki we are using:

```sh
cp $HOME/networks/mamaki/genesis.json $HOME/.celestia-app/config
```

Set seeds and peers:

<!-- markdownlint-disable MD013 -->
```sh
BOOTSTRAP_PEERS=$(curl -sL https://raw.githubusercontent.com/celestiaorg/networks/master/mamaki/bootstrap-peers.txt | tr -d '\n')
echo $BOOTSTRAP_PEERS
sed -i.bak -e "s/^bootstrap-peers *=.*/bootstrap-peers = \"$BOOTSTRAP_PEERS\"/" $HOME/.celestia-app/config/config.toml
```
<!-- markdownlint-enable MD013 -->

Note: You can find more peers [here](https://github.com/celestiaorg/networks/blob/master/mamaki/peers.txt).

## Quick-sync with snapshot

Run the following command to quick-sync from a snapshot for `mamaki`:

```sh
cd $HOME
rm -rf ~/.celestia-app/data
mkdir -p ~/.celestia-app/data
SNAP_NAME=$(curl -s https://snaps.qubelabs.io/celestia/ | \
    egrep -o ">mamaki.*tar" | tr -d ">")
wget -O - https://snaps.qubelabs.io/celestia/${SNAP_NAME} | tar xf - \
    -C ~/.celestia-app/data/
```

## Delegate to a validator

To delegate tokens to the `celestiavaloper` validator, as an
example you can run:

```sh
celestia-appd tx staking delegate \
    celestiavaloper1q3v5cugc8cdpud87u4zwy0a74uxkk6u4q4gx4p 1000000utia \
    --from=$VALIDATOR_WALLET --chain-id=mamaki
```

If successful, you should see a similar output as:

```console
code: 0
codespace: ""
data: ""
gas_used: "0"
gas_wanted: "0"
height: "0"
info: ""
logs: []
raw_log: '[]'
timestamp: ""
tx: null
txhash: <tx-hash>
```

You can check if the TX hash went through using the block explorer by
inputting the `txhash` ID that was returned.

## Connect validator

Continuing the Validator tutorial, here are the steps to connect your
validator to Mamaki:

```sh
MONIKER="your_moniker"
VALIDATOR_WALLET="validator"

celestia-appd tx staking create-validator \
    --amount=1000000utia \
    --pubkey=$(celestia-appd tendermint show-validator) \
    --moniker=$MONIKER \
    --chain-id=mamaki \
    --commission-rate=0.1 \
    --commission-max-rate=0.2 \
    --commission-max-change-rate=0.01 \
    --min-self-delegation=1000000 \
    --from=$VALIDATOR_WALLET \
    --keyring-backend=test
```

You will be prompted to confirm the transaction:

```console
confirm transaction before signing and broadcasting [y/N]: y
```

Inputting `y` should provide an output similar to:

```console
code: 0
codespace: ""
data: ""
gas_used: "0"
gas_wanted: "0"
height: "0"
info: ""
logs: []
raw_log: '[]'
timestamp: ""
tx: null
txhash: <tx-hash>
```

You should now be able to see your validator from a block explorer like [here](https://celestia.explorers.guru/)

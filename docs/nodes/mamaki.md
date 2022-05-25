# Mamaki

This guide contains the relevant sections for how to connect to Mamaki,
depending on the type of node you are running. Mamaki is a milestone
in Celestia, allowing everyone to test out core functionalities on the
network.

Your best approach to participating is to first determine which node
you would like to run. Each node guides will link to the relevant network
in order to show you how to connect to them.

You have a list of options on the type of nodes you can run in order to
participate in Mamaki:

* [Bridge Node](../nodes/bridge-node.md)
* [Validator Node](../nodes/validator-node.md)
* [Light Node](../nodes/light-node.md)

Select the type of node you would like to run and follow the instructions
on each respective page. Whenever you are asked to select the type of network
you want to connect to in those guides, select `Mamaki` in order to refer
to the correct instructions on this page on how to connect to Mamaki.

## RPC Endpoints

There is a list of RPC endpoints you can use to connect to Mamaki Testnet:

* [https://api-mamaki.pops.one/](https://api-mamaki.pops.one/)
* [https://rpc-1.celestia.nodes.guru/](https://rpc-1.celestia.nodes.guru/)

## Mamaki Testnet Faucet

> USING THIS FAUCET DOES NOT ENTITLE YOU TO ANY AIRDROP OR OTHER
  DISTRIBUTION OF MAINNET CELESTIA TOKENS. MAINNET CELESTIA TOKENS
  DO NOT CURRENTLY EXIST AND THERE ARE NO PUBLIC SALES OR OTHER PUBLIC
  DISTRIBUTIONS OF ANY MAINNET CELESTIA TOKENS.

You can request from Mamaki Testnet Faucet on the #faucet channel on
Celestia's Discord server with the following command:

```text
$request <CELESTIA-ADDRESS> 
```

Where `<CELESTIA-ADDRESS>` is a `celestia1******` generated address.

> Note: Faucet has a limit of 10 tokens per week per address/Discord ID

## Setup P2P Network

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

```sh
SEEDS="f0c58d904dec824605ac36114db28f1bf84f6ea3@144.76.112.238:26656"
PEERS="e4429e99609c8c009969b0eb73c973bff33712f9@141.94.73.39:43656\
  09263a4168de6a2aaf7fef86669ddfe4e2d004f6@142.132.209.229:26656,\
  13d8abce0ff9565ed223c5e4b9906160816ee8fa@94.62.146.145:36656,\
  72b34325513863152269e781d9866d1ec4d6a93a@65.108.194.40:26676,\
  322542cec82814d8903de2259b1d4d97026bcb75@51.178.133.224:26666,\
  5273f0deefa5f9c2d0a3bbf70840bb44c65d835c@80.190.129.50:49656,\
  7145da826bbf64f06aa4ad296b850fd697a211cc@176.57.189.212:26656,\
  5a4c337189eed845f3ece17f88da0d94c7eb2f9c@209.126.84.147:26656,\
  ec072065bd4c6126a5833c97c8eb2d4382db85be@88.99.249.251:26656,\
  cd1524191300d6354d6a322ab0bca1d7c8ddfd01@95.216.223.149:26656,\
  2fd76fae32f587eceb266dce19053b20fce4e846@207.154.220.138:26656,\
  1d6a3c3d9ffc828b926f95592e15b1b59b5d8175@135.181.56.56:26656,\
  fe2025284ad9517ee6e8b027024cf4ae17e320c9@198.244.164.11:26656,\
  fcff172744c51684aaefc6fd3433eae275a2f31b@159.203.18.242:26656"
sed -i.bak -e "s/^seeds *=.*/seeds = \"$SEEDS\"/; s/^persistent_peers \
    *=.*/persistent_peers = \"$PEERS\"/" $HOME/.celestia-app/config/config.toml
```

Note: You can find more peers [here](https://github.com/celestiaorg/networks/blob/master/mamaki/peers.txt).

You can return back to where you left off in the Bridge Node guide [here](../nodes/validator-node.md#configure-pruning)

## Quick-Sync With Snapshot

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

You can return back to where you left off in the Bridge Node guide [here](../nodes/validator-node.md#start-the-celestia-app-with-systemd)

## Delegate to a Validator

To delegate tokens to the the `celesvaloper` validator, as an example you can run:

```sh
celestia-appd tx staking delegate \
    celesvaloper1q3v5cugc8cdpud87u4zwy0a74uxkk6u43cv6hd 1000000celes \
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

You can return back to where you left off in the Bridge Node guide [here](../nodes/validator-node.md#deploy-the-celestia-node)

## Configure The Bridge Node

In order for your Celestia Bridge Node to communicate with other Bridge Nodes,
then you need to add them as `mutual peers` in the `config.toml` file and allow
the peer exchange. Please navigate to
`networks/mamaki/celestia-node/mutual_peers.txt` to find the list of
mutual peers

For more information on `config.toml`, please navigate to [this link](../nodes/config-toml.md)

```sh
nano ~/.celestia-bridge/config.toml
```

```toml
...
[P2P]
  ...
  #add multiaddresses of other celestia bridge nodes
  
  MutualPeers = [
    "/ip4/46.101.22.123/tcp/2121/p2p/12D3KooWD5wCBJXKQuDjhXFjTFMrZoysGVLtVht5hMoVbSLCbV22",
    "/ip4/x.x.x.x/tcp/yyy/p2p/abc"] 
    # the /ip4/x.x.x.x is only for example.
    # Don't add it! 
  PeerExchange = true #change this line to true. By default it's false
  ...
...
```

You can return back to where you left off in the Bridge Node guide [here](../nodes/validator-node.md#start-the-bridge-node-with-systemd)

## Connect Validator

Continuing the Validator tutorial, here are the steps to connect your
validator to Mamaki:

```sh
MONIKER="your_moniker"
VALIDATOR_WALLET="validator"

celestia-appd tx staking create-validator \
    --amount=1000000celes \
    --pubkey=$(celestia-appd tendermint show-validator) \
    --moniker=$MONIKER \
    --chain-id=mamaki \
    --commission-rate=0.1 \
    --commission-max-rate=0.2 \
    --commission-max-change-rate=0.01 \
    --min-self-delegation=1000000 \
    --from=$VALIDATOR_WALLET
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

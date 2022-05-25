# DevNet-2

This guide contains the relevant sections for how to connect to Devnet,
depending on the type of node you are running. Devnet-2 is a milestone
in Celestia, allowing everyone to test out core functionalities on the
network. You can read more on the announcement [here](https://blog.celestia.org/celestia-launches-devnet/)

Your best approach to participating is to first determine which node
you would like to run. Each node guides will link to the relevant network
in order to show you how to connect to them.

You have a list of options on the type of nodes you can run in order to
participate in Devnet-2:

Consensus:

* [Validator Node](../nodes/validator-node.md)

Data Availability:

* [Bridge Node](../nodes/bridge-node.md)
* [Full Node](../nodes/full-node.md)
* [Light Node](../nodes/light-node.md)

Select the type of node you would like to run and follow the instructions
on each respective page. Whenever you are asked to select the type of network
you want to connect to in those guides, select `Devnet-2` in order to refer
to the correct instructions on this page on how to connect to Devnet-2.

## Setup P2P Network

Now we will setup the P2P Networks by cloning the networks repository:

```sh
cd $HOME
rm -rf networks
git clone https://github.com/celestiaorg/networks.git
```

To initialize the network pick a "node-name" that describes your
node. The --chain-id parameter we are using here is `devnet-2`. Keep in
mind that this might change if a new testnet is deployed.

```sh
celestia-appd init "node-name" --chain-id devnet-2
```

Copy the `genesis.json` file. For devnet-2 we are using:

```sh
cp $HOME/networks/devnet-2/genesis.json $HOME/.celestia-app/config
```

Set seeds and peers:

```sh
SEEDS="74c0c793db07edd9b9ec17b076cea1a02dca511f@46.101.28.34:26656"
PEERS="34d4bfec8998a8fac6393a14c5ae151cf6a5762f@194.163.191.41:26656"
sed -i.bak -e "s/^seeds *=.*/seeds = \"$SEEDS\"/; s/^persistent_peers \
    *=.*/persistent_peers = \"$PEERS\"/" $HOME/.celestia-app/config/config.toml
```

You can return back to where you left off in the Bridge Node guide [here](../nodes/validator-node.md#configure-pruning)

## Quick-Sync With Snapshot

Run the following command to quick-sync from a snapshot for
`devnet-2` (Note: this is a 100 GB download):

```sh
cd $HOME
rm -rf ~/.celestia-app/data
mkdir -p ~/.celestia-app/data
SNAP_NAME=$(curl -s https://snaps.qubelabs.io/celestia/ | \
    egrep -o ">devnet-2.*tar" | tr -d ">")
wget -O - https://snaps.qubelabs.io/celestia/${SNAP_NAME} | tar xf - \
    -C ~/.celestia-app/data/
```

You can return back to where you left off in the Bridge Node guide [here](../nodes/validator-node.md#start-the-celestia-app-with-systemd)

## Delegate to a Validator

To delegate tokens to the the `celesvaloper` validator, as an example you can run:

```sh
celestia-appd tx staking delegate \
    celesvaloper1q3v5cugc8cdpud87u4zwy0a74uxkk6u43cv6hd 1000000celes \
    --from=$VALIDATOR_WALLET --chain-id=devnet-2
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
`networks/devnet-2/celestia-node/mutual_peers.txt` to find the list of
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
validator to Devnet:

```sh
MONIKER="your_moniker"
VALIDATOR_WALLET="validator"

celestia-appd tx staking create-validator \
    --amount=1000000celes \
    --pubkey=$(celestia-appd tendermint show-validator) \
    --moniker=$MONIKER \
    --chain-id=devnet-2 \
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

You should now be able to see your validator from a block explorer like [here](https://celestia.observer/validators)

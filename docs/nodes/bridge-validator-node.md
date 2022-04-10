# Setting Up A Celestia Bridge & Validator Node
This tutorial will go over the steps to setting up your Celestia Bridge node.

Bridge nodes connect the data availability layer and the consensus layer while also having the option of becoming a validator.

If you are reading this tutorial in order to setup a validator, follow through the sections until you reach the validator setup guide. If you just want to run a bridge node, you don’t need to complete the validator step at the end.

## Overview of Bridge Nodes
A Celestia bridge node has the following properties:
1. Import and process “raw” headers & blocks from a trusted Core process (meaning a trusted RPC connection to a celestia-core node) in the Consensus network. Bridge Nodes can run this Core process internally (embedded) or simply connect to a remote endpoint. Bridge Nodes also have the option of being an active validator in the Consensus network.
2. Validate and erasure code the “raw” blocks
3. Supply block shares with data availability headers to Light Nodes in the DA network.
![](/img/nodes/BridgeNodes.png)
From an implementation perspective, Bridge Nodes run two separate processes:
1. Celestia App with Celestia Core ( [see repo](https://github.com/celestiaorg/celestia-app) )
	* **Celestia App** is the state machine where the application and the proof-of-stake logic is run. Celestia App is built on  [Cosmos SDK](https://docs.cosmos.network/)  and also encompasses **Celestia Core**.
	* **Celestia Core** is the state interaction, consensus and block production layer. Celestia Core is built on  [Tendermint Core](https://docs.tendermint.com/) , modified to store data roots of erasure coded blocks among other changes ( [see ADRs](https://github.com/celestiaorg/celestia-core/tree/master/docs/celestia-architecture) ).
2. Celestia Node ( [see repo](https://github.com/celestiaorg/celestia-node) )
	* **Celestia Node** augments the above with a separate libp2p network that serves data availability sampling requests. The team sometimes refer to this as the “halo” network.

## Hardware Requirements
The following hardware minimum requirements are recommended for running the bridge node:
* Memory: 8 GB RAM
* CPU: Quad-Core
* Disk: 100 GB SSD Storage
* Bandwidth: 1 GB of input-output connection

## Setting Up Your Bridge Node
The following tutorial is done on an Ubuntu Linux 20.04 (LTS) x64 instance machine. 

### Setup The Dependencies

Once you have setup your instance, ssh into the instance to begin setting up the box with all the needed dependencies in order to run your bridge node.

First, make sure to update and upgrade the OS:
```shell
sudo apt update && sudo apt upgrade -y
```

These are essential packages that are necessary to execute many tasks like downloading files, compiling and monitoring the node:

```shell
sudo apt install curl tar wget clang pkg-config libssl-dev jq build-essential git make ncdu -y
```

### Install Golang
Golang will be installed on this machine in order for us to be able to build the necessary binaries for running the bridge node. For Golang specifically, it’s needed to be able to compile Celestia Application.

```shell
ver="1.17.2"
cd $HOME
wget "https://golang.org/dl/go$ver.linux-amd64.tar.gz"
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf "go$ver.linux-amd64.tar.gz"
rm "go$ver.linux-amd64.tar.gz"
```

Now we need to add the `/usr/local/go/bin` directory to
`$PATH`:

```shell
echo "export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

To check if Go was installed correctly run:
```shell
go version
```

Output should be the version installed:
```shell
go version go1.17.2 linux/amd64
```

## Deploying The Celestia App
This section describes part 1 of Celestia Bridge Node setup: running a Celestia App daemon with an internal Celestia Core node.

> Note: Make sure you have at least 100+ Gb of free space to safely install+run the Bridge Node.  

### Install Celestia App
The steps below will create a binary file named `celestia-appd` inside `$HOME/go/bin` folder which will be used later to run the node.
```shell
cd $HOME
rm -rf celestia-app
git clone https://github.com/celestiaorg/celestia-app.git
cd celestia-app/
git checkout tags/v0.1.0 -b v0.1.0
make install
```

To check if the binary was successfully compiled you can run the binary using the `--help` flag:
```shell
cd $HOME/go/bin
./celestia-appd --help
```
You should see a similar output:
```
Stargate CosmosHub App

Usage:
  celestia-appd [command]

Available Commands:
  add-genesis-account Add a genesis account to genesis.json
  collect-gentxs      Collect genesis txs and output a genesis.json file
  config              Create or query an application CLI configuration file
  debug               Tool for helping with debugging your application
  export              Export state to JSON
  gentx               Generate a genesis tx carrying a self delegation
  help                Help about any command
  init                Initialize private validator, p2p, genesis, and application configuration files
  keys                Manage your application's keys
  migrate             Migrate genesis to a specified target version
  query               Querying subcommands
  start               Run the full node
  status              Query remote node for status
  tendermint          Tendermint subcommands
  tx                  Transactions subcommands
  unsafe-reset-all    Resets the blockchain database, removes address book files, and resets data/priv_validator_state.json to the genesis state
  validate-genesis    validates the genesis file at the default location or at the location passed as an arg
  version             Print the application binary version information

Flags:
  -h, --help                help for celestia-appd
      --home string         directory for config and data (default "/home/pops/.celestia-app")
      --log_format string   The logging format (json|plain) (default "plain")
      --log_level string    The logging level (trace|debug|info|warn|error|fatal|panic) (default "info")
      --trace               print out full stack trace on errors

Use "celestia-appd [command] --help" for more information about a command.
```

### Setup the P2P Networks
Now we will setup the P2P Networks by cloning the networks repository:
```shell
cd $HOME
rm -rf networks
git clone https://github.com/celestiaorg/networks.git
```
To initialize the network pick a “node-name” that describes your node. The --chain-id parameter we are using here is “devnet-2”. Keep in mind that this might change if a new testnet is deployed.
```
celestia-appd init "node-name" --chain-id devnet-2
```

Copy the `genesis.json` file. For devnet-2 we are using:
```shell
cp $HOME/networks/devnet-2/genesis.json $HOME/.celestia-app/config
```

Set seeds and peers:
```shell
SEEDS="74c0c793db07edd9b9ec17b076cea1a02dca511f@46.101.28.34:26656"
PEERS="34d4bfec8998a8fac6393a14c5ae151cf6a5762f@194.163.191.41:26656"
sed -i.bak -e "s/^seeds *=.*/seeds = \"$SEEDS\"/; s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.celestia-app/config/config.toml
```
### Configure Pruning
For lower disk space usage we recommend setting up pruning using the configurations below. You can change this to your own pruning configurations if you want:
```shell
pruning="custom"
pruning_keep_recent="100"
pruning_keep_every="5000"
pruning_interval="10"

sed -i -e "s/^pruning *=.*/pruning = \"$pruning\"/" $HOME/.celestia-app/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \"$pruning_keep_recent\"/" $HOME/.celestia-app/config/app.toml
sed -i -e "s/^pruning-keep-every *=.*/pruning-keep-every = \"$pruning_keep_every\"/" $HOME/.celestia-app/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \"$pruning_interval\"/" $HOME/.celestia-app/config/app.toml
```
### Reset Network
This will delete all data folders so we can start fresh:
```shell
celestia-appd unsafe-reset-all
```
### SystemD
SystemD is a daemon service useful for running applications as background processes.

Create Celestia-App systemd file:
```shell
sudo tee <<EOF >/dev/null /etc/systemd/system/celestia-appd.service
[Unit]
Description=celestia-appd Cosmos daemon
After=network-online.target

[Service]
User=$USER
ExecStart=$HOME/go/bin/celestia-appd start
Restart=on-failure
RestartSec=3
LimitNOFILE=4096

[Install]
WantedBy=multi-user.target
EOF
```

If the file was created successfully you will be able to see its content:
```shell
cat /etc/systemd/system/celestia-appd.service
```

Now, download the address book. You have 2 options:
```shell
wget -O $HOME/.celestia-app/config/addrbook.json "https://raw.githubusercontent.com/maxzonder/celestia/main/addrbook.json"
```
OR
```shell
wget -O $HOME/.celestia-app/config/addrbook.json "https://raw.githubusercontent.com/qubelabsio/celestia/main/addrbook.json"
```

Enable and start celestia-appd daemon:
```shell
sudo systemctl enable celestia-appd
sudo systemctl start celestia-appd
```

Check if daemon has been started correctly:
```shell
sudo systemctl status celestia-appd
```

Check daemon logs in real time:
```shell
sudo journalctl -u celestia-appd.service -f
```

To check if your node is in sync before going forward:
```shell
curl -s localhost:26657/status | jq .result | jq .sync_info
```

Make sure that you have `"catching_up": false`, otherwise leave it running until it is in sync.

### Wallet
#### Create a Wallet
You can pick whatever wallet name you want. For our example we used “validator” as the wallet name:
```sh
celestia-appd keys add validator
```
Save the mnemonic output as this is the only way to recover your validator wallet in case you lose it! 

#### Fund a Wallet
For the public celestia address, you can fund the previously created wallet via Discord by sending this message to #faucet channel:
```
!faucet celes1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
Wait to see if you get a confirmation that the tokens have been successfully sent. To check if tokens have arrived successfully to the destination wallet run the command below replacing the public address with your own:
```shell
celestia-appd q bank balances celes1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Delegate Stake to a Validator
If you want to delegate more stake to any validator, including your own you will need the `celesvaloper` address of the validator in question. You can either check it using the block explorer mentioned above or you can run the command below to get the `celesvaloper` of your local validator wallet in case you want to delegate more to it:
```shell
celestia-appd keys show $VALIDATOR_WALLET --bech val -a
```
After entering the wallet passphrase you should see a similar output:
```shell
Enter keyring passphrase:
celesvaloper1q3v5cugc8cdpud87u4zwy0a74uxkk6u43cv6hd
```
To delegate tokens to the the `celesvaloper` validator, as an example you can run:
```shell
celestia-appd tx staking delegate celesvaloper1q3v5cugc8cdpud87u4zwy0a74uxkk6u43cv6hd 1000000celes --from=$VALIDATOR_WALLET --chain-id=devnet-2
```
If successful, you should see a similar output as:
```shell
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
You can check if the TX hash went through using the block explorer by inputting the `txhash` ID that was returned.

## Deploy the Celestia Node
This section describes part 2 of Celestia Bridge Node setup: running a Celestia Node daemon.

### Install Celestia Node
Install the Celestia Node binary, which will be used to run the Bridge Node.
```sh
cd $HOME
rm -rf celestia-node
git clone https://github.com/celestiaorg/celestia-node.git
cd celestia-node/
make install
```
Verify that the binary is working and check the version with `celestia version` command:

```shell
$ celestia version
Semantic version: v0.2.0
Commit: 1fcf0c0bb5d5a4e18b51cf12440ce86a84cf7a72
Build Date: Fri 04 Mar 2022 01:15:07 AM CET
System version: amd64/linux
Golang version: go1.17.5
```

### Get the trusted hash
> Caveat: You need a running celestia-app in order to continue this guideline. Please refer to [celestia-app.md](https://github.com/celestiaorg/networks/celestia-app.md) for installation.  

You need to have the trusted server to initialize the Bridge Node. You can use http://localhost:26657 for your local run celestia-app. The trusted hash is an optional flag and does not need to be used. If you are not passing it, the Bridge Node will just sync from the beginning, which is also the preferred option of how to run it.

An example of how to query your local celestia-app to get the trusted hash:
```shell
curl -s http://localhost:26657/block?height=1 | grep -A1 block_id | grep hash
```

### Initialize the Bridge Node
```shell
celestia bridge init --core.remote <ip:port of celestia-app>
```
If you want to use the trusted hash anyways, here is how to initialize it:
```shell
celestia bridge init --core.remote <ip:port of celestia-app> --headers.trusted-hash <hash_from_celestia_app>
```

Example:
```shell 
celestia bridge init --core.remote tcp://127.0.0.1:26657 --headers.trusted-hash 4632277C441CA6155C4374AC56048CF4CFE3CBB2476E07A548644435980D5E17
```


### Configure the Bridge Node

In order for your Celestia Bridge Node to communicate with other Bridge Nodes, then you need to add them as `mutual peers` in the `config.toml` file and allow the peer exchange. Please navigate to `networks/devnet-2/celestia-node/mutual_peers.txt` to find the list of mutual peers

For more information on `config.toml`, please navigate to [this link](https://github.com/celestiaorg/networks/blob/master/config-toml.md)
```shell
nano ~/.celestia-bridge/config.toml
```

```shell
...
[P2P]
  ...
  #add multiaddresses of other celestia bridge nodes
  
  MutualPeers = [
    "/ip4/46.101.22.123/tcp/2121/p2p/12D3KooWD5wCBJXKQuDjhXFjTFMrZoysGVLtVht5hMoVbSLCbV22", 
    "/ip4/x.x.x.x/tcp/yyy/p2p/abc"] #the /ip4/x.x.x.x is only for example. Don't add it! 
  PeerExchange = true #change this line to true. By default it's false
  ...
...
```

### Start the Bridge Node
```shell
celestia bridge start
```
Now, the Celestia bridge node will start syncing headers and storing blocks from Celestia application. 

> Note: At startup, we can see the `multiaddress` from Celestia Bridge Node. This is <b>needed for future Light Node</b> connections and communication between Celestia Bridge Nodes  

Example:
```shell
/ip4/46.101.22.123/tcp/2121/p2p/12D3KooWD5wCBJXKQuDjhXFjTFMrZoysGVLtVht5hMoVbSLCbV22
```

You should be seeing logs coming through of the bridge node syncing.

You have successfully set up a bridge node that is syncing with the network. Read on if you are interested in setting up a Validator node.

## Run a Validator Bridge Node
Optionally, if you want to join the active validator list, you can create your own validator on-chain following the instructions below. Keep in mind that these steps are necessary ONLY if you want to participate in the consensus.

Pick a MONIKER name of your choice! This is the validator name that will show up on public dashboards and explorers. VALIDATOR_WALLET must be the same you defined previously. Parameter `--min-self-delegation=1000000` defines the amount of tokens that are self delegated from your validator wallet.
```shell
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
```shell
confirm transaction before signing and broadcasting [y/N]: y
```
Inputting `y` should provide an output similar to:
```shell
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
You should now be able to see your validator from a block explorer such as: https://celestia.observer/validators

# Setting Up A Celestia Validator Node

Validator nodes allow you to participate in consensus in the Celestia network.

## Hardware Requirements

The following hardware minimum requirements are recommended for running the
bridge node:

* Memory: 8 GB RAM
* CPU: Quad-Core
* Disk: 250 GB SSD Storage
* Bandwidth: 1 Gbps for Download/100 Mbps for Upload

## Setting Up Your Validator Node

The following tutorial is done on an Ubuntu Linux 20.04 (LTS) x64
instance machine.

### Setup The Dependencies

Follow the instructions on installing the dependencies [here](../../developers/environment).

## Deploying The Celestia App

This section describes part 1 of Celestia Validator Node setup:
running a Celestia App daemon with an internal Celestia Core node.

> Note: Make sure you have at least 100+ Gb of free space to safely install+run
  the Validator Node.  

### Install Celestia App

Follow the tutorial on installing Celestia App [here](../../developers/celestia-app).

### Setup the P2P Networks

For this section of the guide, select the network you want to connect to:

* [Mamaki](../nodes/mamaki-testnet.md#setup-p2p-network)

After that, you can proceed with the rest of the tutorial.

### Configure Pruning

For lower disk space usage we recommend setting up pruning using the
configurations below. You can change this to your own pruning configurations
if you want:

```sh
pruning="custom"
pruning_keep_recent="100"
pruning_keep_every="5000"
pruning_interval="10"

sed -i -e "s/^pruning *=.*/pruning = \"$pruning\"/" $HOME/.celestia-app/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \
\"$pruning_keep_recent\"/" $HOME/.celestia-app/config/app.toml
sed -i -e "s/^pruning-keep-every *=.*/pruning-keep-every = \
\"$pruning_keep_every\"/" $HOME/.celestia-app/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \
\"$pruning_interval\"/" $HOME/.celestia-app/config/app.toml
```

### Reset Network

This will delete all data folders so we can start fresh:

```sh
celestia-appd unsafe-reset-all --home $HOME/.celestia-app
```

### Optional: Quick-Sync with Snapshot

Syncing from Genesis can take a long time, depending on your hardware. Using
this method you can synchronize your Celestia node very quickly by downloading
a recent snapshot of the blockchain. If you would like to sync from the Genesis,
then you can skip this part.

If you want to use snapshot, determine the network you would like to sync
to from the list below:

* [Mamaki](../nodes/mamaki-testnet.md#quick-sync-with-snapshot)

### Start the Celestia-App with SystemD

SystemD is a daemon service useful for running applications as background processes.

Create Celestia-App systemd file:

```sh
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

```sh
cat /etc/systemd/system/celestia-appd.service
```

You must now set a few configs in your `config.toml`. Learn more about the
config.toml file [here](../nodes/config-toml.md)

Run the following command to set timeout to 25 seconds:

```sh
sed -i.bak -e "s/^timeout-commit *=.*/timeout-commit = \"25s\"/" $HOME/.celestia-app/config/config.toml
sed -i.bak -e "s/^skip-timeout-commit *=.*/skip-timeout-commit = false/" $HOME/.celestia-app/config/config.toml
```

Now run the following command to set the mode:

```sh
sed -i.bak -e "s/^mode *=.*/mode = \"validator\"/" $HOME/.celestia-app/config/config.toml
```

Enable and start celestia-appd daemon:

```sh
sudo systemctl enable celestia-appd
sudo systemctl start celestia-appd
```

Check if daemon has been started correctly:

```sh
sudo systemctl status celestia-appd
```

Check daemon logs in real time:

```sh
sudo journalctl -u celestia-appd.service -f
```

To check if your node is in sync before going forward:

```sh
curl -s localhost:26657/status | jq .result | jq .sync_info
```

Make sure that you have `"catching_up": false`, otherwise leave it running
until it is in sync.

### Wallet

Follow the tutorial on creating a wallet [here](../../developers/wallet).

### Delegate Stake to a Validator

Create an environment variable for the address:

```sh
VALIDATOR_WALLET=<validator-address>
```

If you want to delegate more stake to any validator, including your own you
will need the `celesvaloper` address of the validator in question. You can
either check it using the block explorer mentioned above or you can run the
command below to get the `celesvaloper` of your local validator wallet in
case you want to delegate more to it:

```sh
celestia-appd keys show $VALIDATOR_WALLET --bech val -a
```

After entering the wallet passphrase you should see a similar output:

```sh
Enter keyring passphrase:
celesvaloper1q3v5cugc8cdpud87u4zwy0a74uxkk6u43cv6hd
```

Next, select the network you want to use to delegate to a validator:

* [Mamaki](../nodes/mamaki-testnet.md#delegate-to-a-validator)

## Deploy the Celestia Node

This section describes part 2 of Celestia Validator Node setup: running a
Celestia Bridge Node daemon.

### Install Celestia Node

Install the Celestia Node binary, which will be used to run the Bridge Node.

```sh
cd $HOME
rm -rf celestia-node
git clone https://github.com/celestiaorg/celestia-node.git
cd celestia-node/
APP_VERSION=$(curl -s \
  https://api.github.com/repos/celestiaorg/celestia-node/releases/latest \
  | jq -r ".tag_name")
git checkout tags/$APP_VERSION -b $APP_VERSION
make install
```

Verify that the binary is working and check the version with `celestia version` command:

```sh
$ celestia version
Semantic version: v0.2.0
Commit: 1fcf0c0bb5d5a4e18b51cf12440ce86a84cf7a72
Build Date: Fri 04 Mar 2022 01:15:07 AM CET
System version: amd64/linux
Golang version: go1.17.5
```

### Initialize the Bridge Node

Run the following:

```sh
celestia bridge init --core.remote <ip:port of celestia-app> \
  --core.grpc <ip:port>
```

If you need a list of RPC endpoints to connect to, you can check from the list [here](../nodes/mamaki-testnet#rpc-endpoints)

### Run the Bridge Node

Run the following:

```sh
celestia bridge start
```

### Optional: Start the Bridge Node with SystemD

SystemD is a daemon service useful for running applications as background processes.

Create Celestia Bridge systemd file:

```sh
sudo tee <<EOF >/dev/null /etc/systemd/system/celestia-bridge.service
[Unit]
Description=celestia-bridge Cosmos daemon
After=network-online.target

[Service]
User=$USER
ExecStart=$HOME/go/bin/celestia bridge start
Restart=on-failure
RestartSec=3
LimitNOFILE=4096

[Install]
WantedBy=multi-user.target
EOF
```

If the file was created successfully you will be able to see its content:

```sh
cat /etc/systemd/system/celestia-bridge.service
```

Enable and start celestia-bridge daemon:

```sh
sudo systemctl enable celestia-bridge
sudo systemctl start celestia-bridge && sudo journalctl -u \
celestia-bridge.service -f
```

Now, the Celestia bridge node will start syncing headers and storing blocks
from Celestia application.

> Note: At startup, we can see the `multiaddress` from Celestia Bridge Node.
  This is **needed for future Light Node** connections and communication
  between Celestia Bridge Nodes  

Example:

```sh
/ip4/46.101.22.123/tcp/2121/p2p/12D3KooWD5wCBJXKQuDjhXFjTFMrZoysGVLtVht5hMoVbSLCbV22
```

You should be seeing logs coming through of the bridge node syncing.

You have successfully set up a bridge node that is syncing with the network.

If you want to next run a validator node, read the following tutorial [here](../nodes/validator-node.md).

## Run a Validator Node

After completing all the necessary steps, you are now ready to run a validator!
In order to create your validator on-chain, follow the instructions below.
Keep in mind that these steps are necessary ONLY if you want to participate
in the consensus.

Pick a `moniker` name of your choice! This is the validator name that will show
up on public dashboards and explorers. `VALIDATOR_WALLET` must be the same you
defined previously. Parameter `--min-self-delegation=1000000` defines the
amount of tokens that are self delegated from your validator wallet.

Now, connect to the network of your choice.

You have the following option of connecting to list of networks shown below:

* [Mamaki](../nodes/mamaki-testnet.md#connect-validator)

Complete the instructions in the respective network you want to validate in
to complete the validator setup process.

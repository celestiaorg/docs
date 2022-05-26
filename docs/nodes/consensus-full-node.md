# Setting Up A Celestia Consensus Full Node

Consensus Full Nodes allow you to sync blockchain history in the Celestia
Consensus Layer.

## Hardware Requirements

The following hardware minimum requirements are recommended for running the
Consensus Full Node:

* Memory: 8 GB RAM
* CPU: Quad-Core
* Disk: 250 GB SSD Storage
* Bandwidth: 1 Gbps for Download/100 Mbps for Upload

## Setting Up Your Consensus Full Node

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
celestia-appd tendermint unsafe-reset-all --home $HOME/.celestia-app
```

### Optional: Quick-Sync with Snapshot

Syncing from Genesis can take a long time, depending on your hardware. Using
this method you can synchronize your Celestia node very quickly by downloading
a recent snapshot of the blockchain. If you would like to sync from the Genesis,
then you can skip this part.

If you want to use snapshot, determine the network you would like to sync
to from the list below:

* [Mamaki](../nodes/mamaki-testnet.md#quick-sync-with-snapshot)

### Start the Celestia App

In order to start your consensus full node, run the following:

```sh
celestia-appd start
```

This will let you sync the Celestia blockchain history.

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

Run the following command to set the commit timeout to 25 seconds (necessary to have a block interval time for roughly 30 seconds):

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
systemctl status celestia-appd
```

Check daemon logs in real time:

```sh
journalctl -u celestia-appd.service -f
```

To check if your node is in sync before going forward:

```sh
curl -s localhost:26657/status | jq .result | jq .sync_info
```

Make sure that you have `"catching_up": false`, otherwise leave it running
until it is in sync.

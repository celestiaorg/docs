# Setting Up A Celestia Full Node

This tutorial will guide you through setting up a Celestia Full Node,
which is a Celestia node that doesn't connect to Celestia App
(hence not a bridge node) but stores all the data.

## Hardware Requirements

The following hardware minimum requirements are recommended for running
the full node:

* Memory: 8 GB RAM
* CPU: Quad-Core
* Disk: 250 GB SSD Storage
* Bandwidth: 1 Gbps for Download/100 Mbps for Upload

## Setting Up Your Full Node

The following tutorial is done on an Ubuntu Linux 20.04 (LTS) x64
instance machine.

### Setup The Dependencies

You can follow the tutorial for setting up your dependencies [here](../developers/environment)

## Install Celestia Node

> Note: Make sure that you have at least 250+ Gb of free space
  for Celestia Full Node  

You can follow the tutorial for installing Celestia Node [here](../developers/celestia-node)

### Run the Full Node

#### Initialize the Full Node

Run the following command:

```sh
celestia full init
```

#### Start the Full Node

Start the Full Node as daemon process in the background

```sh
sudo tee <<EOF >/dev/null /etc/systemd/system/celestia-fulld.service
[Unit]
Description=celestia-fulld Full Node
After=network-online.target

[Service]
User=$USER
ExecStart=$HOME/go/bin/celestia full start
Restart=on-failure
RestartSec=3
LimitNOFILE=4096

[Install]
WantedBy=multi-user.target
EOF
```

If the file was created succesfully you will be able to see its content:

```sh
cat /etc/systemd/system/celestia-fulld.service
```

#### Start The Daemon

Enable and start celestia-fulld daemon:

```sh
sudo systemctl enable celestia-fulld
sudo systemctl start celestia-fulld
```

#### Check Daemon Status

Check if daemon has been started correctly:

```sh
sudo systemctl status celestia-fulld
```

#### Check Daemon Logs

Check daemon logs in real time:

```sh
sudo journalctl -u celestia-fulld.service -f
```

Now, the Celestia Full Node will start syncing.

With that, you are now running a Celestia Full Node.

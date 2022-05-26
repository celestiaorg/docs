# Setting Up A Celestia Full Node

This tutorial will guide you through setting up a Celestia Full Node,
which is a Celestia node that doesn't connect to Celestia App
(hence not a full node) but stores all the data.

## Hardware Requirements

The following hardware minimum requirements are recommended for running
the full node:

* Memory: 8 GB RAM
* CPU: Quad-Core
* Disk: 250 GB SSD Storage
* Bandwidth: 1 Gbps for Download/100 Mbps for Upload

## Setting Up Your Full Node

The following tutorial is done on an Ubuntu Linux 20.04 (LTS) x64 instance machine.

### Setup The Dependencies

You can follow the tutorial for setting up your dependencies [here](../../developers/environment)

## Install Celestia Node

> Note: Make sure that you have at least 250+ Gb of free space for
  Celestia Full Node

You can follow the tutorial for installing Celestia Node [here](../../developers/celestia-node)

### Run the Full Node

#### Initialize the Full Node

Run the following command:

```sh
celestia full init
```

#### Start the Full Node

Start the Full Node with a connection to a validator node's gRPC endpoint
(which is usually exposed on port 9090):

> NOTE: In order for access to the ability to get/submit state-related
  information, such as the ability to submit PayForData transactions,
  or query for the node's account balance, a gRPC endpoint of a validator
  (core) node must be passed as directed below._

```sh
celestia full start --core.grpc <ip addr of core node>:9090
```

### Optional: Start the Full Node with SystemD

SystemD is a daemon service useful for running applications as background processes.

Create Celestia Full Node systemd file:

```sh
sudo tee <<EOF >/dev/null /etc/systemd/system/celestia-full.service
[Unit]
Description=celestia-full Cosmos daemon
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

If the file was created successfully you will be able to see its content:

```sh
cat /etc/systemd/system/celestia-full.service
```

Enable and start celestia-full daemon:

```sh
sudo systemctl enable celestia-full
sudo systemctl start celestia-full && sudo journalctl -u \
celestia-full.service -f
```

Now, the Celestia Full Node will start syncing.

With that, you are now running a Celestia Full Node.

#### Optional: Run the Full Node with a Custom Key

In order to run a full node using a custom key:

1. The custom key must exist inside the celestia full node directory
   at the correct path (default: `~/.celestia-full/keys/keyring-test`)
2. The name of the custom key must be passed upon `start`, like so:

```sh
celestia full start --core.grpc <ip>:9090 --keyring.accname <name_of_custom_key>
```

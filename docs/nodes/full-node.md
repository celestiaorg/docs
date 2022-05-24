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

Once you have setup your instance, ssh into the instance to begin
setting up the box with all the needed dependencies in order to
run your full node.

First, make sure to update and upgrade the OS:

```sh
sudo apt update && sudo apt upgrade -y
```

These are essential packages that are necessary to execute many
tasks like downloading files, compiling and monitoring the node:

```sh
sudo apt install curl tar wget clang pkg-config libssl-dev jq \
build-essential git make ncdu -y
```

### Install Golang

Golang will be installed on this machine in order for us to be able
to build the necessary binaries for running the full node. For Golang
specifically, it’s needed to be able to compile Celestia Light Node.

```sh
ver="1.17.2"
cd $HOME
wget "https://golang.org/dl/go$ver.linux-amd64.tar.gz"
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf "go$ver.linux-amd64.tar.gz"
rm "go$ver.linux-amd64.tar.gz"
```

Now we need to add the `/usr/local/go/bin` directory to `$PATH`:

```sh
echo "export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

To check if Go was installed correctly run:

```sh
go version
```

Output should be the version installed:

```sh
go version go1.17.2 linux/amd64
```

## Install Celestia Node

> Note: Make sure that you have at least 250+ Gb of free space
  for Celestia Full Node  

Install the Celestia Node binary.
Make sure that you have `git` and `golang` installed.

```sh
git clone https://github.com/celestiaorg/celestia-node.git
cd celestia-node/
APP_VERSION=$(curl -s \
  https://api.github.com/repos/celestiaorg/celestia-node/releases/latest \
  | jq -r ".tag_name")
git checkout tags/$APP_VERSION -b $APP_VERSION
make install
```

### Run the Full Node

#### Initialize the Full Node

Run the following command:

```sh
celestia full init
```

#### Start the Light Node

Start the Light Node as daemon process in the background

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

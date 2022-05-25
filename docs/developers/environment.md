# Setting Up Development Environment

This tutorial will go over setting up your environment to test out
Celestia software and build the binaries. It can be used for both
node operation purposes and for development.

## Setting Up Dependencies

Once you have setup your instance, ssh into the instance to begin setting up
the box with all the needed dependencies in order to run your bridge node.

First, make sure to update and upgrade the OS:

```sh
sudo apt update && sudo apt upgrade -y
```

These are essential packages that are necessary to execute many tasks like
downloading files, compiling and monitoring the node:

```sh
sudo apt install curl tar wget clang pkg-config libssl-dev jq build-essential \
git make ncdu -y
```

## Install Golang

Golang will be installed on this machine in order for us to be able to build
the necessary binaries for running the bridge node. For Golang specifically,
it’s needed to be able to compile the Celestia Application.

```sh
ver="1.18.2"
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
go version go1.18.2 linux/amd64
```

---
Sidebar_Label: Docker images
Description: Comprehensive guide for setting up Celestia-App and Celestia-Node using Docker.
---

# Celestia-App and Celestia-Node Setup with Docker 🐳

## Table of Contents

1. [Introduction](#introduction)
2. [Docker Installation](#docker-installation)
3. [Celestia-app Setup With Docker](#celestia-app-setup-with-docker)
    - [Overview of celestia-app txsim](#overview-of-celestia-app-txsim)
    - [Prerequisites to run celestia-app on Docker](#prerequisites-to-run-celestia-app-on-docker)
    - [Celestia-app Quick-Start](#celestia-app-quick-start)
    - [Flag Breakdown](#flag-breakdown)
4. [Celestia-node Setup With Docker](#celestia-node-setup-with-docker)
    - [Celestia-node Quick start](#celestia-node-quick-start)
    - [Light node setup with persistent storage](#light-node-setup-with-persistent-storage)
    - [Initialize the node store and key](#initialize-the-node-store-and-key)
    - [Start the node](#start-the-node)
5. [Video walkthrough](#video-walkthrough)
6. [Troubleshooting](#troubleshooting)

<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD013 -->
<script setup>
import constants from '/.vitepress/constants/constants.js'
import arabicaVersions from '/.vitepress/constants/arabica_versions.js'
import mochaVersions from '/.vitepress/constants/mocha_versions.js'
import mainnetVersions from '/.vitepress/constants/mainnet_versions.js'
</script>

## Introduction

This page provides instructions on how to set up both the Celestia-App and
the Celestia-Node using Docker.
see [celestia-node page](./celestia-node.md) for additional instructions
to run celestia-node using Docker.

Docker is a container technology that offers a seamless method
for running applications in isolated environments on any
operating system.

This means that you can run Celestia-app & celestia-node
on your machine without having to worry about installing
and configuring all the dependencies required.

If you would like to learn more about
key management in Docker, visit the
[Docker and `cel-key` section](../developers/celestia-node-key.md#docker-and-cel-key).

## Docker Installation

To install Docker on your machine, see the links below for instructions
on your specific OS.

- [Docker Desktop for Mac or Windows](https://docs.docker.com/get-docker) or

- [Docker Engine for Linux](https://docs.docker.com/engine/install/)
  
- Ensure you have a basic understanding of Docker to proceed.

## Celestia-App Setup With Docker

This guide provides instructions on how to use the Celestia `txsim` Docker image.

### Overview of Celestia-App `txsim`

The Celestia-App `txsim` binary is a tool that can be
used to simulate transactions on the Celestia network.
It can be used to test the performance of the Celestia network.
The txsim Docker image runs the `txsim` binary with multiple configurable options.

### Prerequisites to run Celestia-App on Docker

- Docker and a basic understanding of docker
- A prefunded account set up with the keyring stored in a file,
to be accessed by an instance of the docker image.
For more information on setting up a prefunded account,
refer to [key management](https://docs.celestia.org/nodes/celestia-app-commands).

### Celestia-App Quick-Start

1. In your local machine, navigate to the home directory

   ```bash
   cd $HOME
   ```

2. Create a file in which the keyring would be stored.
The file would be mounted as a volume into the docker container.

   ```bash
   touch $HOME/.celestia-app
   ```

3. Using a suitable text editor of your choice, open the
.celestia-app file and paste the keyring of the prefunded account.

4. We recommend that you set the necessary file permission for the
.celestia-app file. A simple read access is all that is required for the
docker container to access the content of the file.

5. You can run the txsim Docker image using the docker run command below.

   ```bash
   docker run -it \
   -v $HOME/.celestia-app:/home/celestia ghcr.io/celestiaorg/txsim \
   -k 0 \
   -g consensus-validator-robusta-rc6.celestia-robusta.com: \
   -t 10s -b 10 -d 100 -e 10
   ```

6. In this command, the -v option is used to mount the
$HOME/.celestia-app directory from the host to the /home/celestia
directory in the Docker container.
This allows the txsim binary to access the keyring for the prefunded account.

Congratulations! You have successfully set up Celestia-App in Docker 😎

### Flag Breakdown

The table below provides a brief explanation of the
flags used in the docker run command in step 5 of the quick start instructions.

| FLAG | DESCRIPTION | DEFAULT | OPTION |
| ---- | ---- | ---- | :----: |
|`-k`|Whether a new key should be created|0|1 for yes, 0 for no|
|`-p`|Path to keyring for prefunded account|-|-|
|`-g`|gRPC endpoint|consensus-validator-robusta-rc6.celestia-robusta.com:9090||
|`-t`|Poll time for the `txsim` binary|10s|1s,2s,3s,4s,...|
|`-b`|Number of blob sequences to run|10|any integer value(1,2,3,...)|
|`-a`|Range of blobs to send per PFB in a sequence|-|-|
|`-s`|Range of blob sizes to send|-|-|
|`-m`|Mnemonic for the keyring |-|-|
|`-d`|Seed for the random number generator|100|any integer value (1,2,3,...)|
|`-e`|Number of send sequences to run|10|any integer value (1,2,3,...)|
|`-i`|Amount to send from one account to another|-|any integer value (1,2,3,...)|
|`-v`|Number of send iterations to run per sequence|-|any integer value (1,2,3,...)|
|`-u`|Number of stake sequences to run|-|any integer value (1,2,3,...)|
|`-w`|Amount of initial stake per sequence|-|any integer value (1,2,3,...)|

Kindly replace the placeholders in the example docker run
command in step 5 of the quick start instructions,
with the actual values you want to use.

## Celestia-Node Setup With Docker

This guide provides instructions on how to set up Celestia-Node using Docker.

### Celestia-Node Quick start

1. Set [the network](./participate.md) you would like to run your node on:

   ::: code-group

   ```bash [Mainnet Beta]
   export NETWORK=celestia
   ```

   ```bash [Mocha]
   export NETWORK=mocha
   ```

   ```bash [Arabica]
   export NETWORK=arabica
   ```

   :::

2. Set the node type

   ::: code-group

   ```bash [Light]
   export NODE_TYPE=light
   ```

   ```bash [Bridge]
   export NODE_TYPE=bridge
   ```

   ```bash [Full]
   export NODE_TYPE=full
   ```

   :::

3. Set an RPC endpoint for either [Mainnet Beta](./mainnet.md#da-rpc-endpoints),
   [Mocha](./mocha-testnet.md#rpc-endpoints), or
   [Arabica](./arabica-devnet.md#rpc-endpoints)
   using the bare URL (without http or https):

   ```bash
   export RPC_URL=this-is-an-rpc-url.com
   ```

4. Run the image from the command line:

   ::: code-group

   ```bash-vue [Mainnet Beta]
   docker run -e NODE_TYPE=$NODE_TYPE -e P2P_NETWORK=$NETWORK \
       ghcr.io/celestiaorg/celestia-node:{{mainnetVersions['node-latest-tag']}} \
       celestia $NODE_TYPE start --core.ip $RPC_URL --p2p.network $NETWORK
   ```

   ```bash-vue [Mocha]
   docker run -e NODE_TYPE=$NODE_TYPE -e P2P_NETWORK=$NETWORK \
       ghcr.io/celestiaorg/celestia-node:{{mochaVersions['node-latest-tag']}} \
       celestia $NODE_TYPE start --core.ip $RPC_URL --p2p.network $NETWORK
   ```

   ```bash-vue [Arabica]
   docker run -e NODE_TYPE=$NODE_TYPE -e P2P_NETWORK=$NETWORK \
       ghcr.io/celestiaorg/celestia-node:{{arabicaVersions['node-latest-tag']}} \
       celestia $NODE_TYPE start --core.ip $RPC_URL --p2p.network $NETWORK
   ```

   :::

Congratulations! You now have a Celestia-Node running 😎

If you would like to run the node with custom flags,
you can refer to the
[celestia-node tutorial](../developers/node-tutorial.md#connect-to-a-public-core-endpoint) page. Refer to
[the ports section of the celestia-node troubleshooting page](./celestia-node-troubleshooting.md#ports)
for information on which ports are required to be open on your machine.

### Light node setup with persistent storage

If you delete a container that you started above, all data will be lost.
To avoid this, you can mount a volume to the container.
This will allow you to persist data even after the container is deleted.

First, you will need to create a directory on your host machine.
This directory will be used to store the data for the container.
Create a directory on your host machine and give it a name.
For example, you can name it `my-node-store`:

```bash
cd $HOME
mkdir my-node-store
```

Now, you can mount this directory to the container.
Before mounting a volume, you _may_ need to set permissions for
the user on the host machine by running:

::: code-group

```bash [Docker Engine on Linux]
sudo chown 10001:10001 $HOME/my-node-store
```

```bash [Docker Desktop on Mac]
# you're good to go 😎
```

:::

### Initialize the node store and key

To mount a volume to the container, specify the path to the
volume when you run your container using the
`--volume` (or `-v` for short) flag.
In this command, we'll create our key and initialize the node store,
using the variables we set in the [Celestia-app Quick-Start](#celestia-app-quick-start) section:

```bash
# --volume == -v [local path]:[container path]
docker run [args...] -v $HOME/my-node-store:/home/celestia \
    celestia $NODE_TYPE init [args...]
```

An example init command will look similar to below:

::: code-group

```bash-vue [Mainnet Beta]
docker run -e NODE_TYPE=$NODE_TYPE -e P2P_NETWORK=$NETWORK \
    -v $HOME/my-node-store:/home/celestia \
    ghcr.io/celestiaorg/celestia-node:{{mainnetVersions['node-latest-tag']}} \
    celestia light init --p2p.network $NETWORK
```

```bash-vue [Mocha]
docker run -e NODE_TYPE=$NODE_TYPE -e P2P_NETWORK=$NETWORK \
    -v $HOME/my-node-store:/home/celestia \
    ghcr.io/celestiaorg/celestia-node:{{mochaVersions['node-latest-tag']}} \
    celestia light init --p2p.network $NETWORK
```

```bash-vue [Arabica]
docker run -e NODE_TYPE=$NODE_TYPE -e P2P_NETWORK=$NETWORK \
    -v $HOME/my-node-store:/home/celestia \
    ghcr.io/celestiaorg/celestia-node:{{arabicaVersions['node-latest-tag']}} \
    celestia light init --p2p.network $NETWORK
```

:::

### Start the node

Run the following command to start the node:

```bash
# --volume == -v [local path]:[container path]
docker run [...args] -v $HOME/my-node-store:/home/celestia \
    celestia <node-type> start [...args]
```

A full start command will look similar to below.

::: code-group

```bash-vue [Mainnet Beta]
docker run -e NODE_TYPE=$NODE_TYPE -e P2P_NETWORK=$NETWORK \
    -v $HOME/my-node-store:/home/celestia \
    ghcr.io/celestiaorg/celestia-node:{{mainnetVersions['node-latest-tag']}} \
    celestia light start --core.ip $RPC_URL
```

```bash-vue [Mocha]
docker run -e NODE_TYPE=$NODE_TYPE -e P2P_NETWORK=$NETWORK \
    -v $HOME/my-node-store:/home/celestia \
    ghcr.io/celestiaorg/celestia-node:{{mochaVersions['node-latest-tag']}} \
    celestia light start --core.ip $RPC_URL
```

```bash-vue [Arabica]
docker run -e NODE_TYPE=$NODE_TYPE -e P2P_NETWORK=$NETWORK \
    -v $HOME/my-node-store:/home/celestia \
    ghcr.io/celestiaorg/celestia-node:{{arabicaVersions['node-latest-tag']}} \
    celestia light start --core.ip $RPC_URL
```

:::

Congratulations! You now have a node running with persistent storage 😎.

## Video walkthrough

- [Running a Celestia light node](https://youtube.com/embed/WFubhQc8tGk)

<!-- <div class="youtube-wrapper">
  <iframe
    class="youtube-video"
    title="Running a Celestia light node"
    src="https://youtube.com/embed/WFubhQc8tGk"
    allowfullscreen
  ></iframe>
</div> -->

### 2.5 minute version

- [Running a Celestia light node YouTube video](https://youtube.com/embed/ROZv871Q7RM)

<!-- <div class="youtube-wrapper">
  <iframe
    class="youtube-video"
    title="Running a Celestia light node"
    src="https://youtube.com/embed/ROZv871Q7RM"
    allowfullscreen
  ></iframe>
</div> -->

## Troubleshooting

For security purposes, Celestia expects to interact with your node's keys in a read-only manner. This is enforced using linux style permissions
on the filesystem. Windows NTFS does not support these types of permissions.
As a result the recommended path for Windows users to mount a persisted
volume is to do so within WSL.
You can find
[instructions for installing WSL](https://learn.microsoft.com/en-us/windows/wsl/install).

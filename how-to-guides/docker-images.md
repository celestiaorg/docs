---
sidebar_label: Docker images
description: Running Celestia Node using Docker.
---

# 🐳 Docker setup

<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD013 -->
<script setup>
import constants from '/.vitepress/constants/constants.js'
import arabicaVersions from '/.vitepress/constants/arabica_versions.js'
import mochaVersions from '/.vitepress/constants/mocha_versions.js'
import mainnetVersions from '/.vitepress/constants/mainnet_versions.js'
</script>

This page has instructions to run celestia-node using Docker. If you are
looking for instructions to run celestia-node using a binary, please
refer to the [celestia-node page](./celestia-node.md).

Using Docker is the easiest way to run celestia-node for most
users. Docker is a containerization platform that allows you to run celestia-node
in an isolated environment.

This means that you can run celestia-node on your machine without having
to worry about installing and configuring all of the dependencies required
to run the node.

If you would like to learn more about
key management in Docker, visit the
[Docker and `cel-key` section](../tutorials/celestia-node-key.md#docker-and-cel-key).

The easiest way to install Docker is to use the Docker Desktop installer or
Ubuntu. You can
[follow the instructions for your operating system](https://docs.docker.com/engine/install).

## Prerequisites

- [Docker Desktop for Mac or Windows](https://docs.docker.com/get-docker) and a basic
  understanding of Docker
- [Docker Engine for Linux](https://docs.docker.com/engine/install/) and a
  basic understanding of Docker

## Quick start

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

3. Set an RPC endpoint for either [Mainnet Beta](./mainnet.md#integrations),
   [Mocha](./mocha-testnet.md#integrations), or
   [Arabica](./arabica-devnet.md#integrations)
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

Congratulations! You now have a celestia-node running!

If you would like to run the node with custom flags,
you can refer to the
[celestia-node tutorial](../tutorials/node-tutorial.md#connect-to-a-core-endpoint) page. Refer to
[the ports section of the celestia-node troubleshooting page](./celestia-node-troubleshooting.md#ports)
for information on which ports are required to be open on your machine.

## Light node setup with persistent storage

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

In order to mount a volume to the container, you need to specify
the path to the volume. When you run your container, you can specify
the path to the volume using the `--volume` (or `-v` for short) flag.
In this command, we'll create our key and initialize the node store,
using the variables we set in the [quick start](#quick-start) section:

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

Congratulations! You now have a node running with persistent storage.

## Video walkthrough

<div class="youtube-wrapper">
  <iframe
    class="youtube-video"
    title="Running a Celestia light node"
    src="https://youtube.com/embed/WFubhQc8tGk"
    allowfullscreen
  ></iframe>
</div>

### 2.5 minute version

<div class="youtube-wrapper">
  <iframe
    class="youtube-video"
    title="Running a Celestia light node"
    src="https://youtube.com/embed/ROZv871Q7RM"
    allowfullscreen
  ></iframe>
</div>

## Troubleshooting

For security purposes Celestia expects to interact with the your node's
keys in a read-only manner. This is enforced using linux style permissions
on the filesystem. Windows NTFS does not support these types of permissions.
As a result the recommended path for Windows users to mount a persisted
volume is to do so within WSL.
You can find
[instructions for installing WSL](https://learn.microsoft.com/en-us/windows/wsl/install).

# 🐳 Docker setup

This page has instructions to run celestia-node using Docker. If you are
looking for instructions to run celestia-node using a binary, please
refer to the [celestia-node page](/operate/data-availability/install-celestia-node).

Using Docker is the easiest way to run celestia-node for most
users. Docker is a containerization platform that allows you to run celestia-node
in an isolated environment.

This means that you can run celestia-node on your machine without having
to worry about installing and configuring all of the dependencies required
to run the node.

If you would like to learn more about
key management in Docker, visit the
[Docker and `cel-key` section](/operate/keys-wallets/celestia-node-key#docker-and-cel-key).

The easiest way to install Docker is to use the Docker Desktop installer or
Ubuntu. You can
[follow the instructions for your operating system](https://docs.docker.com/engine/install).

## Prerequisites

- [Docker Desktop for Mac or Windows](https://docs.docker.com/get-docker) and a basic
  understanding of Docker
- [Docker Engine for Linux](https://docs.docker.com/engine/install/) and a
  basic understanding of Docker

## Quick start

If you would like to run the node with custom flags,
you can refer to the
[celestia-node tutorial](/operate/data-availability/light-node/quickstart#start-the-light-node) page. Refer to
[the ports section of the celestia-node troubleshooting page](/operate/maintenance/troubleshooting#ports)
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

**Docker Engine on Linux**
```bash
sudo chown 10001:10001 $HOME/my-node-store
```

**Docker Desktop on Mac**
```bash
# you're good to go 😎
```

> Docker Desktop on Mac users typically do not need to change permissions.

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

For security purposes Celestia expects to interact with your node's
keys in a read-only manner. This is enforced using linux style permissions
on the filesystem. Windows NTFS does not support these types of permissions.
As a result the recommended path for Windows users to mount a persisted
volume is to do so within WSL.
You can find
[instructions for installing WSL](https://learn.microsoft.com/en-us/windows/wsl/install).
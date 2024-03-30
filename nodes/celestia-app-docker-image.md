d
# 🐳 Docker setup

This guide provides instructions on how to use the Celestia `txsim` Docker image.

## Overview of celestia-app txsim

The celestia-app txsim binary is a tool that can be
used to simulate transactions on the Celestia network.
It can be used to test the performance of the Celestia network.
The txsim Docker image is designed to run the txsim binary with a
variety of configurable options.

## Prerequisites

- [Docker Desktop for Mac or Windows](https://docs.docker.com/get-docker) or
[Docker Engine for Linux](https://docs.docker.com/engine/install/)
and a basic understanding of Docker.

- A prefunded account set up with the keyring stored in a file,
to be accessed by an instance of the docker image.

## Quick-Start

1. In your local machine, navigate to the home directory

   ```bash
   cd $HOME
   ```

2. Create a file in which the keyring would be stored.
The file would be mounted as a volume into the docker container.

   ```bash
   touch .celestia-app
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

Congratulations! You have successfully set up celestia-app in Docker 😎

## Flag Breakdown

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

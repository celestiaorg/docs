---
sidebar_label: Local devnet
---

# Running a local Celestia devnet

:::caution Note
This tutorial has only been tested on an AMD machine running Ubuntu 22.10 x64.
:::

This tutorial will teach developers how to easily run a local Celestia devnet
on their own machine (or in the cloud). Running a local devnet for Celestia
to test your rollup is the recommended first step before deploying to a testnet.
This eliminates the need for testnet tokens and deploying to a testnet until
you are ready.

The development journey for your rollup will look something like this:

1. Run your rollup and post DA to a local devnet, and make sure everything works
as expected
2. Deploy the rollup, posting to a DA testnet. Confirm again that everything
is functioning properly
3. Finally, deploy your rollup to the DA Layer's mainnet

Whether you're a developer simply testing things on your laptop or using a
virtual machine in the cloud, this process can be done on any machine of
your choosing. We tested it out on a machine with the following
specs:

- Memory: 1 GB RAM
- CPU: Single Core AMD
- Disk: 25 GB SSD Storage
- OS: Ubuntu 22.10 x64

## Prerequisites

First, you'll need to have Docker installed or [install Docker](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository)
(*Ubuntu version*)

## Run the local devnet

Run the `local-celestia-devnet` by running the following command:

```bash
docker run --platform linux/amd64 -p 26657:26657 -p 26659:26659 ghcr.io/celestiaorg/local-celestia-devnet:main
```

If you'd like to name your container with a custom name, you can use the
`--name` option when first running the `docker run` command, for example:

<!-- markdownlint-disable MD013 -->
```bash
docker run --name custom_name --platform linux/amd64 -p 26657:26657 -p 26659:26659 ghcr.io/celestiaorg/local-celestia-devnet:main
```
<!-- markdownlint-enable MD013 -->

Nice! You have a local Celestia devnet running now.

### Query your balance

Open a new terminal instance. Check the balance on your account that you'll be
using to post blocks to the local network, this will make sure you can post
rollup blocks to your Celestia Devnet for DA & consensus:

```bash
curl -X GET http://0.0.0.0:26659/balance
```

You will see something like this, denoting your balance in TIA x 10^(-6):

```bash
{"denom":"utia","amount":"999995000000000"}
```

If you want to be able to transpose your JSON results into a nicer
format, you can install [`jq`](https://stedolan.github.io/jq/):

```bash
sudo apt install jq
```

Then run this to display in a prettier format:

```bash
curl -X GET http://0.0.0.0:26659/balance | jq
```

Here's what my response was when I wrote this:

```bash
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    43  100    43    0     0   1730      0 --:--:-- --:--:-- --:--:--  1791
{
  "denom": "utia",
  "amount": "999995000000000"
}
```

If you want to clean it up some more, you can use the `-s` option to run `curl`
in silent mode and not print the progress metrics:

```bash
curl -s -X GET http://0.0.0.0:26659/balance | jq
```

Your result will now look like this, nice 🫡

```bash
{
  "denom": "utia",
  "amount": "999995000000000"
}
```

### Start, stop, or remove your container

Find the Container ID that is running by using the command:

```bash
docker ps
```

Then stop the container:

```bash
docker stop CONTAINER_ID_or_NAME
```

You can obtain the container ID or name of a stopped container using the
`docker ps -a` command, which will list all containers (running and stopped)
and their details. For example:

```bash
docker ps -a
```

This will give you an output similar to this:

<!-- markdownlint-disable MD013 -->
```bash
CONTAINER ID   IMAGE                                            COMMAND            CREATED         STATUS         PORTS                                                                                                                         NAMES
d9af68de54e4   ghcr.io/celestiaorg/local-celestia-devnet:main   "/entrypoint.sh"   5 minutes ago   Up 2 minutes   1317/tcp, 9090/tcp, 0.0.0.0:26657->26657/tcp, :::26657->26657/tcp, 26656/tcp, 0.0.0.0:26659->26659/tcp, :::26659->26659/tcp   musing_matsumoto
```
<!-- markdownlint-enable MD013 -->

In this example, you can restart the container using either its container ID
(`d9af68de54e4`) or name (`musing_matsumoto`). To restart the container, run:

```bash
docker start d9af68de54e4
```

or

```bash
docker start musing_matsumoto
```

If you ever would like to remove the container, you can use the `docker rm`
command followed by the container ID or name.

Here is an example:

```bash
docker rm CONTAINER_ID_or_NAME
```

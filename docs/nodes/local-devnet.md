---
sidebar_label: Local Devnet
---

# Running a Local Celestia Devnet

:::caution Note
This tutorial has only been tested on an AMD machine running Ubuntu 22.10 x64.
:::

## Install Docker

[Install Docker](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository) (*Ubuntu version*)

## Run the Local Devnet

Run the `local-celestia-devnet` by running the following command:

```bash
docker run -p 26657:26657 -p 26659:26659 ghcr.io/celestiaorg/local-celestia-devnet:main
```

If you'd like to name your container with a custom name, you can use the `--name` option when first running the `docker run` command, for example:

```bash
docker run --name custom_name -p 26657:26657 -p 26659:26659 ghcr.io/celestiaorg/local-celestia-devnet:main
```

Nice! You have a local Celestia devnet running now.

## Running Local Devnet with a Rollkit Rollup

First, run the `local-celestia-devnet` by running the following command:

```bash
docker run -p 26650:26657 -p 26659:26659 ghcr.io/celestiaorg/local-celestia-devnet:main
```

:::caution Note
The above command is different than the command in the [Run the Local Devnet](#run-the-local-devnet) section.
Port 26657 on the Docker image will be mapped to the local port 26650. This is to avoid clashing ports with
the Rollkit node, as we're running the devnet and node on one machine.
:::

### Query your balance

Open a new terminal instance. Check the balance on your account that you'll be using to post blocks to the
local network, this will make sure you can post rollup blocks to your Celestia Devnet for DA & consensus:

```bash
curl -X GET http://0.0.0.0:26659/balance
```

You will see something like this, denoting your balance in TIA x 10^(-6):

```bash
{"denom":"utia","amount":"999995000000000"}
```

If you want to be able to transpose your JSON results into a nicer format, you can install [`jq`](https://stedolan.github.io/jq/):

```bash
sudo apt install jq
```

:::tip
We'll need `jq` later, so install it!
:::

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

If you want to clean it up some more, you can use the `-s` option to run `curl` in silent mode and not print the progress metrics:

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

You can obtain the container ID or name of a stopped container using the `docker ps -a` command, which will list all containers (running and stopped) and their details. For example:

```bash
docker ps -a
```

This will give you an output similar to this:

```bash
CONTAINER ID   IMAGE                                            COMMAND            CREATED         STATUS         PORTS                                                                                                                         NAMES
d9af68de54e4   ghcr.io/celestiaorg/local-celestia-devnet:main   "/entrypoint.sh"   5 minutes ago   Up 2 minutes   1317/tcp, 9090/tcp, 0.0.0.0:26657->26657/tcp, :::26657->26657/tcp, 26656/tcp, 0.0.0.0:26659->26659/tcp, :::26659->26659/tcp   musing_matsumoto
```

In this example, you can restart the container using either its container ID (`d9af68de54e4`) or name (`musing_matsumoto`). To restart the container, run:

```bash
docker start d9af68de54e4
```

or

```bash
docker start musing_matsumoto
```

If you ever would like to remove the container, you can use the `docker rm` command followed by the container ID or name.

Here is an example:

```bash
docker rm CONTAINER_ID_or_NAME
```

### Scaffold your rollup

Now that you have a Celestia devnet running, you are ready to install Golang. We will use Golang to build and run our Cosmos-SDK blockchain.

[Install Golang](https://docs.celestia.org/nodes/environment#install-golang) (*these commands are for amd64/linux*):

```bash
ver="1.19.1"
cd $HOME
wget "https://golang.org/dl/go$ver.linux-amd64.tar.gz"
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf "go$ver.linux-amd64.tar.gz"
rm "go$ver.linux-amd64.tar.gz"
echo "export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin" >> $HOME/.bash_profile
source $HOME/.bash_profile
go version
```

Now, use the following command to install Ignite CLI:

```bash
curl https://get.ignite.com/cli! | bash
```

:::tip
If you have issues with installation, the full guide can be found [here](https://get.ignite.com/cli) or on [docs.ignite.com](https://docs.ignite.com).
The above command was tested on `amd64/linux`.
:::

Check your version:

```bash
ignite version
```

Scaffold the chain:

```bash
ignite scaffold chain gm
```

Change into the `gm` directory:

```bash
cd gm
```

### Install [Rollkit](https://rollkit.dev/docs/tutorials/gm-world/#installing-rollkit)

```bash
go mod edit -replace github.com/cosmos/cosmos-sdk=github.com/rollkit/cosmos-sdk@v0.46.7-rollkit-v0.6.0-no-fraud-proofs
go mod edit -replace github.com/tendermint/tendermint=github.com/celestiaorg/tendermint@v0.34.22-0.20221202214355-3605c597500d
go mod tidy
go mod download
```

### Start your rollup

Download the `init.sh` script to start the chain:

```bash
# From inside the `gm` directory
cd ..
git clone https://github.com/celestiaorg/devrel-tools
cp devrel-tools/gm/init-local.sh gm/
cd gm/
```

Run the `init-local.sh` script:

```bash
bash init-local.sh
```

This will start your rollup, connected to the local Celestia devnet you have running.

Now let's explore a bit.

#### Keys

List your keys:

```bash
gmd keys list --keyring-backend test
```

#### Transactions

Send a transaction:

```bash
gmd tx bank send cosmos1xwpz06l484xlew98hu74g77wahwatelmz7xm6g cosmos1pgljtq3a549t70zc0fhl4kze2q3r2tllzt8x0y 42069stake --keyring-backend test
```

You'll be prompted to accept the transaction:

```bash
auth_info:
  fee:
    amount: []
    gas_limit: "200000"
    granter: ""
    payer: ""
  signer_infos: []
  tip: null
body:
  extension_options: []
  memo: ""
  messages:
  - '@type': /cosmos.bank.v1beta1.MsgSend
    amount:
    - amount: "42069"
      denom: stake
    from_address: cosmos1xwpz06l484xlew98hu74g77wahwatelmz7xm6g
    to_address: cosmos1pgljtq3a549t70zc0fhl4kze2q3r2tllzt8x0y
  non_critical_extension_options: []
  timeout_height: "0"
signatures: []
confirm transaction before signing and broadcasting [y/N]:
```

Type `y` if you'd like to confirm and sign the transaction. Then, you'll see the confirmation:

```bash
code: 0
codespace: ""
data: ""
events: []
gas_used: "0"
gas_wanted: "0"
height: "0"
info: ""
logs: []
raw_log: '[]'
timestamp: ""
tx: null
txhash: 677CAF6C80B85ACEF6F9EC7906FB3CB021322AAC78B015FA07D5112F2F824BFF
```

#### Balances

Then, query your balance:

```bash
gmd query bank balances cosmos1pgljtq3a549t70zc0fhl4kze2q3r2tllzt8x0y
```

This is the key that received the balance, so it should have increased past the initial `STAKING_AMOUNT`:

```bash
balances:
- amount: "10000000000000000000042069"
  denom: stake
pagination:
  next_key: null
  total: "0"
```

The other key, should have decreased in balance:

```bash
gmd query bank balances cosmos1xwpz06l484xlew98hu74g77wahwatelmz7xm6g
```

Response:

```bash
balances:
- amount: "9999999999999999999957931"
  denom: stake
pagination:
  next_key: null
  total: "0"
```

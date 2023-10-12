# Celestia-node RPC CLI tutorial

<!-- markdownlint-disable MD033 -->

## notes from call to implement still

1. all rpc commands have basic flags

- default rpc address
- auth token\* required OR node store flag
- node store flag\* required OR auth token

at start of tutorial, have user set $NODE_STORE or AUTH_TOKEN and then use those
variables in commands

a) if user passes auth token, creates a client, and we're ready to go
b) if user doesnt pass auth token, check node store flag, create token from
config

get help

```bash
celestia blob submit --help
```

```bash
celestia blob get-all xx xx --node.store $HOME/.celestia-light-network
```

Set log-level when it is running

```bash
celestia node info --node.store...
```

Check your node API version:

```bash
celestia node info --node.store $HOME/.celestia-light-mocha-4/
```

## remainder of old tutorial, with some edits

<script setup>
import { versions } from '/.vitepress/versions/data.js'
</script>

In this tutorial, we will cover how to use the Celestia Node RPC API to submit
and retrieve data (blobs) from the data availability layer by their namespace.

::: details Table of contents

[[toc]]

:::

::: tip
View
[a video tutorial for setting up a Celestia light node](../developers/light-node-video).
:::

::: warning
The gateway endpoints have been deprecated and will be removed in the future.
If you would like to use them anyway, you can
[find more details on GitHub](https://github.com/celestiaorg/celestia-node/pull/2360).
:::

## Introduction

### Blobs

Data is posted to Celestia's DA layer by using `MsgPayForBlobs`
transactions to the core network. Read
[more about `MsgPayForBlobs`](https://github.com/celestiaorg/celestia-app/blob/main/x/blob/README.md#messages).

### Namespaces

Celestia partitions the block data into
multiple namespaces, one for every application. This allows applications
to only download their data, and not the data of other applications.
Read
[more about Namespaced Merkle Trees (NMTs)](../../learn/how-celestia-works/data-availability-layer/#namespaced-merkle-trees-nmts).

:::tip
If you already have a running and funded node,
you can skip to the [RPC CLI guide section](#rpc-cli-guide).
:::

## Hardware requirements

The following minimum hardware requirements are recommended for running a
light node:

- Memory: **2 GB RAM**
- CPU: **Single Core**
- Disk: **25 GB SSD Storage**
- Bandwidth: **56 Kbps for Download/56 Kbps for Upload**

## Setting up dependencies

In your terminal, set up dependencies needed to install and build
`celestia-node`.

1. If you are on Ubuntu, update and upgrade your OS:

::: code-group

```bash [APT]
sudo apt update && sudo apt upgrade -y
```

```bash [YUM]
sudo yum update
```

:::

<!-- markdownlint-disable MD029 -->

2. Install essential packages that are necessary to execute many tasks like
   downloading files, compiling, and monitoring the node:

::: code-group

```bash [APT]
sudo apt install curl tar wget clang pkg-config libssl-dev jq build-essential \
  git make ncdu -y
```

```bash [YUM]
sudo yum install curl tar wget clang pkg-config libssl-dev jq build-essential \
  git make ncdu -y
```

```bash [Mac]
# these commands are for installing Homebrew, wget and jq
# follow the instructions from the output after running this command
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# then install wget & jq
brew install wget && brew install jq
```

:::

## Install Golang

`celestia-node` is written in Golang so we must install Golang to build
and run our node.

1. Set the version for your desired network:

::: code-group

```bash-vue [Coffee]
ver="{{versions.golang.golangNodeCoffee}}"
```

```bash-vue [Mocha]
ver="{{versions.golang.golangNodeMocha}}"
```

```bash-vue [Arabica]
ver="{{versions.golang.golangNodeArabica}}"
```

:::

2. Download and install Golang:

::: code-group

```bash-vue [Ubuntu (AMD)]
cd $HOME
wget "https://golang.org/dl/go$ver.linux-amd64.tar.gz"
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf "go$ver.linux-amd64.tar.gz"
rm "go$ver.linux-amd64.tar.gz"
```

```bash-vue [Ubuntu (ARM)]
cd $HOME
wget "https://golang.org/dl/go$ver.linux-arm64.tar.gz"
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf "go$ver.linux-arm64.tar.gz"
rm "go$ver.linux-arm64.tar.gz"
```

```bash-vue [Mac (Apple)]
cd $HOME
wget "https://golang.org/dl/go$ver.darwin-arm64.tar.gz"
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf "go$ver.darwin-arm64.tar.gz"
rm "go$ver.darwin-arm64.tar.gz"
```

```bash-vue [Mac (Intel)]
cd $HOME
wget "https://golang.org/dl/go$ver.darwin-amd64.tar.gz"
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf "go$ver.darwin-amd64.tar.gz"
rm "go$ver.darwin-amd64.tar.gz"
```

:::

3. Add your `/usr/local/go/bin` directory to
   your `$PATH` if you have not already:

::: code-group

```bash [bash]
echo "export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

```bash [zsh]
echo "export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin" >> $HOME/.zshrc
source $HOME/.zshrc
```

:::

4. To verify that the correct version of Go was installed correctly run:

```bash
go version
```

The output will show the version installed.

## Celestia-node

### Install celestia-node

Installing `celestia-node` for Coffee, Arabica devnet, or Mocha testnet
means installing a specific version to be compatible with the
network.

Install the `celestia-node` binary by running the following
commands:

1. Remove any existing copy of `celestia-node`, clone the repository,
   and change into the directory.

```bash
cd $HOME
rm -rf celestia-node
git clone https://github.com/celestiaorg/celestia-node.git
cd celestia-node/
```

2. Check out to the desired version, based on the network you will use:

::: code-group

```bash-vue [Coffee]
git checkout tags/{{versions.nodeTag.nodeTagCoffee}}
```

```bash-vue [Mocha]
git checkout tags/{{versions.nodeTag.nodeTagMocha}}
```

```bash-vue [Arabica]
git checkout tags/{{versions.nodeTag.nodeTagArabica}}
```

:::

3. Build the `celestia` binary:

```bash
make build
```

4. Install the binary:

::: code-group

```bash [Ubuntu]
make install
```

```bash [Mac]
make go-install
```

:::

5. Build the `cel-key` utility:

```bash
make cel-key
```

6. Verify that the binary is working and check the version:

```bash
celestia version
```

The output will show the semantic version of `celestia-node`,
commit hash, build date, system version, and Golang version.

### Instantiate a Celestia light node

Now, let's instantiate a Celestia Light node:

::: tip
RPC Endpoints are exposed in all celestia-node types such as light, bridge and
full nodes.
:::

::: code-group

```bash [Coffee]
celestia light init
```

```bash [Mocha]
celestia light init --p2p.network mocha
```

```bash [Arabica]
celestia light init --p2p.network arabica
```

:::

Instantiating (or initializing) the node means setting up
a node store on your machine. This is where the data and
your keys will be stored.

### Connect to a public core endpoint

Let's now run the Celestia Light node with a gRPC connection
to an example public core endpoint.

Note: You are also encouraged to find a community-run API endpoint
and there are several in the Discord. This one is used for demonstration
purposes. Check out the
[list of RPC endpoints on the Coffee page](../../nodes/coffee#rpc-endpoints),
[Mocha testnet page](../../nodes/mocha-testnet#rpc-endpoints),
or [Arabica devnet page](../../nodes/arabica-devnet#rpc-endpoints).

::: code-group

```bash [Coffee]
celestia light start --core.ip <ip-address>
```

```bash [Mocha]
celestia light start --core.ip <ip-address> --p2p.network mocha
```

```bash [Arabica]
celestia light start --core.ip <ip-address> --p2p.network arabica
```

:::

:::tip
The `--core.ip` gRPC port defaults to 9090,
so if you do not specify it in the command
line, it will default to that port. You can
add the port after the IP address or use the
`--core.grpc.port` flag to specify another
port if you prefer.

Refer to
[the ports section of the celestia-node troubleshooting page](../../nodes/celestia-node-troubleshooting/#ports)
for information on which ports are required to be open on your machine.
:::

For example, your command along with an RPC endpoint might
look like this:

::: code-group

```bash [Coffee]
celestia light start --core.ip coffee.pops.one
```

```bash [Mocha]
celestia light start --core.ip rpc-mocha.pops.one --p2p.network mocha
```

```bash[Arabica]
celestia light start --core.ip consensus-full.celestia-arabica-10.com \
  --p2p.network arabica
```

:::

### Keys and wallets

You can create your key for your node by running the following
command from the `celestia-node` directory:

```bash
./cel-key add <key_name> --keyring-backend test --node.type light \
  --p2p.network <network>
```

You can start your light node with the key created by running
the following command:

::: code-group

```bash [Coffee]
celestia light start --core.ip <ip-address> --keyring.accname <key_name>
```

```bash [Mocha]
celestia light start --core.ip <ip-address> --keyring.accname <key_name> \
  --p2p.network mocha
```

```bash [Arabica]
celestia light start --core.ip <ip-address> --keyring.accname <key_name> \
  --p2p.network arabica
```

:::

Once you start the light node, a wallet key will be generated
for you. You will need to fund that address with Mocha testnet
or Arabica devnet tokens to pay for `PayForBlobs` transactions.

You can find the address by running the following command in
the `celestia-node` directory:

```bash
./cel-key list --node.type light --keyring-backend test --p2p.network <network>
```

If you would like to fund your wallet with testnet tokens, head over
to either the `#mocha-faucet` or `#arabica-faucet` channels on the
[Celestia Discord](https://discord.gg/celestiacommunity).

You can request funds to your wallet address using the following command in
Discord:

```discord
$request <wallet-address>
```

Where `<wallet-address>` is the `celestia1******` address generated
when you created the wallet.

With your wallet funded, you can move on to the next step.

## RPC CLI guide

This section of the tutorial will teach you how to interact with a
Celestia node's
[RPC (Remote Procedure Call) API](https://node-rpc-docs.celestia.org/).

First, you will need to
[install and run `celestia-node`](#setting-up-dependencies) if
you have not already. Open up another terminal window in order to begin
querying the API.

The Celestia Node CLI (Command Line Interface)
allows you to interact with the node's RPC API via
your terminal.

The format for RPC calls are as follows:

```bash
celestia [module] [method] [...args]
```

:::tip
The `blob` module is the only module that uses kebab-case for
its methods. The other modules use camelCase.
:::

### Setup

#### Auth token 🔐

In order to interact with the API using RPC CLI,
you will need to set your authentication token or node store.

The `--auth TOKEN` flag sets the authentication token,
otherwise it will read from the environment's
`CELESTIA_NODE_AUTH_TOKEN` variable.
If a token is not found, authentication will not be set.
And if authentication is not set, the request will fail.

To set your authentication token, you can use the
following command. Be sure to replace `<node-type>` with
the type of node and `<network>`
with the network that you are running your node on:

```bash

```

Here's an example of how to set your auth token on a light node on Arabica:

```bash

```

##### Auth token on custom or private network

This section is for users who are using a `CELESTIA_CUSTOM` or private network.

:::tip
If you are using a private and custom network, you will **need to set
the location of the node store in your auth command.**
:::

```bash
--node.store $HOME/.celestia-light-private)
```

The above is an example from the following custom network set up with:

```bash
CELESTIA_CUSTOM=private celestia light init
```

or

```bash
celestia light init --p2p.network private
```

As an example, this is what a completely custom network would look like:

```bash
# Initialize node store
CELESTIA_CUSTOM=robusta-22 celestia light init

# Set auth token
export CELESTIA_NODE_AUTH_TOKEN=$(celestia light auth admin --p2p.network \
  private --node.store $HOME/.celestia-light-robusta-22)
```

#### Host URL

The `--host URL` flag sets the host address,
the default is `localhost:26658` over HTTP.

<!-- #### Completions

If you would like to turn on completions for the Celestia Node CLI `rpc`
subcommand, you can use the following command and follow the instructions
in the CLI:

```bash
# pick your shell type from the array
celestia completion [bash | fish | powershell | zsh]
```

If you'd like to see the help menu for your shell, you can then run:

```bash
# pick your shell type from the array
celestia completion [bash | fish | powershell | zsh] --help
``` -->

### Submitting data

In this example, we will be submitting a `PayForBlobs`
transaction using our light node.

Some things to consider:

- PFB is a `PayForBlobs` Message.
- The endpoint also takes in `namespace_id` and `data` values.
- Namespace ID should be 10 bytes, prefixed by `0x`
- Data should be in hex-encoded bytes of the raw message

We use the following `namespace_id` of `0x42690c204d39600fddd3` and
the `data` value of `0xf1f20ca8007e910a3bf8b2e61da0f26bca07ef78717a6ea54165f5`.

You can generate your own `namespace_id` and data values using this
useful [Golang Playground we created](https://go.dev/play/p/7ltvaj8lhRl).

Here is an example of the format of the `PayForBlobs` transaction:

```bash
celestia blob submit [namespace in hex] [data in hex] \
  [optional: fee] [optional: gasLimit] [node store flag or auth token]
```

We run the following to submit a blob to the network in hexadecimal format:

```bash
celestia blob submit 0x42690c204d39600fddd3 0xf1f20ca8007e910a3bf8b2e61da0f26bca07ef78717a6ea54165f5
```

We get the following output:

```json
{
  "result": {
    "uint64": 219832,
    "commitment": "t7sRPeQVT3jEMlDnhDVU6jxB/FNhhyl6b6wl3+0ENZ0="
  }
}
```

We can also use a string of text as the data value, which will be
converted to base64. Here is an example of the format:

```bash
celestia blob submit [namespace in hex] '[data]' \
  [optional: fee] [optional: gasLimit] [node store flag or auth token]
```

And an example to submit "gm" as the plain-text data:

```bash
celestia blob submit 0x42690c204d39600fddd3 'gm' --node.store $HOME/.celestia-light-mocha-4/
```

Output:

```json
{
  "result": {
    "uint64": 219832,
    "commitment": "IXg+08HV5RsPF3Lle8PH+B2TUGsGUsBiseflxh6wB5E="
  }
}
```

If you notice from the above output, it returns a `result` of
`272667` which we will use for the next command. The `result`
corresponds to the height of the block in which the transaction
was included.

#### `submit` arguments

Using the `rpc` subcommand, you can submit a blob to the network
using the `submit` method.

The arguments for `submit` are parsed specially,
to improve UX.

`submit` can be done in a few ways:

- The **namespace ID** can be encoded as either hex or base64
- The **blob** can be hex (`0x...`), base64 (`"..."`), or a normal
  string which will be encoded to base64 (`'Hello There!'`)

### Retrieving data

After submitting your PFB transaction, upon success, the node will return
the block height for which the PFB transaction was included. You can then
use that block height and the namespace ID with which you submitted your
PFB transaction to get your message shares (data) returned to you. In this
example, the block height we got was 219832 which we will use for the following
command. Read more about shares in the
[Celestia Specs](https://celestiaorg.github.io/celestia-app/specs/shares.html).

Here is what an example of the format of the `get` command looks like:

```bash
celestia blob get [block height] [namespace in hex] \
  [commitment from output above] [node store or auth]
```

Here is an example command to retrieve the data from above, on `arabica-10`:

<!-- markdownlint-disable MD013 -->

```bash
celestia blob get 221302 0x42690c204d39600fddd3 IXg+08HV5RsPF3Lle8PH+B2TUGsGUsBiseflxh6wB5E= --node.store $HOME/.celestia-light-mocha-4/
```

Will generate the following output:

```json
{
  "result": {
    "namespace": "AAAAAAAAAAAAAAAAAAAAAAAAAEJpDCBNOWAP3dM=",
    "data": "gm",
    "share_version": 0,
    "commitment": "IXg+08HV5RsPF3Lle8PH+B2TUGsGUsBiseflxh6wB5E="
  }
}
```

The output here is base64 decoded to plain-text.

To see the base64 response, use the `--base64` flag set to `TRUE`
(`--base64=TRUE`):

```bash
celestia blob get 219832 0x42690c204d39600fddd3 \
  IXg+08HV5RsPF3Lle8PH+B2TUGsGUsBiseflxh6wB5E= --base64=TRUE
```

<!-- markdownlint-enable MD013 -->

The response will look similar to this:

```json
{
  "result": {
    "namespace": "AAAAAAAAAAAAAAAAAAAAAAAAAEJpDCBNOWAP3dM=",
    "data": "Z20=",
    "share_version": 0,
    "commitment": "IXg+08HV5RsPF3Lle8PH+B2TUGsGUsBiseflxh6wB5E="
  }
}
```

To get all blobs in the namespace at the block height, use `get-all` instead
of `get`:

```bash
celestia blob get-all 219832 0x42690c204d39600fddd3
```

This will return the following:

```json
{
  "result": [
    {
      "namespace": "AAAAAAAAAAAAAAAAAAAAAAAAAEJpDCBNOWAP3dM=",
      "data": "gm",
      "share_version": 0,
      "commitment": "IXg+08HV5RsPF3Lle8PH+B2TUGsGUsBiseflxh6wB5E="
    }
  ]
}
```

To display the response in base64, use:

```bash
celestia blob get-all 219832 0x42690c204d39600fddd3 --base64=TRUE
```

Which will return:

```json
{
  "result": [
    {
      "namespace": "AAAAAAAAAAAAAAAAAAAAAAAAAEJpDCBNOWAP3dM=",
      "data": "gm",
      "share_version": 0,
      "commitment": "IXg+08HV5RsPF3Lle8PH+B2TUGsGUsBiseflxh6wB5E="
    }
  ]
}
```

### Setting the gas fee and limit

:::tip

These flags are only currently live on celestia-node versions v0.11.0-rc13 and
higher. They are also **optional** to use with `blob.submit`.

:::

To set the gas fee and limit, you can use the `--fee` and `--gas.limit` flags
respectively when submitting data using the RPC CLI.

Learn [more about gas fees and limits](../../developers/submit-data).

To set the fee of 10000 utia, use the `--fee 10000` flag:

```bash
celestia blob submit 0x42690c204d39600fddd3 'gm' --fee 10000
```

To set a gas limit of 100000, use the `--gas.limit 100000` flag:

```bash
celestia blob submit 0x42690c204d39600fddd3 'gm' --gas.limit 100000
```

To set a fee of 10000 utia and gas limit of 100000, use the
`--fee 10000 --gas.limit 100000` flags:

```bash
celestia blob submit 0x42690c204d39600fddd3 'gm' --fee 10000 --gas.limit 100000
```

You will receive the height and commitment of the block in which the
transaction was included for these three examples:

```json
{
  "result": {
    "height": 62562,
    "commitment": "IXg+08HV5RsPF3Lle8PH+B2TUGsGUsBiseflxh6wB5E="
  }
}
```

### Examples

#### Check your balance

Let's query our node for the balance of its default account
(which is the account associated with the `CELESTIA_NODE_AUTH_TOKEN`
key we generated above):

```bash
celestia state balance
```

The response will look similar to:

```json
{
  "jsonrpc": "2.0",
  "result": {
    "denom": "utia",
    "amount": "172118057"
  },
  "id": 1
}
```

#### Check the balance of another address

Here is an example of the format of the `balance-for-address` command:

```bash
celestia state balance-for-address [address]
```

Let's query our node for the balance of another address:

<!-- markdownlint-disable MD013 -->

```bash
celestia state balance-for-address celestia10rtd9lhel2cuh6c659l25yncl6atcyt37umard
```

<!-- markdownlint-enable MD013 -->

The response will be the balance of the address you queried:

```json
{
  "jsonrpc": "2.0",
  "result": {
    "denom": "utia",
    "amount": "1000000"
  },
  "id": 1
}
```

#### Get your node ID

This is an RPC call in order to get your node's peerId information:

```bash
celestia p2p Info
```

The node ID is in the `ID` value from the response:

```json
{
  "jsonrpc": "2.0",
  "result": {
    "ID": "12D3KooWFFhCaAqY56oEqY3pLZUdLsv4RYAfVWKATZRepUPdosLp",
    "Addrs": [
      "/ip4/10.0.0.171/tcp/2121",
      "/ip4/10.0.0.171/udp/2121/quic-v1",
      "/ip4/71.200.65.106/tcp/25630",
      "/ip4/71.200.65.106/udp/25630/quic-v1",
      "/ip6/::1/tcp/2121",
      "/ip6/::1/udp/2121/quic-v1"
    ]
  },
  "id": 1
}
```

#### Get your account address

This is an RPC call in order to get your node's account address:

```bash
celestia state account-address
```

Response:

```json
{
  "jsonrpc": "2.0",
  "result": "celestia1znk24rh52pgcd9z5x2x42jztjh6raaaphuvrt3",
  "id": 1
}
```

#### Get block header by height

Here is an example of the format of the `GetByHeight` command:

```bash
celestia header get-by-height [height]
```

Now, let's get the block header information.

Here we will get the header from Block 1:

```bash
celestia rpc header get-by-height 1
```

It will output something like this:

<!-- markdownlint-disable MD013 -->

```json
{
  "jsonrpc": "2.0",
  "result": {
    "header": {
      "version": {
        "block": "11",
        "app": "1"
      },
      "chain_id": "arabica-10",
      "height": "1",
      "time": "2023-06-27T13:02:39.741743Z",
      "last_block_id": {
        "hash": "",
        "parts": {
          "total": 0,
          "hash": ""
        }
      },
      "last_commit_hash": "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
      "data_hash": "3D96B7D238E7E0456F6AF8E7CDF0A67BD6CF9C2089ECB559C659DCAA1F880353",
      "validators_hash": "6363C68770C200FD794445668F9B18F5B1DD1125180D6E8D5AB004F7DD7A0F48",
      "next_validators_hash": "6363C68770C200FD794445668F9B18F5B1DD1125180D6E8D5AB004F7DD7A0F48",
      "consensus_hash": "048091BC7DDC283F77BFBF91D73C44DA58C3DF8A9CBC867405D8B7F3DAADA22F",
      "app_hash": "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
      "last_results_hash": "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
      "evidence_hash": "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
      "proposer_address": "91E04695CF9CF531BC0891E7B1D602B3E8022C86"
    },
    "validator_set": {
      "validators": [
        {
          "address": "91E04695CF9CF531BC0891E7B1D602B3E8022C86",
          "pub_key": {
            "type": "tendermint/PubKeyEd25519",
            "value": "9aNBAxno1B4X5LR2qY5qWqwrMNOzejkctXwzq9BExsg="
          },
          "voting_power": "500000000",
          "proposer_priority": "0"
        }
      ],
      "proposer": {
        "address": "91E04695CF9CF531BC0891E7B1D602B3E8022C86",
        "pub_key": {
          "type": "tendermint/PubKeyEd25519",
          "value": "9aNBAxno1B4X5LR2qY5qWqwrMNOzejkctXwzq9BExsg="
        },
        "voting_power": "500000000",
        "proposer_priority": "0"
      }
    },
    "commit": {
      "height": 1,
      "round": 0,
      "block_id": {
        "hash": "7A5FABB19713D732D967B1DA84FA0DF5E87A7B62302D783F78743E216C1A3550",
        "parts": {
          "total": 1,
          "hash": "D85C907CE660878A8203AC74BAA147CCC1F87114B45B568B72AD207B62AFE45E"
        }
      },
      "signatures": [
        {
          "block_id_flag": 2,
          "validator_address": "91E04695CF9CF531BC0891E7B1D602B3E8022C86",
          "timestamp": "2023-06-30T08:40:19.299137127Z",
          "signature": "qmaEzrnbtgEXCRYc8pCvGRbS+uMuknIBoRAE4qyE7oSgWCRwBVYS/oPReXQLg9ER1oEY1De4MkWvMjlFnQOOCg=="
        }
      ]
    },
    "dah": {
      "row_roots": [
        "//////////////////////////////////////7//////////////////////////////////////huZWOTTDmD36N1F75A9BshxNlRasCnNpQiWqIhdVHcU",
        "/////////////////////////////////////////////////////////////////////////////5iieeroHBMfF+sER3JpvROIeEJZjbY+TRE0ntADQLL3"
      ],
      "column_roots": [
        "//////////////////////////////////////7//////////////////////////////////////huZWOTTDmD36N1F75A9BshxNlRasCnNpQiWqIhdVHcU",
        "/////////////////////////////////////////////////////////////////////////////5iieeroHBMfF+sER3JpvROIeEJZjbY+TRE0ntADQLL3"
      ]
    }
  },
  "id": 1
}
```

<!-- markdownlint-enable MD013 -->

### More examples

#### Combined commands

```bash
celestia share get-by-namespace "$(celestia header get-by-height 147105 \
  --node.store  $NODE_STORE | jq '.result.dah' -r)" 0x42690c204d39600fddd3 \
  --node.store $NODE_STORE
```

#### Query node information

```bash
celestia rpc node info
```

#### Get data availability sampler stats

```bash
celestia rpc das sampling-stats
```

#### Transfer balance of utia to another account

First, set your address as a variable:

```bash
export ADDRESS=celestia1c425ckmve2489atttx022qpc02gxspa29wmh0d
```

Then, transfer the amount of tokens that you would like, while setting the
recipient's address, gas fee, and gasLimit. This is what the format will look like:

```bash
celestia state transfer $ADDRESS [amount in utia] \
  [gas fee in utia] [gas fee in utia]
```

Here is an example, sending 0.1 TIA, with a gas fee of 0.008 TIA, and a gas
limit of 0.08 TIA:

```bash
celestia state transfer $ADDRESS 100000 8000 80000
```

If you'd just like to return the transaction hash, you can use jq:

```bash
celestia state transfer $ADDRESS 100000 8000 80000 | jq .result.txhash
```

## Additional resources

### Post an SVG as a PFB

If you'd like to create your own SVG, post it to Celestia, and retrieve it,
you can check out the [Base64 SVG Tutorial](https://based64.xyz/).

### Golang guide

If you're interested in interacting with the node's API in Go
([`client.go`](https://github.com/celestiaorg/celestia-node/blob/main/api/rpc/client/client.go)),
you can use the [da-rpc-client-tutorial](https://github.com/renaynay/da-rpc-client-tutorial)
repo.

### Troubleshooting

If you encounter an error like:

<!-- markdownlint-disable MD013 -->

```sh
"rpc error: code = NotFound desc = account celestia1krkle0n547u0znz3unnln8paft2dq4z3rznv86 not found"
```

<!-- markdownlint-enable MD013 -->

It is possible that the account you are trying to submit a `PayForBlobs` from
doesn't have testnet tokens yet. Ensure the testnet faucet has funded your
account with tokens and then try again.

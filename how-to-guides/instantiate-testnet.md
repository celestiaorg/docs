---
description: A guide that helps you instantiate a new testnetwork with Celestia App.
---

# Celestia App network instantiation guide

This guide is for helping instantiate a new testnetwork and following the
correct steps to do so with Celestia App. You should only follow this guide
if you want to experiment with your own Celestia test network (testnet)
or if you want to test out new features to build as a core developer.

## Hardware requirements

You will need to
[follow hardware requirements](./validator-node.md#hardware-requirements).

## Setup dependencies

You will need to
[setup dependencies by following the guide](./environment.md).

## celestia-app installation

You will need to
[install `celestia-app` by following the guide](./celestia-app.md).

## Spin up a Celestia testnet

If you want to spin up a quick testnet with your friends, you can follow these steps.
Unless otherwise noted, every step must be done by everyone who wants to
participate in this testnet.

### Optional: Reset working directory

If you have already initialized a working directory for `celestia-appd` in the past,
you must clean up before reinitializing a new directory. You can do so by running
the following command:

```sh
celestia-appd tendermint unsafe-reset-all --home $HOME/.celestia-app
```

### Initialize a working directory

Run the following command:

```sh
VALIDATOR_NAME=validator1
CHAIN_ID=testnet
celestia-appd init $VALIDATOR_NAME --chain-id $CHAIN_ID
```

- The value we will use for `$VALIDATOR_NAME` is `validator1` but you should choose
  your own node name.
- The value we will use for `$CHAIN_ID` is `testnet`. The `$CHAIN_ID` must
  remain the same for everyone participating in this network.

### Create a new key

Next, run the following command:

```sh
KEY_NAME=validator
celestia-appd keys add $KEY_NAME --keyring-backend test
```

This will create a new key, with a name of your choosing.
Save the output of this command somewhere; you'll need
the address generated here later. Here, we set the value of our
key `$KEY_NAME` to `validator` for demonstration.

### Add genesis account KeyName

Run the following command:

```sh
TIA_AMOUNT="10000000utia"
celestia-appd add-genesis-account $KEY_NAME $TIA_AMOUNT --keyring-backend test
```

Here `$KEY_NAME` is the same key name as before.

### Optional: Adding other validators

If other participants in your testnet also want to be validators,
repeat the command above with the specific amount for their public keys.

Once all the validators are added, the `genesis.json` file is created. You need
to share it with all other validators in your testnet in order for everyone to
proceed with the following step.

You can find the `genesis.json` at `$HOME/.celestia-app/config/genesis.json`

### Create the genesis transaction for new chain

Run the following command:

```sh
STAKING_AMOUNT=9000000utia
celestia-appd gentx $KEY_NAME $STAKING_AMOUNT --chain-id $CHAIN_ID \
  --keyring-backend test
```

This will create the genesis transaction for your new chain.
Here `$STAKING_AMOUNT` should be at least `9000000utia`. If you
provide too much or too little, you will encounter an error
when starting your node.

You will find the generated gentx JSON file inside `$HOME/.celestia-app/config/gentx/gentx-$KEY_NAME.json`

:::tip NOTE
If you have other validators in your network, they need to also
run the above command with the `genesis.json` file you shared with
them in the previous step.
:::

### Creating the genesis JSON file

Once all participants have submitted their gentx JSON files to you,
you will pull all those gentx files inside the following directory:
`$HOME/.celestia-appd/config/gentx` and use them to create the final
`genesis.json` file.

Once you added the gentx files of all the participants, run the following command:

```sh
celestia-appd collect-gentxs
```

This command will look for the gentx files in this repo which should
be moved to the following directory `$HOME/.celestia-app/config/gentx`.

It will update the `genesis.json` file after in this location
`$HOME/.celestia-app/config/genesis.json` which now includes the gentx
of other participants.

You should then share this final `genesis.json` file with all the
other participants who must add it to their `$HOME/.celestia-app/config` directory.

Everyone must ensure that they replace their existing `genesis.json` file with
this new one created.

### Modify your config file

Open the following file `$HOME/.celestia-app/config/config.toml` to modify it.

Inside the file, add the other participants by modifying the following line to
include other participants as persistent peers:

```text
# Comma separated list of nodes to keep persistent connections to
persistent_peers = "[validator_address]@[ip_address]:[port],[validator_address]@[ip_address]:[port]"
```

### Add your node as a persistent peer

The following allows you to share your node as a persistent peer
that you can share in the networks repo or with others so other
participants can peer with you.

Run the following command:

```sh
IP_ADDRESS=$(curl ifconfig.me)
NODE_ID=$(celestia-appd tendermint show-node-id)
PORT_NUMBER=26656
```

Note that the default port is `26656`

Now you can run the following command to output your validator node address:

```sh
PEER="$NODE_ID@$IP_ADDRESS:$PORT_NUMBER"
echo $PEER
```

The output is your validator node address which you can share with other validators
so they can peer with you.

### Instantiate the network

You can start your node by running the following command:

```sh
celestia-appd start
```

:::tip
Refer to
[the ports section of the celestia-node troubleshooting page](../how-to-guides/celestia-node-troubleshooting.md#ports)
for information on which ports are required to be open on your machine.

:::

Now you have a new Celestia testnet to play around with!

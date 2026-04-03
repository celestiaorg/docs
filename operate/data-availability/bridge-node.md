# Setting up a Celestia bridge node

This tutorial will go over the steps to set up your Celestia bridge node.

Bridge nodes connect the data availability layer and the consensus layer.

## Overview of bridge nodes

A Celestia bridge node has the following properties:

1. Import and process “raw” headers & blocks from a trusted core process
   (meaning a trusted RPC connection to a consensus node) in the
   Consensus network. Bridge nodes can run this core process internally
   (embedded) or simply connect to a remote endpoint. Bridge nodes also
   have the option of being an active validator in the consensus network.
2. Validate and erasure code the “raw” blocks
3. Supply block shares with data availability headers to light nodes in the DA network.

![bridge-node-diagram](/img/nodes/BridgeNodes.png)

From an implementation perspective, Bridge nodes run two separate processes:

1. celestia-app with celestia-core
   ([see repo](https://github.com/celestiaorg/celestia-app))

   - **celestia-app** is the state machine where the application and the
     proof-of-stake logic is run. celestia-app is built on
     [Cosmos SDK](https://docs.cosmos.network) and also encompasses
     **celestia-core**.
   - **celestia-core** is the state interaction, consensus and block production
     layer. celestia-core is built on [Tendermint Core](https://docs.tendermint.com),
     modified to store data roots of erasure coded blocks among other changes
     ([see ADRs](https://github.com/celestiaorg/celestia-core/tree/master/docs/celestia-architecture)).

2. celestia-node ([see repo](https://github.com/celestiaorg/celestia-node))

   - **celestia-node** augments the above with a separate libp2p network that
     serves data availability sampling requests. The team sometimes refers to
     this as the “halo” network.

## Hardware requirements

See [hardware requirements](/operate/getting-started/hardware-requirements).

## Setting up your bridge node

The following tutorial is done on an Ubuntu Linux 20.04 (LTS) x64 instance machine.

Deploy the Celestia bridge node with the following steps.

You can create your key for your node by [following the `cel-key` instructions](/operate/keys-wallets/celestia-node-key).

Once you start the bridge node, a wallet key will be generated for you.
You will need to fund that address with Testnet tokens to pay for
`PayForBlob` transactions.
You can find the address by running the following command:

```sh
./cel-key list --node.type bridge --keyring-backend test --p2p.network <network>
```

You can get testnet tokens from:

- [Mocha](/operate/networks/mocha-testnet)
- [Arabica](/operate/networks/arabica-devnet)

> **Note:** If you are running a bridge node for your validator, it is highly recommended to request Mocha testnet tokens as this is the testnet used to test out validator operations.

#### Optional: run the bridge node with a custom key

In order to run a bridge node using a custom key:

1. The custom key must exist inside the celestia bridge node directory at the
   correct path (default: `~/.celestia-bridge/keys/keyring-test`)
2. The name of the custom key must be passed upon `start`, like so:

#### Optional: Migrate node id to another server

To migrate a bridge node ID:

1. You need to back up two files located in the celestia-bridge node directory at the correct path (default: `~/.celestia-bridge/keys`).
2. Upload the files to the new server and start the node.

### Optional: start the bridge node with SystemD

Follow the
[tutorial on setting up the bridge node as a background process with SystemD](/operate/maintenance/systemd).

You have successfully set up a bridge node that is syncing with the network.

### Optional: enable on-fly compression with ZFS

Follow the
[tutorial on how to set up your DA node to use on-fly compression with ZFS](/operate/data-availability/storage-optimization).
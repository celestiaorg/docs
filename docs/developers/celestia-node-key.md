---
sidebar_label: Wallet with Celestia Node
---

# Create A Wallet with Celestia Node

This tutorial will go over using the `cel-key` utility
to generate a wallet on Celestia Node.

While this tutorial will go over installation process
of `cel-key`, it is recommended that you complete
the following prerequisites first:

* [Setting Up Your Environment](../nodes/environment)

Once you completed the prerequisite, you can proceed with this
tutorial.

## Using the cel-key utility

Inside the celestia-node repository is a utility called `cel-key` that uses
the key utility provided by Cosmos-SDK under the hood. The utility can be
used to `add`, `delete`, and manage keys for any DA node
type `(bridge || full || light)`, or just keys in general.

## Installation

You need to first pull down the `celestia-node` repository:

```sh
git clone https://github.com/celestiaorg/celestia-node.git
cd celestia-node/
```

It can be built using either of the following commands:

```sh
# dumps binary in current working directory, accessible via `./cel-key`
make cel-key
```

For the purpose of this guide, we will use the `make cel-key` command.

## Generating Bridge Node Keys

To generate a key for a Celestia bridge node, do the following:

```sh
./cel-key add <key_name> --keyring-backend test --node.type bridge
```

This will load the key <key_name> into the directory of the bridge node.

## Generating Full Storage Node Keys

To generate a key for a Celestia full node, do the following:

```sh
./cel-key add <key_name> --keyring-backend test --node.type full
```

This will load the key <key_name> into the directory of the full node.

## Generating Light Node Keys

To generate a key for a Celestia light node, do the following:

```sh
./cel-key add <key_name> --keyring-backend test --node.type light
```

This will load the key <key_name> into the directory of the light node.

## Exporting Your Keys

You can export a private key from the local keyring in encrypted and
ASCII-armored format.

In this command, we demonstrate how to export your key for a light node.

```sh
./cel-key export <key-name> --keyring-backend test --node.type light
```

You can then import your key with `celestia-appd`:

```sh
celestia-appd keys import <new-key-name> <key-file-location>
```

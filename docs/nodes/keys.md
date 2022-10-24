---
sidebar_label: Keys
---

# Using the cel-key utility

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

or

```sh
# installs binary in GOBIN path, accessible via `cel-key`
make install-key
```

For the purpose of this guide, we will use the `make cel-key` command.

## Steps for generating **bridge** node keys

To generate a key for a Celestia bridge node, do the following:

```sh
./cel-key add <key_name> --keyring-backend test --node.type bridge
```

This will load the key <key_name> into the directory of the bridge node.

## Steps for generating **full** node keys

To generate a key for a Celestia full node, do the following:

```sh
./cel-key add <key_name> --keyring-backend test --node.type full
```

This will load the key <key_name> into the directory of the full node.

## Steps for generating **light** node keys

To generate a key for a Celestia light node, do the following:

```sh
./cel-key add <key_name> --keyring-backend test --node.type light
```

This will load the key <key_name> into the directory of the light node.

## Steps for exporting **light** node keys

You can export a private key from the local keyring in encrypted and
 ASCII-armored format.

```sh
./cel-key export <key-name> --keyring-backend test --node.type light
```

You can then import your key with `celestia-appd`:

```sh
celestia-appd keys import <new-key-name> <key-file-location>
```

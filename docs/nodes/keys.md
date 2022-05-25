# Using the Cel-Key Utility

Inside the celestia-node repository is a utility called `cel-key` that uses
the key utility provided by Cosmos-SDK under the hood. The utility can be
used to `add`, `delete`, and manage keys for any DA node
type `(bridge || full || light)`, or just keys in general.

## Installation

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

To generate a key for a celestia bridge node, do the following:

```sh
./cel-key add <key_name> --keyring-backend test --node.type bridge
```

This will load the key <key_name> into the directory of the bridge node.

## Steps for generating **full** node keys

To generate a key for a celestia full node, do the following:

```sh
./cel-key add <key_name> --keyring-backend test --node.type full 
```

This will load the key <key_name> into the directory of the full node.

## Steps for generating **light** node keys

To generate a key for a celestia light node, do the following:

```sh
./cel-key add <key_name> --keyring-backend test --node.type light
```

This will load the key <key_name> into the directory of the light node.

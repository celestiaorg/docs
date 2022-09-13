---
sidebar_label : Installing Celestia Node
---

# Celestia Node

This tutorial goes over building and installing celestia-node. This
tutorial assumes you completed the steps in setting up your development
environment [here](./environment.md).

## Install Celestia Node

### Arabica Installation

Installing celestia-node for Arabica Devnet means installing a specific version
to be compatible with the network.

Install the celestia-node binary by running the following commands:

```sh
cd $HOME
rm -rf celestia-node
git clone https://github.com/celestiaorg/celestia-node.git
cd celestia-node/
git checkout tags/v0.3.0
make install
```

Verify that the binary is working and check the version with the `celestia
version` command:

```console
$ celestia version
Semantic version: v0.3.0
Commit: 00d80c423b2bfacec22a253ce6af3a534a1be3a7
```

### Mamaki Installation

Installing celestia-node for Mamaki Testnet means installing a specific version
to be compatible with the network.

Install the celestia-node binary by running the following commands:

```sh
cd $HOME
rm -rf celestia-node
git clone https://github.com/celestiaorg/celestia-node.git
cd celestia-node/
git checkout tags/v0.3.0-rc2
make install
```

Verify that the binary is working and check the version with the `celestia
version` command:

```console
$ celestia version
Semantic version: v0.3.0-rc2
Commit: 89892d8b96660e334741987d84546c36f0996fbe
```

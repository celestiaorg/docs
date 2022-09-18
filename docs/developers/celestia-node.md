---
sidebar_label : Installing Celestia Node
---

# Celestia Node

This tutorial goes over building and installing celestia-node. This
tutorial assumes you completed the steps in setting up your development
environment [here](./environment.md).

## Install Celestia Node

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

# Celestia Node

This tutorial goes over installing and building Celestia Node. This
tutorial presumes you completed the steps in setting up your own
environment [here](../developers/environment).

## Install Celestia Node

Install the Celestia Node binary, which will be used to run the Bridge Node.

```sh
cd $HOME
rm -rf celestia-node
git clone https://github.com/celestiaorg/celestia-node.git
cd celestia-node/
make install
```

Verify that the binary is working and check the version with `celestia version` command:

```console
$ celestia version
Semantic version: v0.2.0
Commit: 1fcf0c0bb5d5a4e18b51cf12440ce86a84cf7a72
Build Date: Fri 04 Mar 2022 01:15:07 AM CET
System version: amd64/linux
Golang version: go1.17.5
```

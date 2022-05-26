# Celestia Node

This tutorial goes over installing and building Celestia Node. This
tutorial presumes you completed the steps in setting up your own
environment [here](../developers/environment).

## Install Celestia Node

Install the Celestia Node binary by running the following command:

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
Semantic version: v0.3.0-rc1-7-g45f23d8
Commit: 45f23d8ecab4c3526a7729cd4bc9a0ebe561846e
Build Date: Thu 26 May 2022 10:41:59 AM CEST
System version: amd64/linux
Golang version: go1.18.1
```

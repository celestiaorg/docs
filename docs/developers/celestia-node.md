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
APP_VERSION=$(curl -s \ 
   https://api.github.com/repos/celestiaorg/celestia-app/releases/latest \ 
   | jq -r ".tag_name") 
git checkout tags/$APP_VERSION -b $APP_VERSION
make install
```

Verify that the binary is working and check the version with `celestia version` command:

```console
$ celestia version
Semantic version: v0.3.0-rc1
Commit: 5843c5e102651206fe11c685c163f267b141b103
Build Date: Thu 26 May 2022 02:32:58 PM CEST
System version: amd64/linux
Golang version: go1.18.2
```

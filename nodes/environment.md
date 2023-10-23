---
description: Learn to set up your development environment to run Celestia software.
---

# Development environment

<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD013 -->
<script setup>
import constants from '/.vitepress/constants/constants.js'
import arabicaVersions from '/.vitepress/constants/arabica_versions.js'
import mochaVersions from '/.vitepress/constants/mocha_versions.js'
import coffeeVersions from '/.vitepress/constants/coffee_versions.js'
</script>

This page will go over setting up your development environment
to run Celestia software. This environment can be used for development, building
binaries, and running nodes.

## Install dependencies

1. If you are on Ubuntu, first update and upgrade your OS:

   ::: code-group

   ```bash [APT]
   sudo apt update && sudo apt upgrade -y
   ```

   ```bash [YUM]
   sudo yum update
   ```

   :::

2. Install essential packages that are necessary to execute many tasks like
   downloading files, compiling, and monitoring the node:

   ::: code-group

   ```bash [APT]
   sudo apt install curl tar wget clang pkg-config libssl-dev jq build-essential \
   git make ncdu -y
   ```

   ```bash [YUM]
   sudo yum install curl tar wget clang pkg-config libssl-dev jq build-essential \
   git make ncdu -y
   ```

   ```bash [Mac]
   # these commands are for installing Homebrew, wget and jq
   # follow the instructions from the output after running this command
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

   # then install wget & jq
   brew install wget && brew install jq
   ```

   :::

## Install Golang

celestia-node is written in Golang so we must install Golang to build
and run our node.

1. Set the version for your desired network:

   ::: code-group

   ```bash-vue [Coffee]
   ver="{{constants.golangNodeCoffee}}"
   ```

   ```bash-vue [Mocha]
   ver="{{constants.golangNodeMocha}}"
   ```

   ```bash-vue [Arabica]
   ver="{{constants.golangNodeArabica}}"
   ```

   :::

2. Download and install Golang:

   ::: code-group

   ```bash-vue [Ubuntu (AMD)]
   cd $HOME
   wget "https://golang.org/dl/go$ver.linux-amd64.tar.gz"
   sudo rm -rf /usr/local/go
   sudo tar -C /usr/local -xzf "go$ver.linux-amd64.tar.gz"
   rm "go$ver.linux-amd64.tar.gz"
   ```

   ```bash-vue [Ubuntu (ARM)]
   cd $HOME
   wget "https://golang.org/dl/go$ver.linux-arm64.tar.gz"
   sudo rm -rf /usr/local/go
   sudo tar -C /usr/local -xzf "go$ver.linux-arm64.tar.gz"
   rm "go$ver.linux-arm64.tar.gz"
   ```

   ```bash-vue [Mac (Apple)]
   cd $HOME
   wget "https://golang.org/dl/go$ver.darwin-arm64.tar.gz"
   sudo rm -rf /usr/local/go
   sudo tar -C /usr/local -xzf "go$ver.darwin-arm64.tar.gz"
   rm "go$ver.darwin-arm64.tar.gz"
   ```

   ```bash-vue [Mac (Intel)]
   cd $HOME
   wget "https://golang.org/dl/go$ver.darwin-amd64.tar.gz"
   sudo rm -rf /usr/local/go
   sudo tar -C /usr/local -xzf "go$ver.darwin-amd64.tar.gz"
   rm "go$ver.darwin-amd64.tar.gz"
   ```

   :::

3. Add your `/usr/local/go/bin` directory to
   your `$PATH` if you have not already:

   ::: code-group

   ```bash [bash]
   echo "export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin" >> $HOME/.bash_profile
   source $HOME/.bash_profile
   ```

   ```bash [zsh]
   echo "export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin" >> $HOME/.zshrc
   source $HOME/.zshrc
   ```

   :::

4. To verify that the correct version of Go was installed correctly run:

   ```bash
   go version
   ```

The output will show the version installed.

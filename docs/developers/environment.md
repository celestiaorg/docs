---
sidebar_label : Setting Up Environment
---

# Development Environment

This tutorial will go over setting up your development environment to run
Celestia software. This environment can be used for development, building
binaries, and running nodes.

## Install Dependencies

Once you have setup your instance, ssh into the instance to begin installing the
dependencies needed to run a node.

First, make sure to update and upgrade the OS:

```bash
# If you are using the APT package manager
sudo apt update && sudo apt upgrade -y

# If you are using the YUM package manager
sudo yum update
```

These are essential packages that are necessary to execute many tasks like
downloading files, compiling, and monitoring the node:

<!-- markdownlint-disable MD013 -->
```bash
# If you are using the APT package manager
sudo apt install curl tar wget clang pkg-config libssl-dev jq build-essential git make ncdu -y

# If you are using the YUM package manager
sudo yum install curl tar wget clang pkg-config libssl-dev jq build-essential git make ncdu -y
```
<!-- markdownlint-enable MD013 -->

### macOS Dependency Installation

#### 🍺 Installing Homebrew

[Homebrew](https://brew.sh/) is a package manager for macOS and Linux and will
allow you to install your dependencies.

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Remember to run the commands in the output that are similar to:

```bash
==> Next steps:
- Run these three commands in your terminal to add Homebrew to your PATH:
    echo '# Set PATH, MANPATH, etc., for Homebrew.' >> /Users/joshstein/.zprofile
    echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> /Users/joshstein/.zprofile
    eval "$(/opt/homebrew/bin/brew shellenv)"
```

#### 🗄 Install wget and jq

Using Homebrew, in your terminal:

```bash
brew install wget && brew install jq
```

[wget](https://www.gnu.org/software/wget/) is an internet file retriever and
[jq](https://stedolan.github.io/jq/) is a lightweight command-line JSON
processor.

## Install Golang

Celestia-app and celestia-node are written in [Golang](https://go.dev/) so we
must install Golang to build and run them.

### If you are running Ubuntu Linux 20.04 (LTS) on an AMD Machine

```bash
ver="1.18.2"
cd $HOME
wget "https://golang.org/dl/go$ver.linux-amd64.tar.gz"
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf "go$ver.linux-amd64.tar.gz"
rm "go$ver.linux-amd64.tar.gz"
```

### If you are running Ubuntu Linux 20.04 (LTS) on an ARM Machine or Raspberry Pi

```bash
ver="1.18.2"
cd $HOME
wget "https://golang.google.cn/dl/go$ver.linux-arm64.tar.gz"
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf "go$ver.linux-arm64.tar.gz"
rm "go$ver.linux-arm64.tar.gz"
```

### If you are running macOS on a M1 or M2 Machine

```bash
ver="1.18.2"
cd $HOME
wget "https://golang.google.cn/dl/go$ver.darwin-arm64.tar.gz"
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf "go$ver.darwin-arm64.tar.gz"
rm "go$ver.darwin-arm64.tar.gz"
```

### If you are running an macOS on an Intel Machine

```bash
ver="1.18.2"
cd $HOME
wget "https://golang.google.cn/dl/go$ver.darwin-amd64.tar.gz"
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf "go$ver.darwin-amd64.tar.gz"
rm "go$ver.darwin-amd64.tar.gz"
```

### All Machines

Now we need to add the `/usr/local/go/bin` directory to `$PATH`:

```bash
echo "export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

To check if Go was installed correctly run:

```bash
go version
```

The output should be the version installed:

```bash
go version go1.18.2 linux/amd64
```

> *Note: the output may be different depending on your machine.*

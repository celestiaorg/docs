---
sidebar_label : Setup
---

# 💻 Setup

- Operating systems: GNU/Linux, macOS, or Windows Subsystem for Linux (WSL).
Recommended GNU/Linux or macOS.

> This tutorial was made on an M2 Mac with macOS Monterey Version 12.6.

- [Golang v1.18.2](https://go.dev/)
- [Ignite CLI v0.24.0](https://github.com/ignite/cli/releases/tag/v0.24.0)
- [Homebrew](https://brew.sh/)
- [wget](https://www.gnu.org/software/wget/)
- [jq](https://stedolan.github.io/jq/)
- [A Celestia Light Node](https://docs.celestia.org/nodes/light-node/)

## 🏃 Install Golang

Celestia-App, Celestia-Node, and Cosmos-SDK are written in the Golang
programming language. We’ll need Golang to build and run them. Celestia’s
Mamaki testnet requires Golang v1.18.2 to build and run correctly.

```bash
cd
ver="1.18.2"
wget "https://golang.org/dl/go$ver.darwin-arm64.tar.gz"
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf "go$ver.darwin-arm64.tar.gz"
rm "go$ver.darwin-arm64.tar.gz"
```

Add `/usr/local/go/bin` directory to [set your $PATH variables correctly](https://go.dev/doc/gopath_code#GOPATH):

```bash
# If using bash
echo "export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin" >> $HOME/.bash_profile
source $HOME/.bash_profile

# If using zsh
echo "export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin" >> $HOME/.zshrc
source $HOME/.zshrc
```

To check if Go was installed correctly run:

```bash
go version
```

The output should be the version installed:

```bash
go version go1.19.1 darwin/arm64
```

## 🔥 Install Ignite CLI

First, you will need to create `/usr/local/bin` if you have not already:

```bash
sudo mkdir -p -m 775 /usr/local/bin
```

Run this command in your terminal to install Ignite CLI:

```bash
curl https://get.ignite.com/cli! | bash
```

> ✋ On some machines, you may run into permissions errors like the one below.
You can resolve this error by following the guidance
[here](https://docs.ignite.com/guide/install#write-permission) and below.

```bash
# Error
jcs @ ~ % curl https://get.ignite.com/cli! | bash
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  3967    0  3967    0     0  38631      0 --:--:-- --:--:-- --:--:-- 41322
Installing ignite v0.24.0.....
######################################################################## 100.0%
**mv: rename ./ignite to /usr/local/bin/ignite: Permission denied**
============
**Error: mv failed**
jcs @ ~ %
```

The following command should resolve the permissions error:

```bash
sudo curl https://get.ignite.com/cli! | sudo bash
```

A successful installation will return something similar the response below:

```bash
% Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  3967    0  3967    0     0   4122      0 --:--:-- --:--:-- --:--:--  4136
Installing ignite v0.22.2.....
######################################################################## 100.0%
Installed at /usr/local/bin/ignite
```

Verify you’ve installed Ignite CLI by running:

```bash
ignite version
```

The response that you receive should look something like this:

<!-- markdownlint-disable MD010 -->
<!-- markdownlint-disable MD013 -->
```bash
jcs @ ~ % ignite version
Ignite CLI version:	v0.24.0
Ignite CLI build date:	2022-09-12T14:14:32Z
Ignite CLI source hash:	21c6430cfcc17c69885524990c448d4a3f56461c
Your OS:		darwin
Your arch:		arm64
Your go version:	go version go1.19.1 darwin/arm64
Your uname -a:		Darwin Joshs-MacBook-Air.local 21.6.0 Darwin Kernel Version 21.6.0: Sat Jun 18 17:07:28 PDT 2022; root:xnu-8020.140.41~1/RELEASE_ARM64_T8110 arm64
Your cwd:		/Users/joshcs
Is on Gitpod:		false
```
<!-- markdownlint-enable MD013 -->
<!-- markdownlint-enable MD010 -->

## 🍺 Install Homebrew

Homebrew will allow us to install dependencies for our Mac:

```jsx
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Be sure to run the commands similar to the output below from the successful installation:

```jsx
==> Next steps:
- Run these three commands in your terminal to add Homebrew to your PATH:
    echo '# Set PATH, MANPATH, etc., for Homebrew.' >> /Users/joshstein/.zprofile
    echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> /Users/joshstein/.zprofile
    eval "$(/opt/homebrew/bin/brew shellenv)"
```

## 🏃 Install wget and jq

wget is an Internet file retriever and jq is a lightweight and flexible
command-line JSON processor.

```bash
brew install wget && brew install jq
```

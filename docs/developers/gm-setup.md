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
programming language. We’ll need Golang to build and run them. **Be sure to use the same testnet installation instructions through this entire tutorial.**

You can [install Golang here](./environment.mdx#install-golang).

## 🔥 Install Ignite CLI

First, you will need to create `/usr/local/bin` if you have not already:

```bash
sudo mkdir -p -m 775 /usr/local/bin
```

The most stable version of Ignite CLI is v0.24.0. You can install Ignite
Version v0.24.0 from source by running the following commands:

```bash
wget https://github.com/ignite/cli/archive/refs/tags/v0.24.0.zip
unzip v0.24.0.zip
cd cli-0.24.0
make install
which ignite
ignite version
```

> ✋ On some machines, you may run into permissions errors.
You can resolve this error by following the guidance
[here](https://docs.ignite.com/guide/install#write-permission).

A successful installation will return something similar the response below:

<!-- markdownlint-disable MD010 -->
<!-- markdownlint-disable MD013 -->
```bash
jcs @ ~/cli-0.24.0 % make install
Installing Ignite CLI...
Ignite CLI version:	development
Ignite CLI build date:	2022-10-26T18:27:49
Ignite CLI source hash:
Your OS:		darwin
Your arch:		arm64
Your Node.js version:	v18.10.0
Your go version:	go version go1.19.2 darwin/arm64
Your uname -a:		Darwin Joshs-MacBook-Air.local 21.6.0 Darwin Kernel Version 21.6.0: Mon Aug 22 20:20:07 PDT 2022; root:xnu-8020.140.49~2/RELEASE_ARM64_T8110 arm64
Your cwd:		/Users/joshstein/cli-0.24.0
Is on Gitpod:		false
```
<!-- markdownlint-enable MD010 -->
<!-- markdownlint-enable MD013 -->

To remove `v0.24.0.zip` and the directory used for installation, run the
following:

```bash
cd && rm -rf v0.24.0.zip && rm -rf cli-0.24.0
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
Your go version:	go version go1.18.2 darwin/arm64
Your uname -a:		Darwin Joshs-MacBook-Air.local 21.6.0 Darwin Kernel Version 21.6.0: Sat Jun 18 17:07:28 PDT 2022; root:xnu-8020.140.41~1/RELEASE_ARM64_T8110 arm64
Your cwd:		/Users/joshcs
Is on Gitpod:		false
```
<!-- markdownlint-enable MD013 -->
<!-- markdownlint-enable MD010 -->

## 🍺 Install Homebrew

Homebrew will allow us to install dependencies for your Mac:

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

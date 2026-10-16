# Development environment

This page will go over setting up your development environment
to run Celestia software. This environment can be used for development, building
binaries, and running nodes.

## Supported architectures

Celestia-app and celestia-node only officially support the following architectures:

- linux/amd64
- linux/arm64
- darwin/amd64 (macOS Intel)
- darwin/arm64 (macOS Apple Silicon)

Only these four architectures are officially tested and supported.

### Install dependencies

Select your platform to update the OS and install required packages:

**Ubuntu (APT)**

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install curl tar wget aria2 clang pkg-config libssl-dev jq build-essential \
git make ncdu -y
```

**RHEL/CentOS (YUM)**

```bash
sudo yum update
sudo yum install curl tar wget aria2 clang pkg-config libssl-dev jq build-essential \
git make ncdu -y
```

**macOS**

```bash
# install Homebrew, then wget & jq
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install wget && brew install jq
```

### Install Go

Install Go to build celestia-node or celestia-app from source. The versions below
meet the Go requirements of the releases documented for each network.
When building a different release, check the `go` and, if present, `toolchain`
directives in that release's `go.mod` before choosing a Go version.

| Network | celestia-node requirements | celestia-app requirements |
| --- | --- | --- |
| Mainnet Beta | [Release go.mod](https://github.com/celestiaorg/celestia-node/blob/v0.34.3/go.mod) | [Release go.mod](https://github.com/celestiaorg/celestia-app/blob/v10.4.0/go.mod) |
| Mocha | [Release go.mod](https://github.com/celestiaorg/celestia-node/blob/v0.34.3-mocha/go.mod) | [Release go.mod](https://github.com/celestiaorg/celestia-app/blob/v10.4.0-mocha/go.mod) |

Set the version for your desired network:

- Mainnet Beta: `ver="1.26.8"`
- Mocha: `ver="1.26.8"`

Download and install Go:

**Linux (AMD)**

```bash
cd $HOME
wget "https://go.dev/dl/go$ver.linux-amd64.tar.gz"
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf "go$ver.linux-amd64.tar.gz"
rm "go$ver.linux-amd64.tar.gz"
```

**Linux (ARM)**

```bash
cd $HOME
wget "https://go.dev/dl/go$ver.linux-arm64.tar.gz"
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf "go$ver.linux-arm64.tar.gz"
rm "go$ver.linux-arm64.tar.gz"
```

**macOS (Apple)**

```bash
cd $HOME
wget "https://go.dev/dl/go$ver.darwin-arm64.tar.gz"
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf "go$ver.darwin-arm64.tar.gz"
rm "go$ver.darwin-arm64.tar.gz"
```

**macOS (Intel)**

```bash
cd $HOME
wget "https://go.dev/dl/go$ver.darwin-amd64.tar.gz"
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf "go$ver.darwin-amd64.tar.gz"
rm "go$ver.darwin-amd64.tar.gz"
```

### Configure Go and verify

Add your `/usr/local/go/bin` directory to your `$PATH` if you have not already:

**bash**

```bash
echo "export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

**zsh**

```bash
echo "export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin" >> $HOME/.zshrc
source $HOME/.zshrc
```

Use `echo $SHELL` to figure out what type of shell you are using.

To verify that the correct version of Go was installed correctly run:

```bash
go version
```

The output will show the version installed.
---
description: A guide on how to install Arbitrum Nitro and deploy an instance on an Ubuntu AMD machine, including the installation of necessary dependencies, cloning the repository, and installing Nitro from source.
---

# Deploy an Arbitrum rollup devnet

We will go over installation of Arbitrum Nitro and deploying an instance on an
Ubuntu AMD machine. This section covers all necessary dependencies needed to be
installed.

## Dependencies

- [Docker](https://docs.docker.com/engine/install/ubuntu/)
  running on your machine
- [Docker Compose](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04)
- At least 8 GB RAM

### General

<!-- markdownlint-disable MD013 -->

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install curl tar wget clang pkg-config libssl-dev cmake jq build-essential git make ncdu -y
```

### Rust

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"
```

### Golang

```bash
ver="1.20"
cd $HOME
wget "https://golang.org/dl/go$ver.linux-amd64.tar.gz"
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf "go$ver.linux-amd64.tar.gz"
rm "go$ver.linux-amd64.tar.gz"
echo "export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin" >> $HOME/.bash_profile
source $HOME/.bash_profile
go version
```

### Node

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
nvm install 16.20.0
nvm use 16.20.0
node --version
npm install --global yarn
yarn --version
```

<!-- markdownlint-enable MD013 -->

### Other Dependencies

```bash
cargo install --force cbindgen
rustup target add wasm32-unknown-unknown
```

## Clone the repository

<!-- TODO: change git checkout to celestia-development or release. It is locked
to this version so that the tutorial works for anyone using it ATM. -->

```bash
git clone https://github.com/celestiaorg/nitro.git && cd nitro/
git fetch --all
# This is using a stable commit on https://github.com/celestiaorg/nitro/tree/celestia-development
git checkout c6f5ac2
git submodule update --init
git submodule update --init --recursive
```

## Installing Nitro from Source

Now you can install Nitro from source. After the `make` command completes,
you can run the bash script that installs and runs the containers via
docker-compose.

```bash
make build-node-deps
cd nitro-testnode && ./test-node.bash --init --dev
```

Congratulations! You have an Arbitrum Orbit rollup running with Nitro on
your machine.

### Validating with WASM

If you want to run a validator that will validate all blocks in WASM,
add the flag `--validate` to nitro-testnode when starting with:

```bash
./test-node.bash --init --dev --validate
```

<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD013 -->
<div class="youtube-wrapper">
  <iframe
    class="youtube-video"
    title="Arbitrum Nitro Rollup with Celestia as DA, validating blocks with WASM"
    src="https://youtube.com/embed/xihXA3wkuLI"
    allowfullscreen
  ></iframe>
</div>

:::tip
You may need significantly more RAM and CPU to validate all blocks with WASM.
:::

## Next steps

In the next page we will cover
[deploying your devnet to Mocha testnet](./arbitrum-mocha.md).

---
sidebar_label: Relayer
---

# Relaying

Celestia uses [IBC](https://ibcprotocol.dev/)
(Inter-Blockchain Communication protocol) to enable cross-chain
transfer of tokens. To support this capability it relies on
relayers, processes that can be run by anyone which constantly
scan for outbound packets on one chain and submits these packets
alongside corresponding proofs on the destination chain. This
section briefly describes how one can setup a relayer. There
are two standard implementations:

- [Hermes](https://hermes.informal.systems/) built in Rust
- [Go Relayer](https://pkg.go.dev/github.com/cosmos/relayer) built in Go

For this guide, we will look just at Hermes.

## Setup

### Install

1. Download the latest version of the binary from [Releases](https://github.com/informalsystems/hermes/releases).
2. Create the directory for the binary: `mkdir -p $HOME/.hermes/bin`
3. Extract the binary: `tar -C $HOME/.hermes/bin/ -vxzf $ARCHIVE_NAME`
4. Update `PATH` to point to the binary, either in `.bashrc` or `.zshrc`

You should now have it installed:

```bash
> hermes version

hermes v1.3.0
```

### Configure

Hermes uses a `config.toml` file to instruct the process.
This should be placed in `$HOME/.hermes/config.toml`.
You can try to do this automatically by typing the command:

```bash
hermes config auto --chains cosmoshub testnets/celestiatestnet --output $HOME/.hermes/config.toml
```

This takes information from the [chain-registry](https://github.com/cosmos/chain-registry).
If the information is not there, you will have to enter it
manually by opening the `config.toml`. You can read the
self-documented example [here](https://github.com/informalsystems/hermes/blob/v1.3.0/config.toml).
You will be required to find RPC and gRPC endpoints.

### Keys

Next step is to add keys for the accounts that will
be paying the fees to transfer the tokens across.
Assuming you have an existing account with a known
mnemonic, you can simply save the words into a file:

```bash
echo word1 ... word12or24 > mnemonic_file
```

Next, run the following:

```bash
hermes keys add --chain blockspacerace-1 --mnemonic-file mnemonic_file
```

You can confirm the keys by executing:

```bash
hermes keys list --chain blockspacerace-1
```

Make sure you have added the keys and have sufficient
funds for each chain you are relaying across.

### Running

Now, you should be able to start the process. As a quick
sanity check, first run

```bash
hermes config validate
```

Then begin by running

```bash
hermes start
```

As with other processes, you can use `systemd` to manage
hermes in the background. For more information on setting
up `clients`, `connections` and `channels`, use the `help`
command within the cli or refer to [Hermes website](https://hermes.informal.systems).

## Transfer

The Celestia state machine is built with the IBC transfer
module, allowing for the native celestia token to be
transferred to any other IBC enabled chain. Transfer can
be initialized through the `celestia-appd` CLI. Information
can be found via the help label as follows:

```bash
celestia-appd tx ibc-transfer transfer --help
```

### Token filter

The transfer module uses a token filter middleware which
serves to prevent non-native Celestia tokens from being
on Celestia. If a user is to try to send a token from another
chain across, it will be simply rejected and the token returned
back to the user.

# Celestia Hardfork Process

Blockchain networks often times need to upgrade with new features
which require coordination work among the validators prior to activating
the upgrades.

This process is called a hardfork or a network upgrade. In those events,
the Celestia Labs team will be coordinating with the validators on
what they need to do in order to be ready for an upcoming hardfork.

Hardforks are not backward-compatible with older versions of the network
software which is why it is important that validators upgrade their software
to continue validating on the network after the network upgrades.

## General Process

The general process can be broken down into several components:

- Hardfork specifications and features (defined by description of features
  and code implementation of those features).
- Binary used to add those features (a new binary release with those features
  will be provided by Celestia team in order for validators to upgrade
  their nodes to the new binary).
- A block number for when the network upgrades (even if validators upgrade
  their binary to be hardfork ready, the network upgrade does not happen right
  away, but some short time in the future at a specific block number).
- Testing of the features (happens on testnets first prior to activating on
  mainnet in order to ensure the network can upgrade securely).

The two testnets were hardforks are deployed on are:

- [Arabica](./arabica-devnet.md)
- [Mamaki](./mamaki-testnet.md)

### Cosmovisor

We will be using Cosmovisor for upgrading our network for upcoming
hardforks.

Cosmovisor is a process management tool that allows switching of binaries
when a certain block is reached. You can learn more about Cosmovisor
[here](https://docs.cosmos.network/main/tooling/cosmovisor).

Install Cosmovisor by running the following command:

```sh
go install cosmossdk.io/tools/cosmovisor/cmd/cosmovisor@latest
```

Set the environment variables:

```sh
export DAEMON_NAME=celestia-appd
export DAEMON_HOME=$HOME/.celestia-app
```

Now, we will go over an example hardfork scenario with two example
binaries.

The following table shows the binaries and their properties:

| Version | Hardfork-Binary | Release Status  |
|---------|-----------------|-----------------|
| 0.X.1   | FALSE           | Current Release |
| 0.X.2   | TRUE            | New Release     |

Above, you can see that the example `celestia-app` Version 0.X.1 is the
current release version a validator would run and it is not the
hardfork-ready binary while the Version 0.X.2 Binary will be a new release
that is hardfork-ready.

Create the directory for the current binary Version 0.X.1
and copy `celestia-appd`:

```sh
mkdir -p $DAEMON_HOME/cosmovisor/genesis/bin
cp ./build/celestia-appd $DAEMON_HOME/cosmovisor/genesis/bin
```

Now you can run Cosmovisor with the current release Version 0.X.1:

```sh
cosmovisor run start
```

Now, pull in the New Release which is version 0.X.2 of celestia-app
separately and build the binary for it:

```sh
make build
```

Create the new folder for the version 0.X.2 and copy it over:

```sh
mkdir -p $DAEMON_HOME/cosmovisor/upgrades/test1/bin
cp ./build/celestia-appd $DAEMON_HOME/cosmovisor/upgrades/test1/bin
```

Now, open a new terminal window and run the commands for submitting
a governance proposal to upgrade the chain and vote on it.

> NOTE: In normal hardfork operations as a validator, you do not need
  to submit a governance proposal but rather just vote on an existing one
  submitted by Celestia Labs team.

<!-- markdownlint-disable MD013 -->
```sh
./build/celestia-appd tx gov submit-proposal software-upgrade test1 --title upgrade --description upgrade --upgrade-height 200 --from validator --yes
./build/celestia-appd tx gov deposit 1 10000000stake --from validator --yes
./build/celestia-appd tx gov vote 1 yes --from validator --yes
```
<!-- markdownlint-enable MD013 -->

This will cause the upgrade to happen automatically on block `200`,
where Cosmovisor will switch the binaries from 0.X.1 (Current Release)
to 0.X.2 (New Release).

### Mocha Hardfork

Celestia is planning the Mocha Hardfork upgrade on the Mamaki Testnet.
This hardfork is unique as it will reset the Mamaki network to block 0
while maintaining the existing state and also will rename Mamaki to Mocha.

The new chain-id will be `mocha`.

The release logs for `mocha` can be found here (TBD).

The most exciting feature included is setting the stage for QGB on Mocha.

Validators will need to generate 2 new keys in order to be QGB-ready.
Note that for the Mocha Hardfork, QGB will not launch yet so you
can swap those keys after for new ones if needed. The keys needed are:

- 1 EVM key
- 1 Celestia key

So, in order for this to happen, validators will need to maintain two
new keys in order to have a successful upgrade.

Those two keys will need to be added to 2 new flags on `celestia-app`:

- `--evm-address`: This flag should contain a `0x` EVM address.
- `--orchesrator-address`: This flag should contain a newly-generated
  `celestia1` Celestia address. Validators certainly can use their existing
  Celestia addresses here but it is recommended to create a new one.

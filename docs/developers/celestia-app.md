# Celestia App
<!-- markdownlint-disable MD013 -->

This tutorial will guide you through building Celestia App. This
tutorial presumes you completed the steps in setting up your
own environment [here](environment).

## Install Celestia App

The steps below will create a binary file named `celestia-appd`
inside `$HOME/go/bin` folder which will be used later to run the node.

```sh
cd $HOME
rm -rf celestia-app
git clone https://github.com/celestiaorg/celestia-app.git
cd celestia-app/
APP_VERSION=$(curl -s \
  https://api.github.com/repos/celestiaorg/celestia-app/releases/latest \
  | jq -r ".tag_name")
git checkout tags/$APP_VERSION -b $APP_VERSION
make install
```

To check if the binary was successfully compiled you can run the binary
using the `--help` flag:

```sh
celestia-appd --help
```

You should see a similar output (with helpful example commands):

```text
Start celestia app

Usage:
  celestia-appd [command]

Available Commands:
  add-genesis-account Add a genesis account to genesis.json
  collect-gentxs      Collect genesis txs and output a genesis.json file
  config              Create or query an application CLI configuration file
  debug               Tool for helping with debugging your application
  export              Export state to JSON
  gentx               Generate a genesis tx carrying a self delegation
  help                Help about any command
  init                Initialize private validator, p2p, genesis, and application configuration files
  keys                Manage your application's keys
  migrate             Migrate genesis to a specified target version
  query               Querying subcommands
  rollback            rollback tendermint state by one height
  rollback            rollback cosmos-sdk and tendermint state by one height
  start               Run the full node
  status              Query remote node for status
  tendermint          Tendermint subcommands
  tx                  Transactions subcommands
  validate-genesis    validates the genesis file at the default location or at the location passed as an arg
  version             Print the application binary version information

Flags:
  -h, --help                help for celestia-appd
      --home string         directory for config and data (default "/root/.celestia-app")
      --log_format string   The logging format (json|plain) (default "plain")
      --log_level string    The logging level (trace|debug|info|warn|error|fatal|panic) (default "info")
      --trace               print out full stack trace on errors

Use "celestia-appd [command] --help" for more information about a command.
```

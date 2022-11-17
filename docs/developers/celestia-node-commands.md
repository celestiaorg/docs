---
sidebar_label: Helpful CLI Commands
---

# Helpful CLI Commands

View all options for `celestia-node`:
<!-- markdownlint-disable MD010 -->
```console
$ celestia --help

		____      __          __  _
	  / ____/__  / /__  _____/ /_(_)___ _
	 / /   / _ \/ / _ \/ ___/ __/ / __  /
	/ /___/  __/ /  __(__  ) /_/ / /_/ /
	\____/\___/_/\___/____/\__/_/\__,_/

Usage:
  celestia [command]

Available Commands:
  bridge      Manage your Bridge node
  full        Manage your Full node
  light       Manage your Light node
  version     Show information about the current binary build

Flags:
  -h, --help   help for celestia

Additional help topics:
  celestia

Use "celestia [command] --help" for more information about a command.
```
<!-- markdownlint-enable MD010 -->
## Using the `cel-key` utility

You will need to have generated the `cel-key` utility using `make cel-key`
to use the utility.

View all options for `cel-key`:

<!-- markdownlint-disable MD013 -->

```sh
$ ./cel-key --help
Keyring management commands. These keys may be in any format supported by the
Tendermint crypto library and can be used by light-clients, full nodes, or any other application
that needs to sign with a private key.

The keyring supports the following backends:

    os          Uses the operating system's default credentials store.
    file        Uses encrypted file-based keystore within the app's configuration directory.
                This keyring will request a password each time it is accessed, which may occur
                multiple times in a single command resulting in repeated password prompts.
    kwallet     Uses KDE Wallet Manager as a credentials management application.
    pass        Uses the pass command line utility to store and retrieve keys.
    test        Stores keys insecurely to disk. It does not prompt for a password to be unlocked
                and it should be use only for testing purposes.

kwallet and pass backends depend on external tools. Refer to their respective documentation for more
information:
    KWallet     https://github.com/KDE/kwallet
    pass        https://www.passwordstore.org/

The pass backend requires GnuPG: https://gnupg.org/

Usage:
  keys [command]

Available Commands:
  add         Add an encrypted private key (either newly generated or recovered), encrypt it, and save to <name> file
  completion  Generate the autocompletion script for the specified shell
  delete      Delete the given keys
  export      Export private keys
  help        Help about any command
  import      Import private keys into the local keybase
  list        List all keys
  migrate     Migrate keys from amino to proto serialization format
  mnemonic    Compute the bip39 mnemonic for some input entropy
  parse       Parse address from hex to bech32 and vice versa
  rename      Rename an existing key
  show        Retrieve key information by name or address

Flags:
  -h, --help                     help for keys
      --home string              The application home directory (default "~")
      --keyring-backend string   Select keyring's backend (os|file|test) (default "os")
      --keyring-dir string       The client Keyring directory; if omitted, the default 'home' directory will be used
      --node.network string      Sets key utility to use the node network's directory (e.g. ~/.celestia-light-mynetwork if --node.network MyNetwork is passed). (default "arabica-1")
      --node.type string         Sets key utility to use the node type's directory (e.g. ~/.celestia-light-arabica-1 if --node.type light is passed).
      --output string            Output format (text|json) (default "text")

Use "keys [command] --help" for more information about a command.
```

<!-- markdownlint-enable MD013 -->

### Importing keys

Importing from a mnemonic:

```sh
./cel-key add <KEY_NAME> --recover --keyring-backend test --node.type <NODE_TYPE>
```

Example:

```sh
./cel-key add alice --recover --keyring-backend test --node.type light
```

You will then be prompted to enter your bip39 mnemonic.

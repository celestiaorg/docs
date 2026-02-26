# Create a wallet with celestia-app

For this guide, we will go over how you can generate a Celestia
wallet using celestia-app.

## Prerequisites

- Gone through [quick start and installed celestia-app](/operate/consensus-validators/install-celestia-app)

Note, you do not need to install celestia-node for this tutorial.

## Keyring backend

First, create an application CLI configuration file:

```sh
celestia-appd config keyring-backend test
```

`keyring-backend` configures the keyring's backend, where the keys are stored.

Options are: `os|file|kwallet|pass|test|memory`.

You can learn more on the [Cosmos documentation](https://docs.cosmos.network/main/user/run-node/keyring)
or [Go Package documentation](https://pkg.go.dev/github.com/cosmos/cosmos-sdk/crypto/keyring).

## Create a wallet

You can pick whatever wallet name you want.
For our example we used "validator" as the wallet name:

```sh
celestia-appd keys add validator --interactive
```

Save the mnemonic output as this is the only way to
recover your validator wallet in case you lose it!

To check all your wallets you can run:

```sh
celestia-appd keys list
```

## Key management

```sh
# listing keys
celestia-appd keys list

# adding keys
celestia-appd keys add <KEY_NAME>

# deleting keys
celestia-appd keys delete <KEY_NAME>

# renaming keys
celestia-appd keys rename <CURRENT_KEY_NAME> <NEW_KEY_NAME>
```

### Importing and exporting keys

Import an encrypted and ASCII-armored private key into the local keybase.

```sh
celestia-appd keys import <KEY_NAME> <KEY_FILE>
```

Example usage:

```sh
celestia-appd keys import amanda ./keyfile.txt
```

Export a private key from the local keyring in encrypted and ASCII-armored format:

```sh
celestia-appd keys export <KEY_NAME>

# you will then be prompted to set a password for the encrypted private key:
Enter passphrase to encrypt the exported key:
```

After you set a password, your encrypted key will be displayed.

## Fund a wallet

For the public celestia address, you can fund the
previously created wallet via [Discord](https://discord.com/invite/YsnTPcSfWQ)
by sending this message to either the #mocha-faucet or #arabica-faucet channel:

```text
$request celestia1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Wait to see if you get a confirmation that the
tokens have been successfully sent. To check if
tokens have arrived successfully to the destination
wallet run the command below replacing the public
address with your own:

```sh
celestia-appd start
celestia-appd query bank balances celestia1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
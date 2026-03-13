# Key management

The Blobstream `keys` command allows managing EVM private keys and P2P identities. It is defined as a subcommand for multiple commands with the only difference being the directory where the keys are stored. For the remaining functionality, it is the same for all the commands.

## Orchestrator command

The `blobstream orchestrator keys` command manages keys for the orchestrator. By default, it uses the orchestrator default home directory to store the keys: `~/.orchestrator/keystore`. However, the default home can be changed either by specifying a different directory using the `--home` flag or setting the following environment variable:

| Variable            | Explanation                         | Default value     | Required |
| ------------------- | ----------------------------------- | ----------------- | -------- |
| `ORCHESTRATOR_HOME` | Home directory for the orchestrator | `~/.orchestrator` | Optional |

## Relayer command

The `blobstream relayer keys` command manages keys for the relayer. By default, it uses the relayer default home directory to store the keys: `~/.relayer/keystore`. However, the default home can be changed either by specifying a different directory using the `--home` flag or setting the following environment variable:

| Variable       | Explanation                    | Default value | Required |
| -------------- | ------------------------------ | ------------- | -------- |
| `RELAYER_HOME` | Home directory for the relayer | `~/.relayer`  | Optional |

## Deploy command

The `blobstream deploy keys` command manages keys for the deployer. By default, it uses the deployer default home directory to store the keys: `~/.deployer/keystore`. However, the default home can be changed either by specifying a different directory using the `--home` flag or setting the following environment variable:

| Variable        | Explanation                           | Default value | Required |
| --------------- | ------------------------------------- | ------------- | -------- |
| `DEPLOYER_HOME` | Home directory for the deploy command | `~/.deployer` | Optional |

## Store initialization

For the `keys` command, the home directory will be created automatically for commands that `add/import` new keys without having to manually initialize the store. Thus, you should be careful when running those.

However, if it finds an already initialized store, it will only add new keys to it and not overwrite it.

For the remaining subcommands `update/delete/list`, if the store is not initialized, the command will complain and change nothing on the file system.

## Options

Aside from the difference in the default home directory, the `keys` subcommand is similar for all commands and handles the keys in the same way.

The examples will use the orchestrator command to access the keys. However, the same behavior applies to the other commands as well.

```bash
blobstream orchestrator keys --help

Blobstream keys manager

Usage:
  blobstream orchestrator keys [command]

Available Commands:
  evm         Blobstream EVM keys manager
  p2p         Blobstream p2p keys manager

Flags:
  -h, --help   help for keys

Use "blobstream orchestrator keys [command] --help" for more information about a command.
```

## EVM keystore

The first subcommand of the `keys` command is `evm`. This allows managing EVM keys.

The EVM keys are `ECDSA` keys using the `secp256k1` curve. The implementation uses `geth` file system keystore [implementation](https://geth.ethereum.org/docs/developers/dapp-developer/native-accounts). Thus, keys can be used interchangeably with any compatible software.

```bash
blobstream orchestrator keys evm --help

Blobstream EVM keys manager

Usage:
  blobstream orchestrator keys evm [command]

Available Commands:
  add         create a new EVM address
  delete      delete an EVM addresses from the key store
  import      import evm keys to the keystore
  list        list EVM addresses in key store
  update      update an EVM account passphrase

Flags:
  -h, --help   help for evm

Use "blobstream orchestrator keys evm [command] --help" for more information about a command.
```

The store also uses the `accounts.StandardScryptN` and `accounts.StandardScryptP` for the `Scrypt` password-based key derivation algorithm to improve its resistance to parallel hardware attacks:

```go
evmKs = keystore.NewKeyStore(evmKeyStorePath(path), keystore.StandardScryptN, keystore.StandardScryptP)
```

### EVM: Add subcommand

The `add` subcommand allows creating a new EVM private key and storing it in the keystore:

```bash
blobstream orchestrator keys evm add --help

create a new EVM address

Usage:
  blobstream orchestrator keys evm add [flags]
```

The passphrase of the key encryption can be passed as a flag. But it is advised not to pass it as plain text and instead enter it when prompted interactively.

After creating a new key, you will see its corresponding address printed:

```bash
blobstream orchestrator keys evm add

I[2023-04-13|14:16:11.387] successfully opened store                    path=/home/midnight/.orchestrator
I[2023-04-13|14:16:11.387] please provide a passphrase for your account
I[2023-04-13|14:16:30.533] account created successfully                 address=0xaF319b70de80232539ad576f88739afD2dF44187
I[2023-04-13|14:16:30.534] successfully closed store                    path=/home/midnight/.orchestrator
```

### EVM: Delete subcommand

The `delete` subcommand allows deleting an EVM private key from store via providing its corresponding address:

```bash
blobstream orchestrator keys evm delete --help

delete an EVM addresses from the key store

Usage:
  blobstream orchestrator keys evm delete <account address in hex> [flags]
```

The provided address should be a `0x` prefixed EVM address.

After running the command, you will be prompted to enter the passphrase for the encrypted private key, if not passed as a flag.

Then, you will be prompted to confirm that you want to delete that private key. Make sure to verify if you're deleting the right one because once deleted, it can no longer be recovered!

```bash
blobstream orchestrator keys evm delete 0x27a1F8CE94187E4b043f4D57548EF2348Ed556c7

I[2023-04-13|15:01:41.308] successfully opened store                    path=/home/midnight/.orchestrator
I[2023-04-13|15:01:41.309] deleting account                             address=0x27a1F8CE94187E4b043f4D57548EF2348Ed556c7
I[2023-04-13|15:01:41.309] please provide the address passphrase
I[2023-04-13|15:01:43.268] Are you sure you want to delete your private key? This action cannot be undone and may result in permanent loss of access to your account.
Please enter 'yes' or 'no' to confirm your decision: yes
I[2023-04-13|15:01:45.532] private key has been deleted successfully    address=0x27a1F8CE94187E4b043f4D57548EF2348Ed556c7
I[2023-04-13|15:01:45.534] successfully closed store                    path=/home/midnight/.orchestrator
```

### EVM: List subcommand

The `list` subcommand allows listing the existing keys in the keystore:

```bash
blobstream orchestrator keys evm list

I[2023-04-13|16:08:45.084] successfully opened store                    path=/home/midnight/.orchestrator
I[2023-04-13|16:08:45.084] listing accounts available in store
I[2023-04-13|16:08:45.084] 0x7Dd8F9CAfe6D25165249A454F2d0b72FD149Bbba
I[2023-04-13|16:08:45.084] successfully closed store                    path=/home/midnight/.orchestrator
```

You could specify a different home using the `--home` flag to list the keys in another home directory.

### EVM: Update subcommand

The `update` subcommand allows changing the EVM private key passphrase to a new one. It takes as argument the `0x` prefixed EVM address corresponding to the private key you want to edit.

```bash
blobstream orchestrator keys evm update --help

update an EVM account passphrase

Usage:
  blobstream orchestrator keys evm update <account address in hex> [flags]
```

Example:

```bash
blobstream orchestrator keys evm update 0x7Dd8F9CAfe6D25165249A454F2d0b72FD149Bbba

I[2023-04-13|16:21:17.139] successfully opened store                    path=/home/midnight/.orchestrator
I[2023-04-13|16:21:17.140] updating account                             address=0x7Dd8F9CAfe6D25165249A454F2d0b72FD149Bbba
I[2023-04-13|16:21:17.140] please provide the address passphrase
I[2023-04-13|16:21:18.134] please provide the address new passphrase
I[2023-04-13|16:21:22.403] successfully updated the passphrase          address=0x7Dd8F9CAfe6D25165249A454F2d0b72FD149Bbba
I[2023-04-13|16:21:22.420] successfully closed store                    path=/home/midnight/.orchestrator
```

Both passphrases can be provided as flags, but it's better to pass them interactively for more security.

The `--home` can be specified if the store is not in the default directory.

### EVM: Import subcommand

The `import` subcommand allows importing existing private keys into the keystore. It has two subcommands: `ecdsa` and `file`. The first allows importing a private key in plaintext, while the other allows importing a private key from a JSON file secured with a passphrase.

```bash
blobstream orchestrator keys evm import --help

import evm keys to the keystore

Usage:
  blobstream orchestrator keys evm import [command]

Available Commands:
  ecdsa       import an EVM address from an ECDSA private key
  file        import an EVM address from a file

Flags:
  -h, --help   help for import

Use "blobstream orchestrator keys evm import [command] --help" for more information about a command.
```

#### EVM: Import ECDSA

For the first one, it takes as argument the private key in plaintext. Then, it prompts for the passphrase to use when encrypting the key and saving it to the keystore. The passphrase could be passed as a flag using the `--evm.passphrase`, but it's advised not to.

Example:

```bash
blobstream orchestrator keys evm import ecdsa da6ed55cb2894ac2c9c10209c09de8e8b9d109b910338d5bf3d747a7e1fc9eb7

I[2023-04-13|17:00:48.617] successfully opened store                    path=/home/midnight/.orchestrator
I[2023-04-13|17:00:48.617] importing account
I[2023-04-13|17:00:48.617] please provide the address passphrase
I[2023-04-13|17:00:51.989] successfully imported file                   address=0x6B452Da14195b0aDc3C960E56a078Cf8f50448f8
I[2023-04-13|17:00:51.990] successfully closed store                    path=/home/midnight/.orchestrator
```

#### EVM: Import file

For the second, it takes a JSON key file, as defined in [@ethereum/eth-keyfile](https://github.com/ethereum/eth-keyfile), and imports it to your keystore, so it can be used for signatures.

```bash
blobstream orchestrator keys evm import file --help

import an EVM address from a file

Usage:
  blobstream orchestrator keys evm import file <path to key file> [flags]
```

For example, if you have a file in the current directory containing a private key, you could run the following:

```bash
blobstream orchestrator keys evm import file UTC--2023-04-13T15-00-50.302148204Z--966e6f22781ef6a6a82bbb4db3df8e225dfd9488

I[2023-04-13|17:31:53.307] successfully opened store                    path=/home/midnight/.orchestrator
I[2023-04-13|17:31:53.307] importing account
I[2023-04-13|17:31:53.308] please provide the address passphrase
I[2023-04-13|17:31:54.440] please provide the address new passphrase
I[2023-04-13|17:31:58.436] successfully imported file                   address=0x966e6f22781EF6a6A82BBB4DB3df8E225DfD9488
I[2023-04-13|17:31:58.437] successfully closed store                    path=/home/midnight/.orchestrator
```

With the `passphrase` being the current file passphrase, and the `new passphrase` being the new passphrase that will be used to encrypt the private key in the Blobstream store.

## P2P keystore

Similar to the EVM keystore, the P2P store has similar subcommands for handling the P2P Ed25519 private keys. However, it doesn't use any passphrase to secure them because they aren't that important. Any key could be used, and it is not binding to any identity. Thus, there is no need to secure them.

To access the P2P keystore, run the following:

```bash
blobstream orchestrator keys p2p

Blobstream p2p keys manager

Usage:
  blobstream orchestrator keys p2p [command]

Available Commands:
  add         create a new Ed25519 P2P address
  delete      delete an Ed25519 P2P private key from store
  import      import an existing p2p private key
  list        list existing p2p addresses

Flags:
  -h, --help   help for p2p

Use "blobstream orchestrator keys p2p [command] --help" for more information about a command.
```

The `orchestrator` could be replaced by `relayer` and the only difference would be the default home directory. Aside from that, all the methods defined for the orchestrator will also work with the relayer.

### P2P: Add subcommand

The `add` subcommand creates a new p2p key to the p2p store:

```bash
blobstream orchestrator keys p2p add --help

create a new Ed25519 P2P address

Usage:
  blobstream orchestrator keys p2p add <nickname> [flags]
```

It takes as argument an optional `<nickname>` which would be the name that you can use to reference that private key. If not specified, an incremental nickname will be assigned.

```bash
blobstream orchestrator keys p2p add

I[2023-04-13|17:38:17.289] successfully opened store                    path=/home/midnight/.orchestrator
I[2023-04-13|17:38:17.290] generating a new Ed25519 private key         nickname=1
I[2023-04-13|17:38:17.291] key created successfully                     nickname=1
I[2023-04-13|17:38:17.291] successfully closed store                    path=/home/midnight/.orchestrator
```

For example, in the above execution, the nickname `1` was given to the newly added key, since no nickname was provided.

The nickname will be needed in case the orchestrator needs to use a specific private key to connect to the P2P network, and that nickname will be provided as a flag. However, if not provided, the orchestrator/relayer will choose the first key in the store and just use it to connect.

### P2P: Delete subcommand

The `delete` subcommand will delete a P2P private key from store referenced by its nickname:

```bash
blobstream orchestrator keys p2p delete --help

delete an Ed25519 P2P private key from store

Usage:
  blobstream orchestrator keys p2p delete <nickname> [flags]
```

### P2P: Import subcommand

The `import` subcommand will import an existing Ed25519 private key to the store. It takes as argument the nickname that you wish to save the private key under, and the actual private key in hex format without `0x`:

```bash
blobstream orchestrator keys p2p import --help

import an existing p2p private key

Usage:
  blobstream orchestrator keys p2p import <nickname> <private_key_in_hex_without_0x> [flags]
```

### P2P: List subcommand

The `list` subcommand lists the existing P2P private keys in the store:

```bash
blobstream orchestrator keys p2p list --help

list existing p2p addresses

Usage:
  blobstream orchestrator keys p2p list [flags]
```
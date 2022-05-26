# Troubleshooting

- [Troubleshooting](#troubleshooting)
  - [Celestia Application / Core](#celestia-application--core)
    - [Validator Node setup](#validator-node-setup)
  - [Celestia Node](#celestia-node)
    - [Celestia Light Node](#celestia-light-node)

## Celestia Application / Core

### Validator Node setup
If you get an error such as 

```Error: <keyname>: key not found```,

this means your key, the field referenced by the `--from` option, does not exist.

> Note: By default, the script for creating a key is utilizing `test` backend. Please, use the flag `--keyring-backend` if you opt for a different key-type.

You can fix this by adding your key manually to the keyring via:

```sh
celestia-appd keys add --recover <keyname>
# or 
celestia-appd keys add --recover <keyname> --keyring-backend <other_format>
``` 

followed by a prompt to enter a bip39 mnemonic, which is the mnemonic that was created as part of `1_create_key.sh` script in the first step.

You'll also be asked for a passphrase which is an input you have to define.

## Celestia Node

### Celestia Light Node
If you get an error such as 

```
No Trusted Peer provided. Headers won't be synced accordingly
```

this means you need to: 
- check that the trusted peer is initialized in the `TrustedPeer` field in `config.toml`
- be sure that the address of the trusted peer is reachable
- ensure that the trusted peer is a Celestia Bridge Node and it's live

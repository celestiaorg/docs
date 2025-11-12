---
description: Use the cel-key utility to generate a wallet on celestia-node.
prev:
  text: "Rust client tutorial"
  link: "/tutorials/rust-client-tutorial"
---

# Create a wallet with celestia-node

<!-- markdownlint-disable MD013 -->
<!-- markdownlint-disable MD033 -->
<script setup>
import constants from '/.vitepress/constants/constants.js'
import mochaVersions from "/.vitepress/constants/mocha_versions.js";
</script>

This tutorial will go over using the `cel-key` utility
to generate a wallet on celestia-node.

While this tutorial will go over the installation process
of `cel-key`, it is recommended that you complete
the following prerequisites first:

- [Setting up your environment](/how-to-guides/environment.md)

Once you completed the prerequisite, you can proceed with this
tutorial.

## Using the `cel-key` utility

Inside the celestia-node repository is a utility called `cel-key` that uses
the key utility provided by Cosmos-SDK under the hood. The utility can be
used to `add`, `delete`, and manage keys for any DA node
type `(bridge || light)`, or just keys in general.

### Installation

You need to first pull down the celestia-node repository:

```sh
git clone https://github.com/celestiaorg/celestia-node.git
cd celestia-node/
```

It can be built using either of the following commands:

```sh
# dumps binary in current working directory, accessible via `./cel-key`
make cel-key
```

or

```sh
# installs binary in GOBIN path, accessible via `cel-key`
make install-key
```

For the purpose of this guide, we will use the `make cel-key` command.

### Steps for generating node keys

To generate a key for a Celestia node, select
the tab for your node type:

:::tip
You do not need to declare a network for Mainnet Beta. Refer to
[the chain ID section on the troubleshooting page for more information](/how-to-guides/celestia-node-troubleshooting.md)
:::

::: code-group

<!-- markdownlint-disable MD013 -->

```bash-vue [Bridge]
./cel-key add <key-name> --keyring-backend test --node.type bridge \
  --p2p.network <network>
```

```bash-vue [Light]
./cel-key add <key-name> --keyring-backend test --node.type light \
  --p2p.network <network>
```

<!-- markdownlint-enable MD013 -->

:::

This will load the key `<key-name>` into the directory of the node.

Further flags you can use to customize your key are the following:

- `--p2p.network`: Specifies which network you want the key for. Values
  are `arabica` and `mocha`. Please note the default network will be `mocha`.

Keep in mind that your celestia-node will only pick up keys that
are inside the default directory under `/keys` so you should make
sure to point `cel-key` utility to the correct directory via the
`p2p.network` or `home` flags if you have specified a custom
directory or network other than Arabica, Mocha, or Mainnet Beta.

Also keep in mind that if you do not specify a network with `--p2p.network`,
the default one will always be `celestia` (Mainnet Beta).

### Steps for exporting node keys

You can export a private key from the local keyring in encrypted and
ASCII-armored format.

::: code-group

<!-- markdownlint-disable MD013 -->

```bash-vue [Bridge]
./cel-key export <key-name> --keyring-backend test --node.type bridge \
  --p2p.network <network>
```

```bash-vue [Light]
./cel-key export <key-name> --keyring-backend test --node.type light \
  --p2p.network <network>
```

<!-- markdownlint-enable MD013 -->

:::

### Steps for importing node keys

To import from a mnemonic, use the following command,
then enter your bip39 mnemonic:

::: code-group

<!-- markdownlint-disable MD013 -->

```bash-vue [Bridge]
./cel-key add <key-name> --recover --keyring-backend test \
  --node.type bridge --p2p.network <network>
```

```bash-vue [Light]
./cel-key add <key-name> --recover --keyring-backend test \
  --node.type light --p2p.network <network>
```

<!-- markdownlint-enable MD013 -->

:::

### View all options for `cel-key`

```sh
./cel-key --help
```

## Managing the key returned by `celestia state account-address`

When you run a Celestia node and use the command `celestia state account-address`, it returns the address of the key that your node is currently using. This key is the same one that was either:

1. Auto-generated during node initialization with `celestia <node-type> init`
2. Manually created using `cel-key add <name> [flags]`
3. Imported/recovered using `cel-key add <name> --recover --node.type <node-type>`

### Understanding the relationship

The key reported by `celestia state account-address` is stored in your node's keyring directory:

- For Mocha testnet: `~/.celestia-<node-type>-{{constants.mochaChainId}}/keys/keyring-test/`
- For Mainnet Beta: `~/.celestia-<node-type>/keys/keyring-test/`

You can verify this by listing your keys with `cel-key`:

```bash
cel-key list --keyring-backend test --node.type <node-type> --p2p.network <network>
```

For example, with a light node on Mocha:

```bash
cel-key list --keyring-backend test --node.type light --p2p.network mocha
```

The address shown in this output should match the one returned by `celestia state account-address`.

### Backing up your key

To back up the key used by your node, you have two options:

#### Option 1: Export the key's mnemonic

```bash
cel-key export <key-name> --keyring-backend test --node.type <node-type> --p2p.network <network>
```

For example, if your key is named "my_celes_key":

```bash
cel-key export my_celes_key --keyring-backend test --node.type light --p2p.network mocha
```

This will prompt you for a password to encrypt the exported key. Store this exported key and password securely.

#### Option 2: Back up the keyring directory

You can also directly back up the entire keyring directory:

```bash-vue
# For Mocha testnet
cp -r ~/.celestia-<node-type>-{{constants.mochaChainId}}/keys/keyring-test /secure/backup/location

# For Mainnet Beta
cp -r ~/.celestia-<node-type>/keys/keyring-test /secure/backup/location
```

### Recovering your key

If you need to recover your key on a new machine or after reinstalling your node:

#### Option 1: Recover using the mnemonic

If you have the mnemonic phrase for your key:

```bash
cel-key add <key-name> --recover --keyring-backend test --node.type <node-type> --p2p.network <network>
```

For example:

```bash
cel-key add my_celes_key --recover --keyring-backend test --node.type light --p2p.network mocha
```

You'll be prompted to enter your mnemonic phrase.

#### Option 2: Restore from backup

If you backed up the keyring directory:

1. Install and initialize your node as normal
2. Stop the node if it's running
3. Replace the keyring-test directory with your backup:

```bash-vue
# For Mocha testnet
cp -r /secure/backup/location/* ~/.celestia-<node-type>-{{constants.mochaChainId}}/keys/keyring-test/

# For Mainnet Beta
cp -r /secure/backup/location/* ~/.celestia-<node-type>/keys/keyring-test/
```

4. Start your node with the restored key:

```bash
celestia <node-type> start --p2p.network <network> --keyring.keyname <key-name> [other flags]
```

### Using a specific key with your node

If you have multiple keys and want to use a specific one with your node:

```bash
celestia <node-type> start --p2p.network <network> --keyring.keyname <key-name> [other flags]
```

For example:

```bash
celestia light start --p2p.network mocha --keyring.keyname my_celes_key --core.ip rpc-mocha.pops.one
```

This ensures your node uses the specified key for all operations, including those reported by `celestia state account-address`.

## Docker and `cel-key`

### Prerequisites

- Docker installed on your machine
- Understanding of the
  [guide on how to run celestia-node with Docker](/how-to-guides/docker-images.md).

### Running your node

Run the Docker image (in this example, we are using a light node on Mocha
testnet):

```bash-vue
docker run --name celestia-node -e NODE_TYPE=light -e P2P_NETWORK=mocha -p 26659:26659 \
ghcr.io/celestiaorg/celestia-node:{{mochaVersions['node-latest-tag']}} celestia light start \
--core.ip rpc-mocha.pops.one --core.port 9090 --p2p.network mocha
```

<!-- markdownlint-enable MD013 -->

:::tip
Refer to
[the ports section of the celestia-node troubleshooting page](/how-to-guides/celestia-node-troubleshooting.md#ports)
for information on which ports are required to be open on your machine.

You do not need to declare a network for Mainnet Beta. Refer to
[the chain ID section on the troubleshooting page for more information](/how-to-guides/celestia-node-troubleshooting.md)
:::

List active containers in another window with:

```bash
docker ps
```

The response will look like:

<!-- markdownlint-disable MD013 -->

```bash
CONTAINER ID   IMAGE           COMMAND                  CREATED          STATUS          PORTS      NAMES
<container-id>   celestia-node   "/entrypoint.sh cele…"   22 seconds ago   Up 21 seconds   2121/tcp   docker-compose-test-celestia-1
```

<!-- markdownlint-enable MD013 -->

Interact with the container by replacing `<container-id>` for the container ID:

```bash
docker exec -ti <container-id> /bin/bash
```

Now, interact with `cel-key` to check for the key that was autogenerated when
you started the node:

```bash
./cel-key list --keyring-backend test --node.type light
```

You can also export your key from the container. In the next section, you'll
learn how to mount existing keys to the container.

### Mounting existing keys to container

In this example, we'll be mounting an existing key to the container. We're also
using an existing image called celestia-node. This will mount the entire
`/.celestia-light-<p2p-network>/keys` directory to your image, or on Mainnet Beta
the `/.celestia-light/keys` directory.

Write a `docker-compose.yml` to accomplish this:

<!-- markdownlint-disable MD013 -->

```yaml-vue
version: "3.8"
services:
  celestia:
    image: celestia-node
    environment:
      - NODE_TYPE=light
    command: celestia light start --core.ip rpc-mocha.pops.one --core.port 9090 --p2p.network mocha --keyring.keyname my_celes_key
    volumes:
      - ${PWD}/keys:/root/.celestia-light-{{constants.mochaChainId}}/keys
    ports:
      - 26659:26659
```

Start the container by running the following command in the directory with your `docker-compose.yml`:

```bash
docker-compose up
```

List active containers in another window with:

```bash
docker ps
```

The response will look like:

```bash
CONTAINER ID   IMAGE           COMMAND                  CREATED          STATUS          PORTS      NAMES
<container-id>   celestia-node   "/entrypoint.sh cele…"   22 seconds ago   Up 21 seconds   2121/tcp   docker-compose-test-celestia-1
```

Interact with the container by replacing `<container-id>` for the container ID:

```bash
docker exec -ti <container-id> /bin/bash
```

Now, interact with `cel-key` to check your address matches the address you
expect with the key you mounted:

```bash-vue
root@<container-id>:/# ./cel-key list --keyring-backend test --node.type light
using directory:  ~/.celestia-light-{{constants.mochaChainId}}/keys
- address: celestia1wkhyhr7ngf0ayqlpnsnxg4d72hfs5453dvunm9
  name: my_celes_key
  pubkey: '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"A1/NsoY0RGL7Hqt4VWLg441GQKJsZ2fBUnZXipgns8oV"}'
  type: local
```

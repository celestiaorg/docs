---
description: Use the cel-key utility to generate a wallet on celestia-node.
prev:
  text: "New Blobstream X deployments"
  link: "/developers/blobstream-x-deploy"
---

# Create a wallet with celestia-node

This tutorial will go over using the `cel-key` utility
to generate a wallet on celestia-node.

While this tutorial will go over installation process
of `cel-key`, it is recommended that you complete
the following prerequisites first:

- [Setting up your environment](../nodes/environment.md)

Once you completed the prerequisite, you can proceed with this
tutorial.

## Using the `cel-key` utility

Inside the celestia-node repository is a utility called `cel-key` that uses
the key utility provided by Cosmos-SDK under the hood. The utility can be
used to `add`, `delete`, and manage keys for any DA node
type `(bridge || full || light)`, or just keys in general.

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
[the chain ID section on the troubleshooting page for more information](../nodes/celestia-node-troubleshooting.md)
:::

::: code-group

<!-- markdownlint-disable MD013 -->

```bash-vue [Bridge]
./cel-key add <key-name> --keyring-backend test --node.type bridge \
  --p2p.network <network>
```

```bash-vue [Full]
./cel-key add <key-name> --keyring-backend test --node.type full \
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

- `--node.store`: Specifies a different directory you can use to
  save your node data and configurations. Expects a path to a directory.
- `--p2p.network`: Specifies which network you want the key for. Values
  are `arabica` and `mocha`. Please note the default network will be `mocha`.

Keep in mind that your celestia-node will only pick up keys that
are inside the `node.store` directory under `/keys` so you should make
sure to point `cel-key` utility to the correct directory via the
`node.store` or `p2p.network` flags if you have specified a custom
directory or network other than Mocha.

Also keep in mind that if you do not specify a network with `--p2p.network`,
the default one will always be `mocha`.

### Steps for exporting node keys

You can export a private key from the local keyring in encrypted and
ASCII-armored format.

::: code-group

<!-- markdownlint-disable MD013 -->

```bash-vue [Bridge]
./cel-key export <key-name> --keyring-backend test --node.type bridge \
  --p2p.network <network>
```

```bash-vue [Full]
./cel-key export <key-name> --keyring-backend test --node.type full \
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

```bash-vue [Full]
./cel-key add <key-name> --recover --keyring-backend test \
  --node.type full --p2p.network <network>
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

## Docker and `cel-key`

### Prerequisites

- Docker installed on your machine
- Understanding of the
  [guide on how to run celestia-node with Docker](../nodes/docker-images.md).

### Running your node

Run the Docker image (in this example, we are using a light node on Mocha
testnet):

<!-- markdownlint-disable MD013 -->
<!-- markdownlint-disable MD033 -->
<script setup>
import mochaVersions from "/.vitepress/constants/mocha_versions.js";
</script>

```bash-vue
docker run --name celestia-node -e NODE_TYPE=light -e P2P_NETWORK=mocha -p 26659:26659 \
ghcr.io/celestiaorg/celestia-node:{{mochaVersions['node-latest-tag']}} celestia light start \
--core.ip rpc-mocha.pops.one --p2p.network mocha
```

<!-- markdownlint-enable MD013 -->

:::tip
Refer to
[the ports section of the celestia-node troubleshooting page](../nodes/celestia-node-troubleshooting.md#ports)
for information on which ports are required to be open on your machine.

You do not need to declare a network for Mainnet Beta. Refer to
[the chain ID section on the troubleshooting page for more information](../nodes/celestia-node-troubleshooting.md)
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

```yaml
version: "3.8"
services:
  celestia:
    image: celestia-node
    environment:
      - NODE_TYPE=light
    command: celestia light start --core.ip rpc-mocha.pops.one --p2p.network mocha --keyring.accname my_celes_key
    volumes:
      - ${PWD}/keys:/root/.celestia-light-mocha-4/keys
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

```bash
root@<container-id>:/# ./cel-key list --keyring-backend test --node.type light
using directory:  ~/.celestia-light-mocha-4/keys
- address: celestia1wkhyhr7ngf0ayqlpnsnxg4d72hfs5453dvunm9
  name: my_celes_key
  pubkey: '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"A1/NsoY0RGL7Hqt4VWLg441GQKJsZ2fBUnZXipgns8oV"}'
  type: local
```

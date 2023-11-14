---
description: Start your own devnet with a modified version of optimism-bedrock.
next:
  text: "Full stack dapp tutorial"
  link: "/developers/full-stack-modular-development-guide"
---

# Deploy an OP Stack devnet to Celestia

<!-- markdownlint-disable MD033 -->
<script setup>
import constants from '/.vitepress/constants/constants.js'

</script>

In order to deploy a devnet to Celestia, you will need to have a modified
version of `optimism-bedrock`.
Refer to the
[steps to install dependencies and the modified version of OP Stack](./optimism-devnet.md)
for your environment setup.

## Pick your deployment type

Using Celestia and OP stack, you have the option to either
run a light node of your own or a `local-celestia-devnet`,
both of which will give you a local devnet to test things out with.

### Using a local devnet

If you'd like to use the `local-celestia-devnet`, you're in luck!
This is the default for the OP Stack + Celestia repository. Head
to the [previous page](./optimism-devnet.md) to get started.

### Using a light node

This is a **beta integration** and we are working on resolving
[open issues](https://github.com/celestiaorg/optimism/issues/).

In order to allow your light node to post
and retrieve data without errors, you will need to change `UseShareExchange`
to `false` in:

::: code-group

```bash-vue [Mainnet Beta]
$HOME/.celestia-light/config.toml
```

```bash-vue [Mocha]
$HOME/.celestia-light-{{constants.mochaChainId}}/config.toml
```

```bash-vue [Arabica]
$HOME/.celestia-light-{{constants.arabicaChainId}}/config.toml
```

:::

If you choose to use your own node store, the light node
must be **fully synced** and **funded** for you to be able to submit
and retrieve `PayForBlobs` to a Celestia network.

If it is not synced, you will run into
[errors similar to this](https://github.com/celestiaorg/celestia-node/issues/2151/).

Visit the [Arabica](../nodes/arabica-devnet.md)
or [Mocha](../nodes/mocha-testnet.md) pages to
to visit their faucets.

In order to mount existing data, you must have a node store that is
in this directory:

::: code-group

```bash-vue [Mainnet Beta]
$HOME/.celestia-light
```

```bash-vue [Mocha]
$HOME/.celestia-light-{{constants.mochaChainId}}
```

```bash-vue [Arabica]
$HOME/.celestia-light-{{constants.arabicaChainId}}
```

:::

This is the default location of the node store
when you initialize and run a new Celestia node.

By default, the node will run with the account named
`my_celes_key`.

If you have your own setup you'd like to try, you can always edit
`optimism/ops-bedrock/docker-compose.yml` to work with your setup.

### Using a RaaS provider

If you'd like to use a Rollups as a Service (RaaS) provider, you can do so
by going to the RaaS category in the menu.

## Build the devnet

Build TypeScript definitions for TS dependencies:

```bash
cd $HOME
cd optimism
make build-ts
```

Set environment variables to start network:

```bash
export SEQUENCER_BATCH_INBOX_ADDRESS=0xff00000000000000000000000000000000000000
export L2OO_ADDRESS=0x70997970C51812dc3A010C7d01b50e0d17dc79C8
```

## Start the devnet

First, make sure your light node is synced and funded.

This example is for Mainnet Beta.
You can modify the `da:` section of your `docker-compose.yml`
for your specific use, simiarly to the example below:

::: warning
The user in the `docker-compose.yml` is the `root` user,
but this is not meant to be used in production.
:::

<!-- markdownlint-disable MD013 -->
```yaml
da:
    user: root
    platform: "${PLATFORM}"
    image: "ghcr.io/celestiaorg/celestia-node:v0.12.0"
    command: celestia light start --core.ip rpc.celestia.pops.one --p2p.network celestia --log.level debug --gateway
    environment:
      - NODE_TYPE=light
      - P2P_NETWORK=mocha
    ports:
      - "26657:26657"
      - "26658:26658"
      - "26659:26659"
    volumes:
      - $HOME/.celestia-light/:/home/celestia/.celestia-light/
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:26659/header/1"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
```
<!-- markdownlint-enable MD013 -->

And in `bedrock-devnet/devnet__init__.py`

```py
    result = run_command(["celestia", "light", "auth", "admin"],
        cwd=paths.ops_bedrock_dir, capture_output=True,
    )
```

## View the logs of the devnet

If you'd like to view the logs of the devnet, run the following command
from the root of the Optimism directory:

```bash
make devnet-logs
```

## Stop the devnet

To safely stop the devnet, run the following command:

```bash
make devnet-down
```

## Clean the devnet

To remove all data from the devnet, run the following command:

```bash
make devnet-clean
```

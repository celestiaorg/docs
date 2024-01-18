---
description: Start your own devnet with a modified version of optimism-bedrock.
next:
  text: "Wallet with celestia-app"
  link: "/developers/celestia-app-wallet"
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
make
```

Set environment variables to start network:

```bash
export SEQUENCER_BATCH_INBOX_ADDRESS=0xff00000000000000000000000000000000000000
export L2OO_ADDRESS=0x70997970C51812dc3A010C7d01b50e0d17dc79C8
```

## Start the devnet

First, make sure your light node is synced and funded. It must
not be running for this example to work.

This example is for Mainnet Beta.
You can modify the `da:` section of your `$HOME/optimism/ops-bedrock/docker-compose.yml`
for your specific use, similarly to the example below:

This setup will use `celestia-da`, which is `celestia-node` with
a DA server on port 26650.

For the `P2P_NETWORK` variable, you'll need to supply the network of choice, either
`celestia`, `mocha`, or `arabica`. Using `celestia`, the volume path will be just
`.celestia-light` instead of `.celestia-light-<network>`. You will also need
to provide a core.ip RPC URL for the network you are using.

<!-- markdownlint-disable MD013 -->

```yaml
da:
  image: ghcr.io/rollkit/local-celestia-devnet:v0.12.1 // [!code --]
  image: ghcr.io/rollkit/celestia-da:v0.12.9 // [!code ++]
  command: > // [!code ++]
    celestia-da light start // [!code ++]
    --p2p.network=<network> // [!code ++]
    --da.grpc.namespace=000008e5f679bf7116cb // [!code ++]
    --da.grpc.listen=0.0.0.0:26650 // [!code ++]
    --core.ip <rpc-url> // [!code ++]
    --gateway // [!code ++]
  environment: // [!code ++]
      - NODE_TYPE=light // [!code ++]
      - P2P_NETWORK=<network> // [!code ++]
  ports:
    - "26650:26650"
    - "26658:26658"
    - "26659:26659"
  volumes: // [!code ++]
    - $HOME/.celestia-light-<network>/:/home/celestia/.celestia-light-<network>/ // [!code ++]
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:26659/header/1"]
    interval: 10s
    timeout: 5s
    retries: 5
    start_period: 30s
```

Now start the devnet:

```bash
make devnet-up
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

## Deploying to an L1 (or L2)

If you'd like to deploy to an EVM L1 or L2,
reference the [OP stack deployment guide](https://community.optimism.io/docs/developers/bedrock/node-operator-guide/).

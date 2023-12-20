---
description: An overview of the deploying Arbitrum Nitro and Celestia rollup to Mocha testnet.
---

# Deploy an Arbitrum rollup to Mocha testnet

<!-- markdownlint-disable MD033 -->
<script setup>
import constants from '/.vitepress/constants/constants.js'
</script>

This guide covers deploying an Arbitrum Nitro rollup to
[Mocha testnet](../nodes/mocha-testnet.md) using Celestia as DA.

## Dependencies

- [Introduction to Arbitrum rollups with Celestia as DA](./arbitrum-integration.md)
- [Deploy an Arbitrum rollup devnet](./arbitrum-deploy.md)
- A fully synced and funded Mocha testnet [light node](../nodes/light-node.md)
  - [Mocha testnet faucet](../nodes/mocha-testnet#mocha-testnet-faucet)

## Setting up your light node

<!-- markdownlint-disable MD013 -->

1.  Fully sync and fund a light node on Mocha testnet using the binary.
    This will use default node store of `$HOME/.celestia-light-{{constants.mochaChainId}}`.
    This is what the docker-compose setup for the testnode will pick up
    as a node store. If you choose to use another node store, you will need
    to make changes yourself to reflect this.

2.  Change the following in
    [`nitro-testnode/docker-compose.yaml`](https://github.com/celestiaorg/nitro-testnode/blob/e4e5acd36890e650c581188ef746a7b02202583a/docker-compose.yaml#L3-L15):

        ```bash-vue
        da:
            user: root // [!code ++]
            platform: linux/x86_64
            image: "ghcr.io/rollkit/local-celestia-devnet:v0.12.1" // [!code --]
            image: "ghcr.io/celestiaorg/celestia-node:v0.12.1" // [!code ++]
            command: > // [!code ++]
                    celestia light start // [!code ++]
                    --core.ip rpc-mocha.pops.one // [!code ++]
                    --p2p.network mocha // [!code ++]
                    --log.level debug --gateway // [!code ++]
                    --gateway.addr 0.0.0.0 // [!code ++]
                    --rpc.addr 0.0.0.0 // [!code ++]
            environment: // [!code ++]
              - NODE_TYPE=light // [!code ++]
              - P2P_NETWORK=mocha // [!code ++]
            ports:
              - "26657:26657"
              - "26658:26658"
              - "26659:26659"
            volumes: // [!code ++]
              - $HOME/.celestia-light-{{constants.mochaChainId}}/:/home/celestia/.celestia-light-{{constants.mochaChainId}}/ // [!code ++]
            healthcheck:
              test: ["CMD", "curl", "-f", "http://localhost:26659/header/1"]
              interval: 10s
              timeout: 5s
              retries: 5
              start_period: 30s
        ```

        :::warning
        It is not advised to run with `user: root` permissions in production.
        :::

3.  In [`nitro-testnode/test-node.bash`](https://github.com/celestiaorg/nitro-testnode/blob/e4e5acd36890e650c581188ef746a7b02202583a/test-node.bash#L7-L287)
    make the following changes:

        ```bash-vue
        # Line 7
        NODE_PATH="/home/celestia/bridge/" // [!code --]
        NODE_PATH="/home/celestia/.celestia-light-{{constants.mochaChainId}}/" // [!code ++]

        # Line 287
        export CELESTIA_NODE_AUTH_TOKEN="$(docker exec nitro-testnode_da_1 celestia bridge auth admin --node.store  ${NODE_PATH})" // [!code --]
        export CELESTIA_NODE_AUTH_TOKEN="$(docker exec nitro-testnode_da_1 celestia light auth admin --node.store  ${NODE_PATH})" // [!code ++]
        ```

4.  Pick a namespace, `<your-10bytenamespace>` that is 10 bytes in hexadecimal.
    In [`nitro-testnode/scripts/config.ts`](https://github.com/celestiaorg/nitro-testnode/blob/e4e5acd36890e650c581188ef746a7b02202583a/scripts/config.ts#L223-L224)
    make the following changes:

        ```bash
        "tendermint-rpc": "http://da:26657", // [!code --]
        "tendermint-rpc": "http://rpc-mocha.pops.one:26657", // [!code ++]
        "namespace-id": "000008e5f679bf7116cb", // [!code --]
        "namespace-id": "<your-10bytenamespace>", // [!code ++]
        ```

## Run your Nitro rollup on Mocha

1. Start your rollup:

   ```bash
   ./test-node.bash --init --dev
   ```

2. Send a transaction:

   ```bash
   ./test-node.bash script send-l2 --to address_0x1111222233334444555566667777888899990000
   ```

3. Find [the batch transaction on mocha](https://mocha.celenium.io/tx/ab5a97ddcf310417cabd57915d0f15f1071b941b902989e974f4025391c71512)
   in the namespace you used. In this demonstration, I used
   [the `nitrovroom` namespace](https://mocha.celenium.io/namespace/0000000000000000000000000000000000006e6974726f76726f6f6d).

Congratulations! Your Arbitrum Nitro rollup testnet is now posting
to Mocha testnet for data availability. 🏎️

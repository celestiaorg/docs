---
description: A guide on how to run a full node or validating full node on your Orbit rollup.
---

# Running a full node and/or validator

## Prerequisites

- Familiarity with Ethereum, Ethereum's testnets, Arbitrum, and Celestia
- [A gentle introduction: Orbit chains](https://docs.arbitrum.io/launch-orbit-chain/orbit-gentle-introduction)
- [Arbitrum Orbit integration overview](./arbitrum-integration.md)
- [Quickstart: Deploy an Arbitrum Orbit rollup](./arbitrum-deploy.md)

## Running a full node

To run a full node, you can
[follow the steps outlined in the Arbitrum docs](https://docs.arbitrum.io/node-running/how-tos/running-an-orbit-node),
with the difference being that you will use this image:
**`dfcelestia/nitro-node-dev:latest`** instead of the one mentioned
in the Arbitrum docs.

Note that you can either use the flags in the nitro binary + the flags
[found in the celestia package](https://github.com/celestiaorg/nitro/blob/fbf5bba3ed76ed30f3c1f5d545d17f1d741940bf/das/celestia/celestia.go#L31-L46),
or you can just provide a node `config.json` file with the `celestia-cfg`
for them to run it, which would look something like this:

```json
docker run --rm -v "$HOME/Documents/configs/nodeConfig.json:/config.json:ro" \
  --network host celestia-nitro:v3.0.0 --conf.file /config.json
```

## Running a full node with validation

The information above applies to
[the steps outlined to run a validating full node (validator)](https://docs.arbitrum.io/node-running/how-tos/running-a-validator).

Finally, note that this will require connection to a DA node,
and we recommend running a Bridge node if you will be instantiating
multiple rollups.

### Configuring your validating full node

An optional configuration is required when running a validating full node.
Configuration options for validating full nodes include:

- **`tendermint-rpc`:** a celestia-core endpoint from a full node
(**NOTE:** only needed for a batch poster node)
- **`eth-rpc`:** Ethereum Client WSS RPC endpoint, only used when the node is a batch
poster. The eth-rpc must be WSS. Otherwise, it won't be able to subscribe to events
for Blobstream.
- **`blobstream`:** address of the Blobstream X contract on the base chain.
  - Note that the `SequencerInbox` contract for each chain has a constant
  address for the `BlobstreamX` contract, thus make sure that the Blobstream X
  address in the `SequencerInbox` being used for the templates in
  `RollupCreator` matches the one in your config.

An example configuration with `validator-config` can be found below:

```ts
"celestia-cfg": {
  "enable": true,
  "gas-price": 0.01,
  "gas-multiplier": 1.01,
  "rpc": "http://host.docker.internal:26658",
  "namespace-id": "<YOUR_10_BYTE_NAMESPACE>",
  "auth-token": "<YOUR_AUTH_TOKEN>",
  "noop-writer": false,
  "validator-config": {
    "tendermint-rpc": "http://consensus-full-mocha-4.celestia-mocha.com:26657",
    "eth-rpc": "wss://<YOUR_ETH_RPC_WSS_URL>",
    "blobstream": "0xc3e209eb245Fd59c8586777b499d6A665DF3ABD2",
  },
}
```

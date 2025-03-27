---
description: A guide on how to run a full node or validate a full node on your Orbit rollup.
next:
  text: "Introduction to OP Stack integration"
  link: "/how-to-guides/intro-to-op-stack"
---

# Running a full node and/or validator

## Prerequisites

- Familiarity with Ethereum, Ethereum's testnets, Arbitrum, and Celestia
- [A gentle introduction: Orbit chains](https://docs.arbitrum.io/launch-orbit-chain/orbit-gentle-introduction)
- [Arbitrum Orbit integration overview](/how-to-guides/arbitrum-integration.md)

## Running a full node

To run a full node, you can
[follow the steps outlined in the Arbitrum docs](https://docs.arbitrum.io/node-running/how-tos/running-an-orbit-node),
with the difference being that you will use this image:
**`dfcelestia/nitro-node-dev:latest`** instead of the one mentioned
in the Arbitrum docs.

Note that you can either use the flags in the nitro binary + the flags
[found in the `celestia` package](https://github.com/celestiaorg/nitro/blob/v2.3.1-rc.1/das/celestia/celestia.go#L53-L65),
or you can just provide a node `config.json` file with the `celestia-cfg`
for them to run it, which would look something like this:

```json
docker run --rm -v "$HOME/Documents/configs/nodeConfig.json:/config.json:ro" \
  --network host celestia-nitro:v2.3.1-rc.1 --conf.file /config.json
```

## Running a full node with validation

The information above applies to
[the steps outlined to run a validating full node (validator)](https://docs.arbitrum.io/node-running/how-tos/running-a-validator).

Finally, note that this will require connection to a DA node,
and we recommend running a Bridge node if you will be instantiating
multiple rollups.

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

Running a  fullnode or validator for an Orbit chain with Celestia DA is as simple as
[following the steps outlined in the Arbitrum docs](https://docs.arbitrum.io/run-arbitrum-node/run-full-node),
but using a docker image from the [latest stable release](https://github.com/celestiaorg/nitro/releases) of the Celestia integration and passing the following flags:

- `node.celestia-cfg.enable=true`
- `node.celestia-cfg.url=$URL_TO_DA_SERVER`

or adding the following to your config:

```
"node": {
 ...
    "celestia-cfg": {
        "enable": true,
        "url": "DA_SERVER_URL"
    },
}
```

## Running a Celestia DA server

For instructions on how to run a DA server, please refer to the [repo docs](https://github.com/celestiaorg/nitro-das-celestia).

Note that you can either run a light node, a bridge node, or a paid provider like [Quicknode](https://www.quicknode.com/docs/celestia) to connect your DA Server with the targeted Celestia network.

## Running a full node with validation

The information above applies to
[the steps outlined to run a validating full node (validator)](https://docs.arbitrum.io/node-running/how-tos/running-a-validator), with the addition of [configuring the DA Server to run as a validator](https://github.com/celestiaorg/nitro-das-celestia?tab=readme-ov-file#running-a-validator).

Finally, note that this will require connection to a DA node,
and we recommend running a Bridge node if you will be instantiating
multiple rollups.

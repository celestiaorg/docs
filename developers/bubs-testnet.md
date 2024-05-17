---
description: The first testnet built with OP Stack and Celestia.
next:
  text: "Deploy a smart contract on Bubs testnet"
  link: "/developers/deploy-on-bubs"
---

# Bubs testnet

![Bubs testnet](/img/Celestia_Bubs_Testnet.jpg)

[Bubs Testnet](https://bubs-sepolia.hub.caldera.xyz/) is a the first
OP Stack testnet with Celestia underneath hosted by
[Caldera](https://caldera.xyz) with support from Celestia Labs. Bubs is dedicated to providing developers with
an EVM-compatible execution layer to deploy their EVM applications on.

## Built with the OP Stack and Celestia

The Bubs Testnet is a testnet rollup, a modified version of
`optimism-bedrock` that uses Celestia as a data availability (DA)
layer. This integration can be found in the
[@celestiaorg/optimism repository](https://github.com/celestiaorg/optimism).
The testnet is hosted by [Caldera](https://caldera.xyz),
who makes it easy to launch rollups with no code required.
Bubs' data is posted to Celestia
on the [Mocha testnet](../nodes/mocha-testnet.md).
[View the namespace for Bubs on Celestia's Mocha testnet](https://mocha-4.celenium.io/namespace/000000000000000000000000000000000000ca1de12ad45362e77e87).

[Learn more about the setup of the integration in
the introduction](./intro-to-op-stack.md#about-the-integration).

## Building on Bubs

Bubs Testnet provides a robust environment for developers to test their
Ethereum Virtual Machine (EVM) applications. It offers an EVM-compatible
execution layer, making it an ideal platform for developers looking to
build and test applications in a setting that closely mirrors an OP Stack
rollup on Celestia.

Learn more at [https://bubs-sepolia.hub.caldera.xyz/](https://bubs-sepolia.hub.caldera.xyz/).

### RPC URLs

Remote Procedure Call (RPC) URLs are endpoints that allow developers to
interact with the blockchain. They are essential for sending transactions,
querying blockchain data, and performing other interactions with the
blockchain.

For the Bubs Testnet, you can connect to the following RPC URLs:

#### HTTPS

- `https://bubs-sepolia.rpc.caldera.xyz/http`

#### WSS

- `wss://bubs-sepolia.rpc.caldera.xyz/ws`

This URL serves as the entry point to the Bubs Testnet. You can use it
in your applications to connect to the testnet and interact with the smart
contracts you deploy there.

Remember, Bubs Testnet is a testing environment!

### Bridge

Bridging is a process that enables the transfer of assets between
different blockchains.

To bridge between Ethereum Sepolia and Bubs Testnet,
visit the [Bubs Testnet bridge](https://bubs-sepolia.bridge.caldera.xyz/).

### Faucet

To visit the Bubs testnet faucet, go to
[`https://bubs-sepolia.hub.caldera.xyz/`](https://bubs-sepolia.hub.caldera.xyz/)
and click the "Faucet" tab.

### Explorer

To visit the explorer, go to
[`https://bubs-sepolia.explorer.caldera.xyz/`](https://bubs-sepolia.explorer.caldera.xyz/).

### Status

To see the status and uptime information for Bubs,
[visit the status page](https://bubs-sepolia.betteruptime.com/).

## Next steps

Now that you have a better understanding of the Bubs Testnet and its
integration of OP Stack and Celestia, you can start exploring its
capabilities.
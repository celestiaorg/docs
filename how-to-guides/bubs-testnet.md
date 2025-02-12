---
description: The first testnet built with OP Stack and Celestia.
next:
  text: "Ethereum fallback mechanism"
  link: "/how-to-guides/ethereum-fallback"
---

# Bubs testnet

![Bubs testnet](/img/Celestia_Bubs_Testnet.jpg)

[Bubs Testnet](https://bubstestnet.com/) was the first
OP Stack testnet with Celestia underneath hosted by
[Caldera](https://caldera.xyz) with support from Celestia Labs. Bubs was dedicated to providing developers with
an EVM-compatible execution layer to deploy their EVM applications on.

## Built with the OP Stack and Celestia

The Bubs Testnet was a testnet rollup, a modified version of
`optimism-bedrock` that uses Celestia as a data availability (DA)
layer. This integration can be found in the
[@celestiaorg/optimism repository](https://github.com/celestiaorg/optimism).
The testnet was hosted by [Caldera](https://caldera.xyz),
who makes it easy to launch rollups with no code required.
Bubs' data was posted to Celestia
on the [Mocha testnet](/how-to-guides/mocha-testnet.md).
[View the namespace for Bubs on Celestia's Mocha testnet](https://mocha-4.celenium.io/namespace/000000000000000000000000000000000000ca1de12ad45362e77e87).

[Learn more about the setup of the integration in
the introduction](/how-to-guides/intro-to-op-stack.md#about-the-integration).

## Building on Bubs

Bubs Testnet provides a robust environment for developers to test their
Ethereum Virtual Machine (EVM) applications. It offers an EVM-compatible
execution layer, making it an ideal platform for developers looking to
build and test applications in a setting that closely mirrors an OP Stack
rollup on Celestia.

## Next steps

Now that you understand how Bubs Testnet integrated OP Stack with Celestia, you can explore current testnet options like [Gelato's Raspberry testnet](https://raas.gelato.network/rollups/details/public/opcelestia-raspberry).

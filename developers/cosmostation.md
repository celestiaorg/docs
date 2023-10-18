---
description: How you can add Celestia network parameters to Cosmostation wallet.
---

# Cosmostation integration with Celestia

<!-- markdownlint-disable MD033 -->
<script setup>
import { versions } from '/.vitepress/versions/data.js'
</script>

This guide will go over how you can add Celestia network parameters
to Cosmostation wallet.

The example in this guide is for {{versions.chainId.mochaChainId}}
testnet, and the same workflow can be used for any Celestia network.

## Install Cosmostation

Cosmostation is a popular Cosmos-based wallet that allows anyone
to connect to Cosmos chains from their browser or phone.

You can learn more and download Cosmostation on
[the Cosmostation site](https://cosmostation.io/).

Alternatively, you can
[download and install the Chrome extension directly](https://cosmostation.io/products/cosmostation_extension).

## Add Celestia network parameters

Click the hamburger menu icon in the top corner of Cosmostation
wallet. Scroll down and click "Add Custom Chain"

You can
then add the following parameters:

- Custom Chain name: `Mocha testnet`
- Rest URL: `https://api-mocha.pops.one`
- New RPC URL: `https://rpc-mocha.pops.one`
- Currency symbol: `TIA`
- Address prefix: `celestia`
- Demon: `utia`
- Symbol image URL (optional):
  `https://raw.githubusercontent.com/cosmos/chain-registry/master/testnets/celestiatestnet/images/celestia.svg`
- Explorer URL (optional): `https://testnet.mintscan.io/celestia-testnet`
- Coin Type: `118`
- Decimals: `6`
- Gas rate Tiny: `0.1`
- Gas rate Low: `0.25`
- Gas rate Average: `0.5`

Now, click `Add a custom chain` and you will be able to view your Celestia
account balance and transactions in Cosmostation wallet.

Switch chains to "Mocha testnet" and you'll see that you're connected
to Celestia's Mocha testnet!

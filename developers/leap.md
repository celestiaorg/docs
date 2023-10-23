---
description: How you can add Celestia network parameters to Leap wallet.
prev:
  text: "Integrating Keplr for developers"
  link: "/developers/keplr"
next:
  text: "Integrating Cosmostation for developers"
  link: "/developers/cosmostation"
---

# Leap integration with Celestia

<!-- markdownlint-disable MD033 -->
<script setup>
import constants from '/.vitepress/constants/constants.js'
</script>

This guide will go over how you can add Celestia network parameters to Leap wallet.

The example in this guide is for the [Mocha testnet](../nodes/mocha-testnet.md)
([{{ constants.mochaChainId }}.](../nodes/mocha-testnet.md#software-version-numbers)),
and the same workflow can be used for any Celestia network.

## Install Leap

Leap is a popular Cosmos-based wallet that allows anyone
to connect to Cosmos chains from their browser or phone.

Learn more and [download Leap](https://www.leapwallet.io/).

Pick the
[browser or mobile device that you are using](https://www.leapwallet.io/download)
and follow the instructions to install Leap.

## Add Mocha Testnet

Click the Cosmos logo in the top corner of Leap wallet
and search for and select "Mocha Testnet".

You'll see that you're connected to Mocha testnet. You can now
see your balance, send, and receive transactions.

## Adding a custom chain to Leap

If you want to add a custom chain to Leap, you can do so by:

1. Clicking the Cosmos logo in the top corner of Leap wallet
2. Scrolling down and clicking "Add new chain"

You can
then add the following parameters:

- Chain Id: `{{ constants.arabicaChainId }}`
- Chain Name: `Arabica devnet`
- New RPC URL: `https://consensus-full.celestia-arabica-10.com`
- New REST URL: `https://api.consensus.celestia-arabica-10.com`
- Address Prefix: `celestia`
- Native Denom: `utia`
- Coin Type: `118`
- Decimals: `6`
- Block explorer URL (optional): `https://explorer.celestia-arabica-10.com`

Now, click `Add chain` and you will be able to view your Arabica
account balance and transactions in Leap wallet.

You'll see that you're connected to Arabica Devnet.

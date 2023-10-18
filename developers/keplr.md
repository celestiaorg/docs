---
description: How you can add Celestia network parameters to Keplr.
---

# Keplr integration with Celestia

<!-- markdownlint-disable MD033 -->
<script setup>
import constants from '/.vitepress/constants/constants.js'
</script>

Keplr is a popular Cosmos-based wallet that allows anyone
to connect to Tendermint chains from their browser.

In this tutorial, we will have an example that goes over how
you can add Celestia network parameters to Keplr in a React app.

Most of the overview of this integration are found on
[Keplr's website](https://docs.keplr.app/api).

## Add Celestia network to Keplr

Before we demonstrate how to export the specific parameters for
Celestia's testnets, we need to create a ReactJS component
that allows us to connect directly to Keplr and pass it the network
params.

In the following code, we show how you can export a component
that detects whether Keplr is installed and sets the network
params for it:

<!-- markdownlint-disable MD013 -->

```jsx
import React from "react";
import styles from "./Keplr.module.css";

export default function AddNetworkKeplr({ params }) {
  async function add() {
    if (!window.keplr) {
      alert("Please install keplr extension");
    } else {
      if (window.keplr.experimentalSuggestChain) {
        try {
          await window.keplr.experimentalSuggestChain({
            chainId: params.chainId,
            chainName: params.chainName,
            rpc: params.rpc,
            rest: params.rest,
            bip44: {
              coinType: 118,
            },
            bech32Config: {
              bech32PrefixAccAddr: "celestia",
              bech32PrefixAccPub: "celestia" + "pub",
              bech32PrefixValAddr: "celestia" + "valoper",
              bech32PrefixValPub: "celestia" + "valoperpub",
              bech32PrefixConsAddr: "celestia" + "valcons",
              bech32PrefixConsPub: "celestia" + "valconspub",
            },
            currencies: [
              {
                coinDenom: "TIA",
                coinMinimalDenom: "utia",
                coinDecimals: 6,
                coinGeckoId: "celestia",
              },
            ],
            feeCurrencies: [
              {
                coinDenom: "TIA",
                coinMinimalDenom: "utia",
                coinDecimals: 6,
                coinGeckoId: "celestia",
                gasPriceStep: {
                  low: 0.1,
                  average: 0.2,
                  high: 0.4,
                },
              },
            ],
            stakeCurrency: {
              coinDenom: "TIA",
              coinMinimalDenom: "utia",
              coinDecimals: 6,
              coinGeckoId: "celestia",
            },
          });
        } catch {
          alert("Failed to suggest the chain");
        }
      }
      const chainId = params.chainId;
      // Enabling before using the Keplr is recommended.
      // This method will ask the user whether to allow access if they haven't visited this website.
      // Also, it will request that the user unlock the wallet if the wallet is locked.
      await window.keplr.enable(chainId);
    }
  }

  return (
    <div className={styles.center}>
      <button className={styles.keplrButton} onClick={add}>
        Add/Switch To {params.chainName}
      </button>
    </div>
  );
}
```

<!-- markdownlint-enable MD013 -->

This example is just for using Celestia configs.

We still need to pass the Celestia network params for it.

We can do it for both testnets in the following section.

You can also test out the `Connect` button to add those
params to your Keplr wallet. NOTE: You must have Keplr installed
first.

Behind the scenes, here are the parameters
you will pass to the `AddNetworkKeplr`
function:

::: code-group

```js-vue [Mocha]
import '@site/src/components/AddNetworkKeplr'

export const MOCHA_PARAMS = {`{
  chainId: '{{constants.mochaChainId}}',
  chainName: 'Mocha testnet',
  rpc: 'https://rpc-mocha.pops.one',
  rest: 'https://api-mocha.pops.one/'
}`}

{<AddNetworkKeplr params={MOCHA_PARAMS}/>}
```

```js-vue [Arabica]
import '@site/src/components/AddNetworkKeplr'

export const ARABICA_PARAMS = {`{
  chainId: '{{constants.arabicaChainId}}',
  chainName: 'Arabica devnet',
  rpc: 'https://consensus-full.celestia-arabica-10.com/',
  rest: 'https://api.consensus.celestia-arabica-10.com/'
}`}

{<AddNetworkKeplr params={ARABICA_PARAMS}/>}
```

:::

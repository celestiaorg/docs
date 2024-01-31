---
description: How you can add Celestia network parameters to wallets.
---

# Wallet integration with Celestia

<!-- markdownlint-disable MD033 -->
<script>
import constants from '/.vitepress/constants/constants.js'

This page covers how developers can integrate Celestia chains
with existing wallets.

## Add Celestia network

Before we demonstrate how to export the specific parameters for
Celestia's testnets, we need to create a ReactJS component
that allows us to connect directly to Keplr and pass it the network
params.

In the following code, we show how you can export a component
that detects whether Keplr is installed and sets the network
params for it:

::: code-group

<!-- markdownlint-disable MD013 -->

```jsx [Keplr]
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
                  low: 0.01,
                  average: 0.02,
                  high: 0.1,
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
        Add/switch To {params.chainName}
      </button>
    </div>
  );
}
```

:::

<!-- markdownlint-enable MD013 -->

This example is just for using Celestia configs.

We still need to pass the Celestia network params for it and
we will for both testnets in the following section.

You can also test out the `Connect` button to add those
params to your Keplr wallet. NOTE: You must have Keplr installed
first.

Behind the scenes, here are the parameters
we are passing to the `AddNetworkKeplr`
function:

::: code-group

```js-vue [Mainnet Beta]
import '@site/src/components/AddNetworkKeplr'

export const MAINNET_PARAMS = {`{
  chainId: '{{constants.mainnetChainId}}',
  chainName: 'Celestia',
  rpc: '{{constants.mainnetRpcUrl}}',
  rest: '{{constants.mainnetRestUrl}}'
}`}

{<AddNetworkKeplr params={MAINNET_PARAMS}/>}
```

```js-vue [Mocha]
import '@site/src/components/AddNetworkKeplr'

export const MOCHA_PARAMS = {`{
  chainId: '{{constants.mochaChainId}}',
  chainName: 'Mocha testnet',
  rpc: '{{constants.mochaRpcUrl}}',
  rest: '{{constants.mochaRestUrl}}'
}`}

{<AddNetworkKeplr params={MOCHA_PARAMS}/>}
```

```js-vue [Arabica]
import '@site/src/components/AddNetworkKeplr'

export const ARABICA_PARAMS = {`{
  chainId: '{{constants.arabicaChainId}}',
  chainName: 'Arabica devnet',
  rpc: '{{constants.arabicaRpcUrl}}',
  rest: '{{constants.arabicaRestUrl}}'
}`}

{<AddNetworkKeplr params={ARABICA_PARAMS}/>}
```

:::

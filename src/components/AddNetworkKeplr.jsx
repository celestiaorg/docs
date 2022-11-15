import React from 'react'
import styles from './Keplr.module.css'

export default function AddNetworkKeplr({params}){
  async function add() {
    if (!window.keplr) {
        alert("Please install keplr extension");
    } else {
        if (window.keplr.experimentalSuggestChain){
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
													average: 0.025,
													high: 0.04,
											},
									},
							],
							stakeCurrency: {
									coinDenom: "TIA",
									coinMinimalDenom: "utia",
									coinDecimals: 6,
									coinGeckoId: "celestia",
							},   
            }) 
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
      <button className={styles.keplrButton} onClick={add}>Add/Switch To {params.chainName}</button> 
    </div>
  )
}

<template>
  <div class="center">
    <button class="keplrButton" @click="add">{{ `Add/switch to ${params.chainName}` }}</button>
  </div>
</template>

<script>
export default {
  props: ['params'],
  methods: {
    async add() {
      if (!window.keplr) {
        alert("Please install keplr extension");
      } else {
        if (window.keplr.experimentalSuggestChain){
          try {
            await window.keplr.experimentalSuggestChain({
              chainId: this.params.chainId, 
              chainName: this.params.chainName,
              rpc: this.params.rpc,
              rest: this.params.rest,
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
            }) 
          } catch {
            alert("Failed to suggest the chain");
          }
        }
        const chainId = this.params.chainId;
        await window.keplr.enable(chainId);
      }
    }
  }
}
</script>

<style scoped>
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 9vh;
}

.keplrButton {
  padding: 10px 20px;
  background-color: #7B2BF9;
  border: none;
  color: white;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
  transition-duration: 0.4s;
}

.keplrButton:hover {
  background-color: #FFFFC5; 
  color: black; 
  border: 2px solid #7B2BF9;
}

</style>
<template>
  <ul>
    <li>
      Celestia Chain ID - 
      <a 
        :href="`https://github.com/celestiaorg/networks/tree/master/${versions.chainId.coffeeChainId}`"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ versions.chainId.coffeeChainId }}
      </a>
    </li>
    <li>
      Celestia Node - 
      <a 
        :href="`https://github.com/celestiaorg/celestia-node/releases/tag/${versions.nodeTag.nodeTagCoffee}`"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ versions.nodeTag.nodeTagCoffee }}
      </a>
    </li>
    <li>
      Celestia App - 
      <a 
        :href="`https://github.com/celestiaorg/celestia-app/releases/tag/${versions.appTag.appTagCoffee}`"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ versions.appTag.appTagCoffee }}
      </a>
    </li>
    <li>
      Rollkit - 
      <a 
        :href="`https://github.com/rollkit/rollkit/releases/tag/${versions.rollkitVersion.coffeeRollkitVersion}`"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ versions.rollkitVersion.coffeeRollkitVersion }}
      </a>
    </li>
  </ul>
</template>

<script>
import { versions } from "/.vitepress/versions/data.js";

export default {
  name: 'CoffeeVersionTags',
  data() {
    return {
      versions
    };
  }
}
</script>
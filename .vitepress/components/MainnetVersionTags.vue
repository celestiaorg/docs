<template>
  <ul>
    <li>
      Celestia chain ID - 
      <a 
        :href="`https://github.com/celestiaorg/networks/tree/master/${constants.mainnetChainId}`"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ constants.mainnetChainId }}
      </a>
    </li>
    <li>
      celestia-node - 
      <a 
        :href="`https://github.com/celestiaorg/celestia-node/releases/tag/${mainnetVersions['node-latest-tag']}`"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ mainnetVersions['node-latest-tag'] }}
      </a>
    </li>
    <li>
      celestia-app - 
      <a 
        :href="`https://github.com/celestiaorg/celestia-app/releases/tag/${mainnetVersions['app-latest-tag']}`"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ mainnetVersions['app-latest-tag'] }}
      </a>
    </li>
    <li>
      Rollkit - 
      <a 
        :href="`https://github.com/rollkit/rollkit/releases/tag/${constants.mainnetRollkitVersion}`"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ constants.mainnetRollkitVersion }}
      </a>
    </li>
  </ul>
</template>

<script>
import mainnetVersions from "/.vitepress/constants/mainnet_versions.js";
import constants from "/.vitepress/constants/constants.js";

export default {
  name: 'mainnetVersionTags',
  data() {
    return {
      mainnetVersions,
      constants
    };
  }
}
</script>

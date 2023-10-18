<template>
  <ul>
    <li>
      Celestia Chain ID - 
      <a 
        :href="`https://github.com/celestiaorg/networks/tree/master/${constants.coffeeChainId}`"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ constants.coffeeChainId }}
      </a>
    </li>
    <li>
      Celestia Node - 
      <a 
        :href="`https://github.com/celestiaorg/celestia-node/releases/tag/${coffeeVersions['node-latest-tag']}`"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ coffeeVersions['node-latest-tag'] }}
      </a>
    </li>
    <li>
      Celestia App - 
      <a 
        :href="`https://github.com/celestiaorg/celestia-app/releases/tag/${coffeeVersions['app-latest-tag']}`"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ coffeeVersions['app-latest-tag'] }}
      </a>
    </li>
    <li>
      Rollkit - 
      <a 
        :href="`https://github.com/rollkit/rollkit/releases/tag/${constants.coffeeRollkitVersion}`"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ constants.coffeeRollkitVersion }}
      </a>
    </li>
  </ul>
</template>

<script>
import coffeeVersions from "/.vitepress/constants/coffee_versions.js";
import constants from "/.vitepress/constants/constants.js";

export default {
  name: 'coffeeVersionTags',
  data() {
    return {
      coffeeVersions,
      constants
    };
  }
}
</script>

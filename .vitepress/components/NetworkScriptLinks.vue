<template>
  <div>
    <ul>
      <li>Local devnet: <a href="https://github.com/celestiaorg/celestia-app/blob/main/scripts/single-node.sh" target="_blank" rel="noopener noreferrer">https://github.com/celestiaorg/celestia-app/blob/main/scripts/single-node.sh</a></li>
      <li>Arabica: <a :href="`https://github.com/celestiaorg/celestia-app/blob/${arabicaVersions['app-latest-tag']}/scripts/arabica.sh`" target="_blank" rel="noopener noreferrer">{{ `https://github.com/celestiaorg/celestia-app/blob/${arabicaVersions['app-latest-tag']}/scripts/arabica.sh` }}</a></li>
      <li>Mocha: <a :href="`https://github.com/celestiaorg/celestia-app/blob/${mochaVersions['app-latest-tag']}/scripts/mocha.sh`" target="_blank" rel="noopener noreferrer">{{ `https://github.com/celestiaorg/celestia-app/blob/${mochaVersions['app-latest-tag']}/scripts/mocha.sh` }}</a></li>
      <li>Mainnet Beta: <a :href="`https://github.com/celestiaorg/celestia-app/blob/${mainnetVersions['app-latest-tag']}/scripts/mainnet.sh`" target="_blank" rel="noopener noreferrer">{{ `https://github.com/celestiaorg/celestia-app/blob/${mainnetVersions['app-latest-tag']}/scripts/mainnet.sh` }}</a></li>
    </ul>
  </div>
</template>

<script>
import arabicaVersions from "/.vitepress/constants/arabica_versions.js";
import mochaVersions from "/.vitepress/constants/mocha_versions.js";
import mainnetVersions from "/.vitepress/constants/mainnet_versions.js";

export default {
  name: 'NetworkScriptLinks',
  data() {
    return {
      arabicaVersions,
      mochaVersions,
      mainnetVersions
    };
  }
}
</script>
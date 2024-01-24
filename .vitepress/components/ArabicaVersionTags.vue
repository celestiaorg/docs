<template>
  <table>
    <tr>
      <th>Software</th>
      <th>Version</th>
    </tr>
    <tr>
      <td>celestia-node</td>
      <td>
        <a 
          :href="`https://github.com/celestiaorg/celestia-node/releases/tag/${arabicaVersions['node-latest-tag']}`"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ arabicaVersions['node-latest-tag'] }}
        </a>
      </td>
    </tr>
    <tr>
      <td>celestia-app</td>
      <td>
        <a 
          :href="`https://github.com/celestiaorg/celestia-app/releases/tag/${arabicaVersions['app-latest-tag']}`"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ arabicaVersions['app-latest-tag'] }}
        </a>
      </td>
    </tr>
  </table>
</template>

<script>
import arabicaVersions from "/.vitepress/constants/arabica_versions.js";
import constants from "/.vitepress/constants/constants.js";

export default {
  name: 'ArabicaVersionTags',
  data() {
    return {
      arabicaVersions,
      constants
    };
  }
}
</script>
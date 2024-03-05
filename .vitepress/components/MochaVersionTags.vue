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
          :href="`https://github.com/celestiaorg/celestia-node/releases/tag/${mochaVersions['node-latest-tag']}`"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ mochaVersions['node-latest-tag'] }}
        </a>
      </td>
    </tr>
    <tr>
      <td>celestia-app</td>
      <td>
        <a 
          :href="`https://github.com/celestiaorg/celestia-app/releases/tag/${mochaVersions['app-latest-tag']}`"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ mochaVersions['app-latest-tag'] }}
        </a>
      </td>
    </tr>
  </table>
</template>

<script>
import mochaVersions from "/.vitepress/constants/mocha_versions.js";
import constants from "/.vitepress/constants/constants.js";

export default {
  name: 'MochaVersionTags',
  data() {
    return {
      mochaVersions,
      constants
    };
  }
}
</script>
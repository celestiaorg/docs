<template>
  <table>
    <tr>
      <th>Detail</th>
      <th>Value</th>
    </tr>
    <tr>
      <td>Chain ID</td>
      <td><code>{{ constants.mainnetChainId }}</code></td>
    </tr>
    <tr>
      <td>Genesis hash</td>
      <td><code>6BE39EFD10BA412A9DB5288488303F5DD32CF386707A5BEF33617F4C43301872</code></td>
    </tr>
    <tr>
      <td>Genesis file</td>
      <td>
        <a 
          :href="`https://github.com/celestiaorg/networks/blob/master/${constants.mainnetChainId}/genesis.json`"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://github.com/celestiaorg/networks/blob/master/{{constants.mainnetChainId}}/genesis.json
        </a>
      </td>
    </tr>
    <tr>
      <td>Peers file</td>
      <td>
        <a 
          :href="`https://github.com/celestiaorg/networks/blob/master/${constants.mainnetChainId}/peers.txt`"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://github.com/celestiaorg/networks/blob/master/{{constants.mainnetChainId}}/peers.txt
        </a>
      </td>
    </tr>
      <tr>
      <td>Validators</td>
      <td>
        100
      </td>
    </tr>
  </table>
</template>

<script>
import constants from "/.vitepress/constants/constants.js";

export default {
  name: 'MainnetBetaDetails',
  data() {
    return {
      constants
    };
  }
}
</script>
<template>
  <table>
    <tr>
      <th>Detail</th>
      <th>Value</th>
    </tr>
    <tr>
      <td>Chain ID</td>
      <td><code>{{ constants.arabicaChainId }}</code></td>
    </tr>
    <tr>
      <td>Genesis hash</td>
      <td><code>27122593765E07329BC348E8D16E92DCB4C75B34CCCB35C640FD7A4484D4C711</code></td>
    </tr>
    <tr>
      <td>Genesis file</td>
      <td>
        <a 
          :href="`https://github.com/celestiaorg/networks/blob/master/${constants.arabicaChainId}/genesis.json`"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://github.com/celestiaorg/networks/blob/master/{{constants.arabicaChainId}}/genesis.json
        </a>
      </td>
    </tr>
    <tr>
      <td>Peers file</td>
      <td>
        <a 
          :href="`https://github.com/celestiaorg/networks/blob/master/${constants.arabicaChainId}/peers.txt`"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://github.com/celestiaorg/networks/blob/master/{{constants.arabicaChainId}}/peers.txt
        </a>
      </td>
    </tr>
      <tr>
      <td>Validators</td>
      <td>
        4
      </td>
    </tr>
  </table>
</template>

<script>
import constants from "/.vitepress/constants/constants.js";

export default {
  name: 'ArabicaDevnetDetails',
  data() {
    return {
      constants
    };
  }
}
</script>
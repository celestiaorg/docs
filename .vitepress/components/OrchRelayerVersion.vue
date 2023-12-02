<template>
      <a 
        :href="`https://github.com/celestiaorg/orchestrator-relayer/releases/tag/${orchrelayVersion}`"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ orchrelayVersion }}
      </a>
</template>

<script>
import constants from "/.vitepress/constants/constants.js";

export default {
  name: 'orchRelayerVersion',
  data() {
    return {
      orchrelayVersion: constants.orchrelayVersion
    };
  }
}
</script>
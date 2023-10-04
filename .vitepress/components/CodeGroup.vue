<template>
  <div>
    <div class="tabs">
      <div
        v-for="(item, index) in tabs"
        :key="index"
        @click="activeTab = index"
        :class="{ active: activeTab === index }"
      >
        {{ item.name }}
      </div>
    </div>
    <div class="tab-content">
      <div class="code-box">
        <pre><code v-html="tabs[activeTab].content"></code></pre>
        <i class="fas fa-clipboard copy-icon" @click="copyToClipboard"></i>
      </div>
    </div>
  </div>
</template>

<script>
import constants from "/.vitepress/versions/constants.js";
import '@fortawesome/fontawesome-free/css/all.css'

export default {
  data() {
    return {
      activeTab: 0,
      tabs: [
        { name: 'Mocha', content: `this is code with ${constants.mochaChainId}<br/>more code<br/>and then this line is one that is going to overflow and we'll see what happens now` },
        { name: 'Arabica', content: `this is code with ${constants.arabicaChainId}` }
      ]
    }
  },
  methods: {
    copyToClipboard() {
      navigator.clipboard.writeText(this.tabs[this.activeTab].content);
    }
  }
}
</script>

<style scoped>
.tabs {
  display: flex;
  border-bottom: 1px solid var(--vp-c-brand-dimm);
  margin-bottom: 10px;
}
.tabs div {
  cursor: pointer;
  padding: 10px;
  color: var(--tab-text-color);
  margin-right: 10px;
  border-bottom: 2px solid transparent;
}
.tabs div.active {
  border-bottom: 2px solid var(--vp-c-brand);
}
.tab-content {
  border: 1px solid var(--vp-c-brand-dimm);
  margin-top: -1px;
  color: var(--tab-text-color);
  border-radius: 10px;
  margin: 0;
  font-size: 0.875em;
  color: #fff;
  background-color: #161618;
  padding: 10px 24px;
  overflow-x: auto;
}
.tab-content::-webkit-scrollbar {
  width: 10px;
}
.tab-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
.tab-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
.code-box {
  position: relative;
}
.copy-icon {
  position: absolute;
  top: 0px;
  right: 10px;
  cursor: pointer;
  transform: translate(50%, -50%);
}
</style>
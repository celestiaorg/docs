<template>
  <div>
    <input type="text" v-model="searchTerm" placeholder="Search the API...">
    <div class="sidebar">
      <ul>
        <li v-for="(methods, moduleName) in filteredModules" :key="moduleName">
          <a :href="'#' + moduleName.toLowerCase()" @click.prevent="scrollTo(moduleName)">{{ moduleName }}</a>
          <ul>
            <li v-for="method in methods">
              <a :href="'#' + method.name" @click.prevent="scrollTo(method.name)">{{ method.name.split(".")[1] }}</a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div v-for="(methods, moduleName) in filteredModules" :key="moduleName">
      <h1 :id="moduleName.toLowerCase()" @mouseover="hoveredHeader = moduleName" @mouseout="hoveredHeader = null">
        {{ moduleName }}
        <a v-if="hoveredHeader === moduleName" :href="'#' + moduleName.toLowerCase()" @click.prevent="copyToClipboard(moduleName)">#</a>
      </h1>
      <div v-for="method in methods" :key="method.name">
        <h2 :id="method.name" @mouseover="hoveredHeader = method.name" @mouseout="hoveredHeader = null">
          {{ method.name.split(".")[1] }}
          <a v-if="hoveredHeader === method.name" :href="'#' + method.name" @click.prevent="copyToClipboard(method.name)">#</a>
        </h2>
        <div class="signature">
          {{ method.name }}(
          <span v-for="(param, index) in method.params" :key="param.name">
            {{ param.name }} {{ param.description }}<span v-if="index !== method.params.length - 1">, </span>
          </span>
          ){{ method.result.name }}
          <div>perms: {{ method.description.split(":")[1].trim() }}</div>
        </div>
        <p>{{ method.summary }}</p>
        <div class="request-response">
          <h3>Request</h3>
          <pre v-clipboard:copy="getRequestExample(method)"><code>{{ getRequestExample(method) }}</code></pre>
          <h3>Response</h3>
          <pre v-clipboard:copy="getResponseExample(method)"><code>{{ getResponseExample(method) }}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueClipboard from 'vue-clipboard2';
import openrpcData from '/.vitepress/api/openrpc.json';

export default {
  directives: {
    clipboard: VueClipboard.directive
  },
  data() {
    return {
      searchTerm: '',
      hoveredHeader: null,
      modules: this.organizeByModule(openrpcData.methods)
    };
  },
  computed: {
    filteredModules() {
      if (!this.searchTerm) return this.modules;
      return Object.fromEntries(
        Object.entries(this.modules).filter(([moduleName, methods]) =>
          moduleName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          methods.some(method => method.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
        )
      );
    }
  },
  methods: {
    organizeByModule(methods) {
      let modules = {};
      methods.forEach(method => {
        let moduleName = method.name.split(".")[0];
        if (!modules[moduleName]) {
          modules[moduleName] = [];
        }
        modules[moduleName].push(method);
      });
      return modules;
    },
    getRequestExample(method) {
      return JSON.stringify({
        id: 1,
        jsonrpc: "2.0",
        method: method.name,
        params: method.params.map((p) => p.schema.examples[0]),
      }, null, 2);
    },
    getResponseExample(method) {
      return JSON.stringify({
        id: 1,
        jsonrpc: "2.0",
        result: method.result.schema.examples,
      }, null, 2);
    },
    scrollTo(id) {
      this.$nextTick(() => {
        document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
      });
    },
    copyToClipboard(id) {
      navigator.clipboard.writeText(window.location.origin + window.location.pathname + '#' + id);
    }
  }
};
</script>

<style>
.sidebar {
  width: 300px;
  border-right: 1px solid #ccc;
  overflow-y: auto;
  position: relative;
}

@media (max-width: 996px) {
  .sidebar {
    display: none;
  }
}

.request-response pre {
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
  overflow: auto;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 4px;
  background-color: #f8f8f8;
  overflow-wrap: break-word;
}
</style>
<template>
  <div>
    <!-- Table of Contents -->
    <div class="toc">
      <!-- Make "Table of Contents" a linkable header -->
      <h2 id="table-of-contents">
        <a href="#table-of-contents">Table of Contents</a>
      </h2>
      <ul>
        <li v-for="(methods, moduleName) in modules" :key="'toc-' + moduleName">
          <a :href="'#' + moduleName.toLowerCase()">{{ moduleName }}</a>
          <ul>
            <li v-for="method in methods">
              <a :href="'#' + method.name">{{ method.name.split(".")[1] }}</a>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <!-- Loop through the modules -->
    <div v-for="(methods, moduleName) in modules" :key="moduleName">

      <!-- Larger Heading for Module with anchor link -->
      <h1 :id="moduleName.toLowerCase()">
        <a :href="'#' + moduleName.toLowerCase()">{{ moduleName }}</a>
      </h1>
      
      <!-- Loop through the methods inside each module -->
      <div v-for="method in methods" :key="method.name">
      
        <!-- Linked Heading for Method -->
        <h2 :id="method.name">
          <a :href="'#' + method.name">{{ method.name.split(".")[1] }}</a>
        </h2> 

        <!-- Display method signature -->
        <div class="signature">
          {{ method.name }}(
          <span v-for="(param, index) in method.params" :key="param.name">
            {{ param.name }} {{ param.description }}<span v-if="index !== method.params.length - 1">, </span>
          </span>
          ){{ method.result.name }}
          <div>perms: {{ method.description.split(":")[1].trim() }}</div>
        </div>

        <p>{{ method.summary }}</p>

        <!-- Display Request and Response -->
        <div class="request-response">
          <h3>Request</h3>
          <pre>{{ getRequestExample(method) }}</pre>

          <h3>Response</h3>
          <pre>{{ getResponseExample(method) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import openrpcData from '/.vitepress/api/openrpc.json';

export default {
  data() {
    return {
      modules: this.organizeByModule(openrpcData.methods)
    };
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
    }
  }
};
</script>

<style>
/* Style for the ToC */
.toc {
  margin-bottom: 2em;
}

.toc h3 {
  margin-top: 0;
}

.toc ul {
  list-style-type: none;
  padding-left: 1em;
}

.toc li {
  margin-bottom: 0.5em;
}

.toc a {
  color: inherit;
  text-decoration: none;
}

.toc a:hover {
  text-decoration: underline;
}

h1 {
  font-size: 2em;
  margin-top: 2em;
  margin-bottom: 1em;
}

h2 {
  padding-top: 1em;
}

h2 a {
    color: inherit;
    text-decoration: none;
}

h2 a:hover {
    text-decoration: underline;
}

</style>

// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import Theme from "vitepress/theme";
import "./style.css";

export default {
  extends: Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    });
  },
  enhanceApp({ app, router, siteData }) {
    // Ask Cookbook Integration start
    if (typeof window !== "undefined") {
      /** It's a public API key, so it's safe to expose it here */
      const COOKBOOK_API_KEY =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NmVhZmRmNTE3MDkyYjQzMGUyOGFkYTgiLCJpYXQiOjE3MjY2NzY0NjksImV4cCI6MjA0MjI1MjQ2OX0.yfmY5Zm70Xt6rMHTi9g_2aRSQauYyiglzv9-pvOW8zg";

      let element = document.getElementById("__cookbook");
      if (!element) {
        element = document.createElement("div");
        element.id = "__cookbook";
        element.dataset.apiKey = COOKBOOK_API_KEY;
        document.body.appendChild(element);
      }
      let script = document.getElementById(
        "__cookbook-script",
      ) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/npm/@cookbookdev/docsbot/dist/standalone/index.cjs.js";
        script.id = "__cookbook-script";
        script.defer = true;
        document.body.appendChild(script);
      }
    }
  },
  // Ask Cookbook Integration end
};

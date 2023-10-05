---
mochaChainId: "mocha-4"
arabicaChainId: "arabica-10"
---

# This is a demo page for testing

## normal code block

Testing out variables in code blocks. This is the default code block with tabs, and no variables:

::: code-group

```md [potato]
import constants from "/.vitepress/versions/constants.js";
```

```md [pancakes]
import constants from "/.potato/pancakes/constants.js";
```

:::

## custom code block

This is the custom cude block with tabs, and variables from the constants.js file:

known issues

- there is not enough padding on the right side when text overflows
- the clipboard icon moves when you scroll
- oof. copies the html break tags when you copy multiple lines of code

<script setup>
import CodeGroup from '/.vitepress/components/CodeGroup.vue'
</script>

<CodeGroup />

## testing frontmatter variables

This is a section to test variables used in frontmatter. It is not possible to display variables in the native code blocks on Vitepress.

<pre><code>
const mochaChainId = "{{ $frontmatter.mochaChainId }}";
const arabicaChainId = "{{ $frontmatter.arabicaChainId }}";
</code></pre>

In this example, `mochaChainId` and `arabicaChainId` are variables defined in the frontmatter. They are then accessed in the JavaScript code block using `{{ $frontmatter.mochaChainId }}` and `{{ $frontmatter.arabicaChainId }}`.

```bash
{{ $frontmatter.arabicaChainId }}
```

This is [random value]

[random value]: v0.11.0-rc8

## use variables like this

Arabica Version: `{{ $frontmatter.arabicaChainId }}`
Mocha Version: `{{ $frontmatter.mochaChainId }}``

git checkout $VERSION

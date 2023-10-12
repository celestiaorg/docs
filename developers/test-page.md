# Test page

<!-- markdownlint-disable MD033 -->
<script setup>
import { versions } from '/.vitepress/versions/data.js'
</script>

::: code-group

```bash-vue [nice]
{{versions.myVariable}}
```

```bash-vue [setup]
{{versions.myOtherVariable}}
```

:::

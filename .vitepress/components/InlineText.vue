<template>
  <span :style="{ display: 'inline' }">
    <slot></slot>
    {{ constant }}
  </span>
</template>

<script>
export default {
  name: 'InlineText',
  props: {
    constant: {
      type: String,
      default: ''
    }
  }
}
</script>

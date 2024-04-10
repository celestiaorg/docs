<template>
  <a :href="url" target="_blank" rel="noopener noreferrer" class="button-link">
    <button class="url-image-button">
      <img :src="imageSrc" alt="" class="button-icon" />
      <span class="button-text">{{ text }}</span>
      <span class="notes-text" v-if="notes">{{ notes }}</span>
    </button>
  </a>
</template>

<script>
export default {
  name: 'UrlImageButton',
  props: {
    url: String,
    imageSrc: String,
    text: String,
    notes: {
      type: String,
      default: ''
    },
  },
};
</script>

<style scoped>
.url-image-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 32px;
  font-size: 24px;
  cursor: pointer;
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  background-color: var(--vp-c-brand-dimm);
  color: var(--text-color);
  width: 200px;
  height: 225px;
}

.url-image-button:hover {
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.button-icon {
  width: 72px;
  height: 72px;
}

.button-text {
  font-weight: 600;
  text-align: center;
}

.notes-text {
  display: block;
  margin-top: 10px;
  font-size: 14px;
  text-align: center;
  color: var(--text-color-secondary);
}

.button-link {
  text-decoration: none;
}

</style>
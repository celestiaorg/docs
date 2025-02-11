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
      default: '',
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
  width: 100%;
  height: 100%;
}

@media (max-width: 768px) {
  .url-image-button {
    padding: 16px 12px;
    font-size: 15px;
    gap: 4px;
  }

  .button-icon {
    width: 42px !important;
    height: 42px !important;
  }

  .notes-text {
    font-size: 14px !important;
    margin-top: 2px !important;
  }

  .button-text {
    font-size: 16px;
    line-height: 1.1;
    margin: 2px 0;
  }
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
  line-height: 1.3;
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
  width: 100%;
  height: 100%;
  display: block;
}
</style>

<script setup lang="ts">
import ChatDialog from './components/ChatDialog.vue';
import { watchEffect } from 'vue';

const props = defineProps({
  uiTheme: {
    type: String,
    default: 'light',
  },
  apiUrl: String,
  vectorStoreCollectionName: String,
  externalSourceBaseUrl: String,
});

watchEffect(() => {
  document.documentElement.className = props.uiTheme;
});
</script>

<template>
  <ChatDialog
    :api-url="props.apiUrl"
    :external-source-base-url="props.externalSourceBaseUrl"
    :vector-store-collection-name="props.vectorStoreCollectionName"
  />
</template>

<style lang="scss">
@import './styles/reset';
@import 'styles/themes';
@import './styles/main';
</style>

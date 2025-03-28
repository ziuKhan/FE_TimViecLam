<script setup lang="ts">
import { ref } from 'vue';
import locale from 'ant-design-vue/es/locale/vi_VN'; // Ngôn ngữ Ant Design
const theme = {
  token: {
    colorPrimary: '#f0101a'
  }
}
const localeRef = ref(locale);
</script>

<template>
  <ConfigProvider :locale="locale" :theme="theme">
    <div class="container_app">
      <RouterView />
    </div>
  </ConfigProvider>
</template>

<style scoped></style>

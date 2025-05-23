<script setup lang="ts">
import { ref } from 'vue'
import locale from 'ant-design-vue/es/locale/vi_VN' // Ngôn ngữ Ant Design
import { theme } from 'ant-design-vue'

const localeRef = ref(locale)

const themeConfig = {
  token: {
    colorPrimary: '#ef0b12', // Màu chủ đạo
    borderRadius: 8, // Bo góc
    colorSuccess: '#52c41a', // Màu thành công
    colorWarning: '#faad14', // Màu cảnh báo
    colorError: '#ff4d4f', // Màu lỗi
    colorInfo: '#1677ff' // Màu thông tin
  }
}
</script>

<template>
  <ConfigProvider :theme="themeConfig" :locale="locale">
    <div class="container_app">
      <RouterView />
    </div>
  </ConfigProvider>
</template>

<style scoped></style>

<template>
  <a-layout style="min-height: 100vh">
    <Header />
    <a-layout>
      <RouterView />
      <a-layout-footer style="text-align: center">
        ITviec ©2024 Created by Nguyen Duy Khang
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script lang="ts" setup>
import { RouterView } from 'vue-router'
import Header from '../../components/admin/Header.vue'
</script>
<style scoped>
.site-layout .site-layout-background {
  background: #fff;
}

[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}
</style>

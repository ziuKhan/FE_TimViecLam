<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue'
</script>

<template>
  <div class="container_app">
    <Header></Header>
    <RouterView />
  </div>
</template>

<style scoped>
</style>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div class="container_app">
    <Header></Header>
    <RouterView />
    <Footer></Footer>
  </div>
</template>

<style scoped>
</style>

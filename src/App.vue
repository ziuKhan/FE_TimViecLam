<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import HeaderSM from './components/HeaderSM.vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';

const isMobile = ref(false);

const checkScreenSize = () => {
  isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize);
});

</script>

<template>
  <div class="container_app">
    <Header v-if="!isMobile"></Header>
    <HeaderSM v-else></HeaderSM>
    <component :is="isMobile ? 'HeaderSM' : 'Header'"></component>
    <RouterView />
    <Footer></Footer>
  </div>
</template>

<style scoped>
</style>

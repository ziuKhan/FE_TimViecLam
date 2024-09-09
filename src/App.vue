<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/header/Header.vue'
import Footer from './components/Footer.vue'
import HeaderSM from './components/header/HeaderSM.vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';

const isMobile = ref(false);

const checkScreenSize = () => {
  isMobile.value = window.innerWidth <= 1000;
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
    <RouterView />
    <Footer></Footer>
  </div>
</template>

<style scoped></style>

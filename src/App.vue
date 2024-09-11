<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { onBeforeUnmount, onMounted, ref } from 'vue';
import Header from './components/user/header/Header.vue';
import HeaderSM from './components/user/header/HeaderSM.vue';
import Footer from './components/user/Footer.vue';

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

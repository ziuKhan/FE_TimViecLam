<template>
  <div class="user-layout">
    <Header v-if="!isMobile"></Header>
    <HeaderSM v-else></HeaderSM>
    <RouterView />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Footer from '../../components/user/Footer.vue'
import HeaderSM from '../../components/user/header/HeaderSM.vue'
import Header from '../../components/user/header/Header.vue'

const isMobile = ref(false)

const checkScreenSize = () => {
  isMobile.value = window.innerWidth <= 1000
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>

<style scoped></style>

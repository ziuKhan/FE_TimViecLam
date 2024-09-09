<script setup lang="ts">
import { ref } from 'vue';
import Loading from '../../components/Loading.vue';

const load = ref<boolean>(false)

</script>

<template>
    <Loading v-if="!load"></Loading>
    <div v-else></div>
</template>
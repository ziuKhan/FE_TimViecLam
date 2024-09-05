<script setup lang="ts">
import { useJobStore } from '../../stores/JobStore';
import { useAuthStore } from '../../stores/AuthStore';

 
const store = useJobStore()
const storeAuth = useAuthStore()

</script>

<template>

<div v-if="storeAuth.isAuth" class="w-full flex gap-2  flex-wrap  mb-2 mt-5">
   hello
</div>

<div v-else class="w-full flex gap-2  flex-wrap  mb-2 mt-5">
    Bạn chưa đăng nhập hệ thống. Vui lòng đăng nhập để có thể "Rải CV" bạn nhé -.-


</div>

</template>


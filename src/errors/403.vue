<template>
  <a-result status="403" title="403" sub-title="Xin lỗi, bạn không được phép truy cập trang này.">
    <template #extra>
      <a-button type="primary" @click="$router.push('/')">Quay lại</a-button>
    </template>
  </a-result>
</template>

<script setup lang="ts"></script>

<style></style>

<template>
  <a-result status="404" title="404" sub-title="Rất tiếc, trang bạn đã truy cập không tồn tại..">
    <template #extra>
      <a-button type="primary" @click="$router.push('/')">Về trang chủ</a-button>
    </template>
  </a-result>
</template>

<script lang="ts" setup></script>

<style></style>

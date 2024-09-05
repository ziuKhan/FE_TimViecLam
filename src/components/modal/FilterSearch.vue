<template>

<div class="mt-2">
  <div class="w-full flex gap-2  flex-wrap  mb-2 mt-5">
    <div class="font-bold  text-base ">Mức lương: </div>
    <div class=" font-medium text-base">{{ store.value[0] }}$ - {{ store.value[1] }}$</div>
    <div class="w-full border rounded-full border-blue-200 hover:border-blue-300 px-4">
      <a-slider   v-model:value="store.value" range :min="0" :max="store.valueMax"/>
    </div>

  </div>
  <div class="font-bold text-base mt-5 mb-2">Cấp bậc</div>
  <a-checkbox-group v-model:value="store.state" name="checkboxgroup" :options="plainOptions" />
</div>


</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSearchStore } from '../../stores/searchStore';

const store = useSearchStore()

const plainOptions = ['FRESHER','JUNIOR', 'MIDDLE','SENIOR','MANAGER'];


</script>
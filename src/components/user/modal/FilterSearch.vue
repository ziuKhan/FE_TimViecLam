<template>
  <div class="mt-0">
    <div class="w-full flex gap-2 flex-wrap mb-2 mt-0">
      <div class="font-bold text-base">Mức lương:</div>
      <div class="font-medium text-base">
        {{ formatNumber(store.valueFilter.salary?.[0] || 0) }} -
        {{ formatNumber(store.valueFilter.salary?.[1] || 0) }}
      </div>
      <div class="w-full border rounded-full border-blue-200 hover:border-blue-300 px-4">
        <a-slider v-model:value="store.valueFilter.salary" range :min="0" :max="store.valueMax" />
      </div>
    </div>
    <div class="font-bold text-base mt-5 mb-2">Cấp bậc</div>
    <a-checkbox-group
      v-model:value="store.valueFilter.level"
      name="checkboxgroup"
      :options="plainOptions"
    />
    <div class="font-bold text-base mt-5 mb-2">Kĩ năng</div>
    <a-select
      v-model:value="store.valueFilter.skills"
      mode="tags"
      style="width: 100%"
      :token-separators="[',']"
      placeholder="Vui lòng nhập kĩ năng"
      :options="storeSkill.allDataSkill"
      :field-names="{ label: 'name', value: '_id' }"
    ></a-select>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSearchStore } from '../../../stores/user/searchStore'
import type { SelectProps } from 'ant-design-vue'
import useSkillStore from '../../../stores/admin/SkillStore'

const storeSkill = useSkillStore()
const store = useSearchStore()
const formatNumber = (value: number) => {
  return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
}
const plainOptions = ['INTERN','FRESHER', 'JUNIOR', 'MIDDLE', 'SENIOR', 'MANAGER']
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <div class="mb-4">
        <div class="mb-2 font-medium">Vị trí</div>
        <a-select
          v-model:value="store.paginateCompanies.location"
          mode="multiple"
          style="width: 100%"
          placeholder="Chọn vị trí"
          :options="locations.map((item) => ({ value: item._id, label: item.name }))"
        ></a-select>
      </div>
      <div class="mb-4">
        <div class="mb-2 font-medium">Ngành nghề</div>
        <a-select
          v-model:value="store.paginateCompanies.category"
          mode="multiple"
          style="width: 100%"
          placeholder="Chọn ngành nghề"
          :options="categories.map((item) => ({ value: item._id, label: item.name }))"
        ></a-select>
      </div>
    </div>
    <div>
      <div class="mb-4">
        <div class="mb-2 font-medium">Sắp xếp theo</div>
        <a-radio-group v-model:value="store.paginateCompanies.sort" class="flex flex-col gap-y-2">
          <a-radio value="newest">Mới nhất</a-radio>
          <a-radio value="oldest">Cũ nhất</a-radio>
          <a-radio value="a-z">Tên (A-Z)</a-radio>
          <a-radio value="z-a">Tên (Z-A)</a-radio>
          <a-radio value="most-jobs">Nhiều việc làm nhất</a-radio>
        </a-radio-group>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCompanyStore } from '../../../stores/user/companyStore'
import { onMounted, ref } from 'vue'
import { apiClient } from '@/constant/api'

const store = useCompanyStore()
const locations = ref<any[]>([])
const categories = ref<any[]>([])

onMounted(async () => {
  try {
    const [locationsRes, categoriesRes] = await Promise.all([
    apiClient.get('/location'),
    apiClient.get('/category')
    ])
    locations.value = locationsRes.data.data
    categories.value = categoriesRes.data.data
  } catch (error) {
    console.error(error)
  }
})
</script>

<style scoped lang="scss"></style> 
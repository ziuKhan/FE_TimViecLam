<script setup lang="ts">
import { linkUploads } from '../../constant/api'
import { formatSalary } from '../../until/until'
import type { IJob } from '../../types/backend'
import { computed } from 'vue'

const props = defineProps<{
  data: IJob
}>()

const formattedSalary = computed(() => {
  return props.data.isSalary
    ? 'Thỏa thuận'
    : `${formatSalary(props.data.salaryFrom)} - ${formatSalary(props.data.salaryTo)}`
})

const getSkillsPreview = computed(() => {
  if (!props.data.skills || props.data.skills.length === 0) return []
  return props.data.skills.slice(0, 3)
})
</script>

<template>
  <RouterLink
    :to="`/job/${data._id}`"
    class="text-base font-semibold hover:text-red-700 truncate max-w-full w-full rounded-lg bg-white shadow-sm border border-solid border-gray-200 hover:shadow-md hover:border-red-200 p-5 group transition-all duration-300"
  >
    <div class="flex gap-4">
      <!-- Logo công ty -->
      <div
        class="min-w-16 max-w-16 h-16 bg-white rounded-md border border-gray-100 flex items-center justify-center p-1.5"
      >
        <img
          loading="lazy"
          class="w-full h-full object-contain"
          :src="linkUploads('company/' + data.companyId.logo)"
          :alt="data.companyId.name"
        />
      </div>

      <!-- Thông tin công việc -->
      <div class="w-full flex flex-col overflow-hidden">
        <a-tooltip :title="data.name">
          <div class="flex justify-between items-start">
            <!-- Tên công việc -->
            {{ data.name }}
          </div>
        </a-tooltip>

        <!-- Tên công ty -->
        <RouterLink
          :to="`/company/${data.companyId._id}`"
          class="truncate max-w-full text-sm text-zinc-600 hover:text-blue-700 mt-1"
        >
          {{ data.companyId.name }}
        </RouterLink>

        <!-- Thông tin chi tiết -->
        <div class="flex flex-wrap gap-2 mt-3 text-xs">
          <!-- Mức lương -->
          <div
            class="px-2.5 py-1 bg-blue-50 text-green-600 rounded-full font-medium flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-3.5 w-3.5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {{ formattedSalary }}
          </div>

          <!-- Địa điểm -->
          <div
            class="px-2.5 py-1 bg-gray-50 text-gray-600 rounded-full font-medium flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-3.5 w-3.5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {{ data.location }}
          </div>
        </div>
      </div>
    </div>

    <!-- Kỹ năng yêu cầu -->
    <div class="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
      <span class="text-xs text-gray-500">Kỹ năng:</span>
      <div class="flex flex-wrap items-center gap-1.5">
        <div
          v-for="skill in getSkillsPreview"
          :key="skill._id"
          class="text-xs bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full text-gray-600"
        >
          {{ skill.name }}
        </div>
        <span v-if="data.skills && data.skills.length > 3" class="text-xs text-gray-500">
          +{{ data.skills.length - 3 }}
        </span>
      </div>
    </div>
  </RouterLink>
</template>

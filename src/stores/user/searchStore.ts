import { defineStore } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { IJob, IPaginate } from '../../types/backend'
import apiService from '../../services/api.service'
import { format } from 'date-fns'

interface IValueFilter {
  location?: string
  startDate?: Date
  endDate?: Date
  isActive?: boolean
  salary?: [number, number]
  level?: string
  skills?: string[]
}
export const useSearchStore = defineStore('search', () => {
  const keyword = ref<string>('')
  const dataJobs = ref<IJob[]>([])
  const paginateJobs = ref<IPaginate>({
    current: 1,
    pageSize: 9,
    pages: 0,
    total: 0,
    keyword: ''
  })

  const valueFilter = ref<IValueFilter>({
    salary: [0, 0],
    isActive: true,
  })

  const load = ref<boolean>(false)
  const router = useRouter()
  const route = useRoute()
  const valueMax = ref<number>(0)


  const handleSearch = async () => {
    
    paginateJobs.value.current = 1
    let params = new URLSearchParams()
    if (valueFilter.value.location) {
      params.set('location', `${valueFilter.value.location}`)
    }
    if (keyword.value) {
      params.set('name', `${keyword.value}`)
    }
    if (params.toString()) {
      router.push(`/search?${params}`)
    }
    getSearch()
  }

  const getSearch = async () => {
    const conditions = Object.entries(valueFilter.value)
    .filter(([key, value]) => value !== null && value !== undefined && value !== '')
    .map(([key, value]: [string, any]) => {
        if (key === 'startDate') {
            return `startDate>=${format(value, 'yyyy-MM-dd')}`;
        }
        if (key === 'endDate') {
            return `endDate<=${format(value, 'yyyy-MM-dd')}`;
        }
        if (key === 'salary' ) {
          if(value[0] >= 0 && value[1]){
            return `salaryFrom>=${value[0]},salaryFrom<=${value[1]}`;
          }else {
            return null;
          }
        }
        if (Array.isArray(value)) {
          return `${key}=${value.join(',')}`;
        }
        return `${key}=${value}`;
    });

    const filter = conditions.filter(Boolean).join(',');
    try {
      load.value = true
      const { current, pageSize } = paginateJobs.value
      const response = await apiService.get(`search?page=${current}&pageSize=${pageSize}${filter ? `&filter=${filter}` : ''}${keyword.value ? `&search=${keyword.value}` : ''}`)
      const salary = await apiService.get(`search?filter=sort=-salaryTo&page=1&pageSize=1`)
      valueMax.value = salary.data?.result[0].salaryTo || 0;
      dataJobs.value = response.data.result
      paginateJobs.value.total = response.data.meta.total
      paginateJobs.value.keyword = keyword.value
    } catch (error) {
      console.log(error)
    } finally {
      load.value = false
    }
  }
  const resetFilter = () => {
    valueFilter.value = {
      salary: [0, 0],
      isActive: true,
    }
    handleSearch()
  }
  watch(
    () => route.query,
    () => {
      console.log(route.query)
      keyword.value = route.query.name as string
      paginateJobs.value.keyword = route.query?.name as string || ''
      valueFilter.value.location = route.query?.location as string || undefined
      handleSearch()
    },
    { immediate: true }
  )

  return {
    location,
    valueFilter,
    dataJobs,
    paginateJobs,
    load,
    handleSearch,
    resetFilter,
    keyword,
    valueMax,
  }
})

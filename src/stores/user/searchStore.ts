import { defineStore } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { paginateJobsApi } from '../../services/job.service'
import type { IJob, IPaginate } from '../../types/backend'

export const useSearchStore = defineStore('search', () => {
  const location = ref<string>('')
  const keyword = ref<string>('')
  const current = ref<number>(1)
  const dataJobs = ref<IJob[]>([])
  const paginateJobs = ref<IPaginate>()
  const load = ref<boolean>(false)
  const router = useRouter()
  const route = useRoute()
  const valueMax = ref<number>()
  const value = ref<[number, any]>([0, valueMax.value])
  const state = ref([])
  const getData = async () => {
    load.value = false
    const queryString = route.fullPath.split('?')[1] || ''

    const skillsParam = route.query.skills
      ? route.query.skills.toString().replace(/\//g, '')
      : route.query.location
        ? route.query.location.toString().replace(/\//g, '')
        : ''
    const paramString = `&isActive=true&current=${current.value}&pageSize=9&sort=-createdAt`
    const jobs = await paginateJobsApi(`?${queryString}${paramString}`)
    dataJobs.value = jobs.result
    paginateJobs.value = { ...jobs.meta, keyword: skillsParam }
    load.value = true
  }

  const handleSearch = () => {
    let params = new URLSearchParams()
    params.set('location', `/${location.value}/`)
    if (keyword.value) {
      params.set('skills', `/${keyword.value.toUpperCase()}/`)
    }
    router.push(`/search?${params}`)
  }

  const updateKeyword = (value: string) => {
    keyword.value = value
    handleSearch()
  }

  const handleFilter = () => {
    let params = new URLSearchParams()
    params.set('location', `/${location.value}/`)
    if (keyword.value) {
      params.set('skills', `/${keyword.value.toUpperCase()}/`)
    }

    if (value.value[0] > value.value[1]) {
      value.value = [value.value[1], value.value[0]]
    }

    params.set('gte', value.value[0].toString())
    params.set('lte', value.value[1].toString())

    if (state.value.length > 0) {
      params.set('level', state.value.join(','))
    }
    router.push(`/search?${params.toString()}`)
  }

  onMounted(async () => {
    const jobs = await paginateJobsApi(`?sort=-salary&current=1&pageSize=1`)
    valueMax.value = jobs?.result[0].salary
  })

  watch(
    () => route.query,
    () => {
      getData()
    },
    { immediate: true }
  )

  return {
    location,
    getData,
    current,
    dataJobs,
    paginateJobs,
    load,
    handleSearch,
    keyword,
    updateKeyword,
    value,
    state,
    handleFilter,
    valueMax
  }
})

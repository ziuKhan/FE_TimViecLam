import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiClient } from '../../constant/api'

export const useCompanyStore = defineStore('company', () => {
  const loading = ref<boolean>(false)
  const dataCompanies = ref<any[]>([])
  const paginateCompanies = ref({
    current: 1,
    pageSize: 10,
    total: 0,
    keyword: '',
    location: [],
    category: [],
    sort: 'newest'
  })

  const handleSearch = async () => {
    try {
      loading.value = true
      const response = await apiClient.get('/company', {
        params: {
          page: paginateCompanies.value.current,
          pageSize: paginateCompanies.value.pageSize,
          keyword: paginateCompanies.value.keyword,
          location: paginateCompanies.value.location,
          category: paginateCompanies.value.category,
          sort: paginateCompanies.value.sort
        }
      })
      dataCompanies.value = response.data.data
      paginateCompanies.value.total = response.data.total
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const resetFilter = () => {
    paginateCompanies.value = {
      current: 1,
      pageSize: 10,
      total: paginateCompanies.value.total,
      keyword: '',
      location: [],
      category: [],
      sort: 'newest'
    }
    handleSearch()
  }

  return {
    loading,
    dataCompanies,
    paginateCompanies,
    handleSearch,
    resetFilter
  }
}) 
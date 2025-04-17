import { defineStore } from 'pinia'
import { onMounted, reactive, ref } from 'vue'
import type { IPaginate, ISkill } from '../../types/backend'
import { message } from 'ant-design-vue'
import apiService from '../../services/api.service'

const DEFAULT_PAGE_SIZE = 10
const API_ENDPOINT = 'skills'

const useSkillStore = defineStore('skill', () => {
  // State
  const openModal = ref<boolean>(false)
  const loading = ref<boolean>(false)
  const data = ref<ISkill[]>([])
  const allDataSkill = ref<ISkill[]>([])
  const valueSearch = ref<string>('')
  
  const dataMeta = ref<IPaginate>({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    pages: 0,
    total: 0
  })

  const initialForm: ISkill = {
    _id: '',
    name: '',
    description: ''
  }
  
  const form = reactive<ISkill>({ ...initialForm })

  // Methods
  const resetForm = () => Object.assign(form, initialForm)

  const handleOpenModal = () => {
    openModal.value = true
    resetForm()
  }

  const buildQueryParams = (): string => {
    const params = new URLSearchParams({
      page: String(dataMeta.value.current),
      pageSize: String(dataMeta.value.pageSize),
      sort: '-createdAt'
    })
    
    if (valueSearch.value) {
      params.append('search', valueSearch.value)
    }
    
    return `?${params.toString()}`
  }

  const getData = async () => {
    try {
      loading.value = true
      const params = buildQueryParams()
      const res = await apiService.get(`${API_ENDPOINT}${params}`)
      
      if (res) {
        data.value = res.data.result
        dataMeta.value = res.data.meta
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      loading.value = false
    }
  }

  const deleteByID = async (id: string) => {
    try {
      loading.value = true
      const res = await apiService.delete(`${API_ENDPOINT}/${id}`)
      
      if (res) {
        message.success('Xóa thành công!')
        await getData()
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      loading.value = false
    }
  }

  const getByID = async (id: string, isCopy = false) => {
    try {
      loading.value = true
      const res = await apiService.get(`${API_ENDPOINT}/${id}`)
      
      if (res) {
        const formData = isCopy ? { ...res.data, _id: '' } : res.data
        Object.assign(form, formData)
        openModal.value = true
        
        if (isCopy) {
          message.success('Đã copy đường dẫn API!')
        }
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      loading.value = false
    }
  }

  const updateAndAdd = async () => {
    try {
      loading.value = true
      const isUpdate = Boolean(form._id)
      const apiCall = isUpdate 
        ? apiService.update(`${API_ENDPOINT}/${form._id}`, form)
        : apiService.add(API_ENDPOINT, form)

      const res = await apiCall
      if (res) {
        message.success(`${isUpdate ? 'Cập nhật' : 'Thêm'} thành công!`)
        resetForm()
        openModal.value = false
        await getData()
        await getAllSkill()
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      loading.value = false
    }
  }

  const getAllSkill = async () => {
    try {
      const res = await apiService.get(`${API_ENDPOINT}/all`)
      if (res) {
        allDataSkill.value = res.data
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra')
    }
  }
  onMounted(() => {
    getAllSkill()
  })
  return {
    // State
    openModal,
    form,
    loading,
    data,
    dataMeta,
    valueSearch,
    allDataSkill,

    // Methods
    updateAndAdd,
    getData,
    deleteByID,
    getByID,
    handleOpenModal,
    getAllSkill
  }
})

export default useSkillStore

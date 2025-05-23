import { defineStore } from 'pinia'
import type { IPaginate, ISubscriptionPackage } from '../../types/backend'
import { reactive, ref } from 'vue'
import apiService from '../../services/api.service'
import { message } from 'ant-design-vue'

const useSubscriptionPackageStore = defineStore('subscriptionPackage', () => {
  const API_ENDPOINT = 'subscription-package'
  const subscriptionPackage = ref<ISubscriptionPackage[]>([])
  const openModal = ref<boolean>(false)
  const loading = ref<boolean>(false)
  const data = ref<ISubscriptionPackage[]>([])
  const keySearch = ref<string>('')
  const dataMeta = ref<IPaginate>({
    current: 1,
    pageSize: 10,
    total: 0,
    keyword: ''
  })
  const initialForm: ISubscriptionPackage = {
    _id: '',
    name: '',
    description: '',
    code: '',
    price: 0,
    priceDiscount: 0,
    duration: 0,
    isActive: false
  }

  const form = reactive<ISubscriptionPackage>({ ...initialForm })
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
      filter: 'sort=-createdAt'
    })

    if (keySearch.value) {
      params.append('search', keySearch.value)
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

  const save = async () => {
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
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      loading.value = false
    }
  }

  return {
    subscriptionPackage,
    dataMeta,
    form,
    openModal,
    loading,
    data,
    keySearch,
    resetForm,
    getData,
    deleteByID,
    getByID,
    save,
    handleOpenModal
  }
})

export default useSubscriptionPackageStore

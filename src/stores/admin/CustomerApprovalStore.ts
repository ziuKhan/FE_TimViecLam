import { defineStore } from 'pinia'
import { onMounted, reactive, ref } from 'vue'
import type { IPaginate, ICustomerApproval } from '../../types/backend'
import { message } from 'ant-design-vue'
import apiService from '../../services/api.service'

const DEFAULT_PAGE_SIZE = 10
const API_ENDPOINT = 'customer-approval'

const useCustomerApprovalStore = defineStore('customer-approval', () => {
  // State
  const openModal = ref<boolean>(false)
  const openModalDetail = ref<boolean>(false)
  const loading = ref<boolean>(false)
  const data = ref<ICustomerApproval[]>([])
  const valueSearch = ref<string>('')

  const dataMeta = ref<IPaginate>({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    pages: 0,
    total: 0
  })

  const initialForm: ICustomerApproval = {
    _id: '',
    lastName: '',
    firstName: '',
    email: '',
    phoneNumber: '',
    logo: '',
    taxCode: '',
    address: '',
    companyName: '',
    status: '',
    description: '',
    clause: false
  }

  const form = reactive<ICustomerApproval>({ ...initialForm })

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

  const getByID = async (id: string, is = false) => {
    try {
      loading.value = true
      const res = await apiService.get(`${API_ENDPOINT}/${id}`)

      if (res) {
        const formData = res.data
        Object.assign(form, formData)
        is ? (openModalDetail.value = true) : (openModal.value = true)
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
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      loading.value = false
    }
  }

  // Phê duyệt yêu cầu đăng ký
  const approveRequest = async (id: string) => {
    try {
      loading.value = true
      const res = await apiService.update(`${API_ENDPOINT}/status/${id}?status=CN`, form)

      if (res) {
        await getData()
        return res
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Phê duyệt thất bại')
      throw error
    } finally {
      loading.value = false
    }
  }

  // Từ chối yêu cầu đăng ký
  const rejectRequest = async (id: string) => {
    if (!form.reason) {
      message.error('Vui lòng nhập lý do từ chối')
      return
    }
    try {
      loading.value = true
      const res = await apiService.update(`${API_ENDPOINT}/status/${id}?status=TC`, form)

      if (res) {
        await getData()
        return res
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Từ chối thất bại')
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    openModal,
    form,
    loading,
    data,
    dataMeta,
    valueSearch,
    openModalDetail,
    // Methods
    updateAndAdd,
    getData,
    deleteByID,
    getByID,
    handleOpenModal,
    approveRequest,
    rejectRequest,
    resetForm
  }
})

export default useCustomerApprovalStore

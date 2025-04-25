import { defineStore } from 'pinia'
import { ref, reactive, watch } from 'vue'
import type { IAccount, ICompany, IPaginate, IUserbyAccount } from '../../types/backend'
import { message } from 'ant-design-vue'
import accountService from '../../services/account.service'
import apiService from '../../services/api.service'

const useCompanyStore = defineStore('company', () => {
  const account: IUserbyAccount | null = accountService.getAccount().account
  const openModal = ref<boolean>(false)
  const dataMeta = ref<IPaginate>({
    current: 1,
    pageSize: 6,
    pages: 0,
    total: 0
  })

  const isActive = ref<boolean>(true)

  watch(isActive, () => {
    getData()
  })

  const data = ref<ICompany[]>([])
  const valueSearch = ref<string>('')

  const form = reactive<ICompany>({
    _id: '',
    logo: '',
    name: '',
    country: '',
    province: '',
    detailedAddress: '',
    district: '',
    ward: '',
    type: '',
    size: '',
    industry: '',
    workingDays: [],
    overtimePolicy: '',
    get fullAddress() {
      return this.detailedAddress + ', ' + this.province + ', ' + this.district + ', ' + this.ward
    },
    address: [],
    description: '',
    isActive: true
  })

  const loading = ref<boolean>(false)

  const refreshInput = () => {
    form._id = ''
    form.name = ''
    form.description = ''
    form.isActive = true
    form.logo = ''
    form.country = ''
    form.type = ''
    form.size = ''
    form.industry = ''
    form.workingDays = []
    form.overtimePolicy = ''
    form.province = ''
    form.address = []
    form.detailedAddress = ''
    form.district = ''
    form.ward = ''
  }

  const handleOpenModal = () => {
    refreshInput()
    openModal.value = true
  }

  const getData = async (search?: string) => {
    loading.value = true
    try {
      const params = `?page=${dataMeta.value?.current}&pageSize=${dataMeta.value?.pageSize}${search ? '&search=' + search + '' : ''}&filter=isActive=${isActive.value},sort=-createdAt${account?.companyId ? ',_id=/' + account?.companyId + '/' : ''}`
      const res = await apiService.get('companies' + params)
      if (res) {
        data.value = res.data.result
        dataMeta.value = res.data.meta
      }
    } catch (error: any) {
      message.error(error.response.data.message)
    } finally {
      loading.value = false
    }
  }

  const deleteByID = async (id: string) => {
    loading.value = true
    try {
      const res = await apiService.delete('companies/' + id)
      if (res) {
        message.success('Xóa thành công!')
        getData()
      }
    } catch (error: any) {
      message.error(error.response.data.message)
    } finally {
      loading.value = false
    }
  }

  const getByID = async (id: string) => {
    try {
      loading.value = true
      const res = await apiService.get('companies/' + id)
      if (res) {
        delete res.data.fullAddress
        Object.assign(form, res.data)
        openModal.value = true
      }
    } catch (error: any) {
      message.error(error.response.data.message)
    } finally {
      loading.value = false
    }
  }
  const updateAndAdd = async () => {
    loading.value = true
    try {
      if (form._id) {
        const res = await apiService.update('companies/' + form._id, form)
        if (res) message.success('Cập nhật thành công!')
      } else {
        const res = await apiService.add('companies', form)
        if (res) message.success('Thêm thành công!')
      }
      refreshInput()
      openModal.value = false
      getData()
    } catch (error: any) {
      message.error(error.response.data.message)
    } finally {
      loading.value = false
    }
  }
  return {
    openModal,
    updateAndAdd,
    form,
    loading,
    data,
    dataMeta,
    getData,
    valueSearch,
    deleteByID,
    getByID,
    handleOpenModal,
    isActive
  }
})

export default useCompanyStore

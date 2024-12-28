import { defineStore } from 'pinia'
import { ref, reactive, watch } from 'vue'
import type { IAccount, ICompany, IPaginate, IUserbyAccount } from '../../types/backend'
import { message } from 'ant-design-vue'
import companyService from '../../services/company.service'
import accountService from '../../constant/account.service'

const useCompanyStore = defineStore('company', () => {
  const { getApi, createApi, updateApi, deleteApi, paginateApi } = companyService
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
    province: '',
    detailedAddress: '',
    district: '',
    ward: '',
    get fullAddress() {
      return this.detailedAddress + ', ' + this.province + ', ' + this.district + ', ' + this.ward
    },
    address: [],
    description: '',
    isActive: false
  })

  const loading = ref<boolean>(false)

  const refreshInput = () => {
    form._id = ''
    form.name = ''
    form.description = ''
    form.isActive = false
    form.logo = ''
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
      const params = `?current=${dataMeta.value?.current}&pageSize=${dataMeta.value?.pageSize}&isActive=${isActive.value}&sort=-createdAt${search ? '&name=/' + search + '/' : ''}${account?.companyId ? '&_id=' + account?.companyId : ''}`
      const res = await paginateApi(params)
      if (res) {
        data.value = res.result
        dataMeta.value = res.meta
        loading.value = false
      }
    } catch (error) {
      loading.value = false
      console.error('Error fetching data:', error)
    }
  }

  const deleteByID = async (id: string) => {
    loading.value = true
    try {
      const res = await deleteApi(id)
      if (res) {
        message.success('Xóa thành công!')
        loading.value = false
        getData()
      }
    } catch (error) {
      loading.value = false
      console.error('Error fetching data:', error)
    }
  }

  const getByID = async (id: string) => {
    try {
      loading.value = true
      const res = await getApi(id)
      if (res) {
        Object.assign(form, res.data)
        openModal.value = true
        loading.value = false
      }
    } catch (error) {
      loading.value = false
      console.error('Error fetching data:', error)
    }
  }
  const updateAndAdd = async () => {
    loading.value = true
    try {
      if (form._id) {
        const res = await updateApi(form, form._id)
        if (res) message.success('Cập nhật thành công!')
      } else {
        const res = await createApi(form)
        if (res) message.success('Thêm thành công!')
      }
      refreshInput()
      openModal.value = false
      loading.value = false
      getData()
    } catch (error) {
      loading.value = false
    }
    loading.value = false
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

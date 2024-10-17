import { defineStore } from 'pinia'
import { ref, reactive, watch } from 'vue'
import type { ICompany, IPaginate } from '../../types/backend'
import { message } from 'ant-design-vue'
import companyService from '../../services/company.service'

const useCompanyStore = defineStore('company', () => {
  const { getApi, createApi, updateApi, deleteApi, paginateApi } = companyService

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
    address: '',
    description: '',
    isActive: false
  })

  const loading = ref<boolean>(false)

  const refreshInput = () => {
    form._id = ''
    form.name = ''
    form.address = ''
    form.description = ''
    form.isActive = false
    form.logo = ''
  }

  const handleOpenModal = () => {
    refreshInput()
    openModal.value = true
  }

  const getData = async (search?: string) => {
    loading.value = true
    try {
      const params = `?current=${dataMeta.value?.current}&pageSize=${dataMeta.value?.pageSize}&isActive=${isActive.value}&sort=-createdAt${search ? '&name=/' + search + '/' : ''}`
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

import { defineStore } from 'pinia'
import { ref, reactive, watch } from 'vue'
import type { IJob, IPaginate } from '../../types/backend'
import { message } from 'ant-design-vue'
import jobService from '../../services/job.service'
import accountService from '../../constant/account.service'

const useJobStore = defineStore('job', () => {
  const { getApi, createApi, updateApi, deleteApi, paginateApi } = jobService
  const { account } = accountService.getAccount()
  const openModal = ref<boolean>(false)
  const dataMeta = ref<IPaginate>({
    current: 1,
    pageSize: 6,
    pages: 0,
    total: 0
  })

  const data = ref<IJob[]>([])
  const valueSearch = ref<string>('')
  const form = reactive<IJob>({
    _id: '',
    name: '',
    skills: [],
    location: '',
    salary: 0,
    quantity: 0,
    level: '',
    companyId: {
      _id: ''
    },
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    isActive: true
  })

  const loading = ref<boolean>(false)

  const refreshInput = () => {
    form._id = ''
    form.name = ''
    form.skills = []
    form.location = ''
    form.salary = 0
    form.quantity = 0
    form.companyId = {
      _id: ''
    }
    form.level = ''
    form.description = ''
    ;(form.startDate = new Date()), (form.endDate = new Date()), (form.isActive = true)
  }

  const handleOpenModal = () => {
    openModal.value = true
    refreshInput()
  }

  const isActive = ref<boolean>(true)
  watch(isActive, () => {
    getData()
  })

  const getData = async (search?: string) => {
    loading.value = true
    try {
      const params = `?current=${dataMeta.value?.current}&pageSize=${dataMeta.value?.pageSize}&isActive=${isActive.value}&sort=-createdAt${search ? '&name=/' + search + '/' : ''}${account?.role.name === 'HR_USER' ? '&companyId=' + account.companyId : ''}`
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
        const res = await updateApi({ ...form, companyId: form.companyId?._id }, form._id)
        if (res) message.success('Cập nhật thành công!')
      } else {
        const res = await createApi({ ...form, companyId: form.companyId?._id })
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
    isActive,
    getByID,
    handleOpenModal
  }
})

export default useJobStore

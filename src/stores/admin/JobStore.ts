import { defineStore } from 'pinia'
import { ref, reactive, watch } from 'vue'
import type { IJob, IPaginate } from '../../types/backend'
import { message } from 'ant-design-vue'
import accountService from '../../services/account.service'
import apiService from '../../services/api.service'
import type { Dayjs } from 'dayjs'

const useJobStore = defineStore('job', () => {
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
  const valueDefault = <IJob>{  
    _id: '',
    name: '',
    skills: [],
    location: '',
    salaryFrom: 0,
    salaryTo: 0,
    isSalary: false,
    quantity: 0,
    level: '',
    companyId: {
      _id: account?.role.name === 'HR_USER' ? account?.companyId : ''
    },
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    isActive: true
  }
  const form = reactive<IJob>(JSON.parse(JSON.stringify(valueDefault)))

  const loading = ref<boolean>(false)
  const refreshInput = () => {
    Object.assign(form, JSON.parse(JSON.stringify(valueDefault)))
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
      const params = `?page=${dataMeta.value?.current}&pageSize=${dataMeta.value?.pageSize}${search ? '&search=' + search  : ''}&filter=isActive=${isActive.value},sort=-createdAt${account?.role.name === 'HR_USER' ? ',companyId=' + account.companyId  : ''}`
      const res = await apiService.get('jobs' + params)
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
      const res = await apiService.delete('jobs/' + id)
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
      const res = await apiService.get('jobs/' + id)
      if (res) {
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
        const res = await apiService.update('jobs/' + form._id, {
          ...form,
          companyId: form.companyId?._id
        })
        if (res) message.success('Cập nhật thành công!')
      } else {
        const res = await apiService.add('jobs', { ...form, companyId: form.companyId?._id })
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
    isActive,
    getByID,
    handleOpenModal
  }
})

export default useJobStore

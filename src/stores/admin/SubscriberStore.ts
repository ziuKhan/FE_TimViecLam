import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import type { IPaginate, IRole, ISubscribers } from '../../types/backend'
import { message } from 'ant-design-vue'
import apiService from '../../services/api.service'

const useSubscriberStore = defineStore('subscriber', () => {
  const openModal = ref<boolean>(false)
  const dataMeta = ref<IPaginate>({
    current: 1,
    pageSize: 6,
    pages: 0,
    total: 0
  })

  const data = ref<ISubscribers[]>([])
  const valueSearch = ref<string>('')

  const form = reactive<ISubscribers>({
    _id: '',
    name: '',
    email: '',
    skills: []
  })

  const loading = ref<boolean>(false)

  const refreshInput = () => {
    form._id = ''
    form.name = ''
    form.email = ''
    form.skills = []
  }

  const handleOpenModal = () => {
    openModal.value = true
    refreshInput()
  }

  const getData = async (search?: string) => {
    loading.value = true
    try {
      const params = `?page=${dataMeta.value?.current}&pageSize=${dataMeta.value?.pageSize}&sort=-createdAt${search ? '&name=/' + search + '/' : ''}`
      const res = await apiService.get('subscribers' + params)
      if (res) {
        data.value = res.data.result
        dataMeta.value = res.data.meta
        loading.value = false
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
      const res = await apiService.delete('subscribers/' + id)
      if (res) {
        message.success('Xóa thành công!')
        loading.value = false
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
      const res = await apiService.get('subscribers/' + id)
      if (res) {
        Object.assign(form, res.data)
        openModal.value = true
        loading.value = false
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
        const res = await apiService.update('subscribers/' + form.email, form)
        if (res) message.success('Cập nhật thành công!')
      } else {
        const res = await apiService.add('subscribers', form)
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
    form,
    loading,
    data,
    dataMeta,
    valueSearch,
    updateAndAdd,
    getData,
    refreshInput,
    deleteByID,
    getByID,
    handleOpenModal
  }
})

export default useSubscriberStore

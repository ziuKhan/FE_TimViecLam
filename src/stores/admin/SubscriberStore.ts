import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import type { IPaginate, IRole, ISubscribers } from '../../types/backend'
import { message } from 'ant-design-vue'
import subscriberService from '../../services/subscriber.service'

const useSubscriberStore = defineStore('subscriber', () => {
  const { getApi, createApi, updateApi, deleteApi, paginateApi } = subscriberService

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
      const params = `?current=${dataMeta.value?.current}&pageSize=${dataMeta.value?.pageSize}&sort=-createdAt${search ? '&name=/' + search + '/' : ''}`
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
        const res = await updateApi(form)
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
    handleOpenModal
  }
})

export default useSubscriberStore

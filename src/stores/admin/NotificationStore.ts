import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import type { INotification, IPaginate, IRole, ISubscribers } from '../../types/backend'
import { message } from 'ant-design-vue'
import notificationService from '../../services/notification.service'

const useNotificationStore = defineStore('notification', () => {
  const { getApi, createApi, updateApi, deleteApi, paginateApi } = notificationService

  const openModal = ref<boolean>(false)
  const dataMeta = ref<IPaginate>({
    current: 1,
    pageSize: 6,
    pages: 0,
    total: 0
  })

  const data = ref<INotification[]>([])
  const valueSearch = ref<string>('')
  const defaultForm: INotification = {
    _id: '',
    title: '',
    message: '',
    type: '',
    url: '',
    isRead: false,
    isGlobal: false,
    isURL: true
  }
  const form = reactive<INotification>(JSON.parse(JSON.stringify(defaultForm)))

  const loading = ref<boolean>(false)

  const refreshInput = () => {
    Object.assign(form, JSON.parse(JSON.stringify(defaultForm)))
  }

  const handleOpenModal = () => {
    refreshInput()
    openModal.value = true
  }

  const getData = async (search?: string) => {
    loading.value = true
    try {
      const params = `?page=${dataMeta.value?.current}&pageSize=${dataMeta.value?.pageSize}&filter=sort=-createdAt${search ? ',title=/' + search + '/' : ''}`
      const res = await paginateApi(params)
      if (res) {
        data.value = res.items
        dataMeta.value.total = res.total
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
    handleOpenModal
  }
})

export default useNotificationStore

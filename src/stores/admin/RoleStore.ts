import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import type { IPaginate, IRole } from '../../types/backend'
import { message } from 'ant-design-vue'
import apiService from '../../services/api.service'

const useRoleStore = defineStore('role', () => {
  const openModal = ref<boolean>(false)
  const dataMeta = ref<IPaginate>({
    current: 1,
    pageSize: 6,
    pages: 0,
    total: 0
  })

  const data = ref<IRole[]>([])
  const valueSearch = ref<string>('')

  const form = reactive<IRole>({
    _id: '',
    name: '',
    description: '',
    isActive: false,
    permissions: [] as any
  })

  const loading = ref<boolean>(false)

  const refreshInput = () => {
    form._id = ''
    form.name = ''
    form.description = ''
    form.isActive = false
    form.permissions = []
  }

  const handleOpenModal = () => {
    openModal.value = true
    refreshInput()
  }

  const getData = async (search?: string) => {
    loading.value = true
    try {
      const params = `?current=${dataMeta.value?.current}&pageSize=${dataMeta.value?.pageSize}&sort=-createdAt${search ? '&name=/' + search + '/' : ''}`
      const res = await apiService.get('roles' + params)
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
      const res = await apiService.delete('roles/' + id)
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
      const res = await apiService.get('roles/' + id)
      if (res) {
        Object.assign(form, res.data)
        form.permissions = res.data.permissions.map((permission: any) => permission._id)
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
        const res = await apiService.update('roles/' + form._id, form)
        if (res) message.success('Cập nhật thành công!')
      } else {
        const res = await apiService.add('roles', form)
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
    handleOpenModal
  }
})

export default useRoleStore

import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import type { IPaginate, IPermission, IRole } from '../../types/backend'
import {
  createPermissionApi,
  deletePermissionApi,
  getPermissionApi,
  paginatePermissionApi,
  updatePermissionApi
} from '../../services/permission.service'
import { message } from 'ant-design-vue'
import roleService from '../../services/role.service'

const useRoleStore = defineStore('permission', () => {
  const { getApi, createApi, updateApi, deleteApi, paginateApi } = roleService

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
    permissions: []
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

  //chức năng xoá
  const deleteByID = async (id: string) => {
    loading.value = true
    try {
      const res = await deleteApi(id)
      if (res) {
        message.success('Xóa thành công!')
        loading.value = false
        getData()
      }
    } catch (error) {
      loading.value = false

      console.error('Error fetching data:', error)
    }
  }

  //code dành cho permission update

  const updateAndAdd = async () => {
    loading.value = true
    if (form._id) {
      try {
        const res = await updateApi(form, form._id)
        if (res) {
          message.success('Cập nhật thành công!')
          refreshInput()
          openModal.value = false
          loading.value = false
          getData()
        }
      } catch (error) {
        loading.value = false
      }
    } else {
      try {
        const res = await createApi(form)
        if (res) {
          message.success('Thêm thành công!')
          refreshInput()
          openModal.value = false
          loading.value = false
          getData()
        }
      } catch (error) {
        loading.value = false
      }
    }
    loading.value = false
  }

  //chức năng xem chi tiết
  const getByID = async (id: string) => {
    try {
      loading.value = true
      const res = await getApi(id)
      if (res) {
        form._id = res._id
        form.name = res.name
        form.description = res.description
        form.isActive = res.isActive
        form.permissions = res.permissions
        openModal.value = true
        loading.value = false
      }
    } catch (error) {
      loading.value = false

      console.error('Error fetching data:', error)
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

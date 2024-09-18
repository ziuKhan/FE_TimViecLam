import { defineStore } from 'pinia'
import { onMounted, reactive, ref } from 'vue'
import type { IPaginate, IPermission } from '../../types/backend'
import {
  createPermissionApi,
  deletePermissionApi,
  getPermissionApi,
  paginatePermissionApi,
  updatePermissionApi
} from '../../services/permission.service'
import { message } from 'ant-design-vue'

const usePermissionStore = defineStore('permission', () => {
  const openModal = ref<boolean>(false)

  const load = ref<boolean>(false)
  const dataMeta = ref<IPaginate>({
    current: 1,
    pageSize: 6,
    pages: 0,
    total: 0
  })
  const data = ref<IPermission[]>([])
  const valueSearch = ref<string>('')
  const form = reactive<IPermission>({
    _id: '',
    name: '',
    apiPath: '',
    module: '',
    method: ''
  })
  const loading = ref<boolean>(false)
  const refreshInput = () => {
    form._id = ''
    form.name = ''
    form.apiPath = ''
    form.module = ''
    form.method = ''
  }
  const handleOpenModal = () => {
    openModal.value = true
    refreshInput()
  }

  const getData = async (search?: string) => {
    load.value = true
    try {
      const params = `?current=${dataMeta.value?.current}&pageSize=${dataMeta.value?.pageSize}&sort=-createdAt${search ? '&name=/' + search + '/' : ''}`
      const res = await paginatePermissionApi(params)
      if (res) {
        data.value = res.result
        dataMeta.value = res.meta
        load.value = false
      }
    } catch (error) {
      load.value = false
      console.error('Error fetching data:', error)
    }
  }

  //chức năng xoá
  const deletePermission = async (id: string) => {
    load.value = true
    try {
      const res = await deletePermissionApi(id)
      if (res) {
        message.success('Xóa thành công!')
        load.value = false
        getData()
      }
    } catch (error) {
      load.value = false

      console.error('Error fetching data:', error)
    }
  }

  //code dành cho permission update

  const getPermissionByID = async (id: string) => {
    try {
      loading.value = true
      const res = await getPermissionApi(id)
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
        const res = await updatePermissionApi(form, form._id)
        if (res) message.success('Cập nhật thành công!')
      } else {
        const res = await createPermissionApi(form)
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
    load,
    deletePermission,
    getPermissionByID,
    handleOpenModal
  }
})

export default usePermissionStore

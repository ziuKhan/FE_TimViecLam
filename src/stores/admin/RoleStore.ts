import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import type { IPaginate, IRole } from '../../types/backend'
import { message } from 'ant-design-vue'
import roleService from '../../services/role.service'

interface RoleStoreState {
  openModal: boolean
  dataMeta: IPaginate
  data: IRole[]
  valueSearch: string
  form: IRole
  loading: boolean
}

const useRoleStore = defineStore('role', () => {
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

  const updateAndAdd = async () => {
    loading.value = true
    if (form._id) {
      try {
        const res = await updateApi(form, form._id)
        if (res) {
          message.success('Cập nhật thành công!')
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
          message.success('Thêm thành công!')
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

  const getByID = async (id: string) => {
    try {
      loading.value = true
      const res = await getApi(id)
      const { _id, name, description, isActive, permissions } = res.data
      if (res) {
        form._id = _id
        form.name = name
        form.description = description
        form.isActive = isActive
        form.permissions = permissions.map((permission: any) => permission._id)
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

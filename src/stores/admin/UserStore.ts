import { defineStore } from 'pinia'
import { onMounted, reactive, ref, watch } from 'vue'
import type { IPaginate, IRole, IUser } from '../../types/backend'
import { message, type FormInstance } from 'ant-design-vue'
import apiService from '../../services/api.service'

const useUserStore = defineStore('user', () => {
  const openModal = ref<boolean>(false)
  const keySearchRole = ref<string>('')
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
  const data = ref<IUser[]>([])

  const valueSearch = ref<string>('')

  const form = reactive<IUser>({
    _id: '',
    name: '',
    email: '',
    password: '',
    gender: '',
    address: '',
    role: '',
    isActive: false,
    company: {
      _id: '',
      name: ''
    }
  })

  const loading = ref<boolean>(false)
  const refreshInput = () => {
    form._id = ''
    form.name = ''
    form.email = ''
    form.password = ''
    form.gender = ''
    form.address = ''
    form.role = ''
    form.isActive = false
    form.company = {
      _id: '',
      name: ''
    }
  }

  function filterFormData(formData: any) {
    const filteredData: any = { _id: formData._id, name: formData.name }
    if (formData.email) filteredData.email = formData.email
    if (formData.gender) filteredData.gender = formData.gender
    if (formData.address) filteredData.address = formData.address
    if (formData.role) filteredData.role = formData.role
    if (formData.isActive !== undefined) filteredData.isActive = formData.isActive
    if (formData.company && (formData.company._id || formData.company.name)) {
      filteredData.company = formData.company
    }
    return filteredData
  }

  const handleOpenModal = () => {
    refreshInput()
    openModal.value = true
  }

  const getData = async (search?: string) => {
    loading.value = true
    try {
      const params = `?page=${dataMeta.value?.page}&pageSize=${dataMeta.value?.pageSize}&filter=populate=role,isActive=${isActive.value},sort=-createdAt${search ? ',name=/' + search + '/' : ''}${keySearchRole.value ? ',role=' + keySearchRole.value + '' : ''}`
      const res = await apiService.get('users' + params)
      if (res) {
        data.value = res.data.result
        dataMeta.value = res.data.meta
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      loading.value = false
    }
  }

  //chức năng xoá
  const deleteByID = async (id: string) => {
    loading.value = true
    try {
      const res = await apiService.delete('users/' + id)
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
    try {
      const filteredForm = filterFormData(form)
      if (form._id) {
        const res = await apiService.update(`users/${form._id}`, filteredForm)
        if (res) message.success('Cập nhật thành công!')
      } else {
        const res = await apiService.add(`users`, filteredForm)
        if (res) message.success('Thêm thành công!')
      }
      refreshInput()
      // openModal.value = false
      loading.value = false
      openModal.value = false

      getData()
    } catch (error: any) {
      message.error(error.response.data.message)
    } finally {
      loading.value = false
    }
  }

  //chức năng xem chi tiết
  const getByID = async (id: string) => {
    loading.value = true
    try {
      const res = await apiService.get('users/' + id)
      if (res) {
        form._id = res.data._id
        form.name = res.data.name || ''
        form.email = res.data.email || ''
        form.gender = res.data.gender || ''
        form.address = res.data.address || ''
        form.role = res.data.role?._id || ''
        form.company = res.data.company || { _id: '', name: '' }
        form.isActive = res.data.isActive || false
        openModal.value = true
      }
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
    handleOpenModal,
    isActive,
    keySearchRole
  }
})

export default useUserStore

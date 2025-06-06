import { defineStore } from 'pinia'
import { ref, reactive, watch } from 'vue'
import { message } from 'ant-design-vue'
import type { IPaginate, IResume } from '../../types/backend'
import notificationService from '../../services/notification.service'
import accountService from '../../services/account.service'
import apiService from '../../services/api.service'

const useResumeStore = defineStore('resume', () => {
  const { account } = accountService.getAccount()
  const openModal = ref<boolean>(false)
  const openDrawer = ref<boolean>(false)
  const viewResume = ref<boolean>(false)
  const dataMeta = ref<IPaginate>({
    current: 1,
    pageSize: 6,
    pages: 0,
    total: 0
  })

  const data = ref<IResume[]>([])
  const valueSearch = ref<string>('')
  const loading = ref<boolean>(false)

  const form = reactive<IResume | any>({
    _id: '',
    email: '',
    userId: '',
    url: '',
    description: '',
    status: '',
    companyId: '',
    jobId: '',
    history: [
      {
        status: '',
        updatedAt: '',
        updatedBy: { _id: '', email: '' }
      }
    ]
  })
  const refreshForm = JSON.parse(JSON.stringify(form))
  const refreshInput = () => {
    Object.assign(form, refreshForm)
  }

  const getByID = async (id: string, detail?: boolean) => {
    try {
      loading.value = true
      const res = await apiService.get('resumes/' + id)
      if (res) {
        Object.assign(form, res.data)
        if (detail) openDrawer.value = true
        else openModal.value = true
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
         await apiService.update('resumes/' + form._id, {
          ...form,
          companyId: form.companyId?._id,
          jobId: form.jobId?._id
        })
         message.success('Cập nhật thành công!')
      } else {
         await apiService.add('resumes', form)
        message.success('Thêm thành công!')
      }
      openModal.value = false
      openDrawer.value = false
      refreshInput()
      getData()
    } catch (error: any) {
      message.error(error.response.data.message)
    } finally {
      loading.value = false
    }
  }
  const handleOpenModal = () => {
    refreshInput()
    openModal.value = true
  }

  const isStatus = ref<string>('')
  watch(isStatus, () => {
    getData()
  })

  const getData = async (search?: string) => {
    loading.value = true
    try {
      const params = `?page=${dataMeta.value?.current}&pageSize=${dataMeta.value?.pageSize}&filter=status=${isStatus.value},sort=-createdAt${search ? ',email=/' + search + '/' : ''}${account?.role.name === 'HR_USER' ? ',companyId=' + account.companyId : ''}`
      const res = await apiService.get('resumes' + params)
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
      const res = await apiService.delete('resumes/' + id)
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

  return {
    openModal,
    openDrawer,
    updateAndAdd,
    form,
    viewResume,
    loading,
    data,
    dataMeta,
    getData,
    valueSearch,
    deleteByID,
    getByID,
    handleOpenModal,
    isStatus
  }
})

export default useResumeStore

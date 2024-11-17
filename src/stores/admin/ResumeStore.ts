import { defineStore } from 'pinia'
import { ref, reactive, watch } from 'vue'
import { message } from 'ant-design-vue'
import resumeService from '../../services/resume.service'
import type { IPaginate, IResume } from '../../types/backend'
import notificationService from '../../services/notification.service'
import accountService from '../../constant/account.service'

const useResumeStore = defineStore('resume', () => {
  const { getApi, createApi, updateApi, deleteApi, paginateApi } = resumeService
  const { account } = accountService.getAccount()
  const openModal = ref<boolean>(false)
  const openDrawer = ref<boolean>(false)

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

  const refreshInput = () => {
    for (const key in form) {
      form[key] = ''
    }
  }

  const getByID = async (id: string, detail?: boolean) => {
    try {
      loading.value = true
      const res = await getApi(id)
      if (res) {
        Object.assign(form, res.data)
        if (detail) openDrawer.value = true
        else openModal.value = true
        loading.value = false
      }
    } catch (error) {
      loading.value = false
      console.error('Error fetching data:', error)
    }
  }

  const updateAndAdd = async () => {
    loading.value = true
    debugger
    try {
      if (form._id) {
        const [res, resNotification] = await Promise.all([
          updateApi({ ...form, companyId: form.companyId?._id, jobId: form.jobId?._id }, form._id),
          notificationService.createByUserApi({
            title: 'Thông báo',
            message: `Hồ sơ xin việc của bạn đã cập nhật trang thái ${form.status}`,
            type: 'RESUME',
            userId: form.userId,
            isRead: false,
            url: '/admin/resumes'
          })
        ])
        if (res) message.success('Cập nhật thành công!')
      } else {
        const res = await createApi(form)
        if (res) message.success('Thêm thành công!')
      }
      refreshInput()
      openModal.value = false
      openDrawer.value = false
      loading.value = false
      getData()
    } catch (error) {
      loading.value = false
    }
    loading.value = false
  }
  const handleOpenModal = () => {
    refreshInput()
    openModal.value = true
  }

  const isStatus = ref<string>('PENDING')
  watch(isStatus, () => {
    getData()
  })

  const getData = async (search?: string) => {
    loading.value = true
    try {
      const params = `?current=${dataMeta.value?.current}&pageSize=${dataMeta.value?.pageSize}&status=${isStatus.value}&sort=-createdAt${search ? '&email=/' + search + '/' : ''}${account?.role.name === 'HR_USER' ? '&companyId=' + account.companyId : ''}`
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

  return {
    openModal,
    openDrawer,
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
    isStatus
  }
})

export default useResumeStore

<script lang="ts" setup>
import { onMounted, reactive, ref, watchEffect } from 'vue'
import type { ICompany, IPaginate, IRole, IUser } from '../../types/backend'

import dayjs from 'dayjs'
import apiService from '../../services/api.service'
import { message } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons-vue'

const columns = [
  {
    title: 'STT'
  },
  {
    title: 'Tên',
    dataIndex: 'name'
  },
  {
    title: 'Email',
    dataIndex: 'email'
  },
  {
    title: 'Giới tính',
    dataIndex: 'gender'
  },
  {
    title: 'Trạng thái',
    dataIndex: 'isActive'
  },
  {
    title: 'Vai trò',
    dataIndex: ['role', 'name']
  },
  {
    title: 'Địa chỉ',
    dataIndex: 'address'
  },
  {
    title: 'Ngày tạo',
    dataIndex: 'createdAt'
  },
  {
    title: 'Thao tác',
    dataIndex: '_id'
  }
]

const handleTableChange = (pagination: IPaginate) => {
  dataMeta.value.current = pagination.current
  dataMeta.value.pageSize = pagination.pageSize
  getData()
}

const dataRoles = ref<IRole[]>()
const keySearch = ref<string>('')
const openModal = ref<boolean>(false)
const keySearchRole = ref<string>('')
const dataMeta = ref<IPaginate>({
  current: 1,
  pageSize: 6,
  pages: 0,
  total: 0
})
const isActive = ref<boolean>(true)

const data = ref<IUser[]>([])

const valueSearch = ref<string>('')
const valueFilter = ref<Partial<IUser> & { isActive: boolean; sort: boolean }>({
  isActive: true,
  role: '',
  name: '',
  email: '',
  gender: '',
  address: '',
  sort: true
})
const form = reactive<IUser>({
  _id: '',
  name: '',
  email: '',
  password: '',
  gender: '',
  address: '',
  role: '',
  isActive: true,
  company: {
    _id: '',
    name: ''
  }
})

const loading = ref<boolean>(false)
const refreshInput = () => {
  Object.assign(form, {
    _id: '',
    name: '',
    email: '',
    password: '',
    gender: '',
    address: '',
    role: '',
    isActive: false,
    company: { _id: '', name: '' }
  })
}
const handleRole = () => {
  dataMeta.value.current = 1
  getData()
}
const handleOpenModal = () => {
  refreshInput()
  openModal.value = true
}

const getData = async () => {
  const conditions = Object.entries(valueFilter.value)
    .filter(([key, value]) => value !== null && value !== undefined && value !== '')
    .map(([key, value]) => {
      if (key === 'sort') {
        return `sort=${value ? 'createdAt' : '-createdAt'}`
      }
      return `${key}=${value}`
    })

  const filter = conditions.join(',')
  loading.value = true
  try {
    const params = `?page=${dataMeta.value?.current}&pageSize=${dataMeta.value?.pageSize}${filter ? `&filter=${filter}` : ''}${keySearch.value ? `&search=${keySearch.value}` : ''}`
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
    if (form._id) {
      const res = await apiService.update(`users/${form._id}`, form)
      if (res) message.success('Cập nhật thành công!')
    } else {
      const res = await apiService.add(`users`, form)
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

// Định nghĩa các rule cho form
const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: 'Vui lòng nhập name' }],
  email: [
    { required: true, message: 'Vui lòng nhập địa chỉ email' },
    { type: 'email', message: 'vui lòng nhập email hợp lệ' }
  ],
  role: [{ required: true, message: 'Vui lòng nhập role ' }],
  address: [{ required: true, message: 'Vui lòng nhập address ' }],
  gender: [{ required: true, message: 'Vui lòng nhập gender ' }]
}

const dataCompanies = ref<ICompany[]>([])

const getDataOption = async () => {
  try {
    const [role, company] = await Promise.all([
      apiService.get('roles?current=1&pageSize=200'),
      apiService.get('companies?current=1&pageSize=200')
    ])
    dataRoles.value = role.data.result
    dataCompanies.value = company.data.result
  } catch (e) {}
}

const handleCompanyChange = (companyId: string) => {
  if (form.company) {
    if (companyId === 'Bỏ chọn') {
      form.company._id = ''
      form.company.name = ''
    }
    const selectedCompany = dataCompanies.value.find(
      (company: ICompany) => company._id === companyId
    )
    if (selectedCompany) {
      form.company._id = selectedCompany._id
      form.company.name = selectedCompany.name
    }
  }
}

const formRef = ref<any>(null)
const handleOk = () => {
  formRef.value
    .validate()
    .then(() => {
      updateAndAdd()
    })
    .catch(() => {
      message.error('Vui lòng kiểm tra lại các trường đã nhập!')
    })
}

onMounted(() => {
  getData()
  getDataOption()
})
</script>
<template>
  <a-layout-header
    :style="{ background: '#fff', padding: '0 20px' }"
    class="p-0 text-lg font-medium"
    >Trang quản lý tài khoản</a-layout-header
  >
  <a-layout-content style="margin: 0 16px">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>Trang chủ</a-breadcrumb-item>
      <a-breadcrumb-item>Quản lý tài khoản</a-breadcrumb-item>
    </a-breadcrumb>
    <div class="p-6 bg-white min-h-[360px] rounded-[10px]">
      <div class="flex justify-between">
        <div class="w-3/4 flex" v-permission="'GET /api/v1/users'">
          <a-input-search
            placeholder="Vui lòng nhập thông tin cần tìm kiếm"
            enter-button="Tìm kiếm"
            v-model:value="keySearch"
            @search="getData"
            class="w-3/6"
          />
          <a-select
            v-model:value="valueFilter.role"
            class="w-1/5 ml-5"
            placeholder="Chọn role"
            @change="handleRole"
          >
            <a-select-option :value="''">Tất cả vai trò</a-select-option>
            <template v-for="role in dataRoles" :key="role._id">
              <a-select-option :value="role._id">{{ role.name }}</a-select-option>
            </template>
          </a-select>
          <div class="ml-5 flex items-center">
            <span class="mr-3 font-medium">Trạng thái</span>
            <a-switch v-model:checked="valueFilter.isActive" @change="handleRole" />
          </div>
        </div>
        <button
          class="bg-[#21aa55] hover:bg-green-500 text-white rounded-[7px] px-5 font-medium"
          @click="handleOpenModal()"
          v-permission="'POST /api/v1/users'"
        >
          Thêm mới
        </button>
      </div>

      <div class="mt-3 border rounded-[10px]">
        <a-table
          :columns="columns"
          :data-source="data"
          :loading="loading"
          :pagination="dataMeta"
          @change="handleTableChange"
        >
          <template #bodyCell="{ column, text, index }">
            <template v-if="column.title === 'STT'">
              {{ ((dataMeta.current || 1) - 1) * (dataMeta.pageSize || 6) + index + 1 }}
            </template>
            <template v-else-if="column.dataIndex === 'createdAt'">
              {{ dayjs(text).format('DD/MM/YYYY [lúc] HH:mm:ss') }}
            </template>
            <template v-else-if="column.dataIndex === 'isActive'">
              <span :class="text ? 'text-green-600' : 'text-red-500'">
                {{ text ? 'Hoạt động' : 'Không hoạt động' }}
              </span>
            </template>
            <template v-else-if="column.dataIndex === '_id'">
              <div class="flex">
                <button
                  type="button"
                  class="mr-2 bg-[#1669dcec] hover:bg-[#498ff1] rounded-[5px] px-[10px] py-1 h-8"
                  @click="getByID(text)"
                  v-permission="'PATCH /api/v1/users/:id'"
                >
                  <EditOutlined class="text-white" />
                </button>
                <a-popconfirm
                  title="Bạn có chắc muốn xoá?"
                  ok-text="Có"
                  cancel-text="Không"
                  :loading="loading"
                  @confirm="deleteByID(text)"
                  @cancel=""
                  v-permission="'DELETE /api/v1/users/:id'"
                >
                  <button
                    type="button"
                    class="bg-red-500 hover:bg-red-400 rounded-[5px] px-[10px] ] py-1 h-8"
                  >
                    <DeleteOutlined class="text-white" />
                  </button>
                </a-popconfirm>
              </div>
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </a-layout-content>

  <a-modal
    :title="form._id ? 'Cập nhật tài khoản' : 'Tạo mới tài khoản'"
    :okText="form._id ? 'Cập nhật' : 'Thêm mới'"
    :width="850"
    v-model:open="openModal"
    :maskClosable="false"
    :cancelButtonProps="{ style: { display: 'none' } }"
    @ok="handleOk"
  >
    <a-form ref="formRef" :model="form" :rules="rules" layout="vertical" class="">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="Tên" name="name">
            <a-input v-model:value="form.name" placeholder="Vui lòng nhập tên" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Email" name="email">
            <a-input v-model:value="form.email" placeholder="Vui lòng nhập email" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="Mật khẩu" name="password">
            <a-input-password v-model:value="form.password" placeholder="Vui lòng nhập mật khẩu" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Vai trò" name="role">
            <a-select v-model:value="form.role" placeholder="Vui này chọn vai trò">
              <template v-for="role in dataRoles" :key="role._id">
                <a-select-option :value="role._id">{{ role.name }}</a-select-option>
              </template>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="20">
          <a-form-item label="Giới tính" name="gender">
            <a-select v-model:value="form.gender" placeholder="Vui này chọn giới tính">
              <a-select-option selected value="Nam">Nam</a-select-option>
              <a-select-option value="Nữ">Nữ</a-select-option>
              <a-select-option value="Khác">Khác</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="4">
          <a-form-item label="Trạng thái" name="isActive">
            <a-switch v-model:checked="form.isActive" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Địa chỉ" name="address">
            <a-input v-model:value="form.address" placeholder="Vui lòng nhập địa chỉ" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="Công ty" name="company._id">
            <a-select :value="form.company?.['_id']" @change="handleCompanyChange">
              <a-select-option value="Bỏ chọn"></a-select-option>
              <template v-for="company in dataCompanies" :key="company._id">
                <a-select-option :value="company._id">{{ company.name }}</a-select-option>
              </template>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<style>
.ant-drawer-header-title button,
.ant-drawer-header .ant-drawer-title {
  color: #232323 !important;
}
</style>

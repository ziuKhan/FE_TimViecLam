<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-10 theme_blackred2">
    <div class="max-w-6xl mx-auto">
      <div class="bg-white rounded-xl shadow-lg p-8 mb-5">
        <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">Thiết lập tài khoản</h1>

        <a-form :model="userInfo" layout="vertical" ref="formRef2">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="md:col-span-2 space-y-4">
              <a-form-item
                label="Mật khẩu mới"
                name="password"
                :rules="[
                  { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                ]"
              >
                <a-input-password
                  v-model:value="userInfo.password"
                  placeholder="Vui lòng nhập mật khẩu mới"
                />
              </a-form-item>
              <a-form-item
                label="Nhập lại mật khẩu mới"
                name="confirmPassword"
                :rules="[
                  { required: true, message: 'Vui lòng nhập lại mật khẩu mới!' },
                  {
                    validator: userInfo.password != userInfo.confirmPassword,
                    trigger: 'blur',
                    message: 'Mật khẩu không khớp!'
                  }
                ]"
              >
                <a-input-password
                  v-model:value="userInfo.confirmPassword"
                  placeholder="Vui lòng nhập lại mật khẩu mới"
                />
              </a-form-item>
              <a-form-item
                label="Họ và tên"
                name="name"
                :rules="[{ required: true, message: 'Vui lòng nhập họ và tên!' }]"
              >
                <a-input v-model:value="userInfo.name" placeholder="Vui lòng nhập họ và tên" />
              </a-form-item>

              <a-form-item
                label="Số điện thoại"
                name="phoneNumber"
                :rules="[
                  { required: true, message: 'Vui lòng nhập số điện thoại' },
                  {
                    pattern: /^0[0-9]{9,10}$/,
                    message: 'Số điện thoại phải bắt đầu bằng số 0 và có 10 hoặc 11 chữ số'
                  }
                ]"
              >
                <a-input
                  :maxLength="11"
                  v-model:value="userInfo.phoneNumber"
                  placeholder="Vui lòng nhập số điện thoại"
                />
              </a-form-item>

              <a-form-item
                label="Địa chỉ"
                name="address"
                :rules="[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]"
              >
                <a-input v-model:value="userInfo.address" placeholder="Vui lòng nhập địa chỉ" />
              </a-form-item>
            </div>

            <div class="flex flex-col items-center gap-3">
              <div class="border border-gray-200 rounded-lg p-1">
                <img
                  :src="`${userInfo?.avatar ? linkUploads('user/' + userInfo?.avatar) : 'https://placehold.co/600x400'}`"
                  alt="Avatar"
                  class="object-cover rounded-lg w-[150px] h-[150px]"
                />
              </div>
              <a-button @click="openModalAvatar = true">Tải lên ảnh đại diện</a-button>
              <p class="text-sm text-gray-500">Ảnh đại diện của bạn</p>
            </div>
          </div>
        </a-form>

        <!-- Điều hướng bước -->
        <div class="flex justify-center mt-8">
          <a-button type="primary" @click="nextStep" class="w-full" size="large" :loading="loading"
            >Xác nhận</a-button
          >
        </div>
      </div>
    </div>
  </div>

  <!-- Modal tải lên ảnh đại diện -->
  <a-modal
    v-model:open="openModalAvatar"
    title="Thay đổi ảnh đại diện"
    ok-text="Xác nhận"
    @ok="handleUploadUserAvatar()"
    @cancel="openModalAvatar = false"
    :maskClosable="false"
  >
    <div class="flex flex-col items-center w-full">
      <a-upload
        v-model:file-list="fileList"
        :before-upload="
          (file: File) => {
            handleFileChange(file)
            return false
          }
        "
        list-type="picture-card"
        :max-count="1"
      >
        <div>
          <UploadOutlined />
          <div style="margin-top: 8px">Tải lên</div>
        </div>
      </a-upload>
      <p class="text-gray-500 mt-2">Chọn ảnh và nhấn xác nhận để tải lên ảnh đại diện.</p>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { UserOutlined, UploadOutlined, ShoppingOutlined } from '@ant-design/icons-vue'
import accountService from '../../../services/account.service'
import type {
  ICompany,
  IUser,
  IUserbyAccount,
  ILocation,
  ILocationCountry
} from '../../../types/backend'
import { linkUploads } from '../../../constant/api'
import { message } from 'ant-design-vue'
import CKEditor from '../../../components/CKEditor.vue'
import type { UploadRequestOption } from 'ant-design-vue/es/vc-upload/interface'
import apiService from '../../../services/api.service'
import { useRouter } from 'vue-router'
import { getConscious, getCountry, getDistrict, getWard } from '../../../services/location.service'

const router = useRouter()
const { account, storage } = accountService.getAccount()
const userInfo = ref<IUser>({
  name: '',
  gender: '',
  address: '',
  avatar: linkUploads('user/' + account?.avatar),
  password: '',
  confirmPassword: '',
  isSetup: true
})
const companyInfo = ref<ICompany>({})

// Biến cho phần địa chỉ
const dataConscious = ref<ILocation[]>([])
const dataDistrict = ref<ILocation[]>([])
const dataWard = ref<ILocation[]>([])
const dataCountry = ref<ILocationCountry[]>([])

// Tải dữ liệu tỉnh thành
const getDataConscious = async () => {
  dataDistrict.value = []
  dataWard.value = []
  companyInfo.value.district = ''
  companyInfo.value.ward = ''
  try {
    const res = await getConscious()
    if (res) {
      dataConscious.value = res.data
    }
  } catch (error) {
    console.log(error)
  }
}

// Tải dữ liệu quốc gia
const getDataCountry = async () => {
  try {
    const res = await getCountry()
    if (res) {
      dataCountry.value = res.data
    }
  } catch (error) {
    console.log(error)
  }
}

// Tải dữ liệu quận/huyện theo tỉnh/thành
const getDataDistrict = async (name: string) => {
  dataWard.value = []
  companyInfo.value.ward = ''
  try {
    const id = dataConscious.value.find((item) => item.name === name)?.id
    const res = await getDistrict(id as string)
    if (res) {
      dataDistrict.value = res.data
    }
  } catch (error) {
    console.log(error)
  }
}

// Tải dữ liệu phường/xã theo quận/huyện
const getDataWard = async (name: string) => {
  try {
    const id = dataDistrict.value.find((item) => item.name === name)?.id
    const res = await getWard(id as string)
    if (res) {
      dataWard.value = res.data
    }
  } catch (error) {
    console.log(error)
  }
}

// Các biến khác
const openModalAvatar = ref<boolean>(false)
const selectedFile = ref<File | null>(null)
const fileList = ref([])
const companyFileList = ref([])
const loading = ref<boolean>(false)
const currentStep = ref<number>(0)
const isCompanyCreated = ref<boolean>(false)

const loadUserData = async () => {
  try {
    const userRes = await apiService.get('users/client/' + account?._id)
    userInfo.value = {
      name: userRes.data.name,
      gender: userRes.data.gender,
      address: userRes.data.address,
      avatar: userRes.data.avatar
    }
  } catch (error: any) {
    message.error(error.response?.data?.message || 'Lỗi khi tải thông tin người dùng')
  }
}

const updateAccount = async () => {
  if (!userInfo.value.name) {
    message.warning('Vui lòng nhập đầy đủ thông tin tài khoản!')
    return
  }
  if (!userInfo.value.password) {
    message.warning('Vui lòng nhập mật khẩu!')
    return
  }
  if (!userInfo.value.address) {
    message.warning('Vui lòng nhập địa chỉ!')
    return
  }
  if (!userInfo.value.confirmPassword) {
    message.warning('Vui lòng nhập lại mật khẩu!')
    return
  }
  if (userInfo.value.password !== userInfo.value.confirmPassword) {
    message.warning('Mật khẩu không khớp!')
    return
  }
  loading.value = true
  try {
    const res = await apiService.update('users/client/' + account?._id, {
      ...userInfo.value,
      isSetup: true
    })
    message.success('Cập nhật thông tin tài khoản thành công')
    if (res) {
      await updateAccountService()
      router.push('/')
      window.location.reload()
    }
  } catch (error: any) {
    message.error(error.response?.data?.message || 'Cập nhật thông tin thất bại')
  } finally {
    loading.value = false
  }
}

const updateAccountService = async () => {
  try {
    await accountService.updateAccount()
  } catch (error) {
    console.log(error)
  }
}
const handleFileChange = (file: File) => {
  selectedFile.value = file
}

const handleUploadUserAvatar = async () => {
  if (!selectedFile.value) {
    message.warning('Vui lòng chọn file trước khi xác nhận!')
    return
  }

  try {
    const res = await apiService.upload(selectedFile.value, 'user')
    if (res) {
      // Kiểm tra cấu trúc dữ liệu trả về từ API
      userInfo.value.avatar = res.data?.fileName || res.fileName
      openModalAvatar.value = false
      message.success('Tải lên ảnh đại diện thành công')
    }
  } catch (error: any) {
    message.error('Tải lên ảnh thất bại!')
  }
}

const handleUploadLogo = async (options: UploadRequestOption) => {
  const { file, onSuccess, onError } = options
  try {
    const res = await apiService.upload(file, 'company')
    if (res) {
      // Kiểm tra cấu trúc dữ liệu trả về từ API
      companyInfo.value.logo = res.data?.fileName || res.fileName
      message.success('Tải lên logo công ty thành công!')
      onSuccess && onSuccess(res)
    }
  } catch (err: any) {
    message.error('Tải lên logo thất bại!')
    onError && onError(err)
  }
}

watch(fileList, () => {
  if (fileList.value.length === 0) {
    userInfo.value.avatar = ''
  }
})

watch(companyFileList, () => {
  if (companyFileList.value.length === 0) {
    companyInfo.value.logo = ''
  }
})
const formRef2 = ref<any>(null)
const nextStep = () => {
  formRef2.value
    .validate()
    .then(() => {
      updateAccount()
    })
    .catch(() => {
      message.error('Vui lòng kiểm tra lại các trường đã nhập!')
    })
}

onMounted(() => {
  loadUserData()
  getDataConscious()
  getDataCountry()
})
</script>

<style>
.ant-upload-list-picture-card {
  display: flex;
  justify-content: center;
}

.ant-upload,
.ant-upload button {
  width: 100% !important;
}
</style>

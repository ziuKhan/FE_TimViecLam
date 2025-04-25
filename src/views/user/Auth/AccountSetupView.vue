<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-10 theme_blackred2">
    <div class="max-w-6xl mx-auto">
      <div class="bg-white rounded-xl shadow-lg p-8 mb-5">
        <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">Thiết lập tài khoản</h1>

        <a-steps :current="currentStep" class="mb-8">
          <a-step title="Thông tin tài khoản" />
          <a-step title="Thông tin công ty" />
        </a-steps>

        <!-- Bước 1: Tạo công ty -->
        <div v-if="currentStep === 0" class="space-y-6">
         
          <a-form :model="userInfo" layout="vertical" ref="formRef2">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="md:col-span-2 space-y-4">
                <a-form-item
                  label="Mật khẩu mới"
                  name="password"
                  :rules="[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' },
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

                <a-form-item label="Giới tính" name="gender">
                  <a-select v-model:value="userInfo.gender">
                    <a-select-option value="Nam">Nam</a-select-option>
                    <a-select-option value="Nữ">Nữ</a-select-option>
                    <a-select-option value="Khác">Khác</a-select-option>
                  </a-select>
                </a-form-item>

                <a-form-item label="Địa chỉ" name="address"
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
                    <a-button @click="openModalAvatar = true" 
                  >Tải lên ảnh đại diện</a-button
                >
                <p class="text-sm text-gray-500">Ảnh đại diện của bạn</p>
              </div>
            </div>
          </a-form>
        </div>

        <!-- Bước 2: Cập nhật thông tin cá nhân -->
        <div v-if="currentStep === 1" class="space-y-6">
            <a-form :model="companyInfo" layout="vertical" ref="formRef">
            <a-row :gutter="16">
              <a-col :span="17">
                <a-form-item
                  label="Tên công ty"
                  name="name"
                >
                  <a-input
                  disabled
                    v-model:value="companyInfo.name"
                    placeholder="Vui lòng nhập tên công ty"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="6">
                <a-form-item
                  label="Vui lòng tải logo lên"
                  name="logo"
                  :rules="[{ required: true, message: 'Vui lòng tải logo công ty lên!' }]"
                >
                  <a-upload
                    maxCount="1"
                    name="file"
                    v-model:file-list="companyFileList"
                    accept="image/png,image/svg+xml,image/x-icon,image/webp"
                    :custom-request="handleUploadLogo"
                    class="w-full"
                  >
                    <a-button>
                      <upload-outlined></upload-outlined>
                      Tải logo công ty
                    </a-button>
                  </a-upload>
                </a-form-item>
              </a-col>

              <a-col :span="12">
                <a-form-item
                  label="Thuộc quốc gia"
                  name="country"
                  :rules="[{ required: true, message: 'Vui lòng nhập quốc gia!' }]"
                >
                  <a-select
                    v-model:value="companyInfo.country"
                    show-search
                    option-filter-prop="label"
                    placeholder="Vui lòng chọn quốc gia"
                    style="width: 100%"
                  >
                    <a-select-option
                      v-for="item in dataCountry"
                      :key="item.id"
                      :value="item.id"
                      :label="item.niceName"
                    >
                      <span class="flex items-center">
                        {{ item.niceName }}
                        <img :src="item.flag" class="w-4 h-4 ml-2" loading="lazy" alt="#" />
                      </span>
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col :span="12">
                <a-form-item
                  label="Tỉnh thành"
                  name="province"
                  :rules="[{ required: true, message: 'Vui lòng nhập tỉnh/thành!' }]"
                >
                  <a-select
                    v-model:value="companyInfo.province"
                    :options="dataConscious"
                    :field-names="{ label: 'name', value: 'name' }"
                    show-search
                    @change="(value: string) => getDataDistrict(value)"
                    placeholder="Vui lòng chọn tỉnh/thành"
                    style="width: 100%"
                  >
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col :span="12">
                <a-form-item
                  label="Quận/Huyện"
                  name="district"
                  :rules="[{ required: true, message: 'Vui lòng nhập quận/huyện!' }]"
                >
                  <a-select
                    v-model:value="companyInfo.district"
                    :options="dataDistrict"
                    :field-names="{ label: 'name', value: 'name' }"
                    show-search
                    @change="(value: string) => getDataWard(value)"
                    placeholder="Vui lòng chọn quận/huyện"
                    style="width: 100%"
                  >
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col :span="12">
                <a-form-item
                  label="Phường/Xã"
                  name="ward"
                  :rules="[{ required: true, message: 'Vui lòng nhập phường/xã!' }]"
                >
                  <a-select
                    v-model:value="companyInfo.ward"
                    :options="dataWard"
                    :field-names="{ label: 'name', value: 'name' }"
                    show-search
                    placeholder="Vui lòng chọn phường/xã"
                    style="width: 100%"
                  >
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col :span="12">
                <a-form-item
                  label="Tên đường, Toà nhà, Số nhà"
                  name="detailedAddress"
                  :rules="[
                    { required: true, message: 'Vui lòng nhập tên đường/ toà nhà/ số nhà!' }
                  ]"
                >
                  <a-input
                    v-model:value="companyInfo.detailedAddress"
                    placeholder="Vui lòng nhập địa chỉ chi tiết"
                    style="width: 100%"
                  >
                  </a-input>
                </a-form-item>
              </a-col>

              <a-col :span="12">
                <a-form-item
                  label="Địa chỉ các văn phòng"
                  name="address"
                  :rules="[{ required: true, message: 'Vui lòng nhập địa chỉ các văn phòng!' }]"
                >
                  <a-select
                    v-model:value="companyInfo.address"
                    :options="dataConscious"
                    :field-names="{ label: 'name', value: 'name' }"
                    mode="multiple"
                    placeholder="Vui chọn địa chỉ các văn phòng"
                    style="width: 100%"
                  >
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col :span="12">
                <a-form-item
                  label="Quy mô công ty"
                  name="size"
                  :rules="[{ required: true, message: 'Vui lòng chọn quy mô công ty!' }]"
                >
                  <a-select
                    v-model:value="companyInfo.size"
                    placeholder="Vui lòng chọn quy mô"
                    style="width: 100%"
                  >
                    <a-select-option value="1-50">1-50 nhân viên</a-select-option>
                    <a-select-option value="51-200">51-200 nhân viên</a-select-option>
                    <a-select-option value="201-500">201-500 nhân viên</a-select-option>
                    <a-select-option value="501-1000">501-1000 nhân viên</a-select-option>
                    <a-select-option value="1000+">1000+ nhân viên</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="Lĩnh vực"
                  name="industry"
                  :rules="[{ required: true, message: 'Vui lòng chọn lĩnh vực!' }]"
                >
                  <a-input
                    v-model:value="companyInfo.industry"
                    placeholder="Vui lòng nhập lĩnh vực"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="12">
                <a-form-item
                  label="Mô hình công ty"
                  name="type"
                  :rules="[{ required: true, message: 'Vui lòng chọn mô hình công ty!' }]"
                >
                  <a-input
                    v-model:value="companyInfo.type"
                    placeholder="Vui lòng nhập mô hình công ty"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="12">
                <a-form-item
                  label="Ngày làm việc"
                  name="workingDays"
                  :rules="[{ required: true, message: 'Vui lòng chọn ngày làm việc!' }]"
                >
                  <a-select
                    v-model:value="companyInfo.workingDays"
                    mode="multiple"
                    placeholder="Vui lòng chọn ngày làm việc"
                    style="width: 100%"
                  >
                    <a-select-option value="monday">Thứ 2</a-select-option>
                    <a-select-option value="tuesday">Thứ 3</a-select-option>
                    <a-select-option value="wednesday">Thứ 4</a-select-option>
                    <a-select-option value="thursday">Thứ 5</a-select-option>
                    <a-select-option value="friday">Thứ 6</a-select-option>
                    <a-select-option value="saturday">Thứ 7</a-select-option>
                    <a-select-option value="sunday">Chủ nhật</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col :span="12">
                <a-form-item
                  label="Chính sách làm thêm giờ"
                  name="overtimePolicy"
                  :rules="[{ required: true, message: 'Vui lòng nhập chính sách làm thêm giờ!' }]"
                >
                  <a-input
                    v-model:value="companyInfo.overtimePolicy"
                    placeholder="Vui lòng nhập chính sách làm thêm giờ"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="24">
                <a-form-item
                  name="description"
                  :rules="[{ required: true, message: 'Vui lòng nhập mô tả!' }]"
                  class="m-0"
                >
                  <CKEditor
                    :description="companyInfo.description"
                    title="Mô tả"
                    v-model="companyInfo.description"
                  >
                  </CKEditor>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>

        <!-- Điều hướng bước -->
        <div class="flex justify-between mt-8">
          <a-button v-if="currentStep === 1" @click="prevStep">Quay lại</a-button>
          <a-button type="primary" :loading="loading" @click="nextStep">
            {{ currentStep === 0 ? 'Tiếp theo' : 'Hoàn tất' }}
          </a-button>
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
const account: IUserbyAccount | null = accountService.getAccount().account
const userInfo = ref<IUser>({})
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

const getCompany = async () => {
  try {
    const res = await apiService.get('companies/' + account?.companyId)
    companyInfo.value = res.data
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
    userInfo.value = userRes
  } catch (error: any) {
    message.error(error.response?.data?.message || 'Lỗi khi tải thông tin người dùng')
  }
}

const updateAccount = async () => {
    if (!userInfo.value.name ) {
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
  if(!userInfo.value.confirmPassword) {
    message.warning('Vui lòng nhập lại mật khẩu!')
    return
  }
  if(userInfo.value.password !== userInfo.value.confirmPassword) {
    message.warning('Mật khẩu không khớp!')
    return
  }
  loading.value = true
  try {
    currentStep.value = 1
  } catch (error: any) {
    message.error(error.response?.data?.message || 'Tạo công ty thất bại')
  } finally {
    loading.value = false
  }
}

const updateCompany = async () => {

  if (
    !companyInfo.value.country ||
    !companyInfo.value.province ||
    !companyInfo.value.district ||
    !companyInfo.value.ward ||
    !companyInfo.value.detailedAddress ||
    !companyInfo.value.size ||
    !companyInfo.value.industry ||
    !companyInfo.value.type ||
    !companyInfo.value.workingDays ||
    companyInfo.value.workingDays.length === 0 ||
    !companyInfo.value.overtimePolicy ||
    !companyInfo.value.description
  ) {
    message.warning('Vui lòng nhập đầy đủ thông tin công ty!')
    return
  }
  loading.value = true
  const updateData = {
    _id: account?._id,
    password: userInfo.value.password || '',
    name: userInfo.value.name || '',
    gender: userInfo.value.gender || '',
    address: userInfo.value.address || '',
    avatar: userInfo.value.avatar || '',
    company: {
      _id: companyInfo.value._id,
      address: companyInfo.value.address,
      name: companyInfo.value.name,
      logo: companyInfo.value.logo || '',
      isActive: true,
      description: companyInfo.value.description || '',
      province: companyInfo.value.province,
      district: companyInfo.value.district,
      ward: companyInfo.value.ward,
      country: companyInfo.value.country,
      detailedAddress: companyInfo.value.detailedAddress,
      type: companyInfo.value.type,
      size: companyInfo.value.size,
      industry: companyInfo.value.industry,
      workingDays: companyInfo.value.workingDays,
      overtimePolicy: companyInfo.value.overtimePolicy,
    }
  }

  try {
    const res = await apiService.add('customer-approval/setup', updateData)
      message.success('Cập nhật thông tin tài khoản thành công')
      // Hoàn tất thiết lập và chuyển hướng đến trang chủ
      await accountService.updateAccount()
      router.push('/')
  } catch (error: any) {
    message.error(error.response?.data?.message || 'Cập nhật thông tin thất bại')
  } finally {
    loading.value = false
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
const formRef = ref<any>(null)
const formRef2 = ref<any>(null)
const nextStep = () => {
  if (currentStep.value === 0) {
    formRef2.value
      .validate()
      .then(() => {
        updateAccount()
      })
      .catch(() => {
        message.error('Vui lòng kiểm tra lại các trường đã nhập!')
      })
  } else {
   
      formRef.value
      .validate()
      .then(() => {
        updateCompany()

      })
      .catch(() => {
        message.error('Vui lòng kiểm tra lại các trường đã nhập!')
      })
  }
}

const prevStep = () => {
  currentStep.value = 0
}

onMounted( () => {
   loadUserData()
   getDataConscious()
   getDataCountry()
   getCompany()
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

<script lang="ts" setup>
import { onBeforeMount, onMounted, ref, watch } from 'vue'
import { UserOutlined, UploadOutlined, ShoppingOutlined } from '@ant-design/icons-vue'
import accountService from '../../../services/account.service'
import type { IUser, IUserbyAccount } from '../../../types/backend'
import { linkUploads } from '../../../constant/api'
import { message } from 'ant-design-vue'
import type { UploadProps } from 'ant-design-vue'
import { useAuthStore } from '../../../stores/AuthStore'
import apiService from '../../../services/api.service'

const isEditUser = ref(false)
const account: IUserbyAccount | null = accountService.getAccount().account
const userInfo = ref<IUser>({})
const openModal = ref<boolean>(false)
const selectedFile = ref<File | null>(null)
const store = useAuthStore()
const loadData = async () => {
  try {
    const userRes = await apiService.get('users/client/' + account?._id)
    userInfo.value = userRes.data
  } catch (error: any) {
    message.error(error.response.data.message)
  }
}

const updateUser = async (id: string) => {
  try {
    const data = {
      phoneNumber: userInfo.value.phoneNumber,
      name: userInfo.value.name,
      email: userInfo.value.email,
      gender: userInfo.value.gender,
      address: userInfo.value.address,
      avatar: userInfo.value.avatar
    }
    const res = await apiService.update('users/client/' + id, data)
    if (res.data) {
      message.success('Cập nhật thông tin tài khoản thành công')
      isEditUser.value = false
    }
  } catch (error: any) {
    message.error(error.response.data.massage)
  }
}

const fileList = ref<UploadProps['fileList']>([])
const handleFileChange = (file: File) => {
  selectedFile.value = file
}

const handleConfirmUpload = async () => {
  if (!selectedFile.value) {
    message.warning('Vui lòng chọn file trước khi xác nhận!')
    return
  }
  try {
    const res = await apiService.upload(selectedFile.value, 'user')
    if (res) {
      userInfo.value.avatar = res.data.fileName
      await updateUser(userInfo.value._id || '')
      openModal.value = false
    }
  } catch (error: any) {
    message.error(error.response.data.massage)
  }
}

watch(fileList, () => {
  if (fileList.value?.length === 0) {
    userInfo.value.avatar = ''
  }
})

const formRef = ref<any>(null)
const handleOk = () => {
  formRef.value
    .validate()
    .then(() => {
      updateUser(userInfo.value._id || '')
    })
    .catch(() => {
      message.error('Vui lòng kiểm tra lại các trường đã nhập!')
    })
}

onMounted(async () => {
  await loadData()
})
</script>
<template>
  <a-layout-content style="margin: 0 16px">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 gap-8">
        <!-- <div class="bg-white rounded-xl shadow-lg p-6 space-y-6 mx-auto mx-3 w-full"> -->
        <div class="flex justify-between">
          <a-button v-if="!isEditUser" type="primary" @click="isEditUser = true"
            >Sửa thông tin tài khoản</a-button
          >
          <div v-if="isEditUser">
            <a-button @click="isEditUser = false" class="mr-1">Huỷ</a-button>
            <a-button type="primary" @click="updateUser(userInfo?._id || '')">Xác nhận</a-button>
          </div>
        </div>
        <div class="flex">
          <div v-if="!isEditUser" class="space-y-3 w-2/3">
            <div>
              <label class="block text-sm font-medium text-gray-700">Họ và tên</label>
              <p class="mt-1 text-lg text-gray-900">{{ userInfo?.name }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Địa chỉ email</label>
              <p class="mt-1 text-lg text-gray-900">{{ userInfo?.email }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Số điện thoại</label>
              <p class="mt-1 text-lg text-gray-900">{{ userInfo?.phoneNumber }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Giới tính</label>
              <p class="mt-1 text-lg text-gray-900">{{ userInfo?.gender }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Địa chỉ</label>
              <p class="mt-1 text-lg text-gray-900">{{ userInfo?.address }}</p>
            </div>
          </div>
          <div v-if="isEditUser" class="space-y-3 w-2/3">
            <div>
              <label class="block text-sm font-medium text-gray-700">Họ và tên</label>
              <a-input
                class="mt-1 text-base text-gray-900"
                v-model:value="userInfo.name"
                placeholder="Vui lòng nhập họ và tên"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Địa chỉ email</label>
              <a-input
                disabled
                class="mt-1 text-base text-gray-900"
                v-model:value="userInfo.email"
                placeholder="Vui lòng nhập địa chỉ email"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Giới tính</label>
              <a-select
                class="mt-1 text-base text-gray-900 w-full"
                v-model:value="userInfo.gender"
                placeholder="Vui lòng chọn giới tính"
              >
                <a-select-option value="Nam">Nam</a-select-option>
                <a-select-option value="Nữ">Nữ</a-select-option>
                <a-select-option value="Khác">Khác</a-select-option>
              </a-select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Số điện thoại</label>
              <a-input
                :maxlength="11"
                class="mt-1 text-base text-gray-900"
                v-model:value="userInfo.phoneNumber"
                placeholder="Vui lòng nhập số điện thoại"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Địa chỉ</label>
              <a-input
                class="mt-1 text-base text-gray-900"
                v-model:value="userInfo.address"
                placeholder="Vui lòng nhập địa chỉ"
              />
            </div>
          </div>
          <div class="w-1/3 flex flex-col items-center gap-2">
            <div class="border border-gray-200 rounded-lg">
              <img
                :src="`${userInfo?.avatar ? linkUploads('user/' + userInfo?.avatar) : 'https://via.placeholder.com/150'}`"
                alt="Avatar"
                class="object-cover rounded-lg w-[150px] h-[150px]"
              />
            </div>
            <a-button @click="openModal = true">Thay đổi</a-button>
          </div>
        </div>
        <!-- </div> -->
      </div>
    </div>
  </a-layout-content>
  <a-modal
    v-model:open="openModal"
    title="Thay đổi ảnh đại diện"
    ok-text="Xác nhận"
    @ok="handleConfirmUpload()"
    @cancel="openModal = false"
    :maskClosable="false"
    class="pb-0"
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

      <p class="text-gray-500 mt-2">Chọn ảnh và nhấn xác nhận để thay đổi ảnh.</p>
    </div>
  </a-modal>
</template>
<style>
.ant-upload-list-picture-card {
  display: flex;
  justify-content: center;
}
</style>
../../../services/account.service

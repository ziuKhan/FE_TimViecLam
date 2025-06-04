<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import Loading from '../../../components/Loading.vue'
import CKEditor from '../../../components/CKEditor.vue'
import type { UploadRequestOption } from 'ant-design-vue/es/vc-upload/interface'
import { message } from 'ant-design-vue'
import { UploadOutlined } from '@ant-design/icons-vue'
import { createCompanyApi, registerHRApi } from '../../../services/auth.service'
import { useRouter } from 'vue-router'
import apiService from '../../../services/api.service'
import type { ICustomerApproval } from '../../../types/backend'

const load = ref<boolean>(true)
const loading = ref<boolean>(false)
const router = useRouter()

const formState = reactive<ICustomerApproval>({
  lastName: '',
  firstName: '',
  email: '',
  phoneNumber: '',
  logo: '',
  address: '',
  companyName: '',
  status: 'CD',
  taxCode: '',
  description: '',
  clause: false
})

const resetForm = () =>
  Object.assign(formState, {
    lastName: '',
    firstName: '',
    email: '',
    phoneNumber: '',
    logo: '',
    address: '',
    companyName: '',
    status: 'CD',
    taxCode: '',
    description: '',
    clause: false
  })
const onFinish = async () => {
  try {
    loading.value = true
    const res = await apiService.add('customer-approval', formState)
    if (res) {
      resetForm()
      window.location.reload()
      message.success('Gửi thông tin thành công!')
    }
  } catch (err: any) {
    console.log(err)
    if(err.response.data.message){
      message.error(err.response.data.message)
    }else{
      message.error('Gửi thông tin thất bại!')
    }
    
  } finally {
    loading.value = false
  }
}

const fileList = ref([])

watch(fileList, () => {
  if (fileList.value.length === 0) {
    formState.logo = ''
  }
})

const handleUpload = async (options: UploadRequestOption) => {
  const { file, onSuccess, onError } = options
  try {
    const res = await apiService.upload(file, 'company')
    if (res) {
      formState.logo = res.data.fileName

      message.success('Upload file thành công!')
      onSuccess && onSuccess(res)
    }
  } catch (err: any) {
    message.error('Upload file thất bại!')
    onError && onError(err)
  }
}
</script>

<template>
  <Loading v-if="!load"></Loading>
  <div v-else class="w-full theme_blackred2 py-10">
    <div class="w-10/12 mx-auto">
      <h1 class="text-white font-bold text-[36px] my-7">Tìm kiếm Nhân tài IT phù hợp</h1>
      <div class="text-white mt-4 text-[16px] pb-10">
        Để lại thông tin liên hệ để nhận tư vấn từ Phòng Chăm sóc Khách hàng của ITviec.
      </div>
      <div class="flex gap-x-5">
        <a-form
          :model="formState"
          name="basic "
          class="w-4/6 bg-white rounded-xl p-12"
          @finish="onFinish"
        >
          <div class="grid grid-cols-2 grid-rows-18 w-full gap-5">
            <div class="col-span-2 text-lg font-bold">Thông tin Quý khách</div>
            <div class="row-span-2 row-start-2">
              <a-form-item
                name="lastName"
                :rules="[{ required: true, message: 'Vui lòng nhập họ!' }]"
                class="m-0"
              >
                <a-input
                  v-model:value="formState.lastName"
                  class="h-[55px]"
                  placeholder="Nhập họ"
                />
              </a-form-item>
            </div>
            <div class="row-span-2 row-start-2">
              <a-form-item
                name="firstName"
                :rules="[{ required: true, message: 'Vui lòng nhập tên!' }]"
                class="m-0"
              >
                <a-input
                  v-model:value="formState.firstName"
                  class="h-[55px]"
                  placeholder="Nhập tên"
                />
              </a-form-item>
            </div>
            <div class="row-span-2 row-start-4">
              <a-form-item
                name="phoneNumber"
                :rules="[
                  { required: true, message: 'Vui lòng nhập số điện thoại!' },
                  { pattern: /^[0-9]+$/, message: 'Số điện thoại không hợp lệ!' },
                  { min: 10, max: 11, message: 'Số điện thoại phải có 10 hoặc 11 số!' }
                ]"
                class="m-0"
              >
                <a-input
                  :maxLength="11"
                  v-model:value="formState.phoneNumber"
                  class="h-[55px]"
                  placeholder="Nhập số điện thoại"
                />
              </a-form-item>
            </div>
            <div class="row-span-2 row-start-4">
              <a-form-item
                name="email"
                :rules="[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ' }
                ]"
                class="m-0"
              >
                <a-input
                  v-model:value="formState.email"
                  class="h-[55px]"
                  placeholder="Nhập email"
                />
              </a-form-item>
            </div>

            <div class="col-span-2 row-start-6 text-lg font-bold">Thông tin công ty</div>
            <div class="col-span-2 row-span-2 row-start-7">
              <div class="flex w-full">
                <div class="w-3/4 mr-4">
                  <a-form-item
                    name="companyName"
                    :rules="[{ required: true, message: 'Vui lòng nhập tên công ty!' }]"
                    class="m-0"
                  >
                    <a-input
                      v-model:value="formState.companyName"
                      class="h-[55px]"
                      placeholder="Nhập tên công ty"
                    />
                  </a-form-item>
                </div>
                <div class="w-1/4">
                  <a-form-item
                    label=""
                    name="logo"
                    :rules="[{ required: true, message: 'Vui lòng tải logo công ty lên!' }]"
                  >
                    <a-upload
                      maxCount="1"
                      name="file"
                      v-model:file-list="fileList"
                      accept="image/png,image/svg+xml,image/x-icon,image/jpeg,image/jpg,image/webp"
                      :custom-request="handleUpload"
                    >
                      <a-button class="test-button">
                        <upload-outlined></upload-outlined>
                        Tải logo công ty
                      </a-button>
                    </a-upload>
                  </a-form-item>
                </div>
              </div>
            </div>
            <div class="col-span-2 row-span-2 row-start-9 flex gap-x-5">
              <div class="w-1/2">
                <a-form-item
                name="address"
                :rules="[{ required: true, message: 'Vui lòng nhập địa chỉ công ty!' }]"
                class="m-0"
              >
                <a-input
                  v-model:value="formState.address"
                  class="h-[55px]"
                  placeholder="Nhập địa chỉ công ty"
                />
              </a-form-item>
              </div>
              <div class="w-1/2">
                <a-form-item
                name="taxCode"
                :rules="[
                  { required: true, message: 'Vui lòng nhập mã số thuế!' },
                  { min: 10, max: 13, message: 'Mã số thuế phải có 10 hoặc 13 số!' }
                ]"
                class="m-0"
              >
                <a-input
                  :maxLength="13"
                  v-model:value="formState.taxCode"
                  class="h-[55px]"
                  placeholder="Nhập mã số thuế"
                />
              </a-form-item>
              </div>
              
            </div>

            <div class="col-span-2 row-span-2 row-start-11">
              <a-form-item
                name="description"
                :rules="[{ required: true, message: 'Vui lòng nhập mô tả!' }]"
                class="m-0"
              >
                <CKEditor title="Mô tả" v-model="formState.description"></CKEditor>
              </a-form-item>
            </div>

            <div class="col-span-2 row-span-2 row-start-13">
              <a-form-item
                name="clause"
                :rules="[{ required: true, message: 'Vui lòng chọn!' }]"
                class="m-0"
              >
                <a-checkbox v-model:checked="formState.clause">
                  <div class="text-base font-[Lexend,sans-serif]">
                    Tôi đã đọc và đồng ý với các
                    <a
                      href="https://itviec.com/blog/terms-conditions-vn/"
                      target="_blank"
                      class="text-[#007AFF]"
                      >Điều khoản dịch vụ</a
                    >
                    và
                    <a
                      href="https://itviec.com/blog/chinh-sach-bao-mat/"
                      target="_blank"
                      class="text-[#007AFF]"
                      >Chính sách quyền riêng tư</a
                    >
                    của ITviec liên quan đến thông tin riêng tư của tôi.
                  </div>
                </a-checkbox>
              </a-form-item>
            </div>
            <div
              class="row-span-2 row-start-15 flex items-center text-base font-[Lexend,sans-serif]"
            >
              Đã có tài khoản Khách hàng?
              <RouterLink to="/login" class="ml-1 font-bold hover:text-red-600">
                Đăng nhập</RouterLink
              >
            </div>
            <div class="row-span-2 row-start-15 flex justify-end">
              <a-button
                :loading="loading"
                :disabled="!formState.clause"
                type="primary"
                danger
                class="w-[180px] h-12 bg-red-600 text-white rounded-[4px] text-base font-bold"
                html-type="submit"
                >Gửi thông tin</a-button
              >
            </div>
          </div>
        </a-form>

        <div class="w-2/6">
          <div class="w-full bg-[#431D20] rounded-xl h-[100px] p-6 flex mb-[16px]">
            <div class="w-[33px] h-full">
              <img
                loading="lazy"
                class="h-full object-contain"
                src="../../../assets/image/icon/icons8_phone.svg"
                alt=""
              />
            </div>
            <div class="text-white ml-5 flex flex-wrap">
              <div class="w-full text-base">Hotline Hồ Chí Minh</div>
              <div class="font-bold text-lg">0977 460 519</div>
            </div>
          </div>

          <div class="w-full bg-[#431D20] rounded-xl h-[100px] p-6 flex mb-[16px]">
            <div class="w-[33px] h-full">
              <img
                loading="lazy"
                class="h-full object-contain"
                src="../../../assets/image/icon/icons8_phone.svg"
                alt=""
              />
            </div>
            <div class="text-white ml-5 flex flex-wrap">
              <div class="w-full text-base">Hotline Hà Nội</div>
              <div class="font-bold text-lg">0983 131 531</div>
            </div>
          </div>

          <div class="w-full bg-[#431D20] rounded-xl h-[100px] p-6 flex mb-[16px]">
            <div class="w-[33px] h-full">
              <img
                loading="lazy"
                class="h-full object-contain"
                src="../../../assets/image/icon/icons8_time_red.svg"
                alt=""
              />
            </div>
            <div class="text-white ml-5 flex flex-wrap">
              <div class="w-full text-base">Thời gian làm việc</div>
              <div class="font-bold text-lg">Thứ 2 - Thứ 6 | 8:30 - 17:00</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<template>
  <a-modal
    :title="store.form._id ? 'Cập nhật đăng ký khách hàng' : 'Tạo mới đăng ký khách hàng'"
    :width="900"
    :body-style="{ paddingBottom: '80px' }"
    :footer-style="{ textAlign: 'right' }"
    v-model:open="store.openModal"
    :maskClosable="false"
  >
    <a-form :model="store.form" :rules="rules" ref="formRef" layout="vertical">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="Họ" name="lastName">
            <a-input v-model:value="store.form.lastName" placeholder="Vui lòng nhập họ" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Tên" name="firstName">
            <a-input v-model:value="store.form.firstName" placeholder="Vui lòng nhập tên" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Số điện thoại" name="phoneNumber">
            <a-input
              v-model:value="store.form.phoneNumber"
              placeholder="Vui lòng nhập số điện thoại"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Email" name="email">
            <a-input v-model:value="store.form.email" placeholder="Vui lòng nhập email" />
          </a-form-item>
        </a-col>
        <hr />
        <a-col :span="18">
          <a-form-item label="Tên công ty" name="companyName">
            <a-input
              v-model:value="store.form.companyName"
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
              v-model:file-list="fileList"
              accept="image/png,image/svg+xml,image/x-icon,image/webp"
              :custom-request="handleUpload"
              class="w-full"
            >
              <a-button>
                <upload-outlined></upload-outlined>
                Tải logo công ty
              </a-button>
            </a-upload>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="Địa chỉ" name="address">
            <a-input v-model:value="store.form.address" placeholder="Vui lòng nhập địa chỉ" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            name="description"
            :rules="[{ required: true, message: 'Vui lòng nhập mô tả!' }]"
            class="m-0"
          >
            <CKEditor
              :description="store.form.description"
              title="Mô tả"
              v-model="store.form.description"
            >
            </CKEditor>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>

    <template #footer>
      <a-space>
        <a-button :loading="store.loading" type="primary" @click="handleOk">Cập nhật</a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import type { Rule } from 'ant-design-vue/es/form'
import { ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import useCustomerApprovalStore from '../../../stores/admin/CustomerApprovalStore'
import CKEditor from '../../../components/CKEditor.vue'
import type { UploadRequestOption } from 'ant-design-vue/es/vc-upload/interface'
import apiService from '../../../services/api.service'

const store = useCustomerApprovalStore()

// Định nghĩa các rule cho form
const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: 'Vui lòng nhập kỹ năng' }]
}
const formRef = ref<any>(null)
const handleOk = () => {
  formRef.value
    .validate()
    .then(() => {
      store.updateAndAdd()
    })
    .catch(() => {
      message.error('Vui lòng kiểm tra lại các trường đã nhập!')
    })
}

const fileList = ref([])

const handleUpload = async (options: UploadRequestOption) => {
  const { file, onSuccess, onError } = options
  try {
    const res = await apiService.upload(file, 'company')
    if (res) {
      store.form.logo = res.data?.fileName
      message.success('Upload file thành công!')
      onSuccess && onSuccess(res)
    }
  } catch (err: any) {
    message.error('Upload file thất bại!')
    onError && onError(err)
  }
}
watch(fileList, () => {
  if (fileList.value.length === 0) {
    store.form.logo = ''
  }
})
</script>

<style>
.ant-drawer-header-title button,
.ant-drawer-header .ant-drawer-title {
  color: #232323 !important;
}
</style>

<script lang="ts" setup>
import { ref, watch } from 'vue'

import useCompanyStore from '../../../stores/admin/CompanyStore'
import CKEditor from '../../../components/CKEditor.vue'
import type { UploadRequestOption } from 'ant-design-vue/es/vc-upload/interface'
import { message } from 'ant-design-vue'
import useResumeStore from '../../../stores/admin/ResumeStore'
import apiService from '../../../services/api.service'

// Sử dụng Permission Store
const store = useResumeStore()

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
    const res = await apiService.upload(file, 'cv')
    if (res) {
      store.form.url = res.data.fileName
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
watch(
  () => store.openModal,
  (newVal) => {
    if (!newVal && formRef.value) {
        formRef.value.resetFields()
    }
  }
)
</script>

<template>
  <a-modal
    :title="store.form._id ? 'Cập nhật Role' : 'Tạo mới Role'"
    :okText="store.form._id ? 'Cập nhật' : 'Thêm mới'"
    :width="850"
    v-model:open="store.openModal"
    :maskClosable="false"
    :cancelButtonProps="{ style: { display: 'none' } }"
    @ok="handleOk"
    :confirm-loading="store.loading"
  >
    <a-form :model="store.form" ref="formRef" layout="vertical" class="py-3">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item
            label="Email"
            name="email"
            :rules="[
              { required: true, message: 'Vui lòng nhập địa chỉ email!' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]"
          >
            <a-input v-model:value="store.form.email" placeholder="Vui lòng nhập email" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="Tải lên CV"
            name="url"
            :rules="[{ required: true, message: 'Vui lòng tải cv lên!' }]"
          >
            <a-upload
              maxCount="1"
              name="file"
              v-model:file-list="fileList"
              accept="application/pdf,application/msword,.doc,.docx,.pdf"
              :custom-request="handleUpload"
            >
              <a-button class="test-button">
                <upload-outlined></upload-outlined>
                Tải CV của bạn (Hỗ trợ *.doc, *.docx, *.pdf, and &lt; 5MB)
              </a-button>
            </a-upload>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="Trạng thái"
            name="status"
            :rules="[{ required: true, message: 'Vui lòng chọn status!' }]"
          >
            <a-select v-model:value="store.form.status">
              <a-select-option selected value="PENDING">PENDING</a-select-option>
              <a-select-option value="REVIEWING">REVIEWING</a-select-option>
              <a-select-option value="APPROVED">APPROVED</a-select-option>
              <a-select-option value="REJECTED">REJECTED</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="Mã công ty"
            name="companyId"
            :rules="[{ required: true, message: 'Vui lòng nhập mô tả!' }]"
          >
            <a-input v-model:value="store.form.companyId" placeholder="Vui lòng nhập CompanyID" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="Mã việc làm"
            name="jobId"
            :rules="[{ required: true, message: 'Vui lòng nhập mô tả!' }]"
          >
            <a-input v-model:value="store.form.jobId" placeholder="Vui lòng nhập jobID" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<style>
.ant-upload,
.ant-upload button {
  width: 100% !important;
}
</style>

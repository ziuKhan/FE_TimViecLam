<template>
  <a-modal
    title="Xem hồ sơ đăng ký"
    :width="900"
    :body-style="{ paddingBottom: '80px' }"
    :footer-style="{ textAlign: 'right' }"
    v-model:open="store.openModalDetail"
    :maskClosable="false"
  >
    <!-- Thông tin hồ sơ -->
    <div class="customer-approval-preview">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-alert
            :message="'Trạng thái: ' + getStatusText(store.form.status)"
            :type="getStatusType(store.form.status)"
            show-icon
            style="margin-bottom: 20px"
          />
        </a-col>

        <!-- Thông tin người đăng ký -->
        <a-col :span="24">
          <h3 class="text-lg font-medium">Thông tin người đăng ký</h3>
        </a-col>
        <a-col :span="12">
          <div class="preview-item">
            <div class="preview-label">Họ:</div>
            <div class="preview-value">{{ store.form.lastName || 'Chưa cung cấp' }}</div>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="preview-item">
            <div class="preview-label">Tên:</div>
            <div class="preview-value">{{ store.form.firstName || 'Chưa cung cấp' }}</div>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="preview-item">
            <div class="preview-label">Số điện thoại:</div>
            <div class="preview-value">{{ store.form.phoneNumber || 'Chưa cung cấp' }}</div>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="preview-item">
            <div class="preview-label">Email:</div>
            <div class="preview-value">{{ store.form.email || 'Chưa cung cấp' }}</div>
          </div>
        </a-col>

        <!-- Thông tin công ty -->
        <a-col :span="24">
          <h3 class="text-lg font-medium">Thông tin công ty</h3>
        </a-col>
        <a-col :span="18">
          <div class="preview-item">
            <div class="preview-label">Tên công ty:</div>
            <div class="preview-value">{{ store.form.companyName || 'Chưa cung cấp' }}</div>
          </div>
          <div class="preview-item">
            <div class="preview-label">Địa chỉ:</div>
            <div class="preview-value">{{ store.form.address || 'Chưa cung cấp' }}</div>
          </div>
          <div class="preview-item" v-if="store.form.status === 'TC'">
            <div class="preview-label">Lý do từ chối:</div>
            <div class="preview-value">{{ store.form.reason }}</div>
          </div>
        </a-col>
        <a-col :span="6">
          <div class="preview-item">
            <div class="preview-label">Logo công ty:</div>
            <div v-if="store.form.logo" class="logo-preview">
              <img
                :src="linkUploads('company/' + store.form.logo)"
                alt="Logo công ty"
                class="object-cover"
                style="max-width: 100%; max-height: 100%"
              />
            </div>
            <div v-else class="preview-value">Không có logo</div>
          </div>
        </a-col>

        <a-col :span="24">
          <div class="preview-item">
            <div class="preview-label">Mô tả:</div>
            <div
              class="preview-value description-content"
              v-html="store.form.description || 'Chưa cung cấp'"
            ></div>
          </div>
        </a-col>
      </a-row>
    </div>

    <!-- Footer với các nút thao tác -->
    <template #footer>
      <a-space>
        <a-button @click="closeModal">Đóng</a-button>
        <a-button v-if="store.form.status === 'CD'" type="primary" @click="showRejectConfirm">
          Từ chối
        </a-button>
        <a-button
          v-if="store.form.status === 'CD'"
          type="primary"
          class="bg-green-500 hover:!bg-green-600"
          :loading="store.loading"
          @click="showApproveConfirm"
        >
          Phê duyệt
        </a-button>
      </a-space>
    </template>
  </a-modal>

  <!-- Modal xác nhận từ chối -->
  <a-modal
    v-model:visible="rejectModalVisible"
    title="Từ chối yêu cầu đăng ký"
    :confirm-loading="store.loading"
    @ok="handleReject"
  >
    <p>Vui lòng nhập lý do từ chối yêu cầu đăng ký này:</p>
    <a-textarea v-model:value="store.form.reason" :rows="4" placeholder="Nhập lý do từ chối" />
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, createVNode } from 'vue'
import { message, Modal } from 'ant-design-vue'
import useCustomerApprovalStore from '../../../stores/admin/CustomerApprovalStore'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { linkUploads } from '../../../constant/api'

const store = useCustomerApprovalStore()
const rejectModalVisible = ref(false)

// Đóng modal
const closeModal = () => {
  store.openModalDetail = false
}

// Hiển thị modal xác nhận phê duyệt
const showApproveConfirm = () => {
  Modal.confirm({
    title: 'Xác nhận phê duyệt',
    icon: createVNode(ExclamationCircleOutlined),
    content: 'Bạn có chắc chắn muốn phê duyệt yêu cầu đăng ký này không?',
    okText: 'Phê duyệt',
    cancelText: 'Hủy',
    onOk: handleApprove
  })
}

// Hiển thị modal xác nhận từ chối
const showRejectConfirm = () => {
  rejectModalVisible.value = true
}

// Xử lý phê duyệt
const handleApprove = async () => {
  try {
    await store.approveRequest(store.form._id || '')
    message.success('Đã phê duyệt yêu cầu đăng ký thành công!')
    closeModal()
  } catch (error) {
    // Lỗi đã được xử lý trong store
  }
}

// Xử lý từ chối
const handleReject = async () => {
  try {
    await store.rejectRequest(store.form._id || '')
    message.success('Đã từ chối yêu cầu đăng ký!')
    rejectModalVisible.value = false
    closeModal()
  } catch (error) {
    // Lỗi đã được xử lý trong store
  }
}

// Lấy text trạng thái
const getStatusText = (status: string) => {
  switch (status) {
    case 'CD':
      return 'Chờ duyệt'
    case 'CN':
      return 'Đã duyệt'
    case 'TC':
      return 'Từ chối'
    default:
      return 'Không xác định'
  }
}

// Lấy type màu cho alert
const getStatusType = (status: string) => {
  switch (status) {
    case 'CD':
      return 'warning'
    case 'CN':
      return 'success'
    case 'TC':
      return 'error'
    default:
      return 'info'
  }
}
</script>

<style>
.customer-approval-preview .preview-item {
  margin-bottom: 16px;
}

.customer-approval-preview .preview-label {
  font-weight: bold;
  margin-bottom: 4px;
  color: #666;
}

.customer-approval-preview .preview-value {
  color: #333;
}

.customer-approval-preview .description-content {
  max-height: 200px;
  overflow-y: auto;
  padding: 8px;
  background-color: #fafafa;
  border-radius: 4px;
}

.logo-preview {
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f6ebeb;
  width: 120px;
  height: 150px;
}
</style>

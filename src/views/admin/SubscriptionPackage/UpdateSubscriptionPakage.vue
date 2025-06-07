<template>
  <a-modal
    :title="store.form._id ? 'Cập nhật gói dịch vụ' : 'Tạo mới gói dịch vụ'"
    :width="800"
    :body-style="{ paddingBottom: '80px' }"
    :footer-style="{ textAlign: 'right' }"
    v-model:open="store.openModal"
    :maskClosable="false"
  >
    <a-form :model="store.form" :rules="rules" ref="formRef" layout="vertical">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="Mã gói dịch vụ" name="code">
            <a-input v-model:value="store.form.code" placeholder="Vui lòng nhập mã gói dịch vụ" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Tên gói dịch vụ" name="name">
            <a-input v-model:value="store.form.name" placeholder="Vui lòng nhập tên gói dịch vụ" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Giá (Giá đã bao gồm VAT)" name="price">
            <a-input-number
              v-model:value="store.form.price"
              placeholder="Vui lòng nhập giá"
              class="w-full"
              :min="1"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Giá sau khi giảm (Giá đã bao gồm VAT)" name="priceDiscount">
            <a-input-number
              v-model:value="store.form.priceDiscount"
              placeholder="Vui lòng nhập giá sau khi giảm"
              class="w-full"
              :min="1"
              :max="store.form.price"
            />
          </a-form-item>
        </a-col>
        <a-col :span="20">
          <a-form-item label="Thời hạn (Tháng)" name="duration">
            <a-input-number
              :min="1"
              v-model:value="store.form.duration"
              placeholder="Vui lòng nhập thời hạn"
              class="w-full"
            />
          </a-form-item>
        </a-col>
        <a-col :span="4">
          <a-form-item label="Trạng thái" name="isActive">
            <a-switch v-model:checked="store.form.isActive" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="Mô tả" name="description">
            <a-input v-model:value="store.form.description" placeholder="Vui lòng nhập mô tả" />
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
import useSubscriptionPackageStore from '../../../stores/admin/SubPakageStore'

const store = useSubscriptionPackageStore()

// Định nghĩa các rule cho form
const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: 'Vui lòng nhập tên gói dịch vụ' }],
  code: [{ required: true, message: 'Vui lòng nhập mã gói dịch vụ' }],
  price: [{ required: true, message: 'Vui lòng nhập giá' }],
  priceDiscount: [{ required: true, message: 'Vui lòng nhập giá sau khi giảm' }],
  duration: [{ required: true, message: 'Vui lòng nhập thời hạn' }]
}
const formRef = ref<any>(null)
const handleOk = () => {
  formRef.value
    .validate()
    .then(() => {
      store.save()
    })
    .catch(() => {
      message.error('Vui lòng kiểm tra lại các trường đã nhập!')
    })
}

// Theo dõi khi modal mở để reset validate
watch(
  () => store.openModal,
  (newVal) => {
    if (!newVal && formRef.value) {
        formRef.value.resetFields()
    }
  }
)
</script>

<style>
.ant-drawer-header-title button,
.ant-drawer-header .ant-drawer-title {
  color: #232323 !important;
}
</style>

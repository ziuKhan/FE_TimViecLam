<template>
  <a-drawer
    :title="store.form._id ? 'Cập nhật quyền' : 'Tạo mới quyền'"
    :width="650"
    :open="store.openModal"
    :body-style="{ paddingBottom: '80px' }"
    :footer-style="{ textAlign: 'right' }"
    @close="store.openModal = false"
    :maskClosable="false"
  >
    <a-form :model="store.form" :rules="rules" ref="formRef" layout="vertical" class="px-20 py-3">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Tên" name="name">
            <a-input v-model:value="store.form.name" placeholder="Vui lòng nhập tên" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="Đường dẫn" name="apiPath">
            <a-input v-model:value="store.form.apiPath" placeholder="Vui lòng nhập đường dẫn" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Phương thức" name="method">
            <a-select v-model:value="store.form.method" placeholder="Vui lòng nhập phương thức">
              <!-- <a-select-option disabled selected value>Vui lòng chọn method</a-select-option> -->
              <template v-for="(item, index) in ALL_METHODS" :key="index">
                <a-select-option :value="item">{{ item }}</a-select-option>
              </template>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="Module" name="module">
            <a-select
              show-search
              v-model:value="store.form.module"
              placeholder="Vui lòng nhập module"
            >
              <template v-for="(item, index) in ALL_MODULES" :key="index">
                <a-select-option :value="item">{{ item }}</a-select-option>
              </template>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>

    <template #footer>
      <a-space>
        <a-button :loading="store.loading" type="primary" @click="handleOk">Cập nhật</a-button>
      </a-space>
    </template>
  </a-drawer>
</template>

<script lang="ts" setup>
import type { Rule } from 'ant-design-vue/es/form'
import usePermissionStore from '../../../stores/admin/PermissionStore'
import { ALL_METHODS, ALL_MODULES } from '../../../types/permision'
import { ref, watch } from 'vue'
import { message } from 'ant-design-vue'

// Sử dụng Permission Store
const store = usePermissionStore()

// Định nghĩa các rule cho form
const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: 'Vui lòng nhập name' }],
  apiPath: [
    { required: true, message: 'Vui lòng nhập apiPath' }
    // {
    //     pattern: /^\/([a-zA-Z0-9]+(\/:\w+|\/[a-zA-Z0-9]+)*)*$/,
    //     // Regex cho định dạng /a/a/a
    //     message: 'Định dạng apiPath không hợp lệ. Phải có dạng /a/a/a'
    // }
  ],
  method: [{ required: true, message: 'Vui lòng nhập method ' }],
  module: [{ required: true, message: 'Vui lòng nhập module ' }]
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

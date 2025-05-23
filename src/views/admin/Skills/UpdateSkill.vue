<template>
  <a-modal
    :title="store.form._id ? 'Cập nhật kỹ năng' : 'Tạo mới kỹ năng'"
    :width="650"
    :body-style="{ paddingBottom: '80px' }"
    :footer-style="{ textAlign: 'right' }"
    v-model:open="store.openModal"
    :maskClosable="false"
  >
    <a-form :model="store.form" :rules="rules" ref="formRef" layout="vertical">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Kỹ năng" name="name">
            <a-input v-model:value="store.form.name" placeholder="Vui lòng nhập kỹ năng" />
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
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import useSkillStore from '../../../stores/admin/SkillStore'

const store = useSkillStore()

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
</script>

<style>
.ant-drawer-header-title button,
.ant-drawer-header .ant-drawer-title {
  color: #232323 !important;
}
</style>

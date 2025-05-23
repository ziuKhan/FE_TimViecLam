<template>
  <a-modal
    :title="store.form._id ? 'Cập nhật vai trò' : 'Tạo mới vai trò'"
    :okText="store.form._id ? 'Cập nhật' : 'Thêm mới'"
    :width="900"
    v-model:open="store.openModal"
    :body-style="{ paddingBottom: '80px' }"
    :footer-style="{ textAlign: 'right' }"
    :maskClosable="false"
    :cancelButtonProps="{ style: { display: 'none' } }"
    @ok="handleOk"
    :confirm-loading="store.loading"
  >
    <a-form :model="store.form" ref="formRef" layout="vertical" class="px-8 py-3">
      <a-row :gutter="16">
        <a-col :span="20">
          <a-form-item
            label="Tên"
            name="name"
            :rules="[{ required: true, message: ' Tên không được để trống!' }]"
          >
            <a-input v-model:value="store.form.name" placeholder="Vui lòng nhập tên" />
          </a-form-item>
        </a-col>
        <a-col :span="4">
          <a-form-item label="Trạng thái" name="isActive">
            <a-switch v-model:checked="store.form.isActive" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item
            label="Mô tả"
            name="description"
            :rules="[{ required: true, message: 'Mô tả không được để trống!' }]"
          >
            <a-textarea
              v-model:value="store.form.description"
              placeholder="Vui lòng nhập description"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Cấp quyền hạn" name="permission">
            <CollapseUpdateRole />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import useRoleStore from '../../../stores/admin/RoleStore'
import CollapseUpdateRole from './Collapse.UpdateRole.vue'
import { message } from 'ant-design-vue'

const store = useRoleStore()

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

<style></style>

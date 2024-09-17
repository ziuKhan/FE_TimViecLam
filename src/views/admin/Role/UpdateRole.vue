<template>
    <a-modal :title="store.form._id ? 'Cập nhật Role' : 'Tạo mới Role'"
        :okText="store.form._id ? 'Cập nhật' : 'Thêm mới'" :width="850" v-model:open="store.openModal"
        :body-style="{ paddingBottom: '80px' }" :footer-style="{ textAlign: 'right' }" :maskClosable="false"
        :cancelButtonProps="{ style: { display: 'none' } }" @ok="store.updateAndAdd()">

        <a-form :model="store.form" layout="vertical" class="px-8 py-3">
            <a-row :gutter="16">
                <a-col :span="20">
                    <a-form-item label="Name" name="name"
                        :rules="[{ required: true, message: ' Tên không được để trống!' }]">
                        <a-input v-model:value="store.form.name" placeholder="Vui lòng nhập name" />
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
                    <a-form-item label="Description" name="description"
                        :rules="[{ required: true, message: 'Mô tả không được để trống!' }]">
                        <a-textarea v-model:value="store.form.description" placeholder="Vui lòng nhập description" />
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
import useRoleStore from '../../../stores/admin/RoleStore';
import CollapseUpdateRole from './Collapse.UpdateRole.vue';

const store = useRoleStore()



</script>

<style></style>
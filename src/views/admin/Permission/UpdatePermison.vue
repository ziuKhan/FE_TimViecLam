<template>
    <a-drawer :title="store.form._id ? 'Cập nhật Permission' : 'Tạo  Tạo mới Permission'" :width="650"
        :open="store.openModal" :body-style="{ paddingBottom: '80px' }" :footer-style="{ textAlign: 'right' }"
        @close="store.openModal = false" :maskClosable="false">

        <a-form :model="store.form" :rules="rules" layout="vertical" class="px-20 py-3">
            <a-row :gutter="16">
                <a-col :span="24">
                    <a-form-item label="Name" name="name">
                        <a-input v-model:value="store.form.name" placeholder="Vui lòng nhập name" />
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item label="ApiPath" name="apiPath">
                        <a-input v-model:value="store.form.apiPath" placeholder="Vui lòng nhập apiPath" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="16">
                <a-col :span="24">
                    <a-form-item label="Method" name="method">
                        <a-select v-model:value="store.form.method" placeholder="Vui lòng nhập method">
                            <!-- <a-select-option disabled selected value>Vui lòng chọn method</a-select-option> -->
                            <template v-for="item in ALL_METHODS">
                                <a-select-option :value="item">{{ item }}</a-select-option>
                            </template>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item label="Module" name="module">
                        <a-select v-model:value="store.form.module" placeholder="Vui lòng nhập module">
                            <!-- <a-select-option disabled selected value>Vui lòng chọn module</a-select-option> -->
                            <template v-for="item in ALL_MODULES">
                                <a-select-option :value="item">{{ item }}</a-select-option>
                            </template>
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>

        <template #footer>
            <a-space>
                <a-button :loading="store.loading" type="primary" @click="store.updateAndAdd()">Cập nhật</a-button>
            </a-space>
        </template>
    </a-drawer>
</template>

<script lang="ts" setup>
import type { Rule } from 'ant-design-vue/es/form';
import usePermissionStore from '../../../stores/admin/PermissionStore';
import { ALL_METHODS, ALL_MODULES } from '../../../types/permision';

// Sử dụng Permission Store
const store = usePermissionStore()

// Định nghĩa các rule cho form
const rules: Record<string, Rule[]> = {
    name: [{ required: true, message: 'Vui lòng nhập name' }],
    apiPath: [
        { required: true, message: 'Vui lòng nhập apiPath' },
        {
            pattern: /^\/([a-zA-Z0-9]+\/)*[a-zA-Z0-9]+$/, // Regex cho định dạng /a/a/a
            message: 'Định dạng apiPath không hợp lệ. Phải có dạng /a/a/a'
        }
    ],
    method: [{ required: true, message: 'Vui lòng nhập method ' }],
    module: [{ required: true, message: 'Vui lòng nhập module ' }],
};

</script>

<style>
.ant-drawer-header-title button,
.ant-drawer-header .ant-drawer-title {
    color: #232323 !important;

}
</style>
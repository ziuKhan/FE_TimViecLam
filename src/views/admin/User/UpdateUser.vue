<script lang="ts" setup>
import type { FormInstance, Rule } from 'ant-design-vue/es/form';
import useUserStore from '../../../stores/admin/UserStore';
import { onMounted, ref, watch } from 'vue';
import type { ICompany, IRole } from '../../../types/backend';
import { message } from 'ant-design-vue';
import apiService from '../../../services/api.service';


// Sử dụng Permission Store
const store = useUserStore()


// Định nghĩa các rule cho form
const rules: Record<string, Rule[]> = {
    name: [{ required: true, message: 'Vui lòng nhập name' }],
    email: [
        { required: true, message: 'Vui lòng nhập địa chỉ email' },
        { type: 'email', message: 'vui lòng nhập email hợp lệ' }
    ],
    role: [{ required: true, message: 'Vui lòng nhập role ' }],
    address: [{ required: true, message: 'Vui lòng nhập address ' }],
    gender: [{ required: true, message: 'Vui lòng nhập gender ' }],
};

const dataRoles = ref<IRole[]>()
const dataCompanies = ref<ICompany[]>([])

const getData = async () => {
    try {
        const [role, company] = await Promise.all([apiService.get('roles?current=1&pageSize=200'), apiService.get('companies?current=1&pageSize=200')])

        dataRoles.value = role.result
        dataCompanies.value = company.result
    } catch (e) {

    }
}

const handleCompanyChange = (companyId: string) => {
    if (store.form.company) {

        if (companyId === 'undefined') {
            store.form.company._id = '';
            store.form.company.name = '';
        }
        const selectedCompany = dataCompanies.value.find(company => company._id === companyId);
        if (selectedCompany) {
            store.form.company._id = selectedCompany._id;
            store.form.company.name = selectedCompany.name;
        }
    }
}

const formRef = ref<any>(null);
const handleOk = () => {
    formRef.value.validate().then(() => {
        store.updateAndAdd();
    }).catch(() => {
        message.error('Vui lòng kiểm tra lại các trường đã nhập!');
    });
};


onMounted(() => {
    getData()
})

</script>


<template>
    <a-modal :title="store.form._id ? 'Cập nhật tài khoản' : 'Tạo mới tài khoản'"
        :okText="store.form._id ? 'Cập nhật' : 'Thêm mới'" :width="850" v-model:open="store.openModal"
        :maskClosable="false" :cancelButtonProps="{ style: { display: 'none' } }" @ok="handleOk">

        <a-form ref="formRef" :model="store.form" :rules="rules" layout="vertical" class="px-20 py-3">
            <a-row :gutter="16">
                <a-col :span="12">
                    <a-form-item label="Tên" name="name">
                        <a-input v-model:value="store.form.name" placeholder="Vui lòng nhập tên" />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="Email" name="email">
                        <a-input v-model:value="store.form.email" placeholder="Vui lòng nhập email" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="16">
                <a-col :span="12">
                    <a-form-item label="Mật khẩu" name="password">
                        <a-input-password v-model:value="store.form.password" placeholder="Vui lòng nhập mật khẩu" />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="Vai trò" name="role">
                        <a-select v-model:value="store.form.role" placeholder="Vui này chọn vai trò">
                            <template v-for="role in dataRoles" :key="role._id">
                                <a-select-option :value="role._id">{{ role.name }}</a-select-option>
                            </template>
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="16">

                <a-col :span="20">
                    <a-form-item label="Giới tính" name="gender">
                        <a-select v-model:value="store.form.gender" placeholder="Vui này chọn giới tính">
                            <a-select-option selected value="Nam">Nam</a-select-option>
                            <a-select-option value="Nữ">Nữ</a-select-option>
                            <a-select-option value="Khác">Khác</a-select-option>
                        </a-select>
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
                    <a-form-item label="Địa chỉ" name="address">
                        <a-input v-model:value="store.form.address" placeholder="Vui lòng nhập địa chỉ" />
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item label="Công ty" name="company._id">
                        <a-select :value="store.form.company?.['_id']" @change="handleCompanyChange">
                            <a-select-option value="undefined"></a-select-option>
                            <template v-for="company in dataCompanies" :key="company._id">
                                <a-select-option :value="company._id">{{ company.name }}</a-select-option>
                            </template>
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>

    </a-modal>
</template>

<style>
.ant-drawer-header-title button,
.ant-drawer-header .ant-drawer-title {
    color: #232323 !important;

}
</style>
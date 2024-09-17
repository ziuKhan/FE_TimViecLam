<template>
    <a-form :model="formState" name="basic" layout="vertical" autocomplete="off" @finish="onFinish">


        <a-form-item label="Mật khẩu cũ" name="password" :rules="[{ required: true, message: 'Vui lòng nhập mật khẩu!' },
        { min: 6, message: 'Điền ít nhất 6 kí tự!' },
        ]">
            <a-input-password v-model:value="formState.password" />
        </a-form-item>

        <a-form-item label="Mật khẩu mới" name="newPassword" :rules="[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' },
        { min: 6, message: 'Điền ít nhất 6 kí tự!' },
        ]">
            <a-input-password v-model:value="formState.newPassword" />
        </a-form-item>

        <a-form-item label="Xác nhận lại mật khẩu" name="confirmPassword" :rules="[{ required: true, message: 'Vui lòng nhập xạc nhận lại mật khẩu!' },
        { validator: validateConfirmPassword },
        { min: 6, message: 'Điền ít nhất 6 kí tự!' },
        ]">
            <a-input-password v-model:value="formState.confirmPassword" />
        </a-form-item>


        <a-form-item :wrapper-col="{ offset: 10, span: 16 }">
            <a-button type="primary" html-type="submit">Xác nhận đổi</a-button>
        </a-form-item>
    </a-form>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';
import { useAuthStore } from '../../../stores/user/AuthStore';
import { message } from 'ant-design-vue';
import userService from '../../../services/user.service';

const storeAuth = useAuthStore()

interface FormState {
    password: string;
    newPassword: string;
    confirmPassword: string;
}

const formState = reactive<FormState>({
    password: '',
    newPassword: '',
    confirmPassword: '',
});

const validateConfirmPassword = (_rule: any, value: string) => {
    if (value !== formState.newPassword) {
        return Promise.reject('Mật khẩu xác nhận không khớp với mật khẩu mới!');
    }
    return Promise.resolve();
};


const onFinish = async (values: any) => {
    const data = {
        password: values.password,
        newPassword: values.newPassword,
    }
    const res = await userService.changePasswordApi(data);
    if (res.data) {
        message.success('Đổi mật khẩu thành công')
        formState.password = '';
        formState.newPassword = '';
        formState.confirmPassword = '';
    }

};


</script>
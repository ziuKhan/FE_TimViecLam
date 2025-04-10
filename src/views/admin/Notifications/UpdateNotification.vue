<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';

import { message } from 'ant-design-vue';
import useNotificationStore from '../../../stores/admin/NotificationStore';
import { TYPES_NOTIFICATION_LIST } from '../../../until/until';
import apiService from '../../../services/api.service';
import type { IUser } from '../../../types/backend';


// Sử dụng Permission Store
const store = useNotificationStore()

const formRef = ref<any>(null);

const handleOk = () => {
    formRef.value.validate().then(() => {
        store.updateAndAdd();
    }).catch(() => {
        message.error('Vui lòng kiểm tra lại các trường đã nhập!');
    });
};
const userList = ref<IUser[]>([]);
const getAllUser = async () => {
    try {
        const res = await apiService.get('users/all');
        userList.value = res.data;
    } catch (error) {
        console.log(error);
    }
   
}
onMounted(() => {
    getAllUser();
})
</script>


<template>
    <a-modal :title="store.form._id ? 'Cập nhật thông báo' : 'Tạo mới thông báo'" :okText="store.form._id ? 'Cập nhật' : 'Thêm mới'"
        :width="850" v-model:open="store.openModal" :maskClosable="false"
        :cancelButtonProps="{ style: { display: 'none' } }" @ok="handleOk" :confirm-loading="store.loading">

        <a-form :model="store.form" ref="formRef" layout="vertical" >
            <a-row :gutter="16">
                <a-col :span="24">
                    <a-form-item label="Tiêu đề thông báo" name="title"
                        :rules="[{ required: true, message: 'Vui lòng nhập tiêu đề thông báo!' }]">
                        <a-input v-model:value="store.form.title" placeholder="Vui lòng nhập tiêu đề thông báo" />
                    </a-form-item>
                </a-col>

                <a-col :span="24">
                    <a-form-item label="Nội dung thông báo" name="message"
                        :rules="[{ required: true, message: 'Vui lòng nhập địa chỉ nội dung thông báo!' }]">
                        <a-textarea  v-model:value="store.form.message" placeholder="Vui lòng nhập nội dung thông báo" />
                    </a-form-item>
                </a-col>
            
                <a-col :span="12">
                    <a-form-item label="Loại thông báo" name="type"
                        :rules="[{ required: true, message: 'Vui lòng chọn loại thông báo!' }]">
                        <a-select v-model:value="store.form.type" allowClear style="width: 100%"
                            placeholder="Vui lòng chọn loại thông báo..." :options="TYPES_NOTIFICATION_LIST">
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item  name="userId"
                       >
                        <template #label>
                            <span class="mr-2">Người nhận |</span>
                            <a-checkbox :disabled="store.form.userId?.length" v-model:checked="store.form.isGlobal">Gửi tất cả</a-checkbox>
                        </template>
                        <a-select :disabled="store.form.isGlobal" mode="multiple" v-model:value="store.form.userId" allowClear style="width: 100%"
                            placeholder="Vui lòng chọn người nhận..." :options="userList" :field-names="{ label: 'name', value: '_id' }" >
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item label="URL" name="url" :rules="[{ required: true, message: 'Vui lòng nhập URL!' }]">
                        <a-input v-model:value="store.form.url" placeholder="Vui lòng nhập URL" />
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

.ant-modal-footer {
    padding: 10px !important;
}
</style>
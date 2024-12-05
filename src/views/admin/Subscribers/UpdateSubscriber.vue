<script lang="ts" setup>
import { ref, watch } from 'vue';

import { message } from 'ant-design-vue';
import useSubscriberStore from '../../../stores/admin/SubscriberStore';
import { SKILLS_LIST } from '../../../until/until';


// Sử dụng Permission Store
const store = useSubscriberStore()




const formRef = ref<any>(null);
const handleOk = () => {
    formRef.value.validate().then(() => {
        store.updateAndAdd();
    }).catch(() => {
        message.error('Vui lòng kiểm tra lại các trường đã nhập!');
    });
};


</script>


<template>
    <a-modal :title="store.form._id ? 'Cập nhật người đăng ký' : 'Tạo mới người đăng ký'"
        :okText="store.form._id ? 'Cập nhật' : 'Thêm mới'" :width="850" v-model:open="store.openModal"
        :maskClosable="false" :cancelButtonProps="{ style: { display: 'none' } }" @ok="handleOk"
        :confirm-loading="store.loading">

        <a-form :model="store.form" ref="formRef" layout="vertical" class=" py-3">
            <a-row :gutter="16">
                <a-col :span="24">
                    <a-form-item label="Tên người đăng ký" name="name"
                        :rules="[{ required: true, message: 'Vui lòng nhập tên người đăng ký!' }]">
                        <a-input v-model:value="store.form.name" placeholder="Vui lòng nhập tên người đăng ký" />
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item label="Email" name="email"
                        :rules="[{ required: true, message: 'Vui lòng nhập địa chỉ email!' }]">
                        <a-input v-model:value="store.form.email" placeholder="Vui lòng nhập email" />
                    </a-form-item>
                </a-col>

                <a-col :span="24">
                    <a-form-item label="Kĩ năng" name="skills"
                        :rules="[{ required: true, message: 'Vui lòng nhập kĩ năng!' }]">
                        <a-select v-model:value="store.form.skills" allowClear mode="tags" style="width: 100%"
                            placeholder="Vui lòng chọn kĩ năng..." :options="SKILLS_LIST">
                        </a-select>
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
</style>
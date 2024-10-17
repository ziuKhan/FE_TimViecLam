<script lang="ts" setup>
import { ref, watch } from 'vue';

import useCompanyStore from '../../../stores/admin/CompanyStore';
import CKEditor from '../../../components/CKEditor.vue';
import type { UploadRequestOption } from 'ant-design-vue/es/vc-upload/interface';
import { uploadApi } from '../../../services/upload.service';
import { message } from 'ant-design-vue';


// Sử dụng Permission Store
const store = useCompanyStore()

const fileList = ref([]);
const handleUpload = async (options: UploadRequestOption) => {
    const { file, onSuccess, onError } = options;
    try {
        const res = await uploadApi(file, 'company');
        if (res) {
            store.form.logo = res.data.fileName;
            message.success('Upload file thành công!');
            onSuccess && onSuccess(res);
        }
    } catch (err: any) {
        message.error('Upload file thất bại!');
        onError && onError(err);
    }
};
watch(fileList, () => {
    if (fileList.value.length === 0) {
        store.form.logo = '';
    }
});


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
    <a-modal {{ }} :title="store.form._id ? 'Cập nhật Role' : 'Tạo mới Role'"
        :okText="store.form._id ? 'Cập nhật' : 'Thêm mới'" :width="850" v-model:open="store.openModal"
        :maskClosable="false" :cancelButtonProps="{ style: { display: 'none' } }" @ok="handleOk"
        :confirm-loading="store.loading">

        <a-form :model="store.form" ref="formRef" layout="vertical" class=" py-3">
            <a-row :gutter="16">
                <a-col :span="15">
                    <a-form-item label="Name (tên)" name="name"
                        :rules="[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]">
                        <a-input v-model:value="store.form.name" placeholder="Vui lòng nhập name" />
                    </a-form-item>
                </a-col>
                <a-col :span="7">
                    <a-form-item label="Vui lòng tải logo lên" name="logo"
                        :rules="[{ required: true, message: 'Vui lòng tải logo công ty lên!' }]">
                        <a-upload maxCount="1" name="file" v-model:file-list="fileList"
                            accept="image/png,image/svg+xml,image/x-icon" :custom-request="handleUpload" class="w-full">
                            <a-button>
                                <upload-outlined></upload-outlined>
                                Tải logo công ty
                            </a-button>
                        </a-upload>
                    </a-form-item>
                </a-col>
                <a-col :span="2">
                    <a-form-item label="Active" name="isActive">
                        <a-switch v-model:checked="store.form.isActive" />
                    </a-form-item>
                </a-col>

                <a-col :span="24">
                    <a-form-item label="Địa chỉ" name="address"
                        :rules="[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]">
                        <a-input v-model:value="store.form.address" placeholder="Vui lòng nhập address" />
                    </a-form-item>
                </a-col>

                <a-col :span="24">
                    <a-form-item name="description" :rules="[{ required: true, message: 'Vui lòng nhập mô tả!' }]"
                        class="m-0">
                        <CKEditor :description="store.form.description" title="Mô tả" v-model="store.form.description">
                        </CKEditor>
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
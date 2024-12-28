<script lang="ts" setup>
import { onBeforeMount, onMounted, ref, watch } from 'vue';
import {
    UserOutlined, UploadOutlined,
    ShoppingOutlined
} from '@ant-design/icons-vue';
import accountService from '../../../constant/account.service';
import type { ICompany, IUser, IUserbyAccount } from '../../../types/backend';
import companyService from '../../../services/company.service';
import { linkUploads } from '../../../constant/api';
import { message } from 'ant-design-vue';
import { format } from 'date-fns';
import CKEditor from '../../../components/CKEditor.vue';
import type { UploadRequestOption } from 'ant-design-vue/es/vc-upload/interface';
import { uploadApi } from '../../../services/upload.service';
import type { UploadProps } from 'ant-design-vue';
import apiService from '../../../services/api.service';

const isEditCompany = ref(false);
const account: IUserbyAccount | null = accountService.getAccount().account;
const companyInfo = ref<ICompany>({});
const openModal = ref<boolean>(false);
const openModalCompany = ref<boolean>(false);
const selectedFile = ref<File | null>(null);

const loadData = async () => {
    const [companyRes] = await Promise.all([
        companyService.getApi(account?.companyId || '')
    ]);
    companyInfo.value = companyRes.data;

}

const updateCompany = async (id: string) => {
    const formData = new FormData();
    formData.append('name', companyInfo.value.name ? String(companyInfo.value.name) : '');
    formData.append('address', companyInfo.value.address ? String(companyInfo.value.address) : '');
    formData.append('description', companyInfo.value.description ? String(companyInfo.value.description) : '');
    formData.append('logo', companyInfo.value.logo ? String(companyInfo.value.logo) : '');
    try {
        const res = await apiService.update('companies/' + id, formData);
        if (res.data) {
            message.success('Cập nhật thông tin công ty thành công');
            isEditCompany.value = false
        }
    } catch (error: any) {
        message.error(error.response.data.message)
    }
}

const fileList = ref<UploadProps['fileList']>([]);
// const handleUpload = async (options: UploadRequestOption) => {
//     const { file, onSuccess, onError } = options;
//     try {
//         const res = await uploadApi(file, 'type');
//         if (res) {
//             userInfo.value.avatar = res.data.fileName;
//             message.success('Cập nhật ảnh đại diện thành công!');
//             onSuccess && onSuccess(res);
//         }
//     } catch (err: any) {
//         message.error('Cập nhật ảnh thất bại!');
//         onError && onError(err);
//     }
// };
const handleFileChange = (file: File) => {
    selectedFile.value = file;
};
const handleConfirmUpload = async (type: string) => {
    if (!selectedFile.value) {
        message.warning('Vui lòng chọn file trước khi xác nhận!');
        return;
    }
    try {
        const res = await apiService.upload(selectedFile.value, type);
        if (res) {

            companyInfo.value.logo = res.data.fileName;
            await updateCompany(companyInfo.value._id || '');
            openModalCompany.value = false;


        }
    } catch (err) {
        message.error('Cập nhật ảnh thất bại!');
    }
};
watch(fileList, () => {
    if (fileList.value?.length === 0) {
        companyInfo.value.logo = '';
    }
});


const formRef = ref<any>(null);

onMounted(async () => {
    await loadData();
});

</script>
<template>
    <a-layout-header :style="{ background: '#fff', padding: '0 20px' }" class="p-0 text-lg font-medium">Trang quản công
        ty</a-layout-header>
    <a-layout-content style="margin: 0 16px">
        <a-breadcrumb style="margin: 16px 0">
            <a-breadcrumb-item>Trang chủ</a-breadcrumb-item>
            <a-breadcrumb-item>Hồ sơ công ty</a-breadcrumb-item>
        </a-breadcrumb>
        <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            <div class="max-w-7xl mx-auto">
                <div class="grid grid-cols-1 gap-8">
                    <div class="bg-white rounded-xl shadow-lg p-6 space-y-6 mb-5 mx-auto mx-3 w-full">

                        <div class="flex justify-between">
                            <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2 ">
                                <ShoppingOutlined class="text-blue-600" />
                                Thông tin công ty
                            </h2>
                            <a-button v-if="!isEditCompany" type="primary" @click="isEditCompany = true">Sửa thông
                                tin công ty</a-button>
                            <div v-if="isEditCompany">
                                <a-button @click="isEditCompany = false" class="mr-1">Huỷ</a-button>
                                <a-button type="primary" @click="updateCompany(companyInfo?._id || '')">Xác
                                    nhận</a-button>
                            </div>
                        </div>
                        <div class="flex flex-wrap">
                            <div v-if="!isEditCompany" class="space-y-3 w-2/3">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Tên công ty</label>
                                    <p class="mt-1 text-lg text-gray-900">{{ companyInfo?.name }}</p>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Địa chỉ</label>
                                    <p class="mt-1 text-lg text-gray-900">{{ companyInfo?.address }}</p>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Ngày tạo</label>
                                    <p class="mt-1 text-lg text-gray-900">
                                        {{ companyInfo?.createdAt ? format(new Date(companyInfo.createdAt),
                                            'dd/MM/yyyy') + " vào " + format(new Date(companyInfo.createdAt),
                                                'HH:mm:ss') : 'N/A' }}

                                    </p>
                                </div>
                            </div>
                            <div v-else-if="isEditCompany" class="space-y-3 w-2/3">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Tên công ty</label>
                                    <a-input class="mt-1 text-base text-gray-900" v-model:value="companyInfo.name"
                                        placeholder="Vui lòng nhập tên công ty" />

                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Địa chỉ</label>
                                    <a-input class="mt-1 text-base text-gray-900" v-model:value="companyInfo.address"
                                        placeholder="Vui lòng nhập địa chỉ" />

                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Ngày tạo</label>
                                    <p class="mt-1 text-lg text-gray-900">
                                        {{ companyInfo?.createdAt ? format(new Date(companyInfo.createdAt),
                                            'dd/MM/yyyy') + " vào " + format(new Date(companyInfo.createdAt),
                                                'HH:mm:ss') : 'N/A' }}

                                    </p>
                                </div>
                            </div>
                            <div class="w-1/3 flex flex-col items-center gap-2">
                                <div class="border border-gray-200 rounded-lg">
                                    <img :src="`${companyInfo?.logo ? linkUploads('company/' + companyInfo?.logo) : 'https://via.placeholder.com/150'}`"
                                        alt="Avatar" class="object-cover rounded-lg w-[150px] h-[150px]  " />
                                </div>
                                <a-button @click="openModalCompany = true">Thay đổi</a-button>
                            </div>
                            <div class="w-full">
                                <div v-if="!isEditCompany">
                                    <label class="block text-lg font-medium text-gray-700 border-b border-blue-950">Mô
                                        tả</label>
                                    <p class="mt-1 text-lg text-gray-900" v-html="companyInfo?.description"></p>
                                </div>
                                <CKEditor :description="companyInfo.description" title="Mô tả"
                                    v-model="companyInfo.description" v-else>
                                </CKEditor>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </a-layout-content>
    <a-modal v-model:open="openModal" title="Thay đổi ảnh đại diện" ok-text="Xác nhận" @ok="handleConfirmUpload('user')"
        @cancel="openModal = false" :maskClosable="false">
        <div class="flex flex-col items-center w-full">
            <a-upload v-model:file-list="fileList"
                :before-upload="(file: File) => { handleFileChange(file); return false; }" list-type="picture-card"
                :max-count="1">
                <div>
                    <UploadOutlined />
                    <div style="margin-top: 8px">Tải lên</div>
                </div>
            </a-upload>

            <p class="text-gray-500 mt-2">Chọn ảnh và nhấn xác nhận để thay đổi ảnh.</p>
        </div>
    </a-modal>
    <a-modal v-model:open="openModalCompany" title="Thay đổi ảnh công ty" ok-text="Xác nhận"
        @ok="handleConfirmUpload('company')" @cancel="openModalCompany = false" :maskClosable="false">
        <div class="flex flex-col items-center w-full">
            <a-upload v-model:file-list="fileList"
                :before-upload="(file: File) => { handleFileChange(file); return false; }" list-type="picture-card"
                :max-count="1">
                <div>
                    <UploadOutlined />
                    <div style="margin-top: 8px">Tải lên</div>
                </div>
            </a-upload>

            <p class="text-gray-500 mt-2">Chọn ảnh và nhấn xác nhận để thay đổi ảnh.</p>
        </div>
    </a-modal>

</template>
<style>
.ant-upload-list-picture-card {
    display: flex;
    justify-content: center;

}
</style>

<script lang="ts" setup>
import { onBeforeMount, onMounted, ref, watch } from 'vue';
import {
    UserOutlined, UploadOutlined, ShoppingOutlined,
    EditOutlined, ClockCircleOutlined,
    BankOutlined
} from '@ant-design/icons-vue';
import accountService from '../../../services/account.service';
import type { ICompany, IUser, IUserbyAccount } from '../../../types/backend';
import { linkUploads } from '../../../constant/api';
import { message } from 'ant-design-vue';
import { format } from 'date-fns';
import CKEditor from '../../../components/CKEditor.vue';
import type { UploadRequestOption } from 'ant-design-vue/es/vc-upload/interface';
import type { UploadProps } from 'ant-design-vue';
import apiService from '../../../services/api.service';
import { getConscious, getDistrict, getWard } from '../../../services/location.service';

interface ICountry {
    id: string;
    niceName: string;
    flag: string;
}

const isEditCompany = ref(false);
const account: IUserbyAccount | null = accountService.getAccount().account;
const companyInfo = ref<ICompany>({});
const openModal = ref<boolean>(false);
const openModalCompany = ref<boolean>(false);
const selectedFile = ref<File | null>(null);
const dataCountry = ref<ICountry[]>([]);
const dataConscious = ref([]);
const dataDistrict = ref([]);
const dataWard = ref([]);

const loadData = async () => {
    const [companyRes] = await Promise.all([
        apiService.get('companies/' + account?.companyId)
    ]);
    companyInfo.value = companyRes.data;
}

const getDataConscious = async () => {
    try {
        const res = await getConscious();
        dataConscious.value = res.data;
    } catch (error) {
        message.error('Lỗi khi tải dữ liệu tỉnh/thành');
    }
}

const getDataDistrict = async (province: string) => {
    try {
        const res = await getDistrict(province);
        dataDistrict.value = res.data;
    } catch (error) {
        message.error('Lỗi khi tải dữ liệu quận/huyện');
    }
}

const getDataWard = async (district: string) => {
    try {
        const res = await getWard(district);
        dataWard.value = res.data;
    } catch (error) {
        message.error('Lỗi khi tải dữ liệu phường/xã');
    }
}

const updateCompany = async (id: string) => {
    try {
        const res = await apiService.update('companies/' + id, companyInfo.value);
        if (res.data) {
            message.success('Cập nhật thông tin công ty thành công');
            isEditCompany.value = false
        }
    } catch (error: any) {
        message.error(error.response.data.message)
    }
}

const fileList = ref<UploadProps['fileList']>([]);

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
    await getDataConscious();
});
</script>

<template>
  <a-layout-header
    :style="{ background: '#fff', padding: '0 20px' }"
    class="p-0 text-lg font-medium"
    >Trang quản lý thông tin công ty</a-layout-header
  >
    <a-layout-content class="p-6">
        <a-breadcrumb class="mb-6">
            <a-breadcrumb-item>
                <router-link to="/admin" class="text-blue-600 hover:text-blue-800">Trang chủ</router-link>
            </a-breadcrumb-item>
            <a-breadcrumb-item>
                <span class="text-gray-600">Hồ sơ công ty</span>
            </a-breadcrumb-item>
        </a-breadcrumb>
        <div class="min-h-screen bg-gray-50 rounded-xl">
            <div class="max-w-6xl mx-auto py-8">
                <div class="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300">
                    <div class="flex justify-between items-center px-8 py-6 border-b border-gray-100">
                        <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-3">
                            <BankOutlined class="text-red-600" />
                            Thông tin công ty
                        </h2>
                        <div>
                            <a-button 
                                v-if="!isEditCompany" 
                                type="primary" 
                                @click="isEditCompany = true"
                                class="flex items-center"
                            >
                                <template #icon><EditOutlined /></template>
                                Chỉnh sửa
                            </a-button>
                            <div v-if="isEditCompany" class="flex gap-2">
                                <a-button @click="isEditCompany = false">Huỷ</a-button>
                                <a-button 
                                    type="primary" 
                                    @click="updateCompany(companyInfo?._id || '')"
                                >
                                    Lưu thay đổi
                                </a-button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex flex-wrap px-8 py-6">
                        <div class="w-2/3 pr-8">
                            <div v-if="!isEditCompany">
                                <div class="mb-8">
                                    <h3 class="text-lg font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100">
                                        Thông tin cơ bản
                                    </h3>
                                    <div class="grid grid-cols-2 gap-6">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-500">Tên công ty</label>
                                            <p class="mt-1 text-base text-gray-900 font-medium">{{ companyInfo?.name || 'Chưa cập nhật' }}</p>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-500">Ngày thành lập</label>
                                            <p class="mt-1 text-base text-gray-900">
                                                {{ companyInfo?.createdAt ? format(new Date(companyInfo.createdAt), 'dd/MM/yyyy') : 'Chưa cập nhật' }}
                                            </p>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-500">Quy mô công ty</label>
                                            <p class="mt-1 text-base text-gray-900">{{ companyInfo?.size || 'Chưa cập nhật' }}</p>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-500">Lĩnh vực</label>
                                            <p class="mt-1 text-base text-gray-900">{{ companyInfo?.industry || 'Chưa cập nhật' }}</p>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-500">Mô hình công ty</label>
                                            <p class="mt-1 text-base text-gray-900">{{ companyInfo?.type || 'Chưa cập nhật' }}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="mb-8">
                                    <h3 class="text-lg font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100">
                                        Thông tin địa chỉ
                                    </h3>
                                    <div class="grid grid-cols-2 gap-6">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-500">Quốc gia</label>
                                            <p class="mt-1 text-base text-gray-900">{{ companyInfo?.country || 'Chưa cập nhật' }}</p>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-500">Tỉnh/Thành</label>
                                            <p class="mt-1 text-base text-gray-900">{{ companyInfo?.province || 'Chưa cập nhật' }}</p>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-500">Quận/Huyện</label>
                                            <p class="mt-1 text-base text-gray-900">{{ companyInfo?.district || 'Chưa cập nhật' }}</p>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-500">Phường/Xã</label>
                                            <p class="mt-1 text-base text-gray-900">{{ companyInfo?.ward || 'Chưa cập nhật' }}</p>
                                        </div>
                                        <div class="col-span-2">
                                            <label class="block text-sm font-medium text-gray-500">Địa chỉ chi tiết</label>
                                            <p class="mt-1 text-base text-gray-900">{{ companyInfo?.detailedAddress || 'Chưa cập nhật' }}</p>
                                        </div>
                                        <div class="col-span-2">
                                            <label class="block text-sm font-medium text-gray-500">Địa chỉ các văn phòng</label>
                                            <p class="mt-1 text-base text-gray-900">
                                                {{ companyInfo?.address?.length ? companyInfo?.address?.join(', ') : 'Chưa cập nhật' }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="mb-8">
                                    <h3 class="text-lg font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100">
                                        Chính sách làm việc
                                    </h3>
                                    <div class="grid grid-cols-2 gap-6">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-500">Ngày làm việc</label>
                                            <p class="mt-1 text-base text-gray-900">
                                                {{ companyInfo?.workingDays?.length ? companyInfo?.workingDays?.join(', ') : 'Chưa cập nhật' }}
                                            </p>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-500">Chính sách làm thêm giờ</label>
                                            <p class="mt-1 text-base text-gray-900">{{ companyInfo?.overtimePolicy || 'Chưa cập nhật' }}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 class="text-lg font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100">
                                        Mô tả công ty
                                    </h3>
                                    <div class="prose prose-blue max-w-none" v-html="companyInfo?.description || 'Chưa cập nhật'"></div>
                                </div>
                            </div>
                            
                            <div v-else-if="isEditCompany">
                                <div class="mb-8">
                                    <h3 class="text-lg font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100">
                                        Thông tin cơ bản
                                    </h3>
                                    <div class="grid grid-cols-2 gap-6">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-500 mb-1">Tên công ty</label>
                                            <a-input 
                                                v-model:value="companyInfo.name"
                                                placeholder="Vui lòng nhập tên công ty" 
                                                class="w-full"
                                            />
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-500 mb-1">Quy mô công ty</label>
                                            <a-select
                                                v-model:value="companyInfo.size"
                                                placeholder="Vui lòng chọn quy mô"
                                                class="w-full"
                                            >
                                                <a-select-option value="1-50">1-50 nhân viên</a-select-option>
                                                <a-select-option value="51-200">51-200 nhân viên</a-select-option>
                                                <a-select-option value="201-500">201-500 nhân viên</a-select-option>
                                                <a-select-option value="501-1000">501-1000 nhân viên</a-select-option>
                                                <a-select-option value="1000+">1000+ nhân viên</a-select-option>
                                            </a-select>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-500 mb-1">Lĩnh vực</label>
                                            <a-input
                                                v-model:value="companyInfo.industry"
                                                placeholder="Vui lòng nhập lĩnh vực"
                                                class="w-full"
                                            />
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-500 mb-1">Mô hình công ty</label>
                                            <a-input
                                                v-model:value="companyInfo.type"
                                                placeholder="Vui lòng nhập mô hình công ty"
                                                class="w-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="mb-8">
                                    <h3 class="text-lg font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100">
                                        Thông tin địa chỉ
                                    </h3>
                                    <div class="grid grid-cols-2 gap-6">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-500 mb-1">Quốc gia</label>
                                            <a-select
                                                v-model:value="companyInfo.country"
                                                show-search
                                                option-filter-prop="label"
                                                placeholder="Vui lòng chọn quốc gia"
                                                class="w-full"
                                            >
                                                <a-select-option
                                                    v-for="item in dataCountry"
                                                    :key="item.id"
                                                    :value="item.id"
                                                    :label="item.niceName"
                                                >
                                                    <span class="flex items-center">
                                                        {{ item.niceName }}
                                                        <img :src="item.flag" class="w-4 h-4 ml-2" loading="lazy" alt="#" />
                                                    </span>
                                                </a-select-option>
                                            </a-select>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-500 mb-1">Tỉnh/Thành</label>
                                            <a-select
                                                v-model:value="companyInfo.province"
                                                :options="dataConscious"
                                                :field-names="{ label: 'name', value: 'name' }"
                                                show-search
                                                @change="(value: string) => getDataDistrict(value)"
                                                placeholder="Vui lòng chọn tỉnh/thành"
                                                class="w-full"
                                            >
                                            </a-select>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-500 mb-1">Quận/Huyện</label>
                                            <a-select
                                                v-model:value="companyInfo.district"
                                                :options="dataDistrict"
                                                :field-names="{ label: 'name', value: 'name' }"
                                                show-search
                                                @change="(value: string) => getDataWard(value)"
                                                placeholder="Vui lòng chọn quận/huyện"
                                                class="w-full"
                                            >
                                            </a-select>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-500 mb-1">Phường/Xã</label>
                                            <a-select
                                                v-model:value="companyInfo.ward"
                                                :options="dataWard"
                                                :field-names="{ label: 'name', value: 'name' }"
                                                show-search
                                                placeholder="Vui lòng chọn phường/xã"
                                                class="w-full"
                                            >
                                            </a-select>
                                        </div>
                                        <div class="col-span-2">
                                            <label class="block text-sm font-medium text-gray-500 mb-1">Địa chỉ chi tiết</label>
                                            <a-input
                                                v-model:value="companyInfo.detailedAddress"
                                                placeholder="Vui lòng nhập địa chỉ chi tiết"
                                                class="w-full"
                                            />
                                        </div>
                                        <div class="col-span-2">
                                            <label class="block text-sm font-medium text-gray-500 mb-1">Địa chỉ các văn phòng</label>
                                            <a-select
                                                v-model:value="companyInfo.address"
                                                :options="dataConscious"
                                                :field-names="{ label: 'name', value: 'name' }"
                                                mode="multiple"
                                                placeholder="Vui chọn địa chỉ các văn phòng"
                                                class="w-full"
                                            >
                                            </a-select>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="mb-8">
                                    <h3 class="text-lg font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100">
                                        Chính sách làm việc
                                    </h3>
                                    <div class="grid grid-cols-2 gap-6">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-500 mb-1">Ngày làm việc</label>
                                            <a-select
                                                v-model:value="companyInfo.workingDays"
                                                mode="multiple"
                                                placeholder="Vui lòng chọn ngày làm việc"
                                                class="w-full"
                                            >
                                                <a-select-option value="monday">Thứ 2</a-select-option>
                                                <a-select-option value="tuesday">Thứ 3</a-select-option>
                                                <a-select-option value="wednesday">Thứ 4</a-select-option>
                                                <a-select-option value="thursday">Thứ 5</a-select-option>
                                                <a-select-option value="friday">Thứ 6</a-select-option>
                                                <a-select-option value="saturday">Thứ 7</a-select-option>
                                                <a-select-option value="sunday">Chủ nhật</a-select-option>
                                            </a-select>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-500 mb-1">Chính sách làm thêm giờ</label>
                                            <a-input
                                                v-model:value="companyInfo.overtimePolicy"
                                                placeholder="Vui lòng nhập chính sách làm thêm giờ"
                                                class="w-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 class="text-lg font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100">
                                        Mô tả công ty
                                    </h3>
                                    <CKEditor 
                                        :description="companyInfo.description" 
                                        v-model="companyInfo.description"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div class="w-1/3">
                            <div class="bg-gray-50 rounded-lg p-6 sticky top-6">
                                <div class="flex flex-col items-center mb-4">
                                    <div class="mb-4 w-40 h-40 overflow-hidden rounded-lg shadow-sm border border-gray-200">
                                        <img 
                                            :src="`${companyInfo?.logo ? linkUploads('company/' + companyInfo?.logo) : 'https://via.placeholder.com/150'}`"
                                            alt="Logo công ty" 
                                            class="object-cover w-full h-full" 
                                        />
                                    </div>
                                    <a-button 
                                        @click="openModalCompany = true"
                                        class="mt-3"
                                    >
                                        <template #icon><UploadOutlined /></template>
                                        Thay đổi logo
                                    </a-button>
                                </div>
                                
                                <div class="border-t border-gray-200 pt-4">
                                    <h4 class="text-sm font-medium text-gray-500 mb-2">Thông tin cập nhật</h4>
                                    <ul class="space-y-2">
                                        <li class="flex items-start">
                                            <ClockCircleOutlined class="text-gray-400 mt-0.5 mr-2" />
                                            <div>
                                                <p class="text-xs text-gray-500">Ngày tạo</p>
                                                <p class="text-sm text-gray-700">
                                                    {{ companyInfo?.createdAt ? format(new Date(companyInfo.createdAt),
                                                        'dd/MM/yyyy') : 'Chưa cập nhật' }}
                                                </p>
                                            </div>
                                        </li>
                                        <li class="flex items-start">
                                            <ClockCircleOutlined class="text-gray-400 mt-0.5 mr-2" />
                                            <div>
                                                <p class="text-xs text-gray-500">Cập nhật lần cuối</p>
                                                <p class="text-sm text-gray-700">
                                                    {{ companyInfo?.updatedAt ? format(new Date(companyInfo.updatedAt),
                                                        'dd/MM/yyyy') : 'Chưa cập nhật' }}
                                                </p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </a-layout-content>
    
    <a-modal 
        v-model:open="openModalCompany" 
        title="Thay đổi logo công ty" 
        :footer="null"
        :maskClosable="false"
        :width="400"
    >
        <div class="flex flex-col items-center w-full">
            <a-upload 
                v-model:file-list="fileList"
                :before-upload="(file: File) => { handleFileChange(file); return false; }" 
                list-type="picture-card"
                :max-count="1"
                class="mb-4"
            >
                <div class="flex flex-col items-center justify-center text-gray-500">
                    <UploadOutlined style="font-size: 24px;" />
                    <p class="mt-2">Tải lên</p>
                </div>
            </a-upload>

            <p class="text-gray-500 text-sm text-center mb-6">
                Chọn ảnh logo công ty và nhấn xác nhận để thay đổi.
            </p>
            
            <div class="flex justify-end gap-2 w-full">
                <a-button @click="openModalCompany = false">Huỷ</a-button>
                <a-button 
                    type="primary" 
                    @click="handleConfirmUpload('company')"
                    :disabled="!selectedFile"
                >
                    Xác nhận
                </a-button>
            </div>
        </div>
    </a-modal>
</template>

<style>
.ant-upload-list-picture-card {
    display: flex;
    justify-content: center;
}

.prose {
    line-height: 1.6;
}

.prose p {
    margin-bottom: 1rem;
}

.prose img {
    border-radius: 0.375rem;
}
</style>
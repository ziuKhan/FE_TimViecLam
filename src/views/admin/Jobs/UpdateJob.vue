<script lang="ts" setup>
import { onMounted, onUpdated, ref, watch } from 'vue';

import useCompanyStore from '../../../stores/admin/CompanyStore';
import CKEditor from '../../../components/CKEditor.vue';
import type { UploadRequestOption } from 'ant-design-vue/es/vc-upload/interface';
import { uploadApi } from '../../../services/upload.service';
import { message } from 'ant-design-vue';
import useJobStore from '../../../stores/admin/JobStore';
import { LEVELS_LIST, SKILLS_LIST } from '../../../until/until';
import type { Dayjs } from 'dayjs';
import companyService from '../../../services/company.service';
import dayjs from 'dayjs';


const value1 = ref<Dayjs[] | undefined>([]);
watch(value1, (newValue) => {
    if (newValue) {
        store.form.startDate = newValue[0]?.toDate();
        store.form.endDate = newValue[1]?.toDate();
    }
    else {
        store.form.startDate = null;
        store.form.endDate = null;
    }
});

const store = useJobStore()

const formRef = ref<any>(null);
const rangePickerRef = ref<any>(null);

const handleOk = () => {
    formRef.value.validate().then(() => {
        if (!store.form.startDate || !store.form.endDate) {
            message.error('Vui lòng nhập ngày bắt đầu và kết thúc!');
            rangePickerRef.value.$el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        store.updateAndAdd();
    }).catch(() => {
        message.error('Vui lòng kiểm tra lại các trường đã nhập!');
    });
};

const dataCompany = ref<any[]>([]);
const getCompanies = async () => {
    try {
        const res = await companyService.paginateApi('?current=1&pageSize=200&isActive=true&sort=-createdAt');
        if (res) {
            for (let i = 0; i < res.result.length; i++) {
                dataCompany.value.push({ label: res.result[i].name, value: res.result[i]._id })
            }
        }
    }
    catch (err) {
        console.log(err);
    }
}

const handleSelectChangeLevel = (value: any) => {
    if (value.length > 1) {
        store.form.level = value[value.length - 1];
    } else {
        store.form.level = value;
    }
};
const handleSelectChangeCompany = (value: any) => {
    if (value.length > 1) {
        store.form.companyId._id = value[value.length - 1];
    } else {
        store.form.companyId._id = value;
    }
};

onUpdated(() => {
    if (store.form._id) {
        value1.value = [dayjs(store.form.startDate), dayjs(store.form.endDate)];
    } else {
        value1.value = undefined;
    }
})

onMounted(() => {
    getCompanies()
    if (store.form._id) {
        value1.value = [dayjs(store.form.startDate), dayjs(store.form.endDate)];
    } else {
        value1.value = undefined;
    }
})
</script>


<template>
    <a-modal {{ }} :title="store.form._id ? 'Cập nhật Role' : 'Tạo mới Role'"
        :okText="store.form._id ? 'Cập nhật' : 'Thêm mới'" :width="850" v-model:open="store.openModal"
        :maskClosable="false" :cancelButtonProps="{ style: { display: 'none' } }" @ok="handleOk"
        :confirm-loading="store.loading">

        <a-form :model="store.form" ref="formRef" layout="vertical" class=" py-3">
            <a-row :gutter="16">
                <a-col :span="22">
                    <a-form-item label="Tên" name="name"
                        :rules="[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]">
                        <a-input v-model:value="store.form.name" placeholder="Vui lòng nhập name" />
                    </a-form-item>
                </a-col>
                <a-col :span="2">
                    <a-form-item label="Active" name="isActive">
                        <a-switch v-model:checked="store.form.isActive" />
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

                <a-col :span="12">
                    <a-form-item label="Lương" name="salary"
                        :rules="[{ required: true, message: 'Vui lòng nhập lương!' }]">
                        <a-input-number v-model:value="store.form.salary" placeholder="Vui lòng nhập lương"
                            class="w-full" min="1" />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="Số lượng tuyển" name="quantity"
                        :rules="[{ required: true, message: 'Vui lòng nhập Số lượng tuyển!' }]">
                        <a-input-number v-model:value="store.form.quantity" placeholder="Vui lòng nhập quantity"
                            class="w-full" min="1" />
                    </a-form-item>
                </a-col>

                <a-col :span="12">
                    <a-form-item label="Trình độ" name="level"
                        :rules="[{ required: true, message: 'Vui lòng nhập kĩ năng!' }]">
                        <a-select v-model:value="store.form.level" allowClear mode="tags" style="width: 100%"
                            placeholder="Vui lòng nhập trình độ..." :options="LEVELS_LIST"
                            @change="handleSelectChangeLevel">
                        </a-select>
                    </a-form-item>
                </a-col>

                <a-col :span="12">
                    <a-form-item label="Ngày bắt đầu và kết thúc" name="endDate">
                        <a-range-picker ref="rangePickerRef" v-model:value="value1" class="w-full"
                            format="DD / MM / YYYY" />
                    </a-form-item>
                </a-col>


                <a-col :span="24">
                    <a-form-item label="Công ty" name="companyId"
                        :rules="[{ required: true, message: 'Vui lòng nhập công ty!' }]">

                        <a-select v-model:value="store.form.companyId._id" allowClear style="width: 100%"
                            placeholder="Vui lòng công ty..." :options="dataCompany" @change="handleSelectChangeCompany"
                            mode="multiple">
                        </a-select>
                    </a-form-item>
                </a-col>


                <a-col :span="24">
                    <a-form-item label="Địa chỉ" name="location"
                        :rules="[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]">
                        <a-input v-model:value="store.form.location" placeholder="Vui lòng nhập location" />
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
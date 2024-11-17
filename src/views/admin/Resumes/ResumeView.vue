<script lang="ts" setup>


import { onMounted, watch, watchEffect } from 'vue';
import type { IPaginate } from '../../../types/backend';
import dayjs from 'dayjs';
import { linkUploads } from '../../../constant/api';
import useCompanyStore from '../../../stores/admin/CompanyStore';
import UpdateResume from './UpdateResume.vue';
import useResumeStore from '../../../stores/admin/ResumeStore';
import DetailResume from './DetailResume.vue';

const store = useResumeStore()

const columns = [
    {
        title: 'STT',
    },
    {
        title: 'Email',
        dataIndex: 'email',
    },
    {
        title: 'Mã người dùng',
        dataIndex: 'userId',
    },
    {
        title: 'Link CV',
        dataIndex: 'url',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
    },
    {
        title: 'Ngày tạo',
        dataIndex: 'createdAt',
    },
    {
        title: 'Thao tác',
        dataIndex: '_id',
    }
];

const handleTableChange = (pagination: IPaginate) => {
    store.dataMeta.current = pagination.current;
    store.dataMeta.pageSize = pagination.pageSize;
    store.getData();
};

onMounted(() => {
    store.getData()
})


const renderColorMethod = (method: string) => {
    switch (method) {
        case 'PENDING':
            return 'orange'; // Màu cam thường biểu thị sự chờ đợi
        case 'REVIEWING':
            return 'blue'; // Màu xanh biển thường biểu thị trạng thái đang xử lý hoặc xem xét
        case 'APPROVED':
            return 'green'; // Màu xanh lá cây biểu thị sự chấp nhận/thành công
        case 'REJECTED':
            return 'red'; // Màu đỏ thường biểu thị sự từ chối hoặc thất bại
        default:
            return 'gray'; // Màu xám cho các trạng thái không xác định
    }
}
const renderStatus = (status: string) => {
    switch (status) {
        case 'PENDING':
            return 'ĐANG CHỜ'
        case 'REVIEWING':
            return 'ĐANG XEM XÉT'
        case 'APPROVED':
            return 'ĐÃ DUYỆT'
        case 'REJECTED':
            return 'ĐÃ TỪ CHỐI'
    }
}
</script>
<template>
    <a-layout-header :style="{ background: '#fff', padding: '0 20px' }" class="p-0 text-lg font-medium">Trang quản lý
        hồ sơ xin việc</a-layout-header>
    <a-layout-content style="margin: 0 16px">

        <a-breadcrumb style="margin: 16px 0">
            <a-breadcrumb-item>Trang chủ</a-breadcrumb-item>
            <a-breadcrumb-item>Quản lý hồ sơ xin việc</a-breadcrumb-item>
        </a-breadcrumb>
        <div class="p-6 bg-white min-h-[360px] rounded-[10px]">
            <div class="flex justify-between" v-permission="'GET /api/v1/resumes'">
                <a-input-search placeholder="Vui lòng nhập thông tin cần tìm kiếm" enter-button="Tìm kiếm"
                    v-model:value="store.valueSearch" @search="store.getData(store.valueSearch)" class="w-1/3" />
                <div>
                    <span class="mr-1 text-base">Hiển thị theo trạng thái: </span>
                    <a-select v-model:value="store.isStatus" class="w-[200px]">
                        <a-select-option selected value="PENDING">ĐANG CHỜ</a-select-option>
                        <a-select-option value="REVIEWING">ĐANG XEM XÉT</a-select-option>
                        <a-select-option value="APPROVED">ĐÃ DUYỆT</a-select-option>
                        <a-select-option value="REJECTED">ĐÃ TỪ CHỐI</a-select-option>
                    </a-select>
                </div>
            </div>

            <div class="mt-3 border rounded-[10px]">
                <a-table :columns="columns" :data-source="store.data" :loading="store.loading"
                    :pagination=store.dataMeta @change="handleTableChange">
                    <template #bodyCell="{ column, text, index }">
                        <template v-if="column.title === 'STT'">
                            {{ ((store.dataMeta.current || 1) - 1) * (store.dataMeta.pageSize || 6) + index + 1 }}
                        </template>
                        <template v-else-if="column.dataIndex === 'createdAt'">
                            {{ dayjs(text).format('DD/MM/YYYY [lúc] HH:mm:ss') }}
                        </template>

                        <template v-else-if="column.dataIndex === 'url'">
                            <a :href="linkUploads('cv/' + text)" target="_blank" class="text-blue-600">Xem</a>
                        </template>
                        <template v-else-if="column.dataIndex === 'status'">
                            <span>
                                <a-tag :color="renderColorMethod(text)" class="font-medium">
                                    {{ renderStatus(text) }}
                                </a-tag>
                            </span>
                        </template>

                        <template v-else-if="column.dataIndex === '_id'">
                            <div class="flex items-center">
                                <a-button v-permission="'GET /api/v1/resumes/:id'" class="mr-2"
                                    @click="store.getByID(text, true)">Chi tiêt</a-button>
                                <!-- <button type="button" v-permission="'PATCH /api/v1/resumes/:id'"
                                    class="mr-2  bg-[#1669dcec] hover:bg-[#498ff1] rounded-[5px] px-[10px] py-1 h-8 "
                                    @click="store.getByID(text)">
                                    <img loading="lazy" class=" h-5/6"
                                        src="../../../assets/image/icon/icons8_settings.svg" alt="">
                                </button> -->
                                <a-popconfirm title="Bạn có chắc muốn xoá?" ok-text="Có" cancel-text="Không"
                                    :loading="store.loading" @confirm="store.deleteByID(text)" @cancel=""
                                    v-permission="'DELETE /api/v1/resumes/:id'">
                                    <button type="button"
                                        class=" bg-red-500 hover:bg-red-400 rounded-[5px] px-[10px] ] py-1 h-8 ">
                                        <img loading="lazy" class="h-5/6"
                                            src="../../../assets/image/icon/icons8_remove.svg" alt=""></button>
                                </a-popconfirm>
                            </div>

                        </template>
                    </template>
                </a-table>
            </div>
        </div>
    </a-layout-content>
    <UpdateResume />
    <DetailResume />
</template>
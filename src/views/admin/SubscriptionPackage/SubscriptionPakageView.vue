<script lang="ts" setup>


import { onMounted, ref, watch, watchEffect } from 'vue';
import type { IPaginate } from '../../../types/backend';
import dayjs from 'dayjs';
import UpdatePermison from './UpdateSubscriptionPakage.vue';
import usePermissionStore from '../../../stores/admin/PermissionStore';
import { message } from 'ant-design-vue';
import { CopyOutlined, DeleteOutlined, EditOutlined, SettingOutlined } from '@ant-design/icons-vue';
import useSubscriptionPackageStore from '../../../stores/admin/SubPakageStore';
import UpdateSubscriptionPakage from './UpdateSubscriptionPakage.vue';


const store = useSubscriptionPackageStore()

const columns = [
    {
        title: 'STT',
    },
    {
        title: 'Tên gói dịch vụ',
        dataIndex: 'name',
    },
    {
        title: 'Mã gói dịch vụ',
        dataIndex: 'code',
    },
    {
        title: 'Giá',
        dataIndex: 'price',
    },
    {
        title: 'Giá sau khi giảm',
        dataIndex: 'priceDiscount',
    },
    {
        title: 'Thời hạn',
        dataIndex: 'duration',
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

const handleSearch = () => {
    store.dataMeta.current = 1;
    store.getData()
}


onMounted(() => {
    store.getData()
})


</script>
<template>
    <a-layout-header :style="{ background: '#fff', padding: '0 20px' }" class="p-0 text-lg font-medium">Trang quản lý
        kỹ năng</a-layout-header>
    <a-layout-content style="margin: 0 16px">

        <a-breadcrumb style="margin: 16px 0">
            <a-breadcrumb-item>Trang chủ</a-breadcrumb-item>
            <a-breadcrumb-item>Quản lý kỹ năng</a-breadcrumb-item>
        </a-breadcrumb>
        <div class="p-6 bg-white min-h-[360px] rounded-[10px]">
            <div class="flex justify-between">
                <a-input-search v-permission="'GET /api/v1/skills'"
                    placeholder="Vui lòng nhập thông tin cần tìm kiếm" enter-button="Tìm kiếm"
                    v-model:value="store.keySearch" @search="handleSearch" class="w-1/3" />
                <button class="bg-[#21aa55] hover:bg-green-500 text-white rounded-[7px] px-5 font-medium "
                    @click="store.handleOpenModal()" v-permission="'POST /api/v1/subscription-package'">Thêm
                    mới</button>
            </div>

            <div class="mt-3 border rounded-[10px]">
                <a-table :columns="columns" :data-source="store.data" :loading="store.loading" :pagination=store.dataMeta
                    @change="handleTableChange">
                    <template #bodyCell="{ column, text, index }">
                        <template v-if="column.title === 'STT'">
                            {{ ((store.dataMeta.current || 1) - 1) * (store.dataMeta.pageSize || 6) + index + 1 }}
                        </template>
                        <template v-else-if="column.dataIndex === 'createdAt'">
                            {{ dayjs(text).format('DD/MM/YYYY [lúc] HH:mm:ss') }}
                        </template>
                        <template v-else-if="column.dataIndex === 'price'">
                            {{ text.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) }}
                        </template>
                        <template v-else-if="column.dataIndex === 'priceDiscount'">
                            {{ text.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) }}
                        </template>
                        <template v-else-if="column.dataIndex === 'duration'">
                            {{ text }} tháng
                        </template>
                        <template v-else-if="column.dataIndex === '_id'">
                          
                            <button type="button"
                                class="mr-2  bg-[#1669dcec] hover:bg-[#498ff1] rounded-[5px] px-[10px] py-1 h-8 "
                                @click="store.getByID(text)" v-permission="'PATCH /api/v1/skills/:id'">
                                    <EditOutlined  class="text-white"/>
                            </button>
                            <a-popconfirm title="Bạn có chắc muốn xoá?" ok-text="Có" cancel-text="Không"
                                :loading="store.loading" @confirm="store.deleteByID(text)" @cancel=""
                                v-permission="'DELETE /api/v1/skills/:id'">
                                <button type="button"
                                    class=" bg-red-500 hover:bg-red-400 rounded-[5px] px-[10px] ] py-1 h-8 ">
                                    <DeleteOutlined  class="text-white"/>
                                </button>
                            </a-popconfirm>
                        </template>
                    </template>
                </a-table>
            </div>
        </div>
    </a-layout-content>
    <UpdateSubscriptionPakage> </UpdateSubscriptionPakage>
</template>
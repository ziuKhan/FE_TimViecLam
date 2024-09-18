<script lang="ts" setup>

import { onMounted, watchEffect } from 'vue';
import type { IPaginate } from '../../../types/backend';

import dayjs from 'dayjs';
import UpdateUser from './UpdateUser.vue';
import useUserStore from '../../../stores/admin/UserStore';


const store = useUserStore()

const columns = [
    {
        title: 'STT',
    },
    {
        title: 'Tên',
        dataIndex: 'name',
    },
    {
        title: 'Email',
        dataIndex: 'email',
    },
    {
        title: 'Giới tính',
        dataIndex: 'gender',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'isActive',
    },
    {
        title: 'Quyền',
        dataIndex: ["role", "name"],
    },
    {
        title: 'Địa chỉ',
        dataIndex: 'address',
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


</script>
<template>
    <a-layout-header :style="{ background: '#fff', padding: '0 20px' }" class="p-0 text-lg font-medium">Trang quản lý
        tài khoản</a-layout-header>
    <a-layout-content style="margin: 0 16px">

        <a-breadcrumb style="margin: 16px 0">
            <a-breadcrumb-item>Trang chủ</a-breadcrumb-item>
            <a-breadcrumb-item>Quản lý quyền</a-breadcrumb-item>
        </a-breadcrumb>
        <div class="p-6 bg-white min-h-[360px] rounded-[10px]">
            <div class="flex justify-between">

                <div class="w-3/4 flex">
                    <a-input-search placeholder="Vui lòng nhập thông tin cần tìm kiếm" enter-button="Tìm kiếm"
                        v-model:value="store.valueSearch" @search="store.getData(store.valueSearch)" />
                    <div class="ml-5 flex items-center">
                        <span class="mr-3 font-medium">Active</span>
                        <a-switch v-model:checked="store.isActive" />
                    </div>
                </div>
                <button class="bg-[#21aa55] hover:bg-green-500 text-white rounded-[7px] px-5 font-medium "
                    @click="store.handleOpenModal()">Thêm
                    mới</button>
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
                        <template v-else-if="column.dataIndex === 'isActive'">
                            <span :class="text ? 'text-green-600' : 'text-red-500'">
                                Active
                            </span>
                        </template>
                        <template v-else-if="column.dataIndex === '_id'">
                            <div class="flex">
                                <button type="button"
                                    class="mr-2  bg-[#1669dcec] hover:bg-[#498ff1] rounded-[5px] px-[10px] py-1 h-8 "
                                    @click="store.getByID(text)">
                                    <img class=" h-[24px]" src="../../../assets/image/icon/icons8_settings.svg" alt="">
                                </button>

                                <a-popconfirm title="Bạn có chắc muốn xoá?" ok-text="Có" cancel-text="Không"
                                    :loading="store.loading" @confirm="store.deleteByID(text)" @cancel="">
                                    <button type="button"
                                        class=" bg-red-500 hover:bg-red-400 rounded-[5px] px-[10px] ] py-1 h-8 ">
                                        <img class="h-[24px]" src="../../../assets/image/icon/icons8_remove.svg"
                                            alt=""></button>
                                </a-popconfirm>
                            </div>
                        </template>
                    </template>
                </a-table>
            </div>
        </div>
    </a-layout-content>
    <UpdateUser> </UpdateUser>
</template>
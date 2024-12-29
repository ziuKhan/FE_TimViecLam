<script lang="ts" setup>
import { onMounted, ref, render, watch, watchEffect } from 'vue';
import type { IPaginate, IResume } from '../../../types/backend';
import dayjs from 'dayjs';
import { linkUploads } from '../../../constant/api';
import accountService from '../../../services/account.service';
import apiService from '../../../services/api.service';
const load = ref<boolean>(false)

const { account, storage } = accountService.getAccount();
const dataResume = ref<IResume[]>([])


const dataMeta = ref<IPaginate>({
    current: 1,
    pageSize: 5,
    pages: 0,
    total: 0,
});

const getData = async () => {
    load.value = true
    const params = `?current=${dataMeta.value?.current || 1}&pageSize=${dataMeta.value?.pageSize || 5}&populate=jobId,companyId&createdBy._id=${account?._id}&sort=-createdAt`
    const res = await apiService.get('resumes/client' + params);
    if (res) {
        dataResume.value = res.data.result
        dataMeta.value = res.data.meta
        console.log(dataMeta.value)
        load.value = false
    }
}
const handleTableChange = (pagination: IPaginate) => {
    dataMeta.value.current = pagination.current;
    dataMeta.value.pageSize = pagination.pageSize;
    getData();
};

onMounted(() => {
    getData()
})

const columns = [
    {
        title: 'STT',
    },
    {
        title: 'Công ty',
        dataIndex: ["companyId", "name"],
    },
    {
        title: 'Tên Job',
        dataIndex: ["jobId", "name"],
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
    },
    {
        title: 'Ngày gửi',
        dataIndex: 'createdAt',

    },
    {
        title: 'CV',
        dataIndex: 'url',
    },
];
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

</script>
<template>
    <a-table :columns="columns" :data-source="dataResume" :loading="load" :pagination=dataMeta
        @change="handleTableChange" :key="dataResume.length">
        <template #bodyCell="{ column, text }">
            <template v-if="column.dataIndex === 'url'">
                <a class="text-blue-600" target="_blank" :href="linkUploads('cv/' + text)">Chi tiết</a>
            </template>
            <template v-else-if="column.dataIndex === 'createdAt'">
                {{ dayjs(text).format('DD/MM/YYYY [lúc] HH:mm:ss') }}
            </template>
            <template v-else-if="column.title === 'STT'">
                {{ dataResume.indexOf(text) + 1 }}
            </template>
            <template v-else-if="column.dataIndex === 'status'">
                <span>
                    <a-tag :color="renderColorMethod(text)" class="font-medium">
                        {{ text.toUpperCase() }}
                    </a-tag>
                </span>
            </template>

        </template>
    </a-table>
</template>
../../../services/account.service
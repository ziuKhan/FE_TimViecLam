<template>
    <a-table :columns="columns" :data-source="dataResume" :loading="load" :pagination=dataMeta
        @change="handleTableChange">
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
                <span class="text-red-600 font-medium">{{ text }}</span>
            </template>
        </template>
    </a-table>
</template>


<script lang="ts" setup>
import { onMounted, ref, render, watch, watchEffect } from 'vue';
import type { IPaginate, IResume } from '../../types/backend';
import { paginateResumeApi } from '../../services/resume.service';
import { useAuthStore } from '../../stores/AuthStore';
import dayjs from 'dayjs';
import { linkUploads } from '../../constant/api';
const load = ref<boolean>(false)

const storeAuth = useAuthStore()

const dataResume = ref<IResume[]>([])


const dataMeta = ref<IPaginate>({
    current: 1,
    pageSize: 5,
    pages: 0,
    total: 0,
});

const getData = async () => {
    load.value = true
    const params = `?current=${dataMeta.value?.current || 1}&pageSize=${dataMeta.value?.pageSize || 5}&populate=jobId,companyId&createdBy._id=${storeAuth.user?._id}&sort=-createdAt`
    const res = await paginateResumeApi(params);
    if (res) {
        dataResume.value = res.result
        dataMeta.value = res.meta
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


</script>
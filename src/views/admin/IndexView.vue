<script lang="ts" setup>
import { ArrowUpOutlined, ArrowDownOutlined, SmileOutlined, DownOutlined } from '@ant-design/icons-vue';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    RadialLinearScale,
    ArcElement
} from 'chart.js'
import { Line, PolarArea } from 'vue-chartjs'
import jobService from '../../services/job.service';
import { onMounted, ref } from 'vue';
import type { IJob } from '../../types/backend';
import { formatDate } from 'date-fns';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    RadialLinearScale,
    ArcElement
)

const options = {
    responsive: true,
    maintainAspectRatio: false
}
const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'Data One',
            backgroundColor: '#f87979',
            data: [40, 39, 10, 40, 39, 80, 40]
        }
    ]
}
const data2 = {
    labels: [
        'Eating',
        'Drinking',
        'Sleeping',
        'Designing',
        'Coding',
        'Cycling',
        'Running'
    ],
    datasets: [
        {
            label: 'My First dataset',
            backgroundColor: 'rgba(179,181,198,0.2)',
            pointBackgroundColor: 'rgba(179,181,198,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(179,181,198,1)',
            data: [65, 59, 90, 81, 56, 55, 40]
        },
        {
            label: 'My Second dataset',
            backgroundColor: 'rgba(255,99,132,0.2)',
            pointBackgroundColor: 'rgba(255,99,132,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(255,99,132,1)',
            data: [28, 48, 40, 19, 96, 27, 100]
        }
    ]
}

const options2 = {
    responsive: true,
    maintainAspectRatio: false
}

const columns = [
    {
        title: 'STT',
        key: 'stt',
    },
    {
        title: 'Tên công việc',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Lương',
        dataIndex: 'salary',
        key: 'salary',
    },
    {
        title: 'Số lượng tuyển',
        dataIndex: 'quantity',
        key: 'quantity',
    },
    {
        title: 'Cấp',
        dataIndex: 'level',
        key: 'level',
    },
    {
        title: 'Ngày bắt đầu',
        dataIndex: 'startDate',
        key: 'startDate',
    },
];
const loadDataJobNew = async () => {
    try {
        const res = await jobService.paginateApi(`?current=1&pageSize=10&sort=-createdAt&isActive=true&endDate=${new Date().toISOString()}`)
        dataTable.value = res.result
    } catch (error) {
        console.log(error)
    }
}

const dataTable = ref<IJob[]>([])
onMounted(async () => {
    await loadDataJobNew()
})
</script>
<template>
    <div style="background: #ececec; padding: 30px">
        <a-row :gutter="16">
            <a-col :span="6">
                <a-card>
                    <a-statistic title="Công ty mới so với tháng trước" :value="11.28" :precision="2" suffix="%"
                        :value-style="{ color: '#3f8600' }" style="margin-right: 50px">
                        <template #prefix>
                            <arrow-up-outlined />
                        </template>
                    </a-statistic>
                </a-card>
            </a-col>
            <a-col :span="6">
                <a-card>
                    <a-statistic title="Việc làm mới so với tháng trước" :value="11.28" :precision="2" suffix="%"
                        :value-style="{ color: '#3f8600' }" style="margin-right: 50px">
                        <template #prefix>
                            <arrow-up-outlined />
                        </template>
                    </a-statistic>
                </a-card>
            </a-col>
            <a-col :span="6">
                <a-card>
                    <a-statistic title="Tài khoản mới so với tháng trước" :value="11.28" :precision="2" suffix="%"
                        :value-style="{ color: '#3f8600' }" style="margin-right: 50px">
                        <template #prefix>
                            <arrow-up-outlined />
                        </template>
                    </a-statistic>
                </a-card>
            </a-col>
            <a-col :span="6">
                <a-card>
                    <a-statistic title="Hồ sơ ứng tuyển thành công" :value="9.3" :precision="2" suffix="%"
                        class="demo-class" :value-style="{ color: '#cf1322' }">
                        <template #prefix>
                            <arrow-down-outlined />
                        </template>
                    </a-statistic>
                </a-card>
            </a-col>
            <a-col :span="16" class="mt-4 ">
                <div class="p-3 bg-white rounded-[8px]">
                    <h2 class="text-xl ">Thống kê ...</h2>
                    <Line :data="data" :options="options" class="max-h-[300px]" />
                </div>
            </a-col>
            <a-col :span="8" class="mt-4">
                <div class="p-3 mr-[8px] bg-white rounded-[8px]">
                    <h2 class="text-xl ">Thống kê ...</h2>
                    <PolarArea :data="data2" :options="options2" class="max-h-[300px]" />

                </div>
            </a-col>
            <a-col :span="24" class="mt-4">
                <div class="p-3 mr-[8px] bg-white rounded-[8px]">
                    <h2 class="text-xl ">Công việc mới nhất</h2>
                    <a-table :columns="columns" :data-source="dataTable" pagination="false">
                        <template #bodyCell="{ column, record, index }">
                            <template v-if="column.key === 'stt'">
                                {{ index + 1 }}
                            </template>
                            <template v-if="column.key === 'name'">
                                <router-link :to="`job/${record._id}`" class="hover:text-red-600">{{
                                    record.name
                                }}</router-link>
                            </template>
                            <template v-if="column.key === 'startDate'">
                                {{ formatDate(new Date(record.startDate), 'dd/MM/yyyy HH:mm') }}
                            </template>
                        </template>
                    </a-table>
                </div>
            </a-col>
        </a-row>
    </div>
</template>

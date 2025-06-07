<script lang="ts" setup>
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
  ArcElement,
  BarElement
} from 'chart.js'
import { Line, PolarArea, Bar, Chart, Pie, Doughnut } from 'vue-chartjs'
import { onMounted, ref, reactive, computed, h } from 'vue'
import type { IJob } from '../../types/backend'
import apiService from '../../services/api.service'
import { useRouter } from 'vue-router'
import { ReloadOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'

// Định nghĩa enum cho đơn vị thời gian
enum StatisticsTimeUnit {
  YEAR = 'year',
  MONTH = 'month',
  WEEK = 'week',
  DAY = 'day'
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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

// Dữ liệu cho biểu đồ công việc theo thời gian
const jobsByTimeData = ref({
  labels: [],
  datasets: [
    {
      label: 'Số lượng công việc theo thời gian',
      backgroundColor: '#f87979',
      borderColor: 'rgb(53, 162, 235)',
      data: []
    }
  ]
})

// Dữ liệu cho biểu đồ công việc theo trình độ
const jobsByLevelData = ref({
  labels: [],
  datasets: [
    {
      label: 'Số lượng công việc theo trình độ',
      backgroundColor: [],
      data: []
    }
  ]
})

// Dữ liệu cho biểu đồ tăng trưởng công ty
const companyGrowthData = ref({
  labels: [],
  datasets: [
    {
      label: 'Số lượng công ty',
      data: [],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
      type: 'bar' as const
    },
    {
      label: 'Tỷ lệ tăng trưởng (%)',
      data: [],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      type: 'line' as const
    }
  ]
})

// Dữ liệu cho biểu đồ đăng ký người dùng theo thời gian
const userRegistrationTimeData = ref({
  labels: [],
  datasets: [
    {
      label: 'Số lượng người dùng đăng ký',
      data: [],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)'
    }
  ]
})

// Dữ liệu cho biểu đồ người dùng theo loại
const userRegistrationTypeData = ref({
  labels: [],
  datasets: [
    {
      label: 'Số lượng người dùng theo loại',
      data: [],
      backgroundColor: ['rgba(54, 162, 235, 0.5)', 'rgba(255, 99, 132, 0.5)']
    }
  ]
})

// Dữ liệu cho biểu đồ nộp hồ sơ ứng tuyển theo thời gian
const resumeSubmissionsTimeData = ref({
  labels: [],
  datasets: [
    {
      label: 'Số lượng hồ sơ nộp',
      data: [],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)'
    }
  ]
})

// Dữ liệu cho biểu đồ hồ sơ theo trạng thái
const resumeSubmissionsStatusData = ref({
  labels: [],
  datasets: [
    {
      label: 'Số lượng hồ sơ theo trạng thái',
      data: [],
      backgroundColor: [
        'rgba(255, 206, 86, 0.5)', // PENDING - Vàng
        'rgba(54, 162, 235, 0.5)', // REVIEWING - Xanh dương
        'rgba(75, 192, 192, 0.5)', // APPROVED - Xanh lá
        'rgba(255, 99, 132, 0.5)' // REJECTED - Đỏ
      ]
    }
  ]
})

// Dữ liệu thống kê doanh thu
const revenueSummary = ref({
  totalRevenue: 0,
  averageRevenue: 0,
  transactionCount: 0
})

// Dữ liệu cho biểu đồ doanh thu theo thời gian
const revenueTimeData = ref({
  labels: [],
  datasets: [
    {
      label: 'Doanh thu theo thời gian',
      data: [],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.5)'
    }
  ]
})

// Dữ liệu cho biểu đồ doanh thu theo loại giao dịch
const revenueTypeData = ref({
  labels: [],
  datasets: [
    {
      label: 'Doanh thu theo loại giao dịch',
      data: [],
      backgroundColor: [
        'rgba(54, 162, 235, 0.5)', // Giao dịch thường
        'rgba(255, 159, 64, 0.5)' // Nâng cấp VIP
      ]
    }
  ]
})

// Định dạng số tiền
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value)
}

// Tính tổng doanh thu định dạng
const formattedTotalRevenue = computed(() => {
  return formatCurrency(revenueSummary.value.totalRevenue)
})

// Tính trung bình doanh thu định dạng
const formattedAverageRevenue = computed(() => {
  return formatCurrency(revenueSummary.value.averageRevenue)
})

const options2 = {
  responsive: true,
  maintainAspectRatio: false
}

// Tùy chọn cho biểu đồ kết hợp (bar và line)
const mixedChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

const columns = [
  {
    title: 'STT',
    key: 'stt'
  },
  {
    title: 'Tên công việc',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Lương',
    dataIndex: 'salary',
    key: 'salary'
  },
  {
    title: 'Số lượng tuyển',
    dataIndex: 'quantity',
    key: 'quantity'
  },
  {
    title: 'Cấp',
    dataIndex: 'level',
    key: 'level'
  },
  {
    title: 'Ngày bắt đầu',
    dataIndex: 'startDate',
    key: 'startDate'
  },
  {
    title: 'Thao tác',
    key: 'action'
  }
]

// Tham số truy vấn cho API thống kê
const statisticsParams = reactive({
  timeUnit: StatisticsTimeUnit.MONTH
})

const router = useRouter()
const tableLoading = ref(false)

// Tải dữ liệu thống kê công việc theo danh mục
const loadJobStatistics = async () => {
  try {
    const res = await apiService.get(
      `statistics/jobs-by-category?timeUnit=${statisticsParams.timeUnit}`
    )
    console.log(res.data)
    if (res && res.data) {
      // Cập nhật dữ liệu biểu đồ công việc theo thời gian
      jobsByTimeData.value = res.data.byTime

      // Cập nhật dữ liệu biểu đồ công việc theo trình độ
      jobsByLevelData.value = res.data.byLevel
    }
  } catch (error) {
    console.log('Lỗi khi tải dữ liệu thống kê công việc:', error)
  }
}

// Tải dữ liệu thống kê tăng trưởng công ty
const loadCompanyGrowthStatistics = async () => {
  try {
    const res = await apiService.get(
      `statistics/company-growth-rate?timeUnit=${statisticsParams.timeUnit}`
    )
    if (res && res.data) {
      companyGrowthData.value = res.data
    }
  } catch (error) {
    console.log('Lỗi khi tải dữ liệu thống kê tăng trưởng công ty:', error)
  }
}

// Tải dữ liệu thống kê đăng ký người dùng
const loadUserRegistrationStatistics = async () => {
  try {
    const res = await apiService.get(
      `statistics/user-registration-stats?timeUnit=${statisticsParams.timeUnit}`
    )
    if (res && res.data) {
      userRegistrationTimeData.value = res.data.byTime
      userRegistrationTypeData.value = res.data.byType
    }
  } catch (error) {
    console.log('Lỗi khi tải dữ liệu thống kê đăng ký người dùng:', error)
  }
}

// Tải dữ liệu thống kê nộp hồ sơ ứng tuyển
const loadResumeSubmissionsStatistics = async () => {
  try {
    const res = await apiService.get(
      `statistics/resume-submissions?timeUnit=${statisticsParams.timeUnit}`
    )
    if (res && res.data) {
      resumeSubmissionsTimeData.value = res.data.byTime
      resumeSubmissionsStatusData.value = res.data.byStatus
    }
  } catch (error) {
    console.log('Lỗi khi tải dữ liệu thống kê nộp hồ sơ ứng tuyển:', error)
  }
}

// Tải dữ liệu thống kê doanh thu
const loadRevenueStatistics = async () => {
  try {
    const res = await apiService.get(`statistics/revenue?timeUnit=${statisticsParams.timeUnit}`)
    if (res && res.data) {
      revenueSummary.value = res.data.summary
      revenueTimeData.value = res.data.byTime
      revenueTypeData.value = res.data.byType
    }
  } catch (error) {
    console.log('Lỗi khi tải dữ liệu thống kê doanh thu:', error)
  }
}
interface ITax {
  year: number
  summary: {
    totalRevenue: number
    totalTax: number
    totalAmountBeforeTax: number
    transactionCount: number
    taxPercentage: number
  }
  quarterlyStats: [
    {
      quarter: string
      totalRevenue: number
      totalTax: number
      totalAmountBeforeTax: number
      transactionCount: number
    }
  ]
  chart: {
    labels: [],
    datasets: [
      {
        label: 'Doanh thu theo quý',
        data: []
      }
    ]
  }
}
const year = ref<Date>()
const dataTax = ref<ITax>({
  year: 2025,
  summary: {
    totalRevenue: 0,
    totalTax: 0,
    totalAmountBeforeTax: 0,
    transactionCount: 0,
    taxPercentage: 0
  },
  quarterlyStats: [
    {
      quarter: '',
      totalRevenue: 0,
      totalTax: 0,
      totalAmountBeforeTax: 0,
      transactionCount: 0
    }
  ],
  chart: {
    labels: [],
    datasets: [
      {
        label: 'Doanh thu theo quý',
        data: []
      }
    ]
  }
})
const loadTaxStatistics = async () => {
  try {
    const selectedYear = year.value ? dayjs(year.value).year() : 2025
    const res = await apiService.get(`statistics/tax?year=${selectedYear}`)
    if (res && res.data) {
      dataTax.value.summary = res.data.summary
      dataTax.value.year = res.data.year
      dataTax.value.quarterlyStats = res.data.quarterlyStats
      dataTax.value.chart = res.data.chart
    }
  } catch (error) {
    console.log('Lỗi khi tải dữ liệu thống kê doanh thu:', error)
  }
}

const loadDataJobNew = async () => {
  tableLoading.value = true
  try {
    const res = await apiService.get(
      `jobs/client?current=1&pageSize=10&sort=-createdAt&isActive=true&endDate=${new Date().toISOString()}`
    )
    dataTable.value = res.data.result
  } catch (error) {
    console.log(error)
  } finally {
    tableLoading.value = false
  }
}

// Thay đổi đơn vị thời gian
const handleTimeUnitChange = async (e: any) => {
  await changeTimeUnit(e.target.value)
}

const changeTimeUnit = async (unit: StatisticsTimeUnit) => {
  statisticsParams.timeUnit = unit
  await loadJobStatistics()
  await loadCompanyGrowthStatistics()
  await loadUserRegistrationStatistics()
  await loadResumeSubmissionsStatistics()
  await loadRevenueStatistics()
}

// Làm mới dữ liệu
const refreshData = async () => {
  await loadTaxStatistics()
  await loadDataJobNew()
  await loadJobStatistics()
  await loadCompanyGrowthStatistics()
  await loadUserRegistrationStatistics()
  await loadResumeSubmissionsStatistics()
  await loadRevenueStatistics()
}

// Xem tất cả công việc
const viewAllJobs = () => {
  router.push('/admin/jobs')
}

// Xem chi tiết công việc
const viewJobDetail = (job: IJob) => {
  router.push(`/job/${job._id}`)
}



const dataTable = ref<IJob[]>([])

const columnsTax = [
  {
    title: 'Quý',
    dataIndex: 'quarter',
    key: 'quarter'
  },
  {
    title: 'Doanh thu',
    dataIndex: 'totalRevenue',
    key: 'totalRevenue'
  },
  {
    title: 'Thuế VAT',
    dataIndex: 'totalTax',
    key: 'totalTax'
  },
  {
    title: 'Doanh thu trừ thuế',
    dataIndex: 'totalAmountBeforeTax',
    key: 'totalAmountBeforeTax'
  },
  {
    title: 'Số lượng giao dịch',
    dataIndex: 'transactionCount',
    key: 'transactionCount'
  }
]
onMounted(async () => {
  await loadTaxStatistics()
  await loadDataJobNew()
  await loadJobStatistics()
  await loadCompanyGrowthStatistics()
  await loadUserRegistrationStatistics()
  await loadResumeSubmissionsStatistics()
  await loadRevenueStatistics()
})
</script>

<template>
  <div class="dashboard-container bg-gray-100 p-6">
    <!-- Header với các thẻ thống kê tổng quan -->
    <a-card class="mb-6 shadow-sm">
      <a-row :gutter="16">
        <a-col :xs="24" :sm="24" :md="24" class="mb-4">
          <label>Thống kê doanh thu theo năm </label>
          <a-date-picker v-model:value="year" picker="year" @change="loadTaxStatistics" />
          <hr class="mt-4" />
        </a-col>

        <a-col :xs="24" :sm="12" :md="6" class="mb-4">
          <a-statistic
            title="Tổng doanh thu"
            :value="dataTax.summary.totalRevenue"
            :value-style="{ color: '#3f8600', fontSize: '24px' }"
            class="text-center"
          >
            <template #prefix>
              <a-icon type="rise" />
            </template>
          </a-statistic>
        </a-col>
        <a-col :xs="24" :sm="12" :md="6" class="mb-4">
          <a-statistic
            title="Tổng doanh thu (Đã trừ VAT)"
            :value="dataTax.summary.totalAmountBeforeTax"
            :value-style="{ color: '#3f8600', fontSize: '24px' }"
            class="text-center"
          >
            <template #prefix>
              <a-icon type="rise" />
            </template>
          </a-statistic>
        </a-col>
        <a-col :xs="24" :sm="12" :md="6" class="mb-4">
          <a-statistic
            title="Tổng thuế VAT"
            :value="dataTax.summary.totalTax"
            :value-style="{ color: '#ff0000', fontSize: '24px' }"
            class="text-center"
          >
    
          </a-statistic>
        </a-col>

        <a-col :xs="24" :sm="12" :md="6" class="mb-4">
          <a-statistic
            title="Tổng số lượng giao dịch"
            :value="dataTax.summary.transactionCount"
            :value-style="{ color: '#1677ff', fontSize: '24px' }"
            class="text-center"
          >

          </a-statistic>
        </a-col>
        
      </a-row>
    </a-card>
    <a-row :gutter="16" class="mb-6">
      <!-- Biểu đồ doanh thu -->
      <a-col :xs="24" :md="12">
        <a-card class="h-full shadow-sm" title="Doanh thu theo quý">
          <a-table :data-source="dataTax.quarterlyStats" :columns="columnsTax">
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.key === 'quarter'">
                {{ record.quarter }}
              </template>
              <template v-else-if="column.key === 'totalRevenue'">
                <div class="text-green-500">
                  {{  formatCurrency(record.totalRevenue) }}
                </div>
                </template>
              <template v-else-if="column.key === 'totalTax'">
                <div class="text-red-500">
                  <a-icon type="fund" />
                  {{  formatCurrency(record.totalTax) }}
                </div>
              </template>
              <template v-else-if="column.key === 'totalAmountBeforeTax'">
                <div class="text-blue-500">
                  {{  formatCurrency(record.totalAmountBeforeTax) }}
                </div>
              </template>
              <template v-else-if="column.key === 'transactionCount'">
                {{ record.transactionCount.toLocaleString('vi-VN') }}
              </template>
            </template>
          </a-table>
        </a-card>
      </a-col>
      <a-col :xs="24" :md="12">
        <a-card class="h-full shadow-sm" title="Biểu đồ doanh thu theo quý">
          <Bar :data="dataTax.chart" :options="options2" class="h-[300px]" />
        </a-card>
      </a-col>
    </a-row>
    <!-- Thanh công cụ với bộ lọc và nút xuất báo cáo -->
    <a-card class="mb-6 shadow-sm">
      <div class="flex flex-wrap items-center justify-between">
        <!-- Bộ chọn đơn vị thời gian -->
        <div class="mb-4 md:mb-0">
          <span class="mr-2 font-medium">Đơn vị thời gian:</span>
          <a-radio-group
            v-model:value="statisticsParams.timeUnit"
            @change="handleTimeUnitChange"
            button-style="solid"
          >
            <a-radio-button :value="StatisticsTimeUnit.DAY">Ngày</a-radio-button>
            <a-radio-button :value="StatisticsTimeUnit.WEEK">Tuần</a-radio-button>
            <a-radio-button :value="StatisticsTimeUnit.MONTH">Tháng</a-radio-button>
            <a-radio-button :value="StatisticsTimeUnit.YEAR">Năm</a-radio-button>
          </a-radio-group>
        </div>

        <!-- Nút xuất báo cáo và làm mới -->
        <div class="flex gap-2">
          <a-button @click="refreshData" :icon="h(ReloadOutlined)"> </a-button>
        </div>
      </div>
    </a-card>

    <!-- Biểu đồ thống kê chính -->
    <a-row :gutter="[16, 16]">
      <!-- Biểu đồ doanh thu -->
      <a-col :xs="24" :md="12">
        <a-card class="h-full shadow-sm" title="Doanh thu theo thời gian">
         
          <Line :data="revenueTimeData" :options="options" class="h-[300px]" />
        </a-card>
      </a-col>

      <a-col :xs="24" :md="12">
        <a-card class="h-full shadow-sm" title="Doanh thu theo loại giao dịch">
          
          <Pie :data="revenueTypeData" :options="options2" class="h-[300px]" />
        </a-card>
      </a-col>

      <!-- Biểu đồ công việc và công ty -->
      <a-col :xs="24" :md="12">
        <a-card class="h-full shadow-sm" title="Công việc theo thời gian">
          <Line :data="jobsByTimeData" :options="options" class="h-[300px]" />
        </a-card>
      </a-col>

      <a-col :xs="24" :md="12">
        <a-card class="h-full shadow-sm" title="Tỷ lệ tăng trưởng công ty">
          <Chart
            type="bar"
            :data="companyGrowthData"
            :options="mixedChartOptions"
            class="h-[300px]"
          />
        </a-card>
      </a-col>

      <!-- Biểu đồ người dùng -->
      <a-col :xs="24" :md="12">
        <a-card class="h-full shadow-sm" title="Đăng ký người dùng theo thời gian">
          <Line :data="userRegistrationTimeData" :options="options" class="h-[300px]" />
        </a-card>
      </a-col>

      <a-col :xs="24" :md="12">
        <a-card class="h-full shadow-sm" title="Người dùng theo loại">
          <Pie :data="userRegistrationTypeData" :options="options2" class="h-[300px]" />
        </a-card>
      </a-col>

      <!-- Biểu đồ hồ sơ ứng tuyển -->
      <a-col :xs="24" :md="12">
        <a-card class="h-full shadow-sm" title="Hồ sơ ứng tuyển theo thời gian">
          <Line :data="resumeSubmissionsTimeData" :options="options" class="h-[300px]" />
        </a-card>
      </a-col>

      <a-col :xs="24" :md="12">
        <a-card class="h-full shadow-sm" title="Hồ sơ theo trạng thái">
          <Doughnut :data="resumeSubmissionsStatusData" :options="options2" class="h-[300px]" />
        </a-card>
      </a-col>

      <!-- Biểu đồ công việc theo trình độ - toàn chiều ngang -->
      <a-col :span="24">
        <a-card class="shadow-sm" title="Công việc theo trình độ">
          <Bar :data="jobsByLevelData" :options="options2" class="h-[300px]" />
        </a-card>
      </a-col>

      <!-- Bảng công việc mới nhất -->
      <a-col :span="24">
        <a-card class="shadow-sm" title="Danh sách công việc mới nhất">
          <template #extra>
            <a-button type="link" @click="viewAllJobs">Xem tất cả</a-button>
          </template>
          <a-table
            :columns="columns"
            :data-source="dataTable"
            :pagination="{ pageSize: 5 }"
            :loading="tableLoading"
          >
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.key === 'stt'">
                {{ index + 1 }}
              </template>
              <template v-else-if="column.key === 'action'">
                <a-button
                  type="link"
                  class="text-red-600 hover:!text-red-400"
                  size="small"
                  @click="viewJobDetail(record)"
                  >Chi tiết</a-button
                >
              </template>
            </template>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped>
.dashboard-container {
  min-height: 100vh;
}

.ant-card {
  border-radius: 8px;
  overflow: hidden;
}

.ant-statistic-title {
  font-size: 16px;
  font-weight: 500;
}
</style>

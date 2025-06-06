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
import { onMounted, ref, reactive, computed } from 'vue'
import type { IJob } from '../../types/backend'
import apiService from '../../services/api.service'

// Định nghĩa enum cho đơn vị thời gian
enum StatisticsTimeUnit {
  YEAR = 'year',
  MONTH = 'month',
  WEEK = 'week',
  DAY = 'day',
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
      backgroundColor: [
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 99, 132, 0.5)'
      ]
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
        'rgba(255, 206, 86, 0.5)',  // PENDING - Vàng
        'rgba(54, 162, 235, 0.5)',  // REVIEWING - Xanh dương
        'rgba(75, 192, 192, 0.5)',  // APPROVED - Xanh lá
        'rgba(255, 99, 132, 0.5)'   // REJECTED - Đỏ
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
        'rgba(54, 162, 235, 0.5)',  // Giao dịch thường
        'rgba(255, 159, 64, 0.5)'   // Nâng cấp VIP
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
  }
]

// Tham số truy vấn cho API thống kê
const statisticsParams = reactive({
  timeUnit: StatisticsTimeUnit.MONTH
})

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
    const res = await apiService.get(
      `statistics/revenue?timeUnit=${statisticsParams.timeUnit}`
    )
    if (res && res.data) {
      revenueSummary.value = res.data.summary
      revenueTimeData.value = res.data.byTime
      revenueTypeData.value = res.data.byType
    }
  } catch (error) {
    console.log('Lỗi khi tải dữ liệu thống kê doanh thu:', error)
  }
}

const loadDataJobNew = async () => {
  try {
    const res = await apiService.get(
      `jobs/client?current=1&pageSize=10&sort=-createdAt&isActive=true&endDate=${new Date().toISOString()}`
    )
    dataTable.value = res.data.result
  } catch (error) {
    console.log(error)
  }
}

// Thay đổi đơn vị thời gian
const changeTimeUnit = async (unit: StatisticsTimeUnit) => {
  statisticsParams.timeUnit = unit
  await loadJobStatistics()
  await loadCompanyGrowthStatistics()
  await loadUserRegistrationStatistics()
  await loadResumeSubmissionsStatistics()
  await loadRevenueStatistics()
}

const dataTable = ref<IJob[]>([])
onMounted(async () => {
  await loadDataJobNew()
  await loadJobStatistics()
  await loadCompanyGrowthStatistics()
  await loadUserRegistrationStatistics()
  await loadResumeSubmissionsStatistics()
  await loadRevenueStatistics()
})
</script>
<template>
  <div style="background: #ececec; padding: 30px">
    <a-row :gutter="16">

      
      <!-- Thống kê tổng quan doanh thu -->
      <a-col :span="8" class="mt-4">
        <a-card>
          <a-statistic
            title="Tổng doanh thu"
            :value="formattedTotalRevenue"
            :value-style="{ color: '#3f8600' }"
          >

          </a-statistic>
        </a-card>
      </a-col>
      
      <a-col :span="8" class="mt-4">
        <a-card>
          <a-statistic
            title="Doanh thu trung bình"
            :value="formattedAverageRevenue"
            :value-style="{ color: '#3f8600' }"
          >
    
          </a-statistic>
        </a-card>
      </a-col>
      
      <a-col :span="8" class="mt-4">
        <a-card>
          <a-statistic
            title="Số lượng giao dịch"
            :value="revenueSummary.transactionCount"
            :value-style="{ color: '#1677ff' }"
          >

          </a-statistic>
        </a-card>
      </a-col>
      
      <!-- Bộ chọn đơn vị thời gian chung -->
      <a-col :span="24" class="mt-4">
        <div class="p-3 bg-white rounded-[8px] mb-4">
          <div class="flex justify-center gap-4">
            <a-button-group>
              <a-button 
                @click="changeTimeUnit(StatisticsTimeUnit.DAY)" 
                :type="statisticsParams.timeUnit === StatisticsTimeUnit.DAY ? 'primary' : 'default'"
              >
                Ngày
              </a-button>
              <a-button 
                @click="changeTimeUnit(StatisticsTimeUnit.WEEK)" 
                :type="statisticsParams.timeUnit === StatisticsTimeUnit.WEEK ? 'primary' : 'default'"
              >
                Tuần
              </a-button>
              <a-button 
                @click="changeTimeUnit(StatisticsTimeUnit.MONTH)" 
                :type="statisticsParams.timeUnit === StatisticsTimeUnit.MONTH ? 'primary' : 'default'"
              >
                Tháng
              </a-button>
              <a-button 
                @click="changeTimeUnit(StatisticsTimeUnit.YEAR)" 
                :type="statisticsParams.timeUnit === StatisticsTimeUnit.YEAR ? 'primary' : 'default'"
              >
                Năm
              </a-button>
            </a-button-group>
          </div>
        </div>
      </a-col>
      
      <a-col :span="12" class="mt-4">
        <div class="p-3 bg-white rounded-[8px]">
          <h2 class="text-xl mb-4">Thống kê doanh thu theo thời gian</h2>
          <Line :data="revenueTimeData" :options="options" class="max-h-[300px]" />
        </div>
      </a-col>
      
      <a-col :span="12" class="mt-4">
        <div class="p-3 bg-white rounded-[8px]">
          <h2 class="text-xl mb-4">Thống kê doanh thu theo loại giao dịch</h2>
          <Pie :data="revenueTypeData" :options="options2" class="max-h-[300px]" />
        </div>
      </a-col>
      
      <a-col :span="12" class="mt-4">
        <div class="p-3 bg-white rounded-[8px]">
          <h2 class="text-xl mb-4">Thống kê công việc theo thời gian</h2>
          <Line :data="jobsByTimeData" :options="options" class="max-h-[300px]" />
        </div>
      </a-col>
      
      <a-col :span="12" class="mt-4">
        <div class="p-3 bg-white rounded-[8px]">
          <h2 class="text-xl mb-4">Thống kê tỷ lệ tăng trưởng công ty</h2>
          <Chart type="bar" :data="companyGrowthData" :options="mixedChartOptions" class="max-h-[300px]" />
        </div>
      </a-col>
      
      <a-col :span="12" class="mt-4">
        <div class="p-3 bg-white rounded-[8px]">
          <h2 class="text-xl mb-4">Thống kê đăng ký người dùng theo thời gian</h2>
          <Line :data="userRegistrationTimeData" :options="options" class="max-h-[300px]" />
        </div>
      </a-col>
      
      <a-col :span="12" class="mt-4">
        <div class="p-3 bg-white rounded-[8px]">
          <h2 class="text-xl mb-4">Thống kê người dùng theo loại</h2>
          <Pie :data="userRegistrationTypeData" :options="options2" class="max-h-[300px]" />
        </div>
      </a-col>
      
      <a-col :span="12" class="mt-4">
        <div class="p-3 bg-white rounded-[8px]">
          <h2 class="text-xl mb-4">Thống kê hồ sơ ứng tuyển theo thời gian</h2>
          <Line :data="resumeSubmissionsTimeData" :options="options" class="max-h-[300px]" />
        </div>
      </a-col>
      
      <a-col :span="12" class="mt-4">
        <div class="p-3 bg-white rounded-[8px]">
          <h2 class="text-xl mb-4">Thống kê hồ sơ theo trạng thái</h2>
          <Doughnut :data="resumeSubmissionsStatusData" :options="options2" class="max-h-[300px]" />
        </div>
      </a-col>
      
      <a-col :span="24" class="mt-4">
        <div class="p-3 bg-white rounded-[8px]">
          <h2 class="text-xl mb-4">Thống kê công việc theo trình độ</h2>
          <Bar :data="jobsByLevelData" :options="options2" class="max-h-[300px]" />
        </div>
      </a-col>
      
     
    </a-row>
  </div>
</template>


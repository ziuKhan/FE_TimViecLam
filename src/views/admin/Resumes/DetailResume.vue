<template>
  <a-drawer
    title="Thông tin chi tiết hồ sơ xin việc"
    :width="750"
    :open="store.openDrawer"
    :footer-style="{ textAlign: 'right' }"
    @close="store.openDrawer = false"
    :maskClosable="false"
  >
    <div class="px-10 py-5">
      <a-row :gutter="16" class="gap-y-2 text-base pb-5">
        <a-col :span="24" class="text-base font-bold"> THÔNG TIN CÁ NHÂN </a-col>
        <a-col :span="12"> Họ và tên: {{ data?.name }} </a-col>
        <a-col :span="12"> Giới tính: {{ data?.gender }} </a-col>
        <a-col :span="24"> Email: {{ store.form.email }} </a-col>
        <a-col :span="24"> Địa chỉ: {{ data?.address }} </a-col>

        <a-col :span="24">
          Link CV:
          <a
            class="text-blue-600 text-[16px]"
            :href="linkUploads('cv/' + store.form.url)"
            target="_blank"
            >{{ store.form.url }}</a
          >
        </a-col>
        <a-col :span="24" class="mt-2 text-base">
          <span class="mr-2">Trạng thái:</span>
          <a-select
            v-model:value="store.form.status"
            class="w-[200px]"
            :disabled="
              store.form.history[2]?.status === 'APPROVED' ||
              store.form.history[2]?.status === 'REJECTED'
            "
          >
            <a-select-option
              selected
              value="PENDING"
              :disabled="store.form.history[0]?.status === 'PENDING'"
            >
              <span class="text-orange-500">ĐANG CHỜ</span>
            </a-select-option>
            <a-select-option
              value="REVIEWING"
              :disabled="store.form.history[1]?.status === 'REVIEWING'"
            >
              <span class="text-blue-500">ĐANG XEM XÉT</span>
            </a-select-option>
            <a-select-option value="APPROVED">
              <span class="text-green-600">ĐÃ DUYỆT</span>
            </a-select-option>
            <a-select-option value="REJECTED">
              <span class="text-red-500">ĐÃ TỪ CHỐI</span>
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :span="24"> Thư giới thiệu: {{ store.form.description }} </a-col>
        <a-col :span="24" class="text-base font-bold mt-5"> THÔNG TIN CÔNG TY </a-col>
        <a-col :span="24"> Tên công ty: {{ store.form.companyId.name }} </a-col>
        <a-col :span="24"> Địa chỉ: {{ store.form.companyId.address.join(', ') }} </a-col>
        <a-col :span="24" class="text-base font-bold mt-5"> THÔNG TIN VIỆC LÀM </a-col>
        <a-col :span="24"> Tên việc làm: {{ store.form.jobId.name }} </a-col>
        <a-col :span="12">
          Kỹ năng:
          <template v-for="(skill, index) in store.form.jobId.skills" :key="index">
            <span class="mr-1"
              >{{ skill.name }}
              <span v-if="index !== store.form.jobId.skills.length - 1">-</span></span
            >
          </template>
        </a-col>
        <a-col :span="12"> Cấp độ: {{ store.form.jobId.level }} </a-col>
        <a-col :span="12">
          Ngày bắt đầu: {{ dayjs(store.form.jobId.startDate).format('DD/MM/YYYY') }}
        </a-col>
        <a-col :span="12">
          Ngày kêt thúc: {{ dayjs(store.form.jobId.endDate).format('DD/MM/YYYY') }}
        </a-col>
        <a-col :span="12" class="text-base font-bold text-red-500">
          Lương: {{ formatSalary(store.form.jobId.salary) }} đ
        </a-col>
        <a-col :span="24" class="text-base font-bold mt-5"> LỊCH SỬ CẬP NHẬT HỒ SƠ </a-col>
        <a-col :span="24">
          <a-table
            :columns="columns"
            :data-source="store.form.history"
            :loading="store.loading"
            :pagination="false"
          >
            <template #bodyCell="{ column, text, index }">
              <template v-if="column.title === 'STT'">
                {{
                  ((store.dataMeta.current || 1) - 1) * (store.dataMeta.pageSize || 6) + index + 1
                }}
              </template>
              <template v-else-if="column.dataIndex === 'updatedAt'">
                {{ dayjs(text).format('DD/MM/YYYY [lúc] HH:mm:ss') }}
              </template>
              <template v-else-if="column.dataIndex === 'status'">
                <span>
                  <a-tag :color="renderColorMethod(text)" class="font-medium">
                    {{ renderStatus(text) }}
                  </a-tag>
                </span>
              </template>
            </template>
          </a-table>
        </a-col>
      </a-row>
    </div>

    <template #footer>
      <a-space>
        <a-button :loading="store.loading" type="primary" @click="store.updateAndAdd()"
          >Cập nhật</a-button
        >
      </a-space>
    </template>
  </a-drawer>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import useResumeStore from '../../../stores/admin/ResumeStore'
import type { IUser } from '../../../types/backend'
import { linkUploads } from '../../../constant/api'
import dayjs from 'dayjs'
import { formatSalary } from '../../../until/until'
import apiService from '../../../services/api.service'

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
const columns = [
  {
    title: 'STT'
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status'
  },
  {
    title: 'Email người cập nhật',
    dataIndex: ['updatedBy', 'email']
  },
  {
    title: 'Ngày cập nhật',
    dataIndex: 'updatedAt'
  }
]
const renderColorMethod = (method: string) => {
  switch (method) {
    case 'PENDING':
      return 'orange' // Màu cam thường biểu thị sự chờ đợi
    case 'REVIEWING':
      return 'blue' // Màu xanh biển thường biểu thị trạng thái đang xử lý hoặc xem xét
    case 'APPROVED':
      return 'green' // Màu xanh lá cây biểu thị sự chấp nhận/thành công
    case 'REJECTED':
      return 'red' // Màu đỏ thường biểu thị sự từ chối hoặc thất bại
    default:
      return 'gray' // Màu xám cho các trạng thái không xác định
  }
}

// Sử dụng Permission Store
const store = useResumeStore()

const data = ref<IUser>()
const getUser = async () => {
  try {
    const res = await apiService.get('users/client/' + store.form.userId)
    if (res) {
      data.value = res.data
    }
  } catch (err) {
    console.log(err)
  }
}

watch(store.form, () => {
  getUser()
})
</script>

<style>
.ant-drawer-header-title button,
.ant-drawer-header .ant-drawer-title {
  color: #232323 !important;
}
</style>

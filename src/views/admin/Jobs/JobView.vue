<script lang="ts" setup>
import { onMounted } from 'vue'
import type { IPaginate } from '../../../types/backend'
import dayjs from 'dayjs'
import usePermissionStore from '../../../stores/admin/PermissionStore'
import UpdateJob from './UpdateJob.vue'
import useJobStore from '../../../stores/admin/JobStore'
import { formatSalary } from '../../../until/until'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons-vue'

const store = useJobStore()

const columns = [
  {
    title: 'STT'
  },
  {
    title: 'Tên',
    dataIndex: 'name'
  },
  {
    title: 'Lương',
    dataIndex: 'salary',
    slots: {
      customRender: 'salary'
    }
  },
  {
    title: 'Số lượng',
    dataIndex: 'quantity'
  },
  {
    title: 'Cấp',
    dataIndex: 'level'
  },
  {
    title: 'Kĩ năng',
    dataIndex: 'skills'
  },
  {
    title: 'Trạng thái',
    dataIndex: 'isActive'
  },
  {
    title: 'Ngày tạo',
    dataIndex: 'createdAt'
  },
  {
    title: 'Thao tác',
    dataIndex: '_id'
  }
]

const handleTableChange = (pagination: IPaginate) => {
  store.dataMeta.current = pagination.current
  store.dataMeta.pageSize = pagination.pageSize
  store.getData()
}

onMounted(() => {
  store.getData()
})
</script>
<template>
  <a-layout-header
    :style="{ background: '#fff', padding: '0 20px' }"
    class="p-0 text-lg font-medium"
  >
    Trang quản lý công việc</a-layout-header
  >
  <a-layout-content style="margin: 0 16px">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>Trang chủ</a-breadcrumb-item>
      <a-breadcrumb-item>Quản lý công việc</a-breadcrumb-item>
    </a-breadcrumb>
    <div class="p-6 bg-white min-h-[360px] rounded-[10px]">
      <div class="flex justify-between">
        <div class="w-3/4 flex" v-permission="'GET /api/v1/jobs'">
          <a-input-search
            class="w-1/2"
            placeholder="Vui lòng nhập thông tin cần tìm kiếm"
            enter-button="Tìm kiếm"
            v-model:value="store.valueSearch"
            @search="store.getData(store.valueSearch)"
          />
          <div class="ml-5 flex items-center">
            <span class="mr-3 font-medium">Trạng thái</span>
            <a-switch v-model:checked="store.isActive" />
          </div>
        </div>

        <button
          class="bg-[#21aa55] hover:bg-green-500 text-white rounded-[7px] px-5 font-medium"
          @click="store.handleOpenModal()"
          v-permission="'POST /api/v1/jobs'"
        >
          Thêm mới
        </button>
      </div>

      <div class="mt-3 border rounded-[10px]">
        <a-table
          :columns="columns"
          :data-source="store.data"
          :loading="store.loading"
          :pagination="store.dataMeta"
          @change="handleTableChange"
          :key="store.data.length"
        >
          <template #bodyCell="{ column, text, index }">
            <template v-if="column.title === 'STT'">
              {{ ((store.dataMeta.current || 1) - 1) * (store.dataMeta.pageSize || 6) + index + 1 }}
            </template>

            <template v-else-if="column.dataIndex === 'isActive'">
              <span :class="text ? 'text-green-600' : 'text-red-500'">
                {{ text ? 'Hoạt động' : 'Không hoạt động' }}
              </span>
            </template>
            <template v-else-if="column.dataIndex === 'skills'">
              <template v-for="(item, index) in text" :key="item">
                {{ item.name }}<span v-if="index < text.length - 1">, </span>
              </template>
            </template>
            <template v-else-if="column.dataIndex === 'createdAt'">
              {{ dayjs(text).format('DD/MM/YYYY [lúc] HH:mm:ss') }}
            </template>

            <template v-else-if="column.dataIndex === '_id'">
              <div class="w-[100px]" v-permission="'PATCH /api/v1/jobs/:id'">
                <button
                  type="button"
                  class="mr-2 bg-[#1669dcec] hover:bg-[#498ff1] rounded-[5px] px-[10px] py-1 h-8"
                  @click="store.getByID(text)"
                  v-permission="'PATCH /api/v1/jobs/:id'"
                >
                  <EditOutlined class="text-white" />
                </button>
                <a-popconfirm
                  title="Bạn có chắc muốn xoá?"
                  ok-text="Có"
                  cancel-text="Không"
                  :loading="store.loading"
                  @confirm="store.deleteByID(text)"
                  v-permission="'DELETE /api/v1/jobs/:id'"
                >
                  <button
                    type="button"
                    class="bg-red-500 hover:bg-red-400 rounded-[5px] px-[10px] ] py-1 h-8"
                  >
                    <DeleteOutlined class="text-white" />
                  </button>
                </a-popconfirm>
              </div>
            </template>
          </template>
          <template #salary="{ record }">
            <span v-if="record.salaryFrom && record.salaryTo">
              {{ formatSalary(record.salaryFrom) }} - {{ formatSalary(record.salaryTo) }}
            </span>
            <span v-else-if="record.salaryFrom"> Từ {{ formatSalary(record.salaryFrom) }}</span>
            <span v-else-if="record.salaryTo"> Đến {{ formatSalary(record.salaryTo) }} </span>
            <span v-else> Thoả thuận </span>
          </template>
        </a-table>
      </div>
    </div>
  </a-layout-content>
  <UpdateJob />
</template>

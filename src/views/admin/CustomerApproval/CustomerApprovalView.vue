<script lang="ts" setup>
import { onMounted, ref, watch, watchEffect } from 'vue'
import type { IPaginate } from '../../../types/backend'
import dayjs from 'dayjs'
import UpdatePermison from './UpdateCustomerApproval.vue'
import usePermissionStore from '../../../stores/admin/PermissionStore'
import { message } from 'ant-design-vue'
import {
  CheckCircleOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  SettingOutlined
} from '@ant-design/icons-vue'
import UpdateCustomerApproval from './UpdateCustomerApproval.vue'
import useCustomerApprovalStore from '../../../stores/admin/CustomerApprovalStore'
import { linkUploads } from '../../../constant/api'
import { checkPermission } from '../../../until/permissionCheck'
import ConfirmCustomerApproval from './ConfirmCustomerApproval.vue'

const store = useCustomerApprovalStore()

const columns = [
  {
    title: 'STT'
  },
  {
    title: 'Họ',
    dataIndex: 'lastName'
  },
  {
    title: 'Tên',
    dataIndex: 'firstName'
  },
  {
    title: 'Email',
    dataIndex: 'email'
  },
  {
    title: 'Số điện thoại',
    dataIndex: 'phoneNumber'
  },
  {
    title: 'Tên công ty',
    dataIndex: 'companyName'
  },
  {
    title: 'Địa chỉ',
    dataIndex: 'address'
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status'
  },
  {
    title: 'Logo',
    dataIndex: 'logo'
  },
  {
    title: 'Ngày gửi',
    dataIndex: 'createdAt'
  },
  {
    title: 'Thao tác',
    dataIndex: '_id',
    width: 150
  }
]

const handleTableChange = (pagination: IPaginate) => {
  store.dataMeta.current = pagination.current
  store.dataMeta.pageSize = pagination.pageSize
  store.getData()
}

const handleSearch = () => {
  store.dataMeta.current = 1
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
    >Trang quản lý kỹ năng</a-layout-header
  >
  <a-layout-content style="margin: 0 16px">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>Trang chủ</a-breadcrumb-item>
      <a-breadcrumb-item>Quản lý kỹ năng</a-breadcrumb-item>
    </a-breadcrumb>
    <div class="p-6 bg-white min-h-[360px] rounded-[10px]">
      <div class="flex justify-between">
        <a-input-search
          v-permission="'GET /api/v1/customer-approval'"
          placeholder="Vui lòng nhập thông tin cần tìm kiếm"
          enter-button="Tìm kiếm"
          v-model:value="store.valueSearch"
          @search="handleSearch"
          class="w-2/3"
        />
        <button
          class="bg-[#21aa55] hover:bg-green-500 text-white rounded-[7px] px-5 font-medium"
          @click="store.handleOpenModal()"
          v-permission="'POST /api/v1/customer-approval'"
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
        >
          <template #bodyCell="{ column, text, index }">
            <template v-if="column.title === 'STT'">
              {{ ((store.dataMeta.current || 1) - 1) * (store.dataMeta.pageSize || 6) + index + 1 }}
            </template>
            <template v-else-if="column.dataIndex === 'createdAt'">
              {{ dayjs(text).format('DD/MM/YYYY [lúc] HH:mm:ss') }}
            </template>
            <template v-else-if="column.dataIndex === 'status'">
              <a-tag :color="text === 'CD' ? 'blue' : text === 'CN' ? 'green' : 'red'">{{
                text === 'CD' ? 'Chờ duyệt' : text === 'CN' ? 'Đã duyệt' : 'Từ chối'
              }}</a-tag>
            </template>
            <template v-else-if="column.dataIndex === 'logo'">
              <img
                :src="linkUploads('company/' + text)"
                alt="Logo"
                class="w-10 h-10 rounded-[5px] object-cover"
              />
            </template>
            <template v-else-if="column.dataIndex === '_id'">
              <button
                type="button"
                class="mr-2 bg-[#17b63aec] hover:bg-[#66df80ec] rounded-[5px] px-[10px] py-1 h-8"
                @click="store.getByID(text, true)"
                v-permission="'PATCH /api/v1/customer-approval/:id'"
              >
                <CheckCircleOutlined class="text-white" />
              </button>
              <button
                type="button"
                class="mr-2 bg-[#1669dcec] hover:bg-[#498ff1] rounded-[5px] px-[10px] py-1 h-8"
                @click="store.getByID(text)"
                v-permission="'PATCH /api/v1/customer-approval/:id'"
              >
                <EditOutlined class="text-white" />
              </button>
              <a-popconfirm
                title="Bạn có chắc muốn xoá?"
                ok-text="Có"
                cancel-text="Không"
                :loading="store.loading"
                @confirm="store.deleteByID(text)"
                v-permission="'DELETE /api/v1/customer-approval/:id'"
              >
                <button
                  type="button"
                  class="bg-red-500 hover:bg-red-400 rounded-[5px] px-[10px] ] py-1 h-8"
                >
                  <DeleteOutlined class="text-white" />
                </button>
              </a-popconfirm>
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </a-layout-content>
  <UpdateCustomerApproval> </UpdateCustomerApproval>
  <ConfirmCustomerApproval> </ConfirmCustomerApproval>
</template>

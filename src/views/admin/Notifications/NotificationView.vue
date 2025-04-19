<script lang="ts" setup>
import { onMounted } from 'vue'
import type { IPaginate } from '../../../types/backend'
import dayjs from 'dayjs'
import UpdateSubscriber from './UpdateNotification.vue'
import UpdateNotification from './UpdateNotification.vue'
import useNotificationStore from '../../../stores/admin/NotificationStore'
import { TYPES_NOTIFICATION_LIST } from '../../../until/until'

const store = useNotificationStore()

const columns = [
  {
    title: 'STT'
  },
  {
    title: 'Tiêu đề',
    dataIndex: 'title'
  },
  {
    title: 'Nội dung',
    dataIndex: 'message'
  },
  {
    title: 'Loại',
    dataIndex: 'type'
  },
  {
    title: 'URL',
    dataIndex: 'url'
  },
  {
    title: 'Số người nhận',
    dataIndex: 'userIds',
    slots: {
      customRender: 'userIds'
    }
  },
  {
    title: 'Ngày tạo',
    dataIndex: 'createdAt'
  },
  {
    title: 'Thao tác',
    dataIndex: '_id',
    width: '150px'
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
    >Trang quản lý thông báo</a-layout-header
  >
  <a-layout-content style="margin: 0 16px">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>Trang chủ</a-breadcrumb-item>
      <a-breadcrumb-item>Quản lý thông báo</a-breadcrumb-item>
    </a-breadcrumb>
    <div class="p-6 bg-white min-h-[360px] rounded-[10px]">
      <div class="flex justify-between">
        <a-input-search
          v-permission="'GET /api/v1/notifications'"
          placeholder="Vui lòng nhập thông tin cần tìm kiếm"
          enter-button="Tìm kiếm"
          v-model:value="store.valueSearch"
          @search="store.getData(store.valueSearch)"
          class="w-2/3"
        />
        <button
          class="bg-[#21aa55] hover:bg-green-500 text-white rounded-[7px] px-5 font-medium"
          @click="store.handleOpenModal()"
          v-permission="'POST /api/v1/notifications'"
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
          :key="store.data?.length"
        >
          <template #bodyCell="{ column, text, index }">
            <template v-if="column.title === 'STT'">
              {{ ((store.dataMeta.current || 1) - 1) * (store.dataMeta.pageSize || 6) + index + 1 }}
            </template>
            <template v-else-if="column.dataIndex === 'createdAt'">
              {{ dayjs(text).format('DD/MM/YYYY [lúc] HH:mm:ss') }}
            </template>
            <template v-else-if="column.dataIndex === 'url'">
              <a-tooltip>
                <template #title>
                  <span>{{ text }}</span>
                </template>
                <a :href="text" target="_blank" class="text-blue-400 hover:text-blue-600"
                  >Đường link</a
                >
              </a-tooltip>
            </template>
            <template v-else-if="column.dataIndex === 'userIds'">
              <span>{{ text?.length || 0 }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'type'">
              <span>{{ TYPES_NOTIFICATION_LIST.find((item) => item.value === text)?.label }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'skills'">
              <template v-for="(item, index) in text" :key="item">
                {{ item }}{{ index !== text.length - 1 ? ', ' : '' }}
              </template>
            </template>

            <template v-else-if="column.dataIndex === '_id'">
              <button
                type="button"
                class="mr-2 bg-[#1669dcec] hover:bg-[#498ff1] rounded-[5px] px-[10px] py-1 h-8"
                @click="store.getByID(text)"
                v-permission="'PATCH /api/v1/notifications/:id'"
              >
                <img
                  loading="lazy"
                  class="h-5/6"
                  src="../../../assets/image/icon/icons8_settings.svg"
                  alt="#"
                />
              </button>
              <a-popconfirm
                title="Bạn có chắc muốn xoá?"
                ok-text="Có"
                cancel-text="Không"
                :loading="store.loading"
                @confirm="store.deleteByID(text)"
                @cancel=""
                v-permission="'DELETE /api/v1/notifications/:id'"
              >
                <button
                  type="button"
                  class="bg-red-500 hover:bg-red-400 rounded-[5px] px-[10px] ] py-1 h-8"
                >
                  <img
                    loading="lazy"
                    class="h-5/6"
                    src="../../../assets/image/icon/icons8_remove.svg"
                    alt="#"
                  />
                </button>
              </a-popconfirm>
            </template>
          </template>
          <template #userIds="{ record }">
            <span>{{ record.isGlobal ? 'Tất cả' : record.userIds?.length || 0 }}</span>
          </template>
        </a-table>
      </div>
    </div>
  </a-layout-content>
  <UpdateNotification />
</template>

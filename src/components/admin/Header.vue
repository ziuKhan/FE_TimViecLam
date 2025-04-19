<template>
  <a-layout-sider v-model:collapsed="collapsed" collapsible>
    <div class="sticky top-5 left-0">
      <div class="logo__itviec w-3/5 mx-auto my-5">
        <RouterLink to="/">
          <img
            loading="lazy"
            src="../../assets/image/icon/logo-itviec.png"
            alt="#"
            class="w-full object-contain"
        /></RouterLink>
      </div>
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <RouterLink to="/admin">
          <a-menu-item key="1">
            <pie-chart-outlined />
            <span>Trang chủ</span>
          </a-menu-item>
        </RouterLink>

        <a-sub-menu key="sub1" v-if="account?.account?.role.name === 'SUPER_ADMIN'">
          <template #title>
            <span>
              <user-outlined />
              <span>Quản lý người dùng</span>
            </span>
          </template>
          <RouterLink to="/admin/user">
            <a-menu-item key="2">
              <span>Tài khoản</span>
            </a-menu-item>
          </RouterLink>
          <RouterLink to="/admin/permission">
            <a-menu-item key="3"> Quyền </a-menu-item>
          </RouterLink>
          <RouterLink to="/admin/role">
            <a-menu-item key="4"> Vai trò </a-menu-item>
          </RouterLink>
        </a-sub-menu>

        <RouterLink
          to="/admin/company"
          v-if="
            coTheQuanLyCongTy &&
            (account?.account?.role.name === 'SUPER_ADMIN' ||
              account?.account?.role.name === 'NORMAL_ADMIN')
          "
        >
          <a-menu-item key="5">
            <span>
              <GoldOutlined />
              <span>Công ty</span>
            </span>
          </a-menu-item>
        </RouterLink>
        <RouterLink to="/admin/resume" v-if="coTheQuanLyHoSo">
          <a-menu-item key="6">
            <span>
              <FileOutlined />
              <span>Hồ sơ ứng tuyển</span>
            </span>
          </a-menu-item>
        </RouterLink>
        <RouterLink to="/admin/skill" v-if="coTheQuanLyKynang">
          <a-menu-item key="7">
            <span> <AimOutlined /> <span>Kỹ năng</span> </span>
          </a-menu-item>
        </RouterLink>
        <RouterLink to="/admin/job" v-if="coTheQuanLyCongViec">
          <a-menu-item key="8">
            <span>
              <ShoppingOutlined />
              <span>Công việc</span>
            </span>
          </a-menu-item>
        </RouterLink>
        <RouterLink
          to="/admin/subscriber"
          v-if="
            account?.account?.role.name === 'SUPER_ADMIN' ||
            account?.account?.role.name === 'NORMAL_ADMIN'
          "
        >
          <a-menu-item key="9">
            <span>
              <MailOutlined />
              <span>Đăng ký nhận mail</span>
            </span>
          </a-menu-item>
        </RouterLink>
        <RouterLink
          to="/admin/notification"
          v-if="
            account?.account?.role.name === 'SUPER_ADMIN' ||
            account?.account?.role.name === 'NORMAL_ADMIN'
          "
        >
          <a-menu-item key="10">
            <span>
              <NotificationOutlined />
              <span>Thông báo</span>
            </span>
          </a-menu-item>
        </RouterLink>
        <RouterLink
          to="/admin/personal_information"
          v-if="account?.account?.role.name === 'HR_USER'"
        >
          <a-menu-item key="11">
            <span>
              <AuditOutlined />
              <span>Công ty</span>
            </span>
          </a-menu-item>
        </RouterLink>
        <a-menu-item key="12" @click="store.logout">
          <span>
            <LogoutOutlined />
            <span>Đăng xuất</span>
          </span>
        </a-menu-item>
      </a-menu>
    </div>
  </a-layout-sider>
</template>

<script setup lang="ts">
import {
  PieChartOutlined,
  DesktopOutlined,
  UserOutlined,
  TeamOutlined,
  FileOutlined,
  GoldOutlined,
  NotificationOutlined,
  ShoppingOutlined,
  MailOutlined,
  AuditOutlined,
  LogoutOutlined,
  AimOutlined
} from '@ant-design/icons-vue'
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { checkPermission } from '../../until/permissionCheck'
import accountService, { type IGetAccount } from '../../services/account.service'
import type { IAccount } from '../../types/backend'
import { useAuthStore } from '../../stores/AuthStore'

const store = useAuthStore()
const collapsed = ref<boolean>(false)
const account = ref<IGetAccount>()
const selectedKeys = ref<string[]>(['1'])
const route = useRoute()
const getAccount = () => {
  account.value = accountService.getAccount()
}

watch(
  () => route.path,
  (newPath) => {
    getAccount()
    switch (newPath) {
      case '/admin/permission':
        selectedKeys.value = ['3']
        break

      case '/admin/user':
        selectedKeys.value = ['2']
        break
      case '/admin/role':
        selectedKeys.value = ['4']
        break
      case '/admin/company':
        selectedKeys.value = ['5']
        break
      case '/admin/resume':
        selectedKeys.value = ['6']
        break
      case '/admin/skill':
        selectedKeys.value = ['7']
        break
      case '/admin/job':
        selectedKeys.value = ['8']
        break
      case '/admin/subscriber':
        selectedKeys.value = ['9']
        break
      case '/admin/notification':
        selectedKeys.value = ['10']
        break
      case '/admin/personal_information':
        selectedKeys.value = ['11']
        break
      default:
        selectedKeys.value = ['1']
        break
    }
  },
  { immediate: true }
)

const coTheQuanLyCongTy = computed(
  () =>
    checkPermission('GET /api/v1/companies/:id') ||
    checkPermission('DELETE /api/v1/companies/:id') ||
    checkPermission('PATCH /api/v1/companies/:id') ||
    checkPermission('POST /api/v1/companies') ||
    checkPermission('GET /api/v1/companies')
)

const coTheQuanLyHoSo = computed(
  () =>
    checkPermission('GET /api/v1/resumes/:id') ||
    checkPermission('DELETE /api/v1/resumes/:id') ||
    checkPermission('PATCH /api/v1/resumes/:id') ||
    checkPermission('POST /api/v1/resumes') ||
    checkPermission('GET /api/v1/resumes')
)
const coTheQuanLyCongViec = computed(
  () =>
    checkPermission('GET /api/v1/jobs/:id') ||
    checkPermission('DELETE /api/v1/jobs/:id') ||
    checkPermission('PATCH /api/v1/jobs/:id') ||
    checkPermission('POST /api/v1/jobs') ||
    checkPermission('GET /api/v1/jobs')
)
const coTheQuanLyKynang = computed(
  () =>
    checkPermission('GET /api/v1/skills/:id') ||
    checkPermission('DELETE /api/v1/skills/:id') ||
    checkPermission('PATCH /api/v1/skills/:id') ||
    checkPermission('POST /api/v1/skills') ||
    checkPermission('GET /api/v1/skills')
)
</script>
<style>
.ant-layout-sider-children,
.ant-menu-root {
  background-color: #0c0c0c !important;
}
.ant-layout-sider-trigger,
.ant-menu-sub {
  background-color: #202020 !important;
}
</style>

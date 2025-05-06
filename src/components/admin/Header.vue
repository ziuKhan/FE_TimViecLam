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
          <a-menu-item :key="menuRoutes.home.key">
            <pie-chart-outlined />
            <span>Trang chủ</span>
          </a-menu-item>
        </RouterLink>

        <a-sub-menu :key="menuRoutes.userManagement.key" v-if="account?.account?.role.name === 'SUPER_ADMIN'">
          <template #title>
            <span>
              <user-outlined />
              <span>Quản lý người dùng</span>
            </span>
          </template>
          <RouterLink to="/admin/user">
            <a-menu-item :key="menuRoutes.user.key">
              <span>Tài khoản</span>
            </a-menu-item>
          </RouterLink>
          <RouterLink to="/admin/permission">
            <a-menu-item :key="menuRoutes.permission.key"> Quyền </a-menu-item>
          </RouterLink>
          <RouterLink to="/admin/role">
            <a-menu-item :key="menuRoutes.role.key"> Vai trò </a-menu-item>
          </RouterLink>
          <RouterLink to="/admin/subscription_package">
            <a-menu-item :key="menuRoutes.subscriptionPackage.key"> Gói dịch vụ </a-menu-item>
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
          <a-menu-item :key="menuRoutes.company.key">
            <span>
              <GoldOutlined />
              <span>Công ty</span>
            </span>
          </a-menu-item>
        </RouterLink>
        <RouterLink
          to="/admin/customer-approval"
          v-if="
            coTheQuanLyKhachHang &&
            (account?.account?.role.name === 'SUPER_ADMIN' ||
              account?.account?.role.name === 'NORMAL_ADMIN')
          "
        >
          <a-menu-item :key="menuRoutes.customerApproval.key">
            <span>
              <GoldOutlined />
              <span>Yêu cầu đăng ký</span>
            </span>
          </a-menu-item>
        </RouterLink>
        <RouterLink to="/admin/resume" v-if="coTheQuanLyHoSo">
          <a-menu-item :key="menuRoutes.resume.key">
            <span>
              <FileOutlined />
              <span>Hồ sơ ứng tuyển</span>
            </span>
          </a-menu-item>
        </RouterLink>
        
        <RouterLink to="/admin/skill" v-if="coTheQuanLyKynang">
          <a-menu-item :key="menuRoutes.skill.key">
            <span> <AimOutlined /> <span>Kỹ năng</span> </span>
          </a-menu-item>
        </RouterLink>
        <RouterLink to="/admin/job" v-if="coTheQuanLyCongViec">
          <a-menu-item :key="menuRoutes.job.key">
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
          <a-menu-item :key="menuRoutes.subscriber.key">
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
          <a-menu-item :key="menuRoutes.notification.key">
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
          <a-menu-item :key="menuRoutes.personalInfo.key">
            <span>
              <AuditOutlined />
              <span>Công ty</span>
            </span>
          </a-menu-item>
        </RouterLink>
        <a-menu-item :key="menuRoutes.logout.key" @click="store.logout">
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
import { computed, ref, watch, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { checkPermission } from '../../until/permissionCheck'
import accountService, { type IGetAccount } from '../../services/account.service'
import type { IAccount } from '../../types/backend'
import { useAuthStore } from '../../stores/AuthStore'
import { useWebSocketStore } from '../../stores/WebSocket'
const storeWebSocket = useWebSocketStore()
const store = useAuthStore()
const collapsed = ref<boolean>(false)
const account = ref<IGetAccount>()
const selectedKeys = ref<string[]>(['admin'])
const route = useRoute()

// Định nghĩa cấu trúc menu routes với key tương ứng
const menuRoutes = {
  home: { path: '/admin', key: 'admin' },
  userManagement: { path: '', key: 'user-management' },
  user: { path: '/admin/user', key: 'admin-user' },
  permission: { path: '/admin/permission', key: 'admin-permission' },
  role: { path: '/admin/role', key: 'admin-role' },
  subscriptionPackage: { path: '/admin/subscription_package', key: 'admin-subscription-package' },
  company: { path: '/admin/company', key: 'admin-company' },
  resume: { path: '/admin/resume', key: 'admin-resume' },
  customerApproval: { path: '/admin/customer-approval', key: 'admin-customer-approval' },
  skill: { path: '/admin/skill', key: 'admin-skill' },
  job: { path: '/admin/job', key: 'admin-job' },
  subscriber: { path: '/admin/subscriber', key: 'admin-subscriber' },
  notification: { path: '/admin/notification', key: 'admin-notification' },
  personalInfo: { path: '/admin/personal_information', key: 'admin-personal-info' },
  logout: { path: '', key: 'logout' }
}

const getAccount = () => {
  account.value = accountService.getAccount()
}

// Cập nhật selectedKeys dựa trên đường dẫn hiện tại
watch(
  () => route.path,
  (newPath) => {
    getAccount()
    
    // Tìm key tương ứng với đường dẫn hiện tại
    const matchedRoute = Object.values(menuRoutes).find(route => route.path === newPath && route.path !== '')
    if (matchedRoute) {
      selectedKeys.value = [matchedRoute.key]
    } else {
      // Mặc định nếu không tìm thấy
      selectedKeys.value = [menuRoutes.home.key]
    }
  },
  { immediate: true }
)

const coTheQuanLyCongTy = computed<boolean>(() => {
  const permissions = [
    'GET /api/v1/companies/:id',
    'DELETE /api/v1/companies/:id',
    'PATCH /api/v1/companies/:id',
    'POST /api/v1/companies',
    'GET /api/v1/companies'
  ]
  return permissions.some(permission => checkPermission(permission))
})

const coTheQuanLyHoSo = computed<boolean>(() => {
  const permissions = [
    'GET /api/v1/resumes/:id',
    'DELETE /api/v1/resumes/:id',
    'PATCH /api/v1/resumes/:id',
    'POST /api/v1/resumes',
    'GET /api/v1/resumes'
  ]
  
  return permissions.some(permission => checkPermission(permission))
})
const coTheQuanLyKhachHang = computed<boolean>(() => {
  const permissions = [
    'GET /api/v1/customer-approval/:id',
    'DELETE /api/v1/customer-approval/:id',
    'PATCH /api/v1/customer-approval/:id',
    'GET /api/v1/customer-approval'
  ]
  return permissions.some(permission => checkPermission(permission))
})
const coTheQuanLyCongViec = computed<boolean>(() => {
  const permissions = [
    'GET /api/v1/jobs/:id',
    'DELETE /api/v1/jobs/:id',
    'PATCH /api/v1/jobs/:id',
    'POST /api/v1/jobs',
    'GET /api/v1/jobs'
  ]

  return permissions.some(permission => checkPermission(permission))
})

const coTheQuanLyKynang = computed<boolean>(() => {
  const permissions = [
    'GET /api/v1/skills/:id',
    'DELETE /api/v1/skills/:id',
    'PATCH /api/v1/skills/:id',
    'POST /api/v1/skills',
    'GET /api/v1/skills'
  ]
  return permissions.some(permission => checkPermission(permission))
});
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

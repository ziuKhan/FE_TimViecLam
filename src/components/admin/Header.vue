<template>
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
        <div class="logo__itviec w-3/5 mx-auto my-5">
            <RouterLink to="/"> <img loading="lazy" src="../../assets/image/icon/logo-itviec.png" alt=""
                    class="w-full object-contain"></RouterLink>
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
                    <a-menu-item key="3">
                        Quyền
                    </a-menu-item>
                </RouterLink>
                <RouterLink to="/admin/role">
                    <a-menu-item key="4">
                        Vai trò
                    </a-menu-item>
                </RouterLink>


            </a-sub-menu>

            <RouterLink to="/admin/company" v-if="coTheQuanLyCongTy">
                <a-menu-item key="5">
                    <GoldOutlined />
                    Công ty
                </a-menu-item>
            </RouterLink>
            <RouterLink to="/admin/resume" v-if="coTheQuanLyHoSo">
                <a-menu-item key="6">
                    <FileOutlined />
                    Hồ sơ ứng tuyển
                </a-menu-item>
            </RouterLink>
            <RouterLink to="/admin/job" v-if="coTheQuanLyCongViec">
                <a-menu-item key="7">
                    <ShoppingOutlined />
                    Công việc
                </a-menu-item>
            </RouterLink>
            <RouterLink to="/admin/subscriber"
                v-if="account?.account?.role.name === 'SUPER_ADMIN' || account?.account?.role.name === 'NORMAL_ADMIN'">
                <a-menu-item key="8">
                    <MailOutlined />
                    Đăng ký nhận mail
                </a-menu-item>
            </RouterLink>
            <RouterLink to="/admin/notification"
                v-if="account?.account?.role.name === 'SUPER_ADMIN' || account?.account?.role.name === 'NORMAL_ADMIN'">
                <a-menu-item key="9">
                    <NotificationOutlined />
                    Thông báo
                </a-menu-item>
            </RouterLink>

            <a-menu-item key="10" @click="store.logout">
                <LogoutOutlined />
                Đăng xuất
            </a-menu-item>
        </a-menu>
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
    LogoutOutlined
} from '@ant-design/icons-vue';
import { computed, ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { checkPermission } from '../../until/permissionCheck';
import accountService, { type IGetAccount } from '../../constant/account.service';
import type { IAccount } from '../../types/backend';
import { useAuthStore } from '../../stores/AuthStore';

const store = useAuthStore();
const collapsed = ref<boolean>(false);
const account = ref<IGetAccount>();
const selectedKeys = ref<string[]>(['1']);
const route = useRoute();
const getAccount = () => {
    account.value = accountService.getAccount()
}


watch(
    () => route.path,
    (newPath) => {
        getAccount()
        switch (newPath) {
            case '/admin/permission':
                selectedKeys.value = ['3'];
                break;

            case '/admin/user':
                selectedKeys.value = ['2'];
                break;
            case '/admin/role':
                selectedKeys.value = ['4'];
                break;
            case '/admin/company':
                selectedKeys.value = ['5'];
                break;
            case '/admin/resume':
                selectedKeys.value = ['6'];
                break;
            case '/admin/job':
                selectedKeys.value = ['7'];
                break;
            case '/admin/subscriber':
                selectedKeys.value = ['8'];
                break;
            case '/admin/notification':
                selectedKeys.value = ['9'];
                break;
            default:
                selectedKeys.value = ['1'];
                break;
        }
    },
    { immediate: true }
);

const coTheQuanLyCongTy = computed(() =>
    checkPermission('GET /api/v1/companies/:id') ||
    checkPermission('DELETE /api/v1/companies/:id') ||
    checkPermission('PATCH /api/v1/companies/:id') ||
    checkPermission('POST /api/v1/companies') ||
    checkPermission('GET /api/v1/companies')
);
const coTheQuanLyHoSo = computed(() =>
    checkPermission('GET /api/v1/resumes/:id') ||
    checkPermission('DELETE /api/v1/resumes/:id') ||
    checkPermission('PATCH /api/v1/resumes/:id') ||
    checkPermission('POST /api/v1/resumes') ||
    checkPermission('GET /api/v1/resumes')
);
const coTheQuanLyCongViec = computed(() =>
    checkPermission('GET /api/v1/jobs/:id') ||
    checkPermission('DELETE /api/v1/jobs/:id') ||
    checkPermission('PATCH /api/v1/jobs/:id') ||
    checkPermission('POST /api/v1/jobs') ||
    checkPermission('GET /api/v1/jobs')
);



</script>
<style scoped></style>
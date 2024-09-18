<template>
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
        <div class="logo__itviec w-3/5 mx-auto my-5">
            <RouterLink to="/admin"> <img src="../../assets/image/icon/logo-itviec.png" alt=""
                    class="w-full object-contain"></RouterLink>
        </div>
        <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
            <RouterLink to="/admin">
                <a-menu-item key="1">
                    <pie-chart-outlined />
                    <span>Trang chủ</span>
                </a-menu-item>
            </RouterLink>


            <a-sub-menu key="sub1">
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
            <RouterLink to="/admin/company">
                <a-menu-item key="5">
                    Công ty
                </a-menu-item>
            </RouterLink>
            <RouterLink to="/admin/resume">
                <a-menu-item key="6">
                    Hồ sơ
                </a-menu-item>
            </RouterLink>
            <RouterLink to="/admin/job">
                <a-menu-item key="7">
                    Công việc
                </a-menu-item>
            </RouterLink>
            <a-sub-menu key="sub2">
                <template #title>
                    <span>
                        <user-outlined />
                        <span>Quản lý nhận Mail</span>
                    </span>
                </template>
                <RouterLink to="/admin/subscriber">
                    <a-menu-item key="8">
                        Người đăng ký
                    </a-menu-item>
                </RouterLink>
            </a-sub-menu>


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
} from '@ant-design/icons-vue';
import { ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

const collapsed = ref<boolean>(false);
const selectedKeys = ref<string[]>(['1']);
const route = useRoute();
watch(
    () => route.path,
    (newPath) => {
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
            default:
                selectedKeys.value = ['1'];
                break;
        }
    },
    { immediate: true }
);


</script>
<style scoped></style>
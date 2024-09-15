<template>
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
        <div class="logo__itviec w-3/5 mx-auto my-5"> <img src="../../assets/image/icon/logo-itviec.png" alt=""
                class="w-full object-contain"> </div>
        <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
            <a-menu-item key="1">
                <pie-chart-outlined />
                <span>Trang chủ</span>
            </a-menu-item>
            <a-menu-item key="2">
                <desktop-outlined />
                <span>Tài khoản</span>
            </a-menu-item>
            <a-sub-menu key="sub1">
                <template #title>
                    <span>
                        <user-outlined />
                        <span>Quản lý tài khoản</span>
                    </span>
                </template>
                <a-menu-item key="3">Phân quyền</a-menu-item>
                <a-menu-item key="4">Quyền</a-menu-item>
            </a-sub-menu>
            <a-sub-menu key="sub2">
                <template #title>
                    <span>
                        <team-outlined />
                        <span>Team</span>
                    </span>
                </template>
                <a-menu-item key="6">Team 1</a-menu-item>
                <a-menu-item key="8">Team 2</a-menu-item>
            </a-sub-menu>
            <a-menu-item key="9">
                <file-outlined />
                <span>File</span>
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
} from '@ant-design/icons-vue';
import { ref } from 'vue';

const collapsed = ref<boolean>(false);
const selectedKeys = ref<string[]>(['1']);
</script>
<style scoped></style>
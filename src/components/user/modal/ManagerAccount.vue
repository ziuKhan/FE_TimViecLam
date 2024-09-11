<template>

    <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="Rải CV">
            <Resume />
        </a-tab-pane>
        <a-tab-pane key="2" tab="Nhận Jobs qua Email" force-render>
            <Subscribers />
        </a-tab-pane>
        <a-tab-pane key="3" tab="Đổi mật khẩu">
            <ChangePassword />
        </a-tab-pane>
    </a-tabs>

</template>

<script setup lang="ts">
import { ref } from 'vue';
import Resume from '../managerAccount/Resume.vue';
import Subscribers from '../managerAccount/Subscribers.vue';
import ChangePassword from '../managerAccount/ChangePassword.vue';
const activeKey = ref('1');
</script>
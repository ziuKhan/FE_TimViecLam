<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useHeaderStore } from '../../../stores/user/headerStore';
import { useAuthStore } from '../../../stores/AuthStore';
import ManagerAccount from '../modal/ManagerAccount.vue';
const openUser = ref<boolean>(false);
const openMenu = ref<boolean>(false);
const open = ref<boolean>(false);
const openNotification = ref<boolean>(false);

const afterOpenChange = (bool: boolean) => {
  console.log('open', bool);
};


const storeAuth = useAuthStore()

const handleLogout = () => {
  storeAuth.logout()
}
</script>


<template>
  <header
    class="theme_blackred w-full max-h-14 m-0 p-0 px-4 py-3 overflow-hidden flex justify-between items-center sticky top-0 z-50">


    <button class="w-8 h-full p-1" @click="openMenu = true"><img class="h-full object-contain"
        src="../../../assets/image/icon/icons8_menu.svg" alt=""></button>

    <RouterLink to="/" class="w-20 absolute left-1/2 transform -translate-x-1/2">
      <img class="h-full w-full object-contain" src="../../../assets/image/icon/logo-itviec.png" alt="">
    </RouterLink>

    <RouterLink v-if="!storeAuth.isAuth" to="/login" class="text-white">Đăng nhập</RouterLink>

    <div v-else class="flex gap-x-1 relative" @click="openUser = true">
      <div class="border border-white rounded-full w-8 h-8">
        <img class="h-full w-full object-contain" src="../../../assets/image/icon/icons8_google.svg" alt="">
      </div>
      <img class="h-9/12" src="../../../assets/image/icon/icons8_chevron_down_1.svg" alt="">
      <span
        class="absolute -top-[7px]  right-10 w-5 h-5 text-[14px] font-medium rounded-full bg-[#c82222] text-white text-xs text-center">
        0
      </span>
    </div>
  </header>


  <a-drawer v-model:open="openMenu" class="custom-class" root-class-name="root-class-name"
    :root-style="{ color: 'white' }" style="color: white ; background:#121212; font-size: 17px; font-weight: 400;"
    width="250" placement="left" @after-open-change="afterOpenChange">
    <div class="flex flex-col">
      <RouterLink to="" class="header__nav_link pl-3 py-4"> Việc làm IT</RouterLink>
      <RouterLink to="" class="header__nav_link pl-3 py-4"> Việc làm IT</RouterLink>
      <RouterLink to="" class="header__nav_link pl-3 py-4"> Việc làm IT</RouterLink>
      <RouterLink to="" class="header__nav_link pl-3 py-4"> Việc làm IT</RouterLink>
    </div>


  </a-drawer>


  <a-drawer v-model:open="openUser" class="custom-class" root-class-name="root-class-name"
    :root-style="{ color: 'white' }" style="color: white ; background:#121212; font-size: 17px; font-weight: 400;"
    width="250" placement="right" @after-open-change="afterOpenChange">

    <div class="flex flex-col">
      <span to="" @click="openNotification = true" class="header__nav_link pl-3 py-4">4 Thông báo</span>
      <span to="" @click="open = true" class="header__nav_link pl-3 py-4"> Hồ sơ và CV</span>

      <a-modal v-model:open="open" width="800px" title="Quản lý tài khoản" :maskClosable=false
        :okButtonProps="{ style: { display: 'none' } }" :cancelButtonProps="{ style: { display: 'none' } }">
        <ManagerAccount />
      </a-modal>

      <RouterLink to="" class="header__nav_link pl-3 py-4"> Việc làm của tôi</RouterLink>
      <span to="" @click="handleLogout()" class="header__nav_link pl-3 py-4"> Đăng xuất</span>

    </div>
  </a-drawer>
  <a-drawer v-model:open="openNotification" class="custom-class" root-class-name="root-class-name"
    :root-style="{ color: 'white' }" style="color: white ; background:#121212; font-size: 17px; font-weight: 400;"
    width="100%" placement="right" @after-open-change="afterOpenChange" title="Thông báo">


  </a-drawer>


</template>



<style>
.ant-drawer-title {
  color: white !important;
}

.ant-drawer-close {
  color: white !important;
}

.ant-drawer-body {
  padding: 0 !important;
}
</style>

<style scoped>
.header__nav_link {
  cursor: pointer;
  width: 100%;
  border-bottom: 1px solid rgb(197, 197, 197);
}
</style>

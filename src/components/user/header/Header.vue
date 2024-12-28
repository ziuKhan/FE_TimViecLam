<script setup lang="ts">
import { ref, onMounted, onUnmounted, watchEffect, onUpdated, inject } from 'vue'
import type { IAccount } from '../../../types/backend'
import { useHeaderStore } from '../../../stores/user/headerStore'
import { refreshApi } from '../../../services/auth.service'
import ManagerAccount from '../modal/ManagerAccount.vue'
import { useAuthStore } from '../../../stores/AuthStore'
import { linkUploads } from '../../../constant/api'
import notificationService from '../../../services/notification.service'
import dayjs from 'dayjs'
import accountService from '../../../constant/account.service'
import { useRoute, useRouter } from 'vue-router'
const isSticky = ref<boolean>(false)
const collapsed = ref<boolean>(false)
const open = ref<boolean>(false)
const openNotification = ref<boolean>(false)
const router = useRouter()
const handleScroll = (): void => {
  const header = document.querySelector('.header')
  if (header) {
    isSticky.value = window.scrollY > 0
    if (isSticky.value) {
      header.classList.add('sticky')
      collapsed.value = true
    } else {
      header.classList.remove('sticky')
      collapsed.value = false
    }
  }
}

const storeAuth = useAuthStore()
const storeHeader = useHeaderStore()
const handleLogout = () => {
  storeAuth.logout()
}
const handleNotification = async (_id: any, url: any) => {
  const res = await notificationService.updateApi({ isRead: true }, _id)
  if (res) {
    router.go(0)
  }
}
const { account, storage } = accountService.getAccount()
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header class="header theme_blackred">
    <div class="header__logo">
      <RouterLink to="/">
        <img loading="lazy" class="logo_itviec" src="../../../assets/image/icon/logo-itviec.png " alt="#" :style="{
          width: collapsed ? '80px' : '108px',
          height: collapsed ? '30px' : '40px'
        }" />
      </RouterLink>
    </div>
    <div class="header__control">
      <nav class="header__nav">
        <RouterLink to="/category" class="header__nav_link">
          Việc Làm IT
          <div class="icon-wrapper">
            <img loading="lazy" class="icon-default" src="../../../assets/image/icon/icons8_chevron_down_1.svg"
              alt="" />
            <img loading="lazy" class="icon-hover" src="../../../assets/image/icon/icons8_chevron_down_white.svg"
              alt="" />
          </div>

          <div class="header__sub">
            <RouterLink class="header__sub_list" to="ad">Việc làm IT theo kĩ năng</RouterLink>
            <RouterLink class="header__sub_list" to="xa">Việc làm IT theo cấp bậc</RouterLink>
            <RouterLink class="header__sub_list" to="ada">Việc làm IT theo công ty</RouterLink>
            <RouterLink class="header__sub_list" to="ada">Việc làm IT theo thành phố</RouterLink>
          </div>
        </RouterLink>
        <RouterLink to="" class="header__nav_link"> Nhà tuyển dụng </RouterLink>
        <RouterLink to="" class="header__nav_link"> Blog </RouterLink>
      </nav>
      <div class="header__user">
        <RouterLink to="/customer/login" class="header__user_link link_distance">Nhà Tuyển Dụng</RouterLink>

        <a-popover v-model:open="openNotification" trigger="click" placement="bottomRight">
          <template #content>
            <div class="max-h-[400px] overflow-auto">
              <template v-for="item in storeHeader.dataNotification" :key="item">
                <div @click="handleNotification(item?._id, item?.url)" :class="[
                  'flex w-full p-[2px] hover:border hover:border-red-500 hover:p-[1px] rounded-lg',
                  !item?.isRead ? 'bg-gray-200' : ''
                ]">
                  <div class="w-1/12 flex justify-center items-center">
                    <img loading="lazy" class="max-w-[40px] max-h-[40px] object-contain rounded-full"
                      :src="linkUploads('user/' + item?.createdBy?._id.avatar)" alt="" />
                  </div>
                  <div class="w-11/12 min-h-20 cursor-pointer p-2">
                    <h3 :class="[
                      'w-full text-base mb-[3px]',
                      !item?.isRead ? 'font-bold' : 'font-semibold'
                    ]">
                      {{ item?.title }}
                    </h3>
                    <p class="mb-1 text-sm">{{ item?.message }}</p>
                    <p class="text-[13px] mb-1 font-[400] text-blue-800">
                      {{ dayjs(item?.createdAt).format('DD/MM/YYYY [lúc] HH:mm') }}
                    </p>
                  </div>
                  <div v-if="!item?.isRead" class="w-7 flex justify-center items-center">
                    <img loading="lazy" class="w-full object-contain" src="../../../assets/image/icon/icons8_new.svg"
                      alt="" />
                  </div>
                </div>
              </template>
              <div class="text-center text-red-500 font-semibold hover:font-bold cursor-pointer p-1"
                @click="storeHeader.changePagination()">
                Xem thêm
              </div>
            </div>
          </template>
          <template #title>
            <span>Thông báo</span>
          </template>
          <span v-if="account" @click="openNotification = true"
            class="header__user_link rounded-full bg-[#f3f3f3f6] p-[5px] relative cursor-pointer">
            <img loading="lazy" src="../../../assets/image/icon/icons8_notification.svg" alt="" class="w-6 h-6" />
            <span v-if="storeHeader.totalNotification > 0"
              class="absolute -top-2 left-5 w-5 h-5 text-[14px] font-medium rounded-full bg-[#c82222] text-white text-xs text-center">
              {{ storeHeader.totalNotification }}
            </span>
          </span>
        </a-popover>

        <RouterLink v-if="!account" to="/login" class="header__user_link link_distance">Đăng Nhập/Đăng ký
        </RouterLink>
        <span v-else to="/login" class="header__user_link link_distance header__nav_link link__user_name">
          <img loading="lazy" class="w-9 h-9 object-contain mr-1 rounded-full border border-solid border-gray-300"
            :src="linkUploads('user/' + account.avatar)" alt="" />
          {{ account.name }}
          <div class="icon-wrapper">
            <img loading="lazy" class="icon-default" src="../../../assets/image/icon/icons8_chevron_down_1.svg"
              alt="" />
            <img loading="lazy" class="icon-hover" src="../../../assets/image/icon/icons8_chevron_down_white.svg"
              alt="" />
          </div>

          <div class="header__sub">
            <span @click="open = true" class="header__sub_list">Quản lý tài khoản</span>
            <a-modal v-model:open="open" width="1000px" title="Quản lý tài khoản" :maskClosable="false"
              :okButtonProps="{ style: { display: 'none' } }" :cancelButtonProps="{ style: { display: 'none' } }">
              <ManagerAccount />
            </a-modal>

            <RouterLink v-if="account?.role?.name !== 'NORMAL_USER'" class="header__sub_list" to="/admin">Quản trị
            </RouterLink>
            <span @click="handleLogout()" class="header__sub_list">Đăng xuất</span>
          </div>
        </span>

        <span class="link_distance">
          <RouterLink to="xa" class="header__user_link">EN</RouterLink>
          <span>|</span>
          <RouterLink to="ad" class="header__user_link">VI</RouterLink>
        </span>
      </div>
    </div>
  </header>
</template>
<style>
.custom-modal .ant-modal-body,
.custom-modal .ant-modal-content {
  padding: 2px !important;
  /* padding-bottom: 2px !important; */
}

.custom-modal .ant-modal-header {
  padding: 20px 20px 0 20px !important;
}
</style>

<style scoped lang="scss">
/* .activeLink {
  color: #ffffff !important;
  font-weight: 600;
} */

.header {
  padding: 0 30px;
  display: flex;
  align-items: center;
  width: 100%;
  height: 88px;
  border-bottom: 0.2px solid rgba(166, 166, 166, 0.216);
  position: sticky;
  top: 0;
  transition: height 0.3s;
  /* Thêm hiệu ứng chuyển tiếp */
  z-index: 999;
}

.header.sticky {
  height: 65px;
  /* Chiều cao khi sticky */
}

.header__logo {
  .logo_itviec {
    margin-right: 30px;
  }
}

.header__control {
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 100%;
}

.header__nav {
  display: flex;
}

.header__nav_link {
  text-decoration: none;
  color: rgb(166, 166, 166);
  font-size: 16px;
  padding: 0 10px;
  font-weight: 400;
  display: flex;
  align-items: center;
  position: relative;
  height: 100%;

  .icon-wrapper {
    position: relative;
    display: inline-block;

    img {
      margin-left: 5px;
    }

    .icon-hover {
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
    }
  }

  &:hover {
    color: white;

    .icon-wrapper {
      .icon-hover {
        opacity: 1;
      }

      .icon-default {
        opacity: 0;
      }
    }

    .header__sub {
      display: block;
    }
  }
}

.header__sub {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #121212;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  flex-direction: column;
}

.header__sub_list {
  display: flex;
  cursor: pointer;
  justify-content: space-between;
  align-items: center;
  min-height: 45px;
  text-decoration: none;
  color: rgb(166, 166, 166);
  padding: 0 16px;
  width: 250px;
  font-size: 14px !important;
  border: 0.2px solid rgba(166, 166, 166, 0.103);

  &:hover {
    background-color: #414042;
    color: white;
  }
}

.header__user {
  display: flex;
  align-items: center;
  color: white;

  .link_distance {
    padding: 0 10px;
  }

  .header__user_link {
    margin: 0 3px;
    color: #ffffff;

    &:hover {
      text-decoration: underline;
    }
  }
}

.link__user_name {
  min-width: 140px;

  .header__sub_list {
    width: 230px;
  }
}

.sub__list_item {
  position: absolute;
  top: 0;
  left: 250px;
}
</style>

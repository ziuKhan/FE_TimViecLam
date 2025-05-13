<script setup lang="ts">
import { ref, onMounted, onUnmounted, watchEffect, onUpdated, inject } from 'vue'
import type { IAccount, INotification } from '../../../types/backend'
import { useHeaderStore } from '../../../stores/user/headerStore'
import { refreshApi } from '../../../services/auth.service'
import ManagerAccount from '../modal/ManagerAccount.vue'
import { useAuthStore } from '../../../stores/AuthStore'
import { linkUploads } from '../../../constant/api'
import notificationService from '../../../services/notification.service'
import dayjs from 'dayjs'
import accountService from '../../../services/account.service'
import { useRoute, useRouter } from 'vue-router'
import { useWebSocketStore } from '../../../stores/WebSocket'
import apiService from '../../../services/api.service'
import Avatar from '../../../assets/image/icon/icons8_notification.svg'
import { DeleteOutlined } from '@ant-design/icons-vue'

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
const storeHeader = useWebSocketStore()

const handleLogout = () => {
  storeAuth.logout()
}

const handleNotification = async (item: INotification) => {
  try {
    const res = await apiService.get(`notifications/markAsRead/${item._id}`)
    if (res) {
      window.open(item.url, '_blank')
      storeHeader.getNotification()
    }
  } catch (error) {
    console.log(error)
  }
}

const handleRemoveNotification = async (item: INotification) => {
    await apiService.delete(`notifications/hide/${item._id}`).then((res) => {
      if(res){
        storeHeader.getNotification()
      }
    }).catch((err) => {
      console.log(err)
    })
      

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
  <header class="header theme_blackred transition-all duration-300">
    <div class="header__logo">
      <RouterLink to="/">
        <img
          loading="lazy"
          class="logo_itviec transition-all duration-300"
          src="../../../assets/image/icon/logo-itviec.png "
          alt="#"
          :style="{
            width: collapsed ? '80px' : '108px',
            height: collapsed ? '30px' : '40px'
          }"
        />
      </RouterLink>
    </div>
    <div class="header__control">
      <nav class="header__nav">
        <RouterLink to="/category" class="header__nav_link">
          Việc Làm IT
          <div class="icon-wrapper">
            <img
              loading="lazy"
              class="icon-default"
              src="../../../assets/image/icon/icons8_chevron_down_1.svg"
              alt="#"
            />
            <img
              loading="lazy"
              class="icon-hover"
              src="../../../assets/image/icon/icons8_chevron_down_white.svg"
              alt="#"
            />
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
        <RouterLink to="/customer" class="header__user_link link_distance" v-if="account?.role?.name === 'NORMAL_USER'"
          >Nhà Tuyển Dụng</RouterLink
        >
        <a-popover v-model:open="openNotification" trigger="click" placement="bottomRight">
          <template #content>
            <div class="max-h-[500px] overflow-auto w-[500px]">
              <template v-for="item in storeHeader.state.notifications" :key="item">
                <div
                 
                  :class="[
                    'flex w-full p-1 hover:shadow-lg transition-all duration-300 rounded-lg mb-1',
                    !item?.isRead ? 'bg-red-50 border-l-4 border-red-500' : 'bg-white'
                  ]"
                >
                  <div class="w-[60px] flex justify-center items-center"  @click="handleNotification(item)">
                    <div class="relative">
                      <img
                        loading="lazy"
                        class="w-[50px] h-[50px] object-cover rounded-full ring-2 ring-white shadow-md"
                        :src="linkUploads('user/' + item?.createdBy?.avatar)"
                        alt="#"
                      />
                      <div v-if="!item?.isRead" class="absolute -top-1 -right-1">
                        <span class="relative flex h-3 w-3">
                          <span
                            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
                          ></span>
                          <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="w-[85%] min-h-20 cursor-pointer p-2"  @click="handleNotification(item)">
                    <div class="flex items-center justify-between">
                      <h3
                        :class="[
                          'w-full text-base mb-1',
                          !item?.isRead ? 'font-bold text-red-800' : 'font-semibold text-gray-800'
                        ]"
                      >
                        {{ item?.title }}
                      </h3>
                      <span v-if="!item?.isRead" class="text-xs text-red-500 font-medium">Mới</span>
                    </div>
                    <p class="mb-2 text-sm text-gray-600">{{ item?.message }}

                   
                    </p>
                    <div class="flex items-center text-xs text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {{ dayjs(item?.createdAt).format('DD/MM/YYYY [lúc] HH:mm') }}
                    </div>
                  </div>
                  <a-popconfirm v-if="item?.isRead"
                            title="Bạn có chắc muốn xoá thông báo này?" 
                            ok-text="Có" 
                            cancel-text="Không"
                            @confirm="handleRemoveNotification(item)"
                        >
                            <button danger class="text-red-500 hover:text-white hover:bg-red-500 rounded-lg text-base p-2">
                                <DeleteOutlined />
                            </button>
                        </a-popconfirm>

                </div>
              </template>
              <div
                v-if="
                  storeHeader.state.paginate &&
                  storeHeader.state.paginate.pages &&
                  storeHeader.state.paginate.current &&
                  storeHeader.state.paginate.pages > storeHeader.state.paginate.current
                "
                class="text-center py-3 border-t border-gray-200"
                @click="storeHeader.changePagination()"
              >
                <button
                  class="inline-flex items-center py-1 text-sm font-medium text-red-600 hover:text-red-800 transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                  Xem thêm thông báo
                </button>
              </div>
            </div>
          </template>
          <template #title>
            <span class="text-lg">Thông báo</span>
          </template>
          <span
            v-if="account"
            @click="openNotification = true"
            class="header__user_link rounded-full bg-[#f3f3f3f6] p-[5px] relative cursor-pointer"
          >
            <a-badge  :count="storeHeader.state.unreadCount">
              <a-avatar size="normal" :src="Avatar" />
            </a-badge>
          </span>
        </a-popover>

        <RouterLink v-if="!account" to="/login" class="header__user_link link_distance"
          >Đăng Nhập/Đăng ký
        </RouterLink>
        <span
          v-else
          to="/login"
          class="header__user_link link_distance header__nav_link link__user_name"
        >
          <img
            loading="lazy"
            class="w-9 h-9 object-contain mr-1 rounded-full border border-solid border-gray-300"
            :src="linkUploads('user/' + account.avatar)"
            alt="#"
          />
          {{ account.name }}
          <div class="icon-wrapper">
            <img
              loading="lazy"
               alt="#"
              class="icon-default"
              src="../../../assets/image/icon/icons8_chevron_down_1.svg"
             
            />
            <img
              loading="lazy"
              class="icon-hover"
              src="../../../assets/image/icon/icons8_chevron_down_white.svg"
              alt="#"
            />
          </div>

          <div class="header__sub">
            <span @click="open = true" class="header__sub_list">Quản lý tài khoản</span>
            <a-modal
              v-model:open="open"
              width="1200px"
              title="Quản lý tài khoản"
              :maskClosable="false"
              :okButtonProps="{ style: { display: 'none' } }"
              :cancelButtonProps="{ style: { display: 'none' } }"
            >
              <ManagerAccount />
            </a-modal>

            <RouterLink
              v-if="account?.role?.name !== 'NORMAL_USER'"
              class="header__sub_list"
              to="/admin"
              >Quản trị
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
      visibility: visible;
      pointer-events: auto;
      opacity: 1;
      transform: translateY(0);
    }
  }
}

.header__sub {
  display: block;
  visibility: hidden;
  pointer-events: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #121212;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  flex-direction: column;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
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
  transition: all 0.2s ease;

  &:hover {
    background-color: #414042;
    color: white;
    transform: translateX(5px);
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
../../../services/account.service

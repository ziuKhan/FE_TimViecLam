import { defineStore } from 'pinia'
import { computed, onMounted, ref } from 'vue'

import { message } from 'ant-design-vue'
import { accountApi, logoutApi, refreshApi } from '../services/auth.service'
import type { IUser } from '../types/backend'
import tokenService from '../constant/token.service'
import accountService from '../constant/account.service'

export const useAuthStore = defineStore('auth', () => {
 

  const logout = async () => {
    try {
      await logoutApi()
      tokenService.removeToken()
      accountService.removeAccount()
      window.location.reload()
    } catch (error) {
      console.error('Đăng xuất thất bại:', error)
      // Tùy chọn: bạn vẫn có thể xóa token và tải lại trang ngay cả khi cuộc gọi API thất bại
      tokenService.removeToken()
      accountService.removeAccount()
      window.location.reload()
    }
  }

  const refreshToken = async () => {
    try {
      const res = await refreshApi();
      debugger
      if (res.success) {
        const { access_token } = res.data;
        tokenService.updateToken(access_token);
        accountService.updateAccount();
        return access_token;
      }
      return false;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  }

  return { logout, refreshToken }
})

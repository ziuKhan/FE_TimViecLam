import { defineStore } from 'pinia'
import { computed, onMounted, ref } from 'vue'

import { message } from 'ant-design-vue'
import { accountApi, logoutApi, refreshApi } from '../services/auth.service'
import type { IUser } from '../types/backend'
import tokenService from '../services/token.service'
import accountService from '../services/account.service'
import apiService from '../services/api.service'
import { ConsoleSqlOutlined } from '@ant-design/icons-vue'

export const useAuthStore = defineStore('auth', () => {
  const logout = async () => {
    try {
      await logoutApi()
      tokenService.removeToken()
      accountService.removeAccount()
      window.location.reload()
    } catch (error) {
      console.error('Đăng xuất thất bại:', error)
      tokenService.removeToken()
      accountService.removeAccount()
      window.location.reload()
    }
  }

  const refreshToken = async () => {
    try {
      if (!tokenService.getToken().storage) {
        return
      }
      const res = await apiService.get(`auth/refresh`)
      if (res.data) {
        const { access_token } = res.data
        tokenService.updateToken(access_token)
        return access_token
      }
    } catch (error: any) {
      if (error.response.data.message === 'LOGOUT') {
        tokenService.removeToken()
        accountService.removeAccount()
        window.location.reload()
        alert('Vui lòng đăng nhập lại!')

      }
    }
  }

  return { logout, refreshToken }
})

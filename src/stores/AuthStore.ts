import { defineStore } from 'pinia'
import { computed, onMounted, ref } from 'vue'

import { message } from 'ant-design-vue'
import { accountApi, logoutApi } from '../services/auth.service'
import type { IUser } from '../types/backend'
import tokenService from '../constant/token.service'
import accountService from '../constant/account.service'

export const useAuthStore = defineStore('auth', () => {
 

  const logout = async () => {
    const res: any = await logoutApi()
    if (res.data === 'OK') {
      tokenService.removeToken()
      accountService.removeAccount()
      window.location.reload()
      await message.success(res.message)
    }
  }


  return { logout}
})

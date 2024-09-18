import { defineStore } from 'pinia'
import { computed, onMounted, ref } from 'vue'

import { message } from 'ant-design-vue'
import { accountApi, logoutApi } from '../services/auth.service'
import type { IUser } from '../types/backend'
import tokenService from '../constant/token.service'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<IUser | null>()

  const getUser = async () => {
    debugger
    const token = tokenService.getToken()?.token
    if (token && !user.value) {
      try {
        const res = await accountApi()
        if (res?.data) {
          user.value = res.data
        }
      } catch (e) {
        console.log(e)
      }
    }
  }

  const isAuth = computed<boolean>(() => {
    return !!user.value
  })

  const logout = async () => {
    const res: any = await logoutApi()
    if (res.data === 'OK') {
      tokenService.removeToken()
      user.value = null
      window.location.reload()
      await message.success(res.message)
    }
  }

  onMounted(async () => {
    await getUser()
  })

  return { logout, isAuth, user, getUser }
})

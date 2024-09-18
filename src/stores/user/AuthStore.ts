import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { accountApi, logoutApi } from '../../services/auth.service'
import type { IUser } from '../../types/backend'
import tokenService from '../../constant/token.service'

export const useAuthStore = defineStore('auth', () => {
  const isAuth = ref(false)
  const user = ref<IUser>()

  const getUser = async () => {
    const use = await accountApi()
    if (!use?.data) {
      isAuth.value = false
    } else {
      user.value = use.data
      isAuth.value = true
    }
  }

  const logout = async () => {
    const res: any = await logoutApi()
    if (res.data === 'OK') {
      tokenService.removeToken()
      user.value = undefined
      statusIsAuth()
      window.location.reload()
      await message.success(res.message)
    }
  }

  const statusIsAuth = () => {
    const token = tokenService.getToken()?.token
    if (!token) {
      return (isAuth.value = false)
    }
    return (isAuth.value = true)
  }

  watch(
    () => isAuth.value,
    () => {
      statusIsAuth()
      if (isAuth.value) {
        getUser()
      }
    },
    { immediate: true }
  )

  return { isAuth, user, statusIsAuth, logout }
})

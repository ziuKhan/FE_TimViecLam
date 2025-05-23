import { defineStore } from 'pinia'
import { computed, onBeforeMount, onMounted, ref } from 'vue'

import { message } from 'ant-design-vue'
import { accountApi, logoutApi, refreshApi } from '../services/auth.service'
import type { IPermission, IUser } from '../types/backend'
import tokenService from '../services/token.service'
import accountService from '../services/account.service'
import apiService from '../services/api.service'
import { ConsoleSqlOutlined } from '@ant-design/icons-vue'

export const useAuthStore = defineStore('auth', () => {
  // Biến để theo dõi promise refreshToken đang chạy
  let refreshTokenPromise: Promise<string | undefined> | null = null
  const permission = ref<IPermission[]>([])

  // Thêm biến theo dõi trạng thái tải quyền
  const isLoadingPermission = ref(false)
  const isPermissionLoaded = ref(false)

  onBeforeMount(async () => {
    await getPermission()
  })

  const getPermission = async (forceReload = false) => {
    if (!tokenService.getToken().storage) {
      return
    }

    // Kiểm tra nếu đang tải
    if (isLoadingPermission.value) {
      return
    }

    // Nếu không phải force reload và đã tải xong và có quyền, không tải lại
    if (!forceReload && isPermissionLoaded.value && permission.value.length > 0) {
      return
    }

    isLoadingPermission.value = true

    try {
      const res = await apiService.get('auth/permission')
      permission.value = res.data
      isPermissionLoaded.value = true
    } catch (error) {
      console.error('Lấy quyền thất bại:', error)
    } finally {
      isLoadingPermission.value = false
    }
  }

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
    // Nếu đã có một promise đang chạy, trả về promise đó
    if (refreshTokenPromise) {
      return refreshTokenPromise
    }
    // Tạo một promise mới và lưu vào biến
    refreshTokenPromise = new Promise((resolve, reject) => {
      if (!tokenService.getToken().storage) {
        refreshTokenPromise = null
        resolve(undefined)
        return
      }

      apiService
        .get(`auth/refresh`)
        .then((res) => {
          if (res.data) {
            const { access_token } = res.data
            tokenService.updateToken(access_token)
            refreshTokenPromise = null
            resolve(access_token)
            return access_token
          }
          refreshTokenPromise = null
          resolve(undefined)
        })
        .catch((error) => {
          refreshTokenPromise = null
          if (error.response?.data?.message === 'LOGOUT') {
            tokenService.removeToken()
            accountService.removeAccount()
            window.location.reload()
            alert('Vui lòng đăng nhập lại!')
          }
          reject(error)
        })
    })

    return refreshTokenPromise
  }

  // Thêm phương thức kiểm tra quyền trực tiếp trong store
  const hasPermission = (requiredPermission: string): boolean => {
    if (!permission.value || permission.value.length === 0) {
      // Kích hoạt tải quyền nếu chưa có
      getPermission()
      return false
    }

    const [method, apiPath] = requiredPermission.split(' ')
    return permission.value.some((p) => p.apiPath === apiPath && p.method === method)
  }

  return {
    permission,
    getPermission,
    logout,
    refreshToken,
    hasPermission,
    isLoadingPermission,
    isPermissionLoaded
  }
})

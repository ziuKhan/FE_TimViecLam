import { defineStore } from 'pinia'
import { onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
import { useAuthStore } from './AuthStore'
import type { IUser } from '../../types/backend'

export const useHeaderStore = defineStore('header', () => {
  const storeAuth = useAuthStore()

  const isShowHeader = ref(false)

  const userFromLocalStorage = localStorage.getItem('user')
  const local = ref<IUser | null>(userFromLocalStorage ? JSON.parse(userFromLocalStorage) : null)

  return {
    isShowHeader,
    local
  }
})

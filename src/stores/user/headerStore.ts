import { defineStore } from 'pinia'
import { onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
import { useAuthStore } from './AuthStore'
import type { IUser } from '../../types/backend'

export const useHeaderStore = defineStore('header', () => {


  return {
  }
})

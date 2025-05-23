import { defineStore } from 'pinia'
import { onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
import type { INotification, IUser } from '../../types/backend'
import { io, Socket } from 'socket.io-client'
import notificationService from '../../services/notification.service'
import accountService from '../../services/account.service'

export const useHeaderStore = defineStore('header', () => {
  const dataNotification = ref<INotification[]>()
  const totalNotification = ref<number>(0)

  const { account } = accountService.getAccount()

  const meta = ref({
    current: 1,
    pageSize: 100,
    pages: 1,
    total: 5
  })

  const changePagination = () => {
    meta.value.pageSize += 20
  }

  return { dataNotification, totalNotification, changePagination }
})

import { defineStore } from 'pinia'
import { onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
import type { INotification, IUser } from '../../types/backend'
import { io, Socket } from 'socket.io-client'
import notificationService from '../../services/notification.service'
import accountService from '../../constant/account.service'

export const useHeaderStore = defineStore('header', () => {
  const dataNotification = ref<INotification[]>()
  const totalNotification = ref<number>(0)
  const socket = ref<Socket | null>(null)

  const { account } = accountService.getAccount()
  socket.value = io(import.meta.env.VITE_API_URL + '/notifications', {
    query: { userId: account?._id }
  })

  socket.value.on('notification', async () => {
    await getData()
  })
  const getData = async () => {
    const { account } = accountService.getAccount()
    if (!account || !account._id) return

    const [res, number] = await Promise.all([
      notificationService.paginateApi(`?current=1&pageSize=100&sort=-createdAt`),
      notificationService.paginateApi(`?current=1&pageSize=100&isRead=false`)
    ])

    const filterNotifications = (items: INotification[]) =>
      items.filter(item => item.type === 'SYSTEM' || item.userId === account._id)

    if (res) {
      dataNotification.value = filterNotifications(res.result)
      totalNotification.value = filterNotifications(number.result).length
    }
  }

  onMounted(async () => {
    await getData()
  })

  onBeforeUnmount(() => {
    if (socket.value) {
      socket.value.disconnect()
    }
  })

  return { dataNotification, totalNotification }
})
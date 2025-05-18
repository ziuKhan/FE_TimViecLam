import { defineStore } from 'pinia'
import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'
import { onBeforeUnmount, reactive, ref } from 'vue'
import apiService from '../services/api.service'
import accountService from '../services/account.service'
import type { INotification, IPaginate } from '../types/backend'
import { useAuthStore } from './AuthStore'

interface IState {
  notifications: INotification[]
  paginate: IPaginate
  unreadCount: number
}

export const useWebSocketStore = defineStore('webSocket', () => {
  const state = reactive<IState>({
    notifications: [],
    paginate: {
      current: 1,
      pageSize: 20,
      total: 0
    },
    unreadCount: 0
  })
  const socket = ref<Socket | null>(null)
  const storeAuth = useAuthStore()

  const { account } = accountService.getAccount()

  const getNotification = async (): Promise<void> => {
    try {
      const res = await apiService.get(
        `notifications?page=${state.paginate.current}&pageSize=${state.paginate.pageSize}&filter=sort=-createdAt`
      )

      state.notifications = res.data.items
      state.paginate.total = res.data.total
      state.paginate.pages = res.data.pages
      state.paginate.current = res.data.current
      state.unreadCount = res.data.unreadCount
    } catch (error) {
      console.error('Lấy thông báo thất bại:', error)
    }
  }

  // Khởi tạo kết nối socket
  const initSocket = () => {
    if (!socket.value && account?._id) {
      try {
        socket.value = io(import.meta.env.VITE_API_URL + '/websockets', {
          query: { userId: account._id }
        })

        socket.value.on('connect', async () => {
          await getNotification()
        })

        socket.value.on('connect_error', (error: Error) => {
          console.error('Kết nối socket thất bại:', error)
        })

        socket.value.on('notification', async () => {
          await getNotification()
        })

        socket.value.on('permission', async () => {
          await storeAuth.getPermission(true)
        })
      } catch (error) {
        console.error('Lỗi khởi tạo socket:', error)
      }
    }
    return socket.value !== null
  }

  // Nếu account tồn tại, khởi tạo kết nối
  if (account?._id) {
    initSocket()
  }

  // Đăng ký lắng nghe sự kiện
  const on = (event: string, callback: (...args: any[]) => void) => {
    if (socket.value) {
      socket.value.on(event, callback)
    }
  }

  // Hủy đăng ký lắng nghe sự kiện
  const off = (event: string) => {
    if (socket.value) {
      socket.value.off(event)
    }
  }

  // Gửi sự kiện
  const emit = (event: string, data: any) => {
    if (socket.value) {
      socket.value.emit(event, data)
    }
  }

  const changePagination = () => {
    state.paginate.pageSize = (state.paginate.pageSize || 10) + 20
  }

  // Hủy kết nối socket khi component unmount
  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
    }
  }

  onBeforeUnmount(() => {
    disconnect()
  })

  return { 
    state, 
    getNotification, 
    changePagination,
    on,
    off,
    emit,
    initSocket,
    disconnect
  }
})

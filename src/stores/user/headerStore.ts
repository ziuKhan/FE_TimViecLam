import { defineStore } from 'pinia'
import { onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
import { useAuthStore } from '../AuthStore'
import type { INotification,  IUser } from '../../types/backend'
import { io } from 'socket.io-client'
import notificationService from '../../services/notification.service'

export const useHeaderStore = defineStore('header', () => {

  const dataNotification = ref<INotification[]>()
  const totalNotification = ref<number>(0)
  const socket = io(import.meta.env.VITE_API_URL+'/notifications');

  const AuthStore = useAuthStore()

  const getData = async () => {
    debugger
    const user = await AuthStore.fetchUser();

    if (!user || !user._id) return; 
    debugger
    const [res,number] = await Promise.all([notificationService.paginateApi(`?current=1&pageSize=10&userId=${user._id}`), notificationService.paginateApi(`?current=1&pageSize=10&userId=${AuthStore.user?._id}&isRead=false`)]);
  
    if (res) {
      dataNotification.value = res.result
      totalNotification.value = number.result.length
    }
  }
  
  socket.on('notification', async (notification) => {
    getData();
  });

  onMounted(async () => {
    getData()
  })

  return {dataNotification,totalNotification }
})

import { defineStore } from 'pinia'
import { onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
import type { INotification,  IUser } from '../../types/backend'
import { io } from 'socket.io-client'
import notificationService from '../../services/notification.service'
import accountService from '../../constant/account.service'

export const useHeaderStore = defineStore('header', () => {

  const dataNotification = ref<INotification[]>()
  const totalNotification = ref<number>(0)
  const socket = io(import.meta.env.VITE_API_URL+'/notifications');


  const getData = async () => {
    const {account} = accountService.getAccount();
    if (!account || !account._id) return; 
    const [res,number] = await Promise.all([notificationService.paginateApi(`?current=1&pageSize=10&sort=-createdAt`), notificationService.paginateApi(`?current=1&pageSize=10&isRead=false`)]);
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

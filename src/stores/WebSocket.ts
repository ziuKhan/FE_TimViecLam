import { defineStore } from 'pinia';
import { io, Socket } from 'socket.io-client'
import { onBeforeUnmount, reactive, ref } from 'vue';
import apiService from '../services/api.service';
import accountService from '../services/account.service';
import type { INotification, IPaginate } from '../types/backend';


interface IState {
    notifications: INotification[];
    paginate: IPaginate;
    unreadCount: number;
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
    });
  const socket = ref<Socket|null>(null)


    const { account } = accountService.getAccount();

    const getNotification = async (): Promise<void> => {
        try {
            const res = await apiService.get(`notifications?page=${state.paginate.current}&pageSize=${state.paginate.pageSize}&filter=sort=-createdAt`);
            
            state.notifications = res.data.items;
            state.paginate.total = res.data.total;
            state.paginate.pages = res.data.pages;
            state.paginate.current = res.data.current;
            state.unreadCount = res.data.unreadCount;
        } catch (error) {
            console.error('Lấy thông báo thất bại:', error);
        }
    };
    if (account?._id) {
        socket.value = io(import.meta.env.VITE_API_URL + '/websockets', {
            query: { userId: account._id }
        });

        socket.value.on('connect', async () => {
            await getNotification();
        });

        socket.value.on('connect_error', (error: Error) => {
            console.error('Kết nối socket thất bại:', error);
        });

        socket.value.on('notification', async () => {
            await getNotification();
        });
    }
    const changePagination = () => {
        state.paginate.pageSize = (state.paginate.pageSize || 10) + 20;
    }
    
    onBeforeUnmount(() => {
        if (socket.value) {
            socket.value.disconnect();
        }
    });

    return { state, getNotification, changePagination };
});

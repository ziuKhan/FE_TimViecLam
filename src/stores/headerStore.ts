import { defineStore } from "pinia"
import { onBeforeUnmount, onMounted, ref, watchEffect } from "vue"
import type { IUser } from "../types/backend";

export const useHeaderStore = defineStore('header', () => {
    const isShowHeader = ref(false);

    const userFromLocalStorage = localStorage.getItem('user');
    const local = ref<IUser | null>(userFromLocalStorage ? JSON.parse(userFromLocalStorage) : null);

    const toggleHeader = (value: boolean) => {
        isShowHeader.value = value;
    };

    const updateLocal = (data: any) => {
        local.value = data;
        localStorage.setItem('user', JSON.stringify(data));
        toggleHeader(true); // Hiển thị header khi có user đăng nhập
    };

    const logout = () => {
        local.value = null;
        localStorage.removeItem('user');
        toggleHeader(false); // Ẩn header khi logout
    };

    return {
        isShowHeader,
        toggleHeader,
        local,
        updateLocal,
        logout
    };
});

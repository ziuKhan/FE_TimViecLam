import { defineStore } from "pinia"
import { onBeforeUnmount, onMounted, ref, watchEffect } from "vue"
import type { IUser } from "../types/backend";
import { useAuthStore } from "./AuthStore";

export const useHeaderStore = defineStore('header', () => {

    const storeAuth = useAuthStore();

    const isShowHeader = ref(false);

    const userFromLocalStorage = localStorage.getItem('user');
    const local = ref<IUser | null>(userFromLocalStorage ? JSON.parse(userFromLocalStorage) : null);

    return {
        isShowHeader,
        local,
    };
});

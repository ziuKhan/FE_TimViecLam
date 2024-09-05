import { defineStore } from "pinia";
import { ref, watch } from "vue";
import type { IAccount, IUser } from "../types/backend";
import { accountApi, accountApi2, logoutApi } from "../services/auth.service";
import { message } from 'ant-design-vue';


export const useAuthStore = defineStore('auth', () => {
    const isAuth = ref(false);
    const user = ref<IUser>()
    
    const checkAuthBearer = () => {
        const token = localStorage.getItem('access_token');
        if (token) {
            isAuth.value = true;
        }
    }

    const getUser = async () => {
        const use = await accountApi2()
        if(!use?.data) {
            isAuth.value = false
            return
        } else{
            user.value = use.data
            isAuth.value = true
        }
    }
    const logout = async () => {
        const data:any = await logoutApi();
        if(data) {
           await localStorage.removeItem('access_token');
           await message.success(data.message);
            user.value = undefined;
            statusIsAuth();
        }
    };
    
    const statusIsAuth = () => {
        isAuth.value = !isAuth.value
    }

    watch(() => isAuth.value, () => {
            getUser()
    }, { immediate: true })

    return { isAuth, user, checkAuthBearer, statusIsAuth , logout };
})
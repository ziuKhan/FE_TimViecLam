import { defineStore } from "pinia";
import { ref, watch } from "vue";
import type { IAccount, IUser } from "../types/backend";
import { accountApi, accountApi2, logoutApi } from "../services/auth.service";
import { message } from 'ant-design-vue';
import { useRouter } from "vue-router";


export const useAuthStore = defineStore('auth', () => {
    const isAuth = ref(false);
    const user = ref<IUser>()
    const router = useRouter();

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
        debugger
        const res:any = await logoutApi();
        if(res.data === 'OK') {
            await localStorage.removeItem('access_token');
            user.value = undefined;
           statusIsAuth();
           await message.success(res.message);
           router.push('#')
        }
    };

    const statusIsAuth = () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            return isAuth.value = false
        }
        return isAuth.value = !isAuth.value

    }

    watch(() => isAuth.value, () => {
        
            getUser()
    }, { immediate: true })

    return { isAuth, user, statusIsAuth , logout };
})
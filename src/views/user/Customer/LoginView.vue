<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import Loading from '../../../components/Loading.vue';
import { useRoute, useRouter } from 'vue-router';
import { loginApi } from '../../../services/auth.service';
import { notification } from 'ant-design-vue';
import tokenService from '../../../constant/token.service';

const load = ref<boolean>(true)
interface IFormState {
    username: string
    password: string
    remember: boolean
}


const formState = reactive<IFormState>({
    username: '',
    password: '',
    remember: true
})



const loading = ref<boolean>(false)
const openNotificationWithIcon = () => {
    notification['success']({
        message: 'Thông báo',
        description: 'Đăng nhập thành công.'
    })
}
const router = useRouter()
const route = useRoute()

const onFinish = async (values: IFormState) => {
    try {
        const { username, password } = values
        loading.value = true
        const response = await loginApi(username, password)
        if (response.data) {
            const { access_token } = response.data
            tokenService.createToken(access_token, formState.remember)
            openNotificationWithIcon()
            router.push({ path: '/' })
            window.location.reload();
        }
        loading.value = false
    } catch (error) {
        loading.value = false
        console.error('Lỗi do try catch bắt:', error)
    }
}

</script>

<template>

    <Loading v-if="!load"></Loading>
    <div v-else>
        <div class="flex">
            <div class="w-1/2 theme_blackred hidden lg:block"> <img loading="lazy"
                    src="../../../assets/image/company/logo_login_customer.png" alt="">
            </div>
            <div class="w-full lg:w-1/2 ">
                <div class="w-[90%] lg:w-[65%] mx-auto  my-[16vh]">
                    <div class="flex gap-x-4 text-base font-bold items-center"> <img loading="lazy" class="w-[108px]"
                            src="../../../assets/image/icon/logo-itviec-black.png" alt="">
                        <span>CUSTOMER ADMIN SITE</span>
                    </div>
                    <div class="mt-12 font-bold text-[22px]">Đăng nhập ITviec Customer</div>
                    <a-form :model="formState" layout="vertical" name="normal_login" class="login-form"
                        @finish="onFinish">
                        <div class="mt-3">

                            <a-form-item name="username" :rules="[
                                { required: true, message: 'Vui lòng điền email!' },
                                { type: 'email', message: 'Email phải là email!' }
                            ]" class="m-0">
                                <a-input v-model:value="formState.username"
                                    class="w-full mt-6 h-[40px] lg:h-[50px] px-4 py-2  "
                                    placeholder="Vui lòng nhập email">
                                </a-input>
                            </a-form-item>

                            <a-form-item name="password" :rules="[
                                { required: true, message: 'Vui lòng điền mật khẩu!' },
                                { type: 'string', min: 6, message: 'Mật bạn phải là 6 kiểu!' }
                            ]" class="m-0">
                                <a-input-password v-model:value="formState.password"
                                    placeholder="Vui lòng nhập mật khẩu"
                                    class="w-full mt-6 h-[40px] lg:h-[50px] px-4 py-2  text-sm  ">

                                </a-input-password>
                            </a-form-item>
                        </div>
                        <div class="mt-3 flex justify-between">
                            <a-checkbox>Ghi nhớ mật khẩu</a-checkbox>
                            <RouterLink to="/forgotpassword" class="text-[#0E2EED] text-sm font-normal">Quên mật khẩu
                            </RouterLink>
                        </div>
                        <div class="mt-4 text-sm font-light">
                            Bằng việc đăng nhập, bạn đồng ý với các <span class="text-[#0E2EED]">Điều khoản dịch vụ
                            </span>và <span class="text-[#0E2EED]"> Chính sách
                                quyền
                                riêng tư</span> của
                            ITviec liên quan đến thông tin riêng tư của bạn.
                        </div>

                        <a-button type="button" html-type="submit" :loading="loading"
                            class="w-full mt-8 h-[40px] lg:h-[50px] text-lg bg-red-600 text-white rounded-[4px] hover:bg-red-700">Đăng
                            nhập</a-button>
                    </a-form>
                    <div class="text-[16px] mt-3 font-light text-center">
                        Bạn chưa có tài khoản?
                        <RouterLink to="/customer/register"
                            class="text-[#0E2EED] hover:text-[#210eed] hover:font-[400]">đăng ký
                            ngay</RouterLink>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<style scoped lang="scss"></style>
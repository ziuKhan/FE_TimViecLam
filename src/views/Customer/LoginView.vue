<script setup lang="ts">
import { ref } from 'vue';
import Loading from '../../components/Loading.vue';

const load = ref<boolean>(true)

</script>

<template>

    <Loading v-if="!load"></Loading>
    <div v-else>
        <div class="flex">
            <div class="w-1/2 theme_blackred hidden lg:block"> <img
                    src="../../assets/image/company/logo_login_customer.png" alt="">
            </div>
            <div class="w-full lg:w-1/2 ">
                <div class="w-[90%] lg:w-[65%] mx-auto  my-[16vh]">
                    <div class="flex gap-x-4 text-base font-bold items-center"><img class="w-[108px]"
                            src="../../assets/image/icon/logo-itviec-black.png" alt="">
                        <span>CUSTOMER ADMIN SITE</span>
                    </div>
                    <div class="mt-12 font-bold text-[22px]">Đăng nhập ITviec Customer</div>
                    <div class="mt-3">

                        <a-input class="w-full mt-6 h-[40px] lg:h-[50px] px-4 py-2  " placeholder="Email" />
                        <a-input-password placeholder="input password"
                            class="w-full mt-6 h-[40px] lg:h-[50px] px-4 py-2  text-sm  " />

                    </div>
                    <div class="mt-3 flex justify-between">
                        <a-checkbox>Ghi nhớ mật khẩu</a-checkbox>
                        <RouterLink to="/forgotpassword" class="text-[#0E2EED] text-sm font-normal">Quên mật khẩu
                        </RouterLink>
                    </div>
                    <div class="mt-4 text-sm font-light">
                        Bằng việc đăng nhập, bạn đồng ý với các <span class="text-[#0E2EED]">Điều khoản dịch vụ
                        </span>>và <span class="text-[#0E2EED]"> Chính sách
                            quyền
                            riêng tư</span> của
                        ITviec liên quan đến thông tin riêng tư của bạn.
                    </div>

                    <button type="button"
                        class="w-full mt-8 h-[40px] lg:h-[50px] bg-red-600 text-white rounded-[4px] hover:bg-red-700">Đăng
                        nhập</button>
                </div>
            </div>
        </div>

    </div>
</template>

<style scoped lang="scss"></style>
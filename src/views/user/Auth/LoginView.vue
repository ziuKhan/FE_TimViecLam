<script lang="ts" setup>
import { reactive, computed, onMounted, watchEffect, ref, provide, watch } from 'vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { accountApi, loginApi, loginByGoogleApi, refreshApi } from '../../../services/auth.service'
import { message, notification } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import tokenService from '../../../services/token.service'
import Loading from '../../../components/Loading.vue';
import accountService from '../../../services/account.service'
import apiService from '../../../services/api.service'

interface IFormState {
  username: string
  password: string
  remember: boolean
}
const formState = reactive<IFormState>({
  username: '',
  password: '',
  remember: false
})
const route = useRoute()
const loading = ref<boolean>(false)
const load = ref<boolean>(true)
const openNotificationWithIcon = () => {
  notification['success']({
    message: 'Thông báo',
    description: 'Đăng nhập thành công.'
  })
}
const router = useRouter()


const onFinish = async (values: IFormState) => {
 
  try {
    const { username, password } = values
    loading.value = true
    const response = await apiService.add('auth/login', { username, password })
    if (response.data) {
      const { access_token } = response.data
      tokenService.createToken(access_token, formState.remember)

      await accountService.createAccount(formState.remember)


      openNotificationWithIcon()
      router.back()
      window.location.reload();
    }
  } catch (error: any) {
    message.error(error.response.data.message)
  } finally {
    loading.value = false

  }
}

const disabled = computed(() => {
  return !(formState.username && formState.password)
})
const onLoginByGoogle = async () => {
  window.location.href = import.meta.env.VITE_API_URL + '/api/v1/auth/google';
};
const googleCallback = async (access_token: any) => {
  try {
    load.value = true

    tokenService.createToken(access_token, formState.remember);
    await accountService.createAccount(formState.remember)
    openNotificationWithIcon();
    router.push('/');
    window.location.reload();

  } catch (error) {
    console.error('Lỗi do try catch bắt:', error);
  }
};

onMounted(() => {
  const user = tokenService.getToken()?.header.Authorization
  if (user && user !== 'undefined') {
    router.push('/')
  }

  const token = route.params.id // Lấy token từ URL
  if (token) {
    googleCallback(token)
  }
  setTimeout(() => {
    load.value = false
  }, 200)
})
</script>






<template>
  <Loading v-if="load"></Loading>

  <div class="container__login h-screen">
    <div class="container__login_title">
      Chào mừng bạn đến với <img loading="lazy" src="../../../assets/image/icon/logo-itviec-black.png" alt="" />
    </div>

    <div class="leftSide w-full lg:w-2/4 mx-auto lg:pr-[120px]">
      <div class="leftSide__title">
        Bằng việc đăng nhập, bạn đồng ý với các
        <a href="https://itviec.com/blog/terms-conditions-vn/" target="_blank" class="hyperlink">Điều khoản dịch vụ</a>
        và
        <a href="https://itviec.com/blog/chinh-sach-bao-mat/" target="_blank" class="hyperlink">Chính sách quyền riêng
          tư</a>
        của ITviec liên quan đến thông tin riêng tư của bạn.
      </div>

      <a-button danger class="login__btn_google" @click="onLoginByGoogle()"> <img loading="lazy"
          src="../../../assets/image/icon/icons8_google.svg" alt="" /> Đăng
        nhập
        với Google</a-button>

      <a-form :model="formState" layout="vertical" name="normal_login" class="login-form" @finish="onFinish">
        <div class="or">hoặc</div>
        <a-form-item label="Email" name="username" class="login-form-username" :rules="[
          { required: true, message: 'Vui lòng điền email!' },
          { type: 'email', message: 'Yêu cầu nhập đúng định dạng email!' }
        ]">
          <a-input v-model:value="formState.username" size="large" placeholder="Vui lòng nhập email">
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item class="mb-3" label="Mật khẩu" name="password" :rules="[
          { required: true, message: 'Vui lòng điền mật khẩu!' },
          { type: 'string', min: 6, message: 'Mật khẩu của bạn phải là 6 kí tự!' }
        ]">
          <a-input-password v-model:value="formState.password" size="large" placeholder="Vui lòng nhập mật khẩu">
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item>
          <a-form-item name="remember" no-style>
            <a-checkbox v-model:checked="formState.remember">Nhớ tài khoản</a-checkbox>
          </a-form-item>
          <a class="login-form-forgot" href="">Quên mật khẩu</a>
        </a-form-item>

        <a-form-item>
          <a-button  type="primary" html-type="submit" class="login-form-button" :loading="loading">
            Đăng nhập ngay
          </a-button>
          hoặc
          <RouterLink to="/register" class="font-medium hover:text-red-600">đăng ký ngay!</RouterLink>
        </a-form-item>
      </a-form>
    </div>

    <div class="rightSide w-full lg:w-2/4">
      <div class="rightSide__title">
        Đăng nhập để truy cập ngay vào hàng ngàn đánh giá và dữ liệu lương thị trường IT
      </div>
      <div class="rightSide__part">
        <img loading="lazy" src="../../../assets/image/icon/icons8_checkmark.svg" alt="" />Xem trước mức lương để có thể
        lợi thế khi thoả thuận lương
      </div>
      <div class="rightSide__part">
        <img loading="lazy" src="../../../assets/image/icon/icons8_checkmark.svg" alt="" />Tìm hiểu về phúc lợi, con
        người, văn hóa công ty qua các đánh giá chân thật
      </div>
      <div class="rightSide__part">
        <img loading="lazy" src="../../../assets/image/icon/icons8_checkmark.svg" alt="" />Dễ dàng ứng tuyển chỉ với một
        thao tác
      </div>
      <div class="rightSide__part">
        <img loading="lazy" src="../../../assets/image/icon/icons8_checkmark.svg" alt="" />Quản lý hồ sơ và quyền riêng
        tư của bạn
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container__login {
  width: 88%;
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;

  .container__login_title {
    display: flex;
    width: 100%;
    align-items: center;
    font-size: 20px;
    font-weight: 700;
    gap: 0 10px;
    margin: 24px 0;
    align-items: end;
    img {
      width: 75px;
    }
  }
}

.leftSide {
  .login-form {
    background-color: #fff;
    width: 100%;
    border-radius: 10px;
  }

  .or {
    text-align: center;
    font-size: 14px;
    font-weight: 500;
    margin-top: 10px;
  }

  .login-form-forgot {
    float: right;
  }

  .login__btn_google {
    width: 100%;
    height: 45px;
    font-size: 16px;
    font-weight: 700;
    color: rgb(237, 27, 47);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0 10px;
  }

  .login-form-button {
    width: 100%;
    height: 45px;
    background-color: #ed1b2f;
    font-size: 20px;
  }

  .leftSide__title {
    font-size: 14px;
    color: #414042;
    margin-bottom: 30px;

    a {
      color: rgb(14, 46, 237);
    }
  }
}

.rightSide {
  .rightSide__title {
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 10px;
  }

  .rightSide__part {
    display: flex;
    align-items: center;
    gap: 0 6px;
    margin-top: 20px;
    font-size: 16px;
    font-weight: 400;
  }
}
</style>
../../../services/token.service../../../services/account.service
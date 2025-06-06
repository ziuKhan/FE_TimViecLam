<script lang="ts" setup>
import { reactive, computed, onMounted, watchEffect } from 'vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { loginApi, registerApi } from '../../../services/auth.service'
import { notification } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import tokenService from '../../../services/token.service'

interface IFormState {
  email: string
  password: string
  name: string
  clause: boolean
  confirmPassword: string
}

const formState = reactive<IFormState>({
  email: '',
  password: '',
  name: '',
  clause: false,
  confirmPassword: ''
})

const openNotificationWithIcon = () => {
  notification['success']({
    message: 'Thông báo',
    description: 'Đăng ký thành công.'
  })
}
const validateConfirmPassword = (rule: any, value: any, callback: any) => {
  if (value !== formState.password) {
    callback(new Error('Mật khẩu không khớp!'))
  } else {
    callback()
  }
}
const onFinish = async (values: IFormState) => {
  try {
    const { email, password, name } = values
    const response = await registerApi({ email, password, name })
    if (response.data) {
      router.push('/login')

      openNotificationWithIcon()
    }
  } catch (error) {
    console.error('Lỗi do try catch bắt:', error)
  }
}

const disabled = computed(() => {
  return !(formState.email && formState.password && formState.clause && formState.name && formState.confirmPassword)
})
const router = useRouter()
onMounted(() => {
  const user = tokenService.getToken()?.header.Authorization
  if (user && user !== 'undefined') {
    router.push('/')
  }
})
</script>

<template>
  <div class="container__login">
    <div class="container__login_title">
      Chào mừng bạn đến với
      <img loading="lazy" src="../../../assets/image/icon/logo-itviec-black.png" alt="" />
    </div>

    <div class="leftSide w-full lg:w-6/12 lg:pr-32">
      <div class="leftSide__title">Đăng ký tài khoản</div>
      <a-button danger class="login__btn_google">
        <img loading="lazy" src="../../../assets/image/icon/icons8_google.svg" alt="" /> Đăng ký với
        Google</a-button
      >

      <a-form
        :model="formState"
        layout="vertical"
        name="normal_register"
        class="login-form"
        @finish="onFinish"
      >
        <div class="or">hoặc</div>

        <a-form-item
          label="Họ và Tên"
          name="name"
          class="login-form-username"
          :rules="[{ required: true, message: 'Vui lòng điền họ và tên!' }]"
        >
          <a-input v-model:value="formState.name" size="large" placeholder="Họ và Tên">
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item
          label="Email"
          name="email"
          class="login-form-username"
          :rules="[
            { required: true, message: 'Vui lòng điền email!' },
            { type: 'email', message: 'Email phải là email!' }
          ]"
        >
          <a-input v-model:value="formState.email" size="large" placeholder="Email cả nhân">
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item
          label="Mật khẩu"
          name="password"
          :rules="[
            { required: true, message: 'Vui lòng điền mật khẩu!' },
            { type: 'string', min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
          ]"
        >
          <a-input-password v-model:value="formState.password" size="large" placeholder="Mật khẩu">
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item
          label="Nhập lại mật khẩu"
          name="confirmPassword"
          :rules="[
            { required: true, message: 'Vui lòng điền lại mật khẩu!' },
            { type: 'string', min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
            { validator: validateConfirmPassword, trigger: 'blur' }
          ]"
        >
          <a-input-password v-model:value="formState.confirmPassword" size="large" placeholder="Nhập lại mật khẩu">
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item>
          <a-form-item name="clause" no-style>
            <a-checkbox v-model:checked="formState.clause">
              <div class="clause__title">
                Tôi đã đọc và đồng ý với các
                <a
                  href="https://itviec.com/blog/terms-conditions-vn/"
                  target="_blank"
                  class="hyperlink"
                  >Điều khoản dịch vụ</a
                >
                và
                <a
                  href="https://itviec.com/blog/chinh-sach-bao-mat/"
                  target="_blank"
                  class="hyperlink"
                  >Chính sách quyền riêng tư</a
                >
                của ITviec liên quan đến thông tin riêng tư của tôi.
              </div>
            </a-checkbox>
          </a-form-item>
        </a-form-item>

        <a-form-item>
          <a-button
            :disabled="disabled"
            type="primary"
            html-type="submit"
            class="login-form-button"
          >
            Đăng ký
          </a-button>
          Bạn đã có tài khoản
          <RouterLink to="/login" class="font-bold hover:text-red-600">đăng nhập ngay!</RouterLink>
        </a-form-item>
      </a-form>
    </div>

    <div class="rightSide hidden lg:flex">
      <img loading="lazy" src="../../../assets/image/icon/robby-login.png" alt="" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.container__login {
  height: calc(100vh - 88px);
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

    img {
      width: 75px;
    }
  }
}

.leftSide {
  .leftSide__title {
    font-size: 28px;
    font-weight: 700;
    margin: 10px 0 20px 0;
  }

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
}

.clause__title {
  font-size: 14px;
  color: #414042;

  a {
    color: rgb(14, 46, 237);
  }
}

.rightSide {
  width: 50%;
  justify-content: center;
  align-items: center;
}
</style>
../../../services/token.service

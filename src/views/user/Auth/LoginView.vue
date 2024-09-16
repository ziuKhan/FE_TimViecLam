<script lang="ts" setup>
import { reactive, computed, onMounted, watchEffect, ref, provide } from 'vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { paginateCompanyApi } from '../../../services/company.service'
import { accountApi, loginApi, refreshApi } from '../../../services/auth.service'
import { notification } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../../stores/user/AuthStore'
import tokenService from '../../../constant/token.service'


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

const loading = ref<boolean>(false)
const openNotificationWithIcon = () => {
  notification['success']({
    message: 'Thông báo',
    description: 'Đăng nhập thành công.'
  })
}
const storeAuth = useAuthStore()
const router = useRouter()
const onFinish = async (values: IFormState) => {
  try {
    const { username, password } = values
    loading.value = true
    const response = await loginApi(username, password)
    if (response.data) {
      const { access_token } = response.data

      // Lưu access_token vào bộ nhớ trình duyệt
      tokenService.createToken(access_token, formState.remember)

      storeAuth.statusIsAuth()
      openNotificationWithIcon()
      router.back()
      window.location.reload();
    }
    loading.value = false
  } catch (error) {
    loading.value = false

    console.error('Lỗi do try catch bắt:', error)
  }
}

const disabled = computed(() => {
  return !(formState.username && formState.password)
})

onMounted(() => {
  const user = tokenService.getToken()?.token
  if (user && user !== 'undefined') {
    router.push('/')
  }
})
</script>


<template>
  <div class="container__login ">
    <div class="container__login_title">
      Chào mừng bạn đến với <img src="../../../assets/image/icon/logo-itviec-black.png" alt="" />
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

      <a-button danger class="login__btn_google"><img src="../../../assets/image/icon/icons8_google.svg" alt="" /> Đăng
        nhập
        với Google</a-button>

      <a-form :model="formState" layout="vertical" name="normal_login" class="login-form" @finish="onFinish">
        <div class="or">hoặc</div>
        <a-form-item label="Email" name="username" class="login-form-username" :rules="[
          { required: true, message: 'Vui lòng điền email!' },
          { type: 'email', message: 'Email phải là email!' }
        ]">
          <a-input v-model:value="formState.username" size="large" placeholder="Vui lòng nhập email">
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item label="Mật khẩu" name="password" :rules="[
          { required: true, message: 'Vui lòng điền mật khẩu!' },
          { type: 'string', min: 6, message: 'Mật bạn phải là 6 kiểu!' }
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

          <a-button :disabled="disabled" type="primary" html-type="submit" class="login-form-button" :loading="loading">
            Đăng nhập ngay
          </a-button>


          hoặc
          <RouterLink to="/register" class="font-medium">đăng ký ngay!</RouterLink>
        </a-form-item>
      </a-form>
    </div>

    <div class="rightSide w-full lg:w-2/4">
      <div class="rightSide__title">
        Đăng nhập để truy cập ngay vào hàng ngàn đánh giá và dữ liệu lương thị trường IT
      </div>
      <div class="rightSide__part">
        <img src="../../../assets/image/icon/icons8_checkmark.svg" alt="" />Xem trước mức lương để có thể
        lợi thế khi thoả thuận lương
      </div>
      <div class="rightSide__part">
        <img src="../../../assets/image/icon/icons8_checkmark.svg" alt="" />Tìm hiểu về phúc lợi, con
        người, văn hóa công ty qua các đánh giá chân thật
      </div>
      <div class="rightSide__part">
        <img src="../../../assets/image/icon/icons8_checkmark.svg" alt="" />Dễ dàng ứng tuyển chỉ với một
        thao tác
      </div>
      <div class="rightSide__part">
        <img src="../../../assets/image/icon/icons8_checkmark.svg" alt="" />Quản lý hồ sơ và quyền riêng
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

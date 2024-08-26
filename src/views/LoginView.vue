<script lang="ts" setup>
import { reactive, computed, onMounted } from 'vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { paginateCompanyApi } from '../services/company.service';
interface FormState {
  username: string;
  password: string;
  remember: boolean;
}
const formState = reactive<FormState>({
  username: '',
  password: '',
  remember: true,
});

onMounted(() => {
    const data = paginateCompanyApi();
    console.log(data)
})


const onFinish = (values: any) => {
  console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};
const disabled = computed(() => {
  return !(formState.username && formState.password);
});
</script>


<template>
    <div class="container__login">
        <div class="container__login_title">
            Chào mừng bạn đến với <img src="../assets/image/icon/logo-itviec-black.png" alt="">
        </div>

        <div class="leftSide">
            <div class="leftSide__title">
                Bằng việc đăng nhập, bạn đồng ý với các 
                <a href="https://itviec.com/blog/terms-conditions-vn/" target="_blank" class="hyperlink">Điều khoản dịch vụ</a> và
                <a href="https://itviec.com/blog/chinh-sach-bao-mat/" target="_blank" class="hyperlink">Chính sách quyền riêng tư</a> của ITviec liên quan đến thông tin riêng tư của bạn.

            </div>
        <a-form
    :model="formState"
    name="normal_login"
    class="login-form"
    @finish="onFinish"
    @finishFailed="onFinishFailed"
  >

        <div class="login_title">Đăng Nhập</div>
    <a-form-item
      label="Username"
      name="username"
      :rules="[{ required: true, message: 'Please input your username!' }]"
    >
    
      <a-input v-model:value="formState.username">
        <template #prefix>
          <UserOutlined class="site-form-item-icon" />
        </template>
      </a-input>
    </a-form-item>

    <a-form-item
      label="Password"
      name="password"
      :rules="[{ required: true, message: 'Please input your password!' }]"
    >
      <a-input-password v-model:value="formState.password">
        <template #prefix>
          <LockOutlined class="site-form-item-icon" />
        </template>
      </a-input-password>
    </a-form-item>

    <a-form-item>
      <a-form-item name="remember" no-style>
        <a-checkbox v-model:checked="formState.remember">Remember me</a-checkbox>
      </a-form-item>
      <a class="login-form-forgot" href="">Forgot password</a>
    </a-form-item>

    <a-form-item>
      <a-button :disabled="disabled" type="primary" html-type="submit" class="login-form-button">
        Log in
      </a-button>
      Or
      <a href="">register now!</a>
    </a-form-item>
  </a-form>
    </div>

    <div class="rightside">

    </div>
    </div>
   



</template>

<style scoped lang="scss">
.container__login{
    height: calc(100vh - 88px);
    width: 88%;
    margin: 0 auto;
    .container__login_title{
        display: flex;
        align-items: center;
        font-size: 20px;
        font-weight: 700;
        gap: 0 10px;
        margin: 24px 0;
    img{
        width: 75px;
    }
    }
}
.leftSide{
    width: 50%;
    padding-right:120px ;
    .login-form{
        background-color: #fff;
        width: 100%;
        border-radius: 10px;
    }
    .login_title{
        text-align: center;
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 20px;
    }
    .login-form-forgot{
    float: right ;
    }

    .login-form-button {
    width: 100%;
    }
}





</style>

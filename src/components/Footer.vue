<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isHiddenFooter = ref<Boolean>(false)
watchEffect(() => {
  isHiddenFooter.value = route.path === '/login' || route.path === '/register' || route.path === '/customer/login' || route.path === '/customer/register'
})
</script>

<template>
  <footer v-if="!isHiddenFooter" class="theme_blackred w-full pt-12 relative overflow-hidden ">
    <div class="m-auto w-11/12 lg:w-10/12 mb-12 flex flex-wrap gap-2 lg:gap-0 lg:flex-nowrap ">
      <div class="w-full lg:h-full flex justify-center flex-col mb-3 items-center lg:w-1/4">
        <div class="h-12">
          <img class="h-full" src="../assets/image/icon/logo-itviec.png" alt="" />
        </div>
        <div class="text-white pt-1">Ít nhưng mà chất</div>
      </div>

      <div class="w-5/12 lg:w-1/6">
        <h3 class="text-base text-gray-50">Về ITViec</h3>
        <div class="text-gray-400 text-sm font-normal">
          <p>Trang chủ</p>
          <p>Về ITViec.com</p>
          <p>Dịch vụ gợi ý ứng viên</p>
          <p>Liên Hệ</p>
          <p>Việc Làm IT</p>
          <p>Câu hỏi thường gặp</p>
        </div>
      </div>

      <div class="w-5/12 lg:w-1/6">
        <h3 class="text-base text-gray-50">Chương trình</h3>
        <div class="text-gray-400 text-sm font-normal">
          <p>Chuyện IT</p>
          <p>Cuộc thi viết</p>
          <p>Việc làm IT nổi bật</p>
        </div>
      </div>

      <div class="w-5/12 lg:w-1/6">
        <h3 class="text-base text-gray-50">Điều khoản chung</h3>
        <div class="text-gray-400 text-sm font-normal">
          <p>Quy định bảo mật</p>
          <p>Quy chế hoạt động</p>
          <p>Giải quyết khiếu nại</p>
          <p>Thoả thuận sử dụng</p>
          <p>Thông cáo báo chí</p>
        </div>
      </div>
      <div class="w-5/12 lg:w-1/4">
        <h3 class="text-base text-gray-50">Liên hệ để đăng tin tuyển dụng tại:</h3>
        <div class="text-gray-400 text-sm font-normal">
          <p>Hồ Chí Minh: (+84) 977 460 519</p>
          <p>Hà Nội: (+84) 983 131 351</p>
          <p>Email: love@itviec.com</p>
          <p>Gửi thông tin liên hệ</p>
        </div>
      </div>
    </div>
    <hr />
    <div class="text-gray-400 text-center text-sm p-5">Copyright © IT VIEC JSC | 0312192258</div>
    <div class="absolute -top-4 right-0 z-0 h-full">
      <img class="" src="../assets/image/icon/logo_footer.svg" alt="" />
    </div>
  </footer>
</template>



<style scoped></style>
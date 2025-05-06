<template>
  <div class="success-container min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-b from-blue-50 to-white">
    <div class="success-card bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg text-center relative overflow-hidden">
      <!-- Hiệu ứng trang trí góc -->
      <div class="absolute top-0 right-0 w-32 h-32 -mr-10 -mt-10 bg-green-100 rounded-full"></div>
      <div class="absolute bottom-0 left-0 w-40 h-40 -ml-16 -mb-16 bg-blue-100 rounded-full"></div>
      
      <!-- Icon thành công -->
      <div class="success-icon relative mb-6 mx-auto">
        <div class="animate-success-ring w-24 h-24 rounded-full border-4 border-green-500 flex items-center justify-center">
          <CheckOutlined  class="text-5xl text-green-500"/>
        </div>
      </div>
      
      <h1 class="text-3xl font-bold text-gray-800 mb-3 relative">Thanh toán thành công!</h1>
      <p class="text-gray-600 mb-8 relative">Cảm ơn bạn đã nâng cấp tài khoản lên VIP</p>
      
      <!-- Chi tiết giao dịch -->
      <div class="transaction-details bg-gray-50 p-4 rounded-lg mb-8 relative">
        <div class="flex justify-between mb-2">
          <span class="text-gray-600">Mã giao dịch:</span>
          <span class="font-semibold text-gray-800">{{ route.query?.orderCode || 'Không có mã giao dịch' }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Thời gian:</span>
          <span class="font-semibold text-gray-800">{{ currentDateTime }}</span>
        </div>
      </div>
      
      <!-- Đếm ngược -->
      <div class="countdown-container relative mb-6">
        <div class="countdown-circle mx-auto w-16 h-16 rounded-full flex items-center justify-center border-4 border-blue-500">
          <span class="text-xl font-bold text-blue-600">{{ countdown }}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-3 mt-3">
          <div class="bg-blue-600 h-3 rounded-full transition-all duration-1000" :style="{ width: `${(countdown/10)*100}%` }"></div>
        </div>
        <p class="text-sm text-gray-600 mt-2">Tự động chuyển hướng về trang chủ sau {{ countdown }} giây</p>
      </div>
      
      <!-- Nút về trang chủ -->
      <button @click="goToHome" class="relative bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg font-medium transition duration-300">
        Về trang chủ ngay
      </button>
      
      <!-- Huy hiệu VIP -->
      <div class="absolute top-4 right-4 bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-semibold flex items-center">
        <i class="fas fa-crown mr-1"></i>
        <span>VIP</span>
      </div>
    </div>
    
    <!-- Thông tin bổ sung -->
    <div class="mt-8 text-center max-w-md relative">
      <p class="text-gray-600">Nếu bạn có bất kỳ câu hỏi nào, vui lòng <a href="#" class="text-blue-600 hover:underline">liên hệ đội hỗ trợ</a> của chúng tôi.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckOutlined } from '@ant-design/icons-vue';
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiService from '../../services/api.service';
import accountService from '../../services/account.service';

const router = useRouter();
const route = useRoute();
const countdown = ref(10);
let timer: ReturnType<typeof setInterval> | null = null;


// Hàm đếm ngược và chuyển hướng
const startCountdown = () => {
  timer = setInterval(() => {
    countdown.value--;
    
    if (countdown.value <= 0) {
      if (timer) clearInterval(timer);
      goToHome();
    }
  }, 1000);
};

// Hàm chuyển hướng về trang chủ
const goToHome = () => {
  // Thay đổi đường dẫn phù hợp với ứng dụng của bạn
  router.push('/');
};

// Khởi chạy đếm ngược khi component được tạo
onMounted(() => {
  getTransaction();
  accountService.updateAccount()  
  startCountdown();
});
const transaction = ref<any>(null);
  const getTransaction = async () => {
    const response = await apiService.get(`transactions/${route.query.orderCode}`);
    transaction.value = response.data;
  }
  const currentDateTime = computed(() => {
    const now = new Date(transaction.value?.createdAt) || new Date();
    return now.toLocaleString('vi-VN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit'
    });
  });
// Xóa timer khi component bị hủy
onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});
</script>

<style>
@keyframes success-pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(72, 187, 120, 0.5);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 15px rgba(72, 187, 120, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(72, 187, 120, 0);
  }
}

.animate-success-ring {
  animation: success-pulse 1.5s infinite;
}
</style>
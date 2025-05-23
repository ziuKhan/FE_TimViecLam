<template>
  <div
    class="upgrade-vip-container py-10 px-4 md:px-8 lg:px-16 min-h-screen bg-gradient-to-b from-gray-50 to-white"
  >
    <div class="mb-10 text-center">
      <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
        Nâng cấp tài khoản <span class="text-amber-500">VIP</span>
      </h1>
      <p class="text-gray-600 text-lg max-w-3xl mx-auto">
        Mở khóa các tính năng cao cấp và cơ hội việc làm đặc biệt với tài khoản VIP
      </p>
    </div>

    <!-- Lợi ích VIP -->
    <div class="benefits-section mb-12 bg-white rounded-xl shadow-md p-8">
      <h2 class="text-2xl font-bold text-center mb-8 text-gray-800">Lợi ích của tài khoản VIP</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          class="benefit-item flex flex-col items-center p-4 border border-gray-100 rounded-lg hover:shadow-md transition duration-300"
        >
          <div class="benefit-icon bg-blue-100 p-3 rounded-full mb-4">
            <i class="fas fa-search text-blue-600 text-2xl"></i>
          </div>
          <h3 class="text-lg font-semibold mb-2 text-gray-800">Ưu tiên tìm kiếm</h3>
          <p class="text-gray-600 text-center">
            Hồ sơ của bạn sẽ xuất hiện ưu tiên trong kết quả tìm kiếm của nhà tuyển dụng
          </p>
        </div>
        <div
          class="benefit-item flex flex-col items-center p-4 border border-gray-100 rounded-lg hover:shadow-md transition duration-300"
        >
          <div class="benefit-icon bg-green-100 p-3 rounded-full mb-4">
            <i class="fas fa-briefcase text-green-600 text-2xl"></i>
          </div>
          <h3 class="text-lg font-semibold mb-2 text-gray-800">Việc làm cao cấp</h3>
          <p class="text-gray-600 text-center">
            Tiếp cận các cơ hội việc làm độc quyền với mức lương hấp dẫn
          </p>
        </div>
        <div
          class="benefit-item flex flex-col items-center p-4 border border-gray-100 rounded-lg hover:shadow-md transition duration-300"
        >
          <div class="benefit-icon bg-purple-100 p-3 rounded-full mb-4">
            <i class="fas fa-user-tie text-purple-600 text-2xl"></i>
          </div>
          <h3 class="text-lg font-semibold mb-2 text-gray-800">Hồ sơ nổi bật</h3>
          <p class="text-gray-600 text-center">
            Hồ sơ của bạn được đánh dấu nổi bật với biểu tượng VIP thu hút nhà tuyển dụng
          </p>
        </div>
        <div
          class="benefit-item flex flex-col items-center p-4 border border-gray-100 rounded-lg hover:shadow-md transition duration-300"
        >
          <div class="benefit-icon bg-amber-100 p-3 rounded-full mb-4">
            <i class="fas fa-comment-dots text-amber-600 text-2xl"></i>
          </div>
          <h3 class="text-lg font-semibold mb-2 text-gray-800">Hỗ trợ tư vấn</h3>
          <p class="text-gray-600 text-center">
            Được hỗ trợ tư vấn nghề nghiệp 1-1 từ các chuyên gia nhân sự
          </p>
        </div>
      </div>
    </div>

    <!-- Hiển thị gói VIP -->
    <div class="packages-section">
      <h2 class="text-2xl font-bold text-center mb-8 text-gray-800">
        Lựa chọn gói VIP phù hợp với bạn
      </h2>
      <div v-if="loading" class="flex justify-center my-10">
        <a-spin size="large" />
      </div>
      <div v-else-if="!packages.length" class="text-center p-8 bg-gray-50 rounded-lg">
        <p class="text-gray-600">Không có gói dịch vụ nào hiện tại. Vui lòng thử lại sau.</p>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="pkg in packages"
          :key="pkg._id"
          class="package-card relative overflow-hidden bg-white rounded-xl border border-gray-200 transition-all duration-300 hover:shadow-xl hover:border-blue-200 transform hover:-translate-y-1"
        >
          <div
            v-if="pkg.price > pkg.priceDiscount"
            class="absolute top-0 right-0 bg-red-500 text-white py-1 px-3 text-sm font-semibold"
          >
            Giảm {{ Math.round(((pkg.price - pkg.priceDiscount) / pkg.price) * 100) }}%
          </div>
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-2">{{ pkg.name }}</h3>
            <div class="price-section mb-4">
              <div class="flex items-end gap-2">
                <span class="text-3xl font-bold text-red-700">{{
                  formatCurrency(pkg.priceDiscount)
                }}</span>
                <span
                  v-if="pkg.price > pkg.priceDiscount"
                  class="text-lg text-gray-400 line-through"
                  >{{ formatCurrency(pkg.price) }}</span
                >
              </div>
              <p class="text-gray-600 text-sm mt-1">Gói {{ pkg.duration }} tháng</p>
            </div>
            <div class="package-description mb-6">
              <p class="text-gray-600">
                {{
                  pkg.description ||
                  'Nâng cấp tài khoản của bạn lên VIP để nhận nhiều lợi ích hấp dẫn'
                }}
              </p>
            </div>
            <button
              @click="selectPackage(pkg)"
              class="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition duration-300 flex justify-center items-center gap-2"
            >
              <i class="fas fa-crown"></i> Chọn gói này
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal xác nhận -->
    <a-modal
      v-model:visible="confirmModal.visible"
      :title="'Xác nhận đăng ký gói ' + (selectedPackage?.name || '')"
      @ok="confirmUpgrade"
      :confirmLoading="confirmModal.loading"
    >
      <p>
        Bạn đang chọn gói <strong>{{ selectedPackage?.name }}</strong> với giá
        <strong>{{ formatCurrency(selectedPackage?.priceDiscount || 0) }}</strong> có thời hạn
        <strong>{{ selectedPackage?.duration }} tháng</strong>.
      </p>
      <p class="mt-2">Xác nhận để tiếp tục thanh toán?</p>
    </a-modal>

    <!-- Testimonials -->
    <div class="testimonials-section my-16">
      <h2 class="text-2xl font-bold text-center mb-8 text-gray-800">
        Người dùng nói gì về tài khoản VIP?
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="testimonial-item bg-white p-6 rounded-lg shadow-md">
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
            <div>
              <p class="font-semibold">Nguyễn Văn A</p>
              <p class="text-sm text-gray-500">Kỹ sư phần mềm</p>
            </div>
          </div>
          <p class="text-gray-600">
            "Tài khoản VIP giúp tôi nhận được nhiều lời mời phỏng vấn hơn. Tôi đã tìm được công việc
            mơ ước chỉ sau 2 tuần nâng cấp!"
          </p>
        </div>
        <div class="testimonial-item bg-white p-6 rounded-lg shadow-md">
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
            <div>
              <p class="font-semibold">Trần Thị B</p>
              <p class="text-sm text-gray-500">UI/UX Designer</p>
            </div>
          </div>
          <p class="text-gray-600">
            "Hồ sơ nổi bật giúp tôi tiếp cận được nhiều nhà tuyển dụng chất lượng. Đáng đồng tiền
            bát gạo!"
          </p>
        </div>
        <div class="testimonial-item bg-white p-6 rounded-lg shadow-md">
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
            <div>
              <p class="font-semibold">Lê Văn C</p>
              <p class="text-sm text-gray-500">Product Manager</p>
            </div>
          </div>
          <p class="text-gray-600">
            "Dịch vụ tư vấn nghề nghiệp giúp tôi định hướng rõ ràng hơn và cải thiện CV đáng kể. Kết
            quả là tăng lương 30% ở vị trí mới!"
          </p>
        </div>
      </div>
    </div>

    <!-- FAQ Section -->
    <div class="faq-section mb-16">
      <h2 class="text-2xl font-bold text-center mb-8 text-gray-800">Câu hỏi thường gặp</h2>
      <div class="max-w-3xl mx-auto">
        <a-collapse>
          <a-collapse-panel key="1" header="Tài khoản VIP có những đặc quyền gì?">
            <p>
              Tài khoản VIP có nhiều đặc quyền như: hiển thị hồ sơ ưu tiên, tiếp cận việc làm cao
              cấp, hỗ trợ tư vấn nghề nghiệp, nhận thông báo việc làm phù hợp sớm nhất, và nhiều
              quyền lợi khác.
            </p>
          </a-collapse-panel>
          <a-collapse-panel key="2" header="Tôi có thể hủy gói VIP không?">
            <p>
              Bạn có thể hủy gói VIP bất cứ lúc nào, tuy nhiên chúng tôi không hoàn lại phí đăng ký.
              Tài khoản của bạn sẽ vẫn duy trì đặc quyền VIP cho đến khi hết thời hạn đăng ký.
            </p>
          </a-collapse-panel>
          <a-collapse-panel key="3" header="Tôi có thể nâng cấp gói VIP lên cao hơn không?">
            <p>
              Có, bạn hoàn toàn có thể nâng cấp từ gói thấp lên gói cao hơn bất cứ lúc nào. Chúng
              tôi sẽ tính phí chênh lệch giữa hai gói và thời hạn sẽ được tính lại tương ứng.
            </p>
          </a-collapse-panel>
          <a-collapse-panel key="4" header="Có bảo đảm tìm được việc không?">
            <p>
              Chúng tôi không đảm bảo 100% bạn sẽ tìm được việc, nhưng tài khoản VIP chắc chắn sẽ
              giúp tăng khả năng hiển thị hồ sơ của bạn đối với nhà tuyển dụng và tiếp cận nhiều cơ
              hội việc làm chất lượng hơn.
            </p>
          </a-collapse-panel>
        </a-collapse>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import apiService from '../../services/api.service'
import { useTransactionsStore } from '../../stores/Transactions'
import type { ISubscriptionPackage } from '../../types/backend'

const API_ENDPOINT = 'subscription-package'
const packages = ref<ISubscriptionPackage[]>([])
const loading = ref(false)
const selectedPackage = ref<ISubscriptionPackage | null>(null)
const confirmModal = ref({
  visible: false,
  loading: false
})
const store = useTransactionsStore()
// Lấy dữ liệu gói đăng ký
const getSubscriptionPackages = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams({
      filter: 'isActive=true',
      sort: 'price'
    })
    const res = await apiService.get(`${API_ENDPOINT}?${params}`)
    if (res && res.data && res.data.result) {
      packages.value = res.data.result
    }
  } catch (error) {
    message.error('Không thể tải danh sách gói VIP. Vui lòng thử lại sau')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// Format tiền tệ
const formatCurrency = (value: number) => {
  if (!value) return '0 đ'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value)
}

// Chọn gói
const selectPackage = (pkg: ISubscriptionPackage) => {
  selectedPackage.value = pkg
  confirmModal.value.visible = true
}

// Xác nhận nâng cấp
const confirmUpgrade = async () => {
  if (!selectedPackage.value) return

  confirmModal.value.loading = true
  try {
    store.dataTransaction.amount = selectedPackage.value.priceDiscount
    store.dataTransaction.packageId = selectedPackage.value._id || ''
    store.dataTransaction.description = selectedPackage.value.code
    await store.handleDonate()
    confirmModal.value.visible = false
  } catch (error) {
    message.error('Có lỗi xảy ra. Vui lòng thử lại sau')
    console.error(error)
  } finally {
    confirmModal.value.loading = false
  }
}

onMounted(() => {
  getSubscriptionPackages()
})
</script>

<style>
.upgrade-vip-container {
  font-family: 'Roboto', sans-serif;
}

.benefit-icon {
  transition: all 0.3s ease;
}

.benefit-item:hover .benefit-icon {
  transform: scale(1.1);
}

.package-card {
  position: relative;
  transition: all 0.3s ease;
}

.package-card:hover {
  transform: translateY(-5px);
}

/* Thêm hiệu ứng sáng cho gói VIP nổi bật */
.package-card:nth-child(2)::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, #ffd700, #ffa500);
}
</style>

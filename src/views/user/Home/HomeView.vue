<script setup lang="ts">
import { onMounted, ref } from 'vue'
import CardEmployer from '../../../components/user/CardEmployer.vue'
import CardJob from '../../../components/user/CardJob.vue'
import Loading from '../../../components/Loading.vue'
import FormSearch from '../../../components/user/search/FormSearch.vue'
import type { ICompany, IJob } from '../../../types/backend'
import apiService from '../../../services/api.service'
import { formatSalary } from '../../../until/until'
import { useRouter } from 'vue-router'

const dataCompany = ref<ICompany[]>([])
const dataJobs = ref<IJob[]>([])
const load = ref<boolean>(false)

const getData = async () => {
  load.value = false
  const [companies, jobs] = await Promise.all([
    apiService.get('companies/client?page=1&pageSize=6&filter=sort=-createdAt,isActive=true'),
    apiService.get(
      'jobs/client?page=1&pageSize=9&filter=sort=-createdAt,isActive=true,populate=companyId'
    )
  ])
  dataCompany.value = companies.data?.result
  dataJobs.value = jobs.data?.result
  load.value = true
}

const router = useRouter()

onMounted(() => {
  getData()
})
</script>

<template>
  <Loading v-if="!load"> </Loading>

  <main v-else>
    <FormSearch></FormSearch>
    <div class="link__cv theme_gray">
      <RouterLink to="" class="link__cv_link">
        <img loading="lazy" src="../../../assets/image/icon/icons8_new.svg" alt="" />
        <p class="title_bold">Mẫu CV ITviec</p>

        Công cụ kiến tạo CV tối ưu dành cho chuyên gia IT - Tạo CV ngay
        <img loading="lazy" src="../../../assets/image/icon/icons8_right.svg" alt="" />
      </RouterLink>
    </div>
  <!-- Thống kê section -->
  <div class="bg-white pt-12">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
          <div class="text-center p-6 hover:transform hover:scale-105 transition-transform duration-300">
            <div class="text-4xl font-bold text-red-600 mb-2">10,000+</div>
            <div class="text-gray-600">Việc làm IT mỗi tháng</div>
          </div>
          <div class="text-center p-6 hover:transform hover:scale-105 transition-transform duration-300">
            <div class="text-4xl font-bold text-red-600 mb-2">5,000+</div>
            <div class="text-gray-600">Công ty công nghệ</div>
          </div>
          <div class="text-center p-6 hover:transform hover:scale-105 transition-transform duration-300">
            <div class="text-4xl font-bold text-red-600 mb-2">250,000+</div>
            <div class="text-gray-600">Ứng viên IT tiềm năng</div>
          </div>
          <div class="text-center p-6 hover:transform hover:scale-105 transition-transform duration-300">
            <div class="text-4xl font-bold text-red-600 mb-2">85%</div>
            <div class="text-gray-600">Tỷ lệ ứng viên thành công</div>
          </div>
        </div>
      </div>
    </div>
    <div class="home__employer grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-10/12">
      <div class="home__employer_title lg:col-span-3 md:col-span-2 text-xl lg:text-3xl">
        Nhà tuyển dụng hàng đầu
      </div>
      <template v-for="data in dataCompany" :key="data._id">
        <CardEmployer
          :id="data._id"
          :name="data.name"
          :address="data.address"
          :logo="data.logo"
          :jobs="data.jobs"
        >
        </CardEmployer>
      </template>
      <div class="text-center col-span-3">
        <a-button type="primary" @click="router.push('/company')" class="w-1/5" ghost size="large">Xem tất cả</a-button>
      </div>
    </div>

    <div class="w-full bg-gray-50 border-solid border-gray-300 border-y pt-7 pb-12">
      <h2 class="text-3xl font-bold mb-7 text-center w-full">Việc làm tốt nhất</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-10/12 mx-auto">
        <template v-for="data in dataJobs" :key="data._id">
          <CardJob :data="data"> </CardJob>
        </template>
      </div>
      <div class="text-center col-span-3 mt-7">
        <a-button type="primary" @click="router.push('/search')" class="w-1/5" ghost size="large">Xem tất cả</a-button>
      </div>
    </div>
      <!-- IT Trends Section -->
      <div class="bg-gray-50 py-12">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-center mb-8">Xu hướng IT</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 class="text-lg font-semibold mb-3">Báo cáo lương IT 2024</h3>
            <p class="text-gray-600 mb-4">Tìm hiểu mức lương thị trường IT hiện tại và xu hướng trong tương lai</p>
            <RouterLink to="" class="text-red-600 font-medium hover:underline">Xem chi tiết</RouterLink>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 class="text-lg font-semibold mb-3">Kỹ năng IT hot nhất</h3>
            <p class="text-gray-600 mb-4">Khám phá những kỹ năng được nhà tuyển dụng săn đón nhiều nhất</p>
            <RouterLink to="" class="text-red-600 font-medium hover:underline">Xem chi tiết</RouterLink>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 class="text-lg font-semibold mb-3">Mẹo phỏng vấn IT</h3>
            <p class="text-gray-600 mb-4">Các bí quyết giúp bạn thành công trong buổi phỏng vấn IT</p>
            <RouterLink to="" class="text-red-600 font-medium hover:underline">Xem chi tiết</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.link__cv {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 72px;
}

.link__cv_link {
  display: flex;
  align-items: center;
  gap: 0 15px;

  p {
    margin: 0;
    font-weight: bold;
  }
}

.home__employer {
  background-color: #fff;
  /* width: 88%; */
  margin: 0 auto;
  gap: 30px;
  /* Khoảng cách giữa các card */
  margin-top: 60px;
  margin-bottom: 45px;

  .home__employer_title {
    font-weight: 700;
    font-size: 28px;
    width: 100%;
    text-align: center;
  }
}
</style>
>

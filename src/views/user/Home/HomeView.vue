<script setup lang="ts">
import { onMounted, ref } from 'vue'
import CardEmployer from '../../../components/user/CardEmployer.vue'
import { type ICompany, type IJob } from '../../../types/backend'
import { paginateCompanyApi } from '../../../services/company.service'
import CardJob from '../../../components/user/CardJob.vue'
import { paginateJobsApi } from '../../../services/job.service'
import Loading from '../../../components/Loading.vue'
import FormSearch from '../../../components/user/search/FormSearch.vue'

const dataCompany = ref<ICompany[]>([])
const dataJobs = ref<IJob[]>([])
const load = ref<boolean>(false)
const getData = async () => {
  load.value = false
  const params = '?current=1&pageSize=9&sort=-createdAt&isActive=true'
  const [companies, jobs] = await Promise.all([paginateCompanyApi(params), paginateJobsApi(params)])


  dataCompany.value = companies
  dataJobs.value = jobs.result
  load.value = true
}

onMounted(() => {
  getData()
})
</script>




<template>
  <Loading v-if="!load"> </Loading>

  <main v-else>
    <FormSearch></FormSearch>
    <div class="link__cv theme_gray">
      <RouterLink to="/ad" class="link__cv_link">
        <img src="../assets/image/icon/icons8_new.svg" alt="" />
        <p class="title_bold">Mẫu CV ITviec</p>

        Công cụ kiến tạo CV tối ưu dành cho chuyên gia IT - Tạo CV ngay
        <img src="../assets/image/icon/icons8_right.svg" alt="" />
      </RouterLink>
    </div>

    <div class="home__employer grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-10/12">
      <div class="home__employer_title lg:col-span-3 md:col-span-2 text-xl lg:text-3xl">Nhà tuyển dụng hàng đầu</div>
      <template v-for="data in dataCompany" :key="data._id">
        <CardEmployer :id="data._id" :name="data.name" :address="data.address" :logo="data.logo" :jobs="data.jobs">
        </CardEmployer>
      </template>
    </div>

    <div class="w-full bg-gray-50 border-solid border-gray-300 border-y pt-7 pb-20">
      <h2 class="text-3xl font-bold mb-7 text-center w-full">Việc làm tốt nhất</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-10/12 mx-auto">
        <template v-for="data in dataJobs" :key="data._id">
          <CardJob :_id="data._id" :name="data.name" :address="data.location" :logo="data.company?.logo"
            :salary="data.salary?.toString()" :nameCompany="data.company?.name" :company_id="data.company?._id">
          </CardJob>
        </template>
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
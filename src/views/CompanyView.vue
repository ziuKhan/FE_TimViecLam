<script lang="ts" setup>
import { useRoute } from 'vue-router';
import CardJob from '../components/CardJob.vue'
import { ref, watchEffect } from 'vue';
import type { ICompany, IJob } from '../types/backend';
import Loading from '../components/Loading.vue';
import { getCompanyApi } from '../services/company.service';
import { paginateJobsApi } from '../services/job.service';
import { linkUploads } from '../constant/api';

const route = useRoute()

const dataCompany = ref<ICompany>({})
const dataJobs = ref<IJob[]>([])
const load = ref<boolean>(false)

const getData = async () => {
  load.value = false
  const id = route.params.id as string;
  const params = `?current=1&pageSize=20&isActive=true&company._id=${id}`
  try {
    const [companies, jobs] = await Promise.all([getCompanyApi(id), paginateJobsApi(params)]);
    dataCompany.value = companies
    dataJobs.value = jobs
    load.value = true

  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

watchEffect(() => {
  getData()
})
</script>

<template>
  <Loading v-if="!load"></Loading>
  <div class="theme_gray_no_border" v-else>
    <header class="theme_blackred w-full min-h-56 py-8">
      <div class="w-11/12 mx-auto flex gap-x-6">
        <div class="min-w-40 max-w-40 h-40 bg-white rounded-md p-2">
          <img class="h-full object-contain" :src="linkUploads('company/'+dataCompany.logo)" alt="" />
        </div>
        <div class="text-white w-7/12">
          <div class="text-3xl font-bold mb-3">
            {{ dataCompany.name }}
          </div>
          <div class="text-sm font-normal flex">
            <div class="mr-5 flex gap-x-2">
              <img src="../assets/image/icon/icons8_address.svg" alt="" />
              {{ dataCompany.address }}

            </div>
            <RouterLink to="#job" class="flex gap-x-2 hover:underline">
              <img src="../assets/image/icon/icons8_suitcase.svg" alt="" />
              {{ dataJobs.length }} Việc làm đang tuyển dụng</RouterLink
            >
          </div>
          <div class="flex mt-5">
            <button
              class="bg-red-600 text-white text-base min-w-44 font-bold py-3 px-6 rounded-lg mr-5 hover:bg-red-700"
            >
              Viết đánh giá
            </button>
            <button
              class="bg-white hover:bg-red-100 min-w-44 text-red-600 border-solid border-red-600 border text-base font-bold py-3 px-6 rounded-lg"
            >
              Theo dõi
            </button>
          </div>
        </div>
        <div class="w-5/12"></div>
      </div>
    </header>

    <div class="w-11/12 mx-auto py-10 flex">
      <div class="w-4/6 pr-5">
        <div class="bg-white shadow-gray-500 drop-shadow-lg rounded-xl p-5">
          <h2 class="border-b border-gray-300 border-dashed pb-5 text-2xl font-bold">
            Giới thiệu công ty
          </h2>
          <div v-html="dataCompany.description" class="font-normal text-base font-sans leading-9">
           
          </div>
        </div>
      </div>
      <div class="w-2/6" id="job">
        <h2 class="py-3 text-2xl font-bold">{{ dataJobs.length }} việc làm đang tuyển dụng</h2>
        <div class="max-h-full overflow-y-auto">
          <template v-for="data in dataJobs" :key="data.id">
              <CardJob
              class="mb-5"
              :_id="data._id"
              :name="data.name"
            :address="data.location"
            :logo="data.company?.logo"
            :salary="data.salary?.toString()"
            :nameCompany="data.company?.name"
            ></CardJob>
          </template>
         
        </div>
      </div>
    </div>
  </div>
</template>




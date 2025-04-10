<script lang="ts" setup>
import { useRoute } from 'vue-router';
import CardJob from '../../components/user/CardJob.vue'
import { ref, watchEffect } from 'vue';
import type { ICompany, IJob } from '../../types/backend';
import Loading from '../../components/Loading.vue';
import { linkUploads } from '../../constant/api';
import apiService from '../../services/api.service';
import { formatSalary } from '../../until/until';

const route = useRoute()

const dataCompany = ref<ICompany>({})
const dataJobs = ref<IJob[]>([])
const load = ref<boolean>(false)

const getData = async () => {
  load.value = false
  const id = route.params.id as string;
  const params = `?current=1&pageSize=20&isActive=true&filter=companyId=${id},populate=companyId`
  try {
    const [companies, jobs] = await Promise.all([apiService.get('companies/client/' + id), apiService.get('jobs/client' + params)]);
    dataCompany.value = companies.data
    dataJobs.value = jobs.data.result
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
  <div v-else class="theme_gray_no_border">
    <header class="theme_blackred w-full min-h-56 py-8">
      <div class="w-11/12 mx-auto flex gap-x-6">
        <div class="min-w-32  max-h-32 max-w-32 lg:min-w-40 lg:max-w-40 lg:max-h-40  bg-white rounded-md p-2">
          <img loading="lazy" class="h-full object-contain" :src="linkUploads('company/' + dataCompany.logo)" alt="" />
        </div>
        <div class="text-white w-7/12">
          <div class="text-3xl font-bold mb-3">
            {{ dataCompany.name }}
          </div>
          <div class="text-sm font-normal flex gap-y-3 lg:gap-0  lg:flex-nowrap flex-wrap">
            <div class="mr-5 flex gap-x-2 w-full lg:w-auto">
              <img loading="lazy" src="../../assets/image/icon/icons8_address.svg" alt="" />
              {{ Array.isArray(dataCompany.address) ? (dataCompany.address.length > 0 ? dataCompany.address.join(', ') :
                '') : dataCompany.address }}
            </div>
            <RouterLink to="#job" class="flex gap-x-2 hover:underline">
              <img loading="lazy" src="../../assets/image/icon/icons8_suitcase.svg" alt="" />
              {{ dataJobs.length }} Việc làm đang tuyển dụng
            </RouterLink>
          </div>
          <div class="flex mt-5">
            <button
              class="bg-red-600 text-white lg:text-base text-sm min-w-28  lg:min-w-44 lg:font-bold lg:py-3 p-2 lg:px-6 rounded-lg mr-5 hover:bg-red-700">
              Viết đánh giá
            </button>
            <button
              class="bg-white hover:bg-red-100 text-red-600 border-solid border-red-600 border lg:text-base text-sm min-w-28  lg:min-w-44 lg:font-bold lg:py-3 p-2 lg:px-6 rounded-lg">
              Theo dõi
            </button>
          </div>
        </div>
        <div class="w-5/12"></div>
      </div>
    </header>

    <div class="w-11/12 mx-auto py-10 flex flex-wrap lg:flex-nowrap">
      <div class="w-full lg:w-4/6 lg:pr-5">
        <div class="bg-white shadow-gray-500 drop-shadow-lg rounded-xl p-5">
          <h2 class="border-b border-gray-300 border-dashed pb-5 text-2xl font-bold">
            Giới thiệu công ty
          </h2>
          <div v-html="dataCompany.description" class="font-normal text-base font-sans leading-9 overflow-hidden">

          </div>
        </div>
      </div>
      <div class="w-full lg:w-2/6" id="job">
        <h2 class="py-3 text-2xl font-bold">{{ dataJobs.length }} việc làm đang tuyển dụng</h2>
        <div class="max-h-full overflow-y-auto">
          <template v-for="data in dataJobs" :key="data.id">
            <CardJob class="mb-5" :_id="data._id" :name="data.name" :address="data.location"
              :logo="data.companyId?.logo" :isSalary="data.isSalary"  :salary="formatSalary(data.salaryFrom?.toString() || 0) + ' - ' + formatSalary(data.salaryTo?.toString() || 0) " :nameCompany="data.companyId?.name"
              :company_id="data.companyId?._id">
            </CardJob>
          </template>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { IJob } from '../types/backend';
import { getJobsApi } from '../services/job.service';
import { linkUploads } from '../constant/api';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import Loading from '../components/Loading.vue';
import { formatSalary } from '../until/until';
import ApplyJob from '../components/modal/ApplyJob.vue';
import { useAuthStore } from '../stores/AuthStore';
import { message } from 'ant-design-vue';
import { createResumeApi } from '../services/resume.service';

const route = useRoute()
const load = ref<Boolean>(false)
const data = ref<IJob>()
const open = ref<Boolean>(false)
const router = useRouter()
const storeAuth = useAuthStore()
const loadButton = ref<Boolean>(true)
const getData = async () => {
    load.value = false
    const id = route.params.id as string    
    try {
        const result = await getJobsApi(id) 
        result.startDate = formatDistanceToNow(parseISO(result.startDate), { addSuffix: true, locale: vi })
        data.value =result
        load.value= true
    } catch (error) {
        console.error('Error fetching data:', error)
    }
}
const urlFile = ref<string>('')

const handleOk = async () => {
  if (storeAuth.isAuth) {
    if (urlFile.value) {
        loadButton.value = false
        const dataCreate = {
            url: urlFile.value,
            jobId: data.value?._id,
            companyId: data.value?.company?._id
        }
        try
        {

            const res = await createResumeApi(dataCreate)
            if (res) {
                message.success('Rải CV thành công')
                loadButton.value = true

            }
        }
        catch (error) {
            console.log(error)
                 loadButton.value = true
            
        }
       
    }
  } else {
    router.push(`/login`);
  }
  open.value = false;
};


onMounted(() => {
    getData()
})

</script>


<template >
    <Loading v-if="!load"></Loading>

    <div v-else class="theme_gray_no_border relative">

        <div class="w-11/12 mx-auto flex gap-y-4 lg:gap-0 py-8 flex-wrap lg:flex-nowrap">
            <div class="w-full lg:w-8/12 lg:mr-5">
                <div class="bg-white px-5 py-3 rounded-xl rounded-b-none sticky top-[65px] z-10 shadow-custom">
                    <h1 class="font-bold text-[20px] lg:text-[25px] mt-4">{{ data?.name }} - <span class="text-red-600">{{ data?.level }}</span> 
                    </h1>
                    <p class="text-base lg:text-lg font-light">HCL Vietnam Company Limited                </p>
                    <div class="text-[#0AB305] flex gap-x-2 items-center font-bold text-base">
                        <img class="max-w-6 "  src="../assets/image/icon/icons8_us_dollar.svg" alt="">
                        {{  formatSalary(data?.salary) }}
                    </div>
                    <button @click="open = true" class="w-full bg-[#ed1b2f] rounded-md text-white font-semibold text-base py-2 mt-4 hover:bg-red-700">Ứng tuyển</button>
                    <a-modal
                    v-model:open="open"
                    width="600px"
                    title="Ứng tuyển JOB"
                    @ok="handleOk"
                    :okText="storeAuth.isAuth ? `Xác nhận` : `Đăng nhập ngay`"
                    cancelText="Huỷ bỏ"
                    :maskClosable="false"
                    :loading="loadButton"
                    :cancelButtonProps="{ style: { display: 'none' } }"
                    :okButtonProps="{ style: { background: '#ed1b2f' },   disabled: storeAuth.isAuth ? urlFile === '' : false }"
                    >
                    <hr />
                    <ApplyJob :nameJob="data?.name" :nameCompany="data?.company?.name" v-model:urlFile="urlFile" />
                    </a-modal>

                </div>

                <div class="bg-white px-5 py-3 rounded-xl rounded-t-none drop-shadow-lg shadow-gray-500 text-sm lg:text-base font-normal pb-10">
                    <div class="flex gap-1 mb-2"> <img class="max-w-5" src="../assets/image/icon/icons8_address_2.svg" alt=""> {{ data?.location }}
                    </div>
                    <div class="flex gap-1 mb-2"> <img class="max-w-5" src="../assets/image/icon/icons8_office.svg" alt="">Tại văn phòng</div>
                    <div class="flex gap-1 mb-2"> <img class="max-w-5" src="../assets/image/icon/icons8_time.svg" alt="">{{ data?.startDate }}</div>
                    <div class="flex flex-wrap gap-2 lg:text-base text-sm font-light mt-3" >Kỹ năng:
                        <template v-for="skill in data?.skills" :key="data">
                            <RouterLink to="" class="border border-solid border-gray-300 px-2 py-1 rounded-full text-[13px] lg:text-[14px] font-normal mr-2 hover:border-gray-500" >{{ skill }}</RouterLink >
                        </template>
                       
                    </div>
                </div>

                <div class="bg-white w-full  shadow-gray-500 drop-shadow-lg rounded-xl p-5 mt-6">
                    <h2 class="border-b border-gray-300 border-dashed pb-5 text-2xl font-bold">
                        Mô tả công việc
                    </h2>
                    <div v-html="data?.description" class="font-normal text-base font-sans leading-9">
                    </div>
                </div>

              
            </div>
            <div class="w-full lg:w-4/12 ">
                <div class="bg-white px-5 py-3 rounded-xl  drop-shadow-lg shadow-gray-500 sticky top-[65px] z-10">
                    <div class="flex gap-x-3">
                    <div class="max-w-32 h-32 p-2 rounded-md border border-solid border-gray-300"><img class="h-full object-contain"  :src="linkUploads('company/'+data?.company?.logo)" alt=""></div>
                    <div>
                        <h2 class="text-lg font-bold">{{ data?.company?.name }}</h2>
                        <RouterLink :to="`/company/${data?.company?._id}`" class="text-[#0e2eed] font-normal text-base">Xem công ty</RouterLink>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.shadow-custom {
  box-shadow: -4px -4px 10px rgba(0, 0, 0, 0.1), 4px -4px 10px rgba(0, 0, 0, 0.1);
}
</style>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { IJob } from '../../types/backend';
import { linkUploads } from '../../constant/api';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import Loading from '../../components/Loading.vue';
import { formatSalary } from '../../until/until';
import ApplyJob from '../../components/user/modal/ApplyJob.vue';
import { message } from 'ant-design-vue';
import resumeService from '../../services/resume.service';
import jobService from '../../services/job.service';
import accountService from '../../constant/account.service';
import CardJob from '../../components/user/CardJob.vue';
import { format } from "date-fns";

const route = useRoute()
const load = ref<Boolean>(false)
const data = ref<IJob>()
const dataJob = ref<IJob[]>([])

const open = ref<Boolean>(false)
const router = useRouter()
const loadButton = ref<Boolean>(true)
const { account, storage } = accountService.getAccount();
const meta = ref({
    current: 1,
    pageSize: 9,
    pages: 1,
    total: 5
})
const getData = async () => {
    load.value = false
    const id = route.params.id as string
    try {
        const result = await jobService.getApi(id)
        data.value = result.data
        load.value = true
    } catch (error) {
        console.error('Error fetching data:', error)
    }
}
const getJob = async () => {
    try {
        const result = await jobService.paginateApi(`?current=1&pageSize=${meta.value.pageSize}&populate=companyId&sort=-createdAt&isActive=true&level=${data.value?.level}`)
        dataJob.value = result.result
        meta.value = result.meta
    } catch (error) {
        console.error('Error fetching data:', error)
    }
}

const urlFile = ref<string>('')
const description = ref<string>('')

const handleOk = async () => {
    if (account) {
        if (urlFile.value) {
            loadButton.value = false

            const dataCreate = {
                url: urlFile.value,
                description: description.value,
                jobId: data.value?._id,
                companyId: data.value?.companyId?._id
            }

            try {
                const res = await resumeService.createApi(dataCreate)
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


const onChangePageSize = () => {
    meta.value.pageSize += 6;
    getJob()
}

onMounted(async () => {
    await getData()
    getJob()
})

</script>


<template>
    <Loading v-if="!load"></Loading>

    <div v-else class="theme_gray_no_border relative py-10">

        <div class="w-11/12 mx-auto flex gap-y-4 lg:gap-0  flex-wrap lg:flex-nowrap">
            <div class="w-full lg:w-8/12 lg:mr-5">
                <div class="bg-white px-5 py-3 rounded-xl rounded-b-none sticky top-[65px] z-10 shadow-custom">
                    <h1 class="font-bold text-[20px] lg:text-[25px] mt-4">{{ data?.name }} - <span
                            class="text-red-600">{{ data?.level }}</span>
                    </h1>
                    <p class="text-base lg:text-lg font-light">HCL Vietnam Company Limited </p>
                    <div class="text-[#0AB305] flex gap-x-2 items-center font-bold text-base">
                        <img loading="lazy" class="max-w-6 " src="../../assets/image/icon/icons8_us_dollar.svg" alt="">
                        {{ formatSalary(data?.salary) }}
                    </div>
                    <button @click="open = true"
                        class="w-full bg-[#ed1b2f] rounded-md text-white font-semibold text-base py-2 mt-4 hover:bg-red-700">Ứng
                        tuyển</button>
                    <a-modal v-model:open="open" width="600px" title="Ứng tuyển JOB" @ok="handleOk"
                        :okText="account ? `Xác nhận` : `Đăng nhập ngay`" cancelText="Huỷ bỏ" :maskClosable="false"
                        :loading="loadButton" :cancelButtonProps="{ style: { display: 'none' } }"
                        :okButtonProps="{ style: { background: '#ed1b2f' }, disabled: account ? urlFile === '' : false }">
                        <hr />
                        <ApplyJob :nameJob="data?.name" :nameCompany="data?.companyId?.name" v-model:urlFile="urlFile"
                            v-model:description="description" />
                    </a-modal>

                </div>

                <div
                    class="flex flex-wrap bg-white px-5 py-3 rounded-xl rounded-t-none drop-shadow-lg shadow-gray-500 text-sm lg:text-base font-normal pb-10">
                    <div class="w-1/2">
                        <div class="flex gap-1 mb-2"> <img loading="lazy" class="max-w-5"
                                src="../../assets/image/icon/icons8_address_2.svg" alt=""> {{ data?.location }}
                        </div>
                        <div class="flex gap-1 mb-2"> <img loading="lazy" class="max-w-5"
                                src="../../assets/image/icon/icons8_office.svg" alt="">Tại văn phòng</div>
                        <div class="flex gap-1 mb-2"> <img loading="lazy" class="max-w-5"
                                src="../../assets/image/icon/icons8_time.svg" alt="">{{ data?.createdAt ?
                                    formatDistanceToNow(new Date(data.createdAt), { addSuffix: true, locale: vi }) : 'N/A' }}
                        </div>

                    </div>
                    <div class="w-1/2">
                        <div class="flex gap-1 mb-2"> <img loading="lazy" class="max-w-5"
                                src="../../assets/image/icon/icons8_start.svg" alt="">Ngày bắt đầu: {{
                                    data?.startDate ? format(new Date(data.startDate), 'dd/MM/yyyy ') : 'N/A' }}
                        </div>

                        <div class="flex gap-1 mb-2"> <img loading="lazy" class="max-w-5"
                                src="../../assets/image/icon/icons8_end_1.svg" alt="">Ngày Kết thúc: {{
                                    data?.endDate ? format(new Date(data.endDate), 'dd/MM/yyyy ') : 'N/A' }}
                        </div>
                        <div class="flex gap-1 mb-2"> <img loading="lazy" class="max-w-5"
                                src="../../assets/image/icon/icons8_user.svg" alt="">Số lượng: {{
                                    data?.quantity }}
                        </div>
                    </div>
                    <div class="flex flex-wrap gap-2 lg:text-base text-sm font-light mt-3">Kỹ năng:
                        <template v-for="skill in data?.skills" :key="skill">
                            <RouterLink to=""
                                class="border border-solid border-gray-300 px-2 py-1 rounded-full text-[13px] lg:text-[14px] font-normal mr-2 hover:border-gray-500">
                                {{ skill }}</RouterLink>
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
                        <div class="max-w-32 h-32 p-2 rounded-md border border-solid border-gray-300"> <img
                                loading="lazy" class="h-full object-contain"
                                :src="linkUploads('company/' + data?.companyId?.logo)" alt="">
                        </div>
                        <div>
                            <h2 class="text-lg font-bold">{{ data?.companyId?.name }}</h2>
                            <RouterLink :to="`/company/${data?.companyId?._id}`"
                                class="text-[#0e2eed] font-normal text-base">Xem
                                công
                                ty</RouterLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="w-11/12 mx-auto mt-8  p-20px-5 py-3 flex justify-center flex-wrap ">
            <h2 class="text-left border-b-2 border-red-800 text-2xl font-semibold w-full">Công việc tương tự</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mx-auto">
                <template v-for="data in dataJob" :key="data._id">
                    <CardJob :_id="data._id" :name="data.name" :address="data.location" :logo="data.companyId?.logo"
                        :salary="data.salary?.toString()" :nameCompany="data.companyId?.name"
                        :company_id="data.companyId?._id">
                    </CardJob>
                </template>
            </div>
            <button v-if="meta.pageSize < meta.total" @click="onChangePageSize()"
                class="w-2/5 bg-white mt-4  rounded-lg px-5 py-2 shadow-lg hover:border-red-500 border-2 hover:bg-red-100 hover:text-red-600">Xem
                thêm
                công
                việc</button>


        </div>
    </div>
</template>

<style>
.shadow-custom {
    box-shadow: -4px -4px 10px rgba(0, 0, 0, 0.1), 4px -4px 10px rgba(0, 0, 0, 0.1);
}
</style>
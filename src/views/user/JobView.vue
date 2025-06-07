<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { IJob } from '../../types/backend'
import { linkUploads } from '../../constant/api'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { vi } from 'date-fns/locale'
import Loading from '../../components/Loading.vue'
import { formatSalary } from '../../until/until'
import ApplyJob from '../../components/user/modal/ApplyJob.vue'
import { message } from 'ant-design-vue'
import accountService from '../../services/account.service'
import CardJob from '../../components/user/CardJob.vue'
import { format } from 'date-fns'
import apiService from '../../services/api.service'
import {
  FileDoneOutlined,
  SketchOutlined,
  UserAddOutlined,
  UserOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  GlobalOutlined,
  ClockCircleOutlined
} from '@ant-design/icons-vue'

const route = useRoute()
const load = ref<Boolean>(false)
const data = ref<IJob>()
const dataJob = ref<IJob[]>([])

const open = ref<Boolean>(false)
const router = useRouter()
const loadButton = ref<Boolean>(true)
const { account, storage } = accountService.getAccount()
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
    const result = await apiService.get('jobs/client/' + id)
    data.value = result.data
  } catch (error) {
    console.error('Error fetching data:', error)
    router.push('/404')
  } finally {
    load.value = true
  }
}
const getJob = async () => {
  try {
    const result = await apiService.get(
      `jobs/client?current=1&pageSize=${meta.value.pageSize}&filter=populate=companyId,isActive=true,level=${data.value?.level},sort=-createdAt,_id!=${data.value?._id}`
    )
    dataJob.value = result.data.result
    meta.value = result.data.meta
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const urlFile = ref<string>('')
const description = ref<string>('')

const openModalApply = () => {
  open.value = true
  urlFile.value = ''
  description.value = ''
}

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
        const res = await apiService.add('resumes/client', dataCreate)
        if (res) {
          message.success('Rải CV thành công')
          getData()
        }
      } catch (error: any) {
        message.error(error.response.data.message)
      } finally {
        loadButton.value = true
      }
    }
  } else {
    router.push(`/login`)
  }
  open.value = false
}

const onChangePageSize = () => {
  meta.value.pageSize += 6
  getJob()
}

const getWorkingDays = (workingDays: string[] | undefined) => {
  if (!workingDays || workingDays.length === 0) return 'Không có thông tin'

  const days = {
    monday: 'Thứ 2',
    tuesday: 'Thứ 3',
    wednesday: 'Thứ 4',
    thursday: 'Thứ 5',
    friday: 'Thứ 6',
    saturday: 'Thứ 7',
    sunday: 'Chủ nhật'
  }

  if (workingDays.includes('monday') && workingDays.includes('friday')) {
    return 'Thứ 2 - Thứ 6'
  }

  return workingDays.map((day: string) => days[day as keyof typeof days] || day).join(', ')
}

onMounted(async () => {
  await getData()
  getJob()
})
</script>

<template>
  <Loading v-if="!load"></Loading>

  <div v-else class="theme_gray_no_border relative py-10">
    <div class="w-11/12 mx-auto flex gap-y-4 lg:gap-0 flex-wrap lg:flex-nowrap">
      <div class="w-full lg:w-8/12 lg:mr-5">
        <div class="bg-white px-5 py-3 rounded-xl rounded-b-none top-[65px] z-10 shadow-custom">
          <h1 class="font-bold text-[20px] lg:text-[25px] mt-4">
            {{ data?.name }} - <span class="text-red-600">{{ data?.level }}</span>
          </h1>
          <p class="text-base lg:text-lg font-light">HCL Vietnam Company Limited</p>
          <div class="flex gap-x-2 justify-between">
            <div class="text-[#0AB305] flex gap-x-2 items-center font-bold text-base w-1/2">
              <img
                loading="lazy"
                class="max-w-6"
                src="../../assets/image/icon/icons8_us_dollar.svg"
                alt=""
              />
              <span class="mr-2" v-if="account?._id">
                {{
                  !data?.isSalary
                    ? formatSalary(data?.salaryFrom?.toString() || 0) +
                      ' - ' +
                      formatSalary(data?.salaryTo?.toString() || 0)
                    : 'Thoả thuận'
                }}
              </span>

              <RouterLink v-else to="/login"> Đăng nhập để xem </RouterLink>
            </div>
            <div class="w-1/2 flex items-center gap-x-2">
              <div v-if="account?.role?.name && account?.role?.name != 'NORMAL_USER'">
                <FileDoneOutlined class="text-[#0AB305] font-bold text-2xl mr-1" />
                <span class="text-[#0AB305] font-bold text-base"
                  ><span class="text-xl text-green-600">{{ data?.countResume || 0 }} </span> hồ sơ
                  đã ứng tuyển</span
                >
              </div>
              <div v-else>
                <SketchOutlined class="text-red-600 font-bold text-2xl" />
                <RouterLink to="/sub-package" class="text-red-600 font-bold text-base"
                  >Nâng cấp tài khoản để xem số người nộp CV</RouterLink
                >
              </div>
            </div>
          </div>

          <button
            @click="openModalApply"
            class="w-full bg-[#ed1b2f] rounded-md text-white font-semibold text-lg py-3 mt-4 hover:bg-red-700"
          >
            Ứng tuyển
          </button>
          <a-modal
            v-model:open="open"
            width="600px"
            title="Ứng tuyển JOB"
            @ok="handleOk"
            :okText="account ? `Xác nhận` : `Đăng nhập ngay`"
            cancelText="Huỷ bỏ"
            :maskClosable="false"
            :loading="loadButton"
            :cancelButtonProps="{ style: { display: 'none' } }"
            :okButtonProps="{
              style: { background: '#ed1b2f' },
              disabled: account ? urlFile === '' : false
            }"
          >
            <hr />
            <ApplyJob
              :nameJob="data?.name"
              :nameCompany="data?.companyId?.name"
              v-model:urlFile="urlFile"
              v-model:description="description"
            />
          </a-modal>
        </div>

        <div
          class="flex flex-wrap bg-white px-5 py-3 rounded-xl rounded-t-none drop-shadow-lg shadow-gray-500 text-sm lg:text-base font-normal pb-10"
        >
          <div class="w-1/2">
            <div class="flex gap-1 mb-2">
              <img
                loading="lazy"
                class="max-w-5"
                src="../../assets/image/icon/icons8_address_2.svg"
                alt=""
              />
              {{ data?.location }}
            </div>
            <div class="flex gap-1 mb-2">
              <img
                loading="lazy"
                class="max-w-5"
                src="../../assets/image/icon/icons8_office.svg"
                alt=""
              />Tại văn phòng
            </div>
            <div class="flex gap-1 mb-2">
              <img
                loading="lazy"
                class="max-w-5"
                src="../../assets/image/icon/icons8_time.svg"
                alt=""
              />{{
                data?.createdAt
                  ? formatDistanceToNow(new Date(data.createdAt), { addSuffix: true, locale: vi })
                  : 'N/A'
              }}
            </div>
          </div>
          <div class="w-1/2">
            <div class="flex gap-1 mb-2">
              <img
                loading="lazy"
                class="max-w-5"
                src="../../assets/image/icon/icons8_start.svg"
                alt=""
              />Ngày bắt đầu:
              {{ data?.startDate ? format(new Date(data.startDate), 'dd/MM/yyyy ') : 'N/A' }}
            </div>

            <div class="flex gap-1 mb-2">
              <img
                loading="lazy"
                class="max-w-5"
                src="../../assets/image/icon/icons8_end_1.svg"
                alt=""
              />Ngày Kết thúc:
              {{ data?.endDate ? format(new Date(data.endDate), 'dd/MM/yyyy ') : 'N/A' }}
            </div>
            <div class="flex gap-1 mb-2">
              <img
                loading="lazy"
                class="max-w-5"
                src="../../assets/image/icon/icons8_user.svg"
                alt=""
              />Số lượng: {{ data?.quantity }}
            </div>
          </div>
          <div class="flex flex-wrap gap-2 lg:text-base text-sm font-light mt-3">
            Kỹ năng:
            <template v-for="skill in data?.skills" :key="skill">
              <RouterLink
                :to="`/search?search=${skill.name}`"
                class="border border-solid border-gray-300 px-2 py-1 rounded-full text-[13px] lg:text-[14px] font-normal mr-2 hover:border-gray-500"
              >
                {{ skill.name }}</RouterLink
              >
            </template>
          </div>
        </div>

        <div class="bg-white w-full shadow-gray-500 drop-shadow-lg rounded-xl p-5 mt-6">
          <h2 class="border-b border-gray-300 border-dashed pb-5 text-2xl font-bold">
            Mô tả công việc
          </h2>
          <div v-html="data?.description" class="font-normal text-base font-sans leading-9"></div>
        </div>
      </div>
      <div class="w-full lg:w-4/12">
        <div
          class="bg-white px-5 py-3 rounded-xl drop-shadow-lg shadow-gray-500 sticky top-[65px] z-10"
        >
          <div>
            <!-- Phần hiển thị cũ -->
            <div class="flex gap-x-3">
              <div class="max-w-32 h-32 p-2 rounded-md border border-solid border-gray-300">
                <img
                  loading="lazy"
                  class="h-full object-contain"
                  :src="linkUploads('company/' + data?.companyId?.logo)"
                  alt=""
                />
              </div>
              <div>
                  <RouterLink
                    :to="`/company/${data?.companyId?._id}`"
                    class="w-full text-lg font-bold hover:text-red-500"
                  >
                    {{ data?.companyId?.name }}
                  </RouterLink>
                <!-- Thông tin bổ sung -->
                <div class="company-info mt-4 border-t pt-3 border-gray-200">
                  <div class="info-item">
                    <EnvironmentOutlined class="info-icon" />
                    <span>{{
                      data?.companyId?.fullAddress || data?.companyId?.address?.join(', ')
                    }}</span>
                  </div>

                  <div class="info-row">
                    <div class="info-item">
                      <TeamOutlined class="info-icon" />
                      <span>{{ data?.companyId?.size }}</span>
                    </div>

                    <div class="info-item">
                      <GlobalOutlined class="info-icon" />
                      <span>{{ data?.companyId?.type }}</span>
                    </div>
                  </div>

                  <div class="info-row">
                    <div class="info-item">
                      <ClockCircleOutlined class="info-icon" />
                      <span>{{ getWorkingDays(data?.companyId?.workingDays) }}</span>
                    </div>

                    <div v-if="data?.companyId?.overtimePolicy" class="ot-policy">
                      {{ data?.companyId?.overtimePolicy }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="w-11/12 mx-auto mt-8 p-20px-5 py-3 flex justify-center flex-wrap">
      <h2 class="text-left border-b-2 border-red-800 text-2xl font-semibold w-full">
        Công việc tương tự
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mx-auto">
        <template v-for="data in dataJob" :key="data._id">
          <CardJob :data="data"> </CardJob>
        </template>
      </div>
      <button
        v-if="meta.pageSize < meta.total"
        @click="onChangePageSize()"
        class="w-2/5 bg-white mt-4 rounded-lg px-5 py-2 shadow-lg hover:border-red-500 border-2 hover:bg-red-100 hover:text-red-600"
      >
        Xem thêm công việc
      </button>
    </div>
  </div>
</template>

<style scoped>
.shadow-custom {
  box-shadow:
    -4px -4px 10px rgba(0, 0, 0, 0.1),
    4px -4px 10px rgba(0, 0, 0, 0.1);
}

.logo-container {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  padding: 8px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.company-logo {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.company-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.75rem;
}

.company-info {
  margin-bottom: 1rem;
}

.info-row {
  display: flex;
  gap: 1.5rem;
  margin-top: 0.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4b5563;
  font-size: 0.875rem;
}

.info-icon {
  color: #6b7280;
  font-size: 0.875rem;
}

.ot-policy {
  display: inline-flex;
  align-items: center;
  background-color: #dbeafe;
  color: #1d4ed8;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.view-company-btn {
  display: inline-flex;
  align-items: center;
  color: #2563eb;
  font-weight: 500;
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  background-color: #eff6ff;
  transition: all 0.2s ease;
}

.view-company-btn:hover {
  background-color: #dbeafe;
  color: #1d4ed8;
}
</style>

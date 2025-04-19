<script lang="ts" setup>
import { onMounted, onUpdated, ref, watch } from 'vue'

import useCompanyStore from '../../../stores/admin/CompanyStore'
import CKEditor from '../../../components/CKEditor.vue'
import type { UploadRequestOption } from 'ant-design-vue/es/vc-upload/interface'
import { message } from 'ant-design-vue'
import useJobStore from '../../../stores/admin/JobStore'
import { LEVELS_LIST, SKILLS_LIST } from '../../../until/until'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import accountService from '../../../services/account.service'
import type { ILocation } from '../../../types/backend'
import { getConscious } from '../../../services/location.service'
import apiService from '../../../services/api.service'
import useSkillStore from '../../../stores/admin/SkillStore'
import UpdateSkill from '../Skills/UpdateSkill.vue'

const value1 = ref<Dayjs[] | undefined>([])
watch(value1, (newValue) => {
  if (newValue) {
    store.form.startDate = newValue[0]?.toDate()
    store.form.endDate = newValue[1]?.toDate()
  } else {
    store.form.startDate = new Date()
    store.form.endDate = new Date()
  }
})
const storeSkill = useSkillStore()
const store = useJobStore()

const formRef = ref<any>(null)
const { account } = accountService.getAccount()

const rangePickerRef = ref<any>(null)
const handleOk = () => {
  formRef.value
    .validate()
    .then(() => {
      // Validate ngày bắt đầu và kết thúc
      if (!store.form.startDate || !store.form.endDate) {
        message.error('Vui lòng nhập ngày bắt đầu và kết thúc!')
        rangePickerRef.value.$el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        return
      }

      // Validate ngày kết thúc phải lớn hơn ngày bắt đầu
      if (store.form.endDate < store.form.startDate) {
        message.error('Ngày kết thúc phải lớn hơn ngày bắt đầu!')
        rangePickerRef.value.$el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        return
      }

      // Validate lương nếu không phải là lương thỏa thuận
      if (!store.form.isSalary) {
        if (!store.form.salaryFrom) {
          message.error('Vui lòng nhập lương tối thiểu!')
          return
        }
        if (!store.form.salaryTo) {
          message.error('Vui lòng nhập lương tối đa!')
          return
        }
        if (store.form.salaryFrom > store.form.salaryTo) {
          message.error('Lương tối thiểu không được lớn hơn lương tối đa!')
          return
        }
        if (store.form.salaryFrom < 0 || store.form.salaryTo < 0) {
          message.error('Lương không được nhỏ hơn 0!')
          return
        }
      }
      store.updateAndAdd()
    })
    .catch(() => {
      message.error('Vui lòng kiểm tra lại các trường đã nhập!')
    })
}

const dataCompany = ref<any[]>([])
const getCompanies = async () => {
  try {
    const res = await apiService.get('companies?page=1&pageSize=200&isActive=true&sort=-createdAt')
    dataCompany.value = res.data.result
  } catch (err) {
    console.log(err)
  }
}

const dataLocation = ref<ILocation[]>([])
const loadDataLocation = async () => {
  try {
    const res = await getConscious()
    if (res) {
      dataLocation.value = res.data
    }
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  getCompanies()
  loadDataLocation()
})
onUpdated(() => {
  if (store.form._id) {
    value1.value = [dayjs(store.form.startDate), dayjs(store.form.endDate)]
  } else {
    value1.value = []
  }
})
</script>

<template>
  <a-modal
    :title="store.form._id ? 'Cập nhật công việc' : 'Tạo mới công việc'"
    :okText="store.form._id ? 'Cập nhật' : 'Thêm mới'"
    :width="850"
    v-model:open="store.openModal"
    :maskClosable="false"
    :cancelButtonProps="{ style: { display: 'none' } }"
    @ok="handleOk"
    :confirm-loading="store.loading"
  >
    <a-form :model="store.form" ref="formRef" layout="vertical" class="py-3">
      <a-row :gutter="16">
        <a-col :span="21">
          <a-form-item
            label="Tên"
            name="name"
            class="mb-4"
            :rules="[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]"
          >
            <a-input v-model:value="store.form.name" placeholder="Vui lòng nhập name" />
          </a-form-item>
        </a-col>
        <a-col :span="3">
          <a-form-item label="Trạng thái" name="isActive" class="mb-4">
            <a-switch v-model:checked="store.form.isActive" />
          </a-form-item>
        </a-col>

        <a-col :span="24">
          <a-form-item
            class="mb-4"
            label="Kĩ năng"
            name="skills"
            :rules="[{ required: true, message: 'Vui lòng nhập kĩ năng!' }]"
          >
          <div class="flex gap-2">
            <a-select
              v-model:value="store.form.skills"
              allowClear
              mode="multiple"
              style="width: 100%"
              placeholder="Vui lòng chọn kĩ năng..."
              :options="storeSkill.allDataSkill"
              :field-names="{ label: 'name', value: '_id' }"
            >
            </a-select>
            <a-button type="primary" @click="storeSkill.handleOpenModal()">Thêm kĩ năng</a-button>
          </div>
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <label for="minSalary"
            >Lương tối thiểu |
            <span class="ml-1">
              <a-checkbox
                id="isSalary"
                @change="
                  () => {
                    if (store.form.isSalary) {
                      store.form.salaryFrom = 0
                      store.form.salaryTo = 0
                    }
                  }
                "
                :disabled="store.form.salaryFrom || store.form.salaryTo"
                v-model:checked="store.form.isSalary"
              />
              <label for="isSalary" class="ml-1">Thoả thuận</label>
            </span>
          </label>
          <div class="flex gap-2 mt-[10px]">
            <a-form-item class="mb-4" name="salaryFrom">
              <a-input-number
                :disabled="store.form.isSalary"
                v-model:value="store.form.salaryFrom"
                placeholder="Từ"
                class="w-full"
                min="1"
                :formatter="(value: string) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="(value: string) => value.replace(/\$\s?|(,*)/g, '')"
              />
            </a-form-item>
            <a-form-item class="mb-4" name="salaryTo">
              <a-input-number
                :disabled="store.form.isSalary || !store.form.salaryFrom"
                v-model:value="store.form.salaryTo"
                placeholder="Đến"
                class="w-full"
                :min="store.form.salaryFrom"
                :formatter="(value: string) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="(value: string) => value.replace(/\$\s?|(,*)/g, '')"
              />
            </a-form-item>
          </div>
        </a-col>

        <a-col :span="12">
          <a-form-item
            class="mb-4"
            label="Số lượng tuyển"
            name="quantity"
            :rules="[{ required: true, message: 'Vui lòng nhập Số lượng tuyển!' }]"
          >
            <a-input-number
              v-model:value="store.form.quantity"
              placeholder="Vui lòng nhập quantity"
              class="w-full"
              min="1"
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item
            class="mb-4"
            label="Trình độ"
            name="level"
            :rules="[{ required: true, message: 'Vui lòng nhập kĩ năng!' }]"
          >
            <a-select
              v-model:value="store.form.level"
              allowClear
              style="width: 100%"
              placeholder="Vui lòng nhập trình độ..."
              :options="LEVELS_LIST"
              show-search
            >
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item class="mb-4" label="Ngày bắt đầu và kết thúc" name="endDate">
            <a-range-picker
              ref="rangePickerRef"
              v-model:value="value1"
              class="w-full"
              format="DD/MM/YYYY"
            />
          </a-form-item>
        </a-col>

        <a-col
          :span="24"
          :style="{
            display:
              account?.role.name === 'HR_USER' ? (account?.companyId ? 'none' : 'block') : 'block'
          }"
        >
          <a-form-item
            class="mb-4"
            label="Công ty"
            name="companyId"
            :rules="[{ required: true, message: 'Vui lòng nhập công ty!' }]"
          >
            <a-select
              v-model:value="store.form.companyId._id"
              allowClear
              style="width: 100%"
              placeholder="Vui lòng công ty..."
              :options="dataCompany"
              :field-names="{ label: 'name', value: '_id' }"
              show-search
            >
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :span="24">
          <a-form-item
            class="mb-6"
            label="Địa chỉ"
            name="location"
            :rules="[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]"
          >
            <a-select
              v-model:value="store.form.location"
              allowClear
              :options="dataLocation"
              :field-names="{ label: 'name', value: 'name' }"
              show-search
              placeholder="Vui lòng nhập location"
              style="width: 100%"
            >
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :span="24">
          <a-form-item
            class="mb-4"
            name="description"
            :rules="[{ required: true, message: 'Vui lòng nhập mô tả!' }]"
          >
            <CKEditor
              :description="store.form.description"
              title="Mô tả"
              v-model="store.form.description"
            >
            </CKEditor>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
  <UpdateSkill> </UpdateSkill>
  
</template>

<style>
.ant-upload,
.ant-upload button {
  width: 100% !important;
}
</style>
../../../services/account.service

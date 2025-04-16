<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'

import useCompanyStore from '../../../stores/admin/CompanyStore'
import CKEditor from '../../../components/CKEditor.vue'
import type { UploadRequestOption } from 'ant-design-vue/es/vc-upload/interface'
import { message } from 'ant-design-vue'
import type { ILocation, ILocationCountry } from '../../../types/backend'
import { getConscious, getCountry, getDistrict, getWard } from '../../../services/location.service'
import apiService from '../../../services/api.service'

// Sử dụng Permission Store
const store = useCompanyStore()
const dataConscious = ref<ILocation[]>([])
const dataDistrict = ref<ILocation[]>([])
const dataWard = ref<ILocation[]>([])
const dataCountry = ref<ILocationCountry[]>([])
const getDataConscious = async () => {
  dataDistrict.value = []
  dataWard.value = []
  store.form.district = ''
  store.form.ward = ''
  try {
    const res = await getConscious()
    if (res) {
      dataConscious.value = res.data
    }
  } catch (error) {
    console.log(error)
  }
}
const getDataCountry = async () => {
  try {
    const res = await getCountry()
    if (res) {
      dataCountry.value = res.data
    }
  } catch (error) {
    console.log(error)
  }
}
const getDataDistrict = async (name: string) => {
  dataWard.value = []
  store.form.ward = ''
  try {
    const id = dataConscious.value.find((item) => item.name === name)?.id
    const res = await getDistrict(id as string)
    if (res) {
      dataDistrict.value = res.data
    }
  } catch (error) {
    console.log(error)
  }
}
const getDataWard = async (name: string) => {
  try {
    const id = dataDistrict.value.find((item) => item.name === name)?.id
    const res = await getWard(id as string)
    if (res) {
      dataWard.value = res.data
    }
  } catch (error) {
    console.log(error)
  }
}

const fileList = ref([])
const handleUpload = async (options: UploadRequestOption) => {
  const { file, onSuccess, onError } = options
  try {
    const res = await apiService.upload(file, 'company')
    if (res) {
      store.form.logo = res.data.fileName
      message.success('Upload file thành công!')
      onSuccess && onSuccess(res)
    }
  } catch (err: any) {
    message.error('Upload file thất bại!')
    onError && onError(err)
  }
}
watch(fileList, () => {
  if (fileList.value.length === 0) {
    store.form.logo = ''
  }
})

const formRef = ref<any>(null)
const handleOk = () => {
  formRef.value
    .validate()
    .then(() => {
      store.updateAndAdd()
    })
    .catch(() => {
      message.error('Vui lòng kiểm tra lại các trường đã nhập!')
    })
}
onMounted(() => {
  getDataConscious()
  getDataCountry()
})
</script>

<template>
  <a-modal
    {{
    }}
    :title="store.form._id ? 'Cập nhật công ty' : 'Tạo mới công ty'"
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
        <a-col :span="15">
          <a-form-item
            label="Tên công ty"
            name="name"
            :rules="[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]"
          >
            <a-input v-model:value="store.form.name" placeholder="Vui lòng nhập name" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item
            label="Vui lòng tải logo lên"
            name="logo"
            :rules="[{ required: true, message: 'Vui lòng tải logo công ty lên!' }]"
          >
            <a-upload
              maxCount="1"
              name="file"
              v-model:file-list="fileList"
              accept="image/png,image/svg+xml,image/x-icon,image/webp"
              :custom-request="handleUpload"
              class="w-full"
            >
              <a-button>
                <upload-outlined></upload-outlined>
                Tải logo công ty
              </a-button>
            </a-upload>
          </a-form-item>
        </a-col>
        <a-col :span="3">
          <a-form-item label="Trạng thái" name="isActive">
            <a-switch v-model:checked="store.form.isActive" />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item
            label="Thuộc quốc gia"
            name="country"
            :rules="[{ required: true, message: 'Vui lòng nhập quốc gia!' }]"
          >
            <a-select
              v-model:value="store.form.country"
              show-search
              option-filter-prop="label"
              placeholder="Vui lòng chọn quốc gia"
              style="width: 100%"
            >
              <a-select-option 
                v-for="item in dataCountry" 
                :key="item.id" 
                :value="item.id"
                :label="item.niceName"
              >
                <span class="flex items-center">
                  {{ item.niceName }}
                  <img :src="item.flag" class="w-4 h-4 ml-2" />
                </span>
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="Tỉnh thành"
            name="province"
            :rules="[{ required: true, message: 'Vui lòng nhập quận/huyện!' }]"
          >
            <a-input v-model:value="store.form.province" placeholder="Vui lòng nhập tỉnh thành" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="Tỉnh thành"
            name="province"
            :rules="[{ required: true, message: 'Vui lòng nhập quận/huyện!' }]"
          >
            <a-select
              v-model:value="store.form.province"
              :options="dataConscious"
              :field-names="{ label: 'name', value: 'name' }"
              show-search
              @change="(value: string) => getDataDistrict(value)"
              placeholder="Vui lòng nhập địa chỉ"
              style="width: 100%"
            >
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="Quận/Huyện"
            name="district"
            :rules="[{ required: true, message: 'Vui lòng nhập quận/huyện!' }]"
          >
            <a-select
              v-model:value="store.form.district"
              :options="dataDistrict"
              :field-names="{ label: 'name', value: 'name' }"
              show-search
              @change="(value: string) => getDataWard(value)"
              placeholder="Vui lòng nhập địa chỉ"
              style="width: 100%"
            >
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="Phường/Xã"
            name="ward"
            :rules="[{ required: true, message: 'Vui lòng nhập phường/xã!' }]"
          >
            <a-select
              v-model:value="store.form.ward"
              :options="dataWard"
              :field-names="{ label: 'name', value: 'name' }"
              show-search
              placeholder="Vui lòng nhập địa chỉ"
              style="width: 100%"
            >
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="Tên đường, Toà nhà, Số nhà"
            name="detailedAddress"
            :rules="[{ required: true, message: 'Vui lòng nhập tên đường/ toà nhà/ số nhà!' }]"
          >
            <a-input
              v-model:value="store.form.detailedAddress"
              placeholder="Vui lòng nhập địa chỉ"
              style="width: 100%"
            >
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="Địa chỉ các văn phòng"
            name="address"
            :rules="[{ required: true, message: 'Vui lòng nhập địa chỉ các văn phòng!' }]"
          >
            <a-select
              v-model:value="store.form.address"
              :options="dataConscious"
              :field-names="{ label: 'name', value: 'name' }"
              mode="multiple"
              placeholder="Vui chọn địa chỉ các văn phòng"
              style="width: 100%"
            >
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="Quy mô công ty"
            name="size"
            :rules="[{ required: true, message: 'Vui lòng chọn quy mô công ty!' }]"
          >
            <a-select
              v-model:value="store.form.size"
              placeholder="Vui lòng chọn quy mô"
              style="width: 100%"
            >
              <a-select-option value="1-50">1-50 nhân viên</a-select-option>
              <a-select-option value="51-200">51-200 nhân viên</a-select-option>
              <a-select-option value="201-500">201-500 nhân viên</a-select-option>
              <a-select-option value="501-1000">501-1000 nhân viên</a-select-option>
              <a-select-option value="1000+">1000+ nhân viên</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item
            label="Ngành nghề"
            name="industry"
            :rules="[{ required: true, message: 'Vui lòng chọn ngành nghề!' }]"
          >
            <a-input v-model:value="store.form.industry" placeholder="Vui lòng nhập ngành nghề" />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item
            label="Ngày làm việc"
            name="workingDays"
            :rules="[{ required: true, message: 'Vui lòng chọn ngày làm việc!' }]"
          >
            <a-select
              v-model:value="store.form.workingDays"
              mode="multiple"
              placeholder="Vui lòng chọn ngày làm việc"
              style="width: 100%"
            >
              <a-select-option value="monday">Thứ 2</a-select-option>
              <a-select-option value="tuesday">Thứ 3</a-select-option>
              <a-select-option value="wednesday">Thứ 4</a-select-option>
              <a-select-option value="thursday">Thứ 5</a-select-option>
              <a-select-option value="friday">Thứ 6</a-select-option>
              <a-select-option value="saturday">Thứ 7</a-select-option>
              <a-select-option value="sunday">Chủ nhật</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item
            label="Chính sách làm thêm giờ"
            name="overtimePolicy"
            :rules="[{ required: true, message: 'Vui lòng nhập chính sách làm thêm giờ!' }]"
          >
            <a-input v-model:value="store.form.overtimePolicy" placeholder="Vui lòng nhập chính sách làm thêm giờ" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            name="description"
            :rules="[{ required: true, message: 'Vui lòng nhập mô tả!' }]"
            class="m-0"
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
</template>

<style>
.ant-upload,
.ant-upload button {
  width: 100% !important;
}
</style>

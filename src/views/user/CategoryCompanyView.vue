<template>
  <div class="theme_gray_no_border">
    <Loading v-if="loading"></Loading>

    <div v-else class="w-11/12 lg:w-10/12 mx-auto py-6">
      <div class="flex flex-col lg:flex-row justify-between items-start mb-6">
        <h1 class="text-xl lg:text-3xl font-bold mb-4 lg:mb-0">Danh sách công ty tại Việt Nam</h1>

        <!-- Tìm kiếm nhỏ gọn -->
        <div class="w-full lg:w-1/3">
          <a-input-search
            v-model:value="searchParams.keyword"
            placeholder="Tìm kiếm công ty"
            size="large"
            enter-button
            @search="onSearch"
          />
        </div>
      </div>

     

      <!-- Hiển thị số lượng kết quả -->
      <div class="mb-4 text-gray-600">
        Tìm thấy {{ pagination.total }} công ty
        <span class="text-red-600">{{ searchParams.keyword }}</span> tại Việt Nam
      </div>

      <!-- Danh sách công ty -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <template v-for="data in dataCompanies" :key="data._id">
            
          <CardEmployer
            :id="data._id"
            :name="data.name"
            :address="data.address"
            :logo="data.logo"
            :jobs="data.jobs"
          >
          </CardEmployer>
        </template>
      </div>

      <!-- Không có kết quả -->
      <div v-if="dataCompanies.length === 0" class="text-center py-10">

        <p class="text-lg text-gray-500">Không tìm thấy công ty nào phù hợp</p>
      </div>

      <!-- Phân trang -->
      <div class="w-full flex justify-center mt-8">
        <a-pagination
          v-model:current="searchParams.current"
          :total="pagination.total"
          :page-size="searchParams.pageSize"
          show-less-items
          @change="onPageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CardEmployer from '../../components/user/CardEmployer.vue'
import { onMounted, ref, watch } from 'vue'
import Loading from '../../components/Loading.vue'
import { ReloadOutlined } from '@ant-design/icons-vue'
import { apiClient } from '../../constant/api'

const loading = ref<boolean>(false)
const dataCompanies = ref<any[]>([])
const locations = ref<any[]>([])
const categories = ref<any[]>([])
const pagination = ref({
  total: 0
})


const searchParams = ref({
  current: 1,
  pageSize: 6,
  keyword: '',
})


// Lấy danh sách công ty
const fetchCompanies = async () => {
  try {
    loading.value = true
    const response = await apiClient.get(`companies/client?page=${searchParams.value.current}&pageSize=${searchParams.value.pageSize}${searchParams.value.keyword ? `&search=${searchParams.value.keyword}` : ''}`)
    dataCompanies.value = response.data.data.result || []
    pagination.value.total = response.data.data.meta.total || 0
  } catch (error) {
    console.error(error)
    dataCompanies.value = []
    pagination.value.total = 0
  } finally {
    loading.value = false
  }
}

// Lấy danh sách vị trí và ngành nghề
const fetchFilters = async () => {
  try {
    const [locationsRes, categoriesRes] = await Promise.all([
      apiClient.get('/location'),
      apiClient.get('/category')
    ])
    locations.value = locationsRes.data.data || []
    categories.value = categoriesRes.data.data || []
  } catch (error) {
    console.error(error)
    locations.value = []
    categories.value = []
  }
}

// Xử lý khi tìm kiếm
const onSearch = () => {
  searchParams.value.current = 1
  fetchCompanies()
}

// Xử lý khi thay đổi bộ lọc
const onFilterChange = () => {
  searchParams.value.current = 1
  fetchCompanies()
}

// Xử lý khi thay đổi trang
const onPageChange = (page: number) => {
  fetchCompanies()
}

// Reset bộ lọc
const resetFilter = () => {

  searchParams.value = {
    current: 1,
    pageSize: 6,
    keyword: '',
  }
  fetchCompanies()
}

// Khi component được mount, lấy danh sách công ty và bộ lọc
onMounted(() => {
  fetchCompanies()
  fetchFilters()
})

// Theo dõi thay đổi của current để cập nhật danh sách công ty
watch(
  () => searchParams.value.current,
  () => {
    fetchCompanies()
  }
)
</script>

<style scoped lang="scss">
:deep(.ant-select-selector) {
  border-radius: 4px !important;
}

:deep(.ant-btn-primary) {
  background-color: #ed1b2f;
  &:hover {
    background-color: #c61425 !important;
  }
}

:deep(.ant-pagination-item-active) {
  border-color: #ed1b2f;
  a {
    color: #ed1b2f;
  }
}
</style>

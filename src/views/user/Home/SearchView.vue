<script setup lang="ts">
import CardJob from '../../../components/user/CardJob.vue'
import Search from '../../../components/user/search/Search.vue'
import { onMounted, ref, watch, watchEffect } from 'vue'
import { useSearchStore } from '../../../stores/user/searchStore'
import FilterSearch from '../../../components/user/modal/FilterSearch.vue'
import Loading from '../../../components/Loading.vue'
import { formatSalary } from '../../../until/until'
import { ReloadOutlined } from '@ant-design/icons-vue'

const store = useSearchStore()

onMounted(() => {
  store.handleSearch()
})

const open = ref<boolean>(false)

const showModal = () => {
  open.value = true
}

const handleOk = () => {
  store.handleSearch()
  open.value = false
}
</script>

<template>
  <Loading v-if="store.load"> </Loading>

  <div class="theme_gray_no_border" v-else>
    <header class="theme_blackred w-full min-h-30 py-8">
      <div class="w-11/12 lg:w-10/12 mx-auto">
        <Search></Search>
      </div>
    </header>

    <div class="w-11/12 lg:w-11/12 mx-auto py-8 lg:flex">
      <div class="w-full p-2 lg:p-3">
        <div class="flex justify-between mb-4">
          <h1 class="text-xl lg:text-3xl font-bold">
            {{ store.dataJobs.length }} việc làm
            <span class="text-red-600">{{ store.paginateJobs.keyword }}</span> tại Việt Nam
          </h1>
          <div class="flex gap-2">
            <a-tooltip title="Xoá lọc">
              <a-button size="large" class="group" @click="store.resetFilter">
                <img
                  src="../../../assets/image/icon/icons8_refresh.svg"
                  alt=""
                  class="w-5 h-5 group-hover:hidden"
                />
                <img
                  src="../../../assets/image/icon/icons8_refresh_red.svg"
                  alt=""
                  class="w-5 h-5 hidden group-hover:block animate-pulse"
                />
              </a-button>
            </a-tooltip>

            <a-button @click="showModal" size="large" danger> Bộ lọc </a-button>
          </div>

          <a-modal
            v-model:open="open"
            width="800px"
            @ok="handleOk"
            okText="Xác nhận"
            cancelText="Huỷ bỏ"
            :maskClosable="false"
            :cancelButtonProps="{ class: 'custom-cancel-button' }"
            :okButtonProps="{ style: { background: '#ed1b2f' } }"
          >
            <template #title>
              <div class="text-xl font-semibold border-b border-gray-300 pb-1">Bộ lọc</div>
            </template>
            <FilterSearch></FilterSearch>
          </a-modal>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mx-auto">
          <template v-for="data in store.dataJobs" :key="data._id">
            <CardJob :data="data"> </CardJob>
          </template>
        </div>
        <div class="w-full flex justify-center mt-5">
          <a-pagination
            v-model:current="store.paginateJobs.current"
            :total="store.paginateJobs?.total"
            :page-size="store.paginateJobs?.pageSize"
            show-less-items
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.custom-cancel-button {
  &:hover {
    color: #ed1b2f !important;
    border-color: #ed1b2f !important;
  }
}
</style>

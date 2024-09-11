<script setup lang="ts">
import CardJob from '../../../components/user/CardJob.vue';
import Search from '../../../components/user/search/Search.vue';
import { ref, watch, watchEffect } from 'vue';
import type { IJob, IPaginate } from '../../../types/backend';
import { paginateJobsApi } from '../../../services/job.service';
import { useRoute } from 'vue-router';
import { useSearchStore } from '../../../stores/searchStore';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { createVNode } from 'vue';
import { Modal } from 'ant-design-vue';
import FilterSearch from '../../../components/user/modal/FilterSearch.vue';


const store = useSearchStore()

watchEffect(() => {
    store.getData()
})

const open = ref<boolean>(false);

const showModal = () => {
    open.value = true;
};

const handleOk = () => {
    store.handleFilter()
    open.value = false;
};

</script>

<template>
    <div class="theme_gray_no_border">
        <header class="theme_blackred w-full min-h-30 py-8 ">
            <div class="w-11/12 lg:w-10/12 mx-auto">
                <Search></Search>
            </div>
        </header>

        <div class="w-11/12 lg:w-11/12 mx-auto py-8 lg:flex ">
            <div class="w-full p-2 lg:p-3">
                <div class="flex justify-between mb-4">
                    <h1 class="text-xl lg:text-3xl font-bold">{{ store.paginateJobs?.total }} việc làm <span
                            class="text-red-600">{{ store.paginateJobs?.keyword }}</span> tại Việt Nam</h1>
                    <button @click="showModal"
                        class="border w-24 lg:w-32 h-8 lg:h-10 border-red-600 text-red-600 px-1 bg-white rounded-md">Bộ
                        lọc</button>
                    <a-modal v-model:open="open" width="800px" title="Bộ lọc" @ok="handleOk" okText="Xác nhận"
                        cancelText="Huỷ bỏ" :maskClosable=false :cancelButtonProps="{ class: 'custom-cancel-button' }"
                        :okButtonProps="{ style: { background: '#ed1b2f' } }">
                        <hr>
                        <FilterSearch></FilterSearch>
                    </a-modal>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mx-auto">
                    <template v-for="data in store.dataJobs" :key="data._id">
                        <CardJob :_id="data._id" :name="data.name" :address="data.location" :logo="data.company?.logo"
                            :salary="data.salary?.toString()" :nameCompany="data.company?.name"
                            :company_id="data.company?._id"></CardJob>
                    </template>
                </div>
                <div class="w-full flex justify-center mt-5">
                    <a-pagination v-model:current="store.current" :total="store.paginateJobs?.total"
                        :page-size="store.paginateJobs?.pageSize" show-less-items />
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
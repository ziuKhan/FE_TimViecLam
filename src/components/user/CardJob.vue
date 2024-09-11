<script setup lang="ts">
import { linkUploads } from '../../constant/api';
import { formatSalary } from '../../until/until';

defineProps({
    name: String,
    nameCompany: String,
    address: String,
    logo: String,
    salary: String,
    _id: String,
    company_id: String
});



</script>

<template>
    <div
        class="w-full rounded-md bg-white h-28 border border-solid border-gray-300 hover:bg-zinc-100 hover:border-zinc-300 flex gap-2 p-3 group">
        <div class="min-w-20 max-w-20 h-20 bg-white p-2">
            <img class="w-full h-full object-contain" :src="linkUploads('company/' + logo)" alt="">
        </div>

        <div class="w-full flex flex-col overflow-hidden">
            <RouterLink :to="`/job/${_id}`" class="w-full text-base font-medium group-hover:text-red-800 truncate ">
                {{ name }}
            </RouterLink>

            <RouterLink :to="`/company/${company_id}`" class="truncate max-w-full text-xs text-zinc-500 pt-1">
                {{ nameCompany }}
            </RouterLink>

            <div class="text-xs flex gap-x-2 font-medium pt-1">
                <div class="px-2 py-1 bg-zinc-100 rounded-md">${{ formatSalary(salary) }}</div>
                <div class="px-2 py-1 bg-zinc-100 rounded-md">{{ address }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { useSearchStore } from '../../../stores/user/searchStore'
import type { ILocation } from '../../../types/backend'
import { getConscious } from '../../../services/location.service'

const store = useSearchStore()
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
  loadDataLocation()
})
</script>

<template>
  <div class="container__search_form flex-wrap md:flex-nowrap">

    <a-select
      v-model:value="store.valueFilter.location"
      allowClear
      class="min-w-full md:min-w-60 custom-select !text-2xl"
      placeholder="Tất cả thành phố"
      :options="dataLocation"
      :field-names="{ label: 'name', value: 'name' }"
      show-search
    >
    </a-select>
    <a-input
      type="text"
      v-model:value="store.keyword"
      @keyup.enter="store.handleSearch()"
      class="search_form-inp search_form-ctl"
      id="search_form-inp"
      placeholder="Nhập từ khoá kĩ năng"
    />

   <button type="button" @click="store.handleSearch()" class="search_form-btn">
  
      <img loading="lazy" src="../../../assets/image/icon/icons8_search.svg" alt="" />Tìm kiếm
    </button>
  </div>
</template>

<style lang="scss" scoped>
.container__search_form {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 12px;
}

.search_form-ctl {
  height: 58px;
  border-radius: 5px;
  padding: 6px 16px;
  font-size: 18px;

}

.search_form-inp {
  width: 100%;
}

.search_form-btn {
  display: flex;
  gap: 0 5px;
  background-color: #ed1b2f;
  color: white;
  min-width: 240px;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  height: 58px;
  border-radius: 5px;

  &:hover {
    background-color: #c82222;
  }
}

.custom-select :deep(.ant-select-selector) {
  height: 58px !important;

  span{
   font-size: 18px;
    display: flex;
    align-items: center;
  }
}
</style>

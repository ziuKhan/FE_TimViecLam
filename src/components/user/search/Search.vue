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
const dataSource = [
  {
    value: 'Công ty',
    options: [
      {
        value: 'AntDesignVue',
        count: 10000,
      },
      {
        value: 'AntDesignVue UI',
        count: 10600,
      },
    ],
  },
  {
    value: 'Skill and Title',
    options: [
      {
        value: 'AntDesignVue UI FAQ',
        count: 60100,
      },
      {
        value: 'AntDesignVue FAQ',
        count: 30010,
      },
    ],
  },
  {
    value: 'Articles',
    options: [
      {
        value: 'AntDesignVue design language',
        count: 100000,
      },
    ],
  },
];
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
    <a-auto-complete
      v-model:value="store.keyword"
      class="certain-category-search custom-select !w-full"
      popup-class-name="certain-category-search-dropdown"
      :dropdown-match-select-width="500"
      style="width: 250px"
      :options="dataSource"
    >
      <template #option="item">
        <template v-if="item.options">
          <span>
            {{ item.value }}
          </span>
        </template>
        <template v-else>
          <div style="display: flex; justify-content: space-between">
            {{ item.value }}
            <span>
              <UserOutlined />
              {{ item.count }}
            </span>
          </div>
        </template>
      </template>
    </a-auto-complete>
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
.certain-category-search-dropdown .ant-select-dropdown-menu-item-group-title {
  color: #666;
  font-weight: bold;
}

.certain-category-search-dropdown .ant-select-dropdown-menu-item-group {
  border-bottom: 1px solid #f6f6f6;
}

.certain-category-search-dropdown .ant-select-dropdown-menu-item {
  padding-left: 16px;
}

.certain-category-search-dropdown .ant-select-dropdown-menu-item.show-all {
  text-align: center;
  cursor: default;
}

.certain-category-search-dropdown .ant-select-dropdown-menu {
  max-height: 300px;
}
</style>

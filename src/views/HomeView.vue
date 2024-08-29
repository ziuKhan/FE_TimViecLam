<script setup lang="ts">
import { onMounted, ref } from 'vue'
import CardEmployer from '../components/CardEmployer.vue'
import FormSearch from '../components/FormSearch.vue'
import Search from '../components/Search.vue'
import { ICompany } from '../types/backend'
import { paginateCompanyApi } from '../services/company.service'

const data = ref<ICompany>()

const getData = async () => {
  const params = '?current=1&pageSize=9&sort=-createdAt'
  const res = await paginateCompanyApi(params)
  debugger
  data.value = res
}

onMounted(() => {
  getData()
})
</script>

<template>
  <main>
    <FormSearch></FormSearch>
    <div class="link__cv theme_gray">
      <RouterLink to="/ad" class="link__cv_link">
        <img src="../assets/image/icon/icons8_new.svg" alt="" />
        <p class="title_bold">Mẫu CV ITviec</p>

        Công cụ kiến tạo CV tối ưu dành cho chuyên gia IT - Tạo CV ngay
        <img src="../assets/image/icon/icons8_right.svg" alt=""
      /></RouterLink>
    </div>

    <div class="home__employer">
      <div class="home__employer_title">Nhà tuyển dụng hàng đầu</div>
      <template v-for="data in data" :key="data.id">
        <CardEmployer
          :name="data.name"
          :address="data.address"
          :logo="data.logo"
          :jobs="data.jobs"
        ></CardEmployer>
      </template>
    </div>
  </main>
</template>


<style lang="scss" scoped>
main {
  height: 300vh;
}
.link__cv {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 72px;
}
.link__cv_link {
  display: flex;
  align-items: center;
  gap: 0 15px;
  p {
    margin: 0;
    font-weight: bold;
  }
}

.home__employer {
  background-color: #fff;
  width: 88%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 cột đều nhau */
  gap: 30px; /* Khoảng cách giữa các card */
  margin-top: 60px;
  margin-bottom: 45px;

  .home__employer_title {
    font-weight: 700;
    font-size: 28px;
    width: 100%;
    text-align: center;
    grid-column: span 3; /* Để tiêu đề chiếm toàn bộ chiều rộng */
  }
}
</style>
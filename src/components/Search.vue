<template>
  
  <div class="container__search_form">
        <select
            class="search_form-select search_form-ctl"
            name=""
            id=""
        >
            <option selected>Tất cả thành phố</option>
            <option value="">Hà Nội</option>
            <option value="">TP Hồ Chí Minh</option>
            <option value="">Đà Nẵng</option>
            <option value="">Khác</option>
        </select>
    <input type="text"  class="search_form-inp search_form-ctl" id="search_form-inp" placeholder="Nhập từ khoá theo chức năng, chức vụ công ty...">
    <button type="button" class="search_form-btn"><img src="../assets/image/icon/icons8_search.svg" alt="">Tìm kiếm</button>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.container__search_form{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap:0 12px;
}

.search_form-ctl{
    height: 58px;
    border-radius: 5px;
     border: none;
    padding: 6px 16px;
    &:hover{
    border: 0.4px solid rgba(31, 31, 31, 0.577);
    box-shadow: 0 0 10px rgb(249, 249, 249);
  }
}

.search_form-select{
  min-width: 240px;
}
.search_form-inp{
width: 100%;
}

.search_form-btn{
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
    &:hover{
    background-color: #C82222;

    }
}

</style>
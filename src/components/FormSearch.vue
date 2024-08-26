<template>
  

  <div class="form_search theme_blackred">
    <div class="form__search_title">
        1,024 Việc làm IT cho Developer "Chất"
    </div>
    <Search></Search>
    <div class="form__search_suggest">
        <span> Gợi ý của bạn:</span>
       
        <RouterLink to="adax" class="search__suggest_link">Java</RouterLink>
        <RouterLink to="a" class="search__suggest_link">React</RouterLink>
        <RouterLink to="x" class="search__suggest_link">Vue</RouterLink>
        <RouterLink to="d" class="search__suggest_link">NodeJS</RouterLink>
        <RouterLink to="d" class="search__suggest_link">Business Analyst</RouterLink>
        <RouterLink to="d" class="search__suggest_link">Tester</RouterLink>
        <RouterLink to="d" class="search__suggest_link">.Net</RouterLink>
        <RouterLink to="d" class="search__suggest_link">PHP</RouterLink>
        <RouterLink to="d" class="search__suggest_link">Manager</RouterLink>
    </div>
  </div>

</template>

<script setup lang="ts">
import Search from './Search.vue';
</script>

<style lang="scss" scoped>
.form_search{
    width: 100%;
    padding: 64px 160px;
}
.form__search_title{
    font-size: 32px;
    font-weight: 600;
    margin-bottom: 32px;
    color: white;

}

.form__search_suggest{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    color: rgb(222, 222, 222);
    margin-top:28px;
    font-size: 16px;
    gap:15px;
    align-items: center;
}

.search__suggest_link{
    border: 0.5px solid rgba(255, 255, 255, 0.345);
    padding: 6px 12px;
    border-radius: 50px;
    &:hover{
        background-color: rgba(255, 255, 255, 0.345);
    }
}

</style>
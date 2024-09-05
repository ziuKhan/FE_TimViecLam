

<template>
  

  <div class="form_search theme_blackred p-5  lg:py-16 lg:px-40">
    <div class="form__search_title text-[20px] lg:text-[32px]">
        1,024 Việc làm IT cho Developer "Chất"
    </div>
    <Search></Search>
    <div class="form__search_suggest">
        <span> Gợi ý của bạn:</span>
       
        <span  @click="store.updateKeyword('java')"  class="search__suggest_link  cursor-pointer">Java</span>
        <span @click="store.updateKeyword('React')" class="search__suggest_link  cursor-pointer">React</span>
        <span @click="store.updateKeyword('Vue')" class="search__suggest_link  cursor-pointer">Vue</span>
        <span @click="store.updateKeyword('NodeJS')" class="search__suggest_link  cursor-pointer">NodeJS</span>
        <span @click="store.updateKeyword('Business Analyst')" class="search__suggest_link  cursor-pointer">Business Analyst</span>
        <span @click="store.updateKeyword('Tester')" class="search__suggest_link  cursor-pointer">Tester</span>
        <span @click="store.updateKeyword('Net')" class="search__suggest_link  cursor-pointer">.Net</span>
        <span @click="store.updateKeyword('PHP')" class="search__suggest_link  cursor-pointer">PHP</span>
        <span @click="store.updateKeyword('Manager')" class="search__suggest_link  cursor-pointer">Manager</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import Search from './Search.vue';
import { useSearchStore } from '../stores/searchStore';
    const store = useSearchStore()
</script>

<style lang="scss" scoped>
.form_search{
    width: 100%;
}
.form__search_title{

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
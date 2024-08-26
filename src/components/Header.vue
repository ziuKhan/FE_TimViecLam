<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
const isSticky = ref<boolean>(false);
const collapsed= ref<boolean>(false);

const handleScroll = ():void =>  {
  const header = document.querySelector('.header');
  if (header) {
    isSticky.value = window.scrollY > 0;
    if (isSticky.value) {
      header.classList.add('sticky');
      collapsed.value = true;
    } else {
      header.classList.remove('sticky');
      collapsed.value = false;

    }
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

</script>


<template>
  <header class="header theme_blackred">
    <div class="header__logo">
      <RouterLink to="/">
        <img class="logo_itviec" src="../assets/image/icon/logo-itviec.png" alt="#" :style="{   
               width: collapsed ? '80px' : '108px',
              height: collapsed ? '30px' : '40px',
                }">
      </RouterLink>
    </div>
    <div class="header__control">
      <nav class="header__nav">
        <RouterLink to="/category" class="header__nav_link">
          Việc Làm IT
          <div class="icon-wrapper">
            <img class="icon-default" src="../assets/image/icon/icons8_chevron_down_1.svg" alt="">
            <img class="icon-hover" src="../assets/image/icon/icons8_chevron_down_white.svg" alt="">
          </div>

          <div class="header__sub">
            <RouterLink class="header__sub_list" to="ad">Việc làm IT theo kĩ năng</RouterLink>
            <RouterLink class="header__sub_list" to="xa">Việc làm IT theo cấp bậc</RouterLink>       
            <RouterLink class="header__sub_list" to="ada">Việc làm IT theo công ty</RouterLink>     
            <RouterLink class="header__sub_list" to="ada">Việc làm IT theo thành phố</RouterLink>
          </div>
        </RouterLink>
        <RouterLink to="adax" class="header__nav_link">
          Top Công ty IT
          <div class="icon-wrapper">
            <img class="icon-default" src="../assets/image/icon/icons8_chevron_down_1.svg" alt="">
            <img class="icon-hover" src="../assets/image/icon/icons8_chevron_down_white.svg" alt="">
          </div>
        </RouterLink>
        <RouterLink to="adax" class="header__nav_link">
          Blog
        </RouterLink>
      </nav>
      <div class="header__user ">
        <RouterLink to="xa" class="header__user_link link_distance">Nhà Tuyển Dụng</RouterLink>
        <RouterLink to="/login" class="header__user_link link_distance">Đăng Nhập/Đăng ký</RouterLink>
        <span class="link_distance">
          <RouterLink to="xa" class="header__user_link">EN</RouterLink>
          <span>|</span>
          <RouterLink to="ad" class="header__user_link">VI</RouterLink>
        </span>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.activeLink{
  color: #ffffff !important;
  font-weight:600;
}

.header {
  padding: 0 30px;
  display: flex;
  align-items: center;
  width: 100%;
  height: 88px;
  border-bottom: 0.2px solid rgba(166, 166, 166, 0.216);
  position: sticky;
  top: 0;
  transition: height 0.3s; /* Thêm hiệu ứng chuyển tiếp */
  z-index: 999;
}

.header.sticky {
  height: 65px; /* Chiều cao khi sticky */
}

.header__logo {
  .logo_itviec {
  
    margin-right: 30px;
  }
}

.header__control {
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 100%;
}

.header__nav {
  display: flex;
}

.header__nav_link {
  text-decoration: none;
  color: rgb(166, 166, 166);
  font-size: 16px;
  padding: 0 10px;
  font-weight: 400;
  display: flex;
  align-items: center;
  position: relative;
  height: 100%;

  .icon-wrapper {
    position: relative;
    display: inline-block;

    img {
      margin-left: 5px;
    }

    .icon-hover {
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
    }
  }

  &:hover {
    color: white;

    .icon-wrapper {
      .icon-hover {
        opacity: 1;
      }
      .icon-default {
        opacity: 0;
      }
    }

    .header__sub {
      display: block; 
    }
  }
}

.header__sub {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #121212;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
 flex-direction: column;

}

.header__sub_list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 45px;
  text-decoration: none;
  color: rgb(166, 166, 166);
  padding:0 16px;
  width: 250px;
  font-size: 14px !important;
  border: 0.2px solid rgba(166, 166, 166, 0.103);

  &:hover{
    background-color: #414042;
    color: white;
  }
}


.header__user {
  display: flex;
  align-items: center;
  color: white;


  .link_distance {
    padding: 0 10px;
  }

  .header__user_link {
    margin: 0 3px;

    &:hover {
      text-decoration: underline;
    }
  }
}

.sub__list_item{
  position: absolute;
  top: 0;
  left: 250px;
}
</style>

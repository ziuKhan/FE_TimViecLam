<template>
  <RouterLink :to="`/company/${id}`" class="card__employer">
    <div class="card__first">
      <div class="first__logoBrand">
        <img loading="lazy" :src="linkUploads('company/' + logo)" alt="" />
      </div>
    </div>
    <div class="card__second">
      <div class="card__name">{{ name }}</div>
    </div>
    <div class="card__third">
      <div class="card__address">
        {{ Array.isArray(address) ? (address.length > 0 ? address.join(', ') : '') : address }}
      </div>
      <div class="card__job">
        {{ jobs }} việc làm
        <img loading="lazy" src="../../assets/image/icon/icons8_chevron_right.svg" alt="" />
      </div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { linkUploads } from '../../constant/api'

defineProps({
  address: Array,
  name: String,
  logo: String,
  jobs: Number,
  id: String
})
</script>

<style scoped lang="scss">
.card__employer {
  display: flex;
  flex-direction: column;
  /* min-height: 436px; */
  background-color: #fdfdfd;
  border-radius: 8px;
  border: 0.8px solid rgb(222, 222, 222);

  &:hover {
    box-shadow: 0 0 30px rgba(44, 44, 44, 0.1);
  }
}

.card__first {
  display: flex;
  justify-content: center;
  align-items: end;
  background-image: url('../../assets/image/icon/icon_theme_cardEmployer.svg');
  background-repeat: repeat-x;
  height: 192px;

  .first__logoBrand {
    width: 160px;
    background-color: #fff;
    height: 160px;
    overflow: hidden;
    display: flex;
    align-items: center;
    border-radius: 8px;
    box-shadow: 0 10px 20px rgba(44, 44, 44, 0.1);

    img {
      width: 100%;
    }
  }
}

.card__second {
  margin-top: 24px;
  padding: 0 16px;
  flex: 1;

  .card__name {
    font-size: 20px;
    font-weight: 500;
    width: 100%;
    text-align: center;
    margin-bottom: 15px;
  }

  .card__skills {
    padding-top: 16px;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    .card_skill {
      padding: 5px 12px;
      background-color: #f7f7f7;
      border-radius: 50px;
      margin: 5px;
      font-size: 14px;
    }
  }
}

.card__third {
  background-color: #f7f7f7;
  padding: 12px 16px;
  height: 66px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;

  .card__address {
    font-size: 14px;
    width: 70%;
  }

  .card__job {
    display: flex;
    align-items: center;
    gap: 0 5px;
  }
}
</style>

<template>

  <div class="mt-2">
    <div class="w-full flex gap-2  flex-wrap  mb-2 mt-5">
      <div class="font-bold  text-base ">Mức lương: </div>
      <div class=" font-medium text-base">{{ store.value[0] }}$ - {{ store.value[1] }}$</div>
      <div class="w-full border rounded-full border-blue-200 hover:border-blue-300 px-4">
        <a-slider v-model:value="store.value" range :min="0" :max="store.valueMax" />
      </div>

    </div>
    <div class="font-bold text-base mt-5 mb-2">Cấp bậc</div>
    <a-checkbox-group v-model:value="store.state" name="checkboxgroup" :options="plainOptions" />
    <div class="font-bold text-base mt-5 mb-2">Kĩ năng</div>
    <a-select v-model:value="store.skills" mode="tags" style="width: 100%" :token-separators="[',']"
      placeholder="Vui lòng nhập kĩ năng" :options="options"></a-select>
  </div>


</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSearchStore } from '../../../stores/user/searchStore';
import type { SelectProps } from 'ant-design-vue';

const store = useSearchStore()

const plainOptions = ['FRESHER', 'JUNIOR', 'MIDDLE', 'SENIOR', 'MANAGER'];
const options = ref<SelectProps['options']>([
  {
    value: 'REACT.JS',
    label: 'React',
  },
  {
    value: 'VUE.JS',
    label: 'VueJS',
  },
  {
    value: 'ANGULAR',
    label: 'Angular',
  },
  {
    value: 'NODE.JS',
    label: 'Node',
  },
  {
    value: 'NEXT',
    label: 'Next',
  },
  {
    value: 'NUXT',
    label: 'Nuxt',
  },
  {
    value: 'TYPESCRIPT',
    label: 'Typescript',
  },
  {
    value: 'JAVASCRIPT',
    label: 'Javascript',
  },
  {
    value: 'PYTHON',
    label: 'Python',
  },
  {
    value: 'JAVA',
    label: 'Java',
  },
  {
    value: 'C#',
    label: 'C#',
  },
  {
    value: 'C++',
    label: 'C++',
  },
  {
    value: 'PHP',
    label: 'PHP',
  },
  {
    value: 'RUBY',
    label: 'Ruby',
  },
  {
    value: 'SWIFT',
    label: 'Swift',
  },
  {
    value: 'KOTLIN',
    label: 'Kotlin',
  },
  {
    value: 'GO',
    label: 'Go',
  },
  {
    value: 'RUST',
    label: 'Rust',
  },
  {
    value: 'SCALA',
    label: 'Scala',
  },
  {
    value: 'HASKELL',
    label: 'Haskell',
  },
  {
    value: 'ERLANG',
    label: 'Erlang',
  },

  {
    value: 'ELIXIR',
    label: 'Elixir',
  },
  {
    value: 'NEST.JS',
    label: 'Nest.JS',
  },
  {
    value: 'ASP.NET',
    label: 'ASP.NET',
  },
  {
    value: 'LARAVEL',
    label: 'Laravel',
  },
  {
    value: 'DJANGO',
    label: 'Django',
  },
  {
    value: 'FLASK',
    label: 'Flask',
  },
  {
    value: 'EXPRESS',
    label: 'Express',
  },
  {
    value: 'FASTAPI',
    label: 'FastAPI',
  },
  {
    value: 'SPRINGBOOT',
    label: 'SpringBoot',
  }
]);




</script>
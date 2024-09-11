<template>
    <div class="ckeditor-container">
        <div class="border-x border-t border-[#ccc] rounded-[1px] text-base font-medium p-2">{{ title }}</div>
        <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// Khai báo emit để truyền sự kiện ra ngoài
const emit = defineEmits(['update:modelValue']);

// Khai báo các props
defineProps({
    title: String,
    modelValue: String
});

const editor = ClassicEditor;
const editorData = ref();  // Gán giá trị ban đầu cho editorData
const editorConfig = ref({});

// Khi giá trị editorData thay đổi, gửi giá trị lên component cha
watch(editorData, (newValue) => {
    emit('update:modelValue', newValue);  // Truyền sự kiện 'update:modelValue'
});
</script>


<style>
.ck-editor__editable {
    height: 200px;
    border-radius: 0;
}
</style>
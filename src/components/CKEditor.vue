<template>
    <div class="ckeditor-container">
        <div class="border-x border-t border-[#ccc] rounded-[1px] text-base font-medium p-2">{{ props.title }}
        </div>
        <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// Khai báo emit để truyền sự kiện ra ngoài
const emit = defineEmits(['update:modelValue']);

// Khai báo các props
const props = defineProps({
    title: String,
    modelValue: String,
    description: String
});

const editor = ClassicEditor;
const editorConfig = ref({});

const editorData = ref(props.description);

watch(() => props.description, (newDescription) => {
    editorData.value = newDescription;
}, { immediate: true });

watch(editorData, (newValue) => {
    emit('update:modelValue', newValue);
}, { immediate: true });

</script>


<style>
.ck-editor__editable {
    min-height: 200px;
    border-radius: 0;
}
</style>
<template>
  <div class="ckeditor-container">
    <div class="border-x border-t border-[#ccc] rounded-[1px] text-base font-medium p-2">
      {{ props.title }}
    </div>
    <ckeditor
      :editor="editor"
      v-model="editorData"
      :config="editorConfig"
      @ready="onEditorReady"
    ></ckeditor>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

// Khai báo emit để truyền sự kiện ra ngoài
const emit = defineEmits(['update:modelValue'])

// Khai báo các props
const props = defineProps({
  title: String,
  modelValue: String,
  description: String
})

const editor = ClassicEditor
const editorConfig = ref({
  // Cấu hình cho phép upload ảnh
  image: {
    upload: {
      types: ['jpeg', 'png', 'gif', 'jpg']
    }
  }
})

const editorData = ref(props.description)

// Xử lý khi editor được khởi tạo
const onEditorReady = (editor: any) => {
  // Đăng ký adapter tùy chỉnh cho việc upload ảnh
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
    return new CustomUploadAdapter(loader)
  }
}

// Class xử lý upload ảnh
class CustomUploadAdapter {
  private loader

  constructor(loader: any) {
    this.loader = loader
  }

  async upload() {
    try {
      const file = await this.loader.file

      // Chuyển file thành blob URL
      const blob = new Blob([file], { type: file.type })
      const blobUrl = URL.createObjectURL(blob)

      return {
        default: blobUrl
      }
    } catch (error) {
      console.error('Upload failed:', error)
      throw error
    }
  }

  abort() {
    // Xử lý khi hủy upload
  }
}

watch(
  () => props.description,
  (newDescription) => {
    editorData.value = newDescription
  },
  { immediate: true }
)

watch(
  editorData,
  (newValue) => {
    emit('update:modelValue', newValue)
  },
  { immediate: true }
)
</script>

<style>
.ck-editor__editable {
  min-height: 200px;
  border-radius: 0;
}

/* Thêm style cho phần upload ảnh */
.ck-file-dialog-button {
  display: inline-block;
}

.ck-button__label {
  display: inline-block;
}
</style>

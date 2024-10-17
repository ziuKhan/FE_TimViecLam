<script setup lang="ts">
import { message } from 'ant-design-vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import type { UploadChangeParam } from 'ant-design-vue';
import { ref, watch } from 'vue';
import { uploadApi } from '../../../services/upload.service';
import type { UploadRequestOption } from 'ant-design-vue/es/vc-upload/interface';
import accountService from '../../../constant/account.service';

defineProps({
  nameJob: String,
  nameCompany: String,
  description: String
})


const fileList = ref([]);
const urlFile = defineModel('urlFile', { required: true })
const description = defineModel('description', { required: true })
watch(fileList, () => {
  if (fileList.value.length === 0) {
    urlFile.value = '';
  }
});

watch(description, () => {
  if (description.value === '') {
    description.value = '';
  }
});

const handleUpload = async (options: UploadRequestOption) => {
  const { file, onSuccess, onError } = options;
  try {
    const res = await uploadApi(file, 'cv');
    if (res) {
      urlFile.value = res.data.fileName;

      message.success('Upload file thành công!');
      onSuccess && onSuccess(res);
    }
  } catch (err: any) {
    message.error('Upload file thất bại!');
    onError && onError(err);
  }
};

const { account, storage } = accountService.getAccount();

</script>

<template>

  <div v-if="account" class="w-full  mb-2 mt-5">
    <div class="mb-3 text-base">Bạn đang ứng tuyển công việc <span class="font-bold">{{ nameJob }}</span> tại <span
        class="font-bold">{{ nameCompany }}.</span> </div>
    <a-form name="basic" autocomplete="off" layout="vertical">

      <a-form-item label="Email" :rules="[{ required: true, message: 'Vui lòng nhập Email!' }]">
        <a-input disabled :value="account?.email" class="mb-3"></a-input>
      </a-form-item>




      <a-form-item label="Tải lên CV" name="urlfile">
        <a-upload maxCount="1" name="file" v-model:file-list="fileList"
          accept="application/pdf,application/msword,.doc,.docx,.pdf" :custom-request="handleUpload">
          <a-button class="test-button">
            <upload-outlined></upload-outlined>
            Tải lên CV của bạn (Hỗ trợ *.doc, *.docx, *.pdf, and &lt; 5MB)
          </a-button>
        </a-upload>
      </a-form-item>


      <a-form-item label="Lời nhắn">
        <a-textarea v-model:value="description" placeholder="Vui lòng nhập lời nhắn" allow-clear />
      </a-form-item>




    </a-form>

  </div>

  <div v-else class="w-full flex gap-2  flex-wrap  mb-2 mt-5">
    Bạn chưa đăng nhập hệ thống. Vui lòng đăng nhập để có thể "Rải CV" bạn nhé -.-
  </div>

</template>

<style scoped>
.test-button:hover {
  color: #ed1b2f !important;
  border-color: #ed1b2f !important;
}
</style>

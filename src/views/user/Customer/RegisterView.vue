<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import Loading from '../../../components/Loading.vue';
import CKEditor from '../../../components/CKEditor.vue';
import type { UploadRequestOption } from 'ant-design-vue/es/vc-upload/interface';
import { message } from 'ant-design-vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import { createCompanyApi, registerHRApi } from '../../../services/auth.service';
import { useRouter } from 'vue-router';
import apiService from '../../../services/api.service';

const load = ref<boolean>(true)
const loading = ref<boolean>(false)
const router = useRouter()
type FormState = {

    name?: string;
    email?: string;
    phoneNumber?: string;
    password?: string;
    nameCompany?: string;
    address?: string;
    logo?: string;
    description?: string;
    checked?: boolean
};

const formState = reactive<FormState>({

    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    nameCompany: '',
    address: '',
    description: '',
    logo: '',
    checked: false
});

const onFinish = async () => {



    try {
        loading.value = true
        const dataCompany = await {
            name: formState.nameCompany,
            address: formState.address,
            description: formState.description,
            logo: formState.logo
        }
        const dataHR = await {
            name: formState.name,
            email: formState.email,
            phoneNumber: formState.phoneNumber,
            password: formState.password,
            company: {
                _id: '',
                name: formState.nameCompany,
            }
        }

        const res = await createCompanyApi(dataCompany)
        if (res) {
            dataHR.company._id = res.data._id
            const resHR = await registerHRApi(dataHR)
            if (resHR) {
                message.success('Gửi thông tin thành công!')
                loading.value = true
                router.push('#')
            }
        }

    }
    catch (err) {
        console.log(err)
        loading.value = true
    }


};

const fileList = ref([]);

watch(fileList, () => {
    if (fileList.value.length === 0) {
        formState.logo = '';
    }
});

const handleUpload = async (options: UploadRequestOption) => {
    const { file, onSuccess, onError } = options;
    try {
        const res = await apiService.upload(file, 'company');
        if (res) {
            formState.logo = res.data.fileName;

            message.success('Upload file thành công!');
            onSuccess && onSuccess(res);
        }
    } catch (err: any) {
        message.error('Upload file thất bại!');
        onError && onError(err);
    }
};

</script>

<template>
    <Loading v-if="!load"></Loading>
    <div v-else class="w-full theme_blackred2 py-10">
        <div class="w-10/12 mx-auto">
            <h1 class="text-white font-bold text-[36px] my-7">Tìm kiếm Nhân tài IT phù hợp</h1>
            <div class="text-white mt-4 text-[16px] pb-10">Để lại thông tin liên hệ để nhận tư vấn từ Phòng Chăm sóc
                Khách
                hàng của
                ITviec.</div>
            <div class="flex gap-x-5">
                <a-form :model="formState" name="basic " class="w-4/6 bg-white rounded-xl p-12" @finish="onFinish">
                    <div class="grid grid-cols-2 grid-rows-18 w-full gap-5">
                        <div class="col-span-2 text-lg font-bold">
                            Thông tin Quý khách
                        </div>
                        <div class="row-span-2 row-start-2">
                            <a-form-item name="name" :rules="[{ required: true, message: 'Vui lòng nhập họ và tên!' }]"
                                class="m-0">
                                <a-input v-model:value="formState.name" class="h-[55px]"
                                    placeholder="Nhập họ tên" />
                            </a-form-item>

                        </div>
                        <div class="row-span-2 row-start-2">
                            <a-form-item name="phoneNumber"
                                :rules="[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]" class="m-0">
                                <a-input v-model:value="formState.phoneNumber" class="h-[55px]"
                                    placeholder="Nhập số điện thoại" />
                            </a-form-item>
                        </div>
                        <div class="row-span-2 row-start-4"> <a-form-item name="email"
                                :rules="[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ' }]"
                                class="m-0">
                                <a-input v-model:value="formState.email" class="h-[55px]" placeholder="Nhập email" />
                            </a-form-item>
                        </div>
                        <div class="row-span-2 row-start-4">
                            <a-form-item name="password"
                                :rules="[{ required: true, message: 'Vui lòng nhập mật khẩu!' }, { min: 6, message: 'Vui lòng nhập mật khẩu lớn hơn 6 kiểu' }]"
                                class="m-0">
                                <a-input-password v-model:value="formState.password" class="h-[55px]"
                                    placeholder="Nhập mật khẩu" />
                            </a-form-item>
                        </div>
                        <div class="col-span-2 row-start-6 text-lg font-bold">Thông tin công ty</div>
                        <div class="col-span-2 row-span-2 row-start-7">
                            <div class="flex w-full">
                                <div class="w-3/4 mr-4">
                                    <a-form-item name="nameCompany"
                                        :rules="[{ required: true, message: 'Vui lòng nhập tên công ty!' }]"
                                        class="m-0">
                                        <a-input v-model:value="formState.nameCompany" class="h-[55px]"
                                            placeholder="Nhập tên công ty" />
                                    </a-form-item>
                                </div>
                                <div class="w-1/4">
                                    <a-form-item label="" name="logo"
                                        :rules="[{ required: true, message: 'Vui lòng tải logo công ty lên!' }]">
                                        <a-upload maxCount="1" name="file" v-model:file-list="fileList"
                                            accept="image/png,image/svg+xml,image/x-icon"
                                            :custom-request="handleUpload">
                                            <a-button class="test-button">
                                                <upload-outlined></upload-outlined>
                                                Tải logo công ty
                                            </a-button>
                                        </a-upload>
                                    </a-form-item>

                                </div>


                            </div>

                        </div>
                        <div class="col-span-2 row-span-2 row-start-9">
                            <a-form-item name="address"
                                :rules="[{ required: true, message: 'Vui lòng nhập địa chỉ công ty!' }]" class="m-0">
                                <a-input v-model:value="formState.address" class="h-[55px]"
                                    placeholder="Nhập địa chỉ công ty" />
                            </a-form-item>
                        </div>


                        <div class="col-span-2 row-span-2 row-start-11">
                            <a-form-item name="description"
                                :rules="[{ required: true, message: 'Vui lòng nhập mô tả!' }]" class="m-0">
                                <CKEditor title="Mô tả" v-model="formState.description"></CKEditor>
                            </a-form-item>
                        </div>

                        <div class="col-span-2 row-span-2 row-start-13">
                            <a-form-item name="checked" :rules="[{ required: true, message: 'Vui lòng chọn!' }]"
                                class="m-0">
                                <a-checkbox v-model:checked="formState.checked">
                                    <div class="text-base font-[Lexend,sans-serif]">
                                        Tôi đã đọc và đồng ý với các
                                        <a href="https://itviec.com/blog/terms-conditions-vn/" target="_blank"
                                            class="text-[#007AFF]">Điều khoản dịch vụ</a>
                                        và
                                        <a href="https://itviec.com/blog/chinh-sach-bao-mat/" target="_blank"
                                            class="text-[#007AFF]">Chính sách quyền riêng tư</a>
                                        của ITviec liên quan đến thông tin riêng tư của tôi.
                                    </div>
                                </a-checkbox>
                            </a-form-item>
                        </div>
                        <div class="row-span-2 row-start-15 flex items-center text-base font-[Lexend,sans-serif]">
                            Đã có tài khoản Khách hàng?
                            <RouterLink to="/customer/login" class="ml-1 font-bold  "> Đăng nhập</RouterLink>
                        </div>
                        <div class="row-span-2 row-start-15 flex justify-end">
                            <a-button :loading="loading" type="primary" danger
                                class="w-[180px] h-12 bg-red-600 text-white rounded-[4px] text-base font-bold"
                                html-type="submit">Gửi thông tin</a-button>
                        </div>
                    </div>


                </a-form>



                <div class="w-2/6">

                    <div class="w-full bg-[#431D20] rounded-xl h-[100px] p-6 flex mb-[16px]">
                        <div class="w-[33px] h-full">
                            <img loading="lazy" class=" h-full object-contain"
                                src="../../../assets/image/icon/icons8_phone.svg" alt="">
                        </div>
                        <div class="text-white ml-5 flex flex-wrap ">
                            <div class="w-full text-base">Hotline Hồ Chí Minh</div>
                            <div class=" font-bold text-lg">0977 460 519</div>
                        </div>
                    </div>

                    <div class="w-full bg-[#431D20] rounded-xl h-[100px] p-6 flex mb-[16px]">
                        <div class="w-[33px] h-full">
                            <img loading="lazy" class=" h-full object-contain"
                                src="../../../assets/image/icon/icons8_phone.svg" alt="">
                        </div>
                        <div class="text-white ml-5 flex flex-wrap ">
                            <div class="w-full text-base">Hotline Hà Nội </div>
                            <div class=" font-bold text-lg">0983 131 531 </div>
                        </div>
                    </div>


                    <div class="w-full bg-[#431D20] rounded-xl h-[100px] p-6 flex mb-[16px]">
                        <div class="w-[33px] h-full">
                            <img loading="lazy" class=" h-full object-contain"
                                src="../../../assets/image/icon/icons8_time_red.svg" alt="">
                        </div>
                        <div class="text-white ml-5 flex flex-wrap ">
                            <div class="w-full text-base">Thời gian làm việc</div>
                            <div class=" font-bold text-lg">Thứ 2 - Thứ 6 | 8:30 - 17:00</div>
                        </div>
                    </div>

                </div>


            </div>
        </div>
    </div>



</template>
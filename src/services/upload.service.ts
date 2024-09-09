import { apiClient } from "../constant/api"

export const uploadApi = async (file: any,nameForder: string): Promise<any> => {
    try {
        const bodyFormData = new FormData();
        bodyFormData.append('fileUpload', file);
        const response = await apiClient.post('/files/upload', bodyFormData,
           {
               headers: {
                   'Content-Type': 'multipart/form-data',
                   'folder_type': nameForder
               }
           } 
        )
        return response.data
    } catch (err:any) {
        alert(
            err?.response?.data?.message
        )
    }
}
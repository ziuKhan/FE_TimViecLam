import { apiClient } from "../constant/api"

const moduleName = '/subscribers';

export const createSubscriberApi = async (data: any): Promise<any> => {
    try {
        const response = await apiClient.post(moduleName+'/create-or-update', data)
        return response.data
    } catch (err:any) {
        alert(
            err?.response?.data?.message
        )
    }
}


export const getSubscriberApi = async (email: any): Promise<any> => {
    try {
        const response = await apiClient.get(moduleName+'/email/'+email)
        return response.data
    } catch (err:any) {
        alert(
            err?.response?.data?.message
        )
    }
}

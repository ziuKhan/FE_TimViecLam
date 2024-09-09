import { apiClient } from "../constant/api"

const moduleName = '/users'

export const changePasswordApi = async (data: any): Promise<any> => {
    try {
        const response = await apiClient.patch(`${moduleName}/change-password`, data)
        return response.data
    } catch (err:any) {
        alert(
            err?.response?.data?.message
        )
    }
}
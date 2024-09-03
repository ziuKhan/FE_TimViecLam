import { apiClient } from "../constant/api"

const moduleName = '/jobs'

export const paginateJobsApi = async (params: any): Promise<any> => {
    try {
        const response = await apiClient.get(`${moduleName}${params}`)
        return response.data.data.result
    } catch (err:any) {
        alert(
            err?.response?.data?.message
        )
    }
}

export const getJobsApi = async (id: string): Promise<any> => {
    try {
        const response = await apiClient.get(`${moduleName}/${id}`)
        return response.data.data
    } catch (err:any) {
        alert(
            err?.response?.data?.message
        )
    }
}
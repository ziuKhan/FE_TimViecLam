import { apiClient } from '../constant/api'
import { handleApiError } from '../until/until'

const moduleName = '/jobs'

export const paginateJobsApi = async (params: any): Promise<any> => {
  try {
    const response = await apiClient.get(`${moduleName}${params}`)

    return response.data.data
  } catch (err: any) {
    handleApiError(err)
  }
}

export const getJobsApi = async (id: string): Promise<any> => {
  try {
    const response = await apiClient.get(`${moduleName}/${id}`)
    return response.data.data
  } catch (err: any) {
    handleApiError(err)
  }
}

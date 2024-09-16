import { apiClient } from '../constant/api'
import { handleApiError } from '../until/until'

const moduleName = '/resumes'
export const createResumeApi = async (data: any): Promise<any> => {
  try {
    const response = await apiClient.post(moduleName, data)
    return response.data
  } catch (err: any) {
    handleApiError(err)
  }
}

export const paginateResumeApi = async (params: any): Promise<any> => {
  try {
    const response = await apiClient.get(moduleName + params)
    return response.data.data
  } catch (err: any) {
    handleApiError(err)
  }
}

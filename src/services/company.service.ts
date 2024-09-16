import { apiClient } from '@/constant/api'
import { handleApiError } from '../until/until'
const moduleName = '/companies'

export const paginateCompanyApi = async (params: any): Promise<any> => {
  try {
    const response = await apiClient.get(`${moduleName}${params}`)
    return response.data.data.result
  } catch (err: any) {
        handleApiError(err) 

  }
}

export const getCompanyApi = async (id: string): Promise<any> => {
  try {
    const response = await apiClient.get(`${moduleName}/${id}`)
    return response.data.data
  } catch (err: any) {
        handleApiError(err) 

  }
}



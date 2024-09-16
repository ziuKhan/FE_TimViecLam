import { apiClient } from '../constant/api'
import { handleApiError } from '../until/until'

const moduleName = '/users'

export const changePasswordApi = async (data: any): Promise<any> => {
  try {
    const response = await apiClient.patch(`${moduleName}/change-password`, data)
    return response.data
  } catch (err: any) {
    handleApiError(err)
  }
}

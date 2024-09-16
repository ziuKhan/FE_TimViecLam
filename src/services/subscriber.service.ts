import { apiClient } from '../constant/api'
import { handleApiError } from '../until/until'

const moduleName = '/subscribers'

export const createSubscriberApi = async (data: any): Promise<any> => {
  try {
    const response = await apiClient.post(moduleName + '/create-or-update', data)
    return response.data
  } catch (err: any) {
    handleApiError(err)
  }
}

export const getSubscriberApi = async (email: any): Promise<any> => {
  try {
    const response = await apiClient.get(moduleName + '/email/' + email)
    return response.data
  } catch (err: any) {
    handleApiError(err)
  }
}

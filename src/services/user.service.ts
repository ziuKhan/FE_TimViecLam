import { apiClient } from '../constant/api'
import { handleApiError } from '../until/until'

const moduleName = '/users'
class User {
  changePasswordApi = async (data: any): Promise<any> => {
    try {
      const response = await apiClient.patch(`${moduleName}/change-password`, data)
      return response.data
    } catch (err: any) {
      handleApiError(err)
    }
  }

  paginateApi = async (params: any): Promise<any> => {
    try {
      const response = await apiClient.get(moduleName + params)
      return response.data.data
    } catch (err: any) {
      handleApiError(err)
    }
  }

  getApi = async (id: string): Promise<any> => {
    try {
      const response = await apiClient.get(moduleName + '/' + id)
      return response.data
    } catch (err: any) {
      handleApiError(err)
    }
  }

  createApi = async (data: any): Promise<any> => {
    try {
      debugger

      const response = await apiClient.post(moduleName, data)
      return response.data
    } catch (err: any) {
      handleApiError(err)
    }
  }

  updateApi = async (data: any, id: string): Promise<any> => {
    try {
      debugger

      const response = await apiClient.patch(moduleName + '/' + id, data)
      return response.data
    } catch (err: any) {
      handleApiError(err)
    }
  }

  deleteApi = async (id: string): Promise<any> => {
    try {
      const response = await apiClient.delete(moduleName + '/' + id)
      return response.data
    } catch (err: any) {
      handleApiError(err)
    }
  }
}

export default new User()

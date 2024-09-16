import { apiClient } from '../constant/api'
import { handleApiError } from '../until/until'

const moduleName = '/permissions'

export const paginatePermissionApi = async (params: any): Promise<any> => {
  try {
    const response = await apiClient.get(moduleName + params)
    return response.data.data
  } catch (err: any) {
    handleApiError(err)
  }
}

export const createPermissionApi = async (data: any): Promise<any> => {
  try {
    const response = await apiClient.post(moduleName, data)
    return response.data
  } catch (err: any) {
    handleApiError(err)
  }
}

export const updatePermissionApi = async (data: any, id: string): Promise<any> => {
  try {
    const response = await apiClient.patch(moduleName + '/' + id, data)
    return response.data
  } catch (err: any) {
    handleApiError(err)
  }
}

export const deletePermissionApi = async (id: string): Promise<any> => {
  try {
    const response = await apiClient.delete(moduleName + '/' + id)
    return response.data
  } catch (err: any) {
    handleApiError(err)
  }
}
export const getPermissionApi = async (id: string): Promise<any> => {
  try {
    const response = await apiClient.get(moduleName + '/' + id)
    return response.data
  } catch (err: any) {
    handleApiError(err)
  }
}

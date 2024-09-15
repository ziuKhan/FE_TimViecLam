import { apiClient } from '../constant/api'

const moduleName = '/permissions'

export const paginatePermissionApi = async (params: any): Promise<any> => {
  try {
    const response = await apiClient.get(moduleName + params)
    return response.data.data
  } catch (err: any) {
    alert(err?.response?.data?.message)
  }
}

export const createPermissionApi = async (data: any): Promise<any> => {
  try {
    const response = await apiClient.post(moduleName, data)
    return response.data
  } catch (err: any) {
    alert(err?.response?.data?.message)
  }
}

export const updatePermissionApi = async (data: any, id: string): Promise<any> => {
  try {
    const response = await apiClient.patch(moduleName + '/' + id, data)
    return response.data
  } catch (err: any) {
    alert(err?.response?.data?.message)
  }
}

export const deletePermissionApi = async (id: string): Promise<any> => {
  try {
    const response = await apiClient.delete(moduleName + '/' + id)
    return response.data
  } catch (err: any) {
    alert(err?.response?.data?.message)
  }
}
export const getPermissionApi = async (id: string): Promise<any> => {
  try {
    const response = await apiClient.get(moduleName + '/' + id)
    return response.data
  } catch (err: any) {
    alert(err?.response?.data?.message)
  }
}

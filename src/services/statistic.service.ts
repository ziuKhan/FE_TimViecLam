import { apiClient } from '../constant/api'
import type { IApiResponse } from '../types/backend'
import { handleApiError } from '../until/until'

const moduleName = '/statistics'

class Statistic {
  companyGrowthRate = async (): Promise<IApiResponse | undefined> => {
    try {
      const response = await apiClient.get(moduleName + '/company-growth-rate')
      return response.data
    } catch (err: any) {
      handleApiError(err)
    }
  }

  getApi = async (id: string): Promise<IApiResponse | undefined> => {
    try {
      const response = await apiClient.get(moduleName + '/' + id)
      return response.data
    } catch (err: any) {
      handleApiError(err)
    }
  }

  createApi = async (data: any): Promise<IApiResponse | undefined> => {
    try {
      const response = await apiClient.post(moduleName, data)
      return response.data
    } catch (err: any) {
      handleApiError(err)
    }
  }

  updateApi = async (data: any, id: string): Promise<IApiResponse | undefined> => {
    try {
      const response = await apiClient.patch(moduleName + '/' + id, data)
      return response.data
    } catch (err: any) {
      handleApiError(err)
    }
  }

  deleteApi = async (id: string): Promise<IApiResponse | undefined> => {
    try {
      const response = await apiClient.delete(moduleName + '/' + id)
      return response.data
    } catch (err: any) {
      handleApiError(err)
    }
  }
}

export default new Statistic()

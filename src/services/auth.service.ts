import { apiClient } from '../constant/api'
import { handleApiError } from '../until/until'

const moduleName = '/auth'

export const loginApi = async (username: string, password: string): Promise<any> => {
  try {
    const res = await apiClient.post(`${moduleName}/login`, {
      username,
      password
    })
    return res.data
  } catch (err: any) {
    handleApiError(err)
  }
}


export const loginByGoogleApi = async (): Promise<any> => {
  try {
    const res = await apiClient.get(`${moduleName}/google`)
    return res
  } catch (err: any) {
    handleApiError(err)
  }
}

export const refreshApi = async (): Promise<any> => {
  try {
    const res = await apiClient.get(`${moduleName}/refresh`)
    return res.data
  } catch (err: any) {}
}

export const registerApi = async (user: any): Promise<any> => {
  try {
    const res = await apiClient.post(`${moduleName}/register`, user)
    return res.data
  } catch (err: any) {
    handleApiError(err)
  }
}

export const registerHRApi = async (user: any): Promise<any> => {
  try {
    const res = await apiClient.post(`${moduleName}/customer/register`, user)
    return res.data
  } catch (err: any) {
    handleApiError(err)
  }
}

export const createCompanyApi = async (data: any): Promise<any> => {
  try {
    const res = await apiClient.post(`${moduleName}/customer/company`, data)
    return res.data
  } catch (err: any) {
    handleApiError(err)
  }
}

export const logoutApi = async (): Promise<any> => {
  try {
    const res = await apiClient.post(`${moduleName}/logout`)
    return res.data
  } catch (err: any) {
    handleApiError(err)
  }
}

export const accountApi = async (): Promise<any> => {
  try {
    const res = await apiClient.get(`${moduleName}/account`)
    return res.data
  } catch (err: any) {}
}

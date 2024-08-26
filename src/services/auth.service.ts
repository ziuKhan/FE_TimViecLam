import { apiClient } from "../constant/api"

const moduleName = '/auth';

export const loginApi = async (username: string, password: string): Promise<any> => {
    try {
        const res = await apiClient.post(`${moduleName}/login`, { 
            username,
            password
        })
        return res.data
    } catch (err:any) {
        alert(
           err?.response?.data?.message 
        )
    }
}

export const registerApi = async (user: any): Promise<any> => {
    try {
        const res = await apiClient.post(`${moduleName}/register`, user)
        return res.data
    } catch (err:any) {
        alert(
           err?.response?.data?.message 
        )
    }
}

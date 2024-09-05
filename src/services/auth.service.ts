import { apiClient } from "../constant/api"

const moduleName = '/auth';

import Cookies from 'js-cookie';

export const loginApi = async (username: string, password: string): Promise<any> => {
    try {
        const res = await apiClient.post(`${moduleName}/login`, { 
            username,
            password
        },
        {withCredentials: true});
        return res.data;
    } catch (err:any) {
        alert(
           err?.response?.data?.message 
        );
    }
}


export const refreshApi = async (): Promise<any> => {
    try {
        const res = await apiClient.get(`${moduleName}/refresh`, {withCredentials: true})
        console.log('check refresh api',res.data)
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

export const logoutApi = async (): Promise<any> => {
    try {
        const res = await apiClient.post(`${moduleName}/logout`)
        return res.data
    } catch (err:any) {
        alert(
           err?.response?.data?.message 
        )
    }
}
export const accountApi = async (token:any): Promise<any> => {
    try {
        const res = await apiClient.get(`${moduleName}/account`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        console.log('check account api',res.data)
        return res.data
    } catch (err:any) {
        alert(
           err?.response?.data?.message 
        )
    }
}

export const accountApi2 = async (): Promise<any> => {
    try{
        const res = await apiClient.get(`${moduleName}/account`)
        return res.data 
    }
    catch (err:any) {
       
    }
      
}

import { apiClient } from '@/constant/api'

export const paginateCompanyApi = async (params: any): Promise<any> => {
  try {
    const res = await apiClient.get(`/companies${params}`)
    return res.data.data.result
  } catch (err:any) {
    alert(
       err?.response?.data?.message 
    );
}
}


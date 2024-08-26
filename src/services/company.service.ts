import { apiClient } from '@/constant/api'

export const paginateCompanyApi = async (): Promise<any> => {
  try {
    const res = await apiClient.get('/companies?current=1&pageSize=4&sort=-updatedAt')

    return res.data
  } catch (err: unknown) {
    console.log(err)
  }
}

import axios from 'axios'

export const getCountry = async (): Promise<any> => {
  try {
    const response = await axios.get('https://open.oapi.vn/location/countries')
    return response.data
  } catch (error) {
    console.log(error)
  }
}
export const getConscious = async (): Promise<any> => {
  try {
    const response = await axios.get('https://esgoo.net/api-tinhthanh/1/0.htm')
    return response.data
  } catch (error) {
    console.log(error)
  }
}
export const getDistrict = async (id: string): Promise<any> => {
  try {
    const response = await axios.get(`https://esgoo.net/api-tinhthanh/2/${id}.htm`)
    return response.data
  } catch (error) {
    console.log(error)
  }
}

export const getWard = async (id: string): Promise<any> => {
  try {
    const response = await axios.get(`https://esgoo.net/api-tinhthanh/3/${id}.htm`)
    return response.data
  } catch (error) {
    console.log(error)
  }
}

import axios from 'axios'
import { refreshApi } from '../services/auth.service' // Import hàm refresh
import TokenService from './token.service'
import accountService from './account.service'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api/v1',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  timeout: 1000 * 60 * 30 * 3
})

// Interceptor request để thêm header Authorization
apiClient.interceptors.request.use(
  (config) => {
    const token = TokenService.getToken()?.token
    if (token && token !== 'undefined') {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error.config
    // Nếu lỗi là 401 (Unauthorized) và chưa thực hiện refresh
    if (error.response?.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true

      try {
        debugger
        const res = await refreshApi()
        const { access_token } = res.data // Lấy accessToken từ response

        // Lưu token mới vào local storage
        TokenService.updateToken(access_token)
        accountService.updateAccount()

        // Thêm token mới vào header Authorization
        originalConfig.headers['Authorization'] = `Bearer ${access_token}`

        // Thực hiện lại request ban đầu
        return apiClient(originalConfig)
      } catch (refreshError) {
        // Xu lys khi token loi
        TokenService.removeToken()
        accountService.removeAccount()

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export const linkUploads = (id: string) => `${import.meta.env.VITE_API_URL}/images/${id}`

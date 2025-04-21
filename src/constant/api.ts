import axios from 'axios'
import TokenService from '../services/token.service'
import { useAuthStore } from '../stores/AuthStore'
import accountService from '../services/account.service'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api/v1/',
  headers: TokenService.getToken().header,
  timeout: 15000,
  withCredentials: true
})

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = TokenService.getToken().header
    if (token) {
      config.headers['Authorization'] = token['Authorization']
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Mảng lưu trữ các yêu cầu đang chờ khi đang refresh token
const pendingRequests: any[] = [];

// Add a response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const store = useAuthStore()
        // Sử dụng refreshToken từ store, nhiều request sẽ dùng cùng một promise
        const access_token = await store.refreshToken()
        
        if (access_token) {
          apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + access_token
          await accountService.updateAccount()
          
          // Thực hiện lại request ban đầu với token mới
          return apiClient(originalRequest)
        } else {
          // Nếu không nhận được token mới, đăng xuất
          await store.logout()
          return Promise.reject(error)
        }
      } catch (_error) {
        const store = useAuthStore()
        await store.logout()
        return Promise.reject(_error)
      } 
    }
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout.')
    }
    return Promise.reject(error)
  }
)

export const linkUploads = (id: string) => `${import.meta.env.VITE_API_URL}/images/${id}`

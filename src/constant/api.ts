import axios from 'axios'
import Cookies from 'js-cookie'
import { useAuthStore } from '../stores/AuthStore'
import router from '@/router' // Import router để điều hướng

export const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  timeout: 1000 * 60 * 30 * 3
})

// Interceptor request để thêm header Authorization
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor để xử lý tự động refresh token và lỗi
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Kiểm tra xem có lỗi 401 và chưa thử refresh token hay không
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Refresh token
        const { data } = await apiClient.get('/auth/refresh')
        localStorage.setItem('access_token', data.data.access_token)

        // Cập nhật token mới vào headers
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.data.access_token}`

        // Thực hiện lại yêu cầu gốc
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Điều hướng đến trang 401 nếu refresh token thất bại
        router.push({ name: 'Unauthorized' })
        return Promise.reject(refreshError)
      }
    }

    // Điều hướng đến các trang lỗi dựa trên status code
    if (error.response && error.response.status === 400) {
      router.push({ name: 'BadRequest' })
    } else if (error.response && error.response.status === 500) {
      router.push({ name: 'ServerError' })
    }

    return Promise.reject(error)
  }
)

export const linkUploads = (id: string) => `http://localhost:8080/images/${id}`

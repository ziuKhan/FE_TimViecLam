import axios from 'axios'
import Cookies from 'js-cookie'
import { useAuthStore } from '../stores/user/AuthStore'
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

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Gọi API refresh token
        const { data } = await apiClient.get('/auth/refresh')

        // Cập nhật token mới vào localStorage và header
        localStorage.setItem('access_token', data.data.access_token)
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.data.access_token}`

        // Gửi lại request ban đầu với token mới
        originalRequest.headers['Authorization'] = `Bearer ${data.data.access_token}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Nếu refresh token thất bại, có thể chuyển hướng người dùng đến trang đăng nhập
        const authStore = useAuthStore()
        authStore.logout() // Gọi hành động logout nếu cần
        router.push('/login')
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export const linkUploads = (id: string) => `http://localhost:8080/images/${id}`

import axios from 'axios'
import Cookies from 'js-cookie';

export const apiClient = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 1000 * 60 * 30 * 3
});

// Interceptor request để thêm header Authorization
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Interceptor để xử lý tự động refresh token
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get('refresh_token');
        if (!refreshToken) {
          throw new Error('Không tìm thấy refresh_token');
        }

        // Refresh token
        const { data } = await apiClient.get('/auth/refresh');
        localStorage.setItem('access_token', data.access_token)

        // Cập nhật token mới vào headers
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;

        // Thực hiện lại yêu cầu gốc
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


export const linkUploads = (id: string) => `http://localhost:8080/images/${id}`



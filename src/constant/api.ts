import axios from 'axios'
import { refreshApi } from '../services/auth.service' // Import hàm refresh
import TokenService from './token.service'
import accountService from './account.service'
import { useAuthStore } from '../stores/AuthStore'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api/v1',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
})

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = TokenService.getToken().token;
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      
      const store = useAuthStore();
      originalRequest._retry = true;
      try {
        const access_token = await store.refreshToken();
        apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
        return apiClient(originalRequest);
      } catch (_error) {
        store.logout();
        return Promise.reject(_error);
      }
    }
    return Promise.reject(error);
  }
);

export const linkUploads = (id: string) => `${import.meta.env.VITE_API_URL}/images/${id}`

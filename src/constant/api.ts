import axios from 'axios'

export const apiClient = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 1000 * 60 * 30 * 3
});

export const linkUploads = (id: string) => `http://localhost:8080/images/${id}`



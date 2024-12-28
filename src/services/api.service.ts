import { apiClient } from '../constant/api'

class API {
  private async handleRequest(request: () => Promise<any>) {
    return request().catch((error: any) => {
      if (error.code === 'ECONNABORTED') {
        console.error('Request timed out')
      } else {
        console.error('An error occurred:', error.message)
      }
      throw error
    })
  }

  async get(patch: string) {
    const response = await this.handleRequest(() => apiClient.get(patch))
    return response.data
  }

  async add(patch: string, params: any) {
    const response = await this.handleRequest(() => apiClient.post(patch, params))
    return response.data
  }

  async update(patch: string, params: any) {
    const response = await this.handleRequest(() => apiClient.patch(patch, params))
    return response.data
  }

  async delete(patch: string) {
    const response = await this.handleRequest(() => apiClient.delete(patch))
    return response.data
  }
  async upload(file: any, nameForder: string) {
    const bodyFormData = new FormData()
    bodyFormData.append('fileUpload', file)
    const response = await apiClient.post('/files/upload', bodyFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        folder_type: nameForder
      }
    })
    return response.data
  }
}
export default new API()

import API from './api.service'

class TokenService {
  getToken() {
    const token_local = localStorage.getItem('access_token')
    if (token_local) {
      return {
        header: {
          Authorization: 'Bearer ' + token_local,
          'Content-Type': 'application/json'
        },
        storage: 'local'
      }
    }
    const token_session = sessionStorage.getItem('access_token')
    if (token_session) {
      return {
        header: { Authorization: 'Bearer ' + token_session, 'Content-Type': 'application/json' },
        storage: 'session'
      }
    }
    return { header: { 'Content-Type': 'application/json' }, storage: null }
  }

  createToken(token: string, isRemember?: boolean) {
    if (isRemember) {
      return localStorage.setItem('access_token', token)
    }
    return sessionStorage.setItem('access_token', token)
  }

  updateToken(newToken: string) {
    const { storage } = this.getToken()
    if (storage === 'local') {
      localStorage.setItem('access_token', newToken)
    } else if (storage === 'session') {
      sessionStorage.setItem('access_token', newToken)
    }
  }

  removeToken() {
    localStorage.removeItem('access_token')
    sessionStorage.removeItem('access_token')
  }
}

export default new TokenService()

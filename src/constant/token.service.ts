class TokenService {
  getToken() {
    const token_local = localStorage.getItem('access_token')
    if (token_local) {
      return { token: token_local, storage: 'local' }
    }
    const token_session = sessionStorage.getItem('access_token')
    if (token_session) {
      return { token: token_session, storage: 'session' }
    }
    return { token: '', storage: null }
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

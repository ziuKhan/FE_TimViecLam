import tokenService from '../constant/token.service'

export default function authHeader() {
  const user: string = tokenService.getToken().token
  if (user) {
    return { Authorization: `Bearer ${user}`, 'Content-Type': 'application/json' }
  } else {
    return {}
  }
}

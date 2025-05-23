import accountService from '../services/account.service'
import type { RouteLocation, NavigationGuardNext } from 'vue-router'

// Mở rộng IUserbyAccount để bao gồm thuộc tính isSetup
interface UserWithSetup {
  isSetup: boolean
  role: {
    _id: string
    name: string
  }
  google: boolean
}

/**
 * Middleware kiểm tra thiết lập tài khoản
 * Nếu tài khoản có role là HR_USER và isSetup = false thì sẽ tự động chuyển hướng đến trang /account-setup
 */
const checkAccountSetup = async (
  to: RouteLocation,
  from: RouteLocation,
  next: NavigationGuardNext
) => {
  try {
    const { account } = accountService.getAccount()

    // Nếu không có tài khoản, cho phép điều hướng
    if (!account) {
      return next()
    }

    const accountWithSetup = account as unknown as UserWithSetup

    // Nếu đã setup thì không cho phép vào trang setup
    if (accountWithSetup.isSetup) {
      if (to.path === '/account-setup' || to.path === '/account-setup-pass') {
        return next({ path: '/' })
      }
      return next()
    }

    // Nếu chưa setup
    if (!accountWithSetup.isSetup) {
      // Sau đó mới xử lý tài khoản HR_USER
      if (accountWithSetup.role?.name === 'HR_USER') {
        if (to.path !== '/account-setup') {
          return next({ path: '/account-setup' })
        }
      }
      // Ưu tiên xử lý tài khoản Google trước
      else if (accountWithSetup.google) {
        if (to.path !== '/account-setup-pass') {
          return next({ path: '/account-setup-pass' })
        }
      }
    }

    // Mặc định cho phép điều hướng
    return next()
  } catch (error) {
    console.error('Error in checkAccountSetup:', error)
    return next()
  }
}

export default checkAccountSetup

import accountService from "../services/account.service"
import type { RouteLocation, NavigationGuardNext } from 'vue-router'

/**
 * Middleware kiểm tra và chuyển hướng khi đăng nhập
 * Nếu người dùng đã đăng nhập và có role SUPER_ADMIN hoặc NORMAL_ADMIN, chuyển hướng đến trang admin
 */
const checkLoginRedirect = (
  to: RouteLocation, 
  from: RouteLocation, 
  next: NavigationGuardNext
) => {
  const { account } = accountService.getAccount()
  
  if (
    account &&
    (account.role.name === 'SUPER_ADMIN' || account.role.name === 'NORMAL_ADMIN' || account.role.name === 'HR_USER')
  ) {
    return next({ path: '/admin' })
  }
  
  next()
}

export default checkLoginRedirect 
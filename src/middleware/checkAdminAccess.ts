import accountService from '../services/account.service'
import type { RouteLocation, NavigationGuardNext } from 'vue-router'

/**
 * Middleware kiểm tra quyền truy cập trang admin
 * Chỉ cho phép người dùng có role SUPER_ADMIN, NORMAL_ADMIN, hoặc HR_USER truy cập trang admin
 */
const checkAdminAccess = (to: RouteLocation, from: RouteLocation, next: NavigationGuardNext) => {
  const { account } = accountService.getAccount()

  // Nếu không có tài khoản, chuyển hướng đến trang đăng nhập
  if (!account) {
    return next({ name: 'login' })
  }

  // Kiểm tra role của người dùng
  if (
    account.role.name !== 'SUPER_ADMIN' &&
    account.role.name !== 'NORMAL_ADMIN' &&
    account.role.name !== 'HR_USER'
  ) {
    return next({ name: 'login' })
  }

  // Cho phép truy cập trang admin
  next()
}

export default checkAdminAccess

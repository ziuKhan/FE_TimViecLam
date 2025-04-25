import accountService from "../services/account.service"
import type { RouteLocation, NavigationGuardNext } from 'vue-router'

// Mở rộng IUserbyAccount để bao gồm thuộc tính isSetup
interface UserWithSetup {
  isSetup: boolean;
  role: {
    _id: string;
    name: string;
  };
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
  const { account } = accountService.getAccount()
  
  // Nếu không có tài khoản, cho phép điều hướng
  if (!account) {
    return next()
  }
  
  // Kiểm tra xem tài khoản có thuộc tính isSetup không
  const accountWithSetup = account as unknown as UserWithSetup;
  
  // Kiểm tra nếu tài khoản có role là HR_USER và isSetup = false
  // và không đang ở trang account-setup, thì chuyển hướng đến trang account-setup
  if (
    accountWithSetup.role.name === 'HR_USER' && 
    accountWithSetup.isSetup === false && 
    to.path !== '/account-setup'
  ) {
    return next({ path: '/account-setup' })
  }
  if (
    accountWithSetup.role.name === 'HR_USER' && 
    accountWithSetup.isSetup === true && 
    to.path === '/account-setup'
  ) {
    return next({ path: '/' })
  }

  // Mặc định cho phép điều hướng
  next()
}

export default checkAccountSetup


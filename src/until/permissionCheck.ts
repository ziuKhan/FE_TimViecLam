import { de } from 'date-fns/locale/de'
import accountService from '../services/account.service'
import { useAuthStore } from '../stores/AuthStore'

/**
 * Kiểm tra xem người dùng có quyền cần thiết hay không
 * Cách sử dụng:
 * 1. Gọi như hàm đồng bộ: checkPermission('GET /api/v1/users')
 * 2. Gọi với await: await checkPermission('GET /api/v1/users')
 */
export function checkPermission(requiredPermission: string): boolean {
  const store = useAuthStore()

  // Sử dụng trực tiếp phương thức hasPermission từ store
  return store.hasPermission(requiredPermission)
}

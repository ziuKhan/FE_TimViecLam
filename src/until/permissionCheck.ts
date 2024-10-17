
import { de } from 'date-fns/locale/de';
import accountService from '../constant/account.service';

export function checkPermission(requiredPermission: string): boolean {
  const { account } = accountService.getAccount();
  if (!account || !account.permissions) return false;

  return account.permissions.some(permission => 
    permission.apiPath === requiredPermission.split(' ')[1] && 
    permission.method === requiredPermission.split(' ')[0]
  );
}


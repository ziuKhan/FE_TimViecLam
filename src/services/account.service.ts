import { accountApi } from './auth.service'
import type { IUserbyAccount } from '../types/backend'

export interface IGetAccount {
  account: IUserbyAccount | null
  storage: 'local' | 'session' | null
}

class AccountService {
  getAccount(): IGetAccount {
    const account_local = localStorage.getItem('account')
    if (account_local) {
      return { account: JSON.parse(account_local) as IUserbyAccount, storage: 'local' }
    }
    const account_session = sessionStorage.getItem('account')
    if (account_session) {
      return { account: JSON.parse(account_session) as IUserbyAccount, storage: 'session' }
    }
    return { account: null, storage: null }
  }

  async createAccount(isRemember?: boolean) {
    const newAccount = await accountApi()
    if (isRemember) {
      return localStorage.setItem('account', JSON.stringify(newAccount.data))
    }
    return sessionStorage.setItem('account', JSON.stringify(newAccount.data))
  }

  async updateAccount() {
    const newAccount = await accountApi()
    const { storage } =  this.getAccount()
    if (storage === 'local') {
     return  localStorage.setItem('account', JSON.stringify(newAccount.data))
    } else if (storage === 'session') {
     return  sessionStorage.setItem('account', JSON.stringify(newAccount.data))
    }
  }

  removeAccount() {
    localStorage.removeItem('account')
    sessionStorage.removeItem('account')
  }
}

export default new AccountService()

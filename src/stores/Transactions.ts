import { defineStore } from 'pinia'
import { computed, onBeforeMount, onMounted, ref } from 'vue'

import { message } from 'ant-design-vue'
import { accountApi, logoutApi, refreshApi } from '../services/auth.service'
import type { IPermission, ITransaction, IUser, IUserbyAccount } from '../types/backend'
import tokenService from '../services/token.service'
import accountService from '../services/account.service'
import apiService from '../services/api.service'

export const useTransactionsStore = defineStore('transactions', () => {
  const account = accountService.getAccount()?.account
  const dataTransaction = ref<ITransaction>({
    amount: 0,
    buyerName: account?.name,
    buyerEmail: account?.email,
    description: '',
    cancelUrl: window.location.origin + '/cancel',
    returnUrl: window.location.origin + '/success',
    packageId: '',
    type: 'VIP_UPGRADE'
  })
  // http://localhost:5000/cancel?code=00&id=7a5c14b430704851abeb2e1099a99e1d&cancel=true&status=CANCELLED&orderCode=127
  const handleDonate = async () => {
    try {
      const res = await apiService.add(`transactions`, dataTransaction.value)
      if (res.data) {
        window.location.href = res.data.checkoutUrl
      }
    } catch (error: any) {
      message.error(error.response.data.message || 'Đã xảy ra lỗi trong quá trình thanh toán')
    }
  }

  return {
    dataTransaction,
    handleDonate
  }
})

import { toast } from 'react-hot-toast'

export function useTransactionToast() {
  const showSuccessToast = (message: string) => {
    toast.success(message)
  }

  const showBadgeSuccessToast = (message: string) => {
    toast.success(message, { id: 'badge success' })
  }

  const showBalanceSuccessToast = (message: string) => {
    toast.success(message, { id: 'balance success' })
  }

  const showErrorToast = (message: string) => {
    toast.error(message)
  }

  const showLoadingToast = (message: string) => {
    toast.loading(message, { id: 'loading' })
  }

  const showInfoToast = (message: string) => {
    toast(message, { id: 'info' })
  }

  return {
    showSuccessToast,
    showErrorToast,
    showLoadingToast,
    showInfoToast,
    showBadgeSuccessToast,
    showBalanceSuccessToast
  }
}

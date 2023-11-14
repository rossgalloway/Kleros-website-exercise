import { toast } from 'react-hot-toast'

export function useTransactionToast() {
  const showSuccessToast = (message: string, id?: string) => {
    return toast.success(message, { id: id })
  }

  const showBadgeSuccessToast = (message: string, id?: string) => {
    return toast.success(message, { id: id || 'badge success' })
  }

  const showBalanceSuccessToast = (message: string, id?: string) => {
    return toast.success(message, { id: id || 'balance success' })
  }

  const showErrorToast = (message: string, id?: string) => {
    return toast.error(message, { id: id })
  }

  const showLoadingToast = (message: string, id?: string) => {
    return toast.loading(message, { id: id || 'loading' })
    // return toast.loading(message, { id: id })
  }

  const showInfoToast = (message: string, id?: string) => {
    return toast(message, { id: id || 'info' })
    // return toast(message, { id: id })
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

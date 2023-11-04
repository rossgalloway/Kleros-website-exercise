import { toast } from 'react-hot-toast'

export function useTransactionToast() {
  const showSuccessToast = (message: string) => {
    toast.success(message)
  }

  const showErrorToast = (message: string) => {
    toast.error(message)
  }

  const showLoadingToast = (message: string) => {
    toast.loading(message)
  }

  const showInfoToast = (message: string) => {
    toast(message)
  }

  // ... other toast methods

  return { showSuccessToast, showErrorToast, showLoadingToast, showInfoToast }
}

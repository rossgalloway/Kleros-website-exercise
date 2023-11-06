import { toast } from 'react-hot-toast'

export function useTransactionToast() {
  const showSuccessToast = (message: string) => {
    toast.success(message)
  }

  const showErrorToast = (message: string) => {
    toast.error(message)
  }

  const showLoadingToast = (message: string) => {
    toast.loading(message, { id: 'loading' })
  }

  const showInfoToast = (message: string) => {
    toast(message)
  }

  return { showSuccessToast, showErrorToast, showLoadingToast, showInfoToast }
}

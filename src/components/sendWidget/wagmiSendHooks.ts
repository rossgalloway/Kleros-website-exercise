import {
  useSendTransaction,
  useWaitForTransaction,
  useContractWrite,
  usePrepareContractWrite,
  erc20ABI
} from 'wagmi'
import { Address, TransactionReceipt } from 'viem'
import { useEffect, useRef } from 'react'
import { toast } from 'react-hot-toast'
import { useTransactionToast } from '../../hooks/useToast'
import { TokenData } from '../../types/tokenListTypes'

export const useEthSend = () => {
  const {
    sendTransaction,
    data: transactionHash,
    error: initializeError,
    isLoading,
    isError: sendIsError
  } = useSendTransaction()

  const {
    data: receipt,
    isLoading: isPending,
    isSuccess,
    error: transactionError,
    isError: TransactionIsError
  } = useWaitForTransaction({ hash: transactionHash?.hash })

  useSendTransactionToasts(
    isSuccess,
    isLoading,
    isPending,
    sendIsError,
    TransactionIsError,
    receipt
  )

  return {
    sendTransaction,
    transactionHash,
    initializeError,
    isLoading,
    sendIsError,
    receipt,
    isPending,
    isSuccess,
    transactionError,
    TransactionIsError
  }
}

export const useErc20Send = (
  selectedToken: TokenData,
  validAddress: Address,
  formattedTokenQty: bigint
) => {
  const { config } = usePrepareContractWrite({
    address: selectedToken.addr,
    abi: erc20ABI,
    functionName: 'transfer',
    args: [validAddress, formattedTokenQty]
  })

  const {
    write: writeErc20Transfer,
    data: transactionHash,
    error: initializeError,
    isLoading,
    isError: sendIsError
  } = useContractWrite(config)

  const {
    data: receipt,
    isLoading: isPending,
    isSuccess,
    error: transactionError,
    isError: TransactionIsError
  } = useWaitForTransaction({ hash: transactionHash?.hash })

  useSendTransactionToasts(
    isSuccess,
    isLoading,
    isPending,
    sendIsError,
    TransactionIsError,
    receipt
  )

  return {
    writeErc20Transfer,
    transactionHash,
    initializeError,
    isLoading,
    sendIsError,
    receipt,
    isPending,
    isSuccess,
    transactionError,
    TransactionIsError
  }
}

const useSendTransactionToasts = (
  isSuccess: boolean,
  isLoading: boolean,
  isPending: boolean,
  sendIsError: boolean,
  transactionIsError: boolean,
  receipt: TransactionReceipt | undefined
) => {
  const { showSuccessToast, showErrorToast, showLoadingToast, showInfoToast } =
    useTransactionToast()
  const currentToastId = useRef('')

  useEffect(() => {
    // Dismiss the current toast when the state changes
    if (currentToastId.current) {
      toast.dismiss(currentToastId.current)
      currentToastId.current = ''
    }

    if (isLoading) {
      currentToastId.current = showInfoToast('Check wallet to send transaction')
    } else if (isPending) {
      currentToastId.current = showLoadingToast('Transaction processing...')
    } else if (isSuccess) {
      currentToastId.current = showSuccessToast('Transfer successful!')
      console.log('Transaction Receipt', receipt)
    } else if (sendIsError || transactionIsError) {
      currentToastId.current = showErrorToast(
        'Transaction failed - see console for info'
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isSuccess,
    isLoading,
    isPending,
    sendIsError,
    transactionIsError,
    receipt
  ])

  // Clean up the toast on unmount or when the component rerenders
  useEffect(() => {
    return () => {
      if (currentToastId.current) {
        toast.dismiss(currentToastId.current)
      }
    }
  }, [])
}

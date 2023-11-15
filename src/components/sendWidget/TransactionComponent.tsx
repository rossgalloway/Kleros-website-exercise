import React, { useEffect, useRef } from 'react'
import { type Address, useSendTransaction, useWaitForTransaction } from 'wagmi'
import { TransactionReceipt } from 'viem'
import toast from 'react-hot-toast'
import { useTransactionToast } from '../../hooks/useToast'
import { useDappContext } from '../../contexts/dAppContext'
import { type TransactionComponentProps } from './transactionComponentTypes'

// TransactionComponent.jsx
export const TransactionComponent = ({
  id,
  transactionDetails,
  onTransactionComplete
}: TransactionComponentProps) => {
  const { setActiveTransactions } = useDappContext()

  const {
    sendTransactionAsync: sendTransaction,
    data: transactionHash,
    error: initializeError,
    isLoading,
    isError: sendIsError
    // ... other states from useSendTransaction
  } = useSendTransaction()

  const {
    data: receipt,
    isLoading: isPending,
    isSuccess,
    error: transactionError,
    isError: transactionIsError
    // ... other states from useWaitForTransaction
  } = useWaitForTransaction({ hash: transactionHash?.hash })

  useEffect(() => {
    console.log('TransactionComponent mounted')
  }, [])

  /**
   * Initialize the transaction
   */
  useEffect(() => {
    if (!transactionDetails.to) {
      console.error('Missing Recipient')
      return
    }
    const sendAsyncTransaction = async () => {
      console.log('sending transaction...')
      try {
        const result = await sendTransaction(transactionDetails)
        const hash = result.hash

        // Update the activeTransactions state
        setActiveTransactions((prev) =>
          prev.map((transaction) =>
            transaction.id === id ? { ...transaction, hash } : transaction
          )
        )
        console.log('hash: ', hash)
      } catch (error) {
        console.error('Failed to send transaction', error)
      }
    }

    sendAsyncTransaction()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useSendTransactionToasts(
    id,
    isSuccess,
    isLoading,
    isPending,
    initializeError,
    sendIsError,
    transactionIsError,
    receipt
  )

  useEffect(() => {
    if (isSuccess) {
      // Transaction completed successfully
      onTransactionComplete({
        status: 'success',
        receipt: receipt,
        id: transactionHash?.hash as Address
      })
    } else if (transactionIsError) {
      // Transaction failed
      onTransactionComplete({
        status: 'error',
        error: transactionError,
        id: transactionHash?.hash as Address
      })
    }
  }, [
    isSuccess,
    receipt,
    onTransactionComplete,
    transactionHash,
    transactionIsError,
    transactionError
  ])

  // Render nothing or a UI element to show transaction status
  return <div>{transactionHash?.hash}</div> // or some JSX
}

export default React.memo(TransactionComponent)

const useSendTransactionToasts = (
  id: string,
  isSuccess: boolean,
  isLoading: boolean,
  isPending: boolean,
  initializeError: Error | null,
  sendIsError: boolean,
  transactionIsError: boolean,
  receipt: TransactionReceipt | undefined
) => {
  const { showLoadingToast } = useTransactionToast()
  const currentToastId = useRef('')
  //TODO: switching tokens clears the toasts

  useEffect(() => {
    // Dismiss the current toast when the state changes
    if (currentToastId.current) {
      toast.dismiss(currentToastId.current)
      currentToastId.current = ''
    }

    if (isLoading) {
      currentToastId.current = showLoadingToast(
        'Check wallet to send transaction',
        id
      )
    } else if (isPending) {
      currentToastId.current = showLoadingToast('Transaction processing...', id)
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

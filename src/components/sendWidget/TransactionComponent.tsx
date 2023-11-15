import React, { useEffect, useRef } from 'react'
import {
  type Address,
  useSendTransaction,
  useWaitForTransaction,
  usePrepareContractWrite,
  erc20ABI,
  useContractWrite
} from 'wagmi'
import { TransactionReceipt } from 'viem'
import toast from 'react-hot-toast'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import { useTransactionToast } from '../../hooks/useToast'
import { useDappContext } from '../../contexts/dAppContext'
import {
  ErcPayload,
  EthPayload,
  PayloadType,
  type TransactionComponentProps
} from './transactionComponentTypes'

// TransactionComponent.jsx
export const TransactionComponent = ({
  id,
  type,
  transactionDetails,
  onTransactionComplete
}: TransactionComponentProps) => {
  const { setActiveTransactions } = useDappContext()
  const addRecentTransaction = useAddRecentTransaction()

  let payload: EthPayload | ErcPayload

  if (type == PayloadType.EthPayload) {
    payload = transactionDetails as EthPayload
  } else {
    payload = transactionDetails as ErcPayload
  }

  //eth send transaction
  const {
    sendTransactionAsync: sendTransaction,
    data: ethTransactionHash,
    error: ethInitializeError,
    isLoading: ethIsLoading,
    isError: ethSendIsError
    // ... other states from useSendTransaction
  } = useSendTransaction()

  // erc prep for transaction
  const { config } = usePrepareContractWrite({
    address: payload.token,
    abi: erc20ABI,
    functionName: 'transfer',
    args: [transactionDetails.to, transactionDetails.value]
  })

  // erc send transaction
  const {
    writeAsync: writeErc20Transfer,
    data: ercTransactionHash,
    error: ercInitializeError,
    isLoading: ercIsLoading,
    isError: ercSendIsError
  } = useContractWrite(config)

  const isLoading = ethIsLoading || ercIsLoading
  const sendIsError = ethSendIsError || ercSendIsError
  const initializeError = ethInitializeError || ercInitializeError
  const transactionHash = ethTransactionHash || ercTransactionHash

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
    if (type == PayloadType.EthPayload) {
      const sendAsyncTransaction = async () => {
        console.log('sending transaction...')
        try {
          const result = await sendTransaction(payload)
          const hash = result.hash
          addRecentTransaction({
            hash: String(hash),
            description: 'Send ETH transaction'
          })

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
    } else if (type == PayloadType.ErcPayload) {
      if (!writeErc20Transfer) return
      const sendAsyncTransaction = async () => {
        console.log('sending transaction...')
        try {
          const result = await writeErc20Transfer()
          const hash = result.hash
          // add to rainbow wallet
          addRecentTransaction({
            hash: String(hash),
            description: 'Send ERC-20 transaction'
          })

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
    }
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
  return null // or some JSX
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
  const { showLoadingToast, showErrorToast } = useTransactionToast()
  const { setActiveTransactions } = useDappContext()
  const currentToastId = useRef('')

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
    } else if (initializeError) {
      currentToastId.current = showErrorToast(
        'Transaction failed in wallet',
        id
      )
      setActiveTransactions((prev) => prev.filter((tx) => tx.id !== id))
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

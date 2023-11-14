import React, { useEffect, useReducer, useState } from 'react'
import { Button } from '@radix-ui/themes'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import { uniqueId } from 'lodash'
import { TransactionReceipt } from 'viem'
import { type Address, useSendTransaction, useWaitForTransaction } from 'wagmi'
import { useTransactionToast } from '../../hooks/useToast'

type EthSendButtonProps = {
  validAddress: Address
  formattedTokenQty: bigint
}

type TransactionState = {
  id: string
  isSuccess: boolean
  isLoading: boolean
  isPending: boolean
  sendIsError: boolean
  transactionIsError: boolean
  receipt: TransactionReceipt | undefined
  transactionHash: { hash: string } | undefined
}

type TransactionAction =
  | { type: 'ADD'; transaction: TransactionState }
  | { type: 'UPDATE'; index: number; transaction: Partial<TransactionState> }

/**
 * hook that collects the wagmi send hooks and returns a function that can be called to send a transaction
 * @returns
 */
export const useEthSend = () => {
  const {
    sendTransaction: send,
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
    isError: transactionIsError
  } = useWaitForTransaction({ hash: transactionHash?.hash })

  const sendTransaction = (transactionDetails) => {
    send(transactionDetails)
    const id = uniqueId('eth-send-')

    return {
      id,
      transactionHash,
      initializeError,
      isLoading,
      sendIsError,
      receipt,
      isPending,
      isSuccess,
      transactionError,
      transactionIsError
    }
  }

  return sendTransaction
}

const EthSendButton = ({
  validAddress,
  formattedTokenQty
}: EthSendButtonProps) => {
  const sendTransaction = useEthSend()
  const addRecentTransaction = useAddRecentTransaction()
  const handleTransaction = useSendTransactionToasts()
  const [transactionState, setTransactionState] = useState<TransactionState>()

  const handleETHSendClick = () => {
    const newTransactionState = sendTransaction({
      to: validAddress,
      value: formattedTokenQty
    })

    setTransactionState(newTransactionState)

    handleTransaction(
      newTransactionState.id,
      newTransactionState.isSuccess,
      newTransactionState.isLoading,
      newTransactionState.isPending,
      newTransactionState.sendIsError,
      newTransactionState.transactionIsError,
      newTransactionState.receipt,
      newTransactionState.transactionHash
    )
  }

  useEffect(() => {
    if (transactionState?.transactionHash?.hash) {
      addRecentTransaction({
        hash: String(transactionState.transactionHash.hash),
        description: 'Send ETH transaction'
      })
    }
  }, [transactionState, addRecentTransaction])

  return (
    <Button
      className="button-main"
      color="blue"
      size="4"
      onClick={handleETHSendClick}
    >
      Send {transactionState ? transactionState.id : ''}
    </Button>
  )
}

function transactionReducer(
  state: TransactionState[],
  action: TransactionAction
): TransactionState[] {
  switch (action.type) {
    case 'ADD':
      return [...state, action.transaction]
    case 'UPDATE':
      return state.map((transaction, index) =>
        index === action.index
          ? { ...transaction, ...action.transaction }
          : transaction
      )
    default:
      throw new Error()
  }
}

const useSendTransactionToasts = () => {
  const { showSuccessToast, showErrorToast, showLoadingToast } =
    useTransactionToast()
  const [transactions, dispatch] = useReducer(transactionReducer, [])
  const [toastIds, setToastIds] = useState({}) // New state variable for toastIds

  const handleTransaction = (
    id: string,
    isSuccess: boolean,
    isLoading: boolean,
    isPending: boolean,
    sendIsError: boolean,
    transactionIsError: boolean,
    receipt: TransactionReceipt | undefined,
    transactionHash: { hash: string } | undefined
  ) => {
    const existingTransactionIndex = transactions.findIndex(
      (transaction) => transaction.id === id
    )

    if (existingTransactionIndex !== -1) {
      // Update the existing transaction
      dispatch({
        type: 'UPDATE',
        index: existingTransactionIndex,
        transaction: {
          id,
          isSuccess,
          isLoading,
          isPending,
          sendIsError,
          transactionIsError,
          receipt,
          transactionHash
        }
      })
    } else {
      // Add a new transaction
      dispatch({
        type: 'ADD',
        transaction: {
          id,
          isSuccess,
          isLoading,
          isPending,
          sendIsError,
          transactionIsError,
          receipt,
          transactionHash
        }
      })
    }
  }

  useEffect(() => {
    transactions.forEach((transaction) => {
      const {
        id,
        isSuccess,
        isLoading,
        isPending,
        sendIsError,
        transactionIsError,
        receipt
      } = transaction
      let toastId = id

      if (isLoading) {
        toastId = showLoadingToast('Check wallet to send transaction', id)
      } else if (isPending) {
        toastId = showLoadingToast('Transaction processing...', id)
      } else if (isSuccess) {
        toastId = showSuccessToast('Transfer successful!', id)
        console.log('Transaction Receipt', receipt)
      } else if (sendIsError || transactionIsError) {
        toastId = showErrorToast(
          'Transaction failed - see console for info',
          id
        )
      }

      // Update the transaction state with the toastId
      setToastIds((prevToastIds) => ({ ...prevToastIds, [id]: toastId }))
    })
  }, [transactions])
  console.log('transaction array: ', transactions)

  return handleTransaction
}
